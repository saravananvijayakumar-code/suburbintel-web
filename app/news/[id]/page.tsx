'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2, 
  BookmarkPlus,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Tag,
  ExternalLink,
  Loader2
} from 'lucide-react'

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

export default function NewsArticlePage() {
  const params = useParams()
  const [news, setNews] = useState<PropertyNews | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [relatedNews, setRelatedNews] = useState<PropertyNews[]>([])

  useEffect(() => {
    if (params.id) {
      fetchNewsArticle(params.id as string)
    }
  }, [params.id])

  const fetchNewsArticle = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/news/${id}`)
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Failed to load article')
        return
      }
      
      setNews(data.news)
      if (data.related) {
        setRelatedNews(data.related)
      }
    } catch (err) {
      setError('Failed to load article')
    } finally {
      setLoading(false)
    }
  }

  const getImpactIcon = (impactType: string) => {
    if (impactType === 'positive') return <TrendingUp className="w-5 h-5 text-green-600" />
    if (impactType === 'negative') return <TrendingDown className="w-5 h-5 text-red-600" />
    return <Minus className="w-5 h-5 text-gray-600" />
  }

  const getImpactLabel = (impactType: string) => {
    if (impactType === 'positive') return 'Positive Impact'
    if (impactType === 'negative') return 'Negative Impact'
    return 'Neutral Impact'
  }

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      infrastructure: 'bg-blue-500/20 text-blue-100',
      planning: 'bg-purple-500/20 text-purple-100',
      government: 'bg-green-500/20 text-green-100',
      market: 'bg-orange-500/20 text-orange-100',
      economic: 'bg-red-500/20 text-red-100',
      'daily-summary': 'bg-indigo-500/20 text-indigo-100'
    }
    return colors[cat] || 'bg-gray-500/20 text-gray-100'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
  }

  // Format markdown-style content to HTML with XSS protection
  const formatContent = (content: string) => {
    if (!content) return ''
    
    // Sanitize content to prevent XSS attacks
    // Allow only safe HTML tags and attributes for news content
    const sanitize = (html: string): string => {
      const tempDiv = document.createElement('div')
      tempDiv.textContent = html // This escapes all HTML
      let sanitized = tempDiv.innerHTML
      
      // Now allow specific formatting tags only
      sanitized = sanitized
        .replace(/&lt;strong&gt;/g, '<strong>')
        .replace(/&lt;\/strong&gt;/g, '</strong>')
        .replace(/&lt;em&gt;/g, '<em>')
        .replace(/&lt;\/em&gt;/g, '</em>')
        .replace(/&lt;p[^&]*&gt;/g, '<p>')
        .replace(/&lt;\/p&gt;/g, '</p>')
        .replace(/&lt;ul[^&]*&gt;/g, '<ul class="list-disc list-inside my-4 space-y-2">')
        .replace(/&lt;\/ul&gt;/g, '</ul>')
        .replace(/&lt;ol[^&]*&gt;/g, '<ol class="list-decimal list-inside my-4 space-y-2">')
        .replace(/&lt;\/ol&gt;/g, '</ol>')
        .replace(/&lt;li&gt;/g, '<li>')
        .replace(/&lt;\/li&gt;/g, '</li>')
      
      return sanitized
    }
    
    // Split into paragraphs
    const paragraphs = content.split(/\n\n+/)
    
    return paragraphs.map(paragraph => {
      // Convert **bold** to <strong>
      let formatted = paragraph.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      
      // Convert *italic* to <em>
      formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>')
      
      // Convert bullet points
      if (formatted.startsWith('- ') || formatted.startsWith('• ')) {
        const items = formatted.split(/\n/).map(item => 
          `<li>${sanitize(item.replace(/^[-•]\s*/, ''))}</li>`
        ).join('')
        return `<ul class="list-disc list-inside my-4 space-y-2">${items}</ul>`
      }
      
      // Convert numbered lists
      if (/^\d+\.\s/.test(formatted)) {
        const items = formatted.split(/\n/).map(item => 
          `<li>${sanitize(item.replace(/^\d+\.\s*/, ''))}</li>`
        ).join('')
        return `<ol class="list-decimal list-inside my-4 space-y-2">${items}</ol>`
      }
      
      // Wrap in paragraph with sanitization
      return `<p class="mb-4 leading-relaxed text-gray-700">${sanitize(formatted)}</p>`
    }).join('\n')
  }

  const formattedContent = useMemo(() => {
    return news ? formatContent(news.content) : ''
  }, [news])

  const handleShare = async () => {
    if (navigator.share && news) {
      try {
        await navigator.share({
          title: news.title,
          text: news.description,
          url: window.location.href,
        })
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to News</span>
          </Link>
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600">{error || "The article you're looking for doesn't exist."}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to News</span>
          </Link>

          <div className="flex flex-wrap gap-3 mb-6">
            <span className={`px-4 py-2 backdrop-blur-sm text-sm font-semibold rounded-lg uppercase tracking-wider ${getCategoryColor(news.category)}`}>
              {news.category.replace('-', ' ')}
            </span>
            {news.state && (
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold rounded-lg">
                {news.state}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight">
            {news.title}
          </h1>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            {news.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">{formatDate(news.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="font-medium">{calculateReadTime(news.content)}</span>
            </div>
            <div className="flex items-center gap-2">
              {getImpactIcon(news.impactType)}
              <span className="font-medium">{getImpactLabel(news.impactType)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Actions */}
      <div className="sticky top-0 z-10 bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
            <div className="text-sm text-slate-500">
              Source: <span className="font-medium">{news.source}</span>
              {news.sourceUrl && (
                <a 
                  href={news.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  View Original <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Impact Score Badge */}
        {news.impactScore > 0 && (
          <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                news.impactScore >= 7 ? 'bg-green-100' : 
                news.impactScore >= 4 ? 'bg-yellow-100' : 'bg-gray-100'
              }`}>
                <span className={`text-2xl font-bold ${
                  news.impactScore >= 7 ? 'text-green-700' : 
                  news.impactScore >= 4 ? 'text-yellow-700' : 'text-gray-700'
                }`}>
                  {news.impactScore}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Property Impact Score</h3>
                <p className="text-sm text-gray-600">
                  {news.impactScore >= 7 ? 'High impact on property values in affected areas' :
                   news.impactScore >= 4 ? 'Moderate impact expected on local property market' :
                   'Minor impact on property values'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Affected Suburbs */}
        {news.suburbs && news.suburbs.length > 0 && (
          <div className="mb-8 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Affected Suburbs
            </h3>
            <div className="flex flex-wrap gap-2">
              {news.suburbs.map((suburb, index) => (
                <Link
                  key={index}
                  href={`/search?q=${encodeURIComponent(suburb)}`}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  {suburb}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Article Content */}
        <article 
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-ul:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-strong:font-semibold"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-gray-500" />
              Related Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {news.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related News</h3>
            <div className="grid gap-4">
              {relatedNews.map((related) => (
                <Link
                  key={related.id}
                  href={`/news/${related.id}`}
                  className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <h4 className="font-semibold text-gray-900 mb-2">{related.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{related.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span>{formatDate(related.publishedAt)}</span>
                    <span className="capitalize">{related.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated on Property News</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Get daily AI-powered market summaries and be the first to know about developments affecting property values.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/news"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Browse All News
            </Link>
            <Link
              href="/search"
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition-colors"
            >
              Search Suburbs
            </Link>
          </div>
        </div>
      </section>
    </article>
  )
}
