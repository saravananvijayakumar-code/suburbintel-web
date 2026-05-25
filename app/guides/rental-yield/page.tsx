import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, Calculator, DollarSign, TrendingUp, Building, PiggyBank, AlertTriangle } from 'lucide-react'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Rental Yield Calculator & Guide Australia 2025 | Investment Property',
  description: 'Calculate rental yields and find high-yield investment suburbs. Complete guide to rental property investing in Australia with suburb recommendations.',
  keywords: ['rental yield calculator', 'investment property yield', 'rental return calculator', 'high yield suburbs australia', 'property investment returns'],
}

export default function RentalYieldGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-900 via-violet-800 to-indigo-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 bg-purple-500/20 rounded-full text-purple-200 text-sm font-medium mb-6">
              💰 Investment Guide
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Rental Yield Guide <span className="text-yellow-400">Australia 2025</span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8">
              How to calculate yields, find high-return suburbs, and maximize your rental income.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/best-suburbs/high-yield" className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all">
                High Yield Suburbs <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How to Calculate Rental Yield</h2>
          
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Gross Rental Yield Formula</h3>
            <div className="bg-purple-50 rounded-lg p-6 text-center mb-6">
              <p className="text-2xl md:text-3xl font-mono text-purple-800">
                Yield = (Annual Rent ÷ Property Value) × 100
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">Example: Sydney Unit</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>Property Value: $800,000</li>
                  <li>Weekly Rent: $650</li>
                  <li>Annual Rent: $650 × 52 = $33,800</li>
                  <li className="font-bold text-purple-600">Yield: 4.2%</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">Example: Regional House</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>Property Value: $400,000</li>
                  <li>Weekly Rent: $450</li>
                  <li>Annual Rent: $450 × 52 = $23,400</li>
                  <li className="font-bold text-purple-600">Yield: 5.9%</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Yield Benchmarks */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Yield Benchmarks 2025</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <span className="text-gray-700">Below 3%</span>
                <span className="font-bold text-red-600">Low Yield</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <span className="text-gray-700">3% - 4%</span>
                <span className="font-bold text-yellow-600">Average (Capital City)</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <span className="text-gray-700">4% - 5%</span>
                <span className="font-bold text-green-600">Good Yield</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <span className="text-gray-700">5%+</span>
                <span className="font-bold text-purple-600">High Yield</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Yield vs Growth */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Yield vs Capital Growth</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <PiggyBank className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">High Yield Strategy</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Strong cash flow from day one</li>
                <li>✓ Often regional or outer suburbs</li>
                <li>✓ Good for income-focused investors</li>
                <li>✗ May have slower capital growth</li>
                <li>✗ Higher management overhead</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Capital Growth Strategy</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Long-term wealth building</li>
                <li>✓ Premium locations</li>
                <li>✓ Higher quality tenants</li>
                <li>✗ May be negatively geared</li>
                <li>✗ Requires holding power</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-blue-800 text-center">
              <strong>Pro Tip:</strong> The best investors balance both. Use Suburb Intel to find suburbs with 4%+ yield AND positive growth forecasts.
            </p>
          </div>
        </div>
      </section>

      {/* Warning */}
      <section className="py-8 bg-yellow-50 border-y border-yellow-200">
        <div className="max-w-4xl mx-auto px-4 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-yellow-800">Net Yield vs Gross Yield</h3>
            <p className="text-yellow-700 text-sm">
              The formulas above calculate <strong>gross yield</strong>. Net yield subtracts expenses like rates, insurance, 
              management fees (typically 7-10%), maintenance, and vacancy periods. Net yield is usually 1-2% lower than gross.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Find High-Yield Suburbs</h2>
          <p className="text-xl text-purple-100 mb-8">Browse suburbs returning 5%+ rental yields with strong tenant demand.</p>
          <Link href="/best-suburbs/high-yield" className="inline-flex items-center justify-center gap-2 bg-white text-purple-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all">
            View High Yield Suburbs <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
