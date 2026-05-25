'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, TrendingUp, TrendingDown, DollarSign, Home, MapPin, Users, BarChart3, Download, X, AlertCircle, Filter, FileText, Calculator } from 'lucide-react'
import { useSubscription } from '@/contexts/SubscriptionContext'
import UpgradeModal from '@/components/UpgradeModal'
import DashboardLayout from '@/app/components/DashboardLayout'

interface SuburbData {
  id?: string
  name: string
  state: string
  medianPrice: number
  medianUnitPrice?: number | null  // Separate unit/apartment price
  growth12m: number
  growth6m?: number
  growth3m?: number
  weeklyRent: number
  rentalYield: number
  postcode: string
  investmentScore?: number
  dataSource?: string
  dataQuality?: string
  lastUpdated?: string
  // Demographics
  population?: number
  medianAge?: number
  medianIncome?: number
  ownerOccupierPercentage?: number
  renterPercentage?: number
  unemploymentRate?: number
  // Livability
  walkabilityScore?: number
  publicTransportScore?: number
  schoolQualityScore?: number
  crimeRateIndex?: number
  // Environmental
  bushfireRisk?: string
  floodRisk?: string
}

interface ComparisonResult {
  suburb: SuburbData
  metrics: {
    priceAdvantage: string
    growthAdvantage: string
    yieldAdvantage: string
  }
}

