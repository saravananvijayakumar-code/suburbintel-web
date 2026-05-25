import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Share2, BookmarkPlus } from 'lucide-react'

interface BlogPostProps {
  params: {
    slug: string
  }
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | Suburb Intel AU Blog`,
    description: post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishDate,
      authors: ['Suburb Intel AU Team'],
    },
  }
}

async function getPostBySlug(slug: string) {
  // Import blog content dynamically
  const posts: { [key: string]: any } = {
    'how-investment-scores-calculated': await import('./content/how-investment-scores-calculated'),
    'ai-powered-suburb-analysis': await import('./content/ai-powered-suburb-analysis'),
    'data-driven-investment-strategies': await import('./content/data-driven-investment-strategies'),
    'suburb-comparison-guide': await import('./content/suburb-comparison-guide'),
  }

  return posts[slug]?.default || null
}

export default async function BlogPost({ params }: BlogPostProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Blog</span>
          </Link>

          <div className="mb-6">
            <span className="px-4 py-2 bg-blue-500/20 backdrop-blur-sm text-blue-100 text-sm font-semibold rounded-lg uppercase tracking-wider">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">{post.publishDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="font-medium">{post.readTime}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Actions */}
      <div className="sticky top-0 z-10 bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <BookmarkPlus className="h-4 w-4" />
                Save
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
            <div className="text-sm font-medium text-slate-500">
              {post.readTime}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg prose-slate max-w-none
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-slate-900
          prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-slate-900
          prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-3 prose-h4:text-slate-800
          prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-blue-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
          prose-strong:text-slate-900 prose-strong:font-bold
          prose-ul:my-6 prose-ul:list-disc
          prose-ol:my-6 prose-ol:list-decimal
          prose-li:text-slate-700 prose-li:my-2 prose-li:leading-relaxed
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8 prose-blockquote:rounded-r-lg
          prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:shadow-xl
          prose-table:border-collapse prose-table:w-full prose-table:my-8
          prose-th:bg-slate-100 prose-th:p-4 prose-th:text-left prose-th:font-bold prose-th:text-slate-900 prose-th:border prose-th:border-slate-300
          prose-td:p-4 prose-td:border prose-td:border-slate-300 prose-td:text-slate-700
          prose-img:rounded-xl prose-img:shadow-lg">
          <post.Content />
        </div>

        {/* Author Bio */}
        <div className="mt-16 p-8 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-200">
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                SI
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Suburb Intel AU Team
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Our team of property analysts, data scientists, and real estate experts work together to provide you with the most accurate and actionable property investment insights across Australia.
              </p>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-16 border-t border-slate-200 pt-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            Related Articles
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {post.relatedPosts?.map((related: any) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="group p-8 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all"
              >
                <div className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wide">
                  {related.category}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                  {related.title}
                </h3>
                <p className="text-slate-600 text-base line-clamp-2 leading-relaxed">
                  {related.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 p-12 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl text-center text-white shadow-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full mb-6">
            <span className="text-sm font-medium text-blue-200">Get Started</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-slate-300 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
            Access our full suite of property analysis tools and AI-powered insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-xl hover:shadow-2xl border-2 border-white/20"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
