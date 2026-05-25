import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔍 Fetching market insights...')
    console.log('📊 Prisma client available:', !!prisma)
    console.log('📊 prisma.suburbs available:', !!prisma?.suburbs)
    
    if (!prisma) {
      console.error('❌ Prisma client is undefined!')
      return NextResponse.json(
        { success: false, error: 'Database connection not available' },
        { status: 500 }
      )
    }
    
    // Get all suburbs with required data
    const suburbs = await prisma.suburbs.findMany({
      where: {
        medianPrice: { not: null },
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
        population: true,
        medianAge: true,
        medianIncome: true,
        investmentScore: true,
        growthScore: true,
        affordabilityScore: true,
        lifestyleScore: true,
        dataSource: true,
        dataQuality: true,
      },
    })

    // Calculate state-by-state statistics
    const stateStats = suburbs.reduce((acc: any, suburb) => {
      if (!acc[suburb.state]) {
        acc[suburb.state] = {
          state: suburb.state,
          count: 0,
          totalPrice: 0,
          totalRent: 0,
          totalYield: 0,
          totalGrowth: 0,
          suburbs: [],
        }
      }
      
      acc[suburb.state].count++
      acc[suburb.state].totalPrice += suburb.medianPrice || 0
      acc[suburb.state].totalRent += suburb.weeklyRent || 0
      acc[suburb.state].totalYield += suburb.rentalYield || 0
      acc[suburb.state].totalGrowth += suburb.growth12m || 0
      acc[suburb.state].suburbs.push(suburb)
      
      return acc
    }, {})

    const stateSummary = Object.values(stateStats).map((stat: any) => ({
      state: stat.state,
      suburbCount: stat.count,
      avgMedianPrice: Math.round(stat.totalPrice / stat.count),
      avgWeeklyRent: Math.round(stat.totalRent / stat.count),
      avgRentalYield: Number((stat.totalYield / stat.count).toFixed(2)),
      avgGrowth12m: Number((stat.totalGrowth / stat.count).toFixed(2)),
      minPrice: Math.min(...stat.suburbs.map((s: any) => s.medianPrice || 0)),
      maxPrice: Math.max(...stat.suburbs.map((s: any) => s.medianPrice || 0)),
    }))

    // Find affordability hotspots (low price, high growth, good yield)
    const affordableHotspots = suburbs
      .filter((s) => s.medianPrice && s.medianPrice < 600000 && s.growth12m && s.growth12m > 5 && s.rentalYield && s.rentalYield > 4)
      .sort((a, b) => (b.investmentScore || 0) - (a.investmentScore || 0))
      .slice(0, 10)
      .map((s) => ({
        name: s.name,
        state: s.state,
        postcode: s.postcode,
        medianPrice: s.medianPrice,
        growth12m: s.growth12m,
        rentalYield: s.rentalYield,
        investmentScore: s.investmentScore,
      }))

    // Best rental yields by state (top 10 per state)
    const bestYieldsByState = Object.entries(stateStats).map(([state, data]: [string, any]) => {
      const topYields = data.suburbs
        .filter((s: any) => s.rentalYield)
        .sort((a: any, b: any) => (b.rentalYield || 0) - (a.rentalYield || 0))
        .slice(0, 10) // Top 10 per state
        .map((s: any) => ({
          name: s.name,
          postcode: s.postcode,
          rentalYield: s.rentalYield,
          medianPrice: s.medianPrice,
          weeklyRent: s.weeklyRent,
        }))
      
      return {
        state,
        topSuburbs: topYields,
      }
    })

    // Growth leaders vs laggards
    const growthLeaders = suburbs
      .filter((s) => s.growth12m !== null)
      .sort((a, b) => (b.growth12m || 0) - (a.growth12m || 0))
      .slice(0, 10)
      .map((s) => ({
        name: s.name,
        state: s.state,
        postcode: s.postcode,
        medianPrice: s.medianPrice,
        growth12m: s.growth12m,
        growth6m: s.growth6m,
        growth3m: s.growth3m,
      }))

    const growthLaggards = suburbs
      .filter((s) => s.growth12m !== null)
      .sort((a, b) => (a.growth12m || 0) - (b.growth12m || 0))
      .slice(0, 10)
      .map((s) => ({
        name: s.name,
        state: s.state,
        postcode: s.postcode,
        medianPrice: s.medianPrice,
        growth12m: s.growth12m,
      }))

    // Investment opportunities (balanced score across metrics)
    const investmentOpportunities = suburbs
      .filter((s) => s.investmentScore && s.investmentScore > 60)
      .sort((a, b) => (b.investmentScore || 0) - (a.investmentScore || 0))
      .slice(0, 15)
      .map((s) => ({
        name: s.name,
        state: s.state,
        postcode: s.postcode,
        medianPrice: s.medianPrice,
        growth12m: s.growth12m,
        rentalYield: s.rentalYield,
        investmentScore: s.investmentScore,
        growthScore: s.growthScore,
        affordabilityScore: s.affordabilityScore,
        lifestyleScore: s.lifestyleScore,
      }))

    // Calculate national statistics
    const nationalStats = {
      totalSuburbs: suburbs.length,
      avgMedianPrice: Math.round(suburbs.reduce((sum, s) => sum + (s.medianPrice || 0), 0) / suburbs.length),
      avgWeeklyRent: Math.round(suburbs.reduce((sum, s) => sum + (s.weeklyRent || 0), 0) / suburbs.length),
      avgRentalYield: Number((suburbs.reduce((sum, s) => sum + (s.rentalYield || 0), 0) / suburbs.length).toFixed(2)),
      avgGrowth12m: Number((suburbs.reduce((sum, s) => sum + (s.growth12m || 0), 0) / suburbs.length).toFixed(2)),
      minPrice: Math.min(...suburbs.map((s) => s.medianPrice || 0)),
      maxPrice: Math.max(...suburbs.map((s) => s.medianPrice || 0)),
      highestGrowth: Math.max(...suburbs.map((s) => s.growth12m || 0)),
      lowestGrowth: Math.min(...suburbs.map((s) => s.growth12m || 0)),
      bestYield: Math.max(...suburbs.map((s) => s.rentalYield || 0)),
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      national: nationalStats,
      stateBreakdown: stateSummary.sort((a, b) => b.suburbCount - a.suburbCount),
      affordableHotspots,
      bestYieldsByState: bestYieldsByState.filter((s) => s.topSuburbs.length > 0),
      growthLeaders,
      growthLaggards,
      investmentOpportunities,
    })
  } catch (error) {
    console.error('Error fetching market insights:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch market insights',
      },
      { status: 500 }
    )
  }
}

