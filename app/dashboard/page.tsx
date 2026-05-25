'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import DashboardLayout from '../components/DashboardLayout'
import {
  Search,
  TrendingUp,
  MapPin,
  BarChart3,
  AlertTriangle,
  Briefcase,
  FileText,
  Calculator,
  Lightbulb,
  ArrowRight,
  Home,
  DollarSign,
  Activity,
  Target,
  Sparkles
} from 'lucide-react'

interface QuickStat {
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: any
}

interface RecentActivity {
  id: string
  type: string
  suburb?: string
  date: string
  description: string
}

export default function DashboardPage() {
  const [marketStats, setMarketStats] = useState<any>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch market stats
        const statsResponse = await fetch('/api/suburbs/stats')
        if (statsResponse.ok) {
          const data = await statsResponse.json()
          if (data.success) {
            setMarketStats(data.overall)
          }
        }

        // Load recent searches from localStorage
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('recentSearches')
          if (saved) {
            setRecentSearches(JSON.parse(saved).slice(0, 5))
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const quickStats: QuickStat[] = [
    {
      label: 'Total Suburbs',
      value: marketStats?.totalSuburbs?.toLocaleString() || '3,852',
      icon: MapPin
    },
    {
      label: 'Avg Median Price',
      value: marketStats?.avgMedianPrice 
        ? `$${(marketStats.avgMedianPrice / 1000000).toFixed(2)}M` 
        : '$850K',
      icon: DollarSign
    },
    {
      label: 'Avg Growth (12m)',
      value: marketStats?.avgGrowth12m 
        ? `${marketStats.avgGrowth12m > 0 ? '+' : ''}${marketStats.avgGrowth12m.toFixed(1)}%`
        : '+4.2%',
      trend: (marketStats?.avgGrowth12m || 4.2) > 0 ? 'up' : 'down',
      icon: TrendingUp
    },
    {
      label: 'Best Yield',
      value: marketStats?.bestYield 
        ? `${marketStats.bestYield.toFixed(1)}%`
        : '7.8%',
      icon: Target
    }
  ]

  const quickActions = [
    {
      name: 'Search Suburbs',
      description: 'Find suburbs by criteria',
      href: '/search',
      icon: Search,
      color: 'bg-blue-500'
    },
    {
      name: 'AI Insights',
      description: 'GPT-4 powered analysis',
      href: '/insights',
      icon: Lightbulb,
      color: 'bg-purple-500',
      badge: 'AI'
    },
    {
      name: 'Compare Suburbs',
      description: 'Side-by-side comparison',
      href: '/compare',
      icon: BarChart3,
      color: 'bg-green-500'
    },
    {
      name: 'Market Trends',
      description: 'Analytics & forecasts',
      href: '/market-trends',
      icon: TrendingUp,
      color: 'bg-orange-500'
    },
    {
      name: 'Investment Heatmap',
      description: 'Visual opportunity map',
      href: '/heatmap',
      icon: MapPin,
      color: 'bg-red-500'
    },
    {
      name: 'Portfolio Tracker',
      description: 'Track your investments',
      href: '/portfolio',
      icon: Briefcase,
      color: 'bg-teal-500'
    },
    {
      name: 'Mortgage Calculator',
      description: 'Calculate repayments',
      href: '/mortgage-calculator',
      icon: Calculator,
      color: 'bg-indigo-500'
    },
    {
      name: 'Risk Analysis',
      description: 'Suburb risk assessment',
      href: '/risk-analysis',
      icon: AlertTriangle,
      color: 'bg-yellow-500'
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-teal-100 max-w-xl">
                Your property intelligence dashboard is ready. Explore market trends, 
                compare suburbs, and discover investment opportunities across Australia.
              </p>
            </div>
            <div className="hidden md:block">
              <Sparkles className="w-16 h-16 text-teal-300 opacity-50" />
            </div>
          </div>
          
          {/* Quick Search */}
          <div className="mt-6">
            <Link 
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition shadow-lg"
            >
              <Search className="w-5 h-5" />
              Search Suburbs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div 
                key={index}
                className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-teal-50 rounded-lg">
                    <Icon className="w-5 h-5 text-teal-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
                {stat.trend && (
                  <span className={`text-xs font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? '↑' : '↓'} vs last year
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link
                  key={index}
                  href={action.href}
                  className="group bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg hover:border-teal-200 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 ${action.color} rounded-xl`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {action.badge && (
                      <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-600 rounded">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition">
                    {action.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Searches & Tips */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Searches */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Recent Searches</h3>
              <Link href="/search" className="text-sm text-teal-600 hover:text-teal-700">
                View all
              </Link>
            </div>
            {recentSearches.length > 0 ? (
              <div className="space-y-3">
                {recentSearches.map((search, index) => (
                  <Link
                    key={index}
                    href={`/suburb/${encodeURIComponent(search)}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{search}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent searches</p>
                <Link 
                  href="/search"
                  className="text-sm text-teal-600 hover:text-teal-700 mt-2 inline-block"
                >
                  Start searching →
                </Link>
              </div>
            )}
          </div>

          {/* Pro Tips */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Pro Tips</h3>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Use AI Analysis</p>
                  <p className="text-sm text-gray-600">
                    Click "Generate AI Analysis" on any suburb page for detailed insights
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Compare Side by Side</p>
                  <p className="text-sm text-gray-600">
                    Use the Compare tool to evaluate up to 4 suburbs simultaneously
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Generate Suburb Reports</p>
                  <p className="text-sm text-gray-600">
                    Create professional investment reports to download and share
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">Explore More Features</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link 
              href="/reports"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <FileText className="w-8 h-8 text-teal-600" />
              <div>
                <p className="font-medium text-gray-900">Suburb Reports</p>
                <p className="text-sm text-gray-500">Generate expert analysis</p>
              </div>
            </Link>
            <Link 
              href="/risk-analysis"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <Activity className="w-8 h-8 text-orange-600" />
              <div>
                <p className="font-medium text-gray-900">Risk Analysis</p>
                <p className="text-sm text-gray-500">Environmental risk assessment</p>
              </div>
            </Link>
            <Link 
              href="/brain"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <Sparkles className="w-8 h-8 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Smart Property Brain</p>
                <p className="text-sm text-gray-500">AI chat for insights</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
