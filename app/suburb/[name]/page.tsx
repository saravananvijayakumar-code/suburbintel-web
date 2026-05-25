'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSubscription } from '@/contexts/SubscriptionContext'
import Link from 'next/link'
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Home,
  MapPin,
  BarChart3,
  Calendar,
  Shield,
  Building2,
} from 'lucide-react'
import HistoricalChart from '@/app/components/HistoricalChart'
import DemographicsPanel from '@/app/components/DemographicsPanel'
import InteractiveSuburbReport from '@/app/components/InteractiveSuburbReport'
import DashboardLayout from '@/app/components/DashboardLayout'
import { DetailedRiskCard, type RiskLevel } from '@/components/ui/RiskBadge'
import { generateSuburbSchema, isTopSuburb } from '@/lib/seo-helpers'


interface SuburbData {
  id: string
  name: string
  state: string
  postcode: string
  medianPrice: number
  medianUnitPrice?: number | null  // Separate unit/apartment price
  weeklyRent: number
  rentalYield: number
  growth12m: number
  growth6m: number
  growth3m: number
  investmentScore: number
  lastUpdated: string
  dataSource?: string
  dataQuality?: string
  updateFrequency?: string
  // Environmental risk data
  bushfireRisk?: string | null
  floodRisk?: string | null
  crimeRisk?: string | null
  // AI Analysis
  aiAnalysis?: string | null
  // Similar suburbs for comparison
  similarSuburbs?: Array<{
    name: string
    state: string
    medianPrice: number
    growth12m: number | null
    investmentScore: number | null
  }>
  // Demographics (Census)
  population?: number | null
  medianAge?: number | null
  medianIncome?: number | null
  ownerOccupierPercentage?: number | null
  renterPercentage?: number | null
  unemploymentRate?: number | null
  averageHouseholdSize?: number | null
  bachelorDegree?: number | null
  ageDistribution?: any
  // Livability Scores
  walkabilityScore?: number | null
  publicTransportScore?: number | null
  schoolQualityScore?: number | null
  crimeRateIndex?: number | null
  crimeRate?: string | null
  crimeScore?: number | null
  // Infrastructure
  trainStations?: number | null
  busStops?: number | null
  primarySchools?: number | null
  secondarySchools?: number | null
  hospitals?: number | null
  shoppingCentres?: number | null
  parks?: number | null
}

interface PriceHistory {
  id: string
  suburbId: string
  medianPrice: number
  weeklyRent?: number
  quarter: string
  month: string
  createdAt: string
}

interface SimilarSuburb {
  name: string
  state: string
  postcode: string
  medianPrice: number
  growth12m: number
  rentalYield: number
  investmentScore: number
  similarityScore: number
  priceDifference: number
  priceDifferencePercent: string
}

interface SuburbRanking {
  nationalRank: number
  totalSuburbs: number
  stateRank: number
  totalInState: number
  category: string
}

