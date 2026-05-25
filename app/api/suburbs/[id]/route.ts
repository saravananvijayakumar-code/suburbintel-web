import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const state = searchParams.get('state')
    const postcode = searchParams.get('postcode')
    
    // Decode the suburb name (handles URL encoding like %20 for spaces)
    let decodedName = decodeURIComponent(id)
    
    // Parse URL format: "come-by-chance-nsw-2832" -> name: "come-by-chance", state: "nsw", postcode: "2832"
    const urlMatch = decodedName.match(/^(.+)-(nsw|vic|qld|sa|wa|tas|nt|act)-(\d{4})$/i)
    let extractedState = state
    let extractedPostcode = postcode
    
    if (urlMatch) {
      decodedName = urlMatch[1].replace(/-/g, ' ') // "come-by-chance" -> "come by chance"
      extractedState = urlMatch[2].toUpperCase()
      extractedPostcode = urlMatch[3]
    } else {
      // Convert hyphens to spaces for suburb names (e.g., "orchard-hills" -> "orchard hills")
      decodedName = decodedName.replace(/-/g, ' ')
    }
    
    // Try to find by cuid ID first (IDs look like: cm4abc123xyz)
    let suburb = null
    
    // Check if it looks like a cuid (starts with lowercase letter and is alphanumeric)
    const isCuid = /^[a-z][a-z0-9]{20,}$/i.test(id)
    
    if (isCuid) {
      suburb = await prisma.suburbs.findUnique({
        where: { id: id }
      })
    }
    
    // If not found by ID, search by name
    if (!suburb) {
      // Build the where clause
      const whereClause: any = {
        name: {
          equals: decodedName,
          mode: 'insensitive' as const
        }
      }
      
      // Add state filter if provided
      if (extractedState) {
        whereClause.state = extractedState.toUpperCase()
      }
      
      // Add postcode filter if provided
      if (extractedPostcode) {
        whereClause.postcode = extractedPostcode
      }
      
      // Try exact match first
      suburb = await prisma.suburbs.findFirst({
        where: whereClause,
        orderBy: { investmentScore: 'desc' }
      })
      
      // If still not found, try case-insensitive search
      if (!suburb) {
        suburb = await prisma.suburbs.findFirst({
          where: {
            name: {
              contains: decodedName,
              mode: 'insensitive' as const
            },
            ...(extractedState && { state: extractedState.toUpperCase() }),
            ...(extractedPostcode && { postcode: extractedPostcode })
          },
          orderBy: { investmentScore: 'desc' }
        })
      }
    }
    
    if (!suburb) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Suburb "${decodedName}" not found${extractedState ? ` in ${extractedState}` : ''}${extractedPostcode ? ` (${extractedPostcode})` : ''}` 
        },
        { status: 404 }
      )
    }
    
    // Get price history for this suburb (last 12 months)
    const priceHistory = await prisma.price_history.findMany({
      where: { suburbId: suburb.id },
      orderBy: { month: 'asc' },
      take: 12
    })
    
    // Format suburb data - comprehensive with all Census/Government data
    const suburbData = {
      id: suburb.id.toString(),
      name: suburb.name,
      state: suburb.state,
      postcode: suburb.postcode,
      
      // Pricing & Investment
      medianPrice: suburb.medianPrice,
      medianUnitPrice: suburb.medianUnitPrice,  // Separate unit/apartment price
      weeklyRent: suburb.weeklyRent,
      rentalYield: suburb.rentalYield,
      growth12m: suburb.growth12m,
      growth6m: suburb.growth6m,
      growth3m: suburb.growth3m,
      investmentScore: suburb.investmentScore,
      
      // Demographics (ABS Census 2021)
      population: suburb.population,
      medianAge: suburb.medianAge,
      medianIncome: suburb.medianIncome,
      ownerOccupierPercentage: suburb.ownerOccupierPercentage,
      renterPercentage: suburb.renterPercentage,
      unemploymentRate: suburb.unemploymentRate,
      averageHouseholdSize: suburb.averageHouseholdSize || suburb.medianHouseholdSize,
      bachelorDegree: suburb.bachelorDegree,
      ageDistribution: suburb.ageDistribution,
      
      // Livability Scores
      walkabilityScore: suburb.walkabilityScore,
      publicTransportScore: suburb.publicTransportScore,
      schoolQualityScore: suburb.schoolQualityScore,
      crimeRateIndex: suburb.crimeRateIndex,
      crimeRate: suburb.crimeRate,
      crimeScore: suburb.crimeScore,
      
      // Environmental Risks
      bushfireRisk: suburb.bushfireRisk,
      floodRisk: suburb.floodRisk,
      
      // Infrastructure
      trainStations: suburb.trainStations,
      busStops: suburb.busStops,
      primarySchools: suburb.primarySchools,
      secondarySchools: suburb.secondarySchools,
      hospitals: suburb.healthcareFacilities,
      shoppingCentres: suburb.shoppingCentres,
      parks: suburb.parks,
      
      // Data Quality & Source
      lastUpdated: suburb.updatedAt?.toISOString() || new Date().toISOString(),
      dataSource: suburb.dataSource || 'NSW Valuer General',
      dataQuality: suburb.dataQuality || 'medium',
      updateFrequency: suburb.updateFrequency || 'Monthly'
    }
    
    // Format price history
    const formattedPriceHistory = priceHistory.map(ph => ({
      month: ph.month.toISOString(),
      medianPrice: ph.medianPrice
    }))
    
    return NextResponse.json({
      success: true,
      suburb: suburbData,
      priceHistory: formattedPriceHistory
    })
    
  } catch (error) {
    console.error('Error fetching suburb:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch suburb data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
