import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, CheckCircle, XCircle, Calculator, DollarSign, Home, FileText } from 'lucide-react'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'First Home Buyer Guide Australia 2025 | Complete Step-by-Step',
  description: 'Complete guide for first home buyers in Australia. Government grants, stamp duty concessions, deposit requirements, and suburb selection tips.',
  keywords: ['first home buyer australia', 'first home owner grant', 'fhog 2025', 'first home buyer tips', 'how to buy first home australia'],
}

const states = [
  { name: 'NSW', grant: '$10,000', threshold: '$600,000', stampDuty: 'Exempt up to $800,000' },
  { name: 'VIC', grant: '$10,000', threshold: '$750,000', stampDuty: 'Exempt up to $600,000' },
  { name: 'QLD', grant: '$30,000', threshold: '$750,000', stampDuty: 'Concession up to $500,000' },
  { name: 'WA', grant: '$10,000', threshold: '$750,000', stampDuty: 'Exempt up to $430,000' },
  { name: 'SA', grant: '$15,000', threshold: '$650,000', stampDuty: 'Concession available' },
]

const steps = [
  {
    step: 1,
    title: 'Check Your Budget',
    description: 'Calculate your borrowing capacity based on income, expenses, and existing debts.',
    tips: ['Use our mortgage calculator', 'Factor in 20% deposit to avoid LMI', 'Include stamp duty and legal costs'],
  },
  {
    step: 2,
    title: 'Get Pre-Approved',
    description: 'Obtain pre-approval from a lender to know your exact budget.',
    tips: ['Compare rates from multiple lenders', 'Check for first home buyer specials', 'Pre-approval typically valid 90 days'],
  },
  {
    step: 3,
    title: 'Research Suburbs',
    description: 'Use Suburb Intel to find areas within budget with growth potential.',
    tips: ['Filter by price range', 'Check school ratings if planning family', 'Review crime statistics and amenities'],
  },
  {
    step: 4,
    title: 'Apply for Grants',
    description: 'Lodge applications for First Home Owner Grant and stamp duty concessions.',
    tips: ['Check state-specific requirements', 'Apply through your lender or separately', 'Keep all documentation handy'],
  },
  {
    step: 5,
    title: 'Make an Offer',
    description: 'Submit offers on properties that meet your criteria.',
    tips: ['Get building and pest inspections', 'Negotiate on price and conditions', 'Have a cooling-off strategy'],
  },
]

const myths = [
  { myth: 'You need a 20% deposit', reality: 'Many lenders accept 5-10% with LMI' },
  { myth: 'First home must be new', reality: 'FHOG often applies to new homes, but other grants for established too' },
  { myth: 'You must live in it forever', reality: 'Usually 6-12 month minimum, then can convert to investment' },
  { myth: 'Only singles qualify', reality: 'Couples and families can apply jointly' },
]

export default function FirstHomeBuyerGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-pink-700 via-rose-600 to-red-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-pink-200 text-sm font-medium mb-6">
              🏠 Complete Guide
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              First Home Buyer Guide <span className="text-yellow-300">Australia 2025</span>
            </h1>
            <p className="text-xl md:text-2xl text-pink-100 mb-8">
              Everything you need to know: grants, deposits, and finding the perfect suburb.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/mortgage-calculator" className="inline-flex items-center gap-2 bg-white text-pink-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-all">
                <Calculator className="w-5 h-5" /> Calculate Budget
              </Link>
              <Link href="/best-suburbs/first-home-buyers" className="inline-flex items-center gap-2 bg-pink-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-pink-400 transition-all border border-pink-400">
                Find Suburbs <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Grant Table */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">First Home Owner Grants by State</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-pink-600 to-rose-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">State</th>
                  <th className="px-6 py-4 text-center font-semibold">FHOG Amount</th>
                  <th className="px-6 py-4 text-center font-semibold">Price Cap</th>
                  <th className="px-6 py-4 text-left font-semibold">Stamp Duty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {states.map((state) => (
                  <tr key={state.name} className="hover:bg-pink-50">
                    <td className="px-6 py-4 font-bold text-gray-900">{state.name}</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">{state.grant}</td>
                    <td className="px-6 py-4 text-center text-gray-900">{state.threshold}</td>
                    <td className="px-6 py-4 text-gray-600">{state.stampDuty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 text-center mt-4">
            *Grants typically for new builds. Check state government websites for latest eligibility criteria.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">5 Steps to Your First Home</h2>
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.step} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.tips.map((tip, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Myths */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Common Myths Debunked</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {myths.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-start gap-3 mb-3">
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-400 line-through">{item.myth}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="font-medium text-gray-900">{item.reality}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-rose-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Find Your First Home Suburb</h2>
          <p className="text-xl text-pink-100 mb-8">Browse affordable suburbs with strong growth potential perfect for first home buyers.</p>
          <Link href="/best-suburbs/first-home-buyers" className="inline-flex items-center justify-center gap-2 bg-white text-pink-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all">
            View First Home Buyer Suburbs <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
