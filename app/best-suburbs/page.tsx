import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Metadata } from 'next'
import { TrendingUp, DollarSign, Home, MapPin, ArrowRight, Star, BarChart3, Shield } from 'lucide-react'

export const revalidate = 86400 // 24 hours

export const metadata: Metadata = {
  title: 'Best Suburbs to Invest in Australia 2025 | Top Growth Areas',
  description: 'Discover Australia\'s highest-growth suburbs for property investment in 2025. Data-driven analysis of 14,500+ suburbs ranked by investment potential, rental yields, and capital growth.',
  keywords: ['best suburbs to invest', 'property investment australia', 'high growth suburbs', 'where to buy property 2025', 'investment suburbs australia'],
  openGraph: {
    title: 'Best Suburbs to Invest in Australia 2025',
    description: 'Find the top suburbs for property investment. 14,500+ suburbs analyzed with growth forecasts and investment scores.',
    type: 'article',
  },
}

async function getTopSuburbs() {
  try {
    const suburbs = await prisma.suburbs.findMany({
      take: 50,
      orderBy: { investmentScore: 'desc' },
      select: {
        id: true,
        name: true,
        state: true,
        postcode: true,
        medianPrice: true,
        growth12m: true,
        rentalYield: true,
        investmentScore: true,
        population: true,
      }
    })
    return suburbs
  } catch (error) {
    console.error('Error fetching top suburbs:', error)
    return []
  }
}

export default async function BestSuburbsPage() {
  const topSuburbs = await getTopSuburbs()
  
  const formatPrice = (price: number | null) => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(price)
  }

  const formatPercent = (value: number | null) => {
    if (!value) return 'N/A'
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 bg-blue-500/20 rounded-full text-blue-200 text-sm font-medium mb-6">
              🏆 2025 Investment Guide
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Best Suburbs to Invest in <span className="text-yellow-400">Australia 2025</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Data-driven analysis of 14,500+ suburbs. Find high-growth areas with strong rental yields and capital appreciation potential.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/search" className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg">
                Search All Suburbs <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/pricing" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all border border-white/20">
                View Pro Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600">14,500+</div>
              <div className="text-gray-600 mt-1">Suburbs Analyzed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-600">8</div>
              <div className="text-gray-600 mt-1">States & Territories</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600">50+</div>
              <div className="text-gray-600 mt-1">Data Points Per Suburb</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600">Daily</div>
              <div className="text-gray-600 mt-1">Market Updates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Top 50 Suburbs Table */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top 50 Investment Suburbs in Australia
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ranked by our proprietary Investment Score combining growth potential, rental yield, infrastructure, and market fundamentals.
            </p>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-4">
            {topSuburbs.map((suburb, index) => (
              <Link
                key={suburb.id}
                href={`/suburb/${suburb.name.toLowerCase().replace(/\s+/g, '-')}-${suburb.state.toLowerCase()}-${suburb.postcode}`}
                className="block bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-sm ${index < 3 ? 'bg-yellow-500' : index < 10 ? 'bg-blue-500' : 'bg-gray-400'}`}>
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-900">{suburb.name}</h3>
                      <p className="text-sm text-gray-500">{suburb.state} {suburb.postcode}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{suburb.investmentScore}/100</div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-sm font-semibold text-gray-900">{formatPrice(suburb.medianPrice)}</div>
                    <div className="text-xs text-gray-500">Median</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className={`text-sm font-semibold ${(suburb.growth12m ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(suburb.growth12m)}
                    </div>
                    <div className="text-xs text-gray-500">Growth</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-sm font-semibold text-purple-600">{suburb.rentalYield?.toFixed(1) ?? 'N/A'}%</div>
                    <div className="text-xs text-gray-500">Yield</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Rank</th>
                  <th className="px-6 py-4 text-left font-semibold">Suburb</th>
                  <th className="px-6 py-4 text-left font-semibold">State</th>
                  <th className="px-6 py-4 text-right font-semibold">Median Price</th>
                  <th className="px-6 py-4 text-right font-semibold">Growth</th>
                  <th className="px-6 py-4 text-right font-semibold">Yield</th>
                  <th className="px-6 py-4 text-center font-semibold">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topSuburbs.map((suburb, index) => (
                  <tr key={suburb.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm ${index < 3 ? 'bg-yellow-500' : index < 10 ? 'bg-blue-500' : 'bg-gray-400'}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/suburb/${suburb.name.toLowerCase().replace(/\s+/g, '-')}-${suburb.state.toLowerCase()}-${suburb.postcode}`}
                        className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {suburb.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{suburb.state} {suburb.postcode}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">{formatPrice(suburb.medianPrice)}</td>
                    <td className={`px-6 py-4 text-right font-semibold ${(suburb.growth12m ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(suburb.growth12m)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-purple-600">{suburb.rentalYield?.toFixed(1) ?? 'N/A'}%</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold">
                        {suburb.investmentScore}/100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8">
            <Link href="/search" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
              View All 14,500+ Suburbs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Investment Factors Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How We Rank Suburbs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our Investment Score combines multiple data points to give you a comprehensive view of each suburb's potential.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Capital Growth</h3>
              <p className="text-gray-600">Historical price trends and future growth projections based on market fundamentals.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Rental Yield</h3>
              <p className="text-gray-600">Current rental returns relative to property values for cash flow analysis.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Market Demand</h3>
              <p className="text-gray-600">Population growth, employment rates, and buyer/renter demand indicators.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Risk Factors</h3>
              <p className="text-gray-600">Crime rates, natural disaster risk, and economic stability assessment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Next Investment?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get detailed analysis, AI-powered insights, and suburb reports for any suburb in Australia.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/search" className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all">
              Start Free Search
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-4 rounded-xl transition-all border border-blue-400">
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
