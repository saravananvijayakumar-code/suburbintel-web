/**
 * Rent vs Buy Simulator - Interactive Calculator
 * 
 * Calculate whether it's better to rent or buy with beautiful UI
 */

'use client'

import { useState } from 'react'
import { Home, DollarSign, TrendingUp, Calendar } from 'lucide-react'

interface RentVsBuySimulatorProps {
  defaultPrice: number
  defaultRent: number
}

export default function RentVsBuySimulator({ defaultPrice, defaultRent }: RentVsBuySimulatorProps) {
  const [purchasePrice, setPurchasePrice] = useState(defaultPrice)
  const [weeklyRent, setWeeklyRent] = useState(defaultRent)
  const [deposit, setDeposit] = useState(20)
  const [interestRate, setInterestRate] = useState(6.5)
  const [years, setYears] = useState(10)
  const [priceGrowth, setPriceGrowth] = useState(5)
  const [rentGrowth, setRentGrowth] = useState(4)
  
  // Calculations
  const depositAmount = purchasePrice * (deposit / 100)
  const loanAmount = purchasePrice - depositAmount
  const monthlyRate = interestRate / 100 / 12
  const totalPayments = years * 12
  const monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1)
  const monthlyRent = weeklyRent * 52 / 12
  
  // Total costs over period
  const totalMortgagePayments = monthlyMortgage * totalPayments
  const futurePropertyValue = purchasePrice * Math.pow(1 + priceGrowth / 100, years)
  const equityGained = futurePropertyValue - loanAmount
  const netCostBuy = depositAmount + totalMortgagePayments - equityGained
  
  let totalRentPayments = 0
  let currentRent = monthlyRent
  for (let i = 0; i < years; i++) {
    totalRentPayments += currentRent * 12
    currentRent *= (1 + rentGrowth / 100)
  }
  const netCostRent = totalRentPayments
  
  const recommendation = netCostBuy < netCostRent ? 'buy' : 'rent'
  const savings = Math.abs(netCostBuy - netCostRent)
  
  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl p-8 shadow-xl border border-purple-200">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg">
          <Home className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Rent vs Buy Calculator</h3>
          <p className="text-sm text-gray-600">Find the best financial decision for you</p>
        </div>
      </div>
      
      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Purchase Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Purchase Price
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition"
            />
          </div>
        </div>
        
        {/* Weekly Rent */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Weekly Rent
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={weeklyRent}
              onChange={(e) => setWeeklyRent(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition"
            />
          </div>
        </div>
        
        {/* Deposit % */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Deposit ({deposit}%)
          </label>
          <input
            type="range"
            min="5"
            max="30"
            step="5"
            value={deposit}
            onChange={(e) => setDeposit(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="text-sm text-gray-600 mt-1">${depositAmount.toLocaleString()}</div>
        </div>
        
        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Interest Rate ({interestRate}%)
          </label>
          <input
            type="range"
            min="3"
            max="10"
            step="0.5"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="text-sm text-gray-600 mt-1">${monthlyMortgage.toLocaleString(undefined, {maximumFractionDigits: 0})}/month</div>
        </div>
        
        {/* Time Period */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Time Period ({years} years)
          </label>
          <input
            type="range"
            min="5"
            max="30"
            step="5"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>
        
        {/* Growth Rates */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Price Growth: {priceGrowth}% | Rent Growth: {rentGrowth}%
          </label>
          <div className="flex gap-2">
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={priceGrowth}
              onChange={(e) => setPriceGrowth(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={rentGrowth}
              onChange={(e) => setRentGrowth(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Buy Option */}
        <div className={`p-6 rounded-2xl border-2 transition ${
          recommendation === 'buy' 
            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 shadow-lg' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-900">Buy</h4>
            {recommendation === 'buy' && (
              <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                WINNER ✓
              </span>
            )}
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Deposit</span>
              <span className="font-semibold">${depositAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Payments</span>
              <span className="font-semibold">${totalMortgagePayments.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Property Value ({years}y)</span>
              <span className="font-semibold text-green-600">${futurePropertyValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Equity Gained</span>
              <span className="font-semibold text-green-600">${equityGained.toLocaleString()}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between">
              <span className="font-bold text-gray-900">Net Cost</span>
              <span className="font-bold text-gray-900">${netCostBuy.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        {/* Rent Option */}
        <div className={`p-6 rounded-2xl border-2 transition ${
          recommendation === 'rent' 
            ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-500 shadow-lg' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-900">Rent</h4>
            {recommendation === 'rent' && (
              <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                WINNER ✓
              </span>
            )}
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Rent (Year 1)</span>
              <span className="font-semibold">${monthlyRent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Rent (Year {years})</span>
              <span className="font-semibold">${(monthlyRent * Math.pow(1 + rentGrowth / 100, years - 1)).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Rent Paid</span>
              <span className="font-semibold text-red-600">${totalRentPayments.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Equity Gained</span>
              <span className="font-semibold">$0</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between">
              <span className="font-bold text-gray-900">Net Cost</span>
              <span className="font-bold text-gray-900">${netCostRent.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recommendation */}
      <div className={`p-6 rounded-2xl ${
        recommendation === 'buy' 
          ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
          : 'bg-gradient-to-r from-blue-500 to-cyan-600'
      } text-white shadow-xl`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium opacity-90">Our Recommendation</div>
            <div className="text-3xl font-bold mt-1 uppercase">
              {recommendation === 'buy' ? '🏠 BUY' : '🏘️ RENT'}
            </div>
            <div className="text-sm mt-2 opacity-90">
              Save ${savings.toLocaleString()} over {years} years
            </div>
          </div>
          <TrendingUp className="w-12 h-12 opacity-80" />
        </div>
      </div>
    </div>
  )
}
