'use client'

import { useState, useEffect, useRef } from 'react'
import DashboardLayout from '@/app/components/DashboardLayout'
import { FileText, Search, Loader2, MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Suburb {
  id: string
  name: string
  state: string
  postcode: string
  medianPrice: number
  rentalYield: number
  growth12m: number
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suburb[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const debouncedQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
        setSuggestions([])
        return
      }
      setIsSearching(true)
      try {
        const response = await fetch(`/api/suburbs/search?q=${encodeURIComponent(debouncedQuery)}&limit=8`)
        const data = await response.json()
        if (data.suburbs) {
          setSuggestions(data.suburbs)
          setShowSuggestions(true)
        }
      } catch (err) {
        console.error('Failed to fetch suggestions:', err)
      } finally {
        setIsSearching(false)
      }
    }
    fetchSuggestions()
  }, [debouncedQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">Suburb Reports</h1>
              <p className="text-teal-100">Detailed data-driven suburb profiles, free for everyone.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-white/10 rounded-lg px-4 py-2 text-sm">✓ ABS Census 2021 demographics</div>
            <div className="bg-white/10 rounded-lg px-4 py-2 text-sm">✓ Median price & yield data</div>
            <div className="bg-white/10 rounded-lg px-4 py-2 text-sm">✓ Government-sourced metrics</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Find a suburb</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Start typing a suburb name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (e.target.value.length >= 2) setShowSuggestions(true)
              }}
              onFocus={() => {
                if (suggestions.length > 0 && searchQuery.length >= 2) setShowSuggestions(true)
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />

            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-gray-400" />
            )}

            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
              >
                <div className="p-2">
                  <p className="text-xs text-gray-500 px-3 py-1 border-b border-gray-100">
                    Click a suburb to view its full report
                  </p>
                  {suggestions.map((suburb) => (
                    <Link
                      key={suburb.id}
                      href={`/suburb/${encodeURIComponent(suburb.name)}?state=${suburb.state}&postcode=${suburb.postcode}`}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-teal-50 rounded-md transition-colors text-left group"
                    >
                      <MapPin className="w-4 h-4 text-gray-400 group-hover:text-teal-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate group-hover:text-teal-700">
                          {suburb.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {suburb.state} {suburb.postcode}
                          {suburb.medianPrice ? ` • $${suburb.medianPrice.toLocaleString()}` : ''}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-teal-600 opacity-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {showSuggestions && suggestions.length === 0 && searchQuery.length >= 2 && !isSearching && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                <p className="text-sm text-gray-500 text-center">
                  No suburbs found for "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Each report includes</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
            <div>✓ Median sale price and unit price</div>
            <div>✓ Weekly rent and rental yield</div>
            <div>✓ ABS Census 2021 demographics</div>
            <div>✓ 12-month price growth</div>
            <div>✓ Environmental risk profile</div>
            <div>✓ Similar suburb suggestions</div>
            <div>✓ State and national rankings</div>
            <div>✓ Historical price chart</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
