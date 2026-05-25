import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import SuburbReport from '@/components/SuburbReport'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const userId = 'guest'; // Auth removed

  

  return NextResponse.json({
    error: 'PDF export feature is under development. Please use CSV export for now.',
    message: 'We are working on implementing PDF reports. In the meantime, you can export your data as CSV.',
    available: false
  }, { status: 501 })
}

export async function POST(request: NextRequest) {
  try {
    const userId = 'guest'; // Auth removed

    

    // Check if user has Pro subscription
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { subscriptionTier: true }
    })

    

    const body = await request.json()
    const { suburbId, reportType = 'investment' } = body

    if (!suburbId) {
      return NextResponse.json({ error: 'Suburb ID is required' }, { status: 400 })
    }

    // Fetch suburb data from database
    const suburb = await prisma.suburb.findUnique({
      where: { id: suburbId },
      include: {
        demographics: true,
        riskData: true,
      }
    })

    if (!suburb) {
      return NextResponse.json({ error: 'Suburb not found' }, { status: 404 })
    }

    // Generate AI analysis (simplified for now - in production, call actual AI service)
    const analysis = generateInvestmentAnalysis(suburb)

    // Prepare report data
    const reportData = {
      name: suburb.name,
      state: suburb.state,
      postcode: suburb.postcode,
      medianPrice: suburb.medianPrice,
      growth12m: suburb.growth12m,
      growth6m: suburb.growth6m,
      growth3m: suburb.growth3m,
      rentalYield: suburb.rentalYield,
      investmentScore: suburb.investmentScore,
      population: suburb.demographics?.population || null,
      medianAge: suburb.demographics?.medianAge || null,
      medianIncome: suburb.demographics?.medianIncome || null,
      floodRisk: suburb.riskData?.floodRisk || null,
      bushfireRisk: suburb.riskData?.bushfireRisk || null,
      crimeRisk: suburb.riskData?.crimeRisk || null,
      analysis,
      lastUpdated: suburb.lastUpdated.toISOString(),
    }

    // Generate PDF
    const pdfBuffer = await renderToBuffer(SuburbReport({ data: reportData }))

    // Return PDF as downloadable file
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${suburb.name}-${suburb.state}-report.pdf"`,
      },
    })

  } catch (error) {
    console.error('PDF export error:', error)
    return NextResponse.json({
      error: 'Failed to generate PDF report',
      message: 'An error occurred while processing your request. Please try again or use CSV export.'
    }, { status: 500 })
  }
}

// Generate investment analysis (simplified AI analysis)
function generateInvestmentAnalysis(suburb: any): string {
  const growth = suburb.growth12m
  const rentalYield = suburb.rentalYield
  const price = suburb.medianPrice

  let analysis = `Investment Analysis for ${suburb.name}, ${suburb.state}\n\n`

  // Growth analysis
  if (growth > 10) {
    analysis += `🚀 Strong Growth: This suburb has shown exceptional 12-month growth of ${growth.toFixed(1)}%, indicating high demand and potential for capital appreciation.\n\n`
  } else if (growth > 5) {
    analysis += `📈 Moderate Growth: Steady growth of ${growth.toFixed(1)}% suggests stable market conditions with room for appreciation.\n\n`
  } else if (growth < 0) {
    analysis += `📉 Market Caution: Recent price decline of ${Math.abs(growth).toFixed(1)}% may indicate temporary market correction or oversupply concerns.\n\n`
  } else {
    analysis += `📊 Stable Market: Growth of ${growth.toFixed(1)}% reflects balanced market conditions.\n\n`
  }

  // Yield analysis
  if (rentalYield && rentalYield > 5) {
    analysis += `💰 High Yield: Rental yield of ${rentalYield.toFixed(1)}% provides strong cash flow potential, making this attractive for income-focused investors.\n\n`
  } else if (rentalYield && rentalYield > 3) {
    analysis += `💵 Moderate Yield: Yield of ${rentalYield.toFixed(1)}% offers reasonable income potential.\n\n`
  } else {
    analysis += `📈 Growth Focus: Lower yield suggests this suburb may be more suitable for capital growth strategies.\n\n`
  }

  // Risk assessment
  const risks = []
  if (suburb.riskData?.floodRisk === 'high') risks.push('flood risk')
  if (suburb.riskData?.bushfireRisk === 'high') risks.push('bushfire risk')
  if (suburb.riskData?.crimeRisk === 'high') risks.push('crime risk')

  if (risks.length > 0) {
    analysis += `⚠️ Risk Considerations: Higher ${risks.join(' and ')} may impact insurance costs and property values. Consider these factors in your risk assessment.\n\n`
  } else {
    analysis += `✅ Low Risk Profile: This suburb shows favorable risk characteristics across key indicators.\n\n`
  }

  // Investment recommendation
  if (growth > 8 && rentalYield > 4 && risks.length === 0) {
    analysis += `🎯 Investment Recommendation: HIGH POTENTIAL - This suburb combines strong growth, solid yields, and low risk, making it an excellent investment opportunity.`
  } else if (growth > 5 || rentalYield > 3) {
    analysis += `🎯 Investment Recommendation: MODERATE POTENTIAL - Solid fundamentals suggest this could be a reasonable investment with balanced risk-reward profile.`
  } else {
    analysis += `🎯 Investment Recommendation: CAUTION ADVISED - Consider your investment strategy carefully and conduct additional due diligence.`
  }

  return analysis
}
