import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How Often Suburb Data Changes - Update Frequency Guide',
  description: 'How frequently property data updates: prices (monthly), demographics (5 years), infrastructure (annual). Learn when to refresh your suburb research.',
  alternates: { canonical: '/guides/how-often-suburb-data-changes' },
}

export default function GuideDataFrequencyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/">Home</Link> / <Link href="/guides">Guides</Link> / Data Update Frequency
        </nav>

        <article className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">How Often Suburb Data Changes</h1>
          
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
            <p className="text-teal-900"><strong>TL;DR:</strong> Median prices update monthly (30-60 day lag). Rental data updates quarterly. Demographics update every 5 years (Census). Infrastructure data updates annually. For active research, check prices monthly, everything else quarterly.</p>
          </div>

          <h2 className="text-2xl font-bold mb-3">Data Update Frequencies by Category</h2>

          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">📊 Median Prices (Monthly)</h3>
              <p className="text-sm mb-2"><strong>Update frequency:</strong> Monthly (30-60 day lag)</p>
              <p className="text-sm mb-2"><strong>Source:</strong> CoreLogic, Domain, Realestate.com.au</p>
              <p className="text-sm"><strong>Why the lag:</strong> Sales must settle (30-90 days after contract), then be reported and aggregated.</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-green-900 mb-2">💰 Rental Data (Quarterly)</h3>
              <p className="text-sm mb-2"><strong>Update frequency:</strong> Every 3 months</p>
              <p className="text-sm mb-2"><strong>Source:</strong> Domain, SQM Research, state rent boards</p>
              <p className="text-sm"><strong>Note:</strong> Rental yield calculated from latest rent + price data.</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold text-purple-900 mb-2">👥 Demographics (Every 5 Years)</h3>
              <p className="text-sm mb-2"><strong>Update frequency:</strong> Every 5 years (Census)</p>
              <p className="text-sm mb-2"><strong>Source:</strong> Australian Bureau of Statistics</p>
              <p className="text-sm"><strong>Last update:</strong> 2021 Census (next: 2026)</p>
              <p className="text-sm"><strong>Includes:</strong> Population, age, income, education, families</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-bold text-yellow-900 mb-2">🏗️ Infrastructure (Annually)</h3>
              <p className="text-sm mb-2"><strong>Update frequency:</strong> Once per year</p>
              <p className="text-sm mb-2"><strong>Source:</strong> State education depts, transport agencies, health depts</p>
              <p className="text-sm"><strong>Includes:</strong> Schools, hospitals, public transport, planned projects</p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-bold text-red-900 mb-2">📉 Vacancy Rates (Monthly)</h3>
              <p className="text-sm mb-2"><strong>Update frequency:</strong> Monthly</p>
              <p className="text-sm mb-2"><strong>Source:</strong> SQM Research, Domain</p>
              <p className="text-sm"><strong>Note:</strong> Free suburb-level data from SQM Research.</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-bold text-orange-900 mb-2">📈 Growth Rates (Calculated Real-Time)</h3>
              <p className="text-sm mb-2"><strong>Update frequency:</strong> Whenever price data updates</p>
              <p className="text-sm"><strong>Calculation:</strong> (Current Price / Previous Price) - 1 × 100</p>
              <p className="text-sm"><strong>Note:</strong> 12-month growth more reliable than 3-month (less noise).</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">Suburb Intel Update Schedule</h2>
          <div className="bg-gray-100 p-6 rounded-lg mb-6">
            <ul className="space-y-2 text-sm">
              <li>✅ <strong>Median prices:</strong> Updated monthly (latest available data)</li>
              <li>✅ <strong>Rental yields:</strong> Recalculated monthly as prices/rents update</li>
              <li>✅ <strong>Investment scores:</strong> Recalculated with each data update</li>
              <li>✅ <strong>Demographics:</strong> 2021 Census data (refreshes Aug 2026)</li>
              <li>✅ <strong>Infrastructure:</strong> Annual updates (schools, transport, hospitals)</li>
            </ul>
            <p className="text-xs mt-4 text-gray-600">Last suburb data refresh: {new Date().toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}</p>
          </div>

          <h2 className="text-2xl font-bold mb-3">When to Re-Research a Suburb</h2>
          <ul className="list-disc ml-6 space-y-2 mb-6">
            <li><strong>Active buying (next 3 months):</strong> Check prices monthly</li>
            <li><strong>Watchlist suburbs:</strong> Check quarterly</li>
            <li><strong>Owned properties:</strong> Annual review sufficient</li>
            <li><strong>Major event occurs:</strong> Infrastructure announcement, rezoning, etc.</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">Why Some Data Changes Slowly</h2>
          <div className="space-y-3 mb-6 text-sm">
            <div>
              <h3 className="font-bold">Demographics (5 years)</h3>
              <p>Census is expensive and logistically complex. Government runs it every 5 years. Use as stable baseline, not short-term indicator.</p>
            </div>
            <div>
              <h3 className="font-bold">Infrastructure (annual)</h3>
              <p>Projects take years to build. Annual updates capture meaningful changes without noise.</p>
            </div>
            <div>
              <h3 className="font-bold">Price data lag (30-60 days)</h3>
              <p>Legal settlement process takes time. Data providers aggregate after settlements confirmed.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">Common Mistakes</h2>
          <ul className="list-disc ml-6 space-y-2 mb-6">
            <li>Checking prices daily (updates monthly, don't obsess)</li>
            <li>Using 3-month growth to make decisions (too noisy, use 12-month)</li>
            <li>Assuming demographics changed significantly since last Census</li>
            <li>Not re-checking data before making offer (always get latest)</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">FAQs</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-bold">How current is Suburb Intel's data?</h3>
              <p className="text-sm">Prices and yields updated monthly. Demographics from 2021 Census. Infrastructure annually. <Link href="/data-sources" className="text-teal-600">View all sources →</Link></p>
            </div>
            <div>
              <h3 className="font-bold">Should I wait for next month's data before buying?</h3>
              <p className="text-sm">No. If property fundamentals are strong, don't delay for 1 month of data. Use current data to make decision.</p>
            </div>
            <div>
              <h3 className="font-bold">When will 2026 Census data be available?</h3>
              <p className="text-sm">Census runs August 2026. Results typically released 6-12 months later (mid-2027).</p>
            </div>
          </div>

          <div className="mt-8 bg-teal-500 text-white p-6 rounded-lg text-center">
            <h3 className="font-bold mb-2">Always Up-to-Date Suburb Data</h3>
            <Link href="/search" className="inline-block bg-white text-teal-600 px-6 py-2 rounded-lg font-semibold mt-2">Search Suburbs →</Link>
          </div>
        </article>

        <p className="mt-6 text-sm text-gray-600">
          <strong>Related:</strong> <Link href="/methodology" className="text-teal-600">→ Our Methodology</Link> | <Link href="/data-sources" className="text-teal-600">→ Data Sources</Link>
        </p>
      </div>
    </div>
  )
}
