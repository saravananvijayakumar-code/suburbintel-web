import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Median House Price vs Unit Price - Understanding the Difference',
  description: 'Why unit prices are typically lower than house prices in the same suburb. Learn property type dynamics and which is better for your investment strategy.',
  alternates: { canonical: '/guides/median-house-price-vs-unit-price' },
}

export default function GuideHouseVsUnitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/">Home</Link> / <Link href="/guides">Guides</Link> / House vs Unit Prices
        </nav>

        <article className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">Median House Price vs Unit Price</h1>
          
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
            <p className="text-teal-900"><strong>TL;DR:</strong> Houses include land ownership (Torrens title) and are typically 40-60% more expensive than units in the same suburb. Units (apartments/townhouses) have strata fees but lower entry prices and higher rental yields. Houses offer better capital growth; units offer better cash flow.</p>
          </div>

          <h2 className="text-2xl font-bold mb-3">Key Differences</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-300">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Houses</h3>
              <ul className="space-y-2 text-sm">
                <li>✅ <strong>Ownership:</strong> Land + building (Torrens title)</li>
                <li>✅ <strong>Control:</strong> Full control over property</li>
                <li>✅ <strong>Growth:</strong> Land appreciates over time</li>
                <li>✅ <strong>No strata fees</strong></li>
                <li>❌ <strong>Price:</strong> Higher entry cost</li>
                <li>❌ <strong>Yield:</strong> Lower rental yield (2-4%)</li>
                <li>❌ <strong>Maintenance:</strong> You pay 100% of repairs</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-300">
              <h3 className="text-xl font-bold text-green-900 mb-3">Units/Apartments</h3>
              <ul className="space-y-2 text-sm">
                <li>✅ <strong>Ownership:</strong> Interior only (Strata title)</li>
                <li>✅ <strong>Price:</strong> Lower entry cost</li>
                <li>✅ <strong>Yield:</strong> Higher rental yield (3-6%)</li>
                <li>✅ <strong>Maintenance:</strong> Shared with body corporate</li>
                <li>✅ <strong>Amenities:</strong> Pools, gyms (some buildings)</li>
                <li>❌ <strong>Strata fees:</strong> $2,000-$8,000/year</li>
                <li>❌ <strong>Growth:</strong> Slower capital appreciation</li>
                <li>❌ <strong>Control:</strong> Body corporate restrictions</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">Typical Price Differences (Same Suburb)</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="mb-4 font-semibold">Example: Melbourne CBD (VIC 3000)</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center pb-2 border-b">
                <span>Median House Price:</span>
                <span className="font-bold text-xl">$1,250,000</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span>Median Unit Price:</span>
                <span className="font-bold text-xl">$650,000</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-red-600">Price Difference:</span>
                <span className="font-bold text-red-600">48% cheaper</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">Which is Better for Investors?</h2>
          <div className="space-y-4 mb-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold text-purple-900 mb-2">Choose Houses If:</h3>
              <ul className="text-sm space-y-1">
                <li>• You have larger capital (can afford entry price)</li>
                <li>• You're focused on long-term capital growth (10+ years)</li>
                <li>• You want full control over renovations/improvements</li>
                <li>• You're targeting family tenants</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-bold text-orange-900 mb-2">Choose Units If:</h3>
              <ul className="text-sm space-y-1">
                <li>• You have limited capital (first investor, smaller budget)</li>
                <li>• You're focused on cash flow/rental yield</li>
                <li>• You want lower maintenance responsibility</li>
                <li>• You're targeting CBD/inner-city locations</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">Growth vs Yield Trade-off</h2>
          <p className="mb-4">General rule (exceptions exist):</p>
          <ul className="list-disc ml-6 space-y-2 mb-6">
            <li><strong>Houses:</strong> 5-10% annual growth, 2-4% yield</li>
            <li><strong>Units:</strong> 3-6% annual growth, 3-6% yield</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">Common Mistakes</h2>
          <ul className="list-disc ml-6 space-y-2 mb-6">
            <li>Comparing house prices to unit prices without adjusting expectations</li>
            <li>Ignoring strata fees in unit cash flow calculations</li>
            <li>Buying units in oversupplied high-rise precincts</li>
            <li>Assuming all houses grow faster (location and quality matter more)</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">FAQs</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-bold">Do units ever outperform houses?</h3>
              <p className="text-sm">Yes, in high-demand rental markets with low vacancy. CBD apartments can deliver strong total returns (yield + growth).</p>
            </div>
            <div>
              <h3 className="font-bold">Are townhouses considered units or houses?</h3>
              <p className="text-sm">Depends on title. Strata title townhouses = units. Torrens title townhouses = houses.</p>
            </div>
          </div>

          <div className="mt-8 bg-teal-500 text-white p-6 rounded-lg text-center">
            <h3 className="font-bold mb-2">View Houses & Units by Suburb</h3>
            <Link href="/search" className="inline-block bg-white text-teal-600 px-6 py-2 rounded-lg font-semibold mt-2">Search Suburbs →</Link>
          </div>
        </article>
      </div>
    </div>
  )
}
