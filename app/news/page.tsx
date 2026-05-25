'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Newspaper,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  MapPin,
  Filter,
} from 'lucide-react'
import NewsFeed from '../components/NewsFeed'

interface PropertyNews {
  id: string
  title: string
  description: string
  publishedAt: string
  category: string
  state: string | null
  impactType: string
  impactScore: number
}

export default function NewsPage() {
  const [latestNews, setLatestNews] = useState<PropertyNews[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const newsRes = await fetch('/api/news?limit=6')
      const newsData = await newsRes.json()
      if (newsData.success) {
        setLatestNews(
          newsData.news?.filter((n: PropertyNews) => n.category !== 'daily-summary') || []
        )
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatShortDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })

  const getImpactIcon = (impactType: string) => {
    if (impactType === 'positive') return <TrendingUp className="w-4 h-4 text-green-600" />
    if (impactType === 'negative') return <TrendingDown className="w-4 h-4 text-red-600" />
    return <Minus className="w-4 h-4 text-gray-600" />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full mb-6">
            <Newspaper className="h-5 w-5" />
            <span className="text-sm font-medium">Property Market News</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            Property Market
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              News & Insights
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            The latest property news affecting Australian markets. Stay informed with insights that matter to investors.
          </p>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Latest Property News</h2>
              <p className="text-gray-600 mt-2">Breaking news and updates from across Australia</p>
            </div>
            <Link
              href="#all-news"
              className="hidden md:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
            >
              View All News <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : latestNews.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestNews.slice(0, 6).map(news => (
                <Link
                  key={news.id}
                  href={`/news/${news.id}`}
                  className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-lg capitalize ${
                        news.category === 'infrastructure'
                          ? 'bg-blue-100 text-blue-700'
                          : news.category === 'market'
                            ? 'bg-orange-100 text-orange-700'
                            : news.category === 'government'
                              ? 'bg-green-100 text-green-700'
                              : news.category === 'planning'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {news.category}
                    </span>
                    {news.state && <span className="text-xs text-gray-500">{news.state}</span>}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{news.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{formatShortDate(news.publishedAt)}</span>
                    <div className="flex items-center gap-1">
                      {getImpactIcon(news.impactType)}
                      <span className="capitalize">{news.impactType}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Newspaper className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No news articles available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* All News */}
      <section id="all-news" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Filter className="h-6 w-6 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-900">All News</h2>
          </div>
          <NewsFeed limit={50} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Explore Australian Property Markets</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Free, unlimited access to suburb data, comparisons, and investment metrics.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/search"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Explore Suburbs
            </Link>
            <Link
              href="/blog"
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition-colors"
            >
              Read Investment Guides
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
