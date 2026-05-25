'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, TrendingUp, DollarSign, Target, Filter, MapPin } from 'lucide-react'

interface Opportunity {
  suburb: {
    id: string
    name: string
    state: string
    postcode: string
  }
  metrics: {
    price: number
    growth12m: number | null
    yield: number | null
    smartScore: number | null
    growthScore: number | null
    riskScore: number | null
  }
  highlights: string[]
  matchReason: string
  persona: string | null
  recommendation: string | null
}

export default function OpportunityMapPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    persona: '',
    minBudget: '',
    maxBudget: '',
    minYield: '',
    minGrowth: '',
    state: '',
    sortBy: 'score'
  })

  useEffect(() => {
    fetchOpportunities()
  }, [])

  const fetchOpportunities = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      
      const response = await fetch(`/api/opportunity-map?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setOpportunities(data.opportunities)
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRecommendationBadge = (rec: string | null) => {
    if (!rec) return null
    const styles = {
      'strong-buy': 'bg-green-100 text-green-700',
      'buy': 'bg-blue-100 text-blue-700',
      'hold': 'bg-yellow-100 text-yellow-700',
      'consider': 'bg-orange-100 text-orange-700',
      'avoid': 'bg-red-100 text-red-700'
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[rec as keyof typeof styles]}`}>
        {rec.toUpperCase().replace('-', ' ')}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Opportunity Map</h1>
              <p className="text-gray-600">Discover top investment opportunities across Australia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buyer Persona</label>
              <select
                value={filters.persona}
                onChange={(e) => setFilters({...filters, persona: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="first-home-buyer">First Home Buyer</option>
                <option value="investor-growth">Investor (Growth)</option>
                <option value="investor-yield">Investor (Yield)</option>
                <option value="upsizer">Upsizer</option>
                <option value="downsizer">Downsizer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Budget</label>
              <input
                type="number"
                value={filters.minBudget}
                onChange={(e) => setFilters({...filters, minBudget: e.target.value})}
                placeholder="$300,000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Budget</label>
              <input
                type="number"
                value={filters.maxBudget}
                onChange={(e) => setFilters({...filters, maxBudget: e.target.value})}
                placeholder="$1,000,000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Yield %</label>
              <input
                type="number"
                step="0.1"
                value={filters.minYield}
                onChange={(e) => setFilters({...filters, minYield: e.target.value})}
                placeholder="4.0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Growth %</label>
              <input
                type="number"
                step="0.1"
                value={filters.minGrowth}
                onChange={(e) => setFilters({...filters, minGrowth: e.target.value})}
                placeholder="5.0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <select
                value={filters.state}
                onChange={(e) => setFilters({...filters, state: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All States</option>
                <option value="NSW">NSW</option>
                <option value="VIC">VIC</option>
                <option value="QLD">QLD</option>
                <option value="SA">SA</option>
                <option value="WA">WA</option>
                <option value="TAS">TAS</option>
                <option value="ACT">ACT</option>
                <option value="NT">NT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="score">Smart Score</option>
                <option value="growth">Growth Rate</option>
                <option value="yield">Rental Yield</option>
                <option value="price">Price (Low to High)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchOpportunities}
                disabled={loading}
                className="w-full px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Apply Filters'}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Finding opportunities...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp, idx) => (
              <Link
                key={idx}
                href={`/suburb/${encodeURIComponent(opp.suburb.name)}?state=${opp.suburb.state}&postcode=${opp.suburb.postcode}`}
                className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                      {opp.suburb.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{opp.suburb.state} {opp.suburb.postcode}</span>
                    </div>
                  </div>
                  {opp.metrics.smartScore && (
                    <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg">
                      {opp.metrics.smartScore}
                    </div>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <DollarSign className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Price</div>
                    <div className="text-sm font-bold text-gray-900">
                      ${(opp.metrics.price / 1000).toFixed(0)}k
                    </div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Growth</div>
                    <div className="text-sm font-bold text-green-600">
                      {opp.metrics.growth12m ? `+${opp.metrics.growth12m.toFixed(1)}%` : 'N/A'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Target className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Yield</div>
                    <div className="text-sm font-bold text-purple-600">
                      {opp.metrics.yield ? `${opp.metrics.yield.toFixed(2)}%` : 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                {opp.highlights.length > 0 && (
                  <div className="mb-4 space-y-1">
                    {opp.highlights.slice(0, 3).map((highlight, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-green-600">✓</span>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recommendation */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  {getRecommendationBadge(opp.recommendation)}
                  <span className="text-xs text-gray-500">{opp.persona || 'All investors'}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && opportunities.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No opportunities found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>
    </div>
  )
}
