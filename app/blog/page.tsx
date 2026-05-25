import { Metadata } from 'next'
import Link from 'next/link'
import NewsletterForm from '@/app/components/NewsletterForm'
import { 
  BookOpen, 
  TrendingUp, 
  MapPin, 
  Calculator, 
  Brain,
  Calendar,
  ArrowRight,
  Search
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Property Investment Blog | Expert Insights & Strategies | Suburb Intel AU',
  description: 'Discover expert property investment strategies, suburb analysis guides, AI-powered insights, and data-driven approaches to Australian real estate investment success.',
  keywords: 'property investment blog, Australian real estate insights, suburb analysis, investment strategies, property data analysis, AI property insights',
  openGraph: {
    title: 'Property Investment Blog - Suburb Intel AU',
    description: 'Expert insights on Australian property investment, suburb analysis, and data-driven investment strategies.',
    type: 'website',
  },
}

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  publishDate: string
  icon: any
  featured: boolean
}

const blogPosts: BlogPost[] = [
  {
    slug: 'how-investment-scores-calculated',
    title: 'How We Calculate Investment Scores: The Science Behind Our 5-Factor AI Algorithm',
    excerpt: 'Discover the advanced multi-factor scoring system that analyzes yield, growth, momentum, affordability, and market dynamics to provide accurate suburb investment ratings.',
    category: 'Platform Features',
    readTime: '12 min read',
    publishDate: 'November 20, 2025',
    icon: Calculator,
    featured: true,
  },
  {
    slug: 'ai-powered-suburb-analysis',
    title: 'AI-Powered Suburb Analysis: How Machine Learning Transforms Property Investment',
    excerpt: 'Learn how our GPT-4 powered analysis engine processes millions of data points to deliver personalized property investment insights and recommendations.',
    category: 'Technology',
    readTime: '10 min read',
    publishDate: 'November 18, 2025',
    icon: Brain,
    featured: true,
  },
  {
    slug: 'data-driven-investment-strategies',
    title: 'Data-Driven Investment Strategies: Why Numbers Beat Emotions in Property Markets',
    excerpt: 'Explore proven investment strategies backed by comprehensive data analysis, market trends, and predictive analytics for Australian property markets.',
    category: 'Investment Strategies',
    readTime: '11 min read',
    publishDate: 'November 15, 2025',
    icon: TrendingUp,
    featured: true,
  },
  {
    slug: 'suburb-comparison-guide',
    title: 'The Ultimate Suburb Comparison Guide: Making Informed Investment Decisions',
    excerpt: 'Master the art of comparing suburbs using our advanced comparison tools, understanding key metrics, and identifying the best investment opportunities.',
    category: 'How-To Guides',
    readTime: '13 min read',
    publishDate: 'November 12, 2025',
    icon: MapPin,
    featured: false,
  },
]

const categories = [
  'All Posts',
  'Platform Features',
  'Technology',
  'Investment Strategies',
  'How-To Guides',
  'Market Analysis',
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full mb-6">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-medium">Investment Insights</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              Property Investment Blog
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Expert insights, data-driven strategies, and guides to help you make smarter property decisions
            </p>
            
            {/* Search Bar */}
            <div className="mt-10 max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-14 pr-5 py-5 rounded-2xl text-gray-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl bg-white/95 backdrop-blur-sm text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto py-5">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-5 py-2.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  category === 'All Posts'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:shadow-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Featured Articles</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(post => post.featured).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200 hover:border-blue-200 flex flex-col"
              >
                <div className="p-8 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-all">
                      <post.icon className="h-7 w-7 text-blue-600" />
                    </div>
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold rounded-full shadow-md">
                      Featured
                    </span>
                  </div>

                  <div className="mb-3">
                    <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed flex-grow">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>{post.readTime}</span>
                    </div>

                    <ArrowRight className="h-5 w-5 text-blue-600 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-12">All Articles</h2>

          <div className="space-y-5">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-slate-200 hover:border-blue-200"
              >
                <div className="p-8 md:flex md:items-center md:gap-8">
                  <div className="flex-shrink-0 mb-6 md:mb-0">
                    <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-all group-hover:scale-105">
                      <post.icon className="h-9 w-9 text-blue-600" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg uppercase tracking-wide">
                        {post.category}
                      </span>
                      {post.featured && (
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg">
                          ⭐ Featured
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                      {post.title}
                    </h3>

                    <p className="text-slate-600 mb-4 line-clamp-2 leading-relaxed text-lg">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{post.publishDate}</span>
                      </div>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <div className="hidden md:block">
                    <ArrowRight className="h-7 w-7 text-blue-600 group-hover:translate-x-3 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full mb-6">
            <span className="text-sm font-medium text-blue-200">Newsletter</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
            Stay Updated with Property Insights
          </h2>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed">
            Get the latest articles, market analysis, and investment tips delivered to your inbox
          </p>
          <NewsletterForm source="blog" />
        </div>
      </section>
    </div>
  )
}
