import type { Metadata } from 'next'
import Link from 'next/link'
import { Map, CheckCircle, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How to Analyze a Suburb - Complete Guide | Suburb Intel',
  description: 'Step-by-step framework for analyzing Australian suburbs. Learn what metrics matter, red flags to avoid, and how to make data-driven property decisions.',
  alternates: { canonical: '/guides/how-to-analyze-a-suburb' },
}

export default function GuideAnalyzeSuburbPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/">Home</Link> <span className="mx-2">/</span>
          <Link href="/guides" className="hover:text-teal-600">Guides</Link> <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">How to Analyze a Suburb</span>
        </nav>

        <article className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How to Analyze a Suburb</h1>
          <p className="text-xl text-gray-600 mb-6">A systematic framework for evaluating investment potential</p>

          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-8">
            <p className="text-sm text-teal-900">
              <strong>TL;DR:</strong> Effective suburb analysis requires checking 5 key areas: pricing trends (12m growth), rental yields, demographics (income, families %), infrastructure (transport, schools), and data quality. Use official government data (ABS, state property sales) and verify with at least 50+ sales for reliability.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 1: Check Price Trends</h2>
            <p className="text-gray-700 mb-4">
              Start with median prices and growth rates. Look for:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li><strong>Median price:</strong> Current market value (houses vs units)</li>
              <li><strong>12-month growth:</strong> &gt;5% is strong, &gt;10% is exceptional</li>
              <li><strong>Consistency:</strong> Check 3m, 6m, 12m trends - steady growth beats volatility</li>
              <li><strong>Comparison:</strong> How does it stack up against state/national averages?</li>
            </ul>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
              <p className="text-sm text-yellow-900">
                ⚠️ <strong>Warning:</strong> High growth can indicate a bubble. Cross-check with economic fundamentals.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 2: Calculate Rental Yield</h2>
            <p className="text-gray-700 mb-4">
              Formula: <code className="bg-gray-100 px-2 py-1 rounded">(Weekly Rent × 52) / Median Price × 100</code>
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-2">Yield Benchmarks:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• &lt;3%: Low yield (growth-focused markets like Sydney CBD)</li>
                <li>• 3-5%: Moderate yield (balanced markets)</li>
                <li>• &gt;5%: High yield (regional/high-demand rental areas)</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              <Link href="/guides/how-to-calculate-rental-yield-australia" className="text-teal-600 hover:underline">→ Detailed rental yield guide</Link>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 3: Review Demographics</h2>
            <p className="text-gray-700 mb-4">
              Census data reveals who lives there and economic health:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li><strong>Median household income:</strong> Higher income = higher property demand</li>
              <li><strong>Families percentage:</strong> &gt;60% indicates family-friendly, stable demand</li>
              <li><strong>Population growth:</strong> Increasing population = future demand</li>
              <li><strong>Unemployment rate:</strong> &lt;5% is healthy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 4: Assess Infrastructure</h2>
            <p className="text-gray-700 mb-4">
              Quality of life amenities drive long-term value:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-bold text-blue-900 mb-2">✅ Strong Infrastructure</p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Train station &lt;1 km</li>
                  <li>• Top-rated schools</li>
                  <li>• Major shopping centers</li>
                  <li>• Hospital &lt;5 km</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-bold text-red-900 mb-2">⚠️ Weak Infrastructure</p>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• No public transport</li>
                  <li>• Limited schools</li>
                  <li>• Long commute times</li>
                  <li>• Few amenities</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 5: Verify Data Quality</h2>
            <p className="text-gray-700 mb-4">
              Not all suburb data is equally reliable. Check:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li><strong>Sales volume:</strong> &gt;50 sales/year = reliable median. &lt;20 = use caution</li>
              <li><strong>Data source:</strong> Government data (ABS, Valuer General) &gt; real estate portals</li>
              <li><strong>Last updated:</strong> Data &gt;6 months old may be outdated</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Mistakes to Avoid</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-red-50 p-4 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-red-900">Relying on a single metric</p>
                  <p className="text-sm text-red-800">High growth alone doesn't make a good investment. Balance growth, yield, and risk.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-red-50 p-4 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-red-900">Ignoring data quality</p>
                  <p className="text-sm text-red-800">Small sample sizes lead to unreliable medians. Verify sales volume first.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-red-50 p-4 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-red-900">Skipping local research</p>
                  <p className="text-sm text-red-800">Data shows trends, but visit the suburb. Check for industrial zones, flood risks, crime.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">FAQs</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">How many suburbs should I analyze?</h3>
                <p className="text-gray-700 text-sm">Shortlist 10-20 based on budget and strategy. Deep-dive on top 3-5.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Is historical data reliable for predictions?</h3>
                <p className="text-gray-700 text-sm">It shows trends, but property markets change. Use as one input, not the only factor.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">What's the fastest way to compare suburbs?</h3>
                <p className="text-gray-700 text-sm">Use <Link href="/compare" className="text-teal-600 hover:underline">Suburb Intel's comparison tool</Link> for side-by-side metrics.</p>
              </div>
            </div>
          </section>

          <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">Analyze 14,548 Australian Suburbs</h3>
            <p className="mb-4 opacity-90 text-sm">Get instant access to all metrics, charts, and AI insights</p>
            <Link href="/search" className="inline-block bg-white text-teal-600 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition">
              Start Analyzing →
            </Link>
          </div>
        </article>

        <div className="mt-8 text-sm text-gray-600">
          <p className="mb-2"><strong>Related Guides:</strong></p>
          <div className="flex flex-wrap gap-4">
            <Link href="/guides/how-to-compare-suburbs" className="text-teal-600 hover:underline">→ How to Compare Suburbs</Link>
            <Link href="/guides/red-flags-in-suburb-data" className="text-teal-600 hover:underline">→ Red Flags to Avoid</Link>
            <Link href="/methodology" className="text-teal-600 hover:underline">→ Our Methodology</Link>
          </div>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'How to Analyze a Suburb for Property Investment',
          description: 'Step-by-step guide for analyzing Australian suburbs using official data',
          step: [
            { '@type': 'HowToStep', name: 'Check price trends', text: 'Review median prices and 12-month growth rates' },
            { '@type': 'HowToStep', name: 'Calculate rental yield', text: 'Use formula: (Weekly Rent × 52) / Median Price × 100' },
            { '@type': 'HowToStep', name: 'Review demographics', text: 'Check Census data for income, families %, population growth' },
            { '@type': 'HowToStep', name: 'Assess infrastructure', text: 'Evaluate transport, schools, hospitals, amenities' },
            { '@type': 'HowToStep', name: 'Verify data quality', text: 'Ensure 50+ sales volume and recent data updates' },
          ],
        }),
      }} />
    </div>
  )
}
