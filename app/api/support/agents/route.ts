/**
 * Support Agents API - Admin Only
 * 
 * Manage support team members
 */

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, AgentRole } from '@prisma/client'
import { z } from 'zod'
import { withRateLimitAsync, securityError } from '@/lib/security/middleware'

const prisma = new PrismaClient()

const CreateAgentSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  name: z.string().min(2),
  role: z.nativeEnum(AgentRole).optional().default('AGENT'),
})

const UpdateAgentSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.nativeEnum(AgentRole).optional(),
  isActive: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
})

// Check if user is admin
async function isAdmin(userId: string): Promise<boolean> {
  const agent = await prisma.supportAgent.findUnique({
    where: { userId },
  })
  return !!agent && agent.isActive && agent.role === 'ADMIN'
}

// GET - List all agents
export async function GET(request: NextRequest) {
  return withRateLimitAsync(request, 'api:suburbs', async () => {
    try {
      const userId = 'guest'; // Auth removed
      
      if (!userId) {
        return securityError('Authentication required', 401)
      }

      const agent = await prisma.supportAgent.findUnique({
        where: { userId },
      })

      if (!agent || !agent.isActive) {
        return securityError('Access denied', 403)
      }

      const agents = await prisma.supportAgent.findMany({
        orderBy: [
          { role: 'asc' },
          { name: 'asc' },
        ]
      })

      // Get ticket counts per agent
      const ticketCounts = await prisma.supportTicket.groupBy({
        by: ['assignedToId'],
        _count: true,
        where: {
          status: { in: ['OPEN', 'IN_PROGRESS', 'WAITING_ON_CUSTOMER'] }
        }
      })

      const ticketCountMap = new Map(
        ticketCounts.map(tc => [tc.assignedToId, tc._count])
      )

      return NextResponse.json({
        success: true,
        agents: agents.map(a => ({
          id: a.id,
          userId: a.userId,
          email: a.email,
          name: a.name,
          role: a.role,
          isActive: a.isActive,
          isAvailable: a.isAvailable,
          ticketsResolved: a.ticketsResolved,
          avgResponseTime: a.avgResponseTime,
          rating: a.rating,
          activeTickets: ticketCountMap.get(a.userId) || 0,
        })),
      })

    } catch (error: any) {
      console.error('Error listing agents:', error)
      return securityError('Failed to fetch agents', 500)
    }
  })
}

// POST - Create new agent (admin only)
export async function POST(request: NextRequest) {
  return withRateLimitAsync(request, 'api:ai', async () => {
    try {
      const userId = 'guest'; // Auth removed
      
      if (!userId) {
        return securityError('Authentication required', 401)
      }

      if (!await isAdmin(userId)) {
        return securityError('Admin access required', 403)
      }

      const body = await request.json()
      const validated = CreateAgentSchema.parse(body)

      // Check if agent already exists
      const existing = await prisma.supportAgent.findFirst({
        where: {
          OR: [
            { userId: validated.userId },
            { email: validated.email },
          ]
        }
      })

      if (existing) {
        return securityError('Agent already exists with this user ID or email', 400)
      }

      const agent = await prisma.supportAgent.create({
        data: {
          userId: validated.userId,
          email: validated.email,
          name: validated.name,
          role: validated.role,
        }
      })

      return NextResponse.json({
        success: true,
        agent: {
          id: agent.id,
          userId: agent.userId,
          email: agent.email,
          name: agent.name,
          role: agent.role,
        },
        message: `Agent ${agent.name} created successfully`,
      })

    } catch (error: any) {
      console.error('Error creating agent:', error)
      
      if (error.name === 'ZodError') {
        return securityError(error.errors[0]?.message || 'Validation error', 400)
      }
      
      return securityError('Failed to create agent', 500)
    }
  })
}

// PATCH - Update agent
export async function PATCH(request: NextRequest) {
  return withRateLimitAsync(request, 'api:ai', async () => {
    try {
      const userId = 'guest'; // Auth removed
      
      if (!userId) {
        return securityError('Authentication required', 401)
      }

      const { searchParams } = new URL(request.url)
      const agentId = searchParams.get('id')

      if (!agentId) {
        return securityError('Agent ID required', 400)
      }

      // Check if current user is admin OR updating their own availability
      const currentAgent = await prisma.supportAgent.findUnique({
        where: { userId },
      })

      const targetAgent = await prisma.supportAgent.findUnique({
        where: { id: agentId },
      })

      if (!targetAgent) {
        return securityError('Agent not found', 404)
      }

      const body = await request.json()
      const validated = UpdateAgentSchema.parse(body)

      // Only admins can change role or active status
      // Agents can only update their own availability
      const isCurrentAdmin = currentAgent?.role === 'ADMIN'
      const isUpdatingSelf = targetAgent.userId === userId

      if (!isCurrentAdmin && !isUpdatingSelf) {
        return securityError('Access denied', 403)
      }

      if (!isCurrentAdmin && (validated.role || validated.isActive !== undefined)) {
        return securityError('Only admins can change role or active status', 403)
      }

      const updatedAgent = await prisma.supportAgent.update({
        where: { id: agentId },
        data: validated,
      })

      return NextResponse.json({
        success: true,
        agent: {
          id: updatedAgent.id,
          name: updatedAgent.name,
          role: updatedAgent.role,
          isActive: updatedAgent.isActive,
          isAvailable: updatedAgent.isAvailable,
        },
      })

    } catch (error: any) {
      console.error('Error updating agent:', error)
      
      if (error.name === 'ZodError') {
        return securityError(error.errors[0]?.message || 'Validation error', 400)
      }
      
      return securityError('Failed to update agent', 500)
    }
  })
}

