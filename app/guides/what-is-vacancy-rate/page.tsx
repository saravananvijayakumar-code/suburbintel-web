import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'What is Vacancy Rate? - Rental Market Supply Indicator Explained',
  description: 'Vacancy rate definition, formula, and what percentages mean for property investors. Learn how to interpret vacancy rates when analyzing suburbs.',
  alternates: { canonical: '/guides/what-is-vacancy-rate' },
}

export default function GuideVacancyRatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/">Home</Link> / <Link href="/guides">Guides</Link> / What is Vacancy Rate?
        </nav>

        <article className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">What is Vacancy Rate?</h1>
          
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
            <p className="text-teal-900"><strong>TL;DR:</strong> Vacancy rate is the percentage of rental properties sitting empty at a given time. Formula: (Vacant Properties / Total Rental Properties) × 100. Low vacancy (&lt;2%) = high demand. High vacancy (&gt;4%) = oversupply. Ideal for investors: 2-3%.</p>
          </div>

          <h2 className="text-2xl font-bold mb-3">The Formula</h2>
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <code className="text-lg">Vacancy Rate (%) = (Vacant Rentals / Total Rentals) × 100</code>
          </div>

          <h2 className="text-2xl font-bold mb-3">What Different Rates Mean</h2>
          <div className="space-y-3 mb-6">
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <p className="font-bold text-red-900">&lt;1%: Extremely Tight Market</p>
              <p className="text-sm text-red-800">Severe rental shortage. Tenants desperate. Landlords can increase rents aggressively. Risk: unsustainable, may correct rapidly.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="font-bold text-green-900">1-2%: Strong Demand</p>
              <p className="text-sm text-green-800">Healthy rental market. Low risk of extended vacancies. Good for investors. Rents likely to increase.</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="font-bold text-blue-900">2-3%: Balanced Market</p>
              <p className="text-sm text-blue-800">Ideal vacancy rate. Supply meets demand. Properties rent within reasonable timeframe. Rents stable.</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <p className="font-bold text-yellow-900">3-4%: Softening Market</p>
              <p className="text-sm text-yellow-800">Increasing supply. May take longer to find tenants. Downward pressure on rents. Investors should be cautious.</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
              <p className="font-bold text-orange-900">&gt;4%: Oversupply</p>
              <p className="text-sm text-orange-800">Too many rentals, not enough tenants. Extended vacancy risk. Rents falling. Avoid investing until supply normalizes.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">Why Vacancy Rate Matters for Investors</h2>
          <ul className="list-disc ml-6 space-y-2 mb-6">
            <li><strong>Cash flow risk:</strong> High vacancy = higher chance of unpaid weeks</li>
            <li><strong>Rent pricing power:</strong> Low vacancy = you can charge more</li>
            <li><strong>Time to tenant:</strong> Low vacancy = faster re-letting</li>
            <li><strong>Market direction indicator:</strong> Rising vacancy = weakening market</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">Common Mistakes</h2>
          <ul className="list-disc ml-6 space-y-2 mb-6">
            <li>Buying in oversupplied markets (&gt;4% vacancy) hoping for turnaround</li>
            <li>Ignoring vacancy trends (is it improving or worsening?)</li>
            <li>Not factoring vacancy into cash flow calculations</li>
            <li>Assuming low vacancy will last forever (markets cycle)</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">Where to Find Vacancy Data</h2>
          <ul className="list-disc ml-6 space-y-2 mb-6 text-sm">
            <li><strong>SQM Research:</strong> Publishes monthly vacancy rates by suburb (free)</li>
            <li><strong>Domain / Realestate.com.au:</strong> Rental market reports</li>
            <li><strong>Real estate agents:</strong> Ask local agents for their vacancy stats</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">FAQs</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-bold">What's the ideal vacancy rate for investors?</h3>
              <p className="text-sm">2-3%. Balanced market with low risk of extended vacancies.</p>
            </div>
            <div>
              <h3 className="font-bold">Does low vacancy always mean good investment?</h3>
              <p className="text-sm">No. Check if it's due to genuine demand or supply constraints. Verify rental yields and capital growth potential.</p>
            </div>
            <div>
              <h3 className="font-bold">How often does vacancy rate change?</h3>
              <p className="text-sm">Monthly fluctuations are normal. Track 6-12 month trends, not single data points.</p>
            </div>
          </div>

          <div className="mt-8 bg-teal-500 text-white p-6 rounded-lg text-center">
            <h3 className="font-bold mb-2">Research Suburbs with Strong Rental Demand</h3>
            <Link href="/best-suburbs/high-yield" className="inline-block bg-white text-teal-600 px-6 py-2 rounded-lg font-semibold mt-2">View High-Yield Suburbs →</Link>
          </div>
        </article>
      </div>
    </div>
  )
}
