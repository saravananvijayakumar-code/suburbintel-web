import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { calculateSmartPropertyScore, getScoreRating } from '@/lib/smart-property-score'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const suburbId = resolvedParams.id

    // Fetch suburb from database
    const suburb = await prisma.suburbs.findUnique({
      where: { id: suburbId }
    })

    if (!suburb) {
      return NextResponse.json(
        { success: false, error: 'Suburb not found' },
        { status: 404 }
      )
    }

    // Calculate smart property score
    const scoreComponents = calculateSmartPropertyScore({
      priceGrowth3m: suburb.growth3m || 0,
      priceGrowth6m: suburb.growth6m || 0,
      priceGrowth12m: suburb.growth12m || 0,
      priceGrowth3y: suburb.priceGrowth3y || 0,
      priceGrowth5y: suburb.growth5y || 0,
      listingsTrend3m: suburb.listingsTrend3m as any || 'stable',
      stockOnMarket: suburb.stockOnMarketPct || 3,
      oversupplyRisk: suburb.oversupplyRiskScore || 30,
      grossYield: suburb.grossYieldHouse || 4,
      vacancyRate: suburb.vacancyRate || 2.5,
      rentalGrowth12m: suburb.rentalGrowth12m || 0,
      populationGrowth: suburb.populationGrowthRate || 1.5,
      educationIndex: suburb.educationLevelIndex || 60,
      employmentRate: suburb.employmentRate || 95,
      medianIncome: suburb.medianIncome || 75000,
      dwellingApprovals: suburb.dwellingApprovalsYTD || 50,
      apartmentPipeline: suburb.apartmentPipeline || 200,
      priceToIncome: suburb.priceToIncomeRatio || 8,
      timeToSaveDeposit: suburb.timeToSaveDepositYears || 5,
      medianPrice: suburb.medianPrice || 750000
    })

    const rating = getScoreRating(scoreComponents.totalScore)

    return NextResponse.json({
      success: true,
      score: {
        total: scoreComponents.totalScore,
        rating: rating.rating,
        label: rating.label,
        color: rating.color,
        description: rating.description,
        components: {
          growthMomentum: scoreComponents.growthMomentum,
          supplyPressure: scoreComponents.supplyPressure,
          rentalStrength: scoreComponents.rentalStrength,
          socioEconomic: scoreComponents.socioEconomicUplift,
          developmentRisk: scoreComponents.developmentRisk,
          affordability: scoreComponents.affordability
        }
      },
      suburb: {
        id: suburb.id,
        name: suburb.name,
        state: suburb.state,
        postcode: suburb.postcode
      }
    })

  } catch (error: any) {
    console.error('Error calculating smart score:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
