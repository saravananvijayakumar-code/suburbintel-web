import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Metadata } from 'next'
import { ArrowRight, GraduationCap, Star } from 'lucide-react'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Best Suburbs for Schools Australia 2025 | Family Friendly Areas',
  description: 'Find the best suburbs with top-rated schools in Australia. Family-friendly areas with excellent education options and strong property values.',
  keywords: ['best school suburbs australia', 'family friendly suburbs', 'top school catchments', 'suburbs near good schools', 'education property investment'],
}

async function getFamilySuburbs() {
  try {
    const suburbs = await prisma.suburbs.findMany({
      where: {
        schoolQualityScore: { gte: 7 }
      },
      take: 50,
      orderBy: { schoolQualityScore: 'desc' },
      select: {
        id: true,
        name: true,
        state: true,
        postcode: true,
        medianPrice: true,
        schoolQualityScore: true,
        familiesPercent: true,
        investmentScore: true,
      }
    })
    return suburbs
  } catch (error) {
    return []
  }
}

export default async function BestSchoolsPage() {
  const suburbs = await getFamilySuburbs()
  
  const formatPrice = (price: number | null) => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="bg-gradient-to-r from-emerald-800 via-green-700 to-teal-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-200 text-sm font-medium mb-6">
              🎓 Family-Friendly Guide
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Best Suburbs for <span className="text-yellow-400">Schools</span>
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 mb-8 leading-relaxed">
              Top-rated school catchments combined with strong property fundamentals for family investors.
            </p>
            <Link href="/search?minSchoolScore=7" className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg">
              Find Family Suburbs <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Top 50 Family-Friendly Suburbs</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suburbs.map((suburb, index) => (
              <Link
                key={suburb.id}
                href={`/suburb/${suburb.name.toLowerCase().replace(/\s+/g, '-')}-${suburb.state.toLowerCase()}-${suburb.postcode}`}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-sm ${index < 3 ? 'bg-yellow-500' : 'bg-emerald-500'}`}>
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-xs font-semibold">{suburb.schoolQualityScore}/10</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{suburb.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{suburb.state} {suburb.postcode}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Median Price</span>
                    <span className="font-bold text-gray-900">{formatPrice(suburb.medianPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Family %</span>
                    <span className="font-semibold text-emerald-600">{suburb.familiesPercent?.toFixed(0) ?? 'N/A'}%</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600">Investment Score</span>
                    <span className="font-bold text-blue-600">{suburb.investmentScore}/100</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Invest in Your Family's Future</h2>
          <p className="text-xl text-emerald-100 mb-8">Get detailed school data, catchment analysis, and growth forecasts.</p>
          <Link href="/pricing" className="inline-flex items-center gap-2 bg-white text-emerald-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all">
            Unlock Pro Features <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
