import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { calculateInvestmentScore } from '@/lib/scoring'

/**
 * Comprehensive Data Refresh API
 * Recalculates all investment scores with advanced AI algorithm
 * Updates all suburb data with latest calculations
 * 
 * Usage: 
 * - Manual: POST /api/cron/refresh-calculations
 * - Scheduled: Set up cron job to hit this endpoint daily
 */

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    console.log('🔄 Starting comprehensive data refresh...')
    
    // Verify authorization (use cron secret in production)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'dev-secret-123'
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // 1. Fetch all suburbs with required data
    console.log('📊 Fetching all suburbs...')
    const suburbs = await db.suburb.findMany({
      where: {
        medianPrice: { not: null },
        weeklyRent: { not: null },
        rentalYield: { not: null },
        growth12m: { not: null },
      },
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
      },
    })
    
    console.log(`✅ Found ${suburbs.length} suburbs to process`)
    
    // 2. Recalculate investment scores
    console.log('🧮 Recalculating investment scores with advanced AI algorithm...')
    
    let updatedCount = 0
    let improvedCount = 0
    let decreasedCount = 0
    let unchangedCount = 0
    
    const updates = []
    
    for (const suburb of suburbs) {
      const oldScore = suburb.investmentScore || 0
      
      // Calculate new score with advanced algorithm
      const scoreBreakdown = calculateInvestmentScore({
        medianPrice: suburb.medianPrice!,
        weeklyRent: suburb.weeklyRent!,
        rentalYield: suburb.rentalYield!,
        priceGrowth12m: suburb.growth12m!,
        priceGrowth6m: suburb.growth6m || undefined,
        priceGrowth3m: suburb.growth3m || undefined,
        state: suburb.state,
      })
      
      const newScore = scoreBreakdown.totalScore
      
      // Track changes
      if (newScore > oldScore) improvedCount++
      else if (newScore < oldScore) decreasedCount++
      else unchangedCount++
      
      // Prepare update
      updates.push({
        where: { id: suburb.id },
        data: {
          investmentScore: newScore,
          lastUpdated: new Date(),
        },
      })
    }
    
    // 3. Batch update in database
    console.log('💾 Updating database...')
    
    // Process in batches of 100 to avoid overwhelming database
    const batchSize = 100
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize)
      
      await Promise.all(
        batch.map(update =>
          db.suburb.update(update)
        )
      )
      
      updatedCount += batch.length
      console.log(`   Updated ${updatedCount}/${updates.length} suburbs...`)
    }
    
    // 4. Calculate statistics
    const stats = await db.suburb.aggregate({
      _avg: { investmentScore: true },
      _min: { investmentScore: true },
      _max: { investmentScore: true },
    })
    
    // 5. Count score distribution
    const distribution = {
      excellent: await db.suburb.count({ where: { investmentScore: { gte: 80 } } }),
      veryGood: await db.suburb.count({ where: { investmentScore: { gte: 70, lt: 80 } } }),
      good: await db.suburb.count({ where: { investmentScore: { gte: 60, lt: 70 } } }),
      fair: await db.suburb.count({ where: { investmentScore: { gte: 50, lt: 60 } } }),
      belowAverage: await db.suburb.count({ where: { investmentScore: { gte: 40, lt: 50 } } }),
      poor: await db.suburb.count({ where: { investmentScore: { lt: 40 } } }),
    }
    
    const duration = Date.now() - startTime
    
    console.log('✅ Data refresh completed!')
    console.log(`   Duration: ${(duration / 1000).toFixed(2)}s`)
    console.log(`   Updated: ${updatedCount} suburbs`)
    console.log(`   Improved: ${improvedCount}`)
    console.log(`   Decreased: ${decreasedCount}`)
    console.log(`   Unchanged: ${unchangedCount}`)
    console.log(`   Avg Score: ${stats._avg.investmentScore?.toFixed(1)}`)
    console.log(`   Score Range: ${stats._min.investmentScore} - ${stats._max.investmentScore}`)
    
    return NextResponse.json({
      success: true,
      message: 'Data refresh completed successfully',
      stats: {
        totalProcessed: updatedCount,
        improved: improvedCount,
        decreased: decreasedCount,
        unchanged: unchangedCount,
        averageScore: stats._avg.investmentScore,
        minScore: stats._min.investmentScore,
        maxScore: stats._max.investmentScore,
        distribution,
        durationMs: duration,
      },
    })
    
  } catch (error: any) {
    console.error('❌ Error during data refresh:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Data refresh failed',
        details: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to check refresh status
 */
export async function GET(request: NextRequest) {
  try {
    const stats = await db.suburb.aggregate({
      _count: true,
      _avg: { investmentScore: true },
      _min: { investmentScore: true },
      _max: { investmentScore: true },
    })
    
    const lastUpdated = await db.suburb.findFirst({
      orderBy: { lastUpdated: 'desc' },
      select: { lastUpdated: true },
    })
    
    return NextResponse.json({
      success: true,
      stats: {
        totalSuburbs: stats._count,
        averageScore: stats._avg.investmentScore,
        scoreRange: {
          min: stats._min.investmentScore,
          max: stats._max.investmentScore,
        },
        lastRefreshed: lastUpdated?.lastUpdated,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
