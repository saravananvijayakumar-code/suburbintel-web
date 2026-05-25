import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, TrendingUp, DollarSign, Home, Users, Train, GraduationCap, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sample Suburb Intelligence Report | Suburb Intel',
  description: 'See what a Suburb Intel report looks like with real data for Melbourne, VIC. View median prices, growth trends, demographics, and investment scoring.',
  alternates: {
    canonical: '/sample-report',
  },
}

export default function SampleReportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Sample Report</span>
        </nav>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-teal-100 rounded-lg">
              <FileText className="w-8 h-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Sample Suburb Report</h1>
              <p className="text-gray-600 mt-2">Example analysis for Melbourne, VIC 3000</p>
            </div>
          </div>

          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mt-6">
            <p className="text-sm text-teal-900">
              <strong>Preview Mode:</strong> This is a static sample report showing the type of analysis available for all 14,548 suburbs. <Link href="/search" className="underline hover:text-teal-700">Search any suburb</Link> to see live data.
            </p>
          </div>
        </div>

        {/* Mock Suburb Header */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Melbourne, VIC 3000</h2>
              <p className="text-white/90">CBD / Inner City</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">82</div>
              <p className="text-sm text-white/90">Investment Score</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-3">
              <Home className="w-6 h-6 text-teal-600" />
              <h3 className="font-bold text-gray-900">Median House Price</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">$1,250,000</p>
            <p className="text-sm text-green-600 mt-2">+8.5% (12m)</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-gray-900">Rental Yield</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">2.3%</p>
            <p className="text-sm text-gray-600 mt-2">$550/week rent</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h3 className="font-bold text-gray-900">12m Growth</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">+8.5%</p>
            <p className="text-sm text-gray-600 mt-2">Above VIC avg (6.2%)</p>
          </div>
        </div>

        {/* Demographics */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-7 h-7 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Demographics</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 mb-2">Population</p>
              <p className="text-2xl font-bold text-gray-900">15,234</p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Median Age</p>
              <p className="text-2xl font-bold text-gray-900">34 years</p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Median Household Income</p>
              <p className="text-2xl font-bold text-gray-900">$89,500/year</p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Families</p>
              <p className="text-2xl font-bold text-gray-900">68%</p>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">Source: ABS Census 2021</p>
        </div>

        {/* Infrastructure */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Train className="w-7 h-7 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Infrastructure</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Train className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Nearest Train Station</span>
              </div>
              <span className="font-semibold text-gray-900">0.8 km</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">School Quality Score</span>
              </div>
              <span className="font-semibold text-gray-900">82/100</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">Nearest Hospital</span>
              </div>
              <span className="font-semibold text-gray-900">2.4 km</span>
            </div>
          </div>
        </div>

        {/* Investment Analysis */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-8 mb-8 border-l-4 border-yellow-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Investment Analysis</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">✅ Strengths</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Strong 12-month price growth (8.5%)</li>
                <li>• High investment score (82/100)</li>
                <li>• Excellent infrastructure and transport links</li>
                <li>• High-income demographics</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">⚠️ Considerations</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Lower rental yield (2.3%) - growth-focused market</li>
                <li>• High entry price ($1.25M) may limit buyer pool</li>
                <li>• CBD location = potential oversupply risk</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">🎯 Best For</h3>
              <p className="text-sm text-gray-700">
                Growth-focused investors with larger budgets. Suitable for capital appreciation strategy rather than cash flow. Consider 10+ year hold period.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">See Reports for 14,548 Suburbs</h2>
          <p className="mb-6 opacity-90">
            Get instant access to detailed analysis, price histories, and AI-powered insights for every Australian suburb.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/search" 
              className="inline-block bg-white text-teal-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Search Suburbs →
            </Link>
            <Link 
              href="/pricing" 
              className="inline-block bg-white/10 border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/20 transition"
            >
              View Pricing
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Resources</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/methodology" className="text-teal-600 hover:underline">→ How We Score Suburbs</Link>
            <Link href="/data-sources" className="text-teal-600 hover:underline">→ Our Data Sources</Link>
            <Link href="/guides/how-to-analyze-a-suburb" className="text-teal-600 hover:underline">→ How to Analyze a Suburb</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
