/**
 * Canned Responses API
 * 
 * Quick reply templates for support agents
 */

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, SupportCategory } from '@prisma/client'
import { z } from 'zod'
import { withRateLimitAsync, securityError, sanitizeInput } from '@/lib/security/middleware'

const prisma = new PrismaClient()

const CannedResponseSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10).max(5000),
  category: z.nativeEnum(SupportCategory).optional(),
  shortcut: z.string().max(20).optional(),
})

// Check if user is support agent
async function isAgent(userId: string): Promise<boolean> {
  const agent = await prisma.supportAgent.findUnique({
    where: { userId },
  })
  return !!agent && agent.isActive
}

// GET - List canned responses
export async function GET(request: NextRequest) {
  return withRateLimitAsync(request, 'api:suburbs', async () => {
    try {
      const userId = 'guest'; // Auth removed
      
      if (!userId) {
        return securityError('Authentication required', 401)
      }

      if (!await isAgent(userId)) {
        return securityError('Access denied', 403)
      }

      const { searchParams } = new URL(request.url)
      const category = searchParams.get('category') as SupportCategory | null

      const responses = await prisma.cannedResponse.findMany({
        where: {
          isActive: true,
          ...(category ? { category } : {}),
        },
        orderBy: [
          { usageCount: 'desc' },
          { title: 'asc' },
        ]
      })

      return NextResponse.json({
        success: true,
        responses: responses.map(r => ({
          id: r.id,
          title: r.title,
          content: r.content,
          category: r.category,
          shortcut: r.shortcut,
          usageCount: r.usageCount,
        })),
      })

    } catch (error: any) {
      console.error('Error listing canned responses:', error)
      return securityError('Failed to fetch responses', 500)
    }
  })
}

// POST - Create canned response
export async function POST(request: NextRequest) {
  return withRateLimitAsync(request, 'api:ai', async () => {
    try {
      const userId = 'guest'; // Auth removed
      
      if (!userId) {
        return securityError('Authentication required', 401)
      }

      if (!await isAgent(userId)) {
        return securityError('Access denied', 403)
      }

      const body = await request.json()
      const validated = CannedResponseSchema.parse(body)

      // Check shortcut uniqueness
      if (validated.shortcut) {
        const existing = await prisma.cannedResponse.findUnique({
          where: { shortcut: validated.shortcut },
        })
        if (existing) {
          return securityError('Shortcut already in use', 400)
        }
      }

      const response = await prisma.cannedResponse.create({
        data: {
          title: sanitizeInput(validated.title),
          content: validated.content, // Allow HTML for rich formatting
          category: validated.category,
          shortcut: validated.shortcut,
          createdBy: userId,
        }
      })

      return NextResponse.json({
        success: true,
        response: {
          id: response.id,
          title: response.title,
          shortcut: response.shortcut,
        },
        message: 'Canned response created successfully',
      })

    } catch (error: any) {
      console.error('Error creating canned response:', error)
      
      if (error.name === 'ZodError') {
        return securityError(error.errors[0]?.message || 'Validation error', 400)
      }
      
      return securityError('Failed to create response', 500)
    }
  })
}

// PATCH - Update usage count (when response is used)
export async function PATCH(request: NextRequest) {
  return withRateLimitAsync(request, 'api:suburbs', async () => {
    try {
      const userId = 'guest'; // Auth removed
      
      if (!userId) {
        return securityError('Authentication required', 401)
      }

      if (!await isAgent(userId)) {
        return securityError('Access denied', 403)
      }

      const { searchParams } = new URL(request.url)
      const responseId = searchParams.get('id')

      if (!responseId) {
        return securityError('Response ID required', 400)
      }

      await prisma.cannedResponse.update({
        where: { id: responseId },
        data: {
          usageCount: { increment: 1 }
        }
      })

      return NextResponse.json({ success: true })

    } catch (error: any) {
      console.error('Error updating response usage:', error)
      return securityError('Failed to update response', 500)
    }
  })
}

// DELETE - Deactivate canned response
export async function DELETE(request: NextRequest) {
  return withRateLimitAsync(request, 'api:ai', async () => {
    try {
      const userId = 'guest'; // Auth removed
      
      if (!userId) {
        return securityError('Authentication required', 401)
      }

      if (!await isAgent(userId)) {
        return securityError('Access denied', 403)
      }

      const { searchParams } = new URL(request.url)
      const responseId = searchParams.get('id')

      if (!responseId) {
        return securityError('Response ID required', 400)
      }

      await prisma.cannedResponse.update({
        where: { id: responseId },
        data: { isActive: false }
      })

      return NextResponse.json({
        success: true,
        message: 'Canned response deactivated',
      })

    } catch (error: any) {
      console.error('Error deleting canned response:', error)
      return securityError('Failed to delete response', 500)
    }
  })
}

