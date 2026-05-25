/**
 * Compare Nearby Suburbs - Side-by-side comparison widget
 */

'use client'

import { ArrowRight, TrendingUp, Home, DollarSign, Award } from 'lucide-react'

interface SuburbComparisonData {
  name: string
  state: string
  medianPrice: number
  priceGrowth12m: number
  grossYield: number
  smartPropertyScore: number
  distanceKm?: number
}

interface CompareNearbyProps {
  comparableSuburbs: SuburbComparisonData[]
  currentSuburb: string
}

export default function CompareNearby({ comparableSuburbs, currentSuburb }: CompareNearbyProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'from-green-500 to-emerald-600'
    if (score >= 75) return 'from-blue-500 to-cyan-600'
    if (score >= 65) return 'from-purple-500 to-indigo-600'
    if (score >= 55) return 'from-yellow-500 to-amber-600'
    return 'from-orange-500 to-red-600'
  }
  
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Similar Suburbs</h3>
          <p className="text-sm text-gray-600">Compare nearby investment options</p>
        </div>
        <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
          <Award className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {comparableSuburbs.map((suburb, index) => {
          const scoreGradient = getScoreColor(suburb.smartPropertyScore)
          
          return (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all cursor-pointer"
            >
              {/* Score Badge */}
              <div className={`absolute -top-3 -right-3 p-3 rounded-xl bg-gradient-to-br ${scoreGradient} shadow-lg`}>
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">{suburb.smartPropertyScore}</div>
                  <div className="text-xs">Score</div>
                </div>
              </div>
              
              {/* Suburb Name */}
              <div className="mb-4">
                <h4 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition">
                  {suburb.name}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{suburb.state}</span>
                  {suburb.distanceKm && (
                    <>
                      <span>•</span>
                      <span>{suburb.distanceKm} km away</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Key Metrics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">Median Price</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    ${(suburb.medianPrice / 1000).toFixed(0)}k
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">12m Growth</span>
                  </div>
                  <span className={`font-bold ${suburb.priceGrowth12m >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {suburb.priceGrowth12m >= 0 ? '+' : ''}{suburb.priceGrowth12m.toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-700">Gross Yield</span>
                  </div>
                  <span className="font-bold text-purple-600">
                    {suburb.grossYield.toFixed(2)}%
                  </span>
                </div>
              </div>
              
              {/* Compare Button */}
              <button className="mt-4 w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg">
                <span>Compare</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
      
      {comparableSuburbs.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No comparable suburbs available</p>
          <p className="text-sm text-gray-400 mt-2">
            AI analysis will identify similar investment opportunities
          </p>
        </div>
      )}
      
      {/* View All Button */}
      {comparableSuburbs.length > 0 && (
        <div className="mt-6 text-center">
          <button className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all hover:shadow-lg">
            View All Similar Suburbs →
          </button>
        </div>
      )}
    </div>
  )
}
