import prisma from '@/lib/prisma'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Props = {
  params: { state: string }
}

const stateNames: Record<string, string> = {
  nsw: 'New South Wales',
  vic: 'Victoria',
  qld: 'Queensland',
  wa: 'Western Australia',
  sa: 'South Australia',
  tas: 'Tasmania',
  act: 'Australian Capital Territory',
  nt: 'Northern Territory',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const stateCode = params.state.toUpperCase()
  const stateName = stateNames[params.state.toLowerCase()] || stateCode
  
  return {
    title: `${stateName} Suburbs - Median Prices, Yields & Investment Scores`,
    description: `Browse all ${stateName} suburbs with median prices, rental yields, growth rates, and investment analysis. Find the best suburbs to invest in ${stateCode}.`,
    alternates: { canonical: `/suburbs/${params.state.toLowerCase()}` },
  }
}

export async function generateStaticParams() {
  return Object.keys(stateNames).map((state) => ({ state }))
}

export default async function StateSuburbsPage({ params }: Props) {
  const stateCode = params.state.toUpperCase()
  const stateName = stateNames[params.state.toLowerCase()]
  
  if (!stateName) {
    notFound()
  }

  const suburbs = await prisma.suburbs.findMany({
    where: { state: stateCode },
    select: {
      name: true,
      state: true,
      postcode: true,
      medianPrice: true,
      rentalYield: true,
      growth12m: true,
      investmentScore: true,
      dataQuality: true,
    },
    orderBy: { investmentScore: 'desc' },
    take: 100, // Top 100 for initial display
  })

  const totalCount = await prisma.suburbs.count({
    where: { state: stateCode },
  })

  const avgPrice = await prisma.suburbs.aggregate({
    where: { state: stateCode },
    _avg: { medianPrice: true, rentalYield: true, growth12m: true },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/">Home</Link> / <Link href="/suburbs">Suburbs</Link> / {stateName}
        </nav>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">{stateName} Suburbs</h1>
          <p className="text-gray-600 mb-6">
            {totalCount.toLocaleString()} suburbs in {stateCode}. Browse by investment score, median price, rental yield, or growth rate.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Avg Median Price</p>
              <p className="text-2xl font-bold">${(avgPrice._avg.medianPrice || 0).toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Avg Rental Yield</p>
              <p className="text-2xl font-bold">{(avgPrice._avg.rentalYield || 0).toFixed(2)}%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Avg 12m Growth</p>
              <p className="text-2xl font-bold">{(avgPrice._avg.growth12m || 0).toFixed(1)}%</p>
            </div>
          </div>

          <div className="mb-6">
            <Link href="/search" className="inline-block bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold mr-4">
              Advanced Search
            </Link>
            <Link href="/compare" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
              Compare Suburbs
            </Link>
          </div>

          <h2 className="text-2xl font-bold mb-4">Top {suburbs.length} Suburbs in {stateCode} (by Investment Score)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3">Suburb</th>
                  <th className="text-right p-3">Median Price</th>
                  <th className="text-right p-3">Yield</th>
                  <th className="text-right p-3">12m Growth</th>
                  <th className="text-right p-3">Score</th>
                  <th className="text-right p-3">Quality</th>
                </tr>
              </thead>
              <tbody>
                {suburbs.map((suburb: any) => (
                  <tr key={`${suburb.name}-${suburb.postcode}`} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <Link href={`/suburb/${suburb.name.toLowerCase().replace(/\s+/g, '-')}`} className="text-teal-600 font-semibold hover:underline">
                        {suburb.name} {suburb.postcode}
                      </Link>
                    </td>
                    <td className="text-right p-3">${suburb.medianPrice?.toLocaleString() || 'N/A'}</td>
                    <td className="text-right p-3">{suburb.rentalYield ? `${suburb.rentalYield.toFixed(2)}%` : 'N/A'}</td>
                    <td className="text-right p-3">
                      <span className={suburb.growth12m && suburb.growth12m > 0 ? 'text-green-600' : 'text-red-600'}>
                        {suburb.growth12m ? `${suburb.growth12m > 0 ? '+' : ''}${suburb.growth12m.toFixed(1)}%` : 'N/A'}
                      </span>
                    </td>
                    <td className="text-right p-3 font-bold">{suburb.investmentScore || 'N/A'}</td>
                    <td className="text-right p-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        suburb.dataQuality === 'HIGH' ? 'bg-green-100 text-green-800' :
                        suburb.dataQuality === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {suburb.dataQuality || 'LOW'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalCount > 100 && (
            <p className="text-sm text-gray-600 mt-4">
              Showing top 100 of {totalCount.toLocaleString()} suburbs. Use <Link href="/search" className="text-teal-600 font-semibold">Advanced Search</Link> to view all.
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">About {stateName} Property Market</h2>
          <p className="text-gray-600 mb-4">
            {stateName} has {totalCount.toLocaleString()} suburbs tracked in our database. The average median price is ${(avgPrice._avg.medianPrice || 0).toLocaleString()}, with an average rental yield of {(avgPrice._avg.rentalYield || 0).toFixed(2)}% and 12-month growth of {(avgPrice._avg.growth12m || 0).toFixed(1)}%.
          </p>
          <p className="text-gray-600">
            Use our platform to find the best {stateName} suburbs for your investment strategy, whether you're targeting capital growth, rental yield, or balanced returns.
          </p>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://suburbintel.com' },
            { '@type': 'ListItem', position: 2, name: 'Suburbs', item: 'https://suburbintel.com/suburbs' },
            { '@type': 'ListItem', position: 3, name: stateName, item: `https://suburbintel.com/suburbs/${params.state.toLowerCase()}` },
          ],
        }),
      }} />
    </div>
  )
}
