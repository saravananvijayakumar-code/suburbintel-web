import prisma from '@/lib/prisma'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Australian Suburbs - Browse 14,548+ Suburbs | Suburb Intel',
  description: 'Complete directory of Australian suburbs across NSW, VIC, QLD, WA, SA, TAS, ACT, NT. Browse by state, search by name, or view curated lists of top-performing suburbs.',
  alternates: { canonical: '/suburbs' },
}

export default async function SuburbsHubPage() {
  const stats = await prisma.suburbs.groupBy({
    by: ['state'],
    _count: { state: true },
    orderBy: { state: 'asc' },
  })

  const totalSuburbs = stats.reduce((acc: number, s: any) => acc + s._count.state, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/">Home</Link> / Suburbs
        </nav>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">All Australian Suburbs</h1>
          <p className="text-gray-600 mb-6">
            Browse {totalSuburbs.toLocaleString()} suburbs across Australia. View median prices, rental yields, growth rates, demographics, and investment scores.
          </p>

          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
            <p className="text-sm text-teal-900">
              <strong>New to suburb research?</strong> Start with our curated lists below, or use the search tool to find suburbs by price, yield, or growth.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link href="/search" className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold text-center">
              🔍 Advanced Search & Filters
            </Link>
            <Link href="/compare" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-center">
              ⚖️ Compare Suburbs
            </Link>
          </div>

          <h2 className="text-2xl font-bold mb-4">Browse by State</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat: any) => (
              <Link
                key={stat.state}
                href={`/suburbs/${stat.state.toLowerCase()}`}
                className="bg-gradient-to-br from-blue-50 to-teal-50 p-6 rounded-lg border-2 border-blue-200 hover:border-teal-500 transition"
              >
                <h3 className="text-xl font-bold mb-2">{stat.state}</h3>
                <p className="text-gray-600">{stat._count.state.toLocaleString()} suburbs</p>
              </Link>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4">Curated Suburb Lists</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Link href="/best-suburbs" className="bg-green-50 p-6 rounded-lg border-2 border-green-200 hover:border-green-500 transition">
              <h3 className="text-lg font-bold mb-2">🏆 Best Overall Suburbs</h3>
              <p className="text-sm text-gray-600">Top investment scores across all metrics</p>
            </Link>
            <Link href="/best-suburbs/high-growth" className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200 hover:border-blue-500 transition">
              <h3 className="text-lg font-bold mb-2">📈 High Growth Suburbs</h3>
              <p className="text-sm text-gray-600">Strongest capital appreciation (8-12% annual)</p>
            </Link>
            <Link href="/best-suburbs/high-yield" className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200 hover:border-purple-500 transition">
              <h3 className="text-lg font-bold mb-2">💰 High Yield Suburbs</h3>
              <p className="text-sm text-gray-600">Best rental returns (5-8% yields)</p>
            </Link>
            <Link href="/best-suburbs/affordable" className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200 hover:border-orange-500 transition">
              <h3 className="text-lg font-bold mb-2">💵 Affordable Suburbs</h3>
              <p className="text-sm text-gray-600">Entry-level prices with growth potential</p>
            </Link>
            <Link href="/best-suburbs/family-friendly" className="bg-pink-50 p-6 rounded-lg border-2 border-pink-200 hover:border-pink-500 transition">
              <h3 className="text-lg font-bold mb-2">👨‍👩‍👧‍👦 Family-Friendly Suburbs</h3>
              <p className="text-sm text-gray-600">Great schools, parks, low crime</p>
            </Link>
            <Link href="/best-suburbs/first-home-buyer" className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200 hover:border-yellow-500 transition">
              <h3 className="text-lg font-bold mb-2">🏡 First Home Buyer Suburbs</h3>
              <p className="text-sm text-gray-600">Affordable entry points with amenities</p>
            </Link>
          </div>

          <h2 className="text-2xl font-bold mb-4">Understanding Suburb Data</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/methodology" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
              <h3 className="font-bold mb-2">📊 Our Methodology</h3>
              <p className="text-sm text-gray-600">How we calculate scores & ratings</p>
            </Link>
            <Link href="/data-sources" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
              <h3 className="font-bold mb-2">🔗 Data Sources</h3>
              <p className="text-sm text-gray-600">Where our data comes from</p>
            </Link>
            <Link href="/guides/how-to-analyze-a-suburb" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
              <h3 className="font-bold mb-2">📖 Analysis Guide</h3>
              <p className="text-sm text-gray-600">Learn to evaluate suburbs</p>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-2">How many suburbs are in the database?</h3>
              <p className="text-sm text-gray-600">We cover {totalSuburbs.toLocaleString()} suburbs across all Australian states and territories, updated monthly with the latest price, yield, and demographic data.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">How do I find suburbs in my budget?</h3>
              <p className="text-sm text-gray-600">Use the <Link href="/search" className="text-teal-600">Advanced Search</Link> tool to filter by price range, state, and other criteria. You can also sort by investment score, growth, or yield.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">What data is available for each suburb?</h3>
              <p className="text-sm text-gray-600">Median prices, rental yields, growth rates, demographics (population, income, families), infrastructure scores (schools, transport, healthcare), and investment analysis.</p>
            </div>
          </div>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'All Australian Suburbs',
          description: `Browse ${totalSuburbs.toLocaleString()} suburbs across Australia with median prices, rental yields, and investment scores.`,
          url: 'https://suburbintel.com/suburbs',
        }),
      }} />
    </div>
  )
}
