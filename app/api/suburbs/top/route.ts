import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { validateSearchParams, ValidationError, sanitizeForLog, withRateLimit } from '@/lib/security'

// Validation schema for query params
const TopSuburbsSchema = z.object({
  state: z.enum(['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT']),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  sortBy: z.enum(['investmentScore', 'growth12m', 'rentalYield', 'medianPrice']).default('investmentScore'),
})

// Data quality is now stored in the database - no hardcoded overrides

async function handler(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Validate and sanitize params
    const { state, limit, sortBy } = validateSearchParams(searchParams, TopSuburbsSchema)

    // Build order by clause based on sortBy parameter
    let orderBy: any = { investmentScore: 'desc' }
    
    switch (sortBy) {
      case 'growth12m':
        orderBy = { growth12m: 'desc' }
        break
      case 'rentalYield':
        orderBy = { rentalYield: 'desc' }
        break
      case 'medianPrice':
        orderBy = { medianPrice: 'asc' } // Ascending for price (cheapest first)
        break
      default:
        orderBy = { investmentScore: 'desc' }
    }

    // Fetch top suburbs for the state with quality filtering
    const suburbs = await prisma.suburbs.findMany({
      where: {
        state: {
          equals: state,
          mode: 'insensitive',
        },
        medianPrice: { 
          not: null,
          gte: 100000, // Minimum realistic price
        },
        rentalYield: {
          not: null,
          gte: 1, // Minimum realistic yield
        },
        growth12m: {
          not: null,
        },
        investmentScore: {
          not: null,
          gte: 50, // Only show suburbs with decent scores
        },
      },
      orderBy: [
        orderBy,
        { lastUpdated: 'desc' },
      ],
      take: limit,
      select: {
        id: true,
        name: true,
        state: true,
        postcode: true,
        medianPrice: true,
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
    })

    // Return suburbs with database data quality (no hardcoded overrides)
    return NextResponse.json({
      success: true,
      suburbs: suburbs,
      count: suburbs.length,
      state: state,
      sortBy: sortBy,
    })
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, error: 'Invalid parameters', details: error.message, suburbs: [] },
        { status: 400 }
      )
    }
    
    console.error('Error fetching top suburbs:', sanitizeForLog(error))
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch top suburbs',
        suburbs: [],
      },
      { status: 500 }
    )
  }
}

export const GET = withRateLimit(handler, { maxRequests: 60, windowMs: 60000 })
