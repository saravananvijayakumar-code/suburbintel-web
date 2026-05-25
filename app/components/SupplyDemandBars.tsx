/**
 * Supply vs Demand Heat Bars
 * 
 * Visual representation of market balance with animated heat bars
 */

'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface SupplyDemandBarsProps {
  listingsCurrent: number
  listingsTrend: 'up' | 'down' | 'stable'
  daysOnMarket: number
  salesVolume: number
  salesTrend: 'up' | 'down' | 'stable'
  demandScore: number
  stockOnMarket: number
}

export default function SupplyDemandBars(props: SupplyDemandBarsProps) {
  const [animated, setAnimated] = useState(false)
  
  useEffect(() => {
    setTimeout(() => setAnimated(true), 200)
  }, [])
  
  // Calculate supply pressure (0-100, lower is better)
  const supplyPressure = Math.min(100, Math.max(0, 
    (props.listingsCurrent / 200 * 40) + 
    (props.daysOnMarket / 60 * 30) + 
    (props.stockOnMarket / 5 * 30)
  ))
  
  // Demand is already 0-100
  const demandLevel = props.demandScore || 50
  
  // Market balance (-50 to +50, negative = oversupply, positive = high demand)
  const marketBalance = demandLevel - supplyPressure
  
  const getBalanceColor = (balance: number) => {
    if (balance > 20) return { bg: 'from-green-500 to-emerald-600', text: 'text-green-700', label: 'Strong Demand', ring: 'ring-green-200' }
    if (balance > 0) return { bg: 'from-blue-500 to-cyan-600', text: 'text-blue-700', label: 'Balanced Market', ring: 'ring-blue-200' }
    if (balance > -20) return { bg: 'from-yellow-500 to-amber-600', text: 'text-yellow-700', label: 'Slight Oversupply', ring: 'ring-yellow-200' }
    return { bg: 'from-red-500 to-rose-600', text: 'text-red-700', label: 'Oversupplied', ring: 'ring-red-200' }
  }
  
  const balanceStyle = getBalanceColor(marketBalance)
  
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Supply vs Demand Analysis</h3>
      
      {/* Main Balance Indicator */}
      <div className={`mb-8 p-6 rounded-xl bg-gradient-to-br ${balanceStyle.bg.replace('from-', 'from-').replace('to-', 'to-').replace('500', '50').replace('600', '100')} border-2 ${balanceStyle.ring}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-700">Market Balance</div>
            <div className={`text-3xl font-bold ${balanceStyle.text} mt-1`}>
              {balanceStyle.label}
            </div>
          </div>
          <div className={`text-5xl font-bold ${balanceStyle.text}`}>
            {marketBalance > 0 ? '+' : ''}{marketBalance.toFixed(0)}
          </div>
        </div>
      </div>
      
      {/* Demand Heat Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-gray-900">Demand Strength</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600">{demandLevel.toFixed(0)}/100</span>
            {props.salesTrend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
            {props.salesTrend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
            {props.salesTrend === 'stable' && <Minus className="w-4 h-4 text-gray-600" />}
          </div>
        </div>
        
        {/* Demand Bar */}
        <div className="relative h-10 bg-gray-100 rounded-xl overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl transition-all duration-1000 ease-out shadow-lg`}
            style={{ width: animated ? `${demandLevel}%` : '0%' }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-end pr-4">
            <span className="text-sm font-bold text-gray-700">{demandLevel.toFixed(0)}%</span>
          </div>
        </div>
        
        {/* Demand Metrics */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-xs text-gray-600">Sales Volume</div>
            <div className="text-lg font-bold text-gray-900">{props.salesVolume}/month</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-xs text-gray-600">Sales Trend</div>
            <div className="flex items-center gap-1">
              {props.salesTrend === 'up' && (
                <>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-lg font-bold text-green-600">Rising</span>
                </>
              )}
              {props.salesTrend === 'down' && (
                <>
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-lg font-bold text-red-600">Falling</span>
                </>
              )}
              {props.salesTrend === 'stable' && (
                <>
                  <Minus className="w-4 h-4 text-gray-600" />
                  <span className="text-lg font-bold text-gray-600">Stable</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Supply Heat Bar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-gray-900">Supply Pressure</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-orange-600">{supplyPressure.toFixed(0)}/100</span>
            {props.listingsTrend === 'up' && <TrendingUp className="w-4 h-4 text-red-600" />}
            {props.listingsTrend === 'down' && <TrendingDown className="w-4 h-4 text-green-600" />}
            {props.listingsTrend === 'stable' && <Minus className="w-4 h-4 text-gray-600" />}
          </div>
        </div>
        
        {/* Supply Bar */}
        <div className="relative h-10 bg-gray-100 rounded-xl overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl transition-all duration-1000 ease-out shadow-lg`}
            style={{ width: animated ? `${supplyPressure}%` : '0%' }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-end pr-4">
            <span className="text-sm font-bold text-gray-700">{supplyPressure.toFixed(0)}%</span>
          </div>
        </div>
        
        {/* Supply Metrics */}
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-xs text-gray-600">Listings</div>
            <div className="text-lg font-bold text-gray-900">{props.listingsCurrent}</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-xs text-gray-600">Days on Market</div>
            <div className="text-lg font-bold text-gray-900">{props.daysOnMarket}</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-xs text-gray-600">Stock Level</div>
            <div className="text-lg font-bold text-gray-900">{props.stockOnMarket.toFixed(1)}%</div>
          </div>
        </div>
      </div>
      
      {/* Insight */}
      <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="text-sm text-blue-900">
          <strong>Market Insight:</strong>{' '}
          {marketBalance > 20 && 'Strong buyer demand is outpacing supply, creating a competitive market favorable for sellers. Properties sell quickly with potential for price growth.'}
          {marketBalance > 0 && marketBalance <= 20 && 'The market shows healthy balance between supply and demand. Good conditions for both buyers and sellers with stable pricing.'}
          {marketBalance > -20 && marketBalance <= 0 && 'Supply slightly exceeds demand. Buyers have more negotiating power, though the market remains relatively stable.'}
          {marketBalance <= -20 && 'High supply relative to demand creates a buyers market. Properties take longer to sell and prices may face downward pressure.'}
        </div>
      </div>
    </div>
  )
}
