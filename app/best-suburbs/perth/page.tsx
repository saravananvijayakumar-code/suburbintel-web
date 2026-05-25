import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Best Suburbs in Perth 2025 | Investment Guide WA',
  description: 'Discover the best suburbs to invest in Perth. Comprehensive analysis of Western Australia suburbs with growth forecasts and investment scores.',
  keywords: ['best suburbs perth', 'perth property investment', 'where to buy in perth', 'perth suburb rankings', 'wa investment suburbs'],
}

async function getPerthSuburbs() {
  try {
    const suburbs = await prisma.suburbs.findMany({
      where: { state: 'WA' },
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

export default async function PerthSuburbsPage() {
  const suburbs = await getPerthSuburbs()
  
  const formatPrice = (price: number | null) => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="bg-gradient-to-r from-teal-800 via-cyan-700 to-blue-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 bg-teal-500/20 rounded-full text-teal-200 text-sm font-medium mb-6">
              🌅 Perth Investment Guide
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Best Suburbs in <span className="text-yellow-400">Perth</span> 2025
            </h1>
            <p className="text-xl md:text-2xl text-teal-100 mb-8 leading-relaxed">
              Western Australia's property market recovery. Find undervalued suburbs with strong growth potential.
            </p>
            <Link href="/search?state=WA" className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg">
              Explore Perth Suburbs <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Top 50 Perth Investment Suburbs</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suburbs.map((suburb, index) => (
              <Link
                key={suburb.id}
                href={`/suburb/${suburb.name.toLowerCase().replace(/\s+/g, '-')}-${suburb.state.toLowerCase()}-${suburb.postcode}`}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-sm ${index < 3 ? 'bg-yellow-500' : 'bg-teal-500'}`}>
                    {index + 1}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold">
                    {suburb.investmentScore}/100
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{suburb.name}</h3>
                <p className="text-gray-500 text-sm mb-4">WA {suburb.postcode}</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-sm font-semibold text-gray-900">{formatPrice(suburb.medianPrice)}</div>
                    <div className="text-xs text-gray-500">Median</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className={`text-sm font-semibold ${(suburb.growth12m ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {suburb.growth12m ? `${suburb.growth12m > 0 ? '+' : ''}${suburb.growth12m.toFixed(1)}%` : 'N/A'}
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
        </div>
      </section>

      <section className="py-16 bg-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Catch the Perth Recovery Wave</h2>
          <p className="text-xl text-teal-100 mb-8">AI-powered analysis and mining boom cycle predictions.</p>
          <Link href="/pricing" className="inline-flex items-center gap-2 bg-white text-teal-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all">
            Unlock Pro Features <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
