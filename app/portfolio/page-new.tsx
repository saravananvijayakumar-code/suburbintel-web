'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Trash2, TrendingUp, DollarSign, Home, X, Search, Loader2 } from 'lucide-react'

interface PortfolioProperty {
  id: string
  suburbName: string
  state: string
  purchasePrice: number
  purchaseDate: string
  currentValue?: number
  weeklyRent?: number
  notes?: string
}

interface SuburbSuggestion {
  name: string
  state: string
  postcode: string
  medianPrice: number
}

export default function PortfolioPage() {
  const [properties, setProperties] = useState<PortfolioProperty[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SuburbSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    suburbName: '',
    state: '',
    purchasePrice: '',
    purchaseDate: '',
    currentValue: '',
    weeklyRent: '',
    notes: ''
  })

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('portfolio')
    if (saved) {
      setProperties(JSON.parse(saved))
    }
  }, [])

  // Save to localStorage
  const saveProperties = (props: PortfolioProperty[]) => {
    setProperties(props)
    localStorage.setItem('portfolio', JSON.stringify(props))
  }

  // Search suburbs
  const searchSuburbs = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/suburbs/search?q=${encodeURIComponent(query)}&limit=5`)
      const data = await response.json()
      if (data.success) {
        setSuggestions(data.suburbs || [])
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchInput = (value: string) => {
    setSearchQuery(value)
    setFormData({ ...formData, suburbName: value })
    searchSuburbs(value)
    setShowSuggestions(true)
  }

  const selectSuburb = (suburb: SuburbSuggestion) => {
    setFormData({
      ...formData,
      suburbName: suburb.name,
      state: suburb.state,
      currentValue: suburb.medianPrice.toString()
    })
    setSearchQuery(suburb.name)
    setShowSuggestions(false)
    setSuggestions([])
  }

  const addProperty = () => {
    if (!formData.suburbName || !formData.state || !formData.purchasePrice || !formData.purchaseDate) {
      alert('Please fill in all required fields')
      return
    }

    const newProperty: PortfolioProperty = {
      id: Date.now().toString(),
      suburbName: formData.suburbName,
      state: formData.state,
      purchasePrice: parseFloat(formData.purchasePrice),
      purchaseDate: formData.purchaseDate,
      currentValue: formData.currentValue ? parseFloat(formData.currentValue) : undefined,
      weeklyRent: formData.weeklyRent ? parseFloat(formData.weeklyRent) : undefined,
      notes: formData.notes
    }

    saveProperties([...properties, newProperty])
    setFormData({
      suburbName: '',
      state: '',
      purchasePrice: '',
      purchaseDate: '',
      currentValue: '',
      weeklyRent: '',
      notes: ''
    })
    setSearchQuery('')
    setShowAddForm(false)
  }

  const removeProperty = (id: string) => {
    if (confirm('Are you sure you want to remove this property?')) {
      saveProperties(properties.filter(p => p.id !== id))
    }
  }

  const calculateGain = (property: PortfolioProperty) => {
    if (!property.currentValue) return null
    const gain = property.currentValue - property.purchasePrice
    const percentage = (gain / property.purchasePrice) * 100
    return { gain, percentage }
  }

  const calculateYield = (property: PortfolioProperty) => {
    if (!property.weeklyRent || !property.currentValue) return null
    const annualRent = property.weeklyRent * 52
    return (annualRent / property.currentValue) * 100
  }

  const totalInvested = properties.reduce((sum, p) => sum + p.purchasePrice, 0)
  const totalCurrentValue = properties.reduce((sum, p) => sum + (p.currentValue || p.purchasePrice), 0)
  const totalGain = totalCurrentValue - totalInvested
  const totalGainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Tracker</h1>
          <p className="mt-2 text-gray-600">
            Track and manage your property investment portfolio
          </p>
        </div>

        {/* Summary Cards */}
        {properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Home className="h-5 w-5" />
                <span className="text-sm font-medium">Properties</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <DollarSign className="h-5 w-5" />
                <span className="text-sm font-medium">Total Invested</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${totalInvested.toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Current Value</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${totalCurrentValue.toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Total Gain</span>
              </div>
              <p className={`text-2xl font-bold ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalGain >= 0 ? '+' : ''}${totalGain.toLocaleString()}
              </p>
              <p className={`text-sm ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalGainPercent >= 0 ? '+' : ''}{totalGainPercent.toFixed(1)}%
              </p>
            </div>
          </div>
        )}

        {/* Add Property Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <Plus className="h-5 w-5" />
            Add Property
          </button>
        </div>

        {/* Add Property Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Property</h2>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Suburb Search */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Suburb * {loading && <Loader2 className="inline h-3 w-3 animate-spin ml-1" />}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    placeholder="Search suburb..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suburb, idx) => (
                      <div
                        key={idx}
                        onClick={() => selectSuburb(suburb)}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
                      >
                        <p className="font-semibold text-gray-900">{suburb.name}, {suburb.state}</p>
                        <p className="text-sm text-gray-600">Current median: ${suburb.medianPrice.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="NSW"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price *</label>
                <input
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  placeholder="750000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date *</label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Value (optional)</label>
                <input
                  type="number"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                  placeholder="800000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Rent (optional)</label>
                <input
                  type="number"
                  value={formData.weeklyRent}
                  onChange={(e) => setFormData({ ...formData, weeklyRent: e.target.value })}
                  placeholder="600"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={addProperty}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Add Property
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Properties List */}
        {properties.length > 0 ? (
          <div className="space-y-4">
            {properties.map((property) => {
              const gain = calculateGain(property)
              const yieldPercent = calculateYield(property)

              return (
                <div key={property.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {property.suburbName}, {property.state}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Purchased {new Date(property.purchaseDate).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeProperty(property.id)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Purchase Price</p>
                      <p className="text-lg font-bold text-gray-900">
                        ${property.purchasePrice.toLocaleString()}
                      </p>
                    </div>

                    {property.currentValue && (
                      <div>
                        <p className="text-sm text-gray-600">Current Value</p>
                        <p className="text-lg font-bold text-gray-900">
                          ${property.currentValue.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {gain && (
                      <div>
                        <p className="text-sm text-gray-600">Gain/Loss</p>
                        <p className={`text-lg font-bold ${gain.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {gain.gain >= 0 ? '+' : ''}${gain.gain.toLocaleString()}
                          <span className="text-sm ml-1">({gain.percentage >= 0 ? '+' : ''}{gain.percentage.toFixed(1)}%)</span>
                        </p>
                      </div>
                    )}

                    {yieldPercent && (
                      <div>
                        <p className="text-sm text-gray-600">Rental Yield</p>
                        <p className="text-lg font-bold text-blue-600">
                          {yieldPercent.toFixed(1)}%
                        </p>
                        <p className="text-sm text-gray-600">${property.weeklyRent}/week</p>
                      </div>
                    )}
                  </div>

                  {property.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{property.notes}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Yet</h3>
            <p className="text-gray-600 mb-6">
              Start tracking your property investments by adding your first property
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <Plus className="h-5 w-5" />
              Add Your First Property
            </button>
          </div>
        )}

        {/* Data Note */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Your portfolio data is stored locally in your browser. 
            It will persist across sessions but won't be accessible from other devices.
          </p>
        </div>
      </div>
    </div>
  )
}
