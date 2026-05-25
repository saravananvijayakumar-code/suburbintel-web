'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown, DollarSign, Home, BarChart3, MapPin, Target, Award, Zap, Lock, Crown } from 'lucide-react'
import DashboardLayout from '@/app/components/DashboardLayout'
import { useSubscription } from '@/contexts/SubscriptionContext'

interface MarketInsights {
  national: {
    totalSuburbs: number
    avgMedianPrice: number
    avgWeeklyRent: number
    avgRentalYield: number
    avgGrowth12m: number
    minPrice: number
    maxPrice: number
    highestGrowth: number
    lowestGrowth: number
    bestYield: number
  }
  stateBreakdown: Array<{
    state: string
    suburbCount: number
    avgMedianPrice: number
    avgWeeklyRent: number
    avgRentalYield: number
    avgGrowth12m: number
    minPrice: number
    maxPrice: number
  }>
  affordableHotspots: Array<{
    name: string
    state: string
    postcode: string
    medianPrice: number
    growth12m: number
    rentalYield: number
    investmentScore: number
  }>
  bestYieldsByState: Array<{
    state: string
    topSuburbs: Array<{
      name: string
      postcode: string
      rentalYield: number
      medianPrice: number
      weeklyRent: number
    }>
  }>
  growthLeaders: Array<{
    name: string
    state: string
    postcode: string
    medianPrice: number
    growth12m: number
    growth6m: number
    growth3m: number
  }>
  growthLaggards: Array<{
    name: string
    state: string
    postcode: string
    medianPrice: number
    growth12m: number
  }>
  investmentOpportunities: Array<{
    name: string
    state: string
    postcode: string
    medianPrice: number
    growth12m: number
    rentalYield: number
    investmentScore: number
    growthScore: number
    affordabilityScore: number
    lifestyleScore: number
  }>
}

