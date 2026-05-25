import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Calculate Rental Yield Australia - Formula & Examples',
  description: 'Complete guide to calculating rental yield for Australian properties. Includes gross vs net yield formulas, worked examples, and benchmarks by state.',
  alternates: { canonical: '/guides/how-to-calculate-rental-yield-australia' },
}

export default function GuideCalculateYieldPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/">Home</Link> / <Link href="/guides">Guides</Link> / Calculate Rental Yield Australia
        </nav>

        <article className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">How to Calculate Rental Yield (Australia)</h1>
          
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
            <p className="text-teal-900"><strong>TL;DR:</strong> Gross yield = (Weekly Rent × 52) / Property Price × 100. Net yield = subtract expenses (rates, insurance, maintenance, management fees). Example: $500/week rent on $600k property = 4.33% gross yield, ~3.5% net yield after expenses.</p>
          </div>

          <h2 className="text-2xl font-bold mb-3">Gross Rental Yield Formula</h2>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <code className="text-lg">Gross Yield (%) = (Weekly Rent × 52) / Property Price × 100</code>
          </div>

          <h3 className="text-xl font-bold mb-3">Example 1: Sydney Apartment</h3>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="mb-2"><strong>Property Price:</strong> $800,000</p>
            <p className="mb-2"><strong>Weekly Rent:</strong> $650</p>
            <p className="mb-3"><strong>Calculation:</strong> ($650 × 52) / $800,000 × 100</p>
            <p className="text-2xl font-bold text-blue-900">= 4.225% gross yield</p>
          </div>

          <h3 className="text-xl font-bold mb-3">Example 2: Regional House</h3>
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <p className="mb-2"><strong>Property Price:</strong> $450,000</p>
            <p className="mb-2"><strong>Weekly Rent:</strong> $480</p>
            <p className="mb-3"><strong>Calculation:</strong> ($480 × 52) / $450,000 × 100</p>
            <p className="text-2xl font-bold text-green-900">= 5.547% gross yield</p>
          </div>

          <h2 className="text-2xl font-bold mb-3 mt-8">Net Rental Yield (After Expenses)</h2>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <code>Net Yield = ((Annual Rent - Annual Expenses) / Property Price) × 100</code>
          </div>

          <h3 className="text-xl font-bold mb-3">Typical Annual Expenses</h3>
          <ul className="list-disc ml-6 space-y-2 mb-6">
            <li><strong>Council rates:</strong> $1,500-$3,000/year</li>
            <li><strong>Strata fees (units):</strong> $2,000-$8,000/year</li>
            <li><strong>Insurance:</strong> $800-$1,500/year</li>
            <li><strong>Property management:</strong> 7-10% of rental income</li>
            <li><strong>Maintenance/repairs:</strong> ~1% of property value/year</li>
          </ul>

          <h3 className="text-xl font-bold mb-3">Example: Net Yield Calculation</h3>
          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <p className="mb-2">Property: $600,000 | Rent: $550/week ($28,600/year)</p>
            <p className="mb-2">Gross yield: 4.77%</p>
            <p className="mb-3"><strong>Expenses:</strong></p>
            <ul className="text-sm ml-4 mb-3 space-y-1">
              <li>• Rates: $2,000</li>
              <li>• Insurance: $1,200</li>
              <li>• Management (8%): $2,288</li>
              <li>• Maintenance: $6,000</li>
              <li><strong>Total: $11,488</strong></li>
            </ul>
            <p className="font-bold">Net income: $28,600 - $11,488 = $17,112</p>
            <p className="text-2xl font-bold text-yellow-900 mt-2">Net yield: 2.85%</p>
          </div>

          <h2 className="text-2xl font-bold mb-3">Australian Yield Benchmarks by State</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-bold">Sydney (NSW)</p>
              <p className="text-sm">Houses: 2.5-3.5% | Units: 3.5-4.5%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-bold">Melbourne (VIC)</p>
              <p className="text-sm">Houses: 2.8-3.8% | Units: 3.8-4.8%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-bold">Brisbane (QLD)</p>
              <p className="text-sm">Houses: 3.5-4.5% | Units: 4.5-5.5%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-bold">Regional Areas</p>
              <p className="text-sm">Houses: 4.5-6.5% | Units: 5.0-7.0%</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">FAQs</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-bold">Do I use purchase price or current value?</h3>
              <p className="text-sm">For evaluating potential purchases: use purchase price. For existing portfolio: use current market value.</p>
            </div>
            <div>
              <h3 className="font-bold">Should I use gross or net yield?</h3>
              <p className="text-sm">Gross for quick comparisons. Net for accurate cash flow planning.</p>
            </div>
          </div>

          <div className="mt-8 bg-teal-500 text-white p-6 rounded-lg text-center">
            <h3 className="font-bold mb-2">View Rental Yields for 14,548 Suburbs</h3>
            <Link href="/search" className="inline-block bg-white text-teal-600 px-6 py-2 rounded-lg font-semibold mt-2">Search Suburbs →</Link>
          </div>
        </article>

        <p className="mt-6 text-sm text-gray-600">
          <strong>Related:</strong> <Link href="/guides/what-is-rental-yield" className="text-teal-600">→ What is Rental Yield?</Link> | <Link href="/guides/suburb-growth-vs-yield-strategy" className="text-teal-600">→ Growth vs Yield Strategy</Link>
        </p>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'How to Calculate Rental Yield in Australia',
          step: [
            { '@type': 'HowToStep', name: 'Find weekly rent', text: 'Get current market rent for the property' },
            { '@type': 'HowToStep', name: 'Multiply by 52', text: 'Calculate annual rental income' },
            { '@type': 'HowToStep', name: 'Divide by property price', text: 'Divide annual rent by property value' },
            { '@type': 'HowToStep', name: 'Multiply by 100', text: 'Convert to percentage' },
          ],
        }),
      }} />
    </div>
  )
}
