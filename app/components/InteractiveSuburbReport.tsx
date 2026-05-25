'use client'

import React, { useState } from 'react'
import {
  FileText,
  Download,
  Share2,
  BarChart3,
  TrendingUp,
  MapPin,
  Users,
  DollarSign,
  Home,
  AlertTriangle,
  CheckCircle,
  X,
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

interface SuburbReportData {
  name: string
  state: string
  postcode: string
  medianPrice: number
  growth12m: number | null
  growth6m: number | null
  growth3m: number | null
  rentalYield: number | null
  investmentScore: number | null
  population: number | null
  medianAge: number | null
  medianIncome: number | null
  floodRisk: 'low' | 'medium' | 'high' | null
  bushfireRisk: 'low' | 'medium' | 'high' | null
  crimeRisk: 'low' | 'medium' | 'high' | null
  analysis: string
  lastUpdated: string
  priceHistory?: Array<{ month: string; medianPrice: number; weeklyRent?: number }>
  similarSuburbs?: Array<{ name: string; state: string; medianPrice: number; growth12m: number | null; investmentScore: number | null }>
}

interface InteractiveSuburbReportProps {
  data: SuburbReportData
  hasProAccess?: boolean
}

export default function InteractiveSuburbReport({ data }: InteractiveSuburbReportProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'risk'>('overview')

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0 }).format(value)

  const formatPercent = (value: number | null) =>
    value === null ? 'N/A' : `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`

  const getRiskColor = (risk: string | null) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const priceHistoryData = data.priceHistory?.map(item => ({
    date: new Date(item.month).toLocaleDateString('en-AU', { year: 'numeric', month: 'short' }),
    price: item.medianPrice,
  })) || []

  const growthData = [
    { period: '3M', growth: data.growth3m },
    { period: '6M', growth: data.growth6m },
    { period: '12M', growth: data.growth12m },
  ].filter(item => item.growth !== null)

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6" />
            <h3 className="text-xl font-bold">Investment Report</h3>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30 transition"
          >
            <Download className="h-4 w-4" />
            Print
          </button>
        </div>
        <p className="mt-2 text-indigo-100">
          {data.name}, {data.state} {data.postcode} · Updated {new Date(data.lastUpdated).toLocaleDateString('en-AU')}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          {[
            { id: 'overview', label: 'Overview', icon: Home },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'risk', label: 'Risk', icon: AlertTriangle },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition ${
                activeTab === id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <DollarSign className="h-5 w-5 text-blue-600 mb-2" />
                <div className="text-sm text-blue-700">Median Price</div>
                <div className="text-xl font-bold text-blue-900">{formatCurrency(data.medianPrice)}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <TrendingUp className="h-5 w-5 text-green-600 mb-2" />
                <div className="text-sm text-green-700">12M Growth</div>
                <div className={`text-xl font-bold ${data.growth12m && data.growth12m >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercent(data.growth12m)}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <Home className="h-5 w-5 text-purple-600 mb-2" />
                <div className="text-sm text-purple-700">Rental Yield</div>
                <div className="text-xl font-bold text-purple-900">{formatPercent(data.rentalYield)}</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <BarChart3 className="h-5 w-5 text-orange-600 mb-2" />
                <div className="text-sm text-orange-700">Score</div>
                <div className="text-xl font-bold text-orange-900">{data.investmentScore ? `${data.investmentScore}/100` : 'N/A'}</div>
              </div>
            </div>

            {(data.population || data.medianAge || data.medianIncome) && (
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Users className="h-4 w-4" /> Demographics</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {data.population && <div><div className="text-lg font-bold">{data.population.toLocaleString()}</div><div className="text-xs text-gray-500">Population</div></div>}
                  {data.medianAge && <div><div className="text-lg font-bold">{data.medianAge}</div><div className="text-xs text-gray-500">Median Age</div></div>}
                  {data.medianIncome && <div><div className="text-lg font-bold">{formatCurrency(data.medianIncome)}</div><div className="text-xs text-gray-500">Median Income</div></div>}
                </div>
              </div>
            )}

            {data.analysis && (
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Analysis</h4>
                <div className="text-sm text-blue-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: data.analysis }} />
              </div>
            )}
          </div>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {priceHistoryData.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Price History</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceHistoryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(v: any) => [formatCurrency(v), 'Price']} />
                      <Line type="monotone" dataKey="price" stroke="#4f46e5" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {growthData.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Growth Performance</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="period" />
                      <YAxis tickFormatter={(v) => `${v}%`} />
                      <Tooltip formatter={(v: any) => [`${v.toFixed(1)}%`, 'Growth']} />
                      <Bar dataKey="growth" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Risk */}
        {activeTab === 'risk' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Environmental Risk Assessment</h4>
            {[
              { label: 'Flood Risk', value: data.floodRisk },
              { label: 'Bushfire Risk', value: data.bushfireRisk },
              { label: 'Crime Risk', value: data.crimeRisk },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getRiskColor(item.value)}`}>
                  {item.value || 'Unknown'}
                </span>
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-4">
              Risk data sourced from NSW RFS, BOM flood maps, and BOCSAR crime statistics.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
