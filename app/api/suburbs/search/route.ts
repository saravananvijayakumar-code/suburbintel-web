import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  SuburbSearchSchema, 
  validateSearchParams, 
  ValidationError 
} from '@/lib/security/validation'
import { 
  withRateLimitAsync, 
  securityError,
  sanitizeInput 
} from '@/lib/security/middleware'

export async function GET(request: NextRequest) {
  // Apply rate limiting
  return withRateLimitAsync(request, 'api:search', async () => {
    try {
      const { searchParams } = new URL(request.url)
      
      // Validate and sanitize input with Zod
      let params
      try {
        params = validateSearchParams(searchParams, SuburbSearchSchema)
      } catch (error) {
        if (error instanceof ValidationError) {
          return securityError(error.message, 400)
        }
        throw error
      }
      
      const { q: query, state, limit } = params

      // Build where clause with sanitized input
      const whereClause: any = {
        OR: [
          {
            name: {
              contains: query, // Already sanitized by Zod
              mode: 'insensitive',
            },
          },
          {
            state: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            postcode: {
              contains: query,
            },
          },
        ],
      }

      // Add state filter if provided
      if (state) {
        whereClause.state = state.toUpperCase()
      }

      // Search with enforced limit (max 50)
      const suburbs = await prisma.suburbs.findMany({
        where: whereClause,
        orderBy: [
          { lastUpdated: 'desc' },
          { investmentScore: 'desc' },
        ],
        select: {
          id: true,
          name: true,
          state: true,
          postcode: true,
          medianPrice: true,
          medianUnitPrice: true,  // Separate unit/apartment price
          weeklyRent: true,
          rentalYield: true,
          growth12m: true,
          growth6m: true,
          growth3m: true,
          investmentScore: true,
          lastUpdated: true,
          dataSource: true,
          dataQuality: true,
        },
        take: Math.min(limit, 50), // Hard limit to prevent scraping
      })

      // Deduplicate by name + state (keep most recent)
      const uniqueSuburbs = new Map<string, typeof suburbs[0]>()
      for (const suburb of suburbs) {
        const key = `${suburb.name.toUpperCase()}_${suburb.state}`
        if (!uniqueSuburbs.has(key)) {
          uniqueSuburbs.set(key, suburb)
        }
      }

      // Convert back to array (limit already enforced)
      const deduplicatedSuburbs = Array.from(uniqueSuburbs.values())

      return NextResponse.json({
        success: true,
        suburbs: deduplicatedSuburbs,
        count: deduplicatedSuburbs.length,
      })
    } catch (error) {
      console.error('Error searching suburbs:', error)
      return securityError('Failed to search suburbs', 500)
    }
  })
}
