import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, TrendingUp, DollarSign, GraduationCap, ShieldCheck, MapPin, Users, Home, Building } from 'lucide-react'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Best Suburbs Guide Australia 2025 | Investment Rankings by Category',
  description: 'Comprehensive suburb rankings by investment potential, rental yield, affordability, schools, and safety across all Australian states.',
  keywords: ['best suburbs australia', 'suburb rankings', 'property investment guide', 'where to invest in property', 'australian suburb comparison'],
}

const categories = [
  {
    title: 'Top Investment Suburbs',
    description: 'Highest investment scores based on growth, yield, and fundamentals',
    href: '/best-suburbs',
    icon: TrendingUp,
    color: 'blue',
    count: '14,500+ suburbs ranked',
  },
  {
    title: 'Under $500k',
    description: 'Affordable entry-level properties with strong growth potential',
    href: '/best-suburbs/under-500k',
    icon: DollarSign,
    color: 'green',
    count: 'Budget-friendly options',
  },
  {
    title: 'High Rental Yield',
    description: 'Suburbs delivering 5%+ annual rental returns',
    href: '/best-suburbs/high-yield',
    icon: Building,
    color: 'purple',
    count: 'Cash flow focused',
  },
  {
    title: 'Best Schools',
    description: 'Top-rated school catchments for family investors',
    href: '/best-suburbs/schools',
    icon: GraduationCap,
    color: 'emerald',
    count: 'Family-friendly areas',
  },
  {
    title: 'First Home Buyers',
    description: 'Entry points for new property owners',
    href: '/best-suburbs/first-home-buyers',
    icon: Users,
    color: 'pink',
    count: 'Starter home suburbs',
  },
  {
    title: 'Safest Suburbs',
    description: 'Low crime areas with strong community values',
    href: '/best-suburbs/safest',
    icon: ShieldCheck,
    color: 'slate',
    count: 'Security focused',
  },
]

const cities = [
  { name: 'Sydney', state: 'NSW', href: '/best-suburbs/sydney', color: 'sky' },
  { name: 'Melbourne', state: 'VIC', href: '/best-suburbs/melbourne', color: 'indigo' },
  { name: 'Brisbane', state: 'QLD', href: '/best-suburbs/brisbane', color: 'orange' },
  { name: 'Perth', state: 'WA', href: '/best-suburbs/perth', color: 'teal' },
  { name: 'Adelaide', state: 'SA', href: '/best-suburbs/adelaide', color: 'rose' },
  { name: 'Canberra', state: 'ACT', href: '/best-suburbs/canberra', color: 'amber' },
  { name: 'Hobart', state: 'TAS', href: '/best-suburbs/hobart', color: 'cyan' },
  { name: 'Darwin', state: 'NT', href: '/best-suburbs/darwin', color: 'red' },
]

const colorVariants: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700 hover:bg-blue-600',
  green: 'bg-green-100 text-green-700 hover:bg-green-600',
  purple: 'bg-purple-100 text-purple-700 hover:bg-purple-600',
  emerald: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-600',
  pink: 'bg-pink-100 text-pink-700 hover:bg-pink-600',
  slate: 'bg-slate-100 text-slate-700 hover:bg-slate-600',
  sky: 'bg-sky-500',
  indigo: 'bg-indigo-500',
  orange: 'bg-orange-500',
  teal: 'bg-teal-500',
  rose: 'bg-rose-500',
  amber: 'bg-amber-500',
  cyan: 'bg-cyan-500',
  red: 'bg-red-500',
}

export default function BestSuburbsIndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-blue-200 text-sm font-medium mb-6">
            📊 Comprehensive Investment Guide
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Best Suburbs to Invest in <span className="text-yellow-400">Australia</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
            Data-driven suburb rankings across 14,500+ locations. Find the perfect investment by category or city.
          </p>
          <Link href="/search" className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105">
            Search All Suburbs <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${colorVariants[category.color]} group-hover:text-white transition-colors`}>
                  <category.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-3">{category.description}</p>
                <span className="text-sm font-medium text-blue-600">{category.count} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse by City</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cities.map((city) => (
              <Link
                key={city.name}
                href={city.href}
                className="group bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 text-center"
              >
                <div className={`w-12 h-12 mx-auto rounded-full ${colorVariants[city.color]} flex items-center justify-center mb-3`}>
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{city.name}</h3>
                <span className="text-sm text-gray-500">{city.state}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Investment?</h2>
          <p className="text-xl text-blue-100 mb-8">Search any suburb in Australia and get instant AI-powered insights.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/search" className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all">
              Start Free Search
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center gap-2 bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-400 transition-all border border-blue-400">
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
