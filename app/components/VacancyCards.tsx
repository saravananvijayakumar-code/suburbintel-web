/**
 * Vacancy Cards - Rental market health indicators
 */

'use client'

import { Home, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

interface VacancyCardsProps {
  vacancyRate: number
  grossYield: number
  rentalGrowth12m: number
  rentalRiskScore?: number
  medianRent: number
}

export default function VacancyCards(props: VacancyCardsProps) {
  const getVacancyStatus = (rate: number) => {
    if (rate < 1.5) return {
      label: 'Very Tight',
      color: 'green',
      bg: 'from-green-500 to-emerald-600',
      icon: <CheckCircle className="w-6 h-6" />,
      description: 'Excellent rental demand with minimal vacancies'
    }
    if (rate < 2.5) return {
      label: 'Healthy',
      color: 'blue',
      bg: 'from-blue-500 to-cyan-600',
      icon: <CheckCircle className="w-6 h-6" />,
      description: 'Strong rental market with good tenant demand'
    }
    if (rate < 3.5) return {
      label: 'Balanced',
      color: 'yellow',
      bg: 'from-yellow-500 to-amber-600',
      icon: <Home className="w-6 h-6" />,
      description: 'Moderate rental market conditions'
    }
    return {
      label: 'Soft',
      color: 'red',
      bg: 'from-red-500 to-rose-600',
      icon: <AlertCircle className="w-6 h-6" />,
      description: 'High vacancy rate may indicate oversupply'
    }
  }
  
  const getYieldRating = (yield_: number) => {
    if (yield_ >= 5) return { label: 'Excellent', color: 'green' }
    if (yield_ >= 4) return { label: 'Good', color: 'blue' }
    if (yield_ >= 3.5) return { label: 'Average', color: 'yellow' }
    return { label: 'Below Average', color: 'orange' }
  }
  
  const vacancyStatus = getVacancyStatus(props.vacancyRate)
  const yieldRating = getYieldRating(props.grossYield)
  
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Rental Market Health</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vacancy Rate Card */}
        <div className={`p-6 rounded-xl bg-gradient-to-br ${vacancyStatus.bg.replace('500', '50').replace('600', '100')} border-2 border-${vacancyStatus.color}-300`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${vacancyStatus.bg} shadow-lg text-white`}>
              {vacancyStatus.icon}
            </div>
            <div className={`text-sm font-bold px-3 py-1 rounded-full bg-white text-${vacancyStatus.color}-700`}>
              {vacancyStatus.label}
            </div>
          </div>
          
          <div className="text-sm text-gray-600 mb-2">Vacancy Rate</div>
          <div className={`text-5xl font-bold text-${vacancyStatus.color}-700 mb-3`}>
            {props.vacancyRate.toFixed(1)}%
          </div>
          <p className="text-sm text-gray-700">{vacancyStatus.description}</p>
        </div>
        
        {/* Gross Yield Card */}
        <div className={`p-6 rounded-xl bg-gradient-to-br from-${yieldRating.color}-50 to-${yieldRating.color}-100 border-2 border-${yieldRating.color}-300`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br from-${yieldRating.color}-500 to-${yieldRating.color}-600 shadow-lg text-white`}>
              <Home className="w-6 h-6" />
            </div>
            <div className={`text-sm font-bold px-3 py-1 rounded-full bg-white text-${yieldRating.color}-700`}>
              {yieldRating.label}
            </div>
          </div>
          
          <div className="text-sm text-gray-600 mb-2">Gross Yield</div>
          <div className={`text-5xl font-bold text-${yieldRating.color}-700 mb-3`}>
            {props.grossYield.toFixed(2)}%
          </div>
          <p className="text-sm text-gray-700">
            ${props.medianRent.toLocaleString()} per week rental income
          </p>
        </div>
      </div>
      
      {/* Rental Growth */}
      <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${props.rentalGrowth12m >= 0 ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-rose-600'} shadow-lg text-white`}>
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-gray-600">12-Month Rental Growth</div>
              <div className={`text-3xl font-bold ${props.rentalGrowth12m >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {props.rentalGrowth12m >= 0 ? '+' : ''}{props.rentalGrowth12m.toFixed(1)}%
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Annual Rent</div>
            <div className="text-2xl font-bold text-gray-900">
              ${(props.medianRent * 52).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Rental Risk Score */}
      {props.rentalRiskScore !== undefined && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Rental Risk</span>
            <span className="text-sm font-bold text-gray-900">{props.rentalRiskScore}/100</span>
          </div>
          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
                props.rentalRiskScore < 30 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                props.rentalRiskScore < 60 ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
                'bg-gradient-to-r from-red-500 to-rose-600'
              }`}
              style={{ width: `${props.rentalRiskScore}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-600">
            {props.rentalRiskScore < 30 && 'Low risk - stable rental market with strong fundamentals'}
            {props.rentalRiskScore >= 30 && props.rentalRiskScore < 60 && 'Moderate risk - monitor market conditions'}
            {props.rentalRiskScore >= 60 && 'Higher risk - potential rental challenges or market softness'}
          </div>
        </div>
      )}
      
      {/* Summary Insight */}
      <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
        <div className="text-sm text-blue-900">
          <strong>Rental Outlook:</strong>{' '}
          {props.vacancyRate < 2 && props.grossYield >= 4 && 'Excellent rental market with tight vacancy and strong yields. Ideal for investors seeking rental income.'}
          {props.vacancyRate < 2 && props.grossYield < 4 && 'Strong tenant demand but yields are moderate. Capital growth may be the primary driver here.'}
          {props.vacancyRate >= 2 && props.vacancyRate < 3.5 && 'Balanced rental market. Expect steady occupancy with reasonable yields.'}
          {props.vacancyRate >= 3.5 && 'Softer rental market with higher vacancies. Consider price point carefully for rental investments.'}
        </div>
      </div>
    </div>
  )
}
