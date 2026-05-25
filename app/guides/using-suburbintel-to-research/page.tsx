import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Use Suburb Intel - Platform Guide & Best Practices',
  description: 'Complete guide to researching suburbs on Suburb Intel: search strategies, filtering, comparing suburbs, interpreting data, and export features.',
  alternates: { canonical: '/guides/using-suburbintel-to-research' },
}

export default function GuideUsingPlatformPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/">Home</Link> / <Link href="/guides">Guides</Link> / Using Suburb Intel
        </nav>

        <article className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">How to Use Suburb Intel</h1>
          
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
            <p className="text-teal-900"><strong>TL;DR:</strong> Search → Filter by budget/state → Sort by investment score → Review top 10-20 → Compare 3-5 finalists → Deep-dive reports → Export shortlist. Use data quality indicators. Cross-reference with physical inspections.</p>
          </div>

          <h2 className="text-2xl font-bold mb-3">Step-by-Step Research Workflow</h2>

          <div className="space-y-6 mb-8">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Step 1: Define Your Criteria</h3>
              <p className="text-sm mb-2">Before searching, answer:</p>
              <ul className="text-sm space-y-1">
                <li>• Budget range (e.g., $500K-$700K)</li>
                <li>• Target state(s) (NSW, VIC, QLD, etc.)</li>
                <li>• Strategy: Growth or yield focused?</li>
                <li>• Property type: House or unit?</li>
                <li>• Must-haves: Schools? Transport? Amenities?</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-bold text-green-900 mb-2">Step 2: Use Search & Filters</h3>
              <p className="text-sm mb-2">Go to <Link href="/search" className="text-teal-600 font-semibold">/search</Link> and:</p>
              <ul className="text-sm space-y-1">
                <li>• Enter price range in filters</li>
                <li>• Select state (or leave blank for all)</li>
                <li>• Sort by "Investment Score" (default)</li>
                <li>• Apply minimum rental yield if cash flow focused</li>
                <li>• Filter by population size if needed</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-bold text-purple-900 mb-2">Step 3: Review Top Candidates</h3>
              <p className="text-sm mb-2">Scan the first 20-30 results for:</p>
              <ul className="text-sm space-y-1">
                <li>• Investment Score (70+ = strong)</li>
                <li>• Balanced metrics (growth + yield + demographics)</li>
                <li>• Data quality indicator (HIGH or MEDIUM only)</li>
                <li>• State/region familiarity (if relevant)</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-xl font-bold text-orange-900 mb-2">Step 4: Compare 3-5 Finalists</h3>
              <p className="text-sm mb-2">Use <Link href="/compare" className="text-teal-600 font-semibold">/compare</Link> tool to:</p>
              <ul className="text-sm space-y-1">
                <li>• View side-by-side metrics</li>
                <li>• Check price/yield/growth trends</li>
                <li>• Compare demographics & infrastructure</li>
                <li>• Identify clear winner or narrow to 2</li>
              </ul>
            </div>

            <div className="border-l-4 border-red-500 pl-6">
              <h3 className="text-xl font-bold text-red-900 mb-2">Step 5: Deep-Dive Suburb Reports</h3>
              <p className="text-sm mb-2">Click into individual suburb pages (/suburb/[name]) to see:</p>
              <ul className="text-sm space-y-1">
                <li>• Detailed price history & trends</li>
                <li>• Investment analysis (strengths/weaknesses)</li>
                <li>• Demographics breakdown</li>
                <li>• Infrastructure quality scores</li>
                <li>• Similar suburbs in area</li>
              </ul>
            </div>

            <div className="border-l-4 border-teal-500 pl-6">
              <h3 className="text-xl font-bold text-teal-900 mb-2">Step 6: Export & Cross-Reference</h3>
              <p className="text-sm mb-2">For Pro/Enterprise users:</p>
              <ul className="text-sm space-y-1">
                <li>• Export shortlist to Excel/CSV</li>
                <li>• Add custom notes & columns</li>
                <li>• Share with partner/advisor</li>
                <li>• Schedule physical inspections</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">Understanding Key Features</h2>

          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">Investment Score (0-100)</h3>
              <p className="text-sm">Weighted composite: 35% growth + 25% yield + 15% affordability + 15% demographics + 10% infrastructure. Higher = better overall opportunity. <Link href="/methodology" className="text-blue-600">View methodology →</Link></p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-green-900 mb-2">Data Quality Indicator</h3>
              <p className="text-sm"><strong>HIGH:</strong> 50+ sales/year. <strong>MEDIUM:</strong> 20-50 sales. <strong>LOW:</strong> &lt;20 sales. Only trust HIGH/MEDIUM suburbs.</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold text-purple-900 mb-2">Growth Metrics</h3>
              <p className="text-sm">3-month, 6-month, 12-month growth shown. Trust 12-month more (less noise). Check consistency across periods.</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-bold text-orange-900 mb-2">Infrastructure Scores</h3>
              <p className="text-sm">Schools, transport, healthcare rated 0-10. Based on quantity, quality, and proximity. 7+ = excellent.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">Best Practices</h2>
          <ul className="list-disc ml-6 space-y-2 mb-6 text-sm">
            <li><strong>Start broad, narrow down:</strong> Don't filter too aggressively at start</li>
            <li><strong>Check multiple metrics:</strong> High score alone isn't enough - verify data quality</li>
            <li><strong>Use comparison tool:</strong> Don't just trust scores - compare directly</li>
            <li><strong>Physical inspection mandatory:</strong> Platform finds candidates, YOU validate in person</li>
            <li><strong>Re-check before offer:</strong> Data updates monthly, verify latest before committing</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">Common Platform Mistakes</h2>
          <ul className="list-disc ml-6 space-y-2 mb-6 text-sm">
            <li>Trusting "LOW" data quality suburbs (unreliable medians)</li>
            <li>Not using comparison tool (missing relative performance)</li>
            <li>Filtering too early (might miss hidden gems)</li>
            <li>Focusing only on investment score (check individual metrics)</li>
            <li>Not reading investment analysis section (context matters)</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">Premium Features</h2>
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-lg mb-6">
            <h3 className="font-bold mb-3">Unlock with Pro/Enterprise:</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ <strong>Advanced filters:</strong> Custom scoring weights, multi-criteria</li>
              <li>✅ <strong>Export to Excel:</strong> Build custom analysis spreadsheets</li>
              <li>✅ <strong>Price alerts:</strong> Get notified when suburbs hit target metrics</li>
              <li>✅ <strong>Historical data:</strong> 10+ year price trends & charts</li>
              <li>✅ <strong>API access:</strong> Integrate with your own tools (Enterprise)</li>
            </ul>
            <Link href="/pricing" className="inline-block mt-4 bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold">View Plans →</Link>
          </div>

          <h2 className="text-2xl font-bold mb-3">FAQs</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-bold">How often is data updated?</h3>
              <p className="text-sm">Prices monthly, demographics every 5 years (Census), infrastructure annually. <Link href="/guides/how-often-suburb-data-changes" className="text-teal-600">Learn more →</Link></p>
            </div>
            <div>
              <h3 className="font-bold">Can I save suburbs to a watchlist?</h3>
              <p className="text-sm">Yes, Pro/Enterprise users can save unlimited suburbs and set alerts. Free users can compare up to 3.</p>
            </div>
            <div>
              <h3 className="font-bold">What if I can't find a suburb?</h3>
              <p className="text-sm">We cover 14,548 suburbs across Australia. Try alternative spelling or check neighboring suburbs.</p>
            </div>
          </div>

          <div className="mt-8 bg-teal-500 text-white p-6 rounded-lg text-center">
            <h3 className="font-bold mb-2">Start Your Research Now</h3>
            <Link href="/search" className="inline-block bg-white text-teal-600 px-6 py-2 rounded-lg font-semibold mt-2">Search 14,548 Suburbs →</Link>
          </div>
        </article>
      </div>
    </div>
  )
}
