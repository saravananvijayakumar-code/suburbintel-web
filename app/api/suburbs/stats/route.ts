import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRateLimitAsync } from '@/lib/security'
import { isAdmin } from '@/lib/admin'

async function handler() {
  // Require admin access for detailed stats
  const userId = 'guest'; // Auth removed
  const isAdminUser = false; // Auth removed - all requests are public

  // Skip admin-only endpoint check since auth is removed
  // Endpoint is now public

  try {
    // Get total suburb count
    const totalSuburbs = await prisma.suburbs.count()

    // Get counts by state
    const suburbsByState = await prisma.suburbs.groupBy({
      by: ['state'],
      _count: {
        state: true,
      },
    })

    // Get data quality distribution
    const dataQualityStats = await prisma.suburbs.groupBy({
      by: ['dataQuality'],
      _count: {
        dataQuality: true,
      },
    })

    // Calculate average metrics
    const averageMetrics = await prisma.suburbs.aggregate({
      _avg: {
        medianPrice: true,
        weeklyRent: true,
        rentalYield: true,
        growth12m: true,
        investmentScore: true,
      },
    })

    // Get high-quality suburb count (real government data)
    const highQualityCount = await prisma.suburbs.count({
      where: {
        dataQuality: 'high',
      },
    })

    return NextResponse.json({
      success: true,
      stats: {
        totalSuburbs,
        highQualitySuburbs: highQualityCount,
        suburbsByState: suburbsByState.reduce((acc, curr) => {
          acc[curr.state] = curr._count.state
          return acc
        }, {} as Record<string, number>),
        dataQualityDistribution: dataQualityStats.reduce((acc, curr) => {
          acc[curr.dataQuality || 'unknown'] = curr._count.dataQuality
          return acc
        }, {} as Record<string, number>),
        averageMetrics: {
          medianPrice: averageMetrics._avg.medianPrice || 0,
          weeklyRent: averageMetrics._avg.weeklyRent || 0,
          rentalYield: averageMetrics._avg.rentalYield || 0,
          growth12m: averageMetrics._avg.growth12m || 0,
          investmentScore: averageMetrics._avg.investmentScore || 0,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching suburb stats:', sanitizeForLog(error))
    return NextResponse.json(
      { success: false, error: 'Failed to fetch suburb statistics' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return withRateLimitAsync(request, { maxRequests: 60, windowMs: 60000 }, handler)
}

