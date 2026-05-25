'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { Eye, Trash2, Plus, MapPin, TrendingUp, DollarSign, Lock, Loader2, AlertTriangle } from 'lucide-react'

interface WatchlistItem {
  id: string
  suburb: {
    id: string
    name: string
    state: string
    postcode: string
    medianPrice: number
    growth12m: number
    rentalYield: number
    investmentScore: number
  }
  emailAlerts: boolean
  notes: string
  createdAt: string
}

export default function WatchlistPage() {
  const { subscriptionTier } = useSubscription()
  const hasProAccess = subscriptionTier === 'pro'
  const watchlistLimit = hasProAccess ? -1 : 3 // Free users get 3, Pro gets unlimited
  
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingSuburb, setAddingSuburb] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    loadWatchlist()
  }, [])

  const loadWatchlist = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/watchlist')
      const data = await response.json()
      if (data.success) {
        setWatchlist(data.watchlist)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to load watchlist')
    } finally {
      setLoading(false)
    }
  }

  const searchSuburbs = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    
    setSearchLoading(true)
    try {
      const response = await fetch(`/api/suburbs/search?q=${encodeURIComponent(query)}&limit=5`)
      const data = await response.json()
      if (data.success) {
        setSearchResults(data.suburbs || [])
      }
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setSearchLoading(false)
    }
  }

  const addToWatchlist = async (suburb: any) => {
    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          suburbId: suburb.id,
          suburbName: suburb.name,
          state: suburb.state,
          postcode: suburb.postcode
        })
      })
      const data = await response.json()
      if (data.success) {
        loadWatchlist()
        setSearchQuery('')
        setSearchResults([])
        setAddingSuburb(false)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to add suburb')
    }
  }

  const removeFromWatchlist = async (id: string) => {
    try {
      const response = await fetch(`/api/watchlist?id=${id}`, { method: 'DELETE' })
      const data = await response.json()
      if (data.success) {
        setWatchlist(watchlist.filter(item => item.id !== id))
      }
    } catch (err) {
      setError('Failed to remove suburb')
    }
  }

  // Check if user can add more suburbs
  const canAddMore = watchlistLimit === -1 || watchlist.length < watchlistLimit

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Watchlist</h1>
            <p className="text-gray-600 mt-1">Track suburbs and get notified of price changes</p>
            {!hasProAccess && (
              <p className="text-sm text-purple-600 mt-1">
                {watchlist.length}/{watchlistLimit} suburbs used • <Link href="/pricing" className="underline">Upgrade for unlimited</Link>
              </p>
            )}
          </div>
          {canAddMore ? (
            <button
              onClick={() => setAddingSuburb(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              <Plus className="h-5 w-5" />
              Add Suburb
            </button>
          ) : (
            <Link
              href="/pricing"
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              <Lock className="h-5 w-5" />
              Upgrade for More
            </Link>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-red-700">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {/* Add Suburb Modal */}
        {addingSuburb && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add Suburb to Watchlist</h2>
                <button 
                  onClick={() => {
                    setAddingSuburb(false)
                    setSearchQuery('')
                    setSearchResults([])
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  searchSuburbs(e.target.value)
                }}
                placeholder="Search suburbs..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchLoading && (
                <div className="flex items-center gap-2 mt-4 text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </div>
              )}
              {searchResults.length > 0 && (
                <div className="mt-4 space-y-2">
                  {searchResults.map((suburb) => (
                    <button
                      key={suburb.id}
                      onClick={() => addToWatchlist(suburb)}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition"
                    >
                      <div className="font-medium text-gray-900">{suburb.name}</div>
                      <div className="text-sm text-gray-500">{suburb.state} {suburb.postcode}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Watchlist */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : watchlist.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No suburbs in your watchlist</h2>
            <p className="text-gray-500 mb-6">Add suburbs to track their prices and get alerts</p>
            <button
              onClick={() => setAddingSuburb(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              <Plus className="h-5 w-5" />
              Add Your First Suburb
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {watchlist.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between">
                  <Link 
                    href={`/suburb/${encodeURIComponent(item.suburb.name)}?state=${item.suburb.state}&postcode=${item.suburb.postcode}`}
                    className="flex-1"
                  >
                    <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition">
                      {item.suburb.name}
                    </h3>
                    <p className="text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {item.suburb.state} {item.suburb.postcode}
                    </p>
                  </Link>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromWatchlist(item.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                  <div>
                    <div className="text-sm text-gray-500">Median Price</div>
                    <div className="text-lg font-bold text-gray-900">
                      ${(item.suburb.medianPrice / 1000).toFixed(0)}k
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">12M Growth</div>
                    <div className={`text-lg font-bold ${
                      item.suburb.growth12m >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.suburb.growth12m >= 0 ? '+' : ''}{item.suburb.growth12m?.toFixed(1) || 'N/A'}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Rental Yield</div>
                    <div className="text-lg font-bold text-gray-900">
                      {item.suburb.rentalYield?.toFixed(2) || 'N/A'}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Score</div>
                    <div className="text-lg font-bold text-blue-600">
                      {item.suburb.investmentScore?.toFixed(0) || 'N/A'}/100
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}


      </div>
    </div>
  )
}
