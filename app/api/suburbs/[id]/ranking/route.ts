import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const suburbId = id
    
    // Check if it looks like a cuid (IDs look like: cm4abc123xyz)
    const isCuid = /^[a-z][a-z0-9]{20,}$/i.test(suburbId)

    // Get the suburb by ID or name
    const suburb = await prisma.suburbs.findFirst({
      where: isCuid 
        ? { id: suburbId }
        : {
            name: {
              equals: decodeURIComponent(suburbId),
              mode: 'insensitive',
            },
          },
    })

    if (!suburb) {
      return NextResponse.json(
        { error: 'Suburb not found' },
        { status: 404 }
      )
    }

    // Get total suburbs count
    const totalSuburbs = await prisma.suburbs.count()

    // Get national rank based on investment score
    const betterNationalSuburbs = await prisma.suburbs.count({
      where: {
        investmentScore: {
          gt: suburb.investmentScore ?? 0
        }
      }
    })
    const nationalRank = betterNationalSuburbs + 1

    // Get state rank
    const totalInState = await prisma.suburbs.count({
      where: { state: suburb.state }
    })

    const betterStateSuburbs = await prisma.suburbs.count({
      where: {
        state: suburb.state,
        investmentScore: {
          gt: suburb.investmentScore ?? 0
        }
      }
    })
    const stateRank = betterStateSuburbs + 1

    // Determine performance category
    const percentile = ((totalSuburbs - nationalRank) / totalSuburbs) * 100
    let category = ''
    
    if (percentile >= 90) {
      category = 'Elite - Top 10%'
    } else if (percentile >= 75) {
      category = 'Excellent - Top 25%'
    } else if (percentile >= 50) {
      category = 'Above Average - Top 50%'
    } else if (percentile >= 25) {
      category = 'Average - Top 75%'
    } else {
      category = 'Below Average'
    }

    return NextResponse.json({
      success: true,
      ranking: {
        nationalRank,
        totalSuburbs,
        stateRank,
        totalInState,
        category,
        percentile: Math.round(percentile)
      }
    })

  } catch (error) {
    console.error('Ranking API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ranking' },
      { status: 500 }
    )
  }
}
