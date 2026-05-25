import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { suburbIds } = await request.json()

    if (!suburbIds || suburbIds.length < 2 || suburbIds.length > 4) {
      return NextResponse.json(
        { error: 'Please provide 2-4 suburb IDs for comparison' },
        { status: 400 }
      )
    }

    const suburbs = await prisma.suburbs.findMany({
      where: {
        id: {
          in: suburbIds
        }
      },
      include: {
        price_history: {
          orderBy: { month: 'desc' },
          take: 12
        }
      }
    })

    if (suburbs.length === 0) {
      return NextResponse.json({ error: 'No suburbs found' }, { status: 404 })
    }

    // Calculate comparison metrics
    const comparison = suburbs.map((suburb: any) => {
      const priceHistory = suburb.priceHistory.map((h: any) => h.medianPrice)
      const avgPrice = priceHistory.reduce((a: number, b: number) => a + b, 0) / priceHistory.length

      return {
        id: suburb.id,
        name: suburb.name,
        state: suburb.state,
        postcode: suburb.postcode,
        medianPrice: suburb.medianPrice,
        weeklyRent: suburb.weeklyRent,
        rentalYield: suburb.rentalYield,
        growth12m: suburb.growth12m,
        growth6m: suburb.growth6m,
        growth3m: suburb.growth3m,
        investmentScore: suburb.investmentScore,
        priceHistory: priceHistory,
        avgPrice: avgPrice,
        volatility: Math.max(...priceHistory) - Math.min(...priceHistory)
      }
    })

    // Find best and worst performers
    const sortedByGrowth = [...comparison].sort((a, b) => (b.growth12m || 0) - (a.growth12m || 0))
    const sortedByYield = [...comparison].sort((a, b) => (b.rentalYield || 0) - (a.rentalYield || 0))
    const sortedByScore = [...comparison].sort((a, b) => (b.investmentScore || 0) - (a.investmentScore || 0))

    return NextResponse.json({
      success: true,
      comparison,
      insights: {
        bestGrowth: sortedByGrowth[0],
        bestYield: sortedByYield[0],
        bestOverall: sortedByScore[0],
        mostAffordable: [...comparison].sort((a, b) => (a.medianPrice || 0) - (b.medianPrice || 0))[0]
      }
    })
  } catch (error) {
    console.error('Comparison error:', error)
    return NextResponse.json({ error: 'Failed to compare suburbs' }, { status: 500 })
  }
}

