import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type BuyerPersona = 'first-home-buyer' | 'investor-growth' | 'investor-yield' | 'upsizer' | 'downsizer' | 'lifestyle' | 'renovator'

interface PersonaCriteria {
  maxPrice?: number
  minYield?: number
  minGrowth?: number
  preferredAreas?: string[]
  riskTolerance: 'low' | 'medium' | 'high'
  investmentHorizon: '1-3y' | '3-7y' | '7y+'
  strategy: string
}

const getPersonaCriteria = (persona: BuyerPersona): PersonaCriteria => {
  switch (persona) {
    case 'first-home-buyer':
      return {
        maxPrice: 800000,
        minGrowth: 5,
        riskTolerance: 'low',
        investmentHorizon: '7y+',
        strategy: 'Focus on affordable areas with good growth potential and low oversupply risk. Prioritize owner-occupier dominated markets.'
      }
    case 'investor-growth':
      return {
        minGrowth: 8,
        riskTolerance: 'medium',
        investmentHorizon: '3-7y',
        strategy: 'Target high-growth suburbs with strong demand drivers and infrastructure catalysts. Accept lower yields for capital gains.'
      }
    case 'investor-yield':
      return {
        minYield: 5,
        riskTolerance: 'low',
        investmentHorizon: '7y+',
        strategy: 'Prioritize strong rental returns in established rental markets. Focus on vacancy rates below 2.5% and consistent demand.'
      }
    case 'upsizer':
      return {
        minGrowth: 5,
        riskTolerance: 'low',
        investmentHorizon: '7y+',
        strategy: 'Look for family-friendly suburbs with good schools, parks, and amenities. Balance affordability with lifestyle quality.'
      }
    case 'downsizer':
      return {
        maxPrice: 1000000,
        riskTolerance: 'low',
        investmentHorizon: '7y+',
        strategy: 'Focus on low-maintenance properties in established areas with good healthcare and public transport access.'
      }
    default:
      return {
        riskTolerance: 'medium',
        investmentHorizon: '3-7y',
        strategy: 'Balanced approach considering both growth and yield potential.'
      }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { persona, budget, state } = body

    if (!persona) {
      return NextResponse.json(
        { success: false, error: 'Persona is required' },
        { status: 400 }
      )
    }

    const criteria = getPersonaCriteria(persona as BuyerPersona)
    
    // Build query based on persona
    const where: any = {
      AND: [
        { overallSmartPropertyScore: { gte: 60 } } // Minimum quality threshold
      ]
    }

    if (budget) {
      where.AND.push({ medianHousePrice: { lte: budget } })
    } else if (criteria.maxPrice) {
      where.AND.push({ medianHousePrice: { lte: criteria.maxPrice } })
    }

    if (criteria.minYield) {
      where.AND.push({ grossYieldHouse: { gte: criteria.minYield } })
    }

    if (criteria.minGrowth) {
      where.AND.push({ priceGrowth12m: { gte: criteria.minGrowth } })
    }

    if (state) {
      where.AND.push({ state })
    }

    // Adjust for risk tolerance
    if (criteria.riskTolerance === 'low') {
      where.AND.push({ suburbRiskScore: { lte: 40 } })
      where.AND.push({ oversupplyRiskScore: { lte: 40 } })
    }

    // Fetch recommended suburbs
    const suburbs = await prisma.suburbs.findMany({
      where,
      orderBy: persona === 'investor-growth' 
        ? { growth12m: 'desc' }
        : persona === 'investor-yield'
        ? { grossYieldHouse: 'desc' }
        : { overallSmartPropertyScore: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        state: true,
        postcode: true,
        medianPrice: true,
        growth12m: true,
        priceGrowth3y: true,
        grossYieldHouse: true,
        overallSmartPropertyScore: true,
        suburbGrowthScore: true,
        suburbRiskScore: true,
        vacancyRate: true,
        populationGrowthRate: true,
        aiShortSummary: true,
        aiInvestmentStrategy: true
      }
    })

    const recommendations = suburbs.map(s => ({
      suburb: {
        id: s.id,
        name: s.name,
        state: s.state,
        postcode: s.postcode
      },
      metrics: {
        price: s.medianPrice,
        growth12m: s.growth12m,
        growth3y: s.priceGrowth3y,
        yield: s.grossYieldHouse,
        smartScore: s.overallSmartPropertyScore,
        growthScore: s.suburbGrowthScore,
        riskScore: s.suburbRiskScore,
        vacancyRate: s.vacancyRate,
        populationGrowth: s.populationGrowthRate
      },
      summary: s.aiShortSummary,
      recommendation: s.aiInvestmentStrategy,
      matchScore: calculateMatchScore(s, persona as BuyerPersona, criteria)
    }))

    // Sort by match score
    recommendations.sort((a, b) => b.matchScore - a.matchScore)

    return NextResponse.json({
      success: true,
      persona,
      criteria: {
        ...criteria,
        budget: budget || criteria.maxPrice
      },
      recommendations
    })

  } catch (error: any) {
    console.error('Error getting persona recommendations:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateMatchScore(suburb: any, persona: BuyerPersona, criteria: PersonaCriteria): number {
  let score = 0
  
  // Base score from Smart Property Score
  score += (suburb.overallSmartPropertyScore || 0) * 0.4
  
  // Persona-specific scoring
  if (persona === 'investor-growth') {
    score += (suburb.growth12m || 0) * 3 // Weight growth heavily
    score += (suburb.growthScore || 0) * 0.3
  } else if (persona === 'investor-yield') {
    score += (suburb.grossYieldHouse || 0) * 10 // Weight yield heavily
    score -= (suburb.vacancyRate || 2.5) * 5 // Penalize high vacancy
  } else if (persona === 'first-home-buyer') {
    score += suburb.medianPrice < 600000 ? 20 : 0 // Bonus for affordability
    score += (100 - (suburb.riskScore || 50)) * 0.2 // Bonus for low risk
  }
  
  // Risk adjustment
  if (criteria.riskTolerance === 'low') {
    score -= (suburb.suburbRiskScore || 0) * 0.3
  }
  
  return Math.min(100, Math.max(0, score))
}

