/**
 * Single Ticket API - View, Update, Close
 * 
 * GET - View ticket details with messages
 * PATCH - Update ticket (status, priority, assignment)
 * DELETE - Close/Delete ticket (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, TicketPriority, TicketStatus } from '@prisma/client'
import { z } from 'zod'
import { withRateLimitAsync, securityError } from '@/lib/security/middleware'
import { isAdmin } from '@/lib/admin'

const prisma = new PrismaClient()

const UpdateTicketSchema = z.object({
  status: z.nativeEnum(TicketStatus).optional(),
  priority: z.nativeEnum(TicketPriority).optional(),
  assignedToId: z.string().optional(),
  assignedToName: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

// Check if user is admin/support agent
async function isAdminOrAgent(userId: string, userEmail?: string | null): Promise<boolean> {
  // First check if user is in admin list
  if (userEmail && isAdmin(userEmail)) {
    return true
  }
  
  // Then check support agent table
  const agent = await prisma.supportAgent.findUnique({
    where: { userId },
  })
  return !!agent && agent.isActive
}

// GET - View ticket details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  return withRateLimitAsync(request, 'api:suburbs', async () => {
    try {
      const userId = 'guest'; // Auth removed
      const user = null; // Auth removed
      
      if (!userId) {
        return securityError('Authentication required', 401)
      }

      const userEmail = user?.emailAddresses?.[0]?.emailAddress
      const { ticketId } = await params
      const isUserAdmin = await isAdminOrAgent(userId, userEmail)

      const ticket = await prisma.supportTicket.findUnique({
        where: { id: ticketId },
        include: {
          messages: {
            where: isUserAdmin ? {} : { isInternal: false },
            orderBy: { createdAt: 'asc' },
            include: {
              attachments: true,
            }
          },
          attachments: true,
          history: {
            orderBy: { performedAt: 'desc' },
            take: 50,
          }
        }
      })

      if (!ticket) {
        return securityError('Ticket not found', 404)
      }

      // Non-admins can only view their own tickets
      if (!isUserAdmin && ticket.userId !== userId) {
        return securityError('Access denied', 403)
      }

      return NextResponse.json({
        success: true,
        ticket: {
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          subject: ticket.subject,
          description: ticket.description,
          category: ticket.category,
          priority: ticket.priority,
          status: ticket.status,
          userId: ticket.userId,
          userName: ticket.userName,
          userEmail: ticket.userEmail,
          assignedToId: ticket.assignedToId,
          assignedToName: ticket.assignedToName,
          tags: ticket.tags,
          metadata: ticket.metadata,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt,
          resolvedAt: ticket.resolvedAt,
          closedAt: ticket.closedAt,
          firstResponseAt: ticket.firstResponseAt,
          slaDeadline: ticket.slaDeadline,
          slaBreach: ticket.slaBreach,
          messages: ticket.messages.map(m => ({
            id: m.id,
            content: m.content,
            senderName: m.senderName,
            senderRole: m.senderRole,
            isInternal: m.isInternal,
            createdAt: m.createdAt,
            attachments: m.attachments,
          })),
          attachments: ticket.attachments,
          history: isUserAdmin ? ticket.history : [],
        },
        isAdmin: isUserAdmin,
      })

    } catch (error: any) {
      console.error('Error fetching ticket:', error)
      return securityError('Failed to fetch ticket', 500)
    }
  })
}

// PATCH - Update ticket
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  return withRateLimitAsync(request, 'api:ai', async () => {
    try {
      const userId = 'guest'; // Auth removed
      const user = null; // Auth removed
      
      if (!userId) {
        return securityError('Authentication required', 401)
      }

      const userEmail = user?.emailAddresses?.[0]?.emailAddress
      const { ticketId } = await params
      const isUserAdmin = await isAdminOrAgent(userId, userEmail)

      const ticket = await prisma.supportTicket.findUnique({
        where: { id: ticketId },
      })

      if (!ticket) {
        return securityError('Ticket not found', 404)
      }

      // Only admins can update tickets (users can only add messages)
      if (!isUserAdmin) {
        return securityError('Only support staff can update tickets', 403)
      }

      const body = await request.json()
      const validated = UpdateTicketSchema.parse(body)

      // Get agent name
      const agent = await prisma.supportAgent.findUnique({
        where: { userId },
      })
      const agentName = agent?.name || 'Unknown'

      // Track changes for history
      const changes: Array<{ field: string; oldValue: string; newValue: string }> = []

      if (validated.status && validated.status !== ticket.status) {
        changes.push({
          field: 'status',
          oldValue: ticket.status,
          newValue: validated.status,
        })
      }

      if (validated.priority && validated.priority !== ticket.priority) {
        changes.push({
          field: 'priority',
          oldValue: ticket.priority,
          newValue: validated.priority,
        })
      }

      if (validated.assignedToId && validated.assignedToId !== ticket.assignedToId) {
        changes.push({
          field: 'assignedTo',
          oldValue: ticket.assignedToName || 'Unassigned',
          newValue: validated.assignedToName || 'Unknown',
        })
      }

      // Build update data
      const updateData: any = {}
      
      if (validated.status) {
        updateData.status = validated.status
        if (validated.status === 'RESOLVED') {
          updateData.resolvedAt = new Date()
        }
        if (validated.status === 'CLOSED') {
          updateData.closedAt = new Date()
        }
      }
      
      if (validated.priority) {
        updateData.priority = validated.priority
      }
      
      if (validated.assignedToId !== undefined) {
        updateData.assignedToId = validated.assignedToId
        updateData.assignedToName = validated.assignedToName
      }
      
      if (validated.tags) {
        updateData.tags = validated.tags
      }

      // Update ticket
      const updatedTicket = await prisma.supportTicket.update({
        where: { id: ticketId },
        data: updateData,
      })

      // Create history entries
      for (const change of changes) {
        await prisma.ticketHistory.create({
          data: {
            ticketId,
            action: `${change.field}_changed`,
            field: change.field,
            oldValue: change.oldValue,
            newValue: change.newValue,
            performedBy: userId,
            performedByName: agentName,
          }
        })
      }

      return NextResponse.json({
        success: true,
        ticket: {
          id: updatedTicket.id,
          ticketNumber: updatedTicket.ticketNumber,
          status: updatedTicket.status,
          priority: updatedTicket.priority,
          assignedToName: updatedTicket.assignedToName,
          updatedAt: updatedTicket.updatedAt,
        },
        changes,
      })

    } catch (error: any) {
      console.error('Error updating ticket:', error)
      
      if (error.name === 'ZodError') {
        return securityError(error.errors[0]?.message || 'Validation error', 400)
      }
      
      return securityError('Failed to update ticket', 500)
    }
  })
}

// DELETE - Close ticket (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  return withRateLimitAsync(request, 'api:ai', async () => {
    try {
      const userId = 'guest'; // Auth removed
      
      if (!userId) {
        return securityError('Authentication required', 401)
      }

      const { ticketId } = await params
      const isAdmin = await isAdminOrAgent(userId)

      if (!isAdmin) {
        return securityError('Only support staff can close tickets', 403)
      }

      const ticket = await prisma.supportTicket.findUnique({
        where: { id: ticketId },
      })

      if (!ticket) {
        return securityError('Ticket not found', 404)
      }

      // Get agent name
      const agent = await prisma.supportAgent.findUnique({
        where: { userId },
      })

      // Soft delete - just mark as closed
      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: {
          status: 'CLOSED',
          closedAt: new Date(),
        }
      })

      // Create history entry
      await prisma.ticketHistory.create({
        data: {
          ticketId,
          action: 'ticket_closed',
          performedBy: userId,
          performedByName: agent?.name || 'Support Agent',
        }
      })

      return NextResponse.json({
        success: true,
        message: `Ticket ${ticket.ticketNumber} has been closed`,
      })

    } catch (error: any) {
      console.error('Error closing ticket:', error)
      return securityError('Failed to close ticket', 500)
    }
  })
}
