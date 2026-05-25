import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Suburb Growth vs Yield Strategy - Capital Gains or Cash Flow?',
  description: 'Should you target high-growth suburbs (low yield) or high-yield suburbs (slower growth)? Learn which strategy suits your investment goals.',
  alternates: { canonical: '/guides/suburb-growth-vs-yield-strategy' },
}

export default function GuideGrowthVsYieldPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/">Home</Link> / <Link href="/guides">Guides</Link> / Growth vs Yield Strategy
        </nav>

        <article className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">Suburb Growth vs Yield Strategy</h1>
          
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
            <p className="text-teal-900"><strong>TL;DR:</strong> Growth strategy targets capital appreciation (8-12% annual growth, 2-4% yield). Yield strategy targets cash flow (4-7% yield, 3-6% growth). Most investors need a portfolio balance. Growth builds wealth; yield funds lifestyle or more purchases.</p>
          </div>

          <h2 className="text-2xl font-bold mb-3">The Two Strategies</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-400">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Capital Growth Strategy</h3>
              <p className="text-sm mb-4"><strong>Goal:</strong> Maximize property value increase over time</p>
              <ul className="text-sm space-y-2">
                <li>✅ <strong>Target:</strong> Blue-chip suburbs, metro areas</li>
                <li>✅ <strong>Yield:</strong> 2-4% (low cash flow)</li>
                <li>✅ <strong>Growth:</strong> 7-12% annually</li>
                <li>✅ <strong>Hold period:</strong> 7-15 years</li>
                <li>❌ <strong>Requires:</strong> High income to cover shortfalls</li>
                <li>❌ <strong>Not passive:</strong> Negative cash flow monthly</li>
              </ul>
              <p className="text-xs mt-4 text-blue-800"><strong>Best for:</strong> High-income earners, long-term wealth building</p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-400">
              <h3 className="text-xl font-bold text-green-900 mb-3">Rental Yield Strategy</h3>
              <p className="text-sm mb-4"><strong>Goal:</strong> Maximize rental income (cash flow positive)</p>
              <ul className="text-sm space-y-2">
                <li>✅ <strong>Target:</strong> Regional areas, high-demand rentals</li>
                <li>✅ <strong>Yield:</strong> 5-8% (positive cash flow)</li>
                <li>✅ <strong>Growth:</strong> 3-6% annually</li>
                <li>✅ <strong>Hold period:</strong> 5-10 years (can sell sooner)</li>
                <li>✅ <strong>Passive income:</strong> Property pays for itself</li>
                <li>❌ <strong>Slower wealth build:</strong> Lower capital gains</li>
              </ul>
              <p className="text-xs mt-4 text-green-800"><strong>Best for:</strong> Cash flow seekers, retirees, portfolio balance</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">Total Return Comparison</h2>
          <p className="mb-4">Total return = Capital Growth + Rental Yield</p>
          <div className="bg-gray-100 p-6 rounded-lg mb-6">
            <div className="space-y-4">
              <div>
                <p className="font-bold mb-2">Growth Strategy Example (Sydney Inner West)</p>
                <p className="text-sm">Purchase: $1,200,000 | Yield: 2.5% | Growth: 10%/year</p>
                <p className="text-sm">After 10 years: Property worth ~$3.1M | Total return: 12.5%/year</p>
              </div>
              <div>
                <p className="font-bold mb-2">Yield Strategy Example (Regional QLD)</p>
                <p className="text-sm">Purchase: $450,000 | Yield: 6% | Growth: 4%/year</p>
                <p className="text-sm">After 10 years: Property worth ~$665K | Total return: 10%/year</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">Which Strategy Should You Choose?</h2>
          <div className="space-y-4 mb-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold text-purple-900 mb-2">Choose Growth If:</h3>
              <ul className="text-sm space-y-1">
                <li>• You have high stable income ($150K+ household)</li>
                <li>• You can afford negative cash flow ($500-$1,500/month)</li>
                <li>• Your goal is long-term wealth (10+ years)</li>
                <li>• You want to maximize equity for future purchases</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-bold text-orange-900 mb-2">Choose Yield If:</h3>
              <ul className="text-sm space-y-1">
                <li>• You need passive income now</li>
                <li>• You can't afford negative cash flow</li>
                <li>• You're building a cash flow portfolio (5+ properties)</li>
                <li>• You're approaching retirement</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">The Balanced Approach</h2>
          <p className="mb-4">Most successful investors use <strong>both strategies</strong>:</p>
          <ul className="list-disc ml-6 space-y-2 mb-6">
            <li><strong>Properties 1-2:</strong> Growth-focused (build equity fast)</li>
            <li><strong>Properties 3-5:</strong> Yield-focused (fund holding costs)</li>
            <li><strong>Portfolio target:</strong> 60% growth / 40% yield</li>
          </ul>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
            <p className="text-sm text-yellow-900">
              <strong>Pro Tip:</strong> Start with growth properties to build equity quickly, then use that equity to buy yield properties for cash flow.
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-3">Common Mistakes</h2>
          <ul className="list-disc ml-6 space-y-2 mb-6">
            <li>Chasing high yield without checking vacancy risk or capital growth potential</li>
            <li>Buying only growth properties and getting cash flow squeezed</li>
            <li>Not adjusting strategy as circumstances change (e.g., job loss, retirement)</li>
            <li>Ignoring tax implications (negative gearing benefits growth investors)</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">FAQs</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-bold">Can you find suburbs with both high growth AND high yield?</h3>
              <p className="text-sm">Rare but possible. Look for emerging growth corridors with strong rental demand. These opportunities don't last long.</p>
            </div>
            <div>
              <h3 className="font-bold">Does growth strategy always win long-term?</h3>
              <p className="text-sm">If you can hold for 10+ years and afford shortfalls, yes. But many investors are forced to sell during downturns due to cash flow stress.</p>
            </div>
          </div>

          <div className="mt-8 bg-teal-500 text-white p-6 rounded-lg text-center">
            <h3 className="font-bold mb-2">Find Growth or Yield Suburbs</h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <Link href="/best-suburbs" className="inline-block bg-white text-teal-600 px-6 py-2 rounded-lg font-semibold">High-Growth Suburbs →</Link>
              <Link href="/best-suburbs/high-yield" className="inline-block bg-white/20 border-2 border-white px-6 py-2 rounded-lg font-semibold">High-Yield Suburbs →</Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
