/**
 * Support Tickets API - Enterprise Grade
 * 
 * Endpoints for creating and listing support tickets
 * Users can create/view their own tickets
 * Admins can view and manage all tickets
 */

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, SupportCategory, TicketPriority, TicketStatus } from '@prisma/client'
import { z } from 'zod'
import { securityError, sanitizeInput, withRateLimitAsync } from '@/lib/security/middleware'
import { isAdmin } from '@/lib/admin'
import { SecretManager } from '@/lib/secrets'

const prisma = new PrismaClient()

// Validation schemas
const CreateTicketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters').max(10000),
  category: z.nativeEnum(SupportCategory).optional().default('GENERAL'),
  priority: z.nativeEnum(TicketPriority).optional().default('MEDIUM'),
  metadata: z.object({
    browser: z.string().optional(),
    device: z.string().optional(),
    page: z.string().optional(),
    userAgent: z.string().optional(),
  }).optional(),
})

const ListTicketsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.nativeEnum(TicketStatus).optional(),
  priority: z.nativeEnum(TicketPriority).optional(),
  category: z.nativeEnum(SupportCategory).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'priority', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Generate unique ticket number
async function generateTicketNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `TKT-${year}-`
  
  // Get the highest ticket number for this year
  const lastTicket = await prisma.supportTicket.findFirst({
    where: {
      ticketNumber: {
        startsWith: prefix
      }
    },
    orderBy: {
      ticketNumber: 'desc'
    }
  })
  
  let nextNumber = 1
  if (lastTicket) {
    const lastNumber = parseInt(lastTicket.ticketNumber.replace(prefix, ''))
    nextNumber = lastNumber + 1
  }
  
  return `${prefix}${nextNumber.toString().padStart(5, '0')}`
}

// Calculate SLA deadline based on priority
function calculateSlaDeadline(priority: TicketPriority): Date {
  const now = new Date()
  const hours: Record<TicketPriority, number> = {
    CRITICAL: 1,
    URGENT: 4,
    HIGH: 8,
    MEDIUM: 24,
    LOW: 72,
  }
  now.setHours(now.getHours() + hours[priority])
  return now
}

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

// POST - Create new ticket
export async function POST(request: NextRequest) {
  try {
    const userId = 'guest'; // Auth removed
    
    if (!userId) {
      return securityError('Authentication required', 401)
    }

    // Get user details from Clerk
    const clerkResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${SecretManager.clerkSecretKey}`,
      }
    })
    
    let userEmail = 'unknown@example.com'
    let userName = 'Unknown User'
    
    if (clerkResponse.ok) {
      const clerkUser = await clerkResponse.json()
      userEmail = clerkUser.email_addresses?.[0]?.email_address || userEmail
      userName = `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim() || userName
    }

    const body = await request.json()
    const validated = CreateTicketSchema.parse(body)

    // Sanitize inputs
    const sanitizedSubject = sanitizeInput(validated.subject)
    const sanitizedDescription = sanitizeInput(validated.description)

    // Generate ticket number
    const ticketNumber = await generateTicketNumber()
    
    // Calculate SLA deadline
    const slaDeadline = calculateSlaDeadline(validated.priority)

    // Create ticket
    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        userId,
        userEmail,
        userName,
        subject: sanitizedSubject,
        description: sanitizedDescription,
        category: validated.category,
        priority: validated.priority,
        status: 'OPEN',
        slaDeadline,
        metadata: validated.metadata || {},
      },
      include: {
        messages: true,
        attachments: true,
      }
    })

    // Create initial message from user
    await prisma.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        senderId: userId,
        senderName: userName,
        senderEmail: userEmail,
        senderRole: 'USER',
        content: sanitizedDescription,
      }
    })

    // Create history entry
    await prisma.ticketHistory.create({
      data: {
        ticketId: ticket.id,
        action: 'ticket_created',
        performedBy: userId,
        performedByName: userName,
      }
    })

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        subject: ticket.subject,
        status: ticket.status,
        priority: ticket.priority,
        category: ticket.category,
        createdAt: ticket.createdAt,
        slaDeadline: ticket.slaDeadline,
      },
      message: `Support ticket ${ticketNumber} created successfully. Our team will respond within ${getPriorityTimeframe(validated.priority)}.`
    })

  } catch (error: any) {
    console.error('Error creating ticket:', error)
    
    if (error.name === 'ZodError') {
      return securityError(error.errors[0]?.message || 'Validation error', 400)
    }
    
    return securityError('Failed to create support ticket', 500)
  }
}

