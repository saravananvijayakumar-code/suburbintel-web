/**
 * Ticket Messages API
 * 
 * POST - Add reply to ticket
 * Users and admins can both reply
 * Admins can add internal notes
 */

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { withRateLimitAsync, securityError, sanitizeInput } from '@/lib/security/middleware'
import { isAdmin } from '@/lib/admin'
import { SecretManager } from '@/lib/secrets'

const prisma = new PrismaClient()

const AddMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(10000),
  isInternal: z.boolean().optional().default(false),
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

// POST - Add reply to ticket
export async function POST(
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

      // Get ticket
      const ticket = await prisma.supportTicket.findUnique({
        where: { id: ticketId },
      })

      if (!ticket) {
        return securityError('Ticket not found', 404)
      }

      // Check access
      if (!isUserAdmin && ticket.userId !== userId) {
        return securityError('Access denied', 403)
      }

      // Can't reply to closed tickets
      if (ticket.status === 'CLOSED') {
        return securityError('Cannot reply to closed tickets', 400)
      }

      const body = await request.json()
      const validated = AddMessageSchema.parse(body)

      // Only admins can add internal notes
      if (validated.isInternal && !isUserAdmin) {
        return securityError('Only support staff can add internal notes', 403)
      }

      // Get sender details
      let senderName = 'Unknown User'
      let senderEmail = 'unknown@example.com'
      
      if (isUserAdmin) {
        const agent = await prisma.supportAgent.findUnique({
          where: { userId },
        })
        if (agent) {
          senderName = agent.name
          senderEmail = agent.email
        } else {
          // Admin from admin list, get from Clerk
          const clerkResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
            headers: {
              'Authorization': `Bearer ${SecretManager.clerkSecretKey}`,
            }
          })
          if (clerkResponse.ok) {
            const clerkUser = await clerkResponse.json()
            senderEmail = clerkUser.email_addresses?.[0]?.email_address || senderEmail
            senderName = `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim() || 'Admin'
          }
        }
      } else {
        // Get from Clerk
        const clerkResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${SecretManager.clerkSecretKey}`,
          }
        })
        
        if (clerkResponse.ok) {
          const clerkUser = await clerkResponse.json()
          senderEmail = clerkUser.email_addresses?.[0]?.email_address || senderEmail
          senderName = `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim() || senderName
        }
      }

      // Create message
      const message = await prisma.ticketMessage.create({
        data: {
          ticketId,
          senderId: userId,
          senderName,
          senderEmail,
          senderRole: isUserAdmin ? 'AGENT' : 'USER',
          content: sanitizeInput(validated.content),
          isInternal: validated.isInternal,
        }
      })

      // Update ticket status and timestamps
      const updateData: any = {
        updatedAt: new Date(),
      }

      if (isUserAdmin) {
        // Admin reply
        if (!ticket.firstResponseAt) {
          updateData.firstResponseAt = new Date()
        }
        
        // If ticket was waiting on support, mark as in progress
        if (ticket.status === 'OPEN' || ticket.status === 'REOPENED') {
          updateData.status = 'IN_PROGRESS'
        }
        
        // If admin replies, mark as waiting on customer (unless internal note)
        if (!validated.isInternal) {
          updateData.status = 'WAITING_ON_CUSTOMER'
        }
      } else {
        // User reply
        // If ticket was waiting on customer, mark as in progress
        if (ticket.status === 'WAITING_ON_CUSTOMER') {
          updateData.status = 'IN_PROGRESS'
        }
        
        // If ticket was resolved/closed and user replies, reopen
        if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') {
          updateData.status = 'REOPENED'
          updateData.resolvedAt = null
          updateData.closedAt = null
        }
      }

      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: updateData,
      })

      // Create history entry
      await prisma.ticketHistory.create({
        data: {
          ticketId,
          action: validated.isInternal ? 'internal_note_added' : 'reply_added',
          performedBy: userId,
          performedByName: senderName,
        }
      })

      return NextResponse.json({
        success: true,
        message: {
          id: message.id,
          content: message.content,
          senderName: message.senderName,
          senderRole: message.senderRole,
          isInternal: message.isInternal,
          createdAt: message.createdAt,
        }
      })

    } catch (error: any) {
      console.error('Error adding message:', error)
      
      if (error.name === 'ZodError') {
        return securityError(error.errors[0]?.message || 'Validation error', 400)
      }
      
      return securityError('Failed to add message', 500)
    }
  })
}

// GET - Get all messages for a ticket
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  return withRateLimitAsync(request, 'api:suburbs', async () => {
    try {
      const userId = 'guest'; // Auth removed
      
      if (!userId) {
        return securityError('Authentication required', 401)
      }

      const { ticketId } = await params
      const isAdmin = await isAdminOrAgent(userId)

      // Get ticket
      const ticket = await prisma.supportTicket.findUnique({
        where: { id: ticketId },
      })

      if (!ticket) {
        return securityError('Ticket not found', 404)
      }

      // Check access
      if (!isAdmin && ticket.userId !== userId) {
        return securityError('Access denied', 403)
      }

      // Get messages (hide internal notes from users)
      const messages = await prisma.ticketMessage.findMany({
        where: {
          ticketId,
          ...(isAdmin ? {} : { isInternal: false }),
        },
        orderBy: { createdAt: 'asc' },
        include: {
          attachments: true,
        }
      })

      return NextResponse.json({
        success: true,
        messages: messages.map(m => ({
          id: m.id,
          content: m.content,
          senderName: m.senderName,
          senderRole: m.senderRole,
          isInternal: m.isInternal,
          createdAt: m.createdAt,
          attachments: m.attachments,
        })),
        isAdmin,
      })

    } catch (error: any) {
      console.error('Error fetching messages:', error)
      return securityError('Failed to fetch messages', 500)
    }
  })
}
