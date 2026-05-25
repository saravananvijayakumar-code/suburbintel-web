import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  // Require authentication for analytics
  const userId = 'guest'; // Auth removed
  

  try {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get('state')
    const timeRange = searchParams.get('range') || '12m'

    // Get all suburbs
    const suburbs = await prisma.suburbs.findMany({
      where: state ? { state } : {},
      include: {
        price_history: {
          orderBy: { month: 'desc' },
          take: timeRange === '12m' ? 12 : timeRange === '6m' ? 6 : 3
        }
      }
    })

    if (suburbs.length === 0) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 })
    }

    // Calculate market statistics
    const totalSuburbs = suburbs.length
    const avgMedianPrice = suburbs.reduce((sum: number, s: any) => sum + (s.medianPrice || 0), 0) / totalSuburbs
    const avgGrowth = suburbs.reduce((sum: number, s: any) => sum + (s.growth12m || 0), 0) / totalSuburbs
    const avgYield = suburbs.reduce((sum: number, s: any) => sum + (s.rentalYield || 0), 0) / totalSuburbs

    // Price distribution
    const priceRanges = [
      { range: '$0-$300k', min: 0, max: 300000, count: 0 },
      { range: '$300k-$500k', min: 300000, max: 500000, count: 0 },
      { range: '$500k-$700k', min: 500000, max: 700000, count: 0 },
      { range: '$700k+', min: 700000, max: Infinity, count: 0 }
    ]

    suburbs.forEach((s: any) => {
      const price = s.medianPrice || 0
      priceRanges.forEach(range => {
        if (price >= range.min && price < range.max) {
          range.count++
        }
      })
    })

    // Growth leaders
    const growthLeaders = suburbs
      .sort((a: any, b: any) => (b.growth12m || 0) - (a.growth12m || 0))
      .slice(0, 10)
      .map((s: any) => ({
        name: s.name,
        state: s.state,
        growth: s.growth12m,
        price: s.medianPrice
      }))

    // Yield leaders
    const yieldLeaders = suburbs
      .sort((a: any, b: any) => (b.rentalYield || 0) - (a.rentalYield || 0))
      .slice(0, 10)
      .map((s: any) => ({
        name: s.name,
        state: s.state,
        yield: s.rentalYield,
        price: s.medianPrice
      }))

    // State comparison
    const stateStats: any = {}
    suburbs.forEach((s: any) => {
      if (!stateStats[s.state]) {
        stateStats[s.state] = {
          count: 0,
          avgPrice: 0,
          avgGrowth: 0,
          avgYield: 0,
          totalPrice: 0,
          totalGrowth: 0,
          totalYield: 0
        }
      }
      const state = stateStats[s.state]
      state.count++
      state.totalPrice += s.medianPrice || 0
      state.totalGrowth += s.growth12m || 0
      state.totalYield += s.rentalYield || 0
    })

    Object.keys(stateStats).forEach(state => {
      const stats = stateStats[state]
      stats.avgPrice = Math.round(stats.totalPrice / stats.count)
      stats.avgGrowth = (stats.totalGrowth / stats.count).toFixed(2)
      stats.avgYield = (stats.totalYield / stats.count).toFixed(2)
      delete stats.totalPrice
      delete stats.totalGrowth
      delete stats.totalYield
    })

    // Market trends over time
    const monthlyTrends: any = {}
    suburbs.forEach((s: any) => {
      s.priceHistory.forEach((h: any) => {
        const month = h.month.toISOString().slice(0, 7)
        if (!monthlyTrends[month]) {
          monthlyTrends[month] = {
            month,
            avgPrice: 0,
            count: 0,
            totalPrice: 0
          }
        }
        monthlyTrends[month].totalPrice += h.medianPrice
        monthlyTrends[month].count++
      })
    })

    const trends = Object.values(monthlyTrends)
      .map((t: any) => ({
        month: t.month,
        avgPrice: Math.round(t.totalPrice / t.count)
      }))
      .sort((a: any, b: any) => a.month.localeCompare(b.month))

    return NextResponse.json({
      success: true,
      summary: {
        totalSuburbs,
        avgMedianPrice: Math.round(avgMedianPrice),
        avgGrowth: avgGrowth.toFixed(2),
        avgYield: avgYield.toFixed(2),
        timeRange
      },
      priceDistribution: priceRanges,
      growthLeaders,
      yieldLeaders,
      stateComparison: stateStats,
      marketTrends: trends,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to generate analytics' }, { status: 500 })
  }
}

