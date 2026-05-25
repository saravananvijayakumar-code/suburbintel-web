/**
 * Investment Breakdown - ROI calculator and financial analysis
 */

'use client'

import { useState } from 'react'
import { DollarSign, TrendingUp, Calendar, Percent } from 'lucide-react'

interface InvestmentBreakdownProps {
  medianPrice: number
  grossYield: number
  priceGrowth12m: number
  priceGrowth3y: number
  rentalGrowth: number
  medianRent: number
}

export default function InvestmentBreakdown(props: InvestmentBreakdownProps) {
  const [deposit, setDeposit] = useState(20)
  const [interestRate, setInterestRate] = useState(6.5)
  const [holdingPeriod, setHoldingPeriod] = useState(10)
  
  // Calculations
  const purchasePrice = props.medianPrice
  const depositAmount = purchasePrice * (deposit / 100)
  const loanAmount = purchasePrice - depositAmount
  
  // Monthly mortgage (P&I)
  const monthlyRate = interestRate / 100 / 12
  const numPayments = holdingPeriod * 12
  const monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1)
  
  // Annual costs
  const annualMortgage = monthlyMortgage * 12
  const annualRent = props.medianRent * 52
  const annualRates = purchasePrice * 0.007 // ~0.7% of property value
  const annualInsurance = 1200
  const annualMaintenance = purchasePrice * 0.01 // 1% of property value
  const annualCosts = annualMortgage + annualRates + annualInsurance + annualMaintenance
  
  // Net cash flow
  const annualIncome = annualRent * 0.94 // Account for 6% vacancy/management
  const annualCashFlow = annualIncome - annualCosts
  
  // Future value with compound growth
  const avgGrowth = (props.priceGrowth12m + props.priceGrowth3y) / 2
  const futureValue = purchasePrice * Math.pow(1 + avgGrowth / 100, holdingPeriod)
  const capitalGain = futureValue - purchasePrice
  
  // Total return
  const totalCashFlow = annualCashFlow * holdingPeriod
  const totalReturn = capitalGain + totalCashFlow
  const roi = (totalReturn / depositAmount) * 100
  const annualROI = roi / holdingPeriod
  
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
          <DollarSign className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Investment Breakdown</h3>
          <p className="text-sm text-gray-600">ROI & cash flow analysis</p>
        </div>
      </div>
      
      {/* Input Controls */}
      <div className="space-y-4 mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div>
          <label className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Deposit</span>
            <span className="text-lg font-bold text-blue-600">{deposit}%</span>
          </label>
          <input
            type="range"
            min="10"
            max="40"
            step="5"
            value={deposit}
            onChange={(e) => setDeposit(Number(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="text-xs text-gray-600 mt-1">${depositAmount.toLocaleString()} deposit</div>
        </div>
        
        <div>
          <label className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Interest Rate</span>
            <span className="text-lg font-bold text-blue-600">{interestRate}%</span>
          </label>
          <input
            type="range"
            min="4"
            max="10"
            step="0.5"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
        
        <div>
          <label className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Holding Period</span>
            <span className="text-lg font-bold text-blue-600">{holdingPeriod} years</span>
          </label>
          <input
            type="range"
            min="5"
            max="30"
            step="5"
            value={holdingPeriod}
            onChange={(e) => setHoldingPeriod(Number(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>
      
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <Percent className="w-5 h-5 text-green-600 mb-2" />
          <div className="text-sm text-gray-600">Total ROI</div>
          <div className="text-2xl font-bold text-green-600">{roi.toFixed(0)}%</div>
          <div className="text-xs text-gray-600 mt-1">{annualROI.toFixed(1)}% p.a.</div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
          <TrendingUp className="w-5 h-5 text-blue-600 mb-2" />
          <div className="text-sm text-gray-600">Capital Gain</div>
          <div className="text-2xl font-bold text-blue-600">${(capitalGain / 1000).toFixed(0)}k</div>
          <div className="text-xs text-gray-600 mt-1">over {holdingPeriod} years</div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
          <DollarSign className="w-5 h-5 text-purple-600 mb-2" />
          <div className="text-sm text-gray-600">Cash Flow</div>
          <div className={`text-2xl font-bold ${annualCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {annualCashFlow >= 0 ? '+' : '-'}${Math.abs(annualCashFlow).toLocaleString()}
          </div>
          <div className="text-xs text-gray-600 mt-1">per year</div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
          <Calendar className="w-5 h-5 text-amber-600 mb-2" />
          <div className="text-sm text-gray-600">Total Return</div>
          <div className="text-2xl font-bold text-amber-600">${(totalReturn / 1000).toFixed(0)}k</div>
          <div className="text-xs text-gray-600 mt-1">on ${(depositAmount / 1000).toFixed(0)}k deposit</div>
        </div>
      </div>
      
      {/* Annual Breakdown */}
      <div className="space-y-6">
        {/* Income */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Annual Income
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-700">Rental Income (gross)</span>
              <span className="font-semibold text-gray-900">${annualRent.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-700">Net Rental Income (after vacancy)</span>
              <span className="font-semibold text-green-600">${annualIncome.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        {/* Expenses */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-red-600" />
            Annual Expenses
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-gray-700">Mortgage (P&I)</span>
              <span className="font-semibold text-gray-900">${annualMortgage.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-gray-700">Council Rates</span>
              <span className="font-semibold text-gray-900">${annualRates.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-gray-700">Insurance</span>
              <span className="font-semibold text-gray-900">${annualInsurance.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-gray-700">Maintenance</span>
              <span className="font-semibold text-gray-900">${annualMaintenance.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-t-2 border-red-200">
              <span className="text-sm font-bold text-gray-900">Total Expenses</span>
              <span className="font-bold text-red-600">${annualCosts.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary */}
      <div className={`mt-6 p-6 rounded-xl border-2 ${roi > 100 ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' : roi > 50 ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300' : 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300'}`}>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700 mb-2">Investment Verdict</div>
          <div className={`text-3xl font-bold mb-2 ${roi > 100 ? 'text-green-600' : roi > 50 ? 'text-blue-600' : 'text-yellow-600'}`}>
            {roi > 100 && 'Excellent Investment'}
            {roi > 50 && roi <= 100 && 'Good Investment'}
            {roi <= 50 && 'Moderate Returns'}
          </div>
          <p className="text-sm text-gray-700">
            Your ${(depositAmount / 1000).toFixed(0)}k deposit could return ${(totalReturn / 1000).toFixed(0)}k over {holdingPeriod} years
            ({annualROI.toFixed(1)}% annual return)
          </p>
        </div>
      </div>
    </div>
  )
}
