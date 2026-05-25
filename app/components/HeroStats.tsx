/**
 * Hero Stats Section - Large eye-catching stat cards
 */

'use client'

import { useEffect, useState } from 'react'
import { Home, TrendingUp, DollarSign, Award, Calendar, Users } from 'lucide-react'

interface HeroStatsProps {
  medianPrice: number
  priceGrowth12m: number
  grossYield: number
  smartPropertyScore: number
  daysOnMarket?: number
  population?: number
}

export default function HeroStats(props: HeroStatsProps) {
  const [animated, setAnimated] = useState(false)
  
  useEffect(() => {
    setTimeout(() => setAnimated(true), 200)
  }, [])
  
  const getScoreRating = (score: number) => {
    if (score >= 85) return { label: 'A+', color: 'emerald', bg: 'from-emerald-500 to-green-600' }
    if (score >= 75) return { label: 'A', color: 'green', bg: 'from-green-500 to-emerald-600' }
    if (score >= 65) return { label: 'B+', color: 'blue', bg: 'from-blue-500 to-cyan-600' }
    if (score >= 55) return { label: 'B', color: 'cyan', bg: 'from-cyan-500 to-blue-600' }
    if (score >= 45) return { label: 'C+', color: 'yellow', bg: 'from-yellow-500 to-amber-600' }
    if (score >= 35) return { label: 'C', color: 'orange', bg: 'from-orange-500 to-amber-600' }
    return { label: 'D', color: 'red', bg: 'from-red-500 to-rose-600' }
  }
  
  const scoreRating = getScoreRating(props.smartPropertyScore)
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Median Price */}
      <div className={`bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-8 text-white shadow-xl transform transition-all duration-1000 ${animated ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="flex items-center justify-between mb-4">
          <Home className="w-12 h-12 opacity-80" />
          <div className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
            House
          </div>
        </div>
        <div className="text-sm font-medium opacity-80 mb-2">Median Price</div>
        <div className="text-5xl font-bold mb-2">
          ${(props.medianPrice / 1000).toFixed(0)}k
        </div>
        <div className="text-sm opacity-80">
          ${props.medianPrice.toLocaleString()}
        </div>
      </div>
      
      {/* 12m Growth */}
      <div className={`bg-gradient-to-br ${props.priceGrowth12m >= 0 ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600'} rounded-2xl p-8 text-white shadow-xl transform transition-all duration-1000 delay-100 ${animated ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="flex items-center justify-between mb-4">
          <TrendingUp className="w-12 h-12 opacity-80" />
          <div className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
            12 Months
          </div>
        </div>
        <div className="text-sm font-medium opacity-80 mb-2">Price Growth</div>
        <div className="text-5xl font-bold mb-2">
          {props.priceGrowth12m >= 0 ? '+' : ''}{props.priceGrowth12m.toFixed(1)}%
        </div>
        <div className="text-sm opacity-80">
          {props.priceGrowth12m >= 0 ? 'Capital growth' : 'Price decline'}
        </div>
      </div>
      
      {/* Gross Yield */}
      <div className={`bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl transform transition-all duration-1000 delay-200 ${animated ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="flex items-center justify-between mb-4">
          <DollarSign className="w-12 h-12 opacity-80" />
          <div className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
            Annual
          </div>
        </div>
        <div className="text-sm font-medium opacity-80 mb-2">Gross Yield</div>
        <div className="text-5xl font-bold mb-2">
          {props.grossYield.toFixed(2)}%
        </div>
        <div className="text-sm opacity-80">
          Rental return
        </div>
      </div>
      
      {/* Smart Property Score */}
      <div className={`bg-gradient-to-br ${scoreRating.bg} rounded-2xl p-8 text-white shadow-xl transform transition-all duration-1000 delay-300 ${animated ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="flex items-center justify-between mb-4">
          <Award className="w-12 h-12 opacity-80" />
          <div className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
            {scoreRating.label} Grade
          </div>
        </div>
        <div className="text-sm font-medium opacity-80 mb-2">Smart Property Score</div>
        <div className="text-5xl font-bold mb-2">
          {props.smartPropertyScore}/100
        </div>
        <div className="text-sm opacity-80">
          Investment rating
        </div>
      </div>
      
      {/* Days on Market */}
      {props.daysOnMarket !== undefined && (
        <div className={`bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl transform transition-all duration-1000 delay-400 ${animated ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-12 h-12 opacity-80" />
            <div className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
              Median
            </div>
          </div>
          <div className="text-sm font-medium opacity-80 mb-2">Days on Market</div>
          <div className="text-5xl font-bold mb-2">
            {props.daysOnMarket}
          </div>
          <div className="text-sm opacity-80">
            {props.daysOnMarket < 30 ? 'Fast selling' : props.daysOnMarket < 60 ? 'Moderate' : 'Slow market'}
          </div>
        </div>
      )}
      
      {/* Population */}
      {props.population !== undefined && (
        <div className={`bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-8 text-white shadow-xl transform transition-all duration-1000 delay-500 ${animated ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="flex items-center justify-between mb-4">
            <Users className="w-12 h-12 opacity-80" />
            <div className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
              Residents
            </div>
          </div>
          <div className="text-sm font-medium opacity-80 mb-2">Population</div>
          <div className="text-5xl font-bold mb-2">
            {(props.population / 1000).toFixed(1)}k
          </div>
          <div className="text-sm opacity-80">
            {props.population.toLocaleString()} people
          </div>
        </div>
      )}
    </div>
  )
}
