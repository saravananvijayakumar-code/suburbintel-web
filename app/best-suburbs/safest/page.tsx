import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Metadata } from 'next'
import { ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Safest Suburbs in Australia 2025 | Low Crime Areas',
  description: 'Discover the safest suburbs in Australia with lowest crime rates. Family-safe neighborhoods with strong property values.',
  keywords: ['safest suburbs australia', 'low crime suburbs', 'safe neighborhoods', 'family safe areas', 'secure suburbs to live'],
}

async function getSafeSuburbs() {
  try {
    const suburbs = await prisma.suburbs.findMany({
      where: {
        crimeRateIndex: { lte: 30 }
      },
      take: 50,
      orderBy: { crimeRateIndex: 'asc' },
      select: {
        id: true,
        name: true,
        state: true,
        postcode: true,
        medianPrice: true,
        crimeRate: true,
        crimeRateIndex: true,
        investmentScore: true,
      }
    })
    return suburbs
  } catch (error) {
    return []
  }
}

export default async function SafestSuburbsPage() {
  const suburbs = await getSafeSuburbs()
  
  const formatPrice = (price: number | null) => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="bg-gradient-to-r from-slate-800 via-gray-700 to-zinc-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 bg-slate-500/20 rounded-full text-slate-200 text-sm font-medium mb-6">
              🛡️ Safety Guide
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Safest Suburbs in <span className="text-green-400">Australia</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-8 leading-relaxed">
              Low crime rates, family-friendly neighborhoods, and strong community values.
            </p>
            <Link href="/search?maxCrimeRate=30" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg">
              Find Safe Suburbs <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Top 50 Safest Suburbs</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suburbs.map((suburb, index) => (
              <Link
                key={suburb.id}
                href={`/suburb/${suburb.name.toLowerCase().replace(/\s+/g, '-')}-${suburb.state.toLowerCase()}-${suburb.postcode}`}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-sm ${index < 3 ? 'bg-yellow-500' : 'bg-slate-500'}`}>
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-semibold">Very Safe</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{suburb.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{suburb.state} {suburb.postcode}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Crime Index</span>
                    <span className="font-bold text-green-600">{suburb.crimeRateIndex ?? suburb.crimeRate ?? 'N/A'}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Median Price</span>
                    <span className="font-semibold text-gray-900">{formatPrice(suburb.medianPrice)}</span>
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

      <section className="py-16 bg-slate-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Safety Meets Investment</h2>
          <p className="text-xl text-slate-200 mb-8">Get comprehensive safety data and crime trend analysis for any suburb.</p>
          <Link href="/pricing" className="inline-flex items-center gap-2 bg-white text-slate-700 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all">
            Unlock Pro Features <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
