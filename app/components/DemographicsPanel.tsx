/**
 * Demographics Panel - Beautiful visualization of suburb demographics
 */

'use client'

import { Users, Briefcase, GraduationCap, Home, Baby, Heart } from 'lucide-react'

interface DemographicsPanelProps {
  population: number
  populationGrowth: number
  medianAge: number
  medianIncome: number
  medianHouseholdSize: number
  renterPercentage: number
  ownerOccupierPercentage: number
  employmentRate: number
  bachelorDegree: number
  familiesPercent: number
  ageDistribution?: {
    '0-14': number
    '15-24': number
    '25-34': number
    '35-44': number
    '45-54': number
    '55-64': number
    '65+': number
  }
}

export default function DemographicsPanel(props: DemographicsPanelProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Demographics</h3>
          <p className="text-sm text-gray-600">Population & lifestyle profile</p>
        </div>
      </div>
      
      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
          <Users className="w-5 h-5 text-blue-600 mb-2" />
          <div className="text-sm text-gray-600">Population</div>
          <div className="text-2xl font-bold text-gray-900">{props.population.toLocaleString()}</div>
          <div className={`text-xs mt-1 ${props.populationGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {props.populationGrowth >= 0 ? '↗' : '↘'} {Math.abs(props.populationGrowth).toFixed(1)}% growth
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <Heart className="w-5 h-5 text-purple-600 mb-2" />
          <div className="text-sm text-gray-600">Median Age</div>
          <div className="text-2xl font-bold text-gray-900">{props.medianAge}</div>
          <div className="text-xs text-gray-600 mt-1">years</div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <Briefcase className="w-5 h-5 text-green-600 mb-2" />
          <div className="text-sm text-gray-600">Median Income</div>
          <div className="text-2xl font-bold text-gray-900">${(props.medianIncome / 1000).toFixed(0)}k</div>
          <div className="text-xs text-gray-600 mt-1">per year</div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
          <Home className="w-5 h-5 text-amber-600 mb-2" />
          <div className="text-sm text-gray-600">Household Size</div>
          <div className="text-2xl font-bold text-gray-900">{props.medianHouseholdSize.toFixed(1)}</div>
          <div className="text-xs text-gray-600 mt-1">people</div>
        </div>
      </div>
      
      {/* Age Distribution */}
      {props.ageDistribution && (
        <div className="mb-8">
          <h4 className="font-bold text-gray-900 mb-4">Age Distribution</h4>
          <div className="space-y-3">
            {Object.entries(props.ageDistribution).map(([range, percentage]) => (
              <div key={range}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{range} years</span>
                  <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
                </div>
                <div className="relative h-6 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg transition-all"
                    style={{ width: `${percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Housing & Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Housing Tenure */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Housing Tenure</h4>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">Owner Occupiers</span>
                <span className="text-sm font-semibold text-green-600">{props.ownerOccupierPercentage}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                  style={{ width: `${props.ownerOccupierPercentage}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">Renters</span>
                <span className="text-sm font-semibold text-blue-600">{props.renterPercentage}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-600"
                  style={{ width: `${props.renterPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Employment & Education */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Employment & Education</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">Employment Rate</span>
              </div>
              <span className="text-lg font-bold text-green-600">{props.employmentRate}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">Bachelor's Degree</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{props.bachelorDegree}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2">
                <Baby className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-700">Families</span>
              </div>
              <span className="text-lg font-bold text-purple-600">{props.familiesPercent}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
