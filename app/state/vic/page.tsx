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

export default function VICPage() {
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
      const response = await fetch('/api/suburbs/top?state=VIC&limit=12')
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
      const response = await fetch(`/api/suburbs/search?q=${encodeURIComponent(query)}&state=VIC&limit=10`)
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
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}&state=VIC`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              Victoria Property Market Intelligence
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Comprehensive property insights, market trends, and investment opportunities across 746+ suburbs in Australia's most liveable state
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
                    placeholder="Search VIC suburbs (e.g., Box Hill, Melbourne, Geelong)..."
                    className="w-full px-6 py-4 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-lg"
                  />
                  {/* Autocomplete Dropdown */}
                  {showDropdown && searchResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-y-auto">
                      {searchResults.map((suburb) => (
                        <Link
                          key={`${suburb.name}-${suburb.postcode}`}
                          href={`/suburb/${encodeURIComponent(suburb.name)}?state=${suburb.state}&postcode=${suburb.postcode}`}
                          className="block px-6 py-3 hover:bg-purple-50 border-b border-gray-100 last:border-b-0"
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
                  className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold flex items-center gap-2 shadow-lg"
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
          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-purple-600">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="h-8 w-8 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Suburbs</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">746+</p>
            <p className="text-sm text-gray-600 mt-1">Tracked locations</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-green-600">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <h3 className="font-semibold text-gray-900">Median Price</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">$780K</p>
            <p className="text-sm text-gray-600 mt-1">State average</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-pink-600">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-8 w-8 text-pink-600" />
              <h3 className="font-semibold text-gray-900">Growth Rate</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">+5.8%</p>
            <p className="text-sm text-gray-600 mt-1">Annual average</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-orange-600">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-8 w-8 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Population</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">6.7M</p>
            <p className="text-sm text-gray-600 mt-1">Total residents</p>
          </div>
        </div>

        {/* Expert Analysis Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Victoria Property Market: Australia's Most Liveable Investment Destination
              </h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Victoria stands as Australia's second-largest property market and consistently ranks among the world's most liveable cities, offering sophisticated investors exceptional opportunities across 746 diverse suburbs spanning metropolitan Melbourne, coastal regions, and thriving regional centers. With a population exceeding 6.7 million residents and a state economy valued at over $450 billion annually, Victoria combines cultural sophistication, educational excellence, and economic diversity creating sustainable property market fundamentals attractive to both domestic and international investors.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Melbourne: Australia's Cultural and Economic Powerhouse</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Greater Melbourne encompasses approximately 320 suburbs and represents one of the world's fastest-growing cities, with population growth averaging 100,000 people annually pre-pandemic and recovering strongly post-COVID restrictions. The city's median house price of $780,000 offers relative affordability compared to Sydney while delivering comparable lifestyle amenities, world-class infrastructure, and robust economic opportunities. Melbourne's reputation as Australia's cultural capital, combined with its concentration of universities, hospitals, and corporate headquarters, creates sustained property demand across multiple market segments.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  The metropolitan area demonstrates distinct geographic pricing patterns, with the prestigious Eastern Suburbs including Toorak, Kew, and Hawthorn commanding premium prices exceeding $2 million for established homes due to proximity to elite private schools, parklands, and the CBD. The Bayside region, encompassing suburbs from Brighton to Sandringham, offers coveted beachside living with median prices around $1.5-2 million, attracting affluent professionals and families seeking coastal lifestyle within metropolitan convenience. Inner-city suburbs like Carlton, Fitzroy, and Richmond combine heritage architecture with cosmopolitan dining and entertainment, delivering strong rental yields of 3-4% from young professional and student demographics.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Growth Corridors and Emerging Investment Hotspots</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Melbourne's outer growth corridors represent Victoria's most dynamic property investment opportunities, with suburbs in the North (Craigieburn, Epping), West (Point Cook, Werribee), and Southeast (Cranbourne, Clyde) experiencing extraordinary population growth and infrastructure investment. These areas offer median house prices ranging $500,000-$700,000, approximately 30-40% below inner-suburban equivalents, while delivering superior rental yields of 4-5% and strong capital growth potential as transport connectivity improves and employment nodes develop.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  The western suburbs corridor, anchored by the Werribee employment precinct and enhanced by the Regional Rail Link, demonstrates particular investment merit with substantial government and private sector investment in healthcare, education, and commercial facilities. Suburbs like Point Cook and Truganina have experienced population growth exceeding 5% annually, driving property price appreciation of 10-15% in recent years. The upcoming Western Interstate Freight Terminal and proposed Outer Metropolitan Ring Road will further catalyze development, positioning western corridor suburbs for sustained long-term growth.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Regional Victoria: Lifestyle and Investment Excellence</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Regional Victoria offers compelling investment propositions combining affordability, lifestyle amenity, and strong rental fundamentals. Geelong, Victoria's second city with a population approaching 280,000, has emerged as a property market standout with median house prices around $650,000 delivering rental yields of 4-5%. The city's transformation from manufacturing center to services economy, combined with waterfront revitalization and improved transport links to Melbourne (45-minute journey via upgraded rail), attracts remote workers, retirees, and young families seeking affordable coastal living.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  The Mornington Peninsula, encompassing towns from Mornington to Portsea, represents Victoria's premier lifestyle destination with median house prices ranging $800,000-$2 million depending on beach proximity and property quality. While traditionally dominated by holiday homes and retirees, the region increasingly attracts permanent residents seeking work-from-home flexibility, driving rental demand and property values. The Surf Coast region, including Torquay and Lorne, similarly benefits from lifestyle migration trends, with median prices around $900,000 and consistent capital growth of 8-10% annually.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Infrastructure Investment Reshaping Connectivity</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Victoria's infrastructure investment program exceeding $80 billion over the next decade fundamentally transforms property market dynamics, particularly through the Melbourne Metro Tunnel project connecting the suburbs of Kensington and South Yarra via new CBD stations. This transformative infrastructure creates significant value uplift opportunities in suburbs along the route and near new stations including Arden, Parkville, and Domain. Historical precedent demonstrates property values increase 15-30% within proximity of new rail stations, presenting strategic opportunities for investors with medium to long-term horizons.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  The North East Link project, connecting the M80 Ring Road with the Eastern Freeway, represents Australia's largest road infrastructure project with investment exceeding $15 billion. This development dramatically improves connectivity for northern and eastern suburbs, reducing travel times and unlocking areas previously constrained by transport limitations. Suburbs including Bulleen, Templestowe, and Heidelberg West benefit significantly from enhanced accessibility, driving both owner-occupier interest and investment demand as Melbourne's population continues expanding northward and eastward.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Education Precincts and Knowledge Economy</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Victoria hosts eight world-ranked universities concentrated primarily in metropolitan Melbourne, creating substantial student accommodation demand and supporting robust rental markets in suburbs surrounding major campuses. The University of Melbourne precinct in Carlton and Parkville, Monash University campuses in Clayton and Caulfield, and RMIT in the CBD collectively enroll over 200,000 students, including significant international cohorts driving purpose-built student accommodation and apartment investment opportunities with yields frequently exceeding 5%.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  The knowledge economy concentration extends beyond universities to include research precincts like Monash Technology Precinct in Clayton, employing thousands in high-value industries including biotechnology, medical research, and advanced manufacturing. These employment hubs create sustained housing demand from professionals and postgraduate students, supporting both capital growth and rental performance in surrounding suburbs. Areas within 5 kilometers of major employment nodes consistently outperform broader market averages, delivering superior risk-adjusted returns for strategic investors.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Apartment Market Dynamics and Urban Consolidation</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Melbourne's apartment market demonstrates increasing sophistication with substantial supply concentrated in the CBD, Southbank, and Docklands precincts. While these areas experienced oversupply concerns during peak construction periods, the market has substantially rebalanced with reduced new supply and strengthening rental demand from returning international students and migrants. Apartments in established locations with superior amenities, building quality, and management deliver consistent rental returns of 4-5% while offering lower entry prices ($400,000-$600,000) compared to houses.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Suburban apartment markets in areas like Box Hill, Glen Waverley, and Footscray represent emerging investment opportunities as urban consolidation policies and transport-oriented development drive high-density construction near railway stations and activity centers. These locations offer the lifestyle benefits of suburban living combined with apartment affordability and accessibility, attracting diverse demographics including downsizers, young professionals, and small families. Median apartment prices in these precincts range $450,000-$650,000, offering superior affordability compared to equivalent house purchases while delivering competitive rental yields.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Migration Patterns and Demographic Trends</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Victoria's migration patterns significantly influence property market dynamics, with the state historically attracting approximately 35% of Australia's international migrants and substantial interstate migration from other states. Melbourne's multicultural character, employment opportunities, and lifestyle amenities create sustained population growth supporting long-term housing demand. Pre-pandemic international migration exceeded 100,000 people annually to Victoria, with projections indicating recovery to historical levels by 2025 as border restrictions normalize and international education recovers.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Demographic analysis reveals strong preference for suburban living among families, with outer suburbs experiencing the highest population growth rates while inner-city areas attract younger singles and couples. This creates distinct investment strategies, with growth corridor suburbs offering superior capital appreciation potential and inner-city apartments delivering stronger rental yields and liquidity. Regional centers increasingly attract tree-changers and remote workers seeking lifestyle improvement and housing affordability, creating investment opportunities in previously overlooked markets including Ballarat, Bendigo, and Shepparton.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Market Cycles and Investment Strategy</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Victoria's property market demonstrates cyclical patterns typically spanning 7-10 years from trough to peak, influenced by economic conditions, population growth, interest rates, and investor sentiment. Understanding these cycles proves crucial for optimizing investment timing and strategy. The current market phase demonstrates characteristics of mid-cycle expansion with prices recovering from pandemic disruptions, supported by low interest rates, constrained supply, and strengthening demand across both owner-occupier and investor segments.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Sophisticated investors recognize optimal entry points during market corrections or early recovery phases when vendor motivation increases and competition moderates. The 2020 pandemic-related downturn created significant opportunities for well-positioned buyers to acquire quality properties at 10-15% discounts to previous peak values. Similar opportunities arise during interest rate increase cycles or economic uncertainty, rewarding patient investors with strong long-term risk-adjusted returns as markets inevitably recover and appreciate.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Rental Market Fundamentals and Yield Considerations</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Victoria's rental market exhibits healthy fundamentals with statewide vacancy rates below 2%, indicating tight supply-demand balance favoring landlords. Melbourne's rental market demonstrates geographic variation, with inner-city apartments yielding 3.5-4.5%, established suburban houses 2.5-3.5%, and outer growth corridor properties 4-5%. Regional centers consistently deliver superior yields of 4-6% while requiring lower capital investment, creating attractive cash-flow positive opportunities for income-focused investors.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Rental price growth has accelerated substantially in recent periods, particularly in suburban markets experiencing strong owner-occupier demand and constrained rental supply. Areas with improving transport connectivity, new employment nodes, and lifestyle amenities demonstrate rental increases of 8-12% annually, substantially exceeding inflation and enhancing investment returns. Properties offering modern fixtures, outdoor space, and car parking command significant rental premiums and attract higher-quality long-term tenants, reducing vacancy periods and maintenance costs while maximizing returns.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg">
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
                  <p className="text-sm font-semibold text-green-900 mb-1">Growth Corridors</p>
                  <p className="text-xs text-green-700">Western suburbs showing 10-15% annual appreciation</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm font-semibold text-purple-900 mb-1">Metro Tunnel Impact</p>
                  <p className="text-xs text-purple-700">$80B+ infrastructure reshaping Melbourne connectivity</p>
                </div>
                <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg">
                  <p className="text-sm font-semibold text-pink-900 mb-1">Regional Opportunity</p>
                  <p className="text-xs text-pink-700">Geelong & Mornington Peninsula strong performers</p>
                </div>
              </div>
            </div>

            {/* Regional Focus */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Regions</h3>
              <div className="space-y-3">
                <div className="p-3 border-l-4 border-purple-600 bg-purple-50">
                  <p className="font-semibold text-gray-900">Greater Melbourne</p>
                  <p className="text-sm text-gray-600">320+ suburbs tracked</p>
                </div>
                <div className="p-3 border-l-4 border-green-600 bg-green-50">
                  <p className="font-semibold text-gray-900">Geelong</p>
                  <p className="text-sm text-gray-600">Regional powerhouse</p>
                </div>
                <div className="p-3 border-l-4 border-pink-600 bg-pink-50">
                  <p className="font-semibold text-gray-900">Mornington Peninsula</p>
                  <p className="text-sm text-gray-600">Coastal lifestyle</p>
                </div>
                <div className="p-3 border-l-4 border-orange-600 bg-orange-50">
                  <p className="font-semibold text-gray-900">Surf Coast</p>
                  <p className="text-sm text-gray-600">Beach paradise</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Suburbs */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Top Performing Victoria Suburbs
            </h2>
            <Link
              href="/search?state=VIC"
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
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
                  href={`/suburb/${encodeURIComponent(suburb.name)}?state=VIC&postcode=${suburb.postcode}`}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-purple-500"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-lg">{suburb.name}</h3>
                    <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">
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
                        <span className="text-xs font-bold text-purple-600">
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
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Explore Victoria Property Opportunities?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Access detailed insights for over 746 Victoria suburbs with real-time data, market trends, and investment analysis.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/search?state=VIC"
              className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold inline-flex items-center gap-2"
            >
              <Search className="h-5 w-5" />
              Search VIC Suburbs
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 bg-purple-800 text-white rounded-lg hover:bg-purple-900 transition-colors font-semibold border-2 border-white"
            >
              Unlock Premium Features
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
