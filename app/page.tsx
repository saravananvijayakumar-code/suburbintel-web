'use client'

import Link from 'next/link'
import { Brain, TrendingUp, BarChart3, ArrowUpRight, CheckCircle, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import Testimonials from './components/Testimonials'
// import HomepageFAQ from './components/HomepageFAQ' // TEMP COMMENTED
import { COVERAGE, COVERAGE_MESSAGING } from '@/lib/constants/coverage'
import { PRICING, getPricingMessage } from '@/lib/constants/pricing'


interface TrendingSuburb {
  id: string // Changed from number to string (cuid)
  name: string
  state: string
  postcode: string
  medianPrice: number
  growthRate: number
  monthlyChange: number
  chartData: number[]
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
  const [showBetaBanner, setShowBetaBanner] = useState(true)

  // Fetch trending suburbs and market stats from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch trending suburbs
        const trendingResponse = await fetch('/api/trending')
        if (trendingResponse.ok) {
          const trendingData = await trendingResponse.json()
          setTrendingSuburbs(trendingData.suburbs || [])
        }

        // Fetch market statistics
        const statsResponse = await fetch('/api/suburbs/stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          if (statsData.success) {
            setMarketStats(statsData.overall)
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get badge color based on index
  const getBadgeColor = (index: number) => {
    const colors = [
      { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' },
      { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
      { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
      { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' },
      { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600' },
      { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600' },
    ]
    return colors[index % colors.length]
  }

  // Get gradient color based on index
  const getGradientColor = (index: number) => {
    const gradients = [
      { from: 'from-emerald-50', to: 'to-emerald-100', bar: 'from-emerald-500 to-emerald-400' },
      { from: 'from-blue-50', to: 'to-blue-100', bar: 'from-blue-500 to-blue-400' },
      { from: 'from-purple-50', to: 'to-purple-100', bar: 'from-purple-500 to-purple-400' },
      { from: 'from-orange-50', to: 'to-orange-100', bar: 'from-orange-500 to-orange-400' },
      { from: 'from-pink-50', to: 'to-pink-100', bar: 'from-pink-500 to-pink-400' },
      { from: 'from-cyan-50', to: 'to-cyan-100', bar: 'from-cyan-500 to-cyan-400' },
    ]
    return gradients[index % gradients.length]
  }

  return (
    <div className="min-h-screen bg-white">

      {/* SEO Content - Hidden from users, visible to search engines */}
      <section className="sr-only">
        <h1>Australian Property Investment Intelligence Platform for Smart Investors</h1>
        <p>
          SuburbIntel is Australia's premier investment intelligence platform for property investors,
          providing AI-powered growth forecasts and risk analysis across {COVERAGE.searchable?.toLocaleString() || '1,800'}+ suburbs
          in all 8 Australian states and territories. Our platform combines official ABS Census 2021 data
          with advanced machine learning models (72% directional accuracy, ±3.2% MAE) to predict 12-month
          price movements and identify high-ROI investment opportunities before the market moves.
        </p>
        <p>
          Find undervalued suburbs with strong growth potential, analyze flood and bushfire risks,
          compare rental yields across regions, and track infrastructure developments that drive property values.
          Purpose-built for property investors making data-driven decisions, not casual homebuyers.
          Coverage includes NSW, VIC, QLD, SA, WA, TAS, NT, and ACT with monthly model updates and
          comprehensive risk scoring across 47 investment factors.
        </p>
      </section>

      {/* Hero Section - Apple-style with perfect spacing */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl pt-20 pb-24 sm:pt-32 sm:pb-32 lg:pt-40 lg:pb-40">
          <div className="mx-auto max-w-4xl text-center">
            {/* Main Heading - Perfect typography scale */}
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl animate-fade-in">
              Find Your Next{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">High-ROI Investment Suburb</span>
            </h1>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-700 sm:text-4xl lg:text-5xl animate-fade-in-delay-1">
              Get AI-Powered Investment Intelligence
            </h2>

            {/* Subheading - Optimal line height and spacing */}
            <p className="mt-8 text-xl leading-8 text-gray-600 sm:text-2xl sm:leading-9 animate-fade-in-delay-2">
              Search suburbs, get growth forecasts, and unlock the confidence to invest before everyone else notices.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-3">
              <Link
                href="/search"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                🔍 Search Your First Suburb - FREE
              </Link>
            </div>

            {/* Trust Signal */}
            <p className="mt-6 text-sm text-gray-500 animate-fade-in-delay-4">
              🏆 <span className="font-semibold text-blue-700">Join 1,200+ Smart Property Investors</span> · Start with 1 free search, upgrade for unlimited access
            </p>

          </div>
        </div>
      </section>

      {/* Live Market Stats Banner */}
      {marketStats && (
        <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">National Market Overview</h3>
              <p className="text-blue-200">Upgrade to Pro for personalized suburb stats and insights</p>
            </div>
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 text-white">
              <div className="text-center">
                <p className="text-sm font-medium text-blue-200 mb-1">Suburbs Analyzed</p>
                <p className="text-3xl font-bold">{marketStats.totalSuburbs}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-blue-200 mb-1">Avg National Median</p>
                <p className="text-3xl font-bold">${(marketStats.avgMedianPrice / 1000).toFixed(0)}k</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-blue-200 mb-1">Avg Growth (12M)</p>
                <p className="text-3xl font-bold">+{marketStats.avgGrowth12m.toFixed(1)}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-blue-200 mb-1">Best Yield</p>
                <p className="text-3xl font-bold">{marketStats.bestYield.toFixed(1)}%</p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-blue-700 rounded-full font-semibold hover:bg-blue-50 transition-colors text-sm"
              >
                💎 See YOUR Suburbs' Stats - Upgrade to Pro →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Feature Grid Section - Card perfection */}
      <section className="relative bg-gray-50 px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Feature Cards - Equal height, perfect spacing */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {/* Data-Driven Insights */}
            <div className="group relative flex flex-col items-center text-center p-10 rounded-3xl border border-gray-200 bg-white hover:shadow-2xl hover:border-blue-100 transition-all duration-300 hover:-translate-y-1">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                {/* <Brain className="h-8 w-8" /> */}
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Data-Driven Insights
              </h3>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Make informed decisions with our powerful{' '}
                <Link href="/search" className="text-blue-600 hover:underline font-medium">
                  suburb search tool
                </Link>{' '}
                and investment scoring algorithm. Access real-time{' '}
                <Link href="/insights" className="text-blue-600 hover:underline font-medium">
                  market insights
                </Link>{' '}
                for smarter property investing.
              </p>
            </div>

            {/* Market Forecasting */}
            <div className="group relative flex flex-col items-center text-center p-10 rounded-3xl border border-gray-200 bg-white hover:shadow-2xl hover:border-blue-100 transition-all duration-300 hover:-translate-y-1">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                {/* <TrendingUp className="h-8 w-8" /> */}
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Market Forecasting
              </h3>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Predict market trends and identify high-growth potential areas with up to 90% accuracy.
              </p>
            </div>

            {/* Portfolio Tracking */}
            <div className="group relative flex flex-col items-center text-center p-10 rounded-3xl border border-gray-200 bg-white hover:shadow-2xl hover:border-blue-100 transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                {/* <BarChart3 className="h-8 w-8" /> */}
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Portfolio Tracking
              </h3>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Monitor and optimize your entire property portfolio performance from a single dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Suburbs Section - Responsive grid perfection */}
      <section className="relative bg-white px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Top Investment Opportunities
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Preview trending suburbs. Upgrade to Pro for unlimited access, AI insights, and detailed analysis.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Trending Cards - Perfect responsive grid */}
          {!isLoading && trendingSuburbs.length > 0 && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {trendingSuburbs.slice(0, 3).map((suburb, index) => {
                const badge = getBadgeColor(index)
                const gradient = getGradientColor(index)

                return (
                  <div
                    key={suburb.id}
                    className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{suburb.name}, {suburb.state}</h4>
                        <p className="mt-1 text-sm text-gray-600">
                          Median Price: {suburb.medianPrice ? `$${suburb.medianPrice.toLocaleString()}` : 'N/A'}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1.5 rounded-full ${badge.bg} px-3 py-1.5 border ${badge.border}`}>
                        {/* <ArrowUpRight className={`h-4 w-4 ${badge.text}`} /> */}
                        <span className={`text-sm font-bold ${badge.text}`}>+{suburb.growthRate}%</span>
                      </div>
                    </div>
                    {/* Mini Line Chart */}
                    <div className="relative h-32 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 mb-4">
                      <svg className="w-full h-full" viewBox="0 0 300 128" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={`rgb(${index === 0 ? '16, 185, 129' : index === 1 ? '59, 130, 246' : index === 2 ? '168, 85, 247' : index === 3 ? '249, 115, 22' : index === 4 ? '236, 72, 153' : '6, 182, 212'})`} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={`rgb(${index === 0 ? '16, 185, 129' : index === 1 ? '59, 130, 246' : index === 2 ? '168, 85, 247' : index === 3 ? '249, 115, 22' : index === 4 ? '236, 72, 153' : '6, 182, 212'})`} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Generate line chart path from chartData */}
                        {suburb.chartData && suburb.chartData.length > 0 && (() => {
                          const points = suburb.chartData
                          const minPrice = Math.min(...points)
                          const maxPrice = Math.max(...points)
                          const range = maxPrice - minPrice || 1
                          const xStep = 300 / (points.length - 1)

                          // Create path for line (corrected Y-axis: higher price = higher on chart)
                          const linePath = points.map((price, i) => {
                            const x = i * xStep
                            // Fixed: subtract from 118 (top padding 10) instead of from 128
                            const y = 10 + ((maxPrice - price) / range) * 108
                            return `${i === 0 ? 'M' : 'L'} ${x},${y}`
                          }).join(' ')

                          // Create path for area fill
                          const areaPath = `${linePath} L 300,128 L 0,128 Z`

                          return (
                            <>
                              <path d={areaPath} fill={`url(#gradient-${index})`} />
                              <path
                                d={linePath}
                                fill="none"
                                stroke={`rgb(${index === 0 ? '16, 185, 129' : index === 1 ? '59, 130, 246' : index === 2 ? '168, 85, 247' : index === 3 ? '249, 115, 22' : index === 4 ? '236, 72, 153' : '6, 182, 212'})`}
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </>
                          )
                        })()}
                      </svg>
                      {/* Price labels */}
                      <div className="absolute bottom-2 left-3 text-xs font-medium text-gray-600">
                        6m ago: ${suburb.chartData && suburb.chartData[0] ? Math.round(suburb.chartData[0] / 1000) : 0}k
                      </div>
                      <div className="absolute bottom-2 right-3 text-xs font-medium text-gray-900">
                        Now: ${suburb.chartData && suburb.chartData[suburb.chartData.length - 1] ? Math.round(suburb.chartData[suburb.chartData.length - 1] / 1000) : 0}k
                      </div>
                    </div>
                    {/* View Details Button */}
                    <Link
                      href={`/suburb/${encodeURIComponent(suburb.name)}?state=${suburb.state}&postcode=${suburb.postcode}`}
                      className="block w-full text-center py-2.5 px-4 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                )
              })}
            </div>
          )}

          {/* Upgrade CTA after trending suburbs */}
          {!isLoading && trendingSuburbs.length > 3 && (
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">See {trendingSuburbs.length - 3} more trending suburbs + AI investment analysis</p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                💎 Upgrade to Pro →
              </Link>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && trendingSuburbs.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-600">No trending suburbs available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      {/* <HomepageFAQ /> */}

      {/* Beta Disclaimer - Enhanced with new features */}
      <div className="border-t border-gray-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
                BETA VERSION
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-600 text-white animate-pulse">
                🎉 NEW: Nationwide Coverage!
              </span>
            </div>
            <p className="text-center text-sm text-gray-700 max-w-3xl">
              <strong className="font-semibold">Data Coverage:</strong> {COVERAGE_MESSAGING.details}{' '}
              <Link href="/data-sources" className="font-semibold text-blue-600 hover:text-blue-800 underline">
                View Sources →
              </Link>
            </p>

            {/* Investment Disclaimer */}
            <div className="mt-6 max-w-4xl">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <h4 className="font-semibold mb-2">Important Legal Disclaimer</h4>
                    <p className="mb-2">
                      <strong>This platform provides information for educational and research purposes only.</strong> All content, data, analysis, and insights do not constitute financial advice, investment advice, tax advice, legal advice, or any other form of professional financial planning or recommendation.
                    </p>
                    <p className="mb-2">
                      Property investment involves significant financial risk, including the potential loss of your entire investment. Past performance is not indicative of future results. Market conditions can change rapidly and unexpectedly.
                    </p>
                    <p className="text-xs text-yellow-700">
                      SuburbIntel is not licensed by ASIC (Australian Securities and Investments Commission) and does not provide financial product advice. Always conduct your own research and seek independent professional advice before making investment decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
