import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'What is Rental Yield? - Complete Guide for Australian Property',
  description: 'Rental yield explained: formula, calculation examples, gross vs net yield, and what percentages mean for Australian investors.',
  alternates: { canonical: '/guides/what-is-rental-yield' },
}

export default function GuideRentalYieldPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/">Home</Link> / <Link href="/guides">Guides</Link> / What is Rental Yield?
        </nav>

        <article className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">What is Rental Yield?</h1>
          
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
            <p className="text-teal-900"><strong>TL;DR:</strong> Rental yield is annual rental income as a percentage of property value. Formula: (Weekly Rent × 52) / Property Price × 100. A 5% yield means $25,000 annual rent on a $500,000 property.</p>
          </div>

          <h2 className="text-2xl font-bold mb-3">The Formula</h2>
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <code className="text-lg">Rental Yield (%) = (Weekly Rent × 52) / Median Price × 100</code>
          </div>

          <h3 className="text-xl font-bold mb-3">Example Calculation</h3>
          <p className="mb-4">Property price: $600,000 | Weekly rent: $550</p>
          <p className="mb-4">Calculation: ($550 × 52) / $600,000 × 100 = <strong>4.77% rental yield</strong></p>

          <h2 className="text-2xl font-bold mb-3 mt-8">Gross vs Net Yield</h2>
          <ul className="list-disc ml-6 space-y-2 mb-6">
            <li><strong>Gross Yield:</strong> Rental income before expenses (the formula above)</li>
            <li><strong>Net Yield:</strong> After deducting rates, insurance, maintenance, management fees. Typically 1-2% lower than gross.</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">What's a Good Yield in Australia?</h2>
          <div className="space-y-3 mb-6">
            <div className="bg-red-50 p-4 rounded-lg"><strong>&lt;3%:</strong> Low yield (Sydney CBD, Melbourne inner city) - growth-focused</div>
            <div className="bg-yellow-50 p-4 rounded-lg"><strong>3-5%:</strong> Moderate yield (most metro suburbs) - balanced</div>
            <div className="bg-green-50 p-4 rounded-lg"><strong>&gt;5%:</strong> High yield (regional areas, high-demand rentals) - cash flow focused</div>
          </div>

          <h2 className="text-2xl font-bold mb-3">Common Mistakes</h2>
          <ul className="list-disc ml-6 space-y-2 mb-6">
            <li>Ignoring expenses (use net yield for accurate cash flow)</li>
            <li>Comparing yields across different property types without context</li>
            <li>Chasing high yield without checking vacancy risk</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">FAQs</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold">Is 3% rental yield good?</h3>
              <p className="text-sm text-gray-700">For inner-city growth markets (Sydney, Melbourne), yes. For regional areas, no - expect 4-6%.</p>
            </div>
            <div>
              <h3 className="font-bold">Does rental yield account for capital growth?</h3>
              <p className="text-sm text-gray-700">No. Yield is cash flow only. Total return = yield + capital growth.</p>
            </div>
          </div>

          <div className="mt-8 bg-teal-500 text-white p-6 rounded-lg text-center">
            <h3 className="font-bold mb-2">Calculate Yields for 14,548 Suburbs</h3>
            <Link href="/search" className="inline-block bg-white text-teal-600 px-6 py-2 rounded-lg font-semibold mt-2">View Suburb Yields →</Link>
          </div>
        </article>

        <p className="mt-6 text-sm text-gray-600">
          <strong>Related:</strong> <Link href="/guides/how-to-calculate-rental-yield-australia" className="text-teal-600">→ How to Calculate Rental Yield</Link> | <Link href="/methodology" className="text-teal-600">→ Our Methodology</Link>
        </p>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'What is rental yield?', acceptedAnswer: { '@type': 'Answer', text: 'Rental yield is annual rental income as a percentage of property value. Calculated as: (Weekly Rent × 52) / Property Price × 100.' } },
            { '@type': 'Question', name: 'Is 3% rental yield good?', acceptedAnswer: { '@type': 'Answer', text: 'For inner-city growth markets like Sydney and Melbourne, 3% is acceptable. For regional areas, expect 4-6% yields.' } },
          ],
        }),
      }} />
    </div>
  )
}
