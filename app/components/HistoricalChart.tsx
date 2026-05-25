'use client'

import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart as LineChartIcon,
  Activity,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Calendar,
  DollarSign,
  Percent,
  Target,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'

interface PriceHistoryItem {
  id: string
  suburbId: string
  medianPrice: number
  weeklyRent?: number
  quarter: string
  month: string
  createdAt: string
}

interface HistoricalChartProps {
  priceHistory: PriceHistoryItem[]
  hasProAccess: boolean
  suburbName: string
}

type ChartType = 'line' | 'area' | 'bar' | 'composed'
type TimeRange = '1y' | '2y' | '5y' | '10y' | 'all'

export default function HistoricalChart({ priceHistory, hasProAccess, suburbName }: HistoricalChartProps) {
  const [chartType, setChartType] = useState<ChartType>('composed')
  const [timeRange, setTimeRange] = useState<TimeRange>('5y')
  const [showMovingAverage, setShowMovingAverage] = useState(true)
  const [showRentYield, setShowRentYield] = useState(false)
  const [zoomed, setZoomed] = useState(false)

  // Process and filter data
  const processedData = useMemo(() => {
    if (!priceHistory || priceHistory.length === 0) return []

    // Sort by date
    const sorted = [...priceHistory].sort((a, b) =>
      new Date(a.month).getTime() - new Date(b.month).getTime()
    )

    // Filter by time range
    const now = new Date()
    let cutoffDate = new Date()

    switch (timeRange) {
      case '1y':
        cutoffDate.setFullYear(now.getFullYear() - 1)
        break
      case '2y':
        cutoffDate.setFullYear(now.getFullYear() - 2)
        break
      case '5y':
        cutoffDate.setFullYear(now.getFullYear() - 5)
        break
      case '10y':
        cutoffDate.setFullYear(now.getFullYear() - 10)
        break
      case 'all':
        cutoffDate = new Date(0)
        break
    }

    const filtered = sorted.filter(item => new Date(item.month) >= cutoffDate)

    // Calculate additional metrics
    return filtered.map((item, index, arr) => {
      const date = new Date(item.month)
      const price = item.medianPrice

      // Calculate YoY growth
      const yearAgoIndex = arr.findIndex(prev =>
        new Date(prev.month).getFullYear() === date.getFullYear() - 1 &&
        new Date(prev.month).getMonth() === date.getMonth()
      )
      const yoyGrowth = yearAgoIndex >= 0 ?
        ((price - arr[yearAgoIndex].medianPrice) / arr[yearAgoIndex].medianPrice) * 100 : null

      // Calculate moving average (6-month)
      const maWindow = 6
      const maStart = Math.max(0, index - maWindow + 1)
      const maPrices = arr.slice(maStart, index + 1).map(d => d.medianPrice)
      const movingAverage = maPrices.reduce((sum, p) => sum + p, 0) / maPrices.length

      // Calculate rental yield
      const weeklyRent = item.weeklyRent
      const annualRent = weeklyRent ? weeklyRent * 52 : null
      const rentalYield = annualRent && price > 0 ? (annualRent / price) * 100 : null

      return {
        ...item,
        date: date.toISOString().split('T')[0],
        displayDate: date.toLocaleDateString('en-AU', { year: 'numeric', month: 'short' }),
        year: date.getFullYear(),
        month: date.getMonth(),
        price,
        yoyGrowth,
        movingAverage,
        rentalYield,
        quarter: item.quarter
      }
    })
  }, [priceHistory, timeRange])

  // Calculate key metrics
  const metrics = useMemo(() => {
    if (processedData.length === 0) return null

    const prices = processedData.map(d => d.price)
    const currentPrice = prices[prices.length - 1]
    const startPrice = prices[0]
    const totalGrowth = startPrice > 0 ? ((currentPrice - startPrice) / startPrice) * 100 : 0

    // CAGR calculation
    const years = processedData.length / 12
    const cagr = years > 0 ? (Math.pow(currentPrice / startPrice, 1 / years) - 1) * 100 : 0

    // Volatility (standard deviation of monthly returns)
    const monthlyReturns = []
    for (let i = 1; i < prices.length; i++) {
      monthlyReturns.push((prices[i] - prices[i-1]) / prices[i-1])
    }
    const avgReturn = monthlyReturns.reduce((sum, r) => sum + r, 0) / monthlyReturns.length
    const variance = monthlyReturns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / monthlyReturns.length
    const volatility = Math.sqrt(variance) * Math.sqrt(12) * 100 // Annualized

    // Peak and trough analysis
    const maxPrice = Math.max(...prices)
    const minPrice = Math.min(...prices)
    const maxDrawdown = ((maxPrice - minPrice) / maxPrice) * 100

    return {
      currentPrice,
      totalGrowth,
      cagr,
      volatility,
      maxPrice,
      minPrice,
      maxDrawdown,
      dataPoints: processedData.length
    }
  }, [processedData])

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null

    const data = payload[0].payload
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900">{data.displayDate}</p>
        <div className="space-y-1 mt-2">
          <p className="text-sm">
            <span className="text-blue-600">Price: </span>
            <span className="font-medium">${(data.price / 1000).toFixed(0)}k</span>
          </p>
          {data.yoyGrowth !== null && (
            <p className="text-sm">
              <span className="text-green-600">YoY Growth: </span>
              <span className={`font-medium ${data.yoyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.yoyGrowth >= 0 ? '+' : ''}{data.yoyGrowth.toFixed(1)}%
              </span>
            </p>
          )}
          {showMovingAverage && (
            <p className="text-sm">
              <span className="text-purple-600">6M Average: </span>
              <span className="font-medium">${(data.movingAverage / 1000).toFixed(0)}k</span>
            </p>
          )}
          {showRentYield && data.rentalYield && (
            <p className="text-sm">
              <span className="text-orange-600">Rental Yield: </span>
              <span className="font-medium">{data.rentalYield.toFixed(2)}%</span>
            </p>
          )}
        </div>
      </div>
    )
  }

  // Export data function
  const exportData = () => {
    const csvContent = [
      ['Date', 'Median Price', 'YoY Growth', '6M Moving Average', 'Rental Yield'].join(','),
      ...processedData.map(d => [
        d.date,
        d.price,
        d.yoyGrowth?.toFixed(2) || '',
        d.movingAverage?.toFixed(2) || '',
        d.rentalYield?.toFixed(2) || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${suburbName}-price-history.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (!hasProAccess) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-xl p-8 border border-indigo-200">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-6 w-6 text-indigo-600" />
          <h3 className="text-xl font-bold text-gray-900">Advanced Price Analytics</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Unlock interactive charts, trend analysis, market comparisons, and export capabilities.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/60 p-4 rounded-lg">
            <Activity className="h-5 w-5 text-indigo-600 mb-2" />
            <p className="text-sm font-medium">Interactive Charts</p>
            <p className="text-xs text-gray-600">Line, area, bar, and composed views</p>
          </div>
          <div className="bg-white/60 p-4 rounded-lg">
            <TrendingUp className="h-5 w-5 text-indigo-600 mb-2" />
            <p className="text-sm font-medium">Advanced Analytics</p>
            <p className="text-xs text-gray-600">CAGR, volatility, drawdown analysis</p>
          </div>
          <div className="bg-white/60 p-4 rounded-lg">
            <Download className="h-5 w-5 text-indigo-600 mb-2" />
            <p className="text-sm font-medium">Export Data</p>
            <p className="text-xs text-gray-600">CSV export for further analysis</p>
          </div>
        </div>
        <a
          href="/pricing"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Upgrade to Pro - $14.95/month
        </a>
      </div>
    )
  }

  if (!processedData || processedData.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-6 w-6 text-gray-400" />
          <h3 className="text-xl font-bold text-gray-900">Price History Analytics</h3>
        </div>
        <p className="text-gray-500">No historical price data available for this suburb yet.</p>
      </div>
    )
  }

  const renderChart = () => {
    const commonProps = {
      data: processedData,
      margin: { top: 20, right: 30, left: 20, bottom: 60 }
    }

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="displayDate"
              angle={-45}
              textAnchor="end"
              height={80}
              interval="preserveStartEnd"
              stroke="#6b7280"
            />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
              name="Median Price"
            />
            {showMovingAverage && (
              <Line
                type="monotone"
                dataKey="movingAverage"
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="6M Moving Average"
              />
            )}
          </LineChart>
        )

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="displayDate"
              angle={-45}
              textAnchor="end"
              height={80}
              interval="preserveStartEnd"
              stroke="#6b7280"
            />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              fill="url(#colorPrice)"
              fillOpacity={0.3}
              name="Median Price"
            />
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        )

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="displayDate"
              angle={-45}
              textAnchor="end"
              height={80}
              interval="preserveStartEnd"
              stroke="#6b7280"
            />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="price"
              fill="#3b82f6"
              name="Median Price"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        )

      case 'composed':
      default:
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="displayDate"
              angle={-45}
              textAnchor="end"
              height={80}
              interval="preserveStartEnd"
              stroke="#6b7280"
            />
            <YAxis
              yAxisId="price"
              orientation="left"
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              stroke="#3b82f6"
            />
            {showRentYield && (
              <YAxis
                yAxisId="yield"
                orientation="right"
                tickFormatter={(value) => `${value.toFixed(1)}%`}
                stroke="#f59e0b"
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              yAxisId="price"
              dataKey="price"
              fill="#3b82f6"
              fillOpacity={0.6}
              name="Median Price"
              radius={[2, 2, 0, 0]}
            />
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="movingAverage"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={false}
              name="6M Moving Average"
            />
            {showRentYield && (
              <Line
                yAxisId="yield"
                type="monotone"
                dataKey="rentalYield"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                name="Rental Yield %"
              />
            )}
          </ComposedChart>
        )
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6" />
            <h3 className="text-xl font-bold">Advanced Price Analytics</h3>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
            {metrics && (
              <>
                {metrics.totalGrowth >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-300" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-300" />
                )}
                <span className={metrics.totalGrowth >= 0 ? 'text-green-200' : 'text-red-200'}>
                  {metrics.totalGrowth >= 0 ? '+' : ''}{metrics.totalGrowth.toFixed(1)}%
                </span>
              </>
            )}
          </div>
        </div>
        <p className="mt-2 text-indigo-100">{suburbName} - {processedData.length} data points</p>
      </div>

      <div className="p-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          {/* Chart Type */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Chart:</span>
            {(['line', 'area', 'bar', 'composed'] as ChartType[]).map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  chartType === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Time Range */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            {(['1y', '2y', '5y', '10y', 'all'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  timeRange === range
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range === 'all' ? 'All Time' : range.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showMovingAverage}
                onChange={(e) => setShowMovingAverage(e.target.checked)}
                className="rounded"
              />
              Moving Average
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showRentYield}
                onChange={(e) => setShowRentYield(e.target.checked)}
                className="rounded"
              />
              Rental Yield
            </label>
          </div>

          {/* Export */}
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* Chart */}
        <div className="relative h-96 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {/* Key Metrics */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-sm text-blue-700 font-medium">Current Price</div>
              <div className="text-xl font-bold text-blue-900">
                ${(metrics.currentPrice / 1000).toFixed(0)}k
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <Percent className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-sm text-green-700 font-medium">Total Growth</div>
              <div className={`text-xl font-bold ${metrics.totalGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.totalGrowth >= 0 ? '+' : ''}{metrics.totalGrowth.toFixed(1)}%
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-sm text-purple-700 font-medium">CAGR</div>
              <div className={`text-xl font-bold ${metrics.cagr >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                {metrics.cagr >= 0 ? '+' : ''}{metrics.cagr.toFixed(1)}%
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
              <Activity className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-sm text-orange-700 font-medium">Volatility</div>
              <div className="text-xl font-bold text-orange-600">
                {metrics.volatility.toFixed(1)}%
              </div>
            </div>
          </div>
        )}

        {/* Risk Analysis */}
        {metrics && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <h4 className="font-semibold text-yellow-800">Risk Analysis</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Max Drawdown:</span>
                <span className={`font-medium ${metrics.maxDrawdown > 20 ? 'text-red-600' : 'text-yellow-600'}`}>
                  {metrics.maxDrawdown.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Peak Price:</span>
                <span className="font-medium text-gray-900">
                  ${(metrics.maxPrice / 1000).toFixed(0)}k
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Data Points:</span>
                <span className="font-medium text-gray-900">
                  {metrics.dataPoints}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Data Disclaimer */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-600">
              <strong className="text-gray-900">Data Analysis:</strong> Historical data sourced from government property records and real estate databases.
              Analysis includes CAGR (Compound Annual Growth Rate), volatility measurements, and maximum drawdown calculations.
              Moving averages use 6-month windows. Past performance does not guarantee future results.
              <strong className="text-gray-900">Use this information as part of your broader research.</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
