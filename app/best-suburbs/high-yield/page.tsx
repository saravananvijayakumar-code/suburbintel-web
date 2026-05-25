import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Metadata } from 'next'
import { ArrowRight, DollarSign, TrendingUp } from 'lucide-react'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'High Rental Yield Suburbs Australia 2025 | 5%+ Yields',
  description: 'Discover suburbs with the highest rental yields in Australia. Find properties returning 5%+ annually for maximum cash flow.',
  keywords: ['high rental yield suburbs', 'best yield suburbs australia', '5% rental yield', 'cash flow property', 'investment property yield'],
}

async function getHighYieldSuburbs() {
  try {
    const suburbs = await prisma.suburbs.findMany({
      where: {
        rentalYield: { gte: 5 }
      },
      take: 50,
      orderBy: { rentalYield: 'desc' },
      select: {
        id: true,
        name: true,
        state: true,
        postcode: true,
        medianPrice: true,
        growth12m: true,
        rentalYield: true,
        weeklyRent: true,
        investmentScore: true,
      }
    })
    return suburbs
  } catch (error) {
    return []
  }
}

export default async function HighYieldSuburbsPage() {
  const suburbs = await getHighYieldSuburbs()
  
  const formatPrice = (price: number | null) => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 bg-purple-500/20 rounded-full text-purple-200 text-sm font-medium mb-6">
              📈 Maximum Cash Flow
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              High Rental Yield Suburbs <span className="text-yellow-400">5%+</span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 leading-relaxed">
              Properties delivering exceptional rental returns for cash-flow focused investors.
            </p>
            <Link href="/search?minYield=5" className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg">
              Find High Yield Suburbs <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Top 50 High-Yield Investment Suburbs</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold">Rank</th>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold">Suburb</th>
                  <th className="px-4 md:px-6 py-4 text-right font-semibold hidden sm:table-cell">Median Price</th>
                  <th className="px-4 md:px-6 py-4 text-right font-semibold hidden md:table-cell">Weekly Rent</th>
                  <th className="px-4 md:px-6 py-4 text-right font-semibold">Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {suburbs.map((suburb, index) => (
                  <tr key={suburb.id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-4 md:px-6 py-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm ${index < 3 ? 'bg-yellow-500' : 'bg-purple-500'}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <Link 
                        href={`/suburb/${suburb.name.toLowerCase().replace(/\s+/g, '-')}-${suburb.state.toLowerCase()}-${suburb.postcode}`}
                        className="font-semibold text-gray-900 hover:text-purple-600 transition-colors"
                      >
                        {suburb.name}
                        <span className="text-gray-500 text-sm ml-2">{suburb.state}</span>
                      </Link>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right font-medium text-gray-900 hidden sm:table-cell">{formatPrice(suburb.medianPrice)}</td>
                    <td className="px-4 md:px-6 py-4 text-right font-medium text-gray-900 hidden md:table-cell">${suburb.weeklyRent ?? 'N/A'}/wk</td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-bold">
                        {suburb.rentalYield?.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Maximize Your Rental Returns</h2>
          <p className="text-xl text-purple-100 mb-8">Get detailed cash flow analysis and AI-powered investment recommendations.</p>
          <Link href="/pricing" className="inline-flex items-center gap-2 bg-white text-purple-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all">
            Unlock Pro Analysis <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
