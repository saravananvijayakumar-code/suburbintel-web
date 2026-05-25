// llms.txt - Structured entry point for AI crawlers (ChatGPT, Claude, Perplexity, Gemini)
// Spec: https://llmstxt.org/
// This is a NEW route and does not modify any existing functionality

export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate daily

export async function GET() {
  const baseUrl = 'https://suburbintel.com'
  
  const content = `# Suburb Intel - Australian Property Intelligence Platform

> AI-powered property intelligence for 14,500+ Australian suburbs
> 100% official government data (ABS Census, NSW Valuer General, VIC Property Sales)
> Free suburb search, paid Pro features for investors

## About

Suburb Intel is Australia's leading property investment intelligence platform. We aggregate official government data from the Australian Bureau of Statistics (ABS), NSW Valuer General, VIC Property Sales, and infrastructure databases to provide comprehensive suburb analysis across all Australian states.

Our platform helps property investors, first home buyers, and researchers make data-driven decisions by analyzing 14,548 suburbs with metrics including:
- Median house & unit prices
- Price growth (3m, 6m, 12m)
- Rental yields
- Demographics (population, age, income, families %)
- Infrastructure (schools, train stations, hospitals)
- Investment scoring algorithm

## Data Sources & Methodology

All data is sourced from official Australian government agencies:
- ${baseUrl}/data-sources - Complete list of government data sources
- ${baseUrl}/methodology - How we process and score suburbs
- ${baseUrl}/data-dictionary - Definitions of all metrics

## Trust & Transparency

- ${baseUrl}/about - Mission, team, and platform details
- ${baseUrl}/disclaimer - Investment disclaimer and data limitations
- ${baseUrl}/faq - Frequently asked questions
- ${baseUrl}/glossary - Property investment terminology

## Core Features

- ${baseUrl}/search - Search 14,548 Australian suburbs
- ${baseUrl}/suburb/melbourne-vic-3000 - Example suburb detail page
- ${baseUrl}/compare - Compare up to 3 suburbs side-by-side
- ${baseUrl}/heatmap - Interactive map of property prices and growth
- ${baseUrl}/best-suburbs - SEO landing page hub
- ${baseUrl}/best-suburbs/sydney - Best suburbs in Sydney
- ${baseUrl}/best-suburbs/melbourne - Best Melbourne suburbs
- ${baseUrl}/best-suburbs/high-yield - High rental yield suburbs
- ${baseUrl}/best-suburbs/first-home-buyers - First home buyer suburbs
- ${baseUrl}/best-suburbs/under-500k - Affordable suburbs under $500k

## Educational Guides

- ${baseUrl}/guides - Complete guide hub
- ${baseUrl}/guides/first-home-buyer - First home buyer's guide
- ${baseUrl}/guides/rental-yield - Understanding rental yields
- ${baseUrl}/guides/property-forecast-2025 - 2025 market forecasts
- ${baseUrl}/guides/how-to-analyze-a-suburb - Step-by-step suburb analysis
- ${baseUrl}/guides/how-to-compare-suburbs - Comparison methodology
- ${baseUrl}/guides/what-is-rental-yield - Rental yield explained
- ${baseUrl}/guides/suburb-growth-vs-yield-strategy - Growth vs yield strategies

## Regional Coverage

National suburb coverage organized by state:
- ${baseUrl}/suburbs - National suburb directory
- ${baseUrl}/suburbs/nsw - NSW suburbs
- ${baseUrl}/suburbs/vic - VIC suburbs
- ${baseUrl}/suburbs/qld - QLD suburbs
- ${baseUrl}/state/nsw - NSW market overview
- ${baseUrl}/state/vic - VIC market overview

## Sample Reports

- ${baseUrl}/sample-report - View a sample suburb intelligence report

## For Developers & Data Users

This platform is built on Next.js 15 with TypeScript, PostgreSQL, and Prisma ORM.
All suburb data is accessible via our web interface. API access is not currently public.

## Contact & Support

- ${baseUrl}/support - Help center
- ${baseUrl}/about - About Suburb Intel
- General inquiries: support@suburbintel.com

---

Last updated: ${new Date().toISOString().split('T')[0]}
Coverage: 14,548 Australian suburbs across all states and territories
Data refresh: Quarterly (aligned with government data releases)

For the most current suburb data, always visit the website directly.
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  })
}