// GET - List tickets
export async function GET(request: NextRequest) {
  return withRateLimitAsync(request, 'api:suburbs', async () => {
    try {
      const userId = 'guest'; // Auth removed
      const user = null; // Auth removed
      
      if (!userId) {
        return securityError('Authentication required', 401)
      }

      const userEmail = user?.emailAddresses?.[0]?.emailAddress

      const { searchParams } = new URL(request.url)
      const params = Object.fromEntries(searchParams.entries())
      const validated = ListTicketsSchema.parse(params)

      const isUserAdmin = await isAdminOrAgent(userId, userEmail)

      // Build where clause
      const where: any = {}
      
      // Non-admins can only see their own tickets
      if (!isUserAdmin) {
        where.userId = userId
      }

      if (validated.status) where.status = validated.status
      if (validated.priority) where.priority = validated.priority
      if (validated.category) where.category = validated.category
      
      if (validated.search) {
        where.OR = [
          { subject: { contains: validated.search, mode: 'insensitive' } },
          { ticketNumber: { contains: validated.search, mode: 'insensitive' } },
          { description: { contains: validated.search, mode: 'insensitive' } },
        ]
      }

      // Get total count
      const total = await prisma.supportTicket.count({ where })

      // Get tickets with pagination
      const tickets = await prisma.supportTicket.findMany({
        where,
        orderBy: {
          [validated.sortBy]: validated.sortOrder
        },
        skip: (validated.page - 1) * validated.limit,
        take: validated.limit,
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: {
            select: {
              messages: true,
              attachments: true,
            }
          }
        }
      })

      // Get stats for admin dashboard
      let stats = null
      if (isUserAdmin) {
        const [open, inProgress, resolved, urgent] = await Promise.all([
          prisma.supportTicket.count({ where: { status: 'OPEN' } }),
          prisma.supportTicket.count({ where: { status: 'IN_PROGRESS' } }),
          prisma.supportTicket.count({ where: { status: 'RESOLVED' } }),
          prisma.supportTicket.count({ where: { priority: { in: ['URGENT', 'CRITICAL'] }, status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
        ])
        stats = { open, inProgress, resolved, urgent, total }
      }

      return NextResponse.json({
        success: true,
        tickets: tickets.map(t => ({
          id: t.id,
          ticketNumber: t.ticketNumber,
          subject: t.subject,
          category: t.category,
          priority: t.priority,
          status: t.status,
          userName: t.userName,
          userEmail: t.userEmail,
          assignedToName: t.assignedToName,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
          slaDeadline: t.slaDeadline,
          slaBreach: t.slaBreach,
          lastMessage: t.messages[0]?.content?.substring(0, 100) || null,
          messageCount: t._count.messages,
          attachmentCount: t._count.attachments,
        })),
        pagination: {
          page: validated.page,
          limit: validated.limit,
          total,
          totalPages: Math.ceil(total / validated.limit),
        },
        stats,
        isAdmin: isUserAdmin,
      })

    } catch (error: any) {
      console.error('Error listing tickets:', error)
      return securityError('Failed to fetch tickets', 500)
    }
  })
}

function getPriorityTimeframe(priority: TicketPriority): string {
  const timeframes: Record<TicketPriority, string> = {
    CRITICAL: '1 hour',
    URGENT: '4 hours',
    HIGH: '8 hours',
    MEDIUM: '24 hours',
    LOW: '72 hours',
  }
  return timeframes[priority]
}

