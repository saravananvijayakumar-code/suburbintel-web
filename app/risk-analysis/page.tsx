'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Flame, Droplets, Wind, MapPin, Shield, Info, Search, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '../components/DashboardLayout'
import { ProOnlyPage } from '@/components/FeatureGate'

interface RiskData {
  suburb: string
  state: string
  bushfireRisk: 'low' | 'medium' | 'high' | 'extreme' | null
  floodRisk: 'low' | 'medium' | 'high' | 'extreme' | null
  coastalErosion: boolean
  overallRiskScore: number
  dataSource?: string
}

interface PaginationData {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function RiskAnalysisPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState<'all' | 'NSW' | 'VIC' | 'ACT'>('all')
  const [selectedRisk, setSelectedRisk] = useState<'all' | 'bushfire' | 'flood' | 'coastal'>('all')
  const [riskData, setRiskData] = useState<RiskData[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 0
  })

  // Fetch data from API
  useEffect(() => {
    fetchRiskData()
  }, [selectedState, selectedRisk, searchTerm, pagination.page])

  const fetchRiskData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        state: selectedState,
        riskType: selectedRisk,
        search: searchTerm,
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      })

      const response = await fetch(`/api/risk-analysis?${params}`)
      const result = await response.json()

      setRiskData(result.data || [])
      setPagination(result.pagination || pagination)
    } catch (error) {
      console.error('Error fetching risk data:', error)
      setRiskData([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setPagination({ ...pagination, page: 1 }) // Reset to page 1 on new search
  }

  const getRiskColor = (risk: string | null) => {
    if (!risk) return 'text-gray-400'
    switch (risk) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-orange-600'
      case 'extreme': return 'text-red-600'
      default: return 'text-gray-400'
    }
  }

  const getRiskBadge = (risk: string | null) => {
    if (!risk) return 'bg-gray-100 text-gray-600 border border-gray-200'
    switch (risk) {
      case 'low': return 'bg-green-50 text-green-700 border border-green-200'
      case 'medium': return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
      case 'high': return 'bg-orange-50 text-orange-700 border border-orange-200'
      case 'extreme': return 'bg-red-50 text-red-700 border border-red-200'
      default: return 'bg-gray-100 text-gray-600 border border-gray-200'
    }
  }

  const getRiskScoreColor = (score: number) => {
    if (score > 70) return 'bg-red-500'
    if (score > 40) return 'bg-orange-500'
    if (score > 20) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getHighRiskSuburbs = () => {
    return riskData.filter(item => item.overallRiskScore > 60).length
  }

  return (
    <DashboardLayout>
      <ProOnlyPage 
        feature="advancedMetrics"
        title="Environmental Risk Analysis" 
        description="Access bushfire, flood, and coastal erosion risk data from official government sources"
      >
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            <span>Official Government Data</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Environmental Risk Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Assess bushfire, flood, and coastal erosion risks using official NSW & VIC government data sources
          </p>

          {/* Stats Bar */}
          <div className="flex items-center justify-center gap-8 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{pagination.total}</div>
              <div className="text-sm text-gray-600">Suburbs Analyzed</div>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{getHighRiskSuburbs()}</div>
              <div className="text-sm text-gray-600">High Risk Areas</div>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">2</div>
              <div className="text-sm text-gray-600">States Covered</div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-100 p-3 rounded-lg">
                <Flame className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Bushfire Risk</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Bushfire Prone Land mapping from <span className="font-semibold">NSW Rural Fire Service</span> and <span className="font-semibold">VIC CFA</span> (CC BY 4.0)
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Droplets className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Flood Risk</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Flood Planning Areas from <span className="font-semibold">NSW Planning Portal</span> and <span className="font-semibold">VIC Planning</span> (CC BY 4.0)
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-teal-100 p-3 rounded-lg">
                <Wind className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Coastal Erosion</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Coastal hazard zones from <span className="font-semibold">NSW Department of Planning</span> and <span className="font-semibold">VIC Coastal Assessment</span> (CC BY 4.0)
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filter
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Suburb
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Enter suburb name..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value as any)
                  setPagination({ ...pagination, page: 1 })
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">All States</option>
                <option value="NSW">NSW</option>
                <option value="VIC">VIC</option>
                <option value="ACT">ACT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Type
              </label>
              <select
                value={selectedRisk}
                onChange={(e) => {
                  setSelectedRisk(e.target.value as any)
                  setPagination({ ...pagination, page: 1 })
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">All Risks</option>
                <option value="bushfire">Bushfire Risk</option>
                <option value="flood">Flood Risk</option>
                <option value="coastal">Coastal Erosion</option>
              </select>
            </div>
          </div>
        </div>

        {/* Risk Data Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Suburb
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4" />
                      Bushfire
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <Droplets className="w-4 h-4" />
                      Flood
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <Wind className="w-4 h-4" />
                      Coastal
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Overall Risk
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        <span className="text-gray-500 font-medium">Loading risk data...</span>
                      </div>
                    </td>
                  </tr>
                ) : riskData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <AlertTriangle className="w-12 h-12 text-gray-400" />
                        <span className="text-gray-500 font-medium">No suburbs match your filters</span>
                        <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  riskData.map((item, index) => (
                    <tr key={index} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/suburb/${encodeURIComponent(item.suburb)}`}
                          className="flex items-center group"
                        >
                          <MapPin className="w-4 h-4 text-blue-500 mr-2 group-hover:scale-110 transition-transform" />
                          <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{item.suburb}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {item.state}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.bushfireRisk ? (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadge(item.bushfireRisk)}`}>
                            {item.bushfireRisk.toUpperCase()}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm font-medium">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.floodRisk ? (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadge(item.floodRisk)}`}>
                            {item.floodRisk.toUpperCase()}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm font-medium">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.coastalErosion ? (
                          <span className="px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-xs font-semibold">
                            YES
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold">
                            NO
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2.5 min-w-[100px]">
                            <div
                              className={`h-2.5 rounded-full transition-all ${getRiskScoreColor(item.overallRiskScore)}`}
                              style={{ width: `${item.overallRiskScore}%` }}
                            />
                          </div>
                          <span className={`text-sm font-bold min-w-[30px] ${item.overallRiskScore > 70 ? 'text-red-600' :
                              item.overallRiskScore > 40 ? 'text-orange-600' :
                                item.overallRiskScore > 20 ? 'text-yellow-600' :
                                  'text-green-600'
                            }`}>
                            {item.overallRiskScore}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {!loading && riskData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
              <span className="font-semibold">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
              <span className="font-semibold">{pagination.total}</span> suburbs
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPagination({ ...pagination, page: pageNum })}
                      className={`px-4 py-2 rounded-lg transition-colors ${pagination.page === pageNum
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Legal Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <p className="font-bold text-gray-900 mb-3 text-lg">Data Attribution & Licensing</p>
              <p className="mb-3 leading-relaxed">
                Environmental risk data is sourced from NSW and Victorian Government open data portals under Creative Commons Attribution 4.0 (CC BY 4.0) license:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li><span className="font-semibold">Bushfire Prone Land</span> - © NSW Rural Fire Service & VIC Country Fire Authority</li>
                <li><span className="font-semibold">Flood Planning Areas</span> - © NSW Department of Planning and Environment & VIC Planning</li>
                <li><span className="font-semibold">Coastal Erosion Hazards</span> - © NSW Department of Planning and Environment & VIC Coastal Assessment</li>
              </ul>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="font-semibold text-gray-900 mb-1">⚠️ Important Disclaimer</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  This information is provided for general guidance only. Always consult with qualified professionals, conduct thorough due diligence, and obtain current risk assessments from local councils before making property investment decisions. Risk data is updated quarterly based on government sources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </ProOnlyPage>
    </DashboardLayout>
  )
}
