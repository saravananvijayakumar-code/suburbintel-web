import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Red Flags in Suburb Data - Warning Signs for Property Investors',
  description: '12 data red flags that signal risky suburbs: low sales volume, declining population, high vacancy, volatile prices, and more. Learn what to avoid.',
  alternates: { canonical: '/guides/red-flags-in-suburb-data' },
}

export default function GuideRedFlagsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/">Home</Link> / <Link href="/guides">Guides</Link> / Red Flags in Suburb Data
        </nav>

        <article className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">Red Flags in Suburb Data</h1>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-900"><strong>TL;DR:</strong> Avoid suburbs with: &lt;20 sales/year, declining population, &gt;4% vacancy, negative price growth over 3 years, high crime, low data quality indicators, or excessive new supply. One red flag = investigate further. Multiple red flags = walk away.</p>
          </div>

          <h2 className="text-2xl font-bold mb-3">12 Critical Red Flags</h2>

          <div className="space-y-4 mb-8">
            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h3 className="font-bold text-red-900 mb-2">🚩 1. Low Sales Volume (&lt;20 sales/year)</h3>
              <p className="text-sm text-red-800"><strong>Why it matters:</strong> Median prices unreliable. Hard to sell when you need to. Thin market = volatile prices.</p>
              <p className="text-sm text-red-800"><strong>What to do:</strong> Check data quality indicator. Avoid if "LOW" quality.</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h3 className="font-bold text-red-900 mb-2">🚩 2. Declining Population (3+ years)</h3>
              <p className="text-sm text-red-800"><strong>Why it matters:</strong> Shrinking demand for housing. Businesses closing. Death spiral for property values.</p>
              <p className="text-sm text-red-800"><strong>What to do:</strong> Check ABS population trends. Avoid mining towns post-boom.</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h3 className="font-bold text-red-900 mb-2">🚩 3. High Vacancy Rate (&gt;4%)</h3>
              <p className="text-sm text-red-800"><strong>Why it matters:</strong> Oversupply. Extended vacancy risk. Downward pressure on rents.</p>
              <p className="text-sm text-red-800"><strong>What to do:</strong> Check SQM Research vacancy data. Avoid high-rise precincts with &gt;5%.</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h3 className="font-bold text-red-900 mb-2">🚩 4. Negative Growth (3+ years)</h3>
              <p className="text-sm text-red-800"><strong>Why it matters:</strong> Market clearly rejecting this suburb. Could be declining for fundamental reasons.</p>
              <p className="text-sm text-red-800"><strong>What to do:</strong> Investigate why. Is it cyclical (mining) or structural (crime, infrastructure)?</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h3 className="font-bold text-red-900 mb-2">🚩 5. Extreme Price Volatility</h3>
              <p className="text-sm text-red-800"><strong>Why it matters:</strong> Prices swinging ±20% year-to-year = risky, thin market. Timing risk huge.</p>
              <p className="text-sm text-red-800"><strong>What to do:</strong> Check 3-year median chart. Avoid rollercoaster suburbs.</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h3 className="font-bold text-red-900 mb-2">🚩 6. Massive New Supply Coming</h3>
              <p className="text-sm text-red-800"><strong>Why it matters:</strong> 1,000+ new apartments in 2 years = oversupply guaranteed. Rents fall, values stagnate.</p>
              <p className="text-sm text-red-800"><strong>What to do:</strong> Check DA approvals with council. Google "[suburb] development pipeline".</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h3 className="font-bold text-red-900 mb-2">🚩 7. High Crime Rate</h3>
              <p className="text-sm text-red-800"><strong>Why it matters:</strong> Families avoid. Stigma persists for decades. Insurance costs higher.</p>
              <p className="text-sm text-red-800"><strong>What to do:</strong> Check state police crime stats. Visit suburb at night.</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h3 className="font-bold text-red-900 mb-2">🚩 8. No Infrastructure Upgrades Planned</h3>
              <p className="text-sm text-red-800"><strong>Why it matters:</strong> Government spending = catalyst for growth. No spending = stagnation likely.</p>
              <p className="text-sm text-red-800"><strong>What to do:</strong> Check state budget papers for transport/health projects.</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h3 className="font-bold text-red-900 mb-2">🚩 9. Single Industry Dependence</h3>
              <p className="text-sm text-red-800"><strong>Why it matters:</strong> Mine closes = suburb dies. Tourism crash = 50% vacancy overnight (2020).</p>
              <p className="text-sm text-red-800"><strong>What to do:</strong> Check industry mix. Avoid if &gt;50% in one industry.</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h3 className="font-bold text-red-900 mb-2">🚩 10. Falling Median Income</h3>
              <p className="text-sm text-red-800"><strong>Why it matters:</strong> Weakening buyer pool. Can't support price growth. Rental stress increases.</p>
              <p className="text-sm text-red-800"><strong>What to do:</strong> Check ABS census data trends (2016 → 2021).</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h3 className="font-bold text-red-900 mb-2">🚩 11. Days on Market &gt;60</h3>
              <p className="text-sm text-red-800"><strong>Why it matters:</strong> Properties sitting unsold. Weak demand. You'll struggle to sell too.</p>
              <p className="text-sm text-red-800"><strong>What to do:</strong> Check realestate.com.au "Time on Market" stats.</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h3 className="font-bold text-red-900 mb-2">🚩 12. Rental Yield Too High (&gt;8%)</h3>
              <p className="text-sm text-red-800"><strong>Why it matters:</strong> Sounds great but = nobody wants to buy. Capital growth near zero. Exit strategy broken.</p>
              <p className="text-sm text-red-800"><strong>What to do:</strong> Question WHY yield is so high. Usually negative reasons.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">How to Use Red Flags</h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <ul className="space-y-2 text-sm">
              <li>✅ <strong>1 red flag:</strong> Investigate further, but not a deal-breaker</li>
              <li>⚠️ <strong>2-3 red flags:</strong> High risk. Need very strong fundamentals elsewhere</li>
              <li>❌ <strong>4+ red flags:</strong> Walk away. Find a better suburb</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mb-3">Green Flags (Opposite Indicators)</h2>
          <ul className="list-disc ml-6 space-y-2 mb-6 text-sm">
            <li>100+ sales/year (liquid market)</li>
            <li>Growing population (2%+ annually)</li>
            <li>Vacancy &lt;2% (strong demand)</li>
            <li>Consistent 5-8% growth (3+ years)</li>
            <li>Major infrastructure announced</li>
            <li>Diversified economy</li>
            <li>Median income rising</li>
            <li>Days on market &lt;30</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">FAQs</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-bold">Can a suburb recover from red flags?</h3>
              <p className="text-sm">Yes, but takes 5-10 years. Wait for green shoots (infrastructure, population growth) before investing.</p>
            </div>
            <div>
              <h3 className="font-bold">What if the suburb has 1 red flag but looks great otherwise?</h3>
              <p className="text-sm">Single red flag is manageable. Just ensure you understand the risk and have mitigation strategy.</p>
            </div>
          </div>

          <div className="mt-8 bg-teal-500 text-white p-6 rounded-lg text-center">
            <h3 className="font-bold mb-2">View Data Quality Indicators for 14,548 Suburbs</h3>
            <Link href="/search" className="inline-block bg-white text-teal-600 px-6 py-2 rounded-lg font-semibold mt-2">Search Suburbs →</Link>
          </div>
        </article>
      </div>
    </div>
  )
}
