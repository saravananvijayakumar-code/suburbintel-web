import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Property Market Cycles Australia - Boom, Peak, Downturn, Recovery',
  description: 'Understanding Australian property cycles: 7-10 year patterns, how to identify phases, and optimal buying/selling timing strategies.',
  alternates: { canonical: '/guides/property-market-cycles-australia' },
}

export default function GuideMarketCyclesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/">Home</Link> / <Link href="/guides">Guides</Link> / Property Market Cycles
        </nav>

        <article className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">Property Market Cycles in Australia</h1>
          
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
            <p className="text-teal-900"><strong>TL;DR:</strong> Australian property markets follow 7-10 year cycles: Recovery (1-2 years) → Boom (2-3 years) → Peak (6-12 months) → Downturn (2-4 years). Best buying: Late downturn/early recovery. Best selling: Late boom/early peak. No two cycles identical.</p>
          </div>

          <h2 className="text-2xl font-bold mb-3">The Four Phases</h2>
          <div className="space-y-4 mb-8">
            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
              <h3 className="text-xl font-bold text-green-900 mb-2">Phase 1: Recovery (1-2 years)</h3>
              <p className="text-sm mb-3"><strong>What's happening:</strong> Market bottomed. Early buyers entering. Prices stable or slowly rising.</p>
              <ul className="text-sm space-y-1 mb-3">
                <li>📊 Price growth: 0-5% annually</li>
                <li>⏱️ Days on market: 60-90</li>
                <li>🏠 Auction clearance: 50-60%</li>
                <li>💰 Credit: Banks easing lending</li>
              </ul>
              <p className="text-xs text-green-800 font-bold">🎯 BEST TIME TO BUY: Late recovery phase</p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Phase 2: Boom (2-3 years)</h3>
              <p className="text-sm mb-3"><strong>What's happening:</strong> Strong demand. Prices rising rapidly. FOMO kicking in. Media coverage intense.</p>
              <ul className="text-sm space-y-1 mb-3">
                <li>📊 Price growth: 8-20% annually</li>
                <li>⏱️ Days on market: 20-40</li>
                <li>🏠 Auction clearance: 70-85%</li>
                <li>💰 Credit: Easy to obtain</li>
              </ul>
              <p className="text-xs text-blue-800">⚠️ Risky buying period: Prices may have peaked</p>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
              <h3 className="text-xl font-bold text-orange-900 mb-2">Phase 3: Peak (6-12 months)</h3>
              <p className="text-sm mb-3"><strong>What's happening:</strong> Prices at maximum. First signs of slowdown. Some properties sitting unsold.</p>
              <ul className="text-sm space-y-1 mb-3">
                <li>📊 Price growth: 0-3% (slowing)</li>
                <li>⏱️ Days on market: 40-60 (increasing)</li>
                <li>🏠 Auction clearance: 60-70% (declining)</li>
                <li>💰 Credit: Banks tightening</li>
              </ul>
              <p className="text-xs text-orange-800 font-bold">🎯 BEST TIME TO SELL: Before peak passes</p>
            </div>

            <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
              <h3 className="text-xl font-bold text-red-900 mb-2">Phase 4: Downturn (2-4 years)</h3>
              <p className="text-sm mb-3"><strong>What's happening:</strong> Prices falling. Sellers outnumber buyers. Media pessimism. Fear dominates.</p>
              <ul className="text-sm space-y-1 mb-3">
                <li>📊 Price growth: -5% to -15% annually</li>
                <li>⏱️ Days on market: 90-150+</li>
                <li>🏠 Auction clearance: 40-55%</li>
                <li>💰 Credit: Very tight lending</li>
              </ul>
              <p className="text-xs text-red-800">❌ Avoid buying early downturn. ✅ Start buying late downturn.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">Recent Australian Cycles</h2>
          <div className="bg-gray-100 p-6 rounded-lg mb-6">
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-bold">2012-2017: Sydney/Melbourne Boom</p>
                <p>Recovery 2012-2013 → Boom 2013-2017 → Peak 2017 → Downturn 2018-2019</p>
              </div>
              <div>
                <p className="font-bold">2020-2022: COVID Boom</p>
                <p>Recovery Mar-Dec 2020 → Boom 2021-early 2022 → Peak mid-2022 → Downturn late 2022-2023</p>
              </div>
              <div>
                <p className="font-bold">2024-?: Current Phase</p>
                <p>Depends on location. Most capital cities in early recovery phase (late 2023-2024).</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">How to Identify Current Phase</h2>
          <ul className="list-disc ml-6 space-y-2 mb-6 text-sm">
            <li><strong>Check auction clearance rates:</strong> &gt;70% = boom. &lt;50% = downturn.</li>
            <li><strong>Monitor days on market:</strong> Increasing = market softening. Decreasing = strengthening.</li>
            <li><strong>Track price growth:</strong> 12-month trends show direction.</li>
            <li><strong>Read RBA statements:</strong> Rate rises = downturn likely. Rate cuts = recovery.</li>
            <li><strong>Watch lending standards:</strong> Tightening = peak/downturn. Easing = recovery.</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">Optimal Timing Strategies</h2>
          <div className="space-y-3 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-green-900 mb-2">For Buyers</h3>
              <p className="text-sm">✅ <strong>Best:</strong> Late downturn or early recovery (maximum value, less competition)</p>
              <p className="text-sm">⚠️ <strong>OK:</strong> Mid-recovery (still good value, increasing competition)</p>
              <p className="text-sm">❌ <strong>Avoid:</strong> Peak or early boom (paying top dollar, downside risk)</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">For Sellers</h3>
              <p className="text-sm">✅ <strong>Best:</strong> Late boom or early peak (maximum prices, strong demand)</p>
              <p className="text-sm">⚠️ <strong>OK:</strong> Mid-boom (still good prices, but not peak)</p>
              <p className="text-sm">❌ <strong>Avoid:</strong> Downturn (will take discount, extended selling time)</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">Common Mistakes</h2>
          <ul className="list-disc ml-6 space-y-2 mb-6">
            <li>Assuming cycles happen at same time in all cities (they don't - Sydney leads, others lag)</li>
            <li>Trying to time the exact bottom/peak (impossible - aim for "late downturn" zone)</li>
            <li>Panic selling in downturn (if you can hold, wait for recovery)</li>
            <li>Buying peak thinking "this time is different" (it rarely is)</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">Important Caveats</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 text-sm">
            <ul className="space-y-2">
              <li>• Cycles are <strong>not identical</strong> - length and magnitude vary</li>
              <li>• Different cities = different cycles (Sydney ≠ Perth ≠ Brisbane)</li>
              <li>• External shocks can disrupt cycles (GFC, COVID, rate shocks)</li>
              <li>• Government policy heavily influences cycles (grants, tax, lending rules)</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mb-3">FAQs</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-bold">How long do cycles last?</h3>
              <p className="text-sm">7-10 years on average. But can be as short as 5 or as long as 12 depending on economic factors.</p>
            </div>
            <div>
              <h3 className="font-bold">Do all suburbs follow the same cycle?</h3>
              <p className="text-sm">Generally yes within a city, but premium suburbs often lead by 6-12 months.</p>
            </div>
            <div>
              <h3 className="font-bold">Can you profit from timing cycles?</h3>
              <p className="text-sm">Yes, but hard to execute perfectly. Better strategy: Buy good suburbs in downturns, hold long-term.</p>
            </div>
          </div>

          <div className="mt-8 bg-teal-500 text-white p-6 rounded-lg text-center">
            <h3 className="font-bold mb-2">Track Market Trends Across 14,548 Suburbs</h3>
            <Link href="/search" className="inline-block bg-white text-teal-600 px-6 py-2 rounded-lg font-semibold mt-2">Search Suburbs →</Link>
          </div>
        </article>
      </div>
    </div>
  )
}
