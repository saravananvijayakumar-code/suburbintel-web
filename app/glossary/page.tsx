import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, TrendingUp, DollarSign, Users, Map, BarChart3, Home, Calculator } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Glossary - Australian Property Investment Terms Explained',
  description: 'Complete glossary of property investment terminology, data metrics, and Australian real estate concepts used on Suburb Intel.',
  alternates: {
    canonical: '/glossary',
  },
}

export default function GlossaryPage() {
  const terms = [
    {
      term: 'Median Price',
      definition: 'The middle value of all property sales in a suburb over a given period. If 100 houses sold, the median is the 50th highest price. More representative than average price as it ignores extreme outliers.',
      category: 'Pricing',
    },
    {
      term: 'Median Unit Price',
      definition: 'The median sale price specifically for apartments, units, and townhouses (excluding houses). Typically lower than median house prices in the same suburb.',
      category: 'Pricing',
    },
    {
      term: 'Rental Yield',
      definition: 'Annual rental income as a percentage of property value. Formula: (Weekly Rent × 52) / Median Price × 100. A 5% yield means $5,000 annual rent per $100,000 of property value.',
      category: 'Returns',
    },
    {
      term: 'Price Growth (12m)',
      definition: 'Percentage change in median price over the past 12 months. Calculated as: ((Current Price - Price 12m ago) / Price 12m ago) × 100.',
      category: 'Growth',
    },
    {
      term: 'Investment Score',
      definition: 'Suburb Intel\'s proprietary 0-100 score combining price growth, rental yield, affordability, demographics, and infrastructure. Higher scores indicate stronger investment characteristics.',
      category: 'Analysis',
    },
    {
      term: 'Capital Growth',
      definition: 'Increase in property value over time. Measured as percentage gain (e.g., 8% annual growth means a $500k property becomes $540k after one year).',
      category: 'Growth',
    },
    {
      term: 'ABS',
      definition: 'Australian Bureau of Statistics - the national statistical agency providing Census data, population statistics, and economic indicators.',
      category: 'Data Sources',
    },
    {
      term: 'Census',
      definition: 'Comprehensive population survey conducted every 5 years by the ABS. Most recent: 2021. Provides demographics, income, education, and housing data.',
      category: 'Data Sources',
    },
    {
      term: 'Suburb',
      definition: 'In Australia, a geographic area with defined boundaries used for postal, administrative, and statistical purposes. A single postcode may contain multiple suburbs.',
      category: 'Geography',
    },
    {
      term: 'Postcode',
      definition: 'Four-digit code used by Australia Post to identify delivery areas. One postcode can cover multiple suburbs, and one suburb may have multiple postcodes.',
      category: 'Geography',
    },
    {
      term: 'SA2',
      definition: 'Statistical Area Level 2 - ABS geographic unit (avg 10,000 people) used for Census data. Often aligns with suburbs but boundaries may differ.',
      category: 'Geography',
    },
    {
      term: 'Median Household Income',
      definition: 'Middle value of all household incomes in a suburb from Census data. Higher income correlates with higher property prices and rental demand.',
      category: 'Demographics',
    },
    {
      term: 'Families Percentage',
      definition: 'Percentage of households classified as families (couples with/without children). Higher percentages indicate family-friendly suburbs with demand for larger properties.',
      category: 'Demographics',
    },
    {
      term: 'Population Density',
      definition: 'Number of people per square kilometer. High density indicates inner-city/urban areas; low density indicates regional/suburban sprawl.',
      category: 'Demographics',
    },
    {
      term: 'Vacancy Rate',
      definition: 'Percentage of rental properties vacant at a given time. Low vacancy (&lt;2%) = high demand. High vacancy (&gt;4%) = oversupply.',
      category: 'Rental Market',
    },
    {
      term: 'Days on Market',
      definition: 'Average number of days properties remain listed before selling. Lower days indicate strong demand; higher days suggest slower market.',
      category: 'Market Activity',
    },
    {
      term: 'Clearance Rate',
      definition: 'Percentage of properties sold at auction (compared to total listed). High clearance (&gt;70%) indicates strong buyer demand.',
      category: 'Auctions',
    },
    {
      term: 'LGA',
      definition: 'Local Government Area - council boundaries used for local planning, zoning, and services. One LGA contains multiple suburbs.',
      category: 'Geography',
    },
    {
      term: 'Gross Rental Yield',
      definition: 'Rental yield before expenses (rates, maintenance, management fees). Net yield deducts these costs and is typically 1-2% lower.',
      category: 'Returns',
    },
    {
      term: 'CAGR',
      definition: 'Compound Annual Growth Rate - smoothed annual growth rate over multiple years. Formula: ((Final Value / Initial Value)^(1/Years)) - 1.',
      category: 'Growth',
    },
    {
      term: 'Stamp Duty',
      definition: 'State government tax on property purchases. Varies by state, property price, and buyer status (e.g., first home buyer exemptions).',
      category: 'Costs',
    },
    {
      term: 'Strata Title',
      definition: 'Ownership structure for apartments/units where you own the interior but share common areas (managed by body corporate). Incurs strata fees.',
      category: 'Property Types',
    },
    {
      term: 'Torrens Title',
      definition: 'Freehold ownership of land and buildings with no shared common property. Typical for houses.',
      category: 'Property Types',
    },
    {
      term: 'Negative Gearing',
      definition: 'When rental income is less than property expenses (loan interest, maintenance), creating a tax-deductible loss.',
      category: 'Tax',
    },
    {
      term: 'CGT',
      definition: 'Capital Gains Tax - tax on profit from selling an investment property. 50% discount if held &gt;12 months.',
      category: 'Tax',
    },
    {
      term: 'School Catchment',
      definition: 'Geographic area determining eligibility for public school enrollment. Properties within desirable catchments command premium prices.',
      category: 'Infrastructure',
    },
    {
      term: 'Transport Infrastructure',
      definition: 'Proximity to train stations, buses, major roads. Closer infrastructure correlates with higher prices and rental demand.',
      category: 'Infrastructure',
    },
    {
      term: 'Gentrification',
      definition: 'Process where lower-income suburbs attract higher-income residents, driving property price increases and demographic shifts.',
      category: 'Trends',
    },
    {
      term: 'Market Cycle',
      definition: 'Property markets move through phases: boom (rapid growth), plateau (stagnation), correction (price decline), recovery (growth resumes). Cycles vary by location.',
      category: 'Market Dynamics',
    },
  ]

  const categories = ['All', ...Array.from(new Set(terms.map(t => t.category))).sort()]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Glossary</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Property Investment Glossary</h1>
              <p className="text-gray-600 mt-2">Essential terms and metrics for Australian property investors</p>
            </div>
          </div>

          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mt-6">
            <p className="text-sm text-teal-900">
              <strong>Quick Reference:</strong> All terms are defined in plain English with formulas and examples where applicable. This glossary covers data metrics used on Suburb Intel plus general Australian property investment concepts.
            </p>
          </div>
        </div>

        {/* Terms List */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Terminology ({terms.length} terms)</h2>
            <p className="text-gray-600 text-sm mb-4">Terms are organized alphabetically. Click category tags to filter.</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-gray-200">
            {categories.map(category => (
              <button
                key={category}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-teal-100 hover:text-teal-700 transition"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Terms Grid */}
          <div className="space-y-6">
            {terms.sort((a, b) => a.term.localeCompare(b.term)).map((item, index) => (
              <div key={index} className="pb-6 border-b border-gray-100 last:border-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{item.term}</h3>
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full whitespace-nowrap">
                    {item.category}
                  </span>
                </div>
                <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: item.definition }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Resources</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/methodology" className="text-teal-600 hover:underline">→ Our Methodology</Link>
            <Link href="/data-dictionary" className="text-teal-600 hover:underline">→ Data Dictionary</Link>
            <Link href="/data-sources" className="text-teal-600 hover:underline">→ Data Sources</Link>
            <Link href="/guides" className="text-teal-600 hover:underline">→ Educational Guides</Link>
            <Link href="/faq" className="text-teal-600 hover:underline">→ FAQ</Link>
            <Link href="/disclaimer" className="text-teal-600 hover:underline">→ Disclaimer</Link>
          </div>
        </div>

      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'DefinedTermSet',
            name: 'Australian Property Investment Glossary',
            description: 'Complete glossary of property investment terms and data metrics used on Suburb Intel.',
            inDefinedTermSet: terms.map(t => ({
              '@type': 'DefinedTerm',
              name: t.term,
              description: t.definition,
              inDefinedTermSet: 'https://suburbintel.com/glossary',
            })),
          }),
        }}
      />
    </div>
  )
}