export default function SuburbDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { subscriptionTier } = useSubscription()
  const hasProAccess = subscriptionTier === 'pro'
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  
  // Parse the name parameter which could be "suburb-name-state-postcode"
  const rawName = (params.name as string)
  let suburbName = rawName
  let state = searchParams.get('state')
  let postcode = searchParams.get('postcode')
  
  // If name contains state and postcode pattern (e.g., "orchard-hills-nsw-2748")
  // Extract them: last segment is postcode, second-to-last is state
  const parts = rawName.split('-')
  if (parts.length >= 3) {
    const lastPart = parts[parts.length - 1]
    const secondLastPart = parts[parts.length - 2]
    
    // Check if last part is postcode (4 digits) and second-last is state (2-3 letters)
    if (/^\d{4}$/.test(lastPart) && /^[a-z]{2,3}$/i.test(secondLastPart)) {
      postcode = lastPart
      state = secondLastPart.toUpperCase()
      // Remove state and postcode from suburb name
      suburbName = parts.slice(0, -2).join('-')
    }
  }
  
  const [suburb, setSuburb] = useState<SuburbData | null>(null)
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([])
  const [similarSuburbs, setSimilarSuburbs] = useState<SimilarSuburb[]>([])
  const [ranking, setRanking] = useState<SuburbRanking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper function to generate risk levels for display
  const getRiskLevel = (risk: string | null | undefined): RiskLevel => {
    if (!risk) return 'unknown'
    const riskLower = risk.toLowerCase()
    if (riskLower.includes('high')) return 'high'
    if (riskLower.includes('medium') || riskLower.includes('moderate')) return 'medium'
    if (riskLower.includes('low')) return 'low'
    return 'unknown'
  }

  useEffect(() => {
    const fetchSuburbData = async () => {
      try {
        // Fetch suburb details - include state AND postcode for disambiguation
        let url = `/api/suburbs/${encodeURIComponent(suburbName)}`
        const params = new URLSearchParams()
        if (state) params.append('state', state)
        if (postcode) params.append('postcode', postcode)
        if (params.toString()) url += `?${params.toString()}`
        
        const response = await fetch(url)
        const data = await response.json()
        
        if (!response.ok || !data.success) {
          setError(data.error || 'Suburb not found')
          setIsLoading(false)
          return
        }
        
        if (data.suburb) {
          setSuburb(data.suburb)
          setPriceHistory(data.priceHistory || [])
          
          // Fetch similar suburbs
          if (data.suburb.state) {
            fetchSimilarSuburbs(data.suburb.name, data.suburb.state)
          }
          
          // Fetch ranking
          fetchRanking(data.suburb.id)
        } else {
          setError('Suburb not found')
        }
      } catch (err) {
        console.error('Error fetching suburb:', err)
        setError('Failed to load suburb data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuburbData()
  }, [suburbName, state, postcode])

  const fetchSimilarSuburbs = async (_name: string, _state: string) => {
    // Recommendations API removed; similar suburbs are returned with the suburb data
    setSimilarSuburbs([])
  }

  const fetchRanking = async (suburbId: string) => {
    try {
      const response = await fetch(`/api/suburbs/${suburbId}/ranking`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setRanking(data.ranking)
        }
      }
    } catch (err) {
      console.error('Error fetching ranking:', err)
    }
  }



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !suburb) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Suburb Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The suburb you are looking for does not exist.'}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Return to Homepage
          </Link>
        </div>
      </div>
    )
  }

  // Generate Schema.org structured data for SEO
  const schemaData = suburb ? generateSuburbSchema({
    name: suburb.name,
    state: suburb.state,
    postcode: suburb.postcode,
    medianPrice: suburb.medianPrice,
    rentalYield: suburb.rentalYield,
    growth12m: suburb.growth12m,
    investmentScore: suburb.investmentScore,
    population: suburb.population || undefined,
  }) : null

  const isEnhancedSEO = suburb ? isTopSuburb(suburb.name, suburb.state) : false

  return (
    <DashboardLayout>
      {/* SEO: Schema.org Structured Data */}
      {suburb && schemaData && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData.place) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData.article) }}
          />
          {isEnhancedSEO && (
            <>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData.rating) }}
              />
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData.faq) }}
              />
            </>
          )}
        </>
      )}
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold text-gray-900">{suburb.name}, {suburb.state}</h1>
                {suburb.dataQuality === 'high' && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium" title="Official ABS Census 2021">
                    🟢 Official Data
                  </span>
                )}
                {suburb.dataQuality === 'medium' && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium" title="ABS Regional Average">
                    🟡 Regional Average
                  </span>
                )}
                {suburb.dataQuality === 'estimated' && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium" title="Research-Based Estimate">
                    📊 Research Estimate
                  </span>
                )}
                {suburb.dataQuality === 'low' && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium" title="Generated Data">
                    🔴 Generated
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>Postcode: {suburb.postcode}</span>
                </div>
                {suburb.updateFrequency && (
                  <div className="text-sm text-gray-500">
                    Updated: {suburb.updateFrequency}
                  </div>
                )}
              </div>
            </div>
            
            {/* Investment Score HIDDEN - Phase 1.3 - No real formula */}
            {/* <div className="text-right">
              <div className="text-sm text-gray-600">Investment Score</div>
              <div className="text-3xl font-bold text-blue-600">{suburb.investmentScore ? suburb.investmentScore.toFixed(1) : 'N/A'}</div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Data Quality Banner */}
        {suburb.dataQuality === 'high' ? (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 mb-1">✅ Official ABS Census 2021 Data</h3>
                <p className="text-sm text-green-800">
                  This suburb's data comes from <strong>official Australian Bureau of Statistics Census 2021</strong> and represents actual census data. 
                  All demographics including population, median income, age distribution, and education levels are based on official government census data.
                </p>
                <p className="text-xs text-green-700 mt-2">
                  Data Quality: High | Data Source: {suburb.dataSource || 'ABS Census 2021'} | Last Updated: {new Date(suburb.lastUpdated).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        ) : suburb.dataQuality === 'medium' ? (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">🟡 ABS-Based Regional Average Data</h3>
                <p className="text-sm text-yellow-800">
                  This suburb's data is <strong>calculated from nearby suburbs</strong> with official ABS Census 2021 data. 
                  Demographics are averaged from surrounding areas within the same region. This provides a reasonable estimate 
                  for smaller localities not separately measured in the census.
                </p>
                <p className="text-xs text-yellow-700 mt-2">
                  Data Quality: Medium | Data Source: {suburb.dataSource || 'ABS Census 2021 (Regional Average)'} | Last Updated: {new Date(suburb.lastUpdated).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        ) : suburb.dataQuality === 'estimated' ? (
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">📊 Research-Based Estimated Data</h3>
                <p className="text-sm text-blue-800">
                  This suburb's data is <strong>estimated using research-based regional models</strong> incorporating Q4 2024 market data from 
                  market data from Q4 2024 and ABS regional statistics. Estimates apply state-specific market conditions and metro/regional/remote 
                  location multipliers based on published property market research. <strong>This is indicative data for comparison purposes.</strong>
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  Data Quality: Estimated | Model: Research-Based Regional | Sources: Q4 2024 market data, ABS | Last Updated: {new Date(suburb.lastUpdated).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })} | <Link href="/data-sources" className="underline font-semibold">View Methodology</Link>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">⚠️ Generated Data - Not Real Market Data</h3>
                <p className="text-sm text-red-800">
                  This suburb data is currently <strong>GENERATED</strong> for demonstration purposes. <strong>Do not make investment decisions</strong> based on this data. 
                  For current verified market insights, use the <strong>"Generate Report"</strong> feature below which provides 
                  AI-powered analysis and always consult licensed real estate professionals.
                </p>
                <p className="text-xs text-red-700 mt-2">
                  Data Quality: Low | Last Updated: {new Date(suburb.lastUpdated).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })} | See our <Link href="/data-sources" className="underline font-semibold">Data Sources</Link> page
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Data Source Legend */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="font-semibold text-gray-700">Data Sources:</span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-gray-600">Government Data (NSW Valuer-General / VIC Land Victoria)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-gray-600">Market Data Sources</span>
            </span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* House Price */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-sm text-gray-600">Median Price</div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {suburb.medianPrice ? `$${suburb.medianPrice.toLocaleString()}` : 'N/A'}
            </div>
            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              Official Data Source
            </div>
          </div>

          {/* Unit/Apartment Price */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Building2 className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="text-sm text-gray-600">Unit Median</div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {suburb.medianUnitPrice ? `$${suburb.medianUnitPrice.toLocaleString()}` : 'N/A'}
            </div>
            <div className="text-xs mt-1 flex items-center gap-1">
              {suburb.medianUnitPrice ? (
                <>
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-blue-600">Market Data</span>
                </>
              ) : (
                <span className="text-gray-500">Not available from government source</span>
              )}
            </div>
          </div>

          {/* Weekly Rent */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="text-sm text-gray-600">Weekly Rent</div>
            </div>
            <div className="text-3xl font-bold text-gray-900">${suburb.weeklyRent !== null ? suburb.weeklyRent : 'N/A'}/wk</div>
            <div className="text-sm text-gray-600 mt-1">
              {suburb.rentalYield !== null ? `${suburb.rentalYield.toFixed(2)}% yield` : 'Yield: N/A'}
            </div>
          </div>

          {/* GROWTH RATES HIDDEN - Phase 1.4 - No real historical data */}
          {/* <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-sm text-gray-600">12 Month Growth</div>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {suburb.growth12m !== null ? `${suburb.growth12m >= 0 ? '+' : ''}${suburb.growth12m.toFixed(1)}%` : 'N/A'}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              6m: {suburb.growth6m !== null ? `${suburb.growth6m >= 0 ? '+' : ''}${suburb.growth6m.toFixed(1)}%` : 'N/A'}
            </div>
          </div> */}

          {/* Data Quality Label - Dynamic based on actual quality */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${
                suburb.dataQuality === 'high' ? 'bg-green-100' : 
                suburb.dataQuality === 'medium' ? 'bg-yellow-100' : 
                suburb.dataQuality === 'estimated' ? 'bg-blue-100' : 'bg-orange-100'
              }`}>
                <Calendar className={`h-6 w-6 ${
                  suburb.dataQuality === 'high' ? 'text-green-600' : 
                  suburb.dataQuality === 'medium' ? 'text-yellow-600' : 
                  suburb.dataQuality === 'estimated' ? 'text-blue-600' : 'text-orange-600'
                }`} />
              </div>
              <div className="text-sm text-gray-600">Data Quality</div>
            </div>
            <div className={`text-lg font-semibold ${
              suburb.dataQuality === 'high' ? 'text-green-600' : 
              suburb.dataQuality === 'medium' ? 'text-yellow-600' : 
              suburb.dataQuality === 'estimated' ? 'text-blue-600' : 'text-orange-600'
            }`}>
              {suburb.dataQuality === 'high' ? 'OFFICIAL' : 
               suburb.dataQuality === 'medium' ? 'REGIONAL AVG' : 
               suburb.dataQuality === 'estimated' ? 'RESEARCH EST.' : 'GENERATED'}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {suburb.dataQuality === 'high' ? 'ABS Census' : 
               suburb.dataQuality === 'medium' ? 'ABS Regional' : 
               suburb.dataQuality === 'estimated' ? 'Market Research' : 'AI Generated'}
            </div>
          </div>
        </div>



        {/* Price History Chart */}
        {priceHistory.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Price History (Annual Median)</h2>
            <div className="h-64 relative">
              {/* Y-axis price labels */}
              {(() => {
                const prices = priceHistory.map(h => h.medianPrice);
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);
                const formatPrice = (price: number) => {
                  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
                  if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`;
                  return price != null ? `$${price.toLocaleString()}` : 'N/A';
                };
                return (
                  <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-gray-500 pr-2" style={{ width: '50px' }}>
                    <span>{formatPrice(maxPrice)}</span>
                    <span>{formatPrice((maxPrice + minPrice) / 2)}</span>
                    <span>{formatPrice(minPrice)}</span>
                  </div>
                );
              })()}
              
              <div className="ml-12 h-full relative">
                <svg className="w-full h-full" viewBox="0 0 800 256" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  <line x1="0" y1="20" x2="800" y2="20" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="0" y1="128" x2="800" y2="128" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
                  <line x1="0" y1="236" x2="800" y2="236" stroke="#e5e7eb" strokeWidth="1" />
                  
                  {(() => {
                    const prices = priceHistory.map(h => h.medianPrice)
                    const minPrice = Math.min(...prices)
                    const maxPrice = Math.max(...prices)
                    const range = maxPrice - minPrice || 1
                    const xStep = 800 / (prices.length - 1 || 1)
                    
                    const linePath = prices.map((price, i) => {
                      const x = i * xStep
                      const y = 256 - ((price - minPrice) / range) * 216 - 20
                      return `${i === 0 ? 'M' : 'L'} ${x},${y}`
                    }).join(' ')
                    
                    const areaPath = `${linePath} L 800,256 L 0,256 Z`
                    
                    return (
                      <>
                        <path d={areaPath} fill="url(#priceGradient)" />
                        <path 
                          d={linePath} 
                          fill="none" 
                          stroke="rgb(59, 130, 246)"
                          strokeWidth="3" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                        {/* Data points */}
                        {prices.map((price, i) => {
                          const x = i * xStep;
                          const y = 256 - ((price - minPrice) / range) * 216 - 20;
                          return (
                            <circle 
                              key={i}
                              cx={x} 
                              cy={y} 
                              r="4" 
                              fill="white" 
                              stroke="rgb(59, 130, 246)" 
                              strokeWidth="2"
                            />
                          );
                        })}
                      </>
                    )
                  })()}
                </svg>
                
                {/* Year labels - showing years since data is annual Q4 */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600">
                  {priceHistory.map((item, index) => {
                    // Show every label if 6 or fewer years, otherwise show every other year
                    const showEvery = priceHistory.length <= 6 ? 1 : Math.ceil(priceHistory.length / 6);
                    return index % showEvery === 0 ? (
                      <div key={index}>
                        {new Date(item.month).getFullYear()}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Premium AI Features removed — keeping only data-driven views */}

        {/* Historical Price Chart */}
        <div className="mb-8">
          <HistoricalChart 
            priceHistory={priceHistory}
            hasProAccess={hasProAccess}
            suburbName={suburb.name}
          />
        </div>

        {/* Interactive Investment Report - Pro Feature */}
        <div className="mb-8">
          <InteractiveSuburbReport
            data={{
              name: suburb.name,
              state: suburb.state,
              postcode: suburb.postcode,
              medianPrice: suburb.medianPrice,
              growth12m: suburb.growth12m,
              growth6m: suburb.growth6m,
              growth3m: suburb.growth3m,
              rentalYield: suburb.rentalYield,
              investmentScore: suburb.investmentScore,
              population: suburb.population,
              medianAge: suburb.medianAge,
              medianIncome: suburb.medianIncome,
              floodRisk: suburb.floodRisk as 'low' | 'medium' | 'high' | null,
              bushfireRisk: suburb.bushfireRisk as 'low' | 'medium' | 'high' | null,
              crimeRisk: suburb.crimeRisk as 'low' | 'medium' | 'high' | null,
              analysis: suburb.aiAnalysis || 'Detailed analysis available in the property data tabs above.',
              lastUpdated: suburb.lastUpdated,
              priceHistory: priceHistory,
              similarSuburbs: suburb.similarSuburbs
            }}
            hasProAccess={hasProAccess}
          />
        </div>

        {/* Quick Investment Insights */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Investment Insights</h2>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>{suburb.name}</strong> shows {suburb.growth12m !== null && suburb.growth12m > 10 ? 'strong' : 'moderate'} growth 
              potential{suburb.growth12m !== null ? ` with a ${suburb.growth12m.toFixed(1)}% increase over the past 12 months` : ' (growth data: N/A)'}.
            </p>
            <p>
              {suburb.rentalYield !== null ? (
                <>
                  The rental yield of <strong>{suburb.rentalYield.toFixed(2)}%</strong> indicates{' '}
                  {suburb.rentalYield > 4 ? 'excellent' : 'good'} cash flow potential for investors.
                </>
              ) : (
                <>Rental yield data is currently <strong>N/A</strong>. Please check back for updates.</>
              )}
            </p>
            {suburb.investmentScore && (
              <p>
                With an investment score of <strong>{suburb.investmentScore.toFixed(1)}</strong>, this suburb 
                ranks {suburb.investmentScore > 85 ? 'highly' : 'well'} among Australian investment opportunities.
              </p>
            )}
          </div>
        </div>

        {/* AI growth/pressure/oversupply/demand/risk sections removed */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8 border border-red-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white rounded-lg shadow-md">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Environmental Risk Profile</h2>
                <p className="text-sm text-red-700">Climate & Safety Assessment</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Flood Risk */}
              <DetailedRiskCard
                type="flood"
                level={getRiskLevel(suburb.floodRisk)}
                description="Assessment of flood vulnerability based on location, elevation, and proximity to waterways."
                details={[
                  'Historical flood data analysis',
                  'Topographical assessment',
                  'Drainage infrastructure review',
                  'Climate projection modeling'
                ]}
                sourceLink="http://www.bom.gov.au/water/floods/"
              />
              
              {/* Bushfire Risk */}
              <DetailedRiskCard
                type="bushfire"
                level={getRiskLevel(suburb.bushfireRisk)}
                description="Evaluation of bushfire exposure considering vegetation, terrain, and fire history."
                details={[
                  'BAL (Bushfire Attack Level) zones',
                  'Vegetation density mapping',
                  'Historical fire incident data',
                  'Emergency access routes'
                ]}
                sourceLink="https://www.rfs.nsw.gov.au/plan-and-prepare"
              />
              
              {/* Crime Risk */}
              <DetailedRiskCard
                type="crime"
                level={getRiskLevel(suburb.crimeRate)}
                description="Safety analysis based on reported crime statistics and community safety indicators."
                details={[
                  'Reported crime incidents',
                  'Crime trend analysis',
                  'Police presence & response',
                  'Community safety programs'
                ]}
                sourceLink="https://www.bocsar.nsw.gov.au/"
              />
            </div>
            
            <div className="mt-6 bg-white/80 backdrop-blur rounded-lg p-4 border border-orange-200">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> Risk assessments are based on available data and statistical models. 
                Always conduct thorough due diligence including council checks, building reports, and insurance quotes 
                before making property decisions. Environmental risks can change over time due to climate patterns, 
                urban development, and policy changes.
              </p>
            </div>
          </div>
        </div>

        {/* Demographics - ABS Census 2021 Data */}
        {suburb.population && (
          <div className="mb-8">
            <DemographicsPanel
              population={suburb.population}
              populationGrowth={0}
              medianAge={suburb.medianAge || 35}
              medianIncome={suburb.medianIncome || 75000}
              medianHouseholdSize={suburb.averageHouseholdSize || 2.6}
              renterPercentage={suburb.renterPercentage || 30}
              ownerOccupierPercentage={suburb.ownerOccupierPercentage || 65}
              employmentRate={suburb.unemploymentRate ? (100 - suburb.unemploymentRate) : 95}
              bachelorDegree={suburb.bachelorDegree || 25}
              familiesPercent={70}
              ageDistribution={suburb.ageDistribution}
            />
          </div>
        )}

        {/* Suburb Rankings */}
        {ranking && (
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              National Rankings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">National Rank</p>
                <p className="text-3xl font-bold text-blue-600">
                  #{ranking.nationalRank}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  out of {ranking?.totalSuburbs?.toLocaleString() || '0'} suburbs
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">State Rank ({suburb.state})</p>
                <p className="text-3xl font-bold text-indigo-600">
                  #{ranking.stateRank}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  out of {ranking.totalInState} suburbs in {suburb.state}
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                <strong className="text-blue-600">Performance Category:</strong> {ranking.category}
              </p>
            </div>
          </div>
        )}

        {/* Similar Suburbs */}
        {similarSuburbs.length > 0 && (
          <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Home className="h-6 w-6 text-blue-600" />
              Similar Suburbs You Might Like
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Based on price range, growth patterns, and investment metrics
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {similarSuburbs.map((similar, idx) => (
                <Link
                  key={idx}
                  href={`/suburb/${encodeURIComponent(similar.name)}?state=${similar.state}&postcode=${similar.postcode}`}
                  className="block p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{similar.name}</h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {similar.state} {similar.postcode}
                      </p>
                    </div>
                    <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                      {similar.similarityScore}% match
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Median Price</span>
                      <span className="font-bold text-gray-900">
                        ${(similar.medianPrice / 1000).toFixed(0)}k
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">vs {suburb.name}</span>
                      <span className={`font-bold ${
                        parseFloat(similar.priceDifferencePercent) > 0 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`}>
                        {parseFloat(similar.priceDifferencePercent) > 0 ? '+' : ''}
                        {similar.priceDifferencePercent}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Growth</span>
                      <span className={`font-bold ${
                        (similar.growth12m ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {similar.growth12m !== null ? `${similar.growth12m >= 0 ? '+' : ''}${similar.growth12m.toFixed(1)}%` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Yield</span>
                      <span className="font-bold text-gray-900">
                        {similar.rentalYield !== null ? `${similar.rentalYield.toFixed(2)}%` : 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Investment Score</span>
                      <span className="text-sm font-bold text-blue-600">
                        {similar.investmentScore}/100
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Data Attribution Footer */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200 shadow-md">
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-lg ${
              suburb.dataQuality === 'high' ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <Calendar className="h-5 w-5 text-gray-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Data Source & Quality</h3>
              <p className="text-sm text-gray-600 mb-2">
                This suburb analysis is powered by <strong>official Australian government datasets</strong> covering property sales, rental markets, 
                environmental risks, crime statistics, schools, transport, and demographics across Australia.
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span>Primary source: <strong>Australian Government Data</strong></span>
                <span>•</span>
                <span>Data quality: <strong className={suburb.dataQuality === 'high' ? 'text-green-600' : 'text-yellow-600'}>
                  {suburb.dataQuality === 'high' ? 'VERIFIED' : 'ESTIMATED'}
                </strong></span>
                <span>•</span>
                <span>Last updated: {new Date(suburb.lastUpdated).toLocaleDateString('en-AU')}</span>
                <span>•</span>
                <span>Update frequency: {suburb.updateFrequency}</span>
              </div>
              {suburb.dataQuality === 'medium' && (
                <div className="text-xs text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <strong>Note:</strong> This suburb uses estimated data based on state averages and ABS Census data. 
                  For the most accurate property valuations, consult local real estate agents.
                </div>
              )}
              {suburb.dataQuality === 'high' && (
                <div className="text-xs text-gray-600 bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                  <strong>Official Data:</strong> This suburb uses high-quality data from official government sources, 
                  ensuring accuracy and reliability for investment decisions.
                </div>
              )}
              <Link 
                href="/data-sources" 
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-semibold"
              >
                <Shield className="h-4 w-4" />
                View all government data sources →
              </Link>
            </div>

            {/* Investment Disclaimer */}
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <h4 className="font-semibold mb-2">Important Legal Disclaimer</h4>
                  <p className="mb-2">
                    <strong>This information is for educational and informational purposes only.</strong> It does not constitute financial advice, investment advice, tax advice, legal advice, or any other form of professional financial planning or recommendation.
                  </p>
                  <p className="mb-2">
                    Property investment involves significant financial risk, including the potential loss of your entire investment. Past performance is not indicative of future results. Market conditions can change rapidly and unexpectedly.
                  </p>
                  <p className="mb-2">
                    You should conduct your own independent research, analysis, and due diligence. Always seek advice from qualified financial advisors, accountants, lawyers, and other professional advisors before making any investment decisions.
                  </p>
                  <p className="text-xs text-yellow-700 mt-3">
                    SuburbIntel is not licensed by ASIC (Australian Securities and Investments Commission) and does not provide financial product advice. All investments carry risk of loss.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  )
}
