import Link from 'next/link'
import { CheckCircle, Clock, Zap, Target, Rocket } from 'lucide-react'

export const metadata = {
  title: 'Product Roadmap | Suburb Intel AU',
  description: 'Our development roadmap and upcoming features for Australian property investment analysis',
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900">
            🗺️ Product Roadmap
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Building Australia's most intelligent property analysis platform
          </p>
          <p className="text-sm text-gray-500">
            Last updated: December 2025
          </p>
        </div>

        {/* Current Status */}
        <div className="mb-10 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white shadow-xl">
          <div className="flex items-start gap-4">
            <span className="text-4xl">✅</span>
            <div>
              <h2 className="mb-3 text-2xl font-bold">Currently Live: Production v1.5</h2>
              <p className="text-green-100 mb-4 text-lg">
                4,800+ real suburbs (NSW & VIC) with government data, AI analysis, and Stripe payments
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">4,800+</div>
                  <div className="text-sm text-green-100">Suburbs</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">$4.99</div>
                  <div className="text-sm text-green-100">Pro/mo ☕</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">14.5K+</div>
                  <div className="text-sm text-green-100">Suburbs</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">GPT-4</div>
                  <div className="text-sm text-green-100">AI Reports</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap Timeline */}
        <div className="space-y-6">
          
          {/* COMPLETED */}
          <div className="overflow-hidden rounded-xl bg-white shadow-lg border-2 border-green-200">
            <div className="border-l-4 border-green-600 bg-green-50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Phase 1: Foundation ✅</h3>
                </div>
                <span className="rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white">
                  LIVE
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">NSW & VIC Government Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">AI-Generated Expert Reports (GPT-4)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Suburb Search & Compare</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Portfolio Tracker</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Interactive Heatmaps</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Usage Limits & Gates</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Stripe Payments (Pro)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Clerk Authentication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Cloud Run Deployment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Custom Domain Setup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PHASE 2 - IN PROGRESS */}
          <div className="overflow-hidden rounded-xl bg-white shadow-lg border-2 border-blue-200">
            <div className="border-l-4 border-blue-600 bg-blue-50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="h-8 w-8 text-blue-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Phase 2: Enhanced Features</h3>
                </div>
                <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white">
                  IN PROGRESS
                </span>
              </div>
              <p className="text-gray-600 mb-4">December 2025 - January 2026</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Real Estate API Integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Suburb Report Downloads</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">CSV Data Export</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Email Notifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Advanced Search Filters</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PHASE 3 - PLANNED */}
          <div className="overflow-hidden rounded-xl bg-white shadow-lg border-2 border-purple-200">
            <div className="border-l-4 border-purple-600 bg-purple-50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Phase 3: Advanced Analytics</h3>
                </div>
                <span className="rounded-full bg-purple-600 px-4 py-2 text-sm font-bold text-white">
                  PLANNED
                </span>
              </div>
              <p className="text-gray-600 mb-4">Q1 2026</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full border-2 border-purple-400" />
                    <span className="text-gray-700">Price Forecasting (ML)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full border-2 border-purple-400" />
                    <span className="text-gray-700">Advanced Demographics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full border-2 border-purple-400" />
                    <span className="text-gray-700">Price Alerts</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full border-2 border-purple-400" />
                    <span className="text-gray-700">QLD & Other States</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full border-2 border-purple-400" />
                    <span className="text-gray-700">Custom Dashboards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full border-2 border-purple-400" />
                    <span className="text-gray-700">Historical Trend Analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PHASE 4 - FUTURE */}
          <div className="overflow-hidden rounded-xl bg-white shadow-lg border-2 border-gray-200">
            <div className="border-l-4 border-gray-400 bg-gray-50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Rocket className="h-8 w-8 text-gray-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Phase 4: Enterprise</h3>
                </div>
                <span className="rounded-full bg-gray-400 px-4 py-2 text-sm font-bold text-white">
                  FUTURE
                </span>
              </div>
              <p className="text-gray-600 mb-4">Q2-Q3 2026</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                    <span className="text-gray-700">API Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                    <span className="text-gray-700">White-Label Reports</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                    <span className="text-gray-700">Team Accounts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                    <span className="text-gray-700">AI Copilot Chat</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Want to influence our roadmap?</h3>
          <p className="text-blue-100 mb-4">
            Your feedback helps us prioritize features that matter most.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a 
              href="mailto:feedback@suburbintel.com.au" 
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Send Feedback
            </a>
            <Link 
              href="/pricing"
              className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              View Pricing
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="inline-block text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
