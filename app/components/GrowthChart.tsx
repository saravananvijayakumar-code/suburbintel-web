/**
 * Growth Chart - Multi-period Price Growth Visualization
 * 
 * Beautiful chart showing 6m, 1y, 3y, 5y, 10y growth with smooth animations
 */

'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface GrowthChartProps {
  data: {
    period: string
    growth: number
    medianPrice?: number
  }[]
}

export default function GrowthChart({ data }: GrowthChartProps) {
  const [animated, setAnimated] = useState(false)
  
  useEffect(() => {
    setTimeout(() => setAnimated(true), 100)
  }, [])
  
  const maxGrowth = Math.max(...data.map(d => Math.abs(d.growth)))
  const scale = 100 / (maxGrowth || 1)
  
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Price Growth Analysis</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"></div>
            <span>Growth</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-rose-600"></div>
            <span>Decline</span>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="space-y-6">
        {data.map((item, index) => {
          const isPositive = item.growth >= 0
          const barHeight = Math.abs(item.growth) * scale
          
          return (
            <div key={index} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700 w-12">{item.period}</span>
                  <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="text-lg font-bold">
                      {isPositive ? '+' : ''}{item.growth.toFixed(1)}%
                    </span>
                  </div>
                </div>
                {item.medianPrice && (
                  <span className="text-sm text-gray-600">
                    ${item.medianPrice.toLocaleString()}
                  </span>
                )}
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className={`absolute inset-y-0 ${isPositive ? 'left-0' : 'right-0'} 
                    bg-gradient-to-r ${isPositive ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600'}
                    rounded-lg transition-all duration-1000 ease-out
                    group-hover:shadow-lg group-hover:scale-y-110`}
                  style={{
                    width: animated ? `${barHeight}%` : '0%'
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Summary */}
      <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-blue-700 font-medium">Average Annual Growth</div>
            <div className="text-2xl font-bold text-blue-900 mt-1">
              {(data.reduce((sum, d) => sum + d.growth, 0) / data.length).toFixed(1)}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-700 font-medium">Best Period</div>
            <div className="text-lg font-bold text-blue-900 mt-1">
              {data.reduce((max, d) => d.growth > max.growth ? d : max).period}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