export default function MarketInsightsPage() {
  const { subscriptionTier } = useSubscription()
  const hasProAccess = subscriptionTier === 'pro'
  const [insights, setInsights] = useState<MarketInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    try {
      const response = await fetch('/api/insights/market')
      const data = await response.json()
      
      if (data.success) {
        setInsights(data)
      } else {
        setError('Failed to load market insights')
      }
    } catch (err) {
      setError('Error fetching insights')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !insights) {
    return (
      <DashboardLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Insights</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Return Home
          </Link>
      </div>
    </div>
    </DashboardLayout>
    )
  }

return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Australian Property Market Insights
            </h1>
            <p className="mt-6 text-xl text-blue-100">
              Real-time analysis of {insights.national.totalSuburbs} suburbs across Australia
            </p>
          </div>

          {/* National Stats Cards */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Home className="h-6 w-6 text-blue-200" />
                <p className="text-sm font-medium text-blue-200">Avg Median Price</p>
              </div>
              <p className="text-3xl font-bold">${(insights.national.avgMedianPrice / 1000).toFixed(0)}k</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-6 w-6 text-green-300" />
                <p className="text-sm font-medium text-blue-200">Avg 12M Growth</p>
              </div>
              <p className="text-3xl font-bold">{insights.national.avgGrowth12m.toFixed(1)}%</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="h-6 w-6 text-emerald-300" />
                <p className="text-sm font-medium text-blue-200">Avg Rental Yield</p>
              </div>
              <p className="text-3xl font-bold">{insights.national.avgRentalYield.toFixed(1)}%</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Award className="h-6 w-6 text-yellow-300" />
                <p className="text-sm font-medium text-blue-200">Best Yield</p>
              </div>
              <p className="text-3xl font-bold">{insights.national.bestYield.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </section>

      {/* State Breakdown */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900">State-by-State Breakdown</h2>
            <p className="mt-2 text-lg text-gray-600">Compare market performance across Australian states</p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {insights.stateBreakdown.map((state) => (
              <Link 
                key={state.state} 
                href={`/state/${state.state.toLowerCase()}`}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{state.state}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white rounded-full text-sm font-semibold transition-colors">
                    {state.suburbCount} suburbs
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Avg Median Price</p>
                    <p className="text-xl font-bold text-gray-900">${(state.avgMedianPrice / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Growth</p>
                    <p className={`text-xl font-bold ${state.avgGrowth12m >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {state.avgGrowth12m >= 0 ? '+' : ''}{state.avgGrowth12m.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Rental Yield</p>
                    <p className="text-xl font-bold text-gray-900">{state.avgRentalYield.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price Range</p>
                    <p className="text-sm font-medium text-gray-700">
                      ${(state.minPrice / 1000).toFixed(0)}k - ${(state.maxPrice / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Affordable Hotspots */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-8 w-8 text-emerald-600" />
              <h2 className="text-3xl font-bold text-gray-900">Affordable Hotspots</h2>
            </div>
            <p className="text-lg text-gray-600">
              High-growth, affordable suburbs with strong rental yields (under $600k)
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {insights.affordableHotspots.map((suburb, index) => (
              <Link
                key={`${suburb.name}-${suburb.state}`}
                href={`/suburb/${encodeURIComponent(suburb.name)}?state=${suburb.state}&postcode=${suburb.postcode}`}
                className="group bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                      {suburb.name}, {suburb.state}
                    </h3>
                    <p className="text-sm text-gray-600">{suburb.postcode}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold">
                    #{index + 1}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Median Price:</span>
                    <span className="font-bold text-gray-900">${(suburb.medianPrice / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">12M Growth:</span>
                    <span className={`font-bold ${suburb.growth12m !== null ? 'text-green-600' : 'text-gray-500'}`}>
                      {suburb.growth12m !== null ? `+${suburb.growth12m.toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Rental Yield:</span>
                    <span className={`font-bold ${suburb.rentalYield !== null ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {suburb.rentalYield !== null ? `${suburb.rentalYield.toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Investment Score:</span>
                    <span className="font-bold text-blue-600">{suburb.investmentScore}/100</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Leaders */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Leaders */}
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="h-8 w-8 text-yellow-500" />
                  <h2 className="text-3xl font-bold text-gray-900">Growth Leaders</h2>
                  {!hasProAccess && (
                    <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      Pro: See All 5
                    </span>
                  )}
                </div>
                <p className="text-gray-600">Top performing suburbs by 12-month growth</p>
              </div>

              <div className="space-y-4">
                {insights.growthLeaders.slice(0, hasProAccess ? 5 : 2).map((suburb, index) => (
                  <Link
                    key={`${suburb.name}-${suburb.state}`}
                    href={`/suburb/${encodeURIComponent(suburb.name)}?state=${suburb.state}&postcode=${suburb.postcode}`}
                    className="block bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold text-lg">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="font-bold text-gray-900">{suburb.name}, {suburb.state}</h3>
                          <p className="text-sm text-gray-600">${(suburb.medianPrice / 1000).toFixed(0)}k median</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-green-600 font-bold text-xl">
                          <TrendingUp className="h-5 w-5" />
                          +{suburb.growth12m.toFixed(1)}%
                        </div>
                        <p className="text-xs text-gray-500">12-month growth</p>
                      </div>
                    </div>
                  </Link>
                ))}
                
                {/* Pro upgrade teaser for free users */}
                {!hasProAccess && (
                  <Link
                    href="/pricing"
                    className="block bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5 border-2 border-purple-200 hover:border-purple-400 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600">
                          <Lock className="h-5 w-5" />
                        </span>
                        <div>
                          <h3 className="font-bold text-gray-900">+3 More Growth Leaders</h3>
                          <p className="text-sm text-purple-600">Upgrade to Pro to see all top performers</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
                          <Crown className="h-4 w-4" />
                          Pro
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Laggards */}
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingDown className="h-8 w-8 text-orange-500" />
                  <h2 className="text-3xl font-bold text-gray-900">Watch List</h2>
                  {!hasProAccess && (
                    <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      Pro: See All 5
                    </span>
                  )}
                </div>
                <p className="text-gray-600">Suburbs with slower growth - potential value opportunities</p>
              </div>

              <div className="space-y-4">
                {insights.growthLaggards.slice(0, hasProAccess ? 5 : 2).map((suburb, index) => (
                  <Link
                    key={`${suburb.name}-${suburb.state}`}
                    href={`/suburb/${encodeURIComponent(suburb.name)}?state=${suburb.state}&postcode=${suburb.postcode}`}
                    className="block bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-700 font-bold text-lg">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="font-bold text-gray-900">{suburb.name}, {suburb.state}</h3>
                          <p className="text-sm text-gray-600">${(suburb.medianPrice / 1000).toFixed(0)}k median</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center gap-1 font-bold text-xl ${suburb.growth12m < 0 ? 'text-red-600' : 'text-orange-600'}`}>
                          {suburb.growth12m < 0 && <TrendingDown className="h-5 w-5" />}
                          {suburb.growth12m.toFixed(1)}%
                        </div>
                        <p className="text-xs text-gray-500">12-month growth</p>
                      </div>
                    </div>
                  </Link>
                ))}
                
                {/* Pro upgrade teaser for free users */}
                {!hasProAccess && (
                  <Link
                    href="/pricing"
                    className="block bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5 border-2 border-purple-200 hover:border-purple-400 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600">
                          <Lock className="h-5 w-5" />
                        </span>
                        <div>
                          <h3 className="font-bold text-gray-900">+3 More Opportunities</h3>
                          <p className="text-sm text-purple-600">Upgrade to Pro to discover value plays</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
                          <Crown className="h-4 w-4" />
                          Pro
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Opportunities */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Top Investment Opportunities</h2>
              {!hasProAccess && (
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                  Pro: See All 9
                </span>
              )}
            </div>
            <p className="text-lg text-gray-600">
              Suburbs with the highest overall investment scores across all metrics
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {insights.investmentOpportunities.slice(0, hasProAccess ? 9 : 3).map((suburb) => (
              <Link
                key={`${suburb.name}-${suburb.state}`}
                href={`/suburb/${encodeURIComponent(suburb.name)}?state=${suburb.state}&postcode=${suburb.postcode}`}
                className="group bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-2xl hover:border-blue-500 transition-all hover:-translate-y-1"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {suburb.name}, {suburb.state}
                  </h3>
                  <p className="text-sm text-gray-600">{suburb.postcode}</p>
                </div>

                <div className="mb-4 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Investment Score</span>
                    <span className="text-2xl font-bold text-blue-600">{suburb.investmentScore}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                      style={{ width: `${suburb.investmentScore}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Price</p>
                    <p className="font-bold text-gray-900">${(suburb.medianPrice / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Growth</p>
                    <p className="font-bold text-green-600">+{suburb.growth12m.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Yield</p>
                    <p className="font-bold text-emerald-600">{suburb.rentalYield.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Growth Score</p>
                    <p className="font-bold text-blue-600">{suburb.growthScore}/100</p>
                  </div>
                </div>
              </Link>
            ))}
            
            {/* Pro upgrade card for free users */}
            {!hasProAccess && (
              <Link
                href="/pricing"
                className="group bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 border border-purple-400 hover:shadow-2xl transition-all hover:-translate-y-1 md:col-span-2 lg:col-span-3"
              >
                <div className="text-center text-white">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                    <Crown className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Unlock 6 More Investment Opportunities</h3>
                  <p className="text-purple-100 mb-4">
                    Pro members get access to all top suburbs, AI insights, historical data, and more
                  </p>
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-bold rounded-full group-hover:bg-purple-50 transition-colors">
                    <Zap className="h-5 w-5" />
                    Upgrade to Pro - $14.95/mo
                  </span>
                  <p className="mt-3 text-sm text-purple-200">Cancel anytime</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Find Your Next Investment?
          </h2>
          <p className="mt-4 text-xl text-gray-300">
            Search through {insights.national.totalSuburbs} suburbs and discover opportunities tailored to your goals
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link
              href="/search"
              className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              Search Suburbs
            </Link>
            <Link
              href="/compare"
              className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Compare Suburbs
            </Link>
          </div>
        </div>
      </section>
    </div>
    </DashboardLayout>
  )
}
