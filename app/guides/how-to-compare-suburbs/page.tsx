import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Compare Suburbs - Side-by-Side Analysis Guide',
  description: 'Learn how to effectively compare Australian suburbs using key metrics. Which indicators matter most and how to make apples-to-apples comparisons.',
  alternates: { canonical: '/guides/how-to-compare-suburbs' },
}

export default function GuideCompareSuburbsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/">Home</Link> / <Link href="/guides">Guides</Link> / How to Compare Suburbs
        </nav>

        <article className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">How to Compare Suburbs</h1>
          
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
            <p className="text-teal-900"><strong>TL;DR:</strong> Compare suburbs by matching on budget/property type first, then evaluate 5 metrics: price growth (12m), rental yield, demographics (income/families), infrastructure quality, and data reliability. Use side-by-side comparison for 3-5 finalists max.</p>
          </div>

          <h2 className="text-2xl font-bold mb-3">Step 1: Match on Fundamentals</h2>
          <p className="mb-4">Before comparing metrics, ensure suburbs are comparable:</p>
          <ul className="list-disc ml-6 space-y-2 mb-6">
            <li><strong>Price range:</strong> Compare suburbs within ±20% of target budget</li>
            <li><strong>Property type:</strong> Houses vs units have different dynamics</li>
            <li><strong>Location type:</strong> Metro vs regional markets behave differently</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">Step 2: Key Metrics to Compare</h2>
          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">1. Price Growth (12-month)</h3>
              <p className="text-sm">Higher = stronger demand. But check consistency across 3m, 6m periods.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">2. Rental Yield</h3>
              <p className="text-sm">Higher = better cash flow. Low yield is OK if growth is strong (capital gains strategy).</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">3. Median Income</h3>
              <p className="text-sm">Higher income = stronger buyer pool and rental demand.</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">4. Infrastructure Score</h3>
              <p className="text-sm">Schools, transport, hospitals. Better infrastructure = long-term value.</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">5. Data Quality</h3>
              <p className="text-sm">Sales volume matters. 50+ sales = reliable. &lt;20 sales = use caution.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">Step 3: Use Comparison Tools</h2>
          <p className="mb-4"><Link href="/compare" className="text-teal-600 hover:underline font-semibold">Suburb Intel's comparison tool</Link> lets you compare up to 3 suburbs side-by-side with:</p>
          <ul className="list-disc ml-6 space-y-1 mb-6 text-sm">
            <li>Median prices and growth charts</li>
            <li>Rental yields and demographics</li>
            <li>Infrastructure ratings</li>
            <li>Investment scores</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">Common Mistakes</h2>
          <ul className="list-disc ml-6 space-y-2 mb-6">
            <li>Comparing too many suburbs at once (stick to 3-5 finalists)</li>
            <li>Ignoring property type differences (houses vs units)</li>
            <li>Focusing on one metric only (balance growth + yield + risk)</li>
            <li>Not visiting the suburbs physically before deciding</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">FAQs</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-bold">How many suburbs should I compare?</h3>
              <p className="text-sm">Shortlist 10-20 based on budget, then deep-dive on top 3-5.</p>
            </div>
            <div>
              <h3 className="font-bold">Is it fair to compare Sydney vs regional NSW?</h3>
              <p className="text-sm">No. Different markets, different dynamics. Compare within same region/price tier.</p>
            </div>
          </div>

          <div className="mt-8 bg-teal-500 text-white p-6 rounded-lg text-center">
            <h3 className="font-bold mb-2">Compare Any 3 Suburbs</h3>
            <Link href="/compare" className="inline-block bg-white text-teal-600 px-6 py-2 rounded-lg font-semibold mt-2">Open Comparison Tool →</Link>
          </div>
        </article>
      </div>
    </div>
  )
}
