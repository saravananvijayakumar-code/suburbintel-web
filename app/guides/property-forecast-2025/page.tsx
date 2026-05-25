import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, TrendingUp, AlertTriangle, DollarSign, Building, Calendar } from 'lucide-react'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Australian Property Market Forecast 2025-2030 | Growth Predictions',
  description: 'Expert analysis and data-driven predictions for Australian property market 2025-2030. State-by-state forecasts and investment opportunities.',
  keywords: ['property market forecast', 'australian property 2025', 'house price predictions', 'real estate forecast australia', 'property market outlook'],
}

const forecasts = [
  {
    state: 'New South Wales',
    city: 'Sydney',
    growth2025: '+4.5%',
    growth5yr: '+22%',
    outlook: 'Positive',
    color: 'blue',
    summary: 'Strong recovery expected in middle-ring suburbs. Premium markets may face headwinds from interest rates.',
  },
  {
    state: 'Victoria',
    city: 'Melbourne',
    growth2025: '+3.8%',
    growth5yr: '+18%',
    outlook: 'Moderate',
    color: 'indigo',
    summary: 'Outer suburbs showing strongest growth. Inner-city apartments oversupplied in short term.',
  },
  {
    state: 'Queensland',
    city: 'Brisbane',
    growth2025: '+7.2%',
    growth5yr: '+35%',
    outlook: 'Very Strong',
    color: 'orange',
    summary: 'Olympics 2032 infrastructure driving massive growth. Best performing major market nationally.',
  },
  {
    state: 'Western Australia',
    city: 'Perth',
    growth2025: '+6.5%',
    growth5yr: '+28%',
    outlook: 'Strong',
    color: 'teal',
    summary: 'Mining sector recovery and housing undersupply creating strong fundamentals.',
  },
  {
    state: 'South Australia',
    city: 'Adelaide',
    growth2025: '+5.2%',
    growth5yr: '+25%',
    outlook: 'Strong',
    color: 'rose',
    summary: 'Affordable alternative to east coast. Strong interstate migration continues.',
  },
]

export default function PropertyForecastPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-slate-900 via-gray-800 to-zinc-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-gray-300 text-sm font-medium mb-6">
              📈 Expert Analysis
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Australian Property Market <span className="text-yellow-400">Forecast 2025-2030</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Data-driven predictions and state-by-state analysis for smart property investors.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/search" className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all">
                Find Growing Suburbs <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-green-600">+5.2%</div>
              <div className="text-gray-600">National 2025 Forecast</div>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-blue-600">+24%</div>
              <div className="text-gray-600">5-Year Growth Projection</div>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-purple-600">QLD</div>
              <div className="text-gray-600">Strongest Market</div>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-orange-600">3.9%</div>
              <div className="text-gray-600">Avg Rental Yield</div>
            </div>
          </div>
        </div>
      </section>

      {/* State Forecasts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">State-by-State Forecasts</h2>
          <div className="space-y-6">
            {forecasts.map((forecast) => (
              <div key={forecast.state} className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{forecast.state}</h3>
                    <p className="text-gray-500">{forecast.city} Metro Area</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-gray-100 rounded-lg px-4 py-2 text-center">
                      <div className="text-lg font-bold text-green-600">{forecast.growth2025}</div>
                      <div className="text-xs text-gray-500">2025 Forecast</div>
                    </div>
                    <div className="bg-gray-100 rounded-lg px-4 py-2 text-center">
                      <div className="text-lg font-bold text-blue-600">{forecast.growth5yr}</div>
                      <div className="text-xs text-gray-500">5-Year Growth</div>
                    </div>
                    <div className={`rounded-lg px-4 py-2 text-center ${
                      forecast.outlook === 'Very Strong' ? 'bg-green-100 text-green-800' :
                      forecast.outlook === 'Strong' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      <div className="text-lg font-bold">{forecast.outlook}</div>
                      <div className="text-xs opacity-75">Outlook</div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{forecast.summary}</p>
                <div className="mt-4 pt-4 border-t">
                  <Link 
                    href={`/best-suburbs/${forecast.city.toLowerCase()}`}
                    className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                  >
                    View {forecast.city} Suburbs <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Forecast Methodology</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <TrendingUp className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Historical Analysis</h3>
              <p className="text-gray-600">10+ years of price data analyzed for trend patterns and cycle identification.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <Building className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Supply/Demand Modeling</h3>
              <p className="text-gray-600">Construction pipeline, population growth, and housing demand projections.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <DollarSign className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Economic Indicators</h3>
              <p className="text-gray-600">Interest rates, employment, and income growth factored into models.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <Calendar className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Infrastructure Pipeline</h3>
              <p className="text-gray-600">Major projects like Brisbane Olympics 2032 incorporated into growth predictions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-yellow-50 border-y border-yellow-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-yellow-700 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Disclaimer</span>
          </div>
          <p className="text-yellow-800 text-sm">
            These forecasts are based on current data and economic models. Property markets can be affected by unforeseen events. 
            Always conduct your own research and consult with qualified professionals before making investment decisions.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Find High-Growth Suburbs Now</h2>
          <p className="text-xl text-blue-100 mb-8">Search 14,500+ suburbs with detailed growth forecasts and AI insights.</p>
          <Link href="/search" className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all">
            Start Your Search <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
