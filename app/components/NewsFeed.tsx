'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, TrendingUp, TrendingDown, Minus, ExternalLink, MapPin } from 'lucide-react'

interface PropertyNews {
  id: string
  title: string
  description: string
  content: string
  source: string
  sourceUrl: string | null
  publishedAt: string
  category: string
  state: string | null
  suburbs: string[]
  impactType: string
  impactScore: number
  tags: string[]
  imageUrl: string | null
}

interface NewsFeedProps {
  state?: string
  category?: string
  suburb?: string
  limit?: number
}

export default function NewsFeed({ state, category, suburb, limit = 10 }: NewsFeedProps) {
  const [news, setNews] = useState<PropertyNews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(category || null)

  useEffect(() => {
    fetchNews()
  }, [state, selectedCategory, suburb, limit])

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      if (state) params.append('state', state)
      if (selectedCategory) params.append('category', selectedCategory)
      if (suburb) params.append('suburb', suburb)
      params.append('limit', limit.toString())

      const response = await fetch(`/api/news?${params.toString()}`)
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Failed to fetch news')
        setNews([])
        return
      }
      
      setNews(data.news || [])
    } catch (err: any) {
      console.error('Error fetching news:', err)
      setError('Unable to load news. Please try again later.')
      setNews([])
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      infrastructure: 'bg-blue-100 text-blue-800 border-blue-200',
      planning: 'bg-purple-100 text-purple-800 border-purple-200',
      government: 'bg-green-100 text-green-800 border-green-200',
      market: 'bg-orange-100 text-orange-800 border-orange-200',
      economic: 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[cat] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getImpactIcon = (impactType: string) => {
    if (impactType === 'positive') return <TrendingUp className="w-4 h-4 text-green-600" />
    if (impactType === 'negative') return <TrendingDown className="w-4 h-4 text-red-600" />
    return <Minus className="w-4 h-4 text-gray-600" />
  }

  const getImpactColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800 border-green-300'
    if (score >= 6) return 'bg-blue-100 text-blue-800 border-blue-300'
    if (score >= 4) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    return 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const categories = [
    { value: null, label: 'All News' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'planning', label: 'Planning' },
    { value: 'government', label: 'Government' },
    { value: 'market', label: 'Market' },
    { value: 'economic', label: 'Economic' }
  ]

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800">Failed to load news: {error}</p>
      </div>
    )
  }

  if (news.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">No property news available at the moment.</p>
        <p className="text-sm text-gray-500 mt-2">Check back soon for updates on government announcements and market insights.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      {!category && (
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* News Items */}
      <div className="space-y-4">
        {news.map((item) => (
          <Link
            href={`/news/${item.id}`}
            key={item.id}
            className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>
                
                {item.state && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {item.state}
                  </span>
                )}

                <div className="flex items-center gap-1">
                  {getImpactIcon(item.impactType)}
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getImpactColor(item.impactScore)}`}>
                    Impact: {item.impactScore}/10
                  </span>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(item.publishedAt)}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-gray-700 mb-4">
              {item.description}
            </p>

            {/* Affected Suburbs */}
            {item.suburbs && item.suburbs.length > 0 && (
              <div className="flex items-start gap-2 mb-4">
                <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  {item.suburbs.slice(0, 5).map((sub, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {sub}
                    </span>
                  ))}
                  {item.suburbs.length > 5 && (
                    <span className="px-2 py-1 text-gray-500 text-xs">
                      +{item.suburbs.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">
                Source: <span className="font-medium">{item.source}</span>
              </span>

              <span className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                Read Full Article
                <ExternalLink className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
