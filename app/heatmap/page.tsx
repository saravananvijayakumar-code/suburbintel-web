'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Lock, TrendingUp, MapPin, DollarSign, BarChart3, Filter, ArrowUpRight, ArrowDownRight, Minus, Search, RefreshCw, Loader2 } from 'lucide-react'
import { useSubscription } from '@/contexts/SubscriptionContext'
import DashboardLayout from '@/app/components/DashboardLayout'

interface SuburbData {
    id: string
    name: string
    state: string
    postcode: string
    medianPrice: number | null
    rentalYield: number | null
    growth12m: number | null
    growth5y: number | null
    investmentScore: number | null
    population: number | null
    demandScore: number | null
}

type MetricType = 'medianPrice' | 'rentalYield' | 'growth12m' | 'investmentScore' | 'demandScore'
type StateFilter = 'ALL' | 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT'

const METRIC_CONFIG: Record<MetricType, { label: string; format: (v: number) => string; colorScale: 'price' | 'yield' | 'growth' | 'score' }> = {
    medianPrice: { label: 'Median Price', format: (v) => `$${(v / 1000).toFixed(0)}K`, colorScale: 'price' },
    rentalYield: { label: 'Rental Yield', format: (v) => `${v.toFixed(2)}%`, colorScale: 'yield' },
    growth12m: { label: '12M Growth', format: (v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`, colorScale: 'growth' },
    investmentScore: { label: 'Investment Score', format: (v) => v.toFixed(0), colorScale: 'score' },
    demandScore: { label: 'Demand Score', format: (v) => v.toFixed(0), colorScale: 'score' },
}

function getHeatColor(value: number, min: number, max: number, colorScale: 'price' | 'yield' | 'growth' | 'score'): string {
    if (value === null || value === undefined) return 'bg-gray-100'
    
    const normalized = max === min ? 0.5 : (value - min) / (max - min)
    
    if (colorScale === 'growth') {
        // For growth: red (negative) -> yellow (0) -> green (positive)
        if (value < 0) {
            const intensity = Math.min(1, Math.abs(value) / 10)
            return intensity > 0.5 ? 'bg-red-500 text-white' : 'bg-red-300'
        } else if (value > 5) {
            return 'bg-green-500 text-white'
        } else if (value > 0) {
            return 'bg-green-300'
        }
        return 'bg-yellow-200'
    }
    
    // For other metrics: cold (blue) -> warm (red) based on value
    if (normalized < 0.2) return 'bg-blue-200'
    if (normalized < 0.4) return 'bg-green-200'
    if (normalized < 0.6) return 'bg-yellow-200'
    if (normalized < 0.8) return 'bg-orange-300'
    return 'bg-red-400 text-white'
}

export default function HeatmapPage() {
    const { subscriptionTier } = useSubscription()
    const [suburbs, setSuburbs] = useState<SuburbData[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedMetric, setSelectedMetric] = useState<MetricType>('medianPrice')
    const [stateFilter, setStateFilter] = useState<StateFilter>('ALL')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<'value' | 'name'>('value')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    useEffect(() => {
        fetchSuburbs()
    }, [])

    const fetchSuburbs = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/heatmap')
            if (res.ok) {
                const data = await res.json()
                setSuburbs(data.suburbs || [])
            }
        } catch (error) {
            console.error('Failed to fetch heatmap data:', error)
        } finally {
            setLoading(false)
        }
    }

    // Only Pro users can access heatmaps
    if (subscriptionTier === 'free') {
        return (
            <DashboardLayout>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
                <div className="max-w-3xl w-full">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
                                <Lock className="h-10 w-10 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Pro Feature
                            </h1>
                            <p className="text-blue-100 text-lg">
                                Interactive heat maps require a Pro plan
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    Unlock Investment Heatmaps
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    Visualize investment opportunities across Australia with our powerful heatmap tool, 
                                    showing price trends, rental yields, and growth potential at a glance.
                                </p>
                            </div>

                            {/* Features */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <MapPin className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Geographic Visualization</h3>
                                        <p className="text-gray-600">
                                            See investment hotspots across states and regions with color-coded maps
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <TrendingUp className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Growth Indicators</h3>
                                        <p className="text-gray-600">
                                            Identify areas with strong historical growth and future potential
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                                        <DollarSign className="h-6 w-6 text-pink-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Rental Yield Analysis</h3>
                                        <p className="text-gray-600">
                                            Compare rental yields across suburbs to find cash-flow positive investments
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <BarChart3 className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Advanced Metrics</h3>
                                        <p className="text-gray-600">
                                            Filter by price ranges, demographics, and custom investment criteria
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 text-center">
                                <p className="text-gray-700 mb-4">
                                    Available on <strong className="text-indigo-600">Pro</strong> plan
                                </p>
                                <Link
                                    href="/pricing"
                                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                                >
                                    Upgrade to Pro
                                </Link>
                                <p className="text-sm text-gray-600 mt-4">
                                    Just $4.99/month ☕ Less than a coffee • Cancel anytime
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </DashboardLayout>
        )
    }

    // Filter and sort suburbs
    const filteredSuburbs = suburbs
        .filter(s => stateFilter === 'ALL' || s.state === stateFilter)
        .filter(s => 
            searchQuery === '' || 
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.postcode.includes(searchQuery)
        )
        .filter(s => s[selectedMetric] !== null)
        .sort((a, b) => {
            if (sortBy === 'name') {
                return sortOrder === 'asc' 
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name)
            }
            const aVal = a[selectedMetric] ?? 0
            const bVal = b[selectedMetric] ?? 0
            return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
        })

    // Calculate min/max for color scaling
    const values = filteredSuburbs.map(s => s[selectedMetric] ?? 0)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)

    // Group by state for summary
    const stateSummary = suburbs.reduce((acc, s) => {
        if (!acc[s.state]) {
            acc[s.state] = { count: 0, totalScore: 0, avgPrice: 0, totalPrice: 0 }
        }
        acc[s.state].count++
        if (s.investmentScore) acc[s.state].totalScore += s.investmentScore
        if (s.medianPrice) {
            acc[s.state].totalPrice += s.medianPrice
            acc[s.state].avgPrice = acc[s.state].totalPrice / acc[s.state].count
        }
        return acc
    }, {} as Record<string, { count: number; totalScore: number; avgPrice: number; totalPrice: number }>)

    return (
        <DashboardLayout>
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-4">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <MapPin className="h-8 w-8" />
                                Investment Heatmaps
                            </h1>
                            <p className="text-indigo-200 mt-2">
                                Visualize investment opportunities across {suburbs.length.toLocaleString()} Australian suburbs
                            </p>
                        </div>
                        <button
                            onClick={fetchSuburbs}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh Data
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* State Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
                    {['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'].map(state => {
                        const data = stateSummary[state] || { count: 0, avgPrice: 0 }
                        const isSelected = stateFilter === state
                        return (
                            <button
                                key={state}
                                onClick={() => setStateFilter(isSelected ? 'ALL' : state as StateFilter)}
                                className={`p-3 rounded-lg text-center transition-all ${
                                    isSelected 
                                        ? 'bg-indigo-600 text-white shadow-lg scale-105' 
                                        : 'bg-white hover:bg-indigo-50 shadow'
                                }`}
                            >
                                <div className="font-bold text-lg">{state}</div>
                                <div className={`text-xs ${isSelected ? 'text-indigo-200' : 'text-gray-500'}`}>
                                    {data.count} suburbs
                                </div>
                                {data.avgPrice > 0 && (
                                    <div className={`text-xs mt-1 ${isSelected ? 'text-indigo-200' : 'text-gray-400'}`}>
                                        Avg ${(data.avgPrice / 1000000).toFixed(1)}M
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Metric Selector */}
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-400" />
                            <select
                                value={selectedMetric}
                                onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {Object.entries(METRIC_CONFIG).map(([key, { label }]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search suburbs or postcodes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Sort:</span>
                            <button
                                onClick={() => {
                                    if (sortBy === 'value') {
                                        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
                                    } else {
                                        setSortBy('value')
                                        setSortOrder('desc')
                                    }
                                }}
                                className={`px-3 py-1 rounded text-sm ${sortBy === 'value' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Value {sortBy === 'value' && (sortOrder === 'desc' ? '↓' : '↑')}
                            </button>
                            <button
                                onClick={() => {
                                    if (sortBy === 'name') {
                                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                                    } else {
                                        setSortBy('name')
                                        setSortOrder('asc')
                                    }
                                }}
                                className={`px-3 py-1 rounded text-sm ${sortBy === 'name' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </button>
                        </div>

                        {/* Results count */}
                        <div className="text-sm text-gray-500">
                            Showing {filteredSuburbs.length} suburbs
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Color Scale ({METRIC_CONFIG[selectedMetric].label}):</span>
                            <div className="flex items-center gap-1">
                                <div className="w-6 h-6 rounded bg-blue-200"></div>
                                <div className="w-6 h-6 rounded bg-green-200"></div>
                                <div className="w-6 h-6 rounded bg-yellow-200"></div>
                                <div className="w-6 h-6 rounded bg-orange-300"></div>
                                <div className="w-6 h-6 rounded bg-red-400"></div>
                            </div>
                            <span className="text-xs text-gray-500">Low → High</span>
                        </div>
                        {selectedMetric === 'growth12m' && (
                            <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                    <ArrowDownRight className="h-4 w-4 text-red-500" /> Declining
                                </span>
                                <span className="flex items-center gap-1">
                                    <Minus className="h-4 w-4 text-yellow-500" /> Stable
                                </span>
                                <span className="flex items-center gap-1">
                                    <ArrowUpRight className="h-4 w-4 text-green-500" /> Growing
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Heatmap Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        <span className="ml-3 text-gray-600">Loading heatmap data...</span>
                    </div>
                ) : filteredSuburbs.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-700">No suburbs found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your filters or search query</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                        {filteredSuburbs.slice(0, 200).map((suburb) => {
                            const value = suburb[selectedMetric]
                            const config = METRIC_CONFIG[selectedMetric]
                            const colorClass = value !== null 
                                ? getHeatColor(value, minValue, maxValue, config.colorScale)
                                : 'bg-gray-100'
                            
                            return (
                                <Link
                                    key={suburb.id}
                                    href={`/suburb/${encodeURIComponent(suburb.name.toLowerCase().replace(/\s+/g, '-'))}-${suburb.state.toLowerCase()}-${suburb.postcode}`}
                                    className={`${colorClass} rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all cursor-pointer group`}
                                >
                                    <div className="font-medium text-sm truncate group-hover:text-clip">
                                        {suburb.name}
                                    </div>
                                    <div className="text-xs opacity-75">
                                        {suburb.state} {suburb.postcode}
                                    </div>
                                    <div className="mt-2 font-bold text-sm">
                                        {value !== null ? config.format(value) : 'N/A'}
                                    </div>
                                    {suburb.growth12m !== null && selectedMetric !== 'growth12m' && (
                                        <div className={`text-xs mt-1 flex items-center gap-1 ${
                                            suburb.growth12m > 0 ? 'text-green-700' : suburb.growth12m < 0 ? 'text-red-700' : 'text-gray-600'
                                        }`}>
                                            {suburb.growth12m > 0 ? <ArrowUpRight className="h-3 w-3" /> : 
                                             suburb.growth12m < 0 ? <ArrowDownRight className="h-3 w-3" /> : 
                                             <Minus className="h-3 w-3" />}
                                            {Math.abs(suburb.growth12m).toFixed(1)}%
                                        </div>
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                )}

                {filteredSuburbs.length > 200 && (
                    <div className="text-center mt-6 text-gray-500">
                        Showing first 200 results. Use filters to narrow down your search.
                    </div>
                )}

                {/* Top Performers Table */}
                {!loading && filteredSuburbs.length > 0 && (
                    <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="font-semibold text-lg text-gray-900">
                                Top 10 by {METRIC_CONFIG[selectedMetric].label}
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Suburb</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{METRIC_CONFIG[selectedMetric].label}</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Median Price</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Yield</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">12M Growth</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredSuburbs.slice(0, 10).map((suburb, idx) => (
                                        <tr key={suburb.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">#{idx + 1}</td>
                                            <td className="px-6 py-4">
                                                <Link 
                                                    href={`/suburb/${encodeURIComponent(suburb.name.toLowerCase().replace(/\s+/g, '-'))}-${suburb.state.toLowerCase()}-${suburb.postcode}`}
                                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                                >
                                                    {suburb.name}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{suburb.state}</td>
                                            <td className="px-6 py-4 text-sm text-right font-semibold">
                                                {suburb[selectedMetric] !== null 
                                                    ? METRIC_CONFIG[selectedMetric].format(suburb[selectedMetric]!) 
                                                    : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right text-gray-600">
                                                {suburb.medianPrice ? `$${(suburb.medianPrice / 1000).toFixed(0)}K` : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right text-gray-600">
                                                {suburb.rentalYield ? `${suburb.rentalYield.toFixed(2)}%` : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right">
                                                {suburb.growth12m !== null ? (
                                                    <span className={suburb.growth12m > 0 ? 'text-green-600' : suburb.growth12m < 0 ? 'text-red-600' : 'text-gray-600'}>
                                                        {suburb.growth12m > 0 ? '+' : ''}{suburb.growth12m.toFixed(1)}%
                                                    </span>
                                                ) : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </DashboardLayout>
    )
}
