import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, DollarSign, TrendingDown, Map, CheckCircle2, ArrowRight, Calculator, Shield, Award } from 'lucide-react'
import { PRICING, getPricingMessage } from '@/lib/constants/pricing'

export const metadata: Metadata = {
  title: 'Best Suburbs for First Home Buyers | Affordable + Growth | SuburbIntel',
  description: 'Find affordable suburbs perfect for first home buyers in Australia. Filter by stamp duty concessions, suburbs under $500k, growth potential, and low deposit requirements.',
  keywords: 'first home buyers, affordable suburbs Australia, stamp duty concessions, suburbs under 500k, FHOG, first home owner grant, best suburbs for first home buyers',
  alternates: {
    canonical: '/for-first-home-buyers',
  },
  openGraph: {
    title: 'Best Suburbs for First Home Buyers | SuburbIntel',
    description: 'Smart suburb search for first home buyers: Find affordable areas with growth potential, stamp duty savings, and family-friendly amenities.',
    url: 'https://suburbintel.com/for-first-home-buyers',
  },
}

export default function ForFirstHomeBuyersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Home className="w-4 h-4" />
            First Home Buyer Focused
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Find Your First Home in a{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Suburb That Grows With You
            </span>
          </h1>
          
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Smart suburb search designed for first home buyers: Affordable entry prices, stamp duty savings, 
            family-friendly amenities, and genuine growth potential. Start building equity from day one.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search?maxPrice=500000&sortBy=affordability"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
            >
              🏡 Find Affordable Suburbs
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/mortgage-calculator"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-xl font-semibold text-lg hover:border-gray-400 transition-all"
            >
              <Calculator className="w-5 h-5" />
              Calculate Borrowing Power
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-600">
            💰 <strong className="text-green-700">{getPricingMessage('monthly').headline}</strong> — {getPricingMessage('monthly').fine_print}
          </p>
        </div>
      </section>

      {/* Why SuburbIntel for First Home Buyers */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why First Home Buyers Choose SuburbIntel
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Affordability First</h3>
              <p className="text-gray-700 mb-4">
                Filter by price ranges under $500k, $600k, $700k. See median prices, typical deposits 
                (5%-20%), and stamp duty costs for every suburb.
              </p>
              <Link href="/best-suburbs/under-500k" className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center gap-1">
                View suburbs under $500k <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <TrendingDown className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Growth Potential</h3>
              <p className="text-gray-700 mb-4">
                Just because it's affordable doesn't mean it won't grow. Our AI identifies 
                undervalued suburbs with 12-month growth forecasts of 5-12%.
              </p>
              <Link href="/methodology" className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1">
                How our forecasts work <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Family-Friendly Filters</h3>
              <p className="text-gray-700 mb-4">
                Search by school quality, crime rates, parks, public transport, and hospital proximity. 
                Build a life, not just buy a house.
              </p>
              <Link href="/best-suburbs/schools" className="text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center gap-1">
                Best school suburbs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stamp Duty & Grants Guide */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            🎁 First Home Buyer Grants & Concessions (2025)
          </h2>
          <p className="text-gray-700 text-center mb-10">
            Save thousands with government schemes designed for first home buyers:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-green-300 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">🏠 NSW First Home Buyer</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Stamp Duty Exemption:</strong> Save up to $30,000 on homes under $800k</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>First Home Owner Grant:</strong> $10,000 for new homes under $600k</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Regional:</strong> Up to $15,000 grant in designated areas</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-blue-300 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">🏙️ VIC First Home Buyer</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Duty Exemption:</strong> $0 stamp duty on homes up to $600k</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Concession:</strong> Reduced duty on homes $600k-$750k</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>FHOG:</strong> $10,000 for new builds under $750k</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-orange-300 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">🌅 QLD First Home Buyer</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Transfer Duty Concession:</strong> Up to $8,750 off (homes under $550k)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span><strong>FHOG:</strong> $15,000 for new homes under $750k</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Regional Boost:</strong> $20,000 in designated areas</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-purple-300 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">💰 Federal Schemes</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Home Guarantee Scheme:</strong> Buy with just 5% deposit (no LMI)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span><strong>First Home Super Saver:</strong> Save up to $50k tax-free in super</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Shared Equity:</strong> Govt co-invests up to 40% (income limits apply)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-sm text-yellow-900">
              <strong>Important:</strong> Grant and concession criteria change regularly. Check your state's 
              revenue office for current eligibility. SuburbIntel helps you find <em>where</em> to buy — 
              always consult professionals for <em>how</em> to structure your purchase.
            </p>
          </div>
        </div>
      </section>

      {/* Key Questions for First Home Buyers */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            🤔 Questions Every First Home Buyer Should Ask
          </h2>
          <p className="text-gray-600 text-center mb-10">
            SuburbIntel helps you answer the tough questions before you commit:
          </p>

          <div className="space-y-6">
            <div className="bg-gray-50 border-l-4 border-blue-500 p-5 rounded-r-lg">
              <h3 className="font-bold text-gray-900 mb-2">1. Can I actually afford this suburb long-term?</h3>
              <p className="text-gray-700 text-sm">
                See median prices, rental yields (if you need to rent it out later), council rates estimates, 
                and ongoing costs. Use our mortgage calculator to model repayments at different interest rates.
              </p>
            </div>

            <div className="bg-gray-50 border-l-4 border-green-500 p-5 rounded-r-lg">
              <h3 className="font-bold text-gray-900 mb-2">2. Will this suburb grow in value over 5-10 years?</h3>
              <p className="text-gray-700 text-sm">
                Our 12-month forecasts + historical trends show whether you're buying into a growth suburb or 
                a flat market. First home buyers typically hold for 7+ years — long-term trends matter.
              </p>
            </div>

            <div className="bg-gray-50 border-l-4 border-purple-500 p-5 rounded-r-lg">
              <h3 className="font-bold text-gray-900 mb-2">3. Is it safe for my family?</h3>
              <p className="text-gray-700 text-sm">
                Check crime rates, flood risk, bushfire zones, and natural hazard scores. Some affordable 
                suburbs are cheap for a reason — we show you the risks upfront.
              </p>
            </div>

            <div className="bg-gray-50 border-l-4 border-orange-500 p-5 rounded-r-lg">
              <h3 className="font-bold text-gray-900 mb-2">4. Are there good schools and transport?</h3>
              <p className="text-gray-700 text-sm">
                Filter by top-ranked schools (NAPLAN scores), public transport access, hospital proximity, 
                and childcare availability. Build a life, not just own a property.
              </p>
            </div>

            <div className="bg-gray-50 border-l-4 border-red-500 p-5 rounded-r-lg">
              <h3 className="font-bold text-gray-900 mb-2">5. What's the resale potential (exit strategy)?</h3>
              <p className="text-gray-700 text-sm">
                See days on market (liquidity), buyer demand indicators, and rental vacancy rates. 
                An affordable suburb is only a good deal if you can sell it when needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Lists */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            🎯 Start Your Search Here
          </h2>
          <p className="text-gray-600 text-center mb-10">
            Curated suburb lists based on what first home buyers actually need:
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/best-suburbs/under-500k" className="block bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Under $500k</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Affordable suburbs with genuine growth potential. Perfect for first timers with smaller deposits.
              </p>
              <span className="text-blue-600 font-semibold text-sm inline-flex items-center gap-1">
                View suburbs <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link href="/best-suburbs/schools" className="block bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-500 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Best School Zones</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Suburbs with top-ranked primary and secondary schools. Invest in your kids' education.
              </p>
              <span className="text-purple-600 font-semibold text-sm inline-flex items-center gap-1">
                View suburbs <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link href="/best-suburbs/safest" className="block bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-500 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Safest Suburbs</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Low crime, low flood risk, low bushfire risk. Peace of mind for your family.
              </p>
              <span className="text-green-600 font-semibold text-sm inline-flex items-center gap-1">
                View suburbs <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Find Your First Home?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 1,200+ first home buyers who found their dream suburb with SuburbIntel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              🏡 Start Searching Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
            >
              View Pricing — {getPricingMessage('monthly').headline}
            </Link>
          </div>
          <p className="mt-6 text-sm text-blue-100">
            ✓ Try free · ✓ No credit card · ✓ Cancel anytime
          </p>
        </div>
      </section>

    </div>
  )
}
