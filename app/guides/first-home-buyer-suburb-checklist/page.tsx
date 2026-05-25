import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'First Home Buyer Suburb Checklist - 15 Must-Check Items',
  description: 'Complete first home buyer checklist: affordability, commute, schools, amenities, growth potential, and hidden costs. Don\'t buy before checking these.',
  alternates: { canonical: '/guides/first-home-buyer-suburb-checklist' },
}

export default function GuideFHBChecklistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/">Home</Link> / <Link href="/guides">Guides</Link> / First Home Buyer Checklist
        </nav>

        <article className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">First Home Buyer Suburb Checklist</h1>
          
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
            <p className="text-teal-900"><strong>TL;DR:</strong> Check 15 items before buying: Budget (deposit + ongoing costs), commute time, schools, safety, amenities, future growth, resale appeal, building/pest, strata, hidden costs. Visit suburb 3+ times (day/night/weekend). Don't skip inspections.</p>
          </div>

          <h2 className="text-2xl font-bold mb-3">The Complete Checklist</h2>

          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <h3 className="font-bold text-blue-900">1. Budget Reality Check</h3>
                  <p className="text-sm">Can you afford 20% deposit + stamp duty + inspections ($3-5K)? Calculate maximum borrowing capacity with calculator.</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <h3 className="font-bold text-blue-900">2. Ongoing Costs</h3>
                  <p className="text-sm">Mortgage + rates ($1,500-3,000/yr) + insurance ($800-1,500/yr) + strata (units: $2K-8K/yr) + maintenance (1% of value/yr). Can you afford if rates rise 2%?</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <h3 className="font-bold text-green-900">3. Commute Time</h3>
                  <p className="text-sm">Test commute to work during peak hour. Max 60 mins each way = sustainable. Check public transport frequency.</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <h3 className="font-bold text-green-900">4. Schools (if planning family)</h3>
                  <p className="text-sm">Check school catchment zones. Visit MySchool website for NAPLAN results. Primary within 2km, high school within 5km ideal.</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <h3 className="font-bold text-green-900">5. Safety & Crime</h3>
                  <p className="text-sm">Check state police crime stats. Visit suburb at night. Ask locals. Trust your gut - if it feels unsafe, it probably is.</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <h3 className="font-bold text-purple-900">6. Amenities Within 5km</h3>
                  <p className="text-sm">Supermarkets, medical centres, cafes/restaurants, parks, gyms. More amenities = better lifestyle + resale appeal.</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <h3 className="font-bold text-purple-900">7. Public Transport Access</h3>
                  <p className="text-sm">Train station &lt;2km or frequent bus route. Impacts resale value heavily. Check weekend/night service.</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <h3 className="font-bold text-orange-900">8. Growth Potential</h3>
                  <p className="text-sm">Check 5-year price history. Infrastructure projects announced? Population growing or shrinking? Aim for 5-8% annual growth suburbs.</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <h3 className="font-bold text-orange-900">9. Resale Appeal</h3>
                  <p className="text-sm">Even if you plan to stay forever, check: Would families/professionals want this? 3-bed house/2-bed unit = easiest to sell.</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <h3 className="font-bold text-red-900">10. Building & Pest Inspection</h3>
                  <p className="text-sm">NEVER skip. Costs $400-800. Can save you $50K+ in repairs. Get independent inspector (not recommended by agent).</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <h3 className="font-bold text-red-900">11. Strata Report (if unit)</h3>
                  <p className="text-sm">Check: Sinking fund balance (should be $500K+ for 50+ unit building), recent levies, planned works, disputes. Red flag: special levy announced.</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <h3 className="font-bold text-yellow-900">12. Noise & Nuisances</h3>
                  <p className="text-sm">Visit suburb on weekend night. Check for: flight paths, train noise, busy roads, nearby pubs/clubs, industrial areas.</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <h3 className="font-bold text-yellow-900">13. Future Development</h3>
                  <p className="text-sm">Check council DA approvals for nearby blocks. High-rise going up next door = loss of views/light/privacy.</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <h3 className="font-bold text-yellow-900">14. Natural Hazards</h3>
                  <p className="text-sm">Check flood maps, bushfire zones, coastal erosion risk. Insurance may be expensive or unavailable in high-risk areas.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">15. Gut Feel</h3>
                  <p className="text-sm">Visit 3+ times (weekday morning, afternoon, weekend). Can you see yourself living here 5+ years? If not, keep looking.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">First Home Buyer Mistakes to Avoid</h2>
          <ul className="list-disc ml-6 space-y-2 mb-6 text-sm">
            <li><strong>Maxing out borrowing capacity:</strong> Leave buffer for rate rises</li>
            <li><strong>Buying too far from work:</strong> Commute stress kills quality of life</li>
            <li><strong>Skipping inspections to save $800:</strong> Penny wise, pound foolish</li>
            <li><strong>Buying in declining suburbs:</strong> Check 5-year price trends</li>
            <li><strong>Ignoring strata fees:</strong> Can be $8K+/year, affects affordability</li>
            <li><strong>Emotional buying:</strong> Love the home, but analyze the investment</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">First Home Buyer Grants & Schemes</h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm">
            <ul className="space-y-2">
              <li>✅ <strong>First Home Guarantee:</strong> 5% deposit (no LMI)</li>
              <li>✅ <strong>First Home Owner Grant:</strong> $10K-$25K (varies by state)</li>
              <li>✅ <strong>Stamp duty concessions:</strong> Can save $10K-$50K</li>
              <li>✅ <strong>First Home Super Saver Scheme:</strong> Save via super (tax benefits)</li>
            </ul>
            <p className="mt-3 text-xs">Check eligibility at <a href="https://www.nhfic.gov.au" target="_blank" rel="noopener" className="text-blue-600">NHFIC website</a></p>
          </div>

          <h2 className="text-2xl font-bold mb-3">FAQs</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-bold">How much deposit do I need?</h3>
              <p className="text-sm">Ideally 20% (avoids LMI). Minimum 5% with First Home Guarantee. Plus stamp duty + $3-5K costs.</p>
            </div>
            <div>
              <h3 className="font-bold">Should I buy house or unit as first home?</h3>
              <p className="text-sm">Depends on budget. Units = lower entry, easier maintenance. Houses = better growth, more control. <Link href="/guides/median-house-price-vs-unit-price" className="text-teal-600">Read comparison →</Link></p>
            </div>
          </div>

          <div className="mt-8 bg-teal-500 text-white p-6 rounded-lg text-center">
            <h3 className="font-bold mb-2">Research First Home Buyer Suburbs</h3>
            <Link href="/best-suburbs/first-home-buyer" className="inline-block bg-white text-teal-600 px-6 py-2 rounded-lg font-semibold mt-2">View FHB Suburbs →</Link>
          </div>
        </article>

        <p className="mt-6 text-sm text-gray-600">
          <strong>Related:</strong> <Link href="/guides/first-home-buyer" className="text-teal-600">→ First Home Buyer Guide</Link> | <Link href="/guides/how-to-analyze-a-suburb" className="text-teal-600">→ How to Analyze a Suburb</Link>
        </p>
      </div>
    </div>
  )
}