export default function ComparePage() {
  const router = useRouter()
  const { subscriptionTier, getComparisonLimit, canAccess } = useSubscription()
  const [suburbs, setSuburbs] = useState<SuburbData[]>([])
  const [selectedSuburbs, setSelectedSuburbs] = useState<SuburbData[]>([])
  const [comparison, setComparison] = useState<ComparisonResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  
  // Autocomplete states
  const [suburbSuggestions, setSuburbSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const autocompleteRef = useRef<HTMLDivElement>(null)
  
  // Advanced filter states
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minGrowth: '',
    maxGrowth: '',
    minYield: '',
    maxYield: '',
    stateFilter: 'all'
  })
  
  // Mortgage calculator state
  const [showCalculator, setShowCalculator] = useState(false)
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('6.5')
  const [loanTerm, setLoanTerm] = useState('30')

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    // Pre-select from URL params if available
    const params = new URLSearchParams(window.location.search)
    const suburbsParam = params.get('suburbs')
    if (suburbsParam) {
      const suburbNames = suburbsParam.split(',')
      // Fetch and set these suburbs
      fetchSpecificSuburbs(suburbNames)
    }
  }, [])

  const fetchSpecificSuburbs = async (names: string[]) => {
    try {
      const promises = names.map(name => 
        fetch(`/api/suburbs/search?q=${encodeURIComponent(name)}&limit=1`)
          .then(res => res.json())
          .then(data => data.suburbs?.[0])
      )
      const results = await Promise.all(promises)
      const validSuburbs = results.filter(Boolean)
      if (validSuburbs.length > 0) {
        setSelectedSuburbs(validSuburbs)
      }
    } catch (error) {
      console.error('Failed to fetch specific suburbs:', error)
    }
  }

  // Search suburbs for autocomplete with filters
  const searchSuburbs = async (query: string) => {
    if (query.length < 2) {
      setSuburbSuggestions([])
      return
    }

    try {
      let url = `/api/suburbs/search?q=${encodeURIComponent(query)}&limit=50`
      if (filters.stateFilter !== 'all') {
        url += `&state=${filters.stateFilter}`
      }
      
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        let filtered = data.suburbs || []
        
        // Apply price filters
        if (filters.minPrice) {
          filtered = filtered.filter((s: any) => s.medianPrice >= parseFloat(filters.minPrice))
        }
        if (filters.maxPrice) {
          filtered = filtered.filter((s: any) => s.medianPrice <= parseFloat(filters.maxPrice))
        }
        
        // Apply growth filters
        if (filters.minGrowth) {
          filtered = filtered.filter((s: any) => (s.growth12m || 0) >= parseFloat(filters.minGrowth))
        }
        if (filters.maxGrowth) {
          filtered = filtered.filter((s: any) => (s.growth12m || 0) <= parseFloat(filters.maxGrowth))
        }
        
        // Apply yield filters
        if (filters.minYield) {
          filtered = filtered.filter((s: any) => (s.rentalYield || 0) >= parseFloat(filters.minYield))
        }
        if (filters.maxYield) {
          filtered = filtered.filter((s: any) => (s.rentalYield || 0) <= parseFloat(filters.maxYield))
        }
        
        setSuburbSuggestions(filtered.slice(0, 10))
      }
    } catch (error) {
      console.error('Failed to search suburbs:', error)
      setSuburbSuggestions([])
    }
  }

  // Handle search input
  const handleSearchInput = (value: string) => {
    setSearchTerm(value)
    searchSuburbs(value)
    setShowSuggestions(true)
    setHighlightedIndex(-1) // Reset highlighted index when search changes
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suburbSuggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < suburbSuggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0)
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < suburbSuggestions.length) {
          const suburb = suburbSuggestions[highlightedIndex]
          const isSelected = selectedSuburbs.find(s => s.name === suburb.name && s.state === suburb.state)
          if (!isSelected) {
            selectSuburb(suburb)
          }
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setHighlightedIndex(-1)
        break
    }
  }

  // Select suburb from suggestions
  const selectSuburb = (suburb: any) => {
    const comparisonLimit = getComparisonLimit()
    
    // Check if user has reached their comparison limit
    if (comparisonLimit !== -1 && selectedSuburbs.length >= comparisonLimit) {
      setShowUpgradeModal(true)
      return
    }
    
    if (selectedSuburbs.length < 4 && !selectedSuburbs.find(s => s.name === suburb.name && s.state === suburb.state)) {
      setSelectedSuburbs([...selectedSuburbs, suburb])
    }
    setSearchTerm('')
    setShowSuggestions(false)
    setSuburbSuggestions([])
  }

  // Remove suburb from selection
  const removeSuburb = (index: number) => {
    setSelectedSuburbs(selectedSuburbs.filter((_, i) => i !== index))
  }

  const compareSuburbs = async () => {
    if (selectedSuburbs.length < 2) {
      setComparison(null)
      return
    }
    
    setLoading(true)
    setError(null)
    try {
      // Fetch detailed data for each suburb
      const suburbsData = await Promise.all(
        selectedSuburbs.map(async (suburb) => {
          try {
            const res = await fetch(`/api/suburbs/search?q=${encodeURIComponent(suburb.name)}&state=${suburb.state}`)
            if (!res.ok) {
              console.error(`Failed to fetch ${suburb.name}: ${res.status}`)
              return suburb // Return original if fetch fails
            }
            const data = await res.json()
            
            // Debug: Log search results
            console.log(`Search results for "${suburb.name}, ${suburb.state}":`, data.suburbs?.map((s: any) => `${s.name}, ${s.state}`))
            
            // Find exact name match, not just first result
            const exactMatch = data.suburbs?.find((s: any) => 
              s.name.toLowerCase() === suburb.name.toLowerCase() && 
              s.state === suburb.state
            )
            
            console.log(`Exact match for "${suburb.name}":`, exactMatch ? `${exactMatch.name}, ${exactMatch.state}` : 'NOT FOUND')
            
            return exactMatch || data.suburbs?.[0] || suburb
          } catch (err) {
            console.error(`Error fetching ${suburb.name}:`, err)
            return suburb // Return original if error
          }
        })
      )

      // Filter out any null/undefined suburbs
      const validSuburbs = suburbsData.filter(s => s && s.name)

      if (validSuburbs.length < 2) {
        setError('Could not load suburb data for comparison')
        return
      }

      // Create comparison with metrics
      const comparisonData = validSuburbs.map(suburb => ({
        suburb,
        metrics: {
          priceAdvantage: '',
          growthAdvantage: '',
          yieldAdvantage: ''
        }
      }))

      setComparison(comparisonData)
    } catch (error) {
      console.error('Failed to compare suburbs:', error)
      setError('An error occurred while comparing suburbs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedSuburbs.length >= 2) {
      compareSuburbs().catch(err => {
        console.error('Comparison failed:', err)
        setError(`Comparison error: ${err.message || 'Unknown error'}`)
      })
    } else {
      setComparison(null)
    }
  }, [selectedSuburbs])

  // Calculate mortgage repayments
  const calculateMortgage = (price: number) => {
    const principal = price * 0.8 // 20% deposit
    const monthlyRate = parseFloat(interestRate) / 100 / 12
    const months = parseInt(loanTerm) * 12
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    const weeklyPayment = (monthlyPayment * 12) / 52
    
    return {
      deposit: price * 0.2,
      loanAmount: principal,
      monthlyPayment: monthlyPayment,
      weeklyPayment: weeklyPayment,
      totalRepayment: monthlyPayment * months,
      totalInterest: (monthlyPayment * months) - principal
    }
  }
  
  // Export comparison as CSV
  const exportCSV = () => {
    if (!comparison) return
    
    // Check if user can export
    if (!canAccess('exports')) {
      setShowUpgradeModal(true)
      return
    }

    const headers = ['Metric', ...comparison.map(c => `${c.suburb.name}, ${c.suburb.state}`)]
    const rows = [
      ['House Median Price', ...comparison.map(c => c.suburb.medianPrice)],
      ['Unit Median Price', ...comparison.map(c => c.suburb.medianUnitPrice || 'N/A')],
      ['12M Growth (%)', ...comparison.map(c => c.suburb.growth12m || 'N/A')],
      ['6M Growth (%)', ...comparison.map(c => c.suburb.growth6m || 'N/A')],
      ['3M Growth (%)', ...comparison.map(c => c.suburb.growth3m || 'N/A')],
      ['Weekly Rent', ...comparison.map(c => c.suburb.weeklyRent || 'N/A')],
      ['Rental Yield (%)', ...comparison.map(c => c.suburb.rentalYield || 'N/A')],
      ['Postcode', ...comparison.map(c => c.suburb.postcode)],
      ['Investment Score', ...comparison.map(c => c.suburb.investmentScore || 'N/A')],
    ]

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `suburb-comparison-${Date.now()}.csv`
    a.click()
  }
  
  // Export comparison as PDF
  const exportPDF = () => {
    if (!comparison) return
    
    // Check if user can export
    if (!canAccess('exports')) {
      setShowUpgradeModal(true)
      return
    }
    
    // Create a printable version
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Suburb Comparison Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #1e40af; border-bottom: 3px solid #1e40af; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #1e40af; color: white; }
          .highlight { background-color: #dbeafe; font-weight: bold; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Suburb Comparison Report</h1>
        <p>Generated: ${new Date().toLocaleDateString()}</p>
        <table>
          <tr>
            <th>Metric</th>
            ${comparison.map(c => `<th>${c.suburb.name}, ${c.suburb.state}</th>`).join('')}
          </tr>
          <tr>
            <td>House Median Price</td>
            ${comparison.map(c => `<td>$${c.suburb.medianPrice.toLocaleString()}</td>`).join('')}
          </tr>
          <tr>
            <td>Unit Median Price</td>
            ${comparison.map(c => `<td>${c.suburb.medianUnitPrice ? '$' + c.suburb.medianUnitPrice.toLocaleString() : 'N/A'}</td>`).join('')}
          </tr>
          <tr>
            <td>12M Growth</td>
            ${comparison.map(c => `<td>${c.suburb.growth12m?.toFixed(2)}%</td>`).join('')}
          </tr>
          <tr>
            <td>Weekly Rent</td>
            ${comparison.map(c => `<td>${c.suburb.weeklyRent ? '$' + c.suburb.weeklyRent.toLocaleString() : 'N/A'}</td>`).join('')}
          </tr>
          <tr>
            <td>Rental Yield</td>
            ${comparison.map(c => `<td>${c.suburb.rentalYield ? c.suburb.rentalYield.toFixed(2) + '%' : 'N/A'}</td>`).join('')}
          </tr>
          <tr>
            <td>Investment Score</td>
            ${comparison.map(c => `<td>${c.suburb.investmentScore || 'N/A'}/100</td>`).join('')}
          </tr>"
          <tr>
            <td>Postcode</td>
            ${comparison.map(c => `<td>${c.suburb.postcode}</td>`).join('')}
          </tr>
        </table>
        <div class="footer">
          <p>This report is for informational purposes only. Please conduct your own research before making investment decisions.</p>
          <p>Generated by Suburb Intel AU - www.suburbintel.com.au</p>
        </div>
      </body>
      </html>
    `
    
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare Suburbs</h1>
            <p className="text-gray-600">Advanced side-by-side comparison tool with export capabilities</p>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          
          <div className="flex gap-2">
            {comparison && comparison.length >= 2 && (
              <>
                <button
                  onClick={exportPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Print / Save as PDF
                </button>
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </>
            )}
            <Link
              href="/mortgage-calculator"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Calculator className="h-4 w-4" />
              Mortgage Calculator
            </Link>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl border-2 border-blue-200 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              Advanced Filters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  value={filters.stateFilter}
                  onChange={(e) => setFilters({...filters, stateFilter: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All States</option>
                  <option value="NSW">NSW</option>
                  <option value="VIC">VIC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                <input
                  type="number"
                  placeholder="e.g., 500000"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                <input
                  type="number"
                  placeholder="e.g., 1000000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Growth (%)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 5"
                  value={filters.minGrowth}
                  onChange={(e) => setFilters({...filters, minGrowth: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Growth (%)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 15"
                  value={filters.maxGrowth}
                  onChange={(e) => setFilters({...filters, maxGrowth: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Yield (%)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 3"
                  value={filters.minYield}
                  onChange={(e) => setFilters({...filters, minYield: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setFilters({minPrice: '', maxPrice: '', minGrowth: '', maxGrowth: '', minYield: '', maxYield: '', stateFilter: 'all'})}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
              <button
                onClick={() => searchSuburbs(searchTerm)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Mortgage Calculator */}
        {showCalculator && comparison && comparison.length > 0 && (
          <div className="bg-white rounded-xl border-2 border-purple-200 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-purple-600" />
              Mortgage Calculator
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term (years)</label>
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deposit</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                  <option>20% (recommended)</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-purple-50 border-b-2 border-purple-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Suburb</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Deposit (20%)</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Loan Amount</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Weekly Repayment</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Monthly Repayment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparison.map((item, idx) => {
                    const calc = calculateMortgage(item.suburb.medianPrice)
                    return (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{item.suburb.name}, {item.suburb.state}</td>
                        <td className="px-4 py-3 text-right text-gray-900">${calc.deposit.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-gray-900">${calc.loanAmount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-semibold text-purple-600">${calc.weeklyPayment.toFixed(0)}/wk</td>
                        <td className="px-4 py-3 text-right font-semibold text-purple-600">${calc.monthlyPayment.toFixed(0)}/mo</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Suburb Selection with Autocomplete */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Select Suburbs to Compare ({selectedSuburbs.length}/4)
          </h2>
          
          {/* Selected Suburbs Pills */}
          {selectedSuburbs.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedSuburbs.map((suburb, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
                >
                  <span>{suburb.name}, {suburb.state}</span>
                  <button
                    onClick={() => removeSuburb(index)}
                    className="hover:bg-blue-700 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Autocomplete Search */}
          <div className="relative" ref={autocompleteRef}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
            <input
              type="text"
              placeholder="Search and add suburbs to compare (type at least 2 characters)..."
              value={searchTerm}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
              disabled={selectedSuburbs.length >= 4}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              role="combobox"
              aria-expanded={showSuggestions}
              aria-haspopup="listbox"
              aria-autocomplete="list"
            />
            
            {/* Autocomplete Dropdown */}
            {showSuggestions && suburbSuggestions.length > 0 && selectedSuburbs.length < 4 && (
              <div 
                className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto"
                role="listbox"
              >
                {suburbSuggestions.map((suburb, index) => {
                  const isSelected = selectedSuburbs.find(s => s.name === suburb.name && s.state === suburb.state)
                  const isHighlighted = index === highlightedIndex
                  return (
                    <div
                      key={index}
                      onClick={() => !isSelected && selectSuburb(suburb)}
                      role="option"
                      aria-selected={isHighlighted}
                      className={`px-4 py-3 border-b border-gray-100 last:border-b-0 transition-colors ${
                        isSelected 
                          ? 'bg-gray-100 cursor-not-allowed opacity-60' 
                          : isHighlighted
                            ? 'bg-blue-100 cursor-pointer'
                            : 'hover:bg-blue-50 cursor-pointer'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">{suburb.name}, {suburb.state}</p>
                          <p className="text-sm text-gray-600">Postcode: {suburb.postcode}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ${(suburb.medianPrice / 1000).toFixed(0)}k
                          </p>
                          <p className={`text-xs font-semibold ${
                            suburb.growth12m !== null && suburb.growth12m > 0 ? 'text-emerald-600' : 
                            suburb.growth12m !== null ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            {suburb.growth12m !== null ? `${suburb.growth12m > 0 ? '+' : ''}${suburb.growth12m.toFixed(1)}%` : 'N/A'}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <p className="text-xs text-gray-500 mt-1">Already selected</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            
            {/* No results message */}
            {showSuggestions && searchTerm.length >= 2 && suburbSuggestions.length === 0 && (
              <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl p-4">
                <p className="text-gray-600 text-sm">No suburbs found. Try a different search.</p>
              </div>
            )}
          </div>

          {selectedSuburbs.length >= 4 && (
            <p className="text-sm text-amber-600 mt-2">Maximum of 4 suburbs reached. Remove one to add another.</p>
          )}
        </div>

        {/* Comparison Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Comparing suburbs...</p>
          </div>
        ) : comparison && comparison.length >= 2 ? (
          <div className="space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-8 w-8 opacity-80" />
                  <TrendingDown className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-medium opacity-90 mb-1">Most Affordable</h3>
                <p className="text-2xl font-bold">
                  {comparison.reduce((prev, curr) => 
                    curr.suburb.medianPrice < prev.suburb.medianPrice ? curr : prev
                  ).suburb.name}
                </p>
                <p className="text-sm opacity-80 mt-1">
                  ${comparison.reduce((prev, curr) => 
                    curr.suburb.medianPrice < prev.suburb.medianPrice ? curr : prev
                  ).suburb.medianPrice.toLocaleString()}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-8 w-8 opacity-80" />
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-medium opacity-90 mb-1">Highest 12M Growth</h3>
                <p className="text-2xl font-bold">
                  {comparison.reduce((prev, curr) => 
                    (curr.suburb.growth12m || 0) > (prev.suburb.growth12m || 0) ? curr : prev
                  ).suburb.name}
                </p>
                <p className="text-sm opacity-80 mt-1">
                  +{((comparison.reduce((prev, curr) => 
                    (curr.suburb.growth12m || 0) > (prev.suburb.growth12m || 0) ? curr : prev
                  ).suburb.growth12m || 0).toFixed(2))}% p.a.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Home className="h-8 w-8 opacity-80" />
                  <DollarSign className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-medium opacity-90 mb-1">Best Rental Yield</h3>
                <p className="text-2xl font-bold">
                  {comparison.reduce((prev, curr) => 
                    curr.suburb.rentalYield > prev.suburb.rentalYield ? curr : prev
                  ).suburb.name}
                </p>
                <p className="text-sm opacity-80 mt-1">
                  {comparison.reduce((prev, curr) => 
                    curr.suburb.rentalYield > prev.suburb.rentalYield ? curr : prev
                  ).suburb.rentalYield.toFixed(2)}% yield
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="h-8 w-8 opacity-80" />
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-medium opacity-90 mb-1">Best Investment Score</h3>
                <p className="text-2xl font-bold">
                  {comparison.reduce((prev, curr) => 
                    (curr.suburb.investmentScore || 0) > (prev.suburb.investmentScore || 0) ? curr : prev
                  ).suburb.name}
                </p>
                <p className="text-sm opacity-80 mt-1">
                  Score: {(comparison.reduce((prev, curr) => 
                    (curr.suburb.investmentScore || 0) > (prev.suburb.investmentScore || 0) ? curr : prev
                  ).suburb.investmentScore || 0).toFixed(0)}/100
                </p>
              </div>
            </div>

            {/* Detailed Comparison Table */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b-2 border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Detailed Metrics Comparison</h2>
                {comparison.some(c => comparison.some(c2 => c.suburb.postcode === c2.suburb.postcode && c.suburb.name !== c2.suburb.name)) && (
                  <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-900">
                      <strong>Note:</strong> Some suburbs share the same postcode and may show similar values as data is grouped by postcode region in government datasets.
                    </p>
                  </div>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold text-gray-900 sticky left-0 bg-gray-50">Metric</th>
                      {comparison.map((item, idx) => (
                        <th key={idx} className="px-6 py-4 text-center font-bold text-gray-900 min-w-[180px]">
                          <div 
                            onClick={() => router.push(`/suburb/${encodeURIComponent(item.suburb.name.toUpperCase())}?state=${item.suburb.state}&postcode=${item.suburb.postcode}`)}
                            className="hover:text-blue-600 cursor-pointer"
                          >
                            <p className="text-lg">{item.suburb.name}</p>
                            <p className="text-sm font-medium text-gray-600">{item.suburb.state}</p>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900 sticky left-0 bg-white">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-blue-500" />
                          House Median
                        </div>
                      </td>
                      {comparison.map((item, idx) => {
                        const isLowest = item.suburb.medianPrice === Math.min(...comparison.map(c => c.suburb.medianPrice))
                        return (
                          <td key={idx} className={`px-6 py-4 text-center font-bold ${isLowest ? 'text-emerald-600 bg-emerald-50' : 'text-gray-900'}`}>
                            ${item.suburb.medianPrice.toLocaleString()}
                            {isLowest && <span className="text-xs block mt-1">Best Value</span>}
                          </td>
                        )
                      })}
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900 sticky left-0 bg-white">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-indigo-500" />
                          Unit Median
                        </div>
                      </td>
                      {comparison.map((item, idx) => {
                        const unitPrices = comparison.map(c => c.suburb.medianUnitPrice || Infinity)
                        const isLowest = item.suburb.medianUnitPrice && item.suburb.medianUnitPrice === Math.min(...unitPrices.filter(p => p !== Infinity))
                        return (
                          <td key={idx} className={`px-6 py-4 text-center font-bold ${isLowest ? 'text-emerald-600 bg-emerald-50' : 'text-gray-900'}`}>
                            {item.suburb.medianUnitPrice ? `$${item.suburb.medianUnitPrice.toLocaleString()}` : <span className="text-gray-400">N/A</span>}
                            {isLowest && <span className="text-xs block mt-1">Best Value</span>}
                          </td>
                        )
                      })}
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900 sticky left-0 bg-white">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-gray-400" />
                          12M Growth Rate
                        </div>
                      </td>
                      {comparison.map((item, idx) => {
                        const isHighest = item.suburb.growth12m !== null && item.suburb.growth12m === Math.max(...comparison.map(c => c.suburb.growth12m || -Infinity))
                        return (
                          <td key={idx} className={`px-6 py-4 text-center font-bold ${
                            isHighest ? 'text-blue-600 bg-blue-50' : 
                            item.suburb.growth12m !== null && item.suburb.growth12m > 0 ? 'text-emerald-600' : 
                            item.suburb.growth12m !== null ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            {item.suburb.growth12m !== null ? `${item.suburb.growth12m > 0 ? '+' : ''}${item.suburb.growth12m.toFixed(2)}%` : 'N/A'}
                            {isHighest && item.suburb.growth12m !== null && <span className="text-xs block mt-1">Highest Growth</span>}
                          </td>
                        )
                      })}  
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900 sticky left-0 bg-white">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-gray-400" />
                          Weekly Rent
                        </div>
                      </td>
                      {comparison.map((item, idx) => (
                        <td key={idx} className="px-6 py-4 text-center text-gray-900">
                          {item.suburb.weeklyRent ? `$${item.suburb.weeklyRent.toLocaleString()}/wk` : 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900 sticky left-0 bg-white">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-gray-400" />
                          Rental Yield
                        </div>
                      </td>
                      {comparison.map((item, idx) => {
                        const isHighest = item.suburb.rentalYield === Math.max(...comparison.map(c => c.suburb.rentalYield || 0))
                        return (
                          <td key={idx} className={`px-6 py-4 text-center font-bold ${isHighest ? 'text-purple-600 bg-purple-50' : 'text-purple-600'}`}>
                            {item.suburb.rentalYield ? `${item.suburb.rentalYield.toFixed(2)}%` : 'N/A'}
                            {isHighest && item.suburb.rentalYield && <span className="text-xs block mt-1">Best Yield</span>}
                          </td>
                        )
                      })}
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900 sticky left-0 bg-white">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-gray-400" />
                          Investment Score
                        </div>
                      </td>
                      {comparison.map((item, idx) => {
                        const isHighest = item.suburb.investmentScore && item.suburb.investmentScore === Math.max(...comparison.map(c => c.suburb.investmentScore || 0))
                        return (
                          <td key={idx} className={`px-6 py-4 text-center font-bold ${isHighest ? 'text-blue-600 bg-blue-50' : 'text-gray-900'}`}>
                            {item.suburb.investmentScore ? `${item.suburb.investmentScore.toFixed(0)}/100` : 'N/A'}
                            {isHighest && item.suburb.investmentScore && <span className="text-xs block mt-1">Top Rated</span>}
                          </td>
                        )
                      })}
                    </tr>
                    

                    {/* Basic Info */}
                    <tr className="bg-gray-50 border-t-2 border-gray-200">
                      <td colSpan={comparison.length + 1} className="px-6 py-3 font-bold text-gray-900 text-sm uppercase tracking-wider">
                        Location Information
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900 sticky left-0 bg-white">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          Postcode
                        </div>
                      </td>
                      {comparison.map((item, idx) => (
                        <td key={idx} className="px-6 py-4 text-center text-gray-900 font-mono">
                          {item.suburb.postcode}
                        </td>
                      ))}
                    </tr>
                    {comparison.some(c => c.suburb.investmentScore) && (
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900 sticky left-0 bg-white">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-gray-400" />
                            Investment Score
                          </div>
                        </td>
                        {comparison.map((item, idx) => {
                          const score = item.suburb.investmentScore || 0
                          const isHighest = score === Math.max(...comparison.map(c => c.suburb.investmentScore || 0))
                          return (
                            <td key={idx} className={`px-6 py-4 text-center font-bold ${
                              isHighest ? 'text-amber-600 bg-amber-50' : 
                              score >= 75 ? 'text-emerald-600' : 
                              score >= 50 ? 'text-blue-600' : 'text-gray-600'
                            }`}>
                              {score}/100
                              {isHighest && <span className="text-xs block mt-1">Top Rated</span>}
                            </td>
                          )
                        })}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Investment Insights */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Investment Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">💎 Best Overall Value</h4>
                  <p className="text-gray-700 text-sm">
                    <span className="font-bold text-blue-600">
                      {comparison.reduce((prev, curr) => {
                        const prevScore = (prev.suburb.investmentScore || 0)
                        const currScore = (curr.suburb.investmentScore || 0)
                        return currScore > prevScore ? curr : prev
                      }).suburb.name}
                    </span> offers the best combination of growth potential, affordability, and rental yield.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-2">🚀 Growth Leader</h4>
                  <p className="text-gray-700 text-sm">
                    <span className="font-bold text-purple-600">
                      {comparison.reduce((prev, curr) => 
                        (curr.suburb.growth12m || 0) > (prev.suburb.growth12m || 0) ? curr : prev
                      ).suburb.name}
                    </span> has shown the strongest price appreciation at {
                      (comparison.reduce((prev, curr) => 
                        (curr.suburb.growth12m || 0) > (prev.suburb.growth12m || 0) ? curr : prev
                      ).suburb.growth12m || 0).toFixed(2)
                    }% over 12 months.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-emerald-200">
                  <h4 className="font-semibold text-gray-900 mb-2">💰 Entry Point</h4>
                  <p className="text-gray-700 text-sm">
                    <span className="font-bold text-emerald-600">
                      {comparison.reduce((prev, curr) => 
                        curr.suburb.medianPrice < prev.suburb.medianPrice ? curr : prev
                      ).suburb.name}
                    </span> has the lowest entry cost at ${
                      comparison.reduce((prev, curr) => 
                        curr.suburb.medianPrice < prev.suburb.medianPrice ? curr : prev
                      ).suburb.medianPrice.toLocaleString()
                    }, making it accessible for first-time investors.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-amber-200">
                  <h4 className="font-semibold text-gray-900 mb-2">📊 Cash Flow Champion</h4>
                  <p className="text-gray-700 text-sm">
                    <span className="font-bold text-amber-600">
                      {comparison.reduce((prev, curr) => 
                        curr.suburb.rentalYield > prev.suburb.rentalYield ? curr : prev
                      ).suburb.name}
                    </span> provides the highest rental yield at {
                      comparison.reduce((prev, curr) => 
                        curr.suburb.rentalYield > prev.suburb.rentalYield ? curr : prev
                      ).suburb.rentalYield.toFixed(2)
                    }%, ideal for cash flow focused strategies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Comparing</h3>
            <p className="text-gray-600">Select at least 2 suburbs using the search above to see detailed comparisons</p>
          </div>
        )}
      </main>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="unlimited comparisons and exports"
        featureKey="comparisons"
        currentTier={subscriptionTier}
      />
    </div>
    </DashboardLayout>
  )
}

