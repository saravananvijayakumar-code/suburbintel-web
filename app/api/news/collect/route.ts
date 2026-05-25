import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// News scraper function - collects from multiple sources
async function scrapePropertyNews() {
  const newsItems = []

  // Sample news sources (in production, would scrape real sources)
  const sources = [
    {
      title: "NSW Government Announces $15 Billion Metro West Extension",
      description: "Major infrastructure investment connecting Western Sydney to Parramatta and Sydney CBD with new metro stations at Five Dock, Burwood North, and North Strathfield.",
      content: `<p>The NSW Government has committed $15 billion to extend the Sydney Metro West project, creating a direct rail link between Western Sydney and the CBD. The extension will include six new stations and is expected to reduce travel times by up to 40 minutes.</p><p>Property experts predict significant value uplift in suburbs within 800 meters of new stations, with historical data showing 15-25% price increases in similar infrastructure projects.</p>`,
      source: "NSW Transport",
      sourceUrl: "https://www.transport.nsw.gov.au",
      category: "infrastructure",
      state: "NSW",
      suburbs: ["Five Dock", "Burwood North", "North Strathfield", "Parramatta", "Sydney"],
      impactType: "positive",
      impactScore: 9,
      tags: ["metro", "infrastructure", "western-sydney", "transport"]
    },
    {
      title: "Victorian Government Fast-Tracks Suburban Rail Loop Stage 2",
      description: "$35 billion investment in orbital rail connecting major activity centers across Melbourne, serving over 500,000 people daily.",
      content: `<p>The Victorian Government has fast-tracked Stage 2 of the Suburban Rail Loop, connecting Cheltenham to Box Hill with 11 new stations. The project will transform Melbourne's public transport network and unlock thousands of new homes near stations.</p><p>Property values near confirmed station locations have already risen 8-12% since the announcement, with Box Hill, Glen Waverley, and Burwood showing strongest growth.</p>`,
      source: "VIC Planning",
      sourceUrl: "https://bigbuild.vic.gov.au",
      category: "infrastructure",
      state: "VIC",
      suburbs: ["Box Hill", "Glen Waverley", "Burwood", "Clayton", "Monash"],
      impactType: "positive",
      impactScore: 10,
      tags: ["rail", "infrastructure", "melbourne", "suburban-rail-loop"]
    },
    {
      title: "Western Sydney International Airport Opens December 2026",
      description: "Nancy-Bird Walton Airport to create 200,000 jobs and drive property growth in surrounding suburbs including Luddenham, Badgerys Creek, and Leppington.",
      content: `<p>The new Western Sydney International Airport is on track to open in December 2026, bringing unprecedented economic development to Sydney's west. The airport is expected to create 200,000 jobs over 20 years and drive significant residential and commercial development.</p><p>Suburbs within 15km of the airport have seen median prices increase 25-40% since construction began, with Luddenham, Badgerys Creek, and Leppington leading growth.</p>`,
      source: "Western Sydney Airport",
      sourceUrl: "https://westernsydney.com.au",
      category: "government",
      state: "NSW",
      suburbs: ["Luddenham", "Badgerys Creek", "Leppington", "Orchard Hills", "Rossmore"],
      impactType: "positive",
      impactScore: 10,
      tags: ["airport", "jobs", "western-sydney", "development"]
    },
    {
      title: "NSW Planning Reforms Allow More Medium-Density Housing",
      description: "New planning rules enable dual occupancy and townhouses in single-dwelling zones across Greater Sydney, potentially adding 60,000 new homes.",
      content: `<p>The NSW Government has introduced planning reforms allowing medium-density housing in traditional single-dwelling zones. The changes permit dual occupancies, manor houses, and townhouses in suburban areas previously restricted to detached houses.</p><p>Property analysts predict the reforms will increase land values in affected suburbs while potentially moderating house price growth through increased supply.</p>`,
      source: "NSW Planning",
      sourceUrl: "https://www.planning.nsw.gov.au",
      category: "planning",
      state: "NSW",
      suburbs: ["Ryde", "Willoughby", "Lane Cove", "Hunters Hill", "Canada Bay"],
      impactType: "positive",
      impactScore: 6,
      tags: ["planning", "housing", "density", "supply"]
    },
    {
      title: "Melbourne's Apartment Oversupply Eases as Construction Slows",
      description: "New apartment completions down 30% as developers respond to market conditions, tightening rental vacancy rates in inner suburbs.",
      content: `<p>Melbourne's apartment market is rebalancing after years of oversupply, with new completions declining 30% year-on-year. The slowdown has tightened rental markets, with vacancy rates falling to 1.8% in the CBD and inner suburbs.</p><p>Apartment prices in well-located precincts including Southbank, Docklands, and South Yarra have stabilized after years of decline, with early signs of recovery evident.</p>`,
      source: "VIC Property Council",
      sourceUrl: "https://www.propertycouncil.com.au/vic",
      category: "market",
      state: "VIC",
      suburbs: ["Southbank", "Docklands", "South Yarra", "Richmond", "Collingwood"],
      impactType: "positive",
      impactScore: 5,
      tags: ["apartments", "supply", "rental", "market-recovery"]
    },
    {
      title: "RBA Holds Interest Rates at 4.35% for Third Consecutive Month",
      description: "Reserve Bank maintains cash rate amid moderating inflation, supporting property market stability and buyer confidence.",
      content: `<p>The Reserve Bank of Australia has held the official cash rate at 4.35% for the third consecutive month, citing moderating inflation pressures and economic stability. The decision provides certainty for property buyers and supports continued market activity.</p><p>Economists predict rates will remain stable through 2025, with potential for cuts in late 2025 or early 2026 as inflation returns to target range.</p>`,
      source: "RBA",
      sourceUrl: "https://www.rba.gov.au",
      category: "economic",
      state: null,
      suburbs: [],
      impactType: "positive",
      impactScore: 7,
      tags: ["interest-rates", "rba", "inflation", "market-conditions"]
    },
    {
      title: "Geelong Fast Rail Project Receives Federal Funding",
      description: "$4 billion fast rail connecting Geelong to Melbourne CBD in under 45 minutes, transforming regional city into viable commuter hub.",
      content: `<p>The Australian Government has committed $4 billion to the Geelong Fast Rail project, reducing travel time to Melbourne CBD from 75 to 45 minutes. The project will include track upgrades, new stations, and enhanced services running every 10 minutes during peak periods.</p><p>Geelong property market has responded strongly with median house prices increasing 15% since the announcement. Regional migration trends favor Geelong as Melbourne's affordability crisis intensifies.</p>`,
      source: "Federal Infrastructure",
      sourceUrl: "https://www.infrastructure.gov.au",
      category: "infrastructure",
      state: "VIC",
      suburbs: ["Geelong", "Geelong West", "Newtown", "South Geelong", "North Geelong"],
      impactType: "positive",
      impactScore: 9,
      tags: ["fast-rail", "regional", "geelong", "infrastructure"]
    }
  ]

  for (const item of sources) {
    newsItems.push({
      ...item,
      publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
    })
  }

  return newsItems
}

export async function GET(request: NextRequest) {
  try {
    console.log('=== News Collector Triggered ===')
    
    // Scrape news from sources
    const newsItems = await scrapePropertyNews()
    console.log(`Collected ${newsItems.length} news items`)

    let inserted = 0
    let skipped = 0

    // Insert news into database (skip duplicates)
    for (const item of newsItems) {
      try {
        // Check if news already exists
        const existing = await prisma.property_news.findFirst({
          where: {
            title: item.title,
            source: item.source
          }
        })

        if (!existing) {
          await prisma.property_news.create({
            data: item
          })
          inserted++
        } else {
          skipped++
        }
      } catch (err) {
        console.error('Error inserting news item:', err)
      }
    }

    console.log(`Inserted: ${inserted}, Skipped: ${skipped}`)

    return NextResponse.json({
      success: true,
      message: 'News collection completed',
      inserted,
      skipped,
      total: newsItems.length
    })

  } catch (error: any) {
    console.error('Error collecting news:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to collect news', details: error.message },
      { status: 500 }
    )
  }
}
