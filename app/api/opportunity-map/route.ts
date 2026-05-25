import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { OpportunityMapSchema, validateSearchParams, ValidationError, sanitizeForLog, withRateLimit } from '@/lib/security'

async function handler(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Validate and sanitize query params
    const { persona, minBudget, maxBudget, minYield, minGrowth, state, sortBy, limit } = validateSearchParams(
      searchParams,
      OpportunityMapSchema
    )

    // Build where clause
    const where: any = {
      AND: []
    }

    if (minBudget) {
      where.AND.push({ medianPrice: { gte: minBudget } })
    }
    if (maxBudget) {
      where.AND.push({ medianPrice: { lte: maxBudget } })
    }
    if (minYield) {
      where.AND.push({ grossYieldHouse: { gte: minYield } })
    }
    if (minGrowth) {
      where.AND.push({ growth12m: { gte: minGrowth } })
    }
    if (state) {
      where.AND.push({ state })
    }
    if (persona) {
      where.AND.push({ aiBuyerPersona: persona })
    }

    // Build orderBy
    let orderBy: any
    switch (sortBy) {
      case 'growth':
        orderBy = { growth12m: 'desc' }
        break
      case 'yield':
        orderBy = { grossYieldHouse: 'desc' }
        break
      case 'price':
        orderBy = { medianPrice: 'asc' }
        break
      default:
        orderBy = { overallSmartPropertyScore: 'desc' }
    }

    // Fetch opportunities
    const suburbs = await prisma.suburbs.findMany({
      where: where.AND.length > 0 ? where : undefined,
      orderBy,
      take: limit,
      select: {
        id: true,
        name: true,
        state: true,
        postcode: true,
        medianPrice: true,
        growth12m: true,
        grossYieldHouse: true,
        overallSmartPropertyScore: true,
        suburbGrowthScore: true,
        suburbRiskScore: true,
        vacancyRate: true,
        demandScore: true,
        aiShortSummary: true,
        aiBuyerPersona: true,
        aiInvestmentStrategy: true
      }
    })

    // Format results
    const opportunities = suburbs.map(s => ({
      suburb: {
        id: s.id,
        name: s.name,
        state: s.state,
        postcode: s.postcode
      },
      metrics: {
        price: s.medianPrice,
        growth12m: s.growth12m,
        yield: s.grossYieldHouse,
        smartScore: s.overallSmartPropertyScore,
        growthScore: s.suburbGrowthScore,
        riskScore: s.suburbRiskScore,
        vacancyRate: s.vacancyRate,
        demandScore: s.demandScore
      },
      highlights: [
        s.growth12m && s.growth12m > 10 ? `Strong ${s.growth12m.toFixed(1)}% growth` : null,
        s.grossYieldHouse && s.grossYieldHouse > 5 ? `Excellent ${s.grossYieldHouse.toFixed(2)}% yield` : null,
        s.vacancyRate && s.vacancyRate < 2 ? 'Very tight rental market' : null,
        s.demandScore && s.demandScore > 75 ? 'High demand area' : null
      ].filter(Boolean),
      matchReason: s.aiShortSummary || `Score: ${s.overallSmartPropertyScore}/100`,
      persona: s.aiBuyerPersona,
      recommendation: s.aiInvestmentStrategy
    }))

    return NextResponse.json({
      success: true,
      total: opportunities.length,
      filters: {
        persona,
        minBudget,
        maxBudget,
        minYield,
        minGrowth,
        state,
        sortBy
      },
      opportunities
    })

  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, error: 'Invalid parameters', details: error.message },
        { status: 400 }
      )
    }
    
    console.error('Error fetching opportunity map:', sanitizeForLog(error))
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withRateLimit(handler, { maxRequests: 60, windowMs: 60000 })

