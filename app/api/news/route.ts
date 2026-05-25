import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  NewsQuerySchema,
  NewsCreateSchema,
  validateSearchParams,
  validateBody,
  ValidationError 
} from '@/lib/security/validation'
import { 
  withRateLimitAsync,
  securityError,
  requireAdmin,
  sanitizeInput
} from '@/lib/security/middleware'

export async function GET(request: NextRequest) {
  // Apply rate limiting for public endpoint
  return withRateLimitAsync(request, 'api:suburbs', async () => {
    try {
      // Validate query params
      const { searchParams } = new URL(request.url)
      let params
      try {
        params = validateSearchParams(searchParams, NewsQuerySchema)
      } catch (error) {
        if (error instanceof ValidationError) {
          return securityError(error.message, 400)
        }
        throw error
      }
      
      const { state, category, suburb, limit } = params

      const where: any = {}
      
      if (state) where.state = state
      if (category) where.category = category
      if (suburb) {
        where.suburbs = {
          has: suburb
        }
      }

      const news = await prisma.property_news.findMany({
        where,
        orderBy: {
          publishedAt: 'desc'
        },
        take: Math.min(limit, 50) // Hard limit
      })

      const stats = await prisma.property_news.groupBy({
        by: ['category'],
        _count: true,
        where: state ? { state } : undefined
      })

      return NextResponse.json({
        success: true,
        news,
        stats: stats.map(s => ({
          category: s.category,
          count: s._count
        })),
        total: news.length
      })

    } catch (error: any) {
      console.error('Error fetching news:', error)
      return securityError('Failed to fetch news', 500)
    }
  })
}

// PROTECTED: Only admins can create news
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const adminCheck = await requireAdmin(request)
    if (adminCheck) return adminCheck // Returns error response if not admin
    
    // Validate request body
    let body
    try {
      body = await validateBody(request, NewsCreateSchema)
    } catch (error) {
      if (error instanceof ValidationError) {
        return securityError(error.message, 400)
      }
      throw error
    }

    const {
      title,
      description,
      content,
      source,
      sourceUrl,
      publishedAt,
      category,
      state,
      suburbs,
      impactType,
      impactScore,
      tags,
      imageUrl
    } = body

    const news = await prisma.property_news.create({
      data: {
        title,
        description,
        content,
        source,
        sourceUrl,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        category,
        state,
        suburbs: suburbs || [],
        impactType,
        impactScore: impactScore || 5,
        tags: tags || [],
        imageUrl
      }
    })

    return NextResponse.json({
      success: true,
      news
    })

  } catch (error: any) {
    console.error('Error creating news:', error)
    return securityError('Failed to create news', 500)
  }
}
