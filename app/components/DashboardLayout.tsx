'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSubscription } from '@/contexts/SubscriptionContext'
import {
  Home,
  Search,
  Lightbulb,
  BarChart3,
  MapPin,
  TrendingUp,
  FileText,
  Calculator,
  Briefcase,
  Star,
  Menu,
  X,
  ChevronRight,
  AlertTriangle,
  Brain,
  HelpCircle,
  Settings,
  Crown,
  CreditCard
} from 'lucide-react'

interface Feature {
  name: string
  href: string
  icon: any
  description: string
  badge?: string
}

const features: Feature[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview and quick actions'
  },
  {
    name: 'Search Suburbs',
    href: '/search',
    icon: Search,
    description: 'Find high-growth opportunities'
  },
  {
    name: 'Insights',
    href: '/insights',
    icon: Lightbulb,
    description: 'Market data analysis'
  },
  {
    name: 'Compare Suburbs',
    href: '/compare',
    icon: BarChart3,
    description: 'Side-by-side comparison'
  },
  {
    name: 'Market Trends',
    href: '/market-trends',
    icon: TrendingUp,
    description: 'Market analytics & forecasts'
  },
  {
    name: 'Investment Heatmap',
    href: '/heatmap',
    icon: MapPin,
    description: 'Visual opportunity map'
  },
  {
    name: 'Portfolio Tracker',
    href: '/portfolio',
    icon: Briefcase,
    description: 'Track your investments'
  },
  {
    name: 'Mortgage Calculator',
    href: '/mortgage-calculator',
    icon: Calculator,
    description: 'Calculate repayments'
  },
  {
    name: 'Support',
    href: '/support',
    icon: HelpCircle,
    description: 'Get help & submit tickets'
  }
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { hasProAccess, subscriptionTier } = useSubscription()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo & Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="bg-teal-600 p-2 rounded-lg">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Suburb Intel AU</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 overflow-y-auto h-[calc(100vh-240px)]">
          <div className="space-y-1 pb-4">
            {features.map((feature) => {
              const isActive = pathname === feature.href
              const Icon = feature.icon
              
              return (
                <Link
                  key={feature.name}
                  href={feature.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition group
                    ${isActive
                      ? 'bg-teal-50 text-teal-600'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium text-sm ${isActive ? 'text-teal-600' : ''}`}>
                        {feature.name}
                      </span>
                      {feature.badge && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-600 rounded">
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{feature.description}</p>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-teal-600" />}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Subscription removed — no upgrade CTA */}
        <div className="absolute bottom-20 left-0 right-0 px-4">
          {/* CTA placeholder kept empty intentionally */}
        </div>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
              G
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Guest User</p>
              <p className="text-xs text-gray-500">Public Access</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <div className="lg:hidden">
                <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                  G
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
