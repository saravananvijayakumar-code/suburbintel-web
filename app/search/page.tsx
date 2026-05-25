'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Loader2, MapPin, TrendingUp, DollarSign, Filter, SlidersHorizontal, BarChart3, ArrowUpDown, Grid, List, Bookmark, X, Zap, Home as HomeIcon, Sparkles, Lock } from 'lucide-react'
import DashboardLayout from '@/app/components/DashboardLayout'
import { RiskSummary, type RiskLevel } from '@/components/ui/RiskBadge'

interface SuburbResult {
  id: string
  name: string
  state: string
  postcode: string
  medianPrice: number
  weeklyRent: number | null
  rentalYield: number | null
  growth12m: number | null
  growth6m: number | null
  growth3m: number | null
  investmentScore: number | null
  lastUpdated: string
  dataSource: string
  dataQuality: string
  updateFrequency: string
  // Risk data (will be populated from API or mock data)
  floodRisk?: RiskLevel
  bushfireRisk?: RiskLevel
  crimeRisk?: RiskLevel
}

export default function SearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SuburbResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // New feature states
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'growth-desc' | 'yield-desc'>('relevance')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedForCompare, setSelectedForCompare] = useState<SuburbResult[]>([])
  const [savedSearches, setSavedSearches] = useState<string[]>([])
  
  // AI insights removed
  
  // Filter states
  const [filters, setFilters] = useState({
    stateFilter: 'all',
    minPrice: '',
    maxPrice: '',
    minGrowth: '',
    maxGrowth: '',
    minYield: '',
    maxYield: '',
    dataQuality: 'all',
    // Premium filters
    premiumFilters: {
      highYieldLowRisk: false,
      growthTransport: false,
      undervalued: false,
      lowRiskOnly: false,
    }
  })

  // Load saved searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedSearches')
      if (saved) {
        setSavedSearches(JSON.parse(saved))
      }
    }
  }, [])

  // Check for state filter from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const stateParam = params.get('state')
    const queryParam = params.get('query')
    
    if (stateParam) {
      // Set the state filter
      setFilters(prev => ({ ...prev, stateFilter: stateParam }))
      
      // If coming from insights (top-suburbs query), fetch all suburbs for that state
      if (queryParam === 'top-suburbs') {
        performSearch('', stateParam, true) // Empty query, state filter, topSuburbsMode
        setSearchQuery(`Top ${stateParam} Suburbs`)
      } else {
        // Perform search with the state filter
        performSearch(stateParam, stateParam)
        setSearchQuery(stateParam)
      }
    }
  }, [])

  // Auto-search as user types (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedQuery = searchQuery.trim()
      if (trimmedQuery.length >= 2) {
        performSearch(trimmedQuery)
      } else {
        setResults([])
        setShowDropdown(false)
      }
    }, 300) // Wait 300ms after user stops typing

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Helper function to generate risk levels based on suburb characteristics
  const generateRiskData = (suburb: any): { floodRisk: RiskLevel, bushfireRisk: RiskLevel, crimeRisk: RiskLevel } => {
    // This would normally come from the API, but we'll generate based on patterns for now
    const name = suburb.name.toLowerCase()
    const state = suburb.state.toLowerCase()
    
    // Flood risk heuristics (coastal, riverside = higher risk)
    let floodRisk: RiskLevel = 'low'
    if (name.includes('river') || name.includes('creek') || name.includes('bay') || name.includes('beach')) {
      floodRisk = Math.random() > 0.5 ? 'medium' : 'high'
    } else if (name.includes('valley') || name.includes('flat')) {
      floodRisk = 'medium'
    }
    
    // Bushfire risk heuristics (bushland, hills = higher risk)
    let bushfireRisk: RiskLevel = 'low'
    if (name.includes('bush') || name.includes('forest') || name.includes('ridge') || name.includes('hill')) {
      bushfireRisk = Math.random() > 0.5 ? 'medium' : 'high'
    } else if (name.includes('wood') || name.includes('tree') || name.includes('park')) {
      bushfireRisk = 'medium'
    }
    
    // Crime risk heuristics (based on property price - inverse correlation)
    let crimeRisk: RiskLevel = 'low'
    if (suburb.medianPrice < 400000) {
      crimeRisk = 'medium'
    } else if (suburb.medianPrice < 300000) {
      crimeRisk = Math.random() > 0.7 ? 'high' : 'medium'
    }
    
    return { floodRisk, bushfireRisk, crimeRisk }
  }

  const fetchGrowthInsight = async (_suburb: SuburbResult) => {
    // AI insights removed
  }

  const fetchRentPressure = async (_suburb: SuburbResult) => {
    // AI insights removed
  }

  const performSearch = async (query: string, stateOverride?: string, topSuburbsMode?: boolean) => {
    setLoading(true)
    setError(null)

    try {
      let url = ''
      
      // If in top suburbs mode, use a different API endpoint
      if (topSuburbsMode && stateOverride) {
        url = `/api/suburbs/top?state=${stateOverride}&limit=10&sortBy=investmentScore`
      } else {
        url = `/api/suburbs/search?q=${encodeURIComponent(query)}&limit=50`
        
        // Add state filter
        const stateToUse = stateOverride || filters.stateFilter
        if (stateToUse !== 'all') {
          url += `&state=${stateToUse}`
        }
      }
      
      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        let filtered = data.suburbs || []
        
        // Apply client-side filters
        if (filters.minPrice) {
          filtered = filtered.filter((s: SuburbResult) => s.medianPrice >= parseFloat(filters.minPrice))
        }
        if (filters.maxPrice) {
          filtered = filtered.filter((s: SuburbResult) => s.medianPrice <= parseFloat(filters.maxPrice))
        }
        if (filters.minGrowth) {
          filtered = filtered.filter((s: SuburbResult) => (s.growth12m || 0) >= parseFloat(filters.minGrowth))
        }
        if (filters.maxGrowth) {
          filtered = filtered.filter((s: SuburbResult) => (s.growth12m || 0) <= parseFloat(filters.maxGrowth))
        }
        if (filters.minYield) {
          filtered = filtered.filter((s: SuburbResult) => (s.rentalYield || 0) >= parseFloat(filters.minYield))
        }
        if (filters.maxYield) {
          filtered = filtered.filter((s: SuburbResult) => (s.rentalYield || 0) <= parseFloat(filters.maxYield))
        }
        if (filters.dataQuality !== 'all') {
          filtered = filtered.filter((s: SuburbResult) => s.dataQuality === filters.dataQuality)
        }
        
        // Apply sorting
        filtered = applySorting(filtered)
        
        // Enrich results with risk data
        filtered = filtered.map((suburb: SuburbResult) => ({
          ...suburb,
          ...generateRiskData(suburb)
        }))
        
        setResults(filtered)
        setShowDropdown(true)
        setHighlightedIndex(-1) // Reset highlighted index when results change
      } else {
        setError(data.error || 'Failed to search suburbs')
        setShowDropdown(false)
      }
    } catch (error) {
      console.error('Search error:', error)
      setError('An error occurred while searching')
      setShowDropdown(false)
    } finally {
      setLoading(false)
    }
  }
  
  // Apply sorting to results
  const applySorting = (data: SuburbResult[]) => {
    const sorted = [...data]
    
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.medianPrice - b.medianPrice)
      case 'price-desc':
        return sorted.sort((a, b) => b.medianPrice - a.medianPrice)
      case 'growth-desc':
        return sorted.sort((a, b) => (b.growth12m || 0) - (a.growth12m || 0))
      case 'yield-desc':
        return sorted.sort((a, b) => (b.rentalYield || 0) - (a.rentalYield || 0))
      default:
        return sorted
    }
  }
  
  // Save current search
  const saveSearch = () => {
    if (!searchQuery.trim()) return
    
    const updated = [...savedSearches]
    if (!updated.includes(searchQuery)) {
      updated.push(searchQuery)
      setSavedSearches(updated)
      if (typeof window !== 'undefined') {
        localStorage.setItem('savedSearches', JSON.stringify(updated))
      }
    }
  }
  
  // Remove saved search
  const removeSavedSearch = (search: string) => {
    const updated = savedSearches.filter(s => s !== search)
    setSavedSearches(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedSearches', JSON.stringify(updated))
    }
  }
  
  // Toggle suburb selection for comparison
  const toggleCompareSelection = (suburb: SuburbResult) => {
    if (selectedForCompare.find(s => s.id === suburb.id)) {
      setSelectedForCompare(selectedForCompare.filter(s => s.id !== suburb.id))
    } else if (selectedForCompare.length < 4) {
      setSelectedForCompare([...selectedForCompare, suburb])
    }
  }
  
  // Navigate to compare page with selected suburbs
  const goToCompare = () => {
    const names = selectedForCompare.map(s => `${s.name},${s.state}`).join(';')
    router.push(`/compare?suburbs=${encodeURIComponent(names)}`)
  }
  
  // Apply sorting when sortBy changes
  useEffect(() => {
    if (results.length > 0) {
      setResults(applySorting(results))
    }
  }, [sortBy])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    await performSearch(searchQuery)
  }

  const selectSuburb = (suburb: SuburbResult) => {
    setShowDropdown(false)
    setHighlightedIndex(-1)
    // Use suburb name as-is (API handles case-insensitive matching)
    // Include state AND postcode for disambiguation (e.g., Richmond NSW vs Richmond VIC)
    router.push(`/suburb/${encodeURIComponent(suburb.name)}?state=${suburb.state}&postcode=${suburb.postcode}`)
  }

  // Handle keyboard navigation in search
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || results.length === 0) return
    
    const visibleResults = results.slice(0, 10) // Match the displayed results

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < visibleResults.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0)
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < visibleResults.length) {
          selectSuburb(visibleResults[highlightedIndex])
        }
        break
      case 'Escape':
        setShowDropdown(false)
        setHighlightedIndex(-1)
        break
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold">Search Suburbs</h1>
              </div>
              <p className="text-indigo-100 text-lg max-w-2xl">
                Discover investment opportunities across thousands of Australian suburbs with powerful filters and AI-powered insights
              </p>
              
              {/* Quick Stats */}
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <MapPin className="h-5 w-5 text-indigo-200" />
                  <span className="text-sm font-medium">15,000+ Suburbs</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <TrendingUp className="h-5 w-5 text-green-300" />
                  <span className="text-sm font-medium">Real-time Data</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <Sparkles className="h-5 w-5 text-yellow-300" />
                  <span className="text-sm font-medium">AI Insights</span>
                </div>
              </div>
            </div>
            {selectedForCompare.length > 0 && (
              <button
                onClick={goToCompare}
                className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl font-semibold"
              >
                <BarChart3 className="h-5 w-5" />
                Compare Selected ({selectedForCompare.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 sm:px-6 lg:px-8 relative z-10">
        {/* Main Search Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <form onSubmit={handleSearch}>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[300px] relative" ref={dropdownRef}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400 z-10" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    onFocus={() => results.length > 0 && setShowDropdown(true)}
                    placeholder="Start typing suburb name..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all text-lg"
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={showDropdown}
                    aria-haspopup="listbox"
                    aria-autocomplete="list"
                  />
                  {loading && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-indigo-600" />
                  )}
                </div>

                {/* Autocomplete Dropdown */}
                {showDropdown && results.length > 0 && (
                  <div 
                    className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-2xl max-h-[400px] overflow-y-auto"
                    role="listbox"
                  >
                    <div className="p-2 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
                      <span className="text-xs font-medium text-indigo-600">
                        {results.length} suburbs found - Use ↑↓ arrows to navigate, Enter to select
                      </span>
                    </div>
                    {results.slice(0, 10).map((suburb, index) => {
                      const isHighlighted = index === highlightedIndex
                      return (
                        <div
                          key={`${suburb.name}-${suburb.state}-${index}`}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            selectSuburb(suburb)
                          }}
                          role="option"
                          aria-selected={isHighlighted}
                          className={`px-4 py-4 cursor-pointer border-b border-gray-50 last:border-b-0 transition-all group ${
                            isHighlighted 
                              ? 'bg-gradient-to-r from-indigo-100 to-purple-100' 
                              : 'hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
                          }`}
                        >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{suburb.name}</div>
                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {suburb.state} {suburb.postcode}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{formatCurrency(suburb.medianPrice)}</div>
                            <div className={`text-sm font-medium ${suburb.growth12m !== null && suburb.growth12m >= 0 ? 'text-green-600' : suburb.growth12m !== null ? 'text-red-600' : 'text-gray-400'}`}>
                              {suburb.growth12m !== null ? `${suburb.growth12m >= 0 ? '↑' : '↓'} ${Math.abs(suburb.growth12m).toFixed(1)}%` : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-4 rounded-xl font-medium transition-all ${
                  showFilters 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <SlidersHorizontal className="h-5 w-5" />
                Filters
                {(filters.stateFilter !== 'all' || filters.minPrice || filters.maxPrice) && (
                  <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    Active
                  </span>
                )}
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={saveSearch}
                  className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-2 border-amber-200 rounded-xl hover:from-amber-100 hover:to-orange-100 transition-all font-medium"
                >
                  <Bookmark className="h-5 w-5" />
                  Save
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-amber-500" />
              Saved Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {savedSearches.map((search, idx) => (
                <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 rounded-lg text-sm border border-amber-200 hover:shadow-sm transition-all">
                  <button
                    onClick={() => {
                      setSearchQuery(search)
                      performSearch(search)
                    }}
                    className="hover:text-amber-600 font-medium"
                  >
                    {search}
                  </button>
                  <button
                    onClick={() => removeSavedSearch(search)}
                    className="hover:text-red-600 p-1 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white border-2 border-indigo-100 rounded-xl p-6 mb-6 shadow-lg">
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-gray-900">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <SlidersHorizontal className="h-5 w-5 text-indigo-600" />
              </div>
              Advanced Filters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <select
                  value={filters.stateFilter}
                  onChange={(e) => setFilters({...filters, stateFilter: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 bg-gray-50 transition-all"
                >
                  <option value="all">All States</option>
                  <option value="NSW">New South Wales</option>
                  <option value="VIC">Victoria</option>
                  <option value="QLD">Queensland</option>
                  <option value="WA">Western Australia</option>
                  <option value="SA">South Australia</option>
                  <option value="TAS">Tasmania</option>
                  <option value="NT">Northern Territory</option>
                  <option value="ACT">ACT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Min Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    placeholder="e.g., 500,000"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 bg-gray-50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    placeholder="e.g., 1,000,000"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 bg-gray-50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Min Growth (%)</label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 5"
                    value={filters.minGrowth}
                    onChange={(e) => setFilters({...filters, minGrowth: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 bg-gray-50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Min Yield (%)</label>
                <div className="relative">
                  <BarChart3 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 3"
                    value={filters.minYield}
                    onChange={(e) => setFilters({...filters, minYield: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 bg-gray-50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Data Quality</label>
                <select
                  value={filters.dataQuality}
                  onChange={(e) => setFilters({...filters, dataQuality: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 bg-gray-50 transition-all"
                >
                  <option value="all">All Quality</option>
                  <option value="high">High (Real Data)</option>
                  <option value="low">Low (Estimates)</option>
                </select>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                Premium Filters
                <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full font-medium">
                  PRO
                </span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl cursor-pointer hover:from-purple-100 hover:to-pink-100 transition-all">
                  <input
                    type="checkbox"
                    checked={filters.premiumFilters.highYieldLowRisk}
                    onChange={(e) => setFilters({
                      ...filters,
                      premiumFilters: {
                        ...filters.premiumFilters,
                        highYieldLowRisk: e.target.checked
                      }
                    })}
                    className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">High Yield + Low Risk</div>
                    <div className="text-sm text-gray-600">Yield &gt; 5% + Low flood/bushfire risk</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all">
                  <input
                    type="checkbox"
                    checked={filters.premiumFilters.growthTransport}
                    onChange={(e) => setFilters({
                      ...filters,
                      premiumFilters: {
                        ...filters.premiumFilters,
                        growthTransport: e.target.checked
                      }
                    })}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Growth + Transport</div>
                    <div className="text-sm text-gray-600">Growth &gt; 10% + Walkability &gt; 80</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl cursor-pointer hover:from-emerald-100 hover:to-teal-100 transition-all">
                  <input
                    type="checkbox"
                    checked={filters.premiumFilters.undervalued}
                    onChange={(e) => setFilters({
                      ...filters,
                      premiumFilters: {
                        ...filters.premiumFilters,
                        undervalued: e.target.checked
                      }
                    })}
                    className="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Undervalued Gems</div>
                    <div className="text-sm text-gray-600">High growth potential vs current price</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl cursor-pointer hover:from-amber-100 hover:to-orange-100 transition-all">
                  <input
                    type="checkbox"
                    checked={filters.premiumFilters.lowRiskOnly}
                    onChange={(e) => setFilters({
                      ...filters,
                      premiumFilters: {
                        ...filters.premiumFilters,
                        lowRiskOnly: e.target.checked
                      }
                    })}
                    className="w-5 h-5 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Low Risk Only</div>
                    <div className="text-sm text-gray-600">Exclude high-risk suburbs</div>
                  </div>
                </label>
              </div>
              <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-semibold text-gray-900">Premium Filters Require Pro Subscription</div>
                    <div className="text-sm text-gray-600">Upgrade to unlock advanced filtering and AI-powered suburb matching</div>
                  </div>
                  <Link
                    href="/pricing"
                    className="ml-auto px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all text-sm"
                  >
                    Upgrade
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setFilters({stateFilter: 'all', minPrice: '', maxPrice: '', minGrowth: '', maxGrowth: '', minYield: '', maxYield: '', dataQuality: 'all'})}
                className="px-5 py-2.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
              >
                Clear All
              </button>
              <button
                onClick={() => performSearch(searchQuery || 'VIC')}
                className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-5 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <X className="h-5 w-5 text-red-600" />
            </div>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                Found {results.length} suburb{results.length !== 1 ? 's' : ''}
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600">Sort:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 bg-gray-50 font-medium"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="growth-desc">Highest Growth</option>
                    <option value="yield-desc">Highest Yield</option>
                  </select>
                </div>
                <div className="flex items-center gap-1 border-2 border-gray-200 rounded-lg p-1 bg-gray-50">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className={viewMode === 'grid' ? 'grid gap-5 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
              {results.map((suburb) => {
                const isSelected = selectedForCompare.some(s => s.id === suburb.id)
                return (
                  <div
                    key={suburb.id}
                    className={`bg-white border-2 rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer group ${
                      isSelected ? 'border-indigo-500 bg-indigo-50/50 shadow-lg shadow-indigo-100' : 'border-gray-100 hover:border-indigo-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        onClick={() => selectSuburb(suburb)}
                        className="flex-1"
                      >
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {suburb.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <MapPin className="h-4 w-4 text-indigo-400" />
                          {suburb.state} {suburb.postcode}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleCompareSelection(suburb)
                        }}
                        disabled={!isSelected && selectedForCompare.length >= 4}
                        className={`ml-2 px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                            : selectedForCompare.length >= 4
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                        }`}
                      >
                        {isSelected ? '✓ Selected' : '+ Compare'}
                      </button>
                    </div>

                    <div 
                      onClick={() => selectSuburb(suburb)}
                      className="space-y-3"
                    >
                      {/* Median Price */}
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl">
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">Median Price</span>
                        </div>
                        <span className="font-bold text-lg text-gray-900">
                          {formatCurrency(suburb.medianPrice)}
                        </span>
                      </div>

                      {/* Growth */}
                      {suburb.growth12m !== null && suburb.growth12m !== undefined && (
                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl">
                          <div className="flex items-center gap-2 text-gray-600">
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium">12m Growth</span>
                          </div>
                          <span
                            className={`font-bold text-lg px-3 py-1 rounded-full ${suburb.growth12m >= 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}
                          >
                            {suburb.growth12m >= 0 ? '↑' : '↓'}
                            {Math.abs(suburb.growth12m).toFixed(1)}%
                          </span>
                        </div>
                      )}

                      {/* Rental Yield */}
                      {suburb.rentalYield !== null && suburb.rentalYield !== undefined && (
                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl">
                          <div className="flex items-center gap-2 text-gray-600">
                            <HomeIcon className="h-4 w-4 text-purple-500" />
                            <span className="text-sm font-medium">Rental Yield</span>
                          </div>
                          <span className="font-bold text-lg text-purple-700">
                            {suburb.rentalYield.toFixed(1)}%
                          </span>
                        </div>
                      )}
                      
                      {/* Investment Score */}
                      {suburb.investmentScore !== null && suburb.investmentScore !== undefined && (
                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                          <div className="flex items-center gap-2 text-gray-600">
                            <BarChart3 className="h-4 w-4 text-indigo-500" />
                            <span className="text-sm font-medium">Investment Score</span>
                          </div>
                          <span className="font-bold text-lg text-indigo-700">
                            {suburb.investmentScore.toFixed(0)}/100
                          </span>
                        </div>
                      )}

                      {/* Risk Indicators */}
                      {(suburb.floodRisk || suburb.bushfireRisk || suburb.crimeRisk) && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                          <div className="text-xs font-semibold text-gray-600 mb-2">Risk Profile</div>
                          <RiskSummary 
                            flood={suburb.floodRisk || 'unknown'}
                            bushfire={suburb.bushfireRisk || 'unknown'}
                            crime={suburb.crimeRisk || 'unknown'}
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                          suburb.dataQuality === 'high' 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}>
                          {suburb.dataQuality === 'high' ? '✓ Verified' : '⚠ Estimated'} • {suburb.dataSource}
                        </span>
                      </div>
                      
                      {/* AI Insight Buttons - Pro Feature */}
                      <div className="flex gap-2">
                        <Link
                          href="/pricing"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all shadow-sm cursor-pointer"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Growth AI [Pro]
                        </Link>
                        <Link
                          href="/pricing"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all shadow-sm cursor-pointer"
                        >
                          <Zap className="h-3.5 w-3.5" />
                          Rent AI [Pro]
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* All results shown — no paywall */}

            {/* AI insight tooltip removed */}
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && searchQuery && !error && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try searching with a different suburb name, postcode, or adjust your filters
            </p>
          </div>
        )}

        {/* Initial Empty State */}
        {!loading && results.length === 0 && !searchQuery && !error && (
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto">
              <div className="p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <MapPin className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Start Your Search</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Type a suburb name or postcode above to discover investment opportunities across Australia
              </p>
              
              {/* Popular Searches */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Popular Searches</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Parramatta', 'Richmond'].map((suburb) => (
                    <button
                      key={suburb}
                      onClick={() => {
                        setSearchQuery(suburb)
                        performSearch(suburb)
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 transition-all font-medium border border-gray-200 hover:border-indigo-200"
                    >
                      {suburb}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>
  )
}
