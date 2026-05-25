'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, Home, DollarSign, Users, MapPin, Building2, ArrowRight, Search, BarChart3, Target, Sparkles } from 'lucide-react'

interface SuburbData {
  name: string
  postcode: string
  state: string
  medianPrice: number
  rentalYield: number
  growth12m: number
  investmentScore: number
}

export default function NSWPage() {
  const [topSuburbs, setTopSuburbs] = useState<SuburbData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SuburbData[]>([])
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    fetchTopSuburbs()
  }, [])

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      searchSuburbs(searchQuery)
    } else {
      setSearchResults([])
      setShowDropdown(false)
    }
  }, [searchQuery])

  const fetchTopSuburbs = async () => {
    try {
      const response = await fetch('/api/suburbs/top?state=NSW&limit=12')
      const data = await response.json()
      if (data.success) {
        setTopSuburbs(data.suburbs)
      }
    } catch (error) {
      console.error('Error fetching suburbs:', error)
    } finally {
      setLoading(false)
    }
  }

  const searchSuburbs = async (query: string) => {
    try {
      const response = await fetch(`/api/suburbs/search?q=${encodeURIComponent(query)}&state=NSW&limit=10`)
      const data = await response.json()
      if (data.success) {
        setSearchResults(data.suburbs)
        setShowDropdown(true)
      }
    } catch (error) {
      console.error('Error searching suburbs:', error)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}&state=NSW`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              New South Wales Property Market Intelligence
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Comprehensive property insights, market trends, and investment opportunities across 4,100+ suburbs in Australia's most populous state
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    onFocus={() => searchQuery.length > 1 && setShowDropdown(true)}
                    placeholder="Search NSW suburbs (e.g., Parramatta, Rouse Hill, Box Hill)..."
                    className="w-full px-6 py-4 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
                  />
                  {/* Autocomplete Dropdown */}
                  {showDropdown && searchResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-y-auto">
                      {searchResults.map((suburb) => (
                        <Link
                          key={`${suburb.name}-${suburb.postcode}`}
                          href={`/suburb/${encodeURIComponent(suburb.name)}?state=${suburb.state}&postcode=${suburb.postcode}`}
                          className="block px-6 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                          onClick={() => setShowDropdown(false)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{suburb.name}</p>
                              <p className="text-sm text-gray-600">{suburb.state} {suburb.postcode}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">
                                ${suburb.medianPrice?.toLocaleString() || 'N/A'}
                              </p>
                              <p className="text-xs text-green-600">
                                +{suburb.growth12m ? suburb.growth12m.toFixed(1) : '0.0'}%
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center gap-2 shadow-lg"
                >
                  <Search className="h-5 w-5" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-blue-600">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="h-8 w-8 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Suburbs</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">4,100+</p>
            <p className="text-sm text-gray-600 mt-1">Tracked locations</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-green-600">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <h3 className="font-semibold text-gray-900">Median Price</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">$850K</p>
            <p className="text-sm text-gray-600 mt-1">State average</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-purple-600">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Growth Rate</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">+6.2%</p>
            <p className="text-sm text-gray-600 mt-1">Annual average</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-orange-600">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-8 w-8 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Population</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">8.2M</p>
            <p className="text-sm text-gray-600 mt-1">Total residents</p>
          </div>
        </div>

        {/* Expert Analysis Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Understanding the NSW Property Market: A Comprehensive Investment Guide
              </h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  New South Wales represents Australia's largest and most dynamic property market, home to over 8.2 million residents and featuring more than 4,100 distinct suburbs spanning from coastal paradises to thriving inland communities. As the economic powerhouse of Australia, NSW offers unparalleled diversity in property investment opportunities, from the iconic Sydney Harbor precinct to emerging growth corridors in Western Sydney and regional centers experiencing unprecedented development.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Market Overview and Economic Fundamentals</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The NSW property market demonstrates remarkable resilience and growth potential, underpinned by robust economic fundamentals including Australia's largest state economy valued at over $600 billion annually. Sydney, the state capital, serves as the nation's financial services hub, commanding approximately 40% of Australia's economic output and attracting significant domestic and international investment. This economic strength translates directly into property market performance, with median house prices across NSW averaging $850,000 and demonstrating consistent annual growth of 6.2% over the past decade.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  The state's property landscape encompasses extraordinary diversity, from premium waterfront estates in Point Piper and Vaucluse commanding prices exceeding $10 million, to affordable family homes in emerging suburbs like Box Hill and Rouse Hill offering excellent value propositions under $1.5 million. This diversity creates opportunities for investors across all budget ranges and investment strategies, whether seeking capital growth, rental yields, or balanced portfolio approaches.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sydney Metropolitan Market Dynamics</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Greater Sydney comprises approximately 658 suburbs and remains the primary driver of NSW property market activity, accounting for roughly 65% of the state's total property transactions. The metropolitan area demonstrates distinct regional characteristics, with the Eastern Suburbs and Lower North Shore commanding premium prices due to proximity to the CBD, established infrastructure, and prestigious school catchments. Suburbs like Double Bay, Mosman, and Neutral Bay consistently deliver strong capital growth, though entry prices typically exceed $1.5 million for houses and $800,000 for apartments.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Western Sydney represents the state's most significant growth corridor, with suburbs including Parramatta, Penrith, and Liverpool experiencing transformative infrastructure investment and population growth. The Parramatta CBD, designated as Sydney's second CBD, has witnessed billions in commercial and residential development, driving property values upward by 15-20% in surrounding suburbs over recent years. The new Western Sydney International Airport at Badgerys Creek catalyzes unprecedented development opportunities, with surrounding suburbs like Luddenham and Orchard Hills positioned for substantial long-term growth.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Regional NSW Investment Opportunities</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Regional NSW cities including Newcastle, Wollongong, Central Coast, and the Hunter Valley offer compelling investment alternatives to metropolitan Sydney, combining more affordable entry prices with strong rental demand and lifestyle amenities. Newcastle, Australia's seventh-largest city, has emerged as a property hotspot, with median house prices around $850,000 delivering superior rental yields of 4-5% compared to Sydney's 2.5-3%. The city's transformation from industrial center to knowledge economy hub, coupled with pristine beaches and vibrant cultural scene, attracts young professionals and families seeking affordable coastal living.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  The Central Coast region, encompassing suburbs from Wyong to Woy Woy, provides exceptional value for money with median house prices around $750,000, approximately 30-40% below comparable Sydney properties. Improved transport connectivity via upgraded rail services and motorways has reduced commuting times to Sydney CBD to under 90 minutes, making the region increasingly attractive for remote workers and sea-changers. Towns like Terrigal and Avoca Beach combine investment potential with enviable lifestyle amenities including pristine beaches, national parks, and growing hospitality sectors.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Infrastructure Investment and Future Growth</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  NSW Government infrastructure investment exceeding $100 billion over the next decade fundamentally reshapes property market dynamics across the state. The Sydney Metro network expansion, including the upcoming Sydney Metro West connecting Parramatta to the CBD, creates significant value uplift opportunities in suburbs along the route including Five Dock, Burwood North, and North Strathfield. Historical analysis demonstrates property values increase 10-25% within 800 meters of new metro stations, presenting strategic investment opportunities for forward-thinking buyers.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Major motorway projects including the WestConnex, NorthConnex, and future Western Harbour Tunnel dramatically improve connectivity and accessibility, reducing travel times and unlocking previously overlooked suburbs for development. Suburbs positioned at motorway interchanges or with improved highway access experience enhanced desirability for both owner-occupiers and investors, translating to stronger capital growth and rental demand. Areas like Rozelle, Haberfield, and Homebush benefit significantly from these infrastructure upgrades.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Demographic Trends and Migration Patterns</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  NSW continues attracting significant interstate and international migration, with net population growth averaging 100,000 people annually pre-pandemic and recovering strongly post-COVID. Sydney alone welcomes approximately 60% of this growth, creating sustained housing demand pressures that support property price appreciation. Demographic analysis reveals strong preference for suburban living, particularly among young families seeking larger homes with outdoor space, driving demand in growth corridors including Northwest Sydney (Kellyville, Bella Vista), Southwest Sydney (Oran Park, Leppington), and regional centers.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  International student populations, particularly concentrated around universities in suburbs like Kensington, Ultimo, and Macquarie Park, create robust rental markets for apartment investments. Despite pandemic-related disruptions, international education remains a $12 billion industry in NSW, with student numbers projected to exceed pre-pandemic levels by 2025. Purpose-built student accommodation and apartments within 5 kilometers of major universities consistently deliver rental yields exceeding 5%, attractive for income-focused investors.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Market Cycles and Investment Timing</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Understanding NSW property market cycles proves crucial for maximizing investment returns. Historical analysis reveals approximately 7-10 year cycles characterized by growth phases, peak periods, corrections, and recovery. The current market demonstrates characteristics of mid-cycle growth, with prices recovering from pandemic-related disruptions and supported by low interest rates, strong employment, and constrained supply. Strategic investors recognize optimal entry points during market corrections or early recovery phases, positioning for maximum capital appreciation through subsequent growth periods.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Seasonal patterns within annual cycles also influence optimal transaction timing, with spring (September-November) typically experiencing peak listing volumes and competitive bidding, while winter months (June-August) may present negotiation opportunities as vendor motivation increases and buyer competition moderates. Sophisticated investors leverage these seasonal dynamics, combining market cycle analysis with personal financial readiness to optimize purchase timing.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Rental Market Analysis and Yield Considerations</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The NSW rental market exhibits strong fundamentals with vacancy rates below 2% in most Sydney suburbs, indicating tight supply-demand dynamics favoring landlords. Rental yields vary significantly by location and property type, with inner-city apartments delivering 3-4%, established suburban houses 2.5-3.5%, and regional properties 4-6%. Investors prioritizing cash flow should consider regional centers, outer suburbs, and apartment precincts near universities or employment hubs where rental demand remains consistently strong.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Rental price growth has accelerated recently, particularly in suburban areas experiencing strong owner-occupier demand and constrained rental supply. Suburbs with new infrastructure, improving amenities, and employment growth demonstrate rental increases of 8-12% annually, substantially exceeding inflation and enhancing investment returns. Properties offering modern amenities, outdoor space, and proximity to transport command rental premiums and attract higher-quality, longer-term tenants reducing vacancy and maintenance costs.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="h-6 w-6" />
                Investment Tools
              </h3>
              <div className="space-y-3">
                <Link href="/compare" className="block p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    <span className="font-semibold">Compare Suburbs</span>
                  </div>
                </Link>
                <Link href="/portfolio" className="block p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    <span className="font-semibold">Portfolio Tracker</span>
                  </div>
                </Link>
                <Link href="/mortgage-calculator" className="block p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    <span className="font-semibold">Calculators</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Market Insights */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-600" />
                Market Insights
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-semibold text-green-900 mb-1">Strong Growth</p>
                  <p className="text-xs text-green-700">Western Sydney suburbs showing 15-20% annual growth</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Infrastructure Boom</p>
                  <p className="text-xs text-blue-700">$100B+ in transport projects reshaping connectivity</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm font-semibold text-purple-900 mb-1">Tight Rental Market</p>
                  <p className="text-xs text-purple-700">Vacancy rates below 2% across most suburbs</p>
                </div>
              </div>
            </div>

            {/* Regional Focus */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Regions</h3>
              <div className="space-y-3">
                <div className="p-3 border-l-4 border-blue-600 bg-blue-50">
                  <p className="font-semibold text-gray-900">Greater Sydney</p>
                  <p className="text-sm text-gray-600">658 suburbs tracked</p>
                </div>
                <div className="p-3 border-l-4 border-green-600 bg-green-50">
                  <p className="font-semibold text-gray-900">Newcastle</p>
                  <p className="text-sm text-gray-600">Coastal lifestyle hub</p>
                </div>
                <div className="p-3 border-l-4 border-purple-600 bg-purple-50">
                  <p className="font-semibold text-gray-900">Central Coast</p>
                  <p className="text-sm text-gray-600">Beach & affordability</p>
                </div>
                <div className="p-3 border-l-4 border-orange-600 bg-orange-50">
                  <p className="font-semibold text-gray-900">Wollongong</p>
                  <p className="text-sm text-gray-600">Industrial to modern</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Suburbs */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Top Performing NSW Suburbs
            </h2>
            <Link
              href="/search?state=NSW"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All Suburbs
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {topSuburbs.map((suburb, index) => (
                <Link
                  key={index}
                  href={`/suburb/${encodeURIComponent(suburb.name)}?state=NSW&postcode=${suburb.postcode}`}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-500"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-lg">{suburb.name}</h3>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {suburb.postcode}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Median Price</span>
                      <span className="font-semibold text-gray-900">
                        ${suburb.medianPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Growth (12m)</span>
                      <span className="font-semibold text-green-600">
                        +{suburb.growth12m ? suburb.growth12m.toFixed(1) : '0.0'}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Yield</span>
                      <span className="font-semibold text-purple-600">
                        {suburb.rentalYield ? suburb.rentalYield.toFixed(1) : '0.0'}%
                      </span>
                    </div>
                    {suburb.investmentScore && (
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500">Investment Score</span>
                        <span className="text-xs font-bold text-blue-600">
                          {suburb.investmentScore}/100
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Explore NSW Property Opportunities?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Access detailed insights for over 4,100 NSW suburbs with real-time data, market trends, and investment analysis.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/search?state=NSW"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold inline-flex items-center gap-2"
            >
              <Search className="h-5 w-5" />
              Search NSW Suburbs
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-semibold border-2 border-white"
            >
              Unlock Premium Features
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
