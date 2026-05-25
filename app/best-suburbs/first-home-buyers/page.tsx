import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Metadata } from 'next'
import { ArrowRight, Users, Briefcase } from 'lucide-react'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Best Suburbs for First Home Buyers Australia 2025',
  description: 'Find affordable suburbs perfect for first home buyers. Entry-level properties with strong growth potential and good amenities.',
  keywords: ['first home buyer suburbs', 'affordable suburbs australia', 'starter home suburbs', 'first property investment', 'entry level property'],
}

async function getFirstHomeBuyerSuburbs() {
  try {
    const suburbs = await prisma.suburbs.findMany({
      where: {
        medianPrice: { lte: 650000, gte: 200000 },
        investmentScore: { gte: 60 }
      },
      take: 50,
      orderBy: [
        { investmentScore: 'desc' },
        { medianPrice: 'asc' }
      ],
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
    return []
  }
}

export default async function FirstHomeBuyerPage() {
  const suburbs = await getFirstHomeBuyerSuburbs()
  
  const formatPrice = (price: number | null) => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="bg-gradient-to-r from-pink-700 via-rose-600 to-red-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 bg-pink-500/20 rounded-full text-pink-200 text-sm font-medium mb-6">
              🏠 First Home Buyer Guide
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Best Suburbs for <span className="text-yellow-400">First Home Buyers</span>
            </h1>
            <p className="text-xl md:text-2xl text-pink-100 mb-8 leading-relaxed">
              Affordable entry points with strong growth potential. Start your property journey in the right suburb.
            </p>
            <Link href="/search?maxPrice=650000" className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg">
              Find Your First Home <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-2xl md:text-3xl font-bold text-pink-600">$650k</div>
              <div className="text-gray-600 text-sm">Max Price Filter</div>
            </div>
            <div className="p-4">
              <div className="text-2xl md:text-3xl font-bold text-green-600">60+</div>
              <div className="text-gray-600 text-sm">Min Investment Score</div>
            </div>
            <div className="p-4">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">{suburbs.length}+</div>
              <div className="text-gray-600 text-sm">Qualifying Suburbs</div>
            </div>
            <div className="p-4">
              <div className="text-2xl md:text-3xl font-bold text-purple-600">8</div>
              <div className="text-gray-600 text-sm">States Covered</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Top Suburbs for First Home Buyers</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suburbs.map((suburb, index) => (
              <Link
                key={suburb.id}
                href={`/suburb/${suburb.name.toLowerCase().replace(/\s+/g, '-')}-${suburb.state.toLowerCase()}-${suburb.postcode}`}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-sm ${index < 3 ? 'bg-yellow-500' : 'bg-pink-500'}`}>
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-500">{suburb.state}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{suburb.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{suburb.postcode}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Median Price</span>
                    <span className="font-bold text-pink-600">{formatPrice(suburb.medianPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Growth</span>
                    <span className={`font-semibold ${(suburb.growth12m ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {suburb.growth12m ? `${suburb.growth12m > 0 ? '+' : ''}${suburb.growth12m.toFixed(1)}%` : 'N/A'}
                    </span>
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

      <section className="py-16 bg-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Make Your First Purchase Count</h2>
          <p className="text-xl text-pink-100 mb-8">Get detailed suburb reports and AI recommendations tailored for first home buyers.</p>
          <Link href="/pricing" className="inline-flex items-center gap-2 bg-white text-pink-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all">
            Unlock Pro Features <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
