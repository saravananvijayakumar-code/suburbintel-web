import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Metadata } from 'next'
import { TrendingUp, Home, ArrowRight, MapPin, DollarSign } from 'lucide-react'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Best Suburbs Under $500k in Australia 2025 | Affordable Investment',
  description: 'Find affordable investment suburbs under $500,000 across Australia. High-growth areas with strong yields at entry-level prices.',
  keywords: ['affordable suburbs australia', 'suburbs under 500k', 'cheap investment property', 'budget property investment', 'first home buyer suburbs'],
}

async function getAffordableSuburbs() {
  try {
    const suburbs = await prisma.suburbs.findMany({
      where: {
        medianPrice: { lte: 500000, gte: 100000 }
      },
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
      }
    })
    return suburbs
  } catch (error) {
    return []
  }
}

export default async function AffordableSuburbsPage() {
  const suburbs = await getAffordableSuburbs()
  
  const formatPrice = (price: number | null) => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="bg-gradient-to-r from-green-800 via-green-700 to-teal-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 bg-green-500/20 rounded-full text-green-200 text-sm font-medium mb-6">
              💰 Budget-Friendly Investments
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Best Suburbs Under <span className="text-yellow-400">$500,000</span>
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 leading-relaxed">
              Entry-level investment properties with strong growth potential and rental yields across Australia.
            </p>
            <Link href="/search?maxPrice=500000" className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg">
              Search Under $500k <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Top 50 Affordable Investment Suburbs</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suburbs.map((suburb, index) => (
              <Link
                key={suburb.id}
                href={`/suburb/${suburb.name.toLowerCase().replace(/\s+/g, '-')}-${suburb.state.toLowerCase()}-${suburb.postcode}`}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-sm ${index < 3 ? 'bg-yellow-500' : 'bg-green-500'}`}>
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-500">{suburb.state}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{suburb.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{suburb.postcode}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Median Price</span>
                    <span className="font-bold text-green-600">{formatPrice(suburb.medianPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Growth</span>
                    <span className={`font-semibold ${(suburb.growth12m ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {suburb.growth12m ? `${suburb.growth12m > 0 ? '+' : ''}${suburb.growth12m.toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Yield</span>
                    <span className="font-semibold text-purple-600">{suburb.rentalYield?.toFixed(1) ?? 'N/A'}%</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600">Score</span>
                    <span className="font-bold text-blue-600">{suburb.investmentScore}/100</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Start Building Your Portfolio</h2>
          <p className="text-xl text-green-100 mb-8">Get detailed suburb reports and AI insights to make informed investment decisions.</p>
          <Link href="/pricing" className="inline-flex items-center gap-2 bg-white text-green-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all">
            View Pro Features <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
