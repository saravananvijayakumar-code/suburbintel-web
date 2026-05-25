'use client'

import Link from 'next/link'

export default function HomepageFAQ() {
  const faqs = [
    {
      question: "What suburbs does Suburb Intel AU cover?",
      answer: "We provide comprehensive property data for 2,259 verified suburbs across New South Wales (NSW) and Victoria (VIC), sourced directly from government property records and updated weekly."
    },
    {
      question: "How accurate are your property price predictions?",
      answer: "Our AI-powered forecasting model achieves up to 90% accuracy by analyzing historical price trends, demographic shifts, infrastructure developments, and economic indicators across Australian property markets."
    },
    {
      question: "Is the property data in real-time?",
      answer: "We update our database weekly with the latest median prices, rental yields, and transaction volumes from official government sources and leading Australian property market research."
    },
    {
      question: "Can I track my property portfolio for free?",
      answer: "Yes! Our Free plan includes tracking for 1 property. Upgrade to Pro for just $4.99/month — less than a coffee — for unlimited portfolio tracking, AI advisors, price predictions, and more."
    },
    {
      question: "What makes Suburb Intel AU different from other property tools?",
      answer: "We're the only Australian platform combining government-verified property data with AI-powered growth predictions, suburb-level demographic insights, and investment scoring algorithms—all in one transparent, affordable platform."
    }
  ]

  return (
    <section className="bg-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-lg text-gray-600 mb-12">
          Everything you need to know about Australian property investment intelligence
        </p>
        
        <dl className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
              <dt className="text-xl font-semibold text-gray-900 mb-3">
                {faq.question}
              </dt>
              <dd className="text-gray-600 leading-relaxed text-base">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Have more questions?</p>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Full FAQ
          </Link>
        </div>
      </div>

      {/* FAQ Schema for Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </section>
  )
}
