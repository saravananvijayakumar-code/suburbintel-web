'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Search, TrendingUp, MapPin, BarChart3, ArrowRight, Database, Shield, Users } from 'lucide-react'

interface TrendingSuburb {
  id: string
  name: string
  state: string
  postcode: string
  medianPrice: number
  growthRate: number
  monthlyChange: number
  chartData: number[]
  rentalYield?: number
}

interface MarketStats {
  totalSuburbs: number
  avgMedianPrice: number
  avgGrowth12m: number
  bestYield: number
}

export default function Home() {
  const [trendingSuburbs, setTrendingSuburbs] = useState<TrendingSuburb[]>([])
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, statsRes] = await Promise.all([
          fetch('/api/trending'),
          fetch('/api/suburbs/stats'),
        ])
        if (trendingRes.ok) {
          const data = await trendingRes.json()
          setTrendingSuburbs(data.suburbs || [])
        }
        if (statsRes.ok) {
          const data = await statsRes.json()
          if (data.success) setMarketStats(data.overall)
        }
      } catch (e) {
        console.error('Failed to fetch:', e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[200px]" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-gray-300">100% Free · No Signup Required · Government Data Only</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight leading-[0.9]">
            <span className="block text-white">Australian</span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
              Property Intelligence
            </span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Search 14,500+ suburbs across all states. Real government data from NSW Valuer General, 
            ABS Census 2021, and official state sources. No AI guesses, no paywalls.
          </p>

          {/* Search CTA */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-2xl shadow-white/10 hover:shadow-white/20"
            >
              <Search className="w-5 h-5" />
              Search Suburbs
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white rounded-2xl font-semibold text-lg hover:bg-white/5 transition-all backdrop-blur-sm"
            >
              <BarChart3 className="w-5 h-5" />
              Compare Suburbs
            </Link>
          </div>

          {/* Data source badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {['NSW Valuer General', 'ABS Census 2021', 'VIC Land Victoria', 'Official Gov Data'].map((source) => (
              <span key={source} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 backdrop-blur-sm">
                {source}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {marketStats && (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Suburbs Tracked', value: marketStats.totalSuburbs.toLocaleString(), icon: MapPin },
                { label: 'Avg Median Price', value: `$${(marketStats.avgMedianPrice / 1000).toFixed(0)}k`, icon: TrendingUp },
                { label: 'Avg Growth (12M)', value: `+${marketStats.avgGrowth12m.toFixed(1)}%`, icon: BarChart3 },
                { label: 'Best Yield', value: `${marketStats.bestYield.toFixed(1)}%`, icon: Database },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="relative group p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.06] transition-all hover:border-white/20"
                >
                  <stat.icon className="w-5 h-5 text-gray-500 mb-3" />
                  <p className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Suburbs */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Trending Suburbs</h2>
              <p className="mt-2 text-gray-500">Highest growth in the last 12 months</p>
            </div>
            <Link href="/search" className="hidden sm:flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingSuburbs.slice(0, 6).map((suburb, i) => (
                <Link
                  key={suburb.id}
                  href={`/suburb/${encodeURIComponent(suburb.name)}?state=${suburb.state}&postcode=${suburb.postcode}`}
                  className="group relative p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all hover:border-white/20 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                        {suburb.name}
                      </h3>
                      <p className="text-sm text-gray-500">{suburb.state} {suburb.postcode}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
                      +{suburb.growthRate.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white">
                        ${suburb.medianPrice ? (suburb.medianPrice / 1000).toFixed(0) + 'k' : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Median Price</p>
                    </div>
                    {suburb.rentalYield && (
                      <div className="text-right">
                        <p className="text-lg font-semibold text-purple-400">{suburb.rentalYield.toFixed(1)}%</p>
                        <p className="text-xs text-gray-500">Yield</p>
                      </div>
                    )}
                  </div>

                  {/* Mini chart */}
                  {suburb.chartData && suburb.chartData.length > 1 && (
                    <div className="mt-4 h-12">
                      <svg className="w-full h-full" viewBox="0 0 200 48" preserveAspectRatio="none">
                        {(() => {
                          const pts = suburb.chartData
                          const min = Math.min(...pts)
                          const max = Math.max(...pts)
                          const range = max - min || 1
                          const step = 200 / (pts.length - 1)
                          const path = pts.map((p, idx) => {
                            const x = idx * step
                            const y = 44 - ((p - min) / range) * 40
                            return `${idx === 0 ? 'M' : 'L'}${x},${y}`
                          }).join(' ')
                          return (
                            <path d={path} fill="none" stroke="rgba(99,102,241,0.5)" strokeWidth="2" strokeLinecap="round" />
                          )
                        })()}
                      </svg>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Everything You Need</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">Free tools for property research, powered by official government data sources.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Suburb Search', desc: 'Search and filter 14,500+ suburbs by price, growth, yield, and state.', href: '/search', icon: Search },
              { title: 'Compare Tool', desc: 'Side-by-side comparison of up to 4 suburbs with all key metrics.', href: '/compare', icon: BarChart3 },
              { title: 'Market Trends', desc: 'Track market movements, top performers, and emerging opportunities.', href: '/market-trends', icon: TrendingUp },
              { title: 'Investment Heatmap', desc: 'Visual map of growth hotspots and high-yield areas across Australia.', href: '/heatmap', icon: MapPin },
              { title: 'Portfolio Tracker', desc: 'Track your property investments and monitor performance over time.', href: '/portfolio', icon: Database },
              { title: 'Risk Analysis', desc: 'Environmental risk profiles including flood, bushfire, and crime data.', href: '/risk-analysis', icon: Shield },
            ].map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all hover:border-white/20"
              >
                <feature.icon className="w-6 h-6 text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Trusted Government Data Sources</h2>
          <p className="text-gray-500 mb-10">
            All data comes from official Australian government sources. No AI-generated estimates, no third-party guesses.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {[
              { name: 'NSW Valuer General', desc: 'Property sales data, median prices by suburb. Updated weekly.', date: 'Data as of Q1 2025' },
              { name: 'ABS Census 2021', desc: 'Demographics: population, income, age, education, housing tenure.', date: 'Census conducted Aug 2021' },
              { name: 'VIC Land Victoria', desc: 'Victorian property sales and median prices by suburb.', date: 'Data as of Q4 2024' },
              { name: 'NSW Fair Trading', desc: 'Rental bond data providing median weekly rents by postcode.', date: 'Data as of Jan 2026' },
            ].map((source) => (
              <div key={source.name} className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <h4 className="font-semibold text-white text-sm">{source.name}</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{source.desc}</p>
                <p className="text-xs text-blue-400 mt-2 font-medium">{source.date}</p>
              </div>
            ))}
          </div>

          <Link href="/data-sources" className="inline-flex items-center gap-2 mt-8 text-sm text-gray-400 hover:text-white transition-colors">
            View full data methodology <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="p-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
            <h4 className="text-sm font-semibold text-yellow-400 mb-2">Legal Disclaimer</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              This platform provides information for educational and research purposes only. All content does not constitute financial advice. 
              Property investment involves significant risk. SuburbIntel is not licensed by ASIC. Always seek independent professional advice 
              before making investment decisions. Past performance is not indicative of future results.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
