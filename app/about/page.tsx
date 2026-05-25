import Link from 'next/link'

export const metadata = {
  title: 'About Us | Suburb Intel AU',
  description: 'Learn about Suburb Intel AU - comprehensive property intelligence platform for Australian property investors',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-teal-600 hover:underline mb-6 inline-block">
          ← Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-4">About Suburb Intel AU</h1>
          <p className="text-xl text-gray-600 mb-4">
            Reduce your property analysis time with instant access to 100% official Australian government data
          </p>
          <p className="text-lg text-gray-500 mb-8">
            No more manual research across dozens of government portals - we've done the heavy lifting for you
          </p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            {/* Beta Notice */}
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 border-l-4 border-teal-500 p-6 rounded-r-lg">
              <div className="flex items-start">
                <span className="text-3xl mr-4">🚧</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Currently in BETA</h3>
                  <p className="text-gray-700">
                    We're building this platform transparently with our community. While core features work, 
                    we're continuously improving data quality, adding features, and refining the user experience. 
                    Thank you for being an early supporter!
                  </p>
                </div>
              </div>
            </div>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Our Mission</h2>
              <p className="mb-4">
                To save Australian property investors hundreds of hours of research by aggregating official government data into one powerful platform. 
                Instead of manually searching through 27 different government portals (NSW, VIC data sources), we automatically collect, clean, and analyze 
                all the data for you - updated quarterly with fresh government releases.
              </p>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                <p className="font-semibold text-gray-900 mb-2">⚡ Your Time is Valuable</p>
                <p className="text-gray-700">
                  Researching one suburb manually across government websites takes 2-4 hours. With Suburb Intel AU, get comprehensive insights in under 60 seconds. 
                  That's <strong>200+ hours saved</strong> if you're comparing 100 suburbs for your next investment.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">What We Do</h2>
              <p className="mb-4">
                Suburb Intel AU combines public data sources and market analysis to help you:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Research Australian suburbs quickly and efficiently</li>
                <li>Compare property markets side-by-side</li>
                <li>Calculate investment returns and cash flow</li>
                <li>Identify growth trends and opportunities</li>
                <li>Make informed, data-backed investment decisions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Data Sources & Transparency</h2>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <p className="font-semibold text-green-800">✓ Official Government Data Sources</p>
                <p className="text-sm text-green-700 mt-2">
                  We use 100% FREE official Australian government data sources. All property data is sourced from legitimate government agencies.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-gray-800">Official Data Sources:</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-bold text-blue-900 mb-2">🏛️ State Valuer-General Offices (Official Property Data)</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• <strong>NSW Valuer-General</strong> - Median property prices, land values, sales data</li>
                    <li>• <strong>VIC Valuer-General</strong> - Victoria property valuations and market data</li>
                    <li>• <strong>QLD Valuer-General</strong> - Queensland property prices and trends</li>
                    <li>• <strong>Other State Valuer-General offices</strong> - WA, SA, TAS, NT, ACT</li>
                  </ul>
                  <p className="text-xs text-blue-700 mt-2 font-semibold">
                    ✓ Official government property valuations | ✓ Updated quarterly | ✓ Legally verified data
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-bold text-purple-900 mb-2">📊 Australian Bureau of Statistics (ABS)</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• Census data (demographics, population, housing characteristics)</li>
                    <li>• Median household income by suburb</li>
                    <li>• Employment statistics and socio-economic indexes (SEIFA)</li>
                    <li>• Dwelling counts and rental statistics</li>
                  </ul>
                  <p className="text-xs text-purple-700 mt-2 font-semibold">
                    ✓ Official national statistics | ✓ Census-verified data | ✓ Covers all 15,000+ Australian suburbs
                  </p>
                </div>

                <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500">
                  <h4 className="font-bold text-teal-900 mb-2">🔗 Data Portal Sources</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• <strong>data.nsw.gov.au</strong> - NSW Government Open Data Portal</li>
                    <li>• <strong>discover.data.vic.gov.au</strong> - Victorian Government Data Directory</li>
                    <li>• <strong>data.qld.gov.au</strong> - Queensland Government Open Data</li>
                    <li>• <strong>api.data.abs.gov.au</strong> - ABS Data API</li>
                  </ul>
                  <p className="text-xs text-teal-700 mt-2 font-semibold">
                    ✓ No cost to use | ✓ Unlimited access | ✓ Publicly available government APIs
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-gray-800 mt-6">Data Quality & Updates:</h3>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <ul className="text-sm space-y-2 text-blue-800">
                  <li>✓ <strong>Official Sources:</strong> All data from legitimate government agencies</li>
                  <li>✓ <strong>Coverage:</strong> 15,000+ Australian suburbs across all states</li>
                  <li>✓ <strong>Update Frequency:</strong> Quarterly updates from Valuer-General offices</li>
                  <li>✓ <strong>Legally Verified:</strong> Government-validated property valuations</li>
                  <li>✓ <strong>No Cost:</strong> 100% FREE government data sources</li>
                </ul>
                <p className="text-sm font-semibold text-blue-900 mt-3">
                  ✓ You can trust this data - it comes directly from Australian government sources used by professionals, banks, and real estate agents.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-gray-800 mt-6">Data Attribution:</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                <p className="mb-2">We acknowledge and attribute our data sources:</p>
                <ul className="space-y-1">
                  <li>• Property valuations: State Valuer-General offices (NSW, VIC, QLD, WA, SA, TAS, NT, ACT)</li>
                  <li>• Demographics and statistics: Australian Bureau of Statistics (ABS)</li>
                  <li>• Data portals: NSW Data Portal, VIC Data Directory, QLD Open Data</li>
                </ul>
                <p className="mt-3 text-xs italic">
                  All data is used in accordance with Creative Commons licensing and government open data policies.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-gray-800 mt-6">Important Disclaimer:</h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <p className="text-sm text-yellow-800">
                  While we use official government data sources, property markets are dynamic and data may be 3-6 months old due to quarterly government update cycles. 
                  <strong> Always verify current market conditions with licensed real estate agents and property valuers before making investment decisions.</strong>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Why We're Different</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="font-bold text-teal-900 mb-2">🎯 Affordable</h3>
                  <p className="text-sm text-gray-700">
                    Starting at $14.95/month vs. competitors at $44-299/month
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-blue-900 mb-2">📊 Data-Driven</h3>
                  <p className="text-sm text-gray-700">
                    Algorithmic analysis of market trends and patterns
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-bold text-purple-900 mb-2">🔍 Transparent</h3>
                  <p className="text-sm text-gray-700">
                    We tell you exactly where data comes from and limitations
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold text-green-900 mb-2">🚀 Evolving</h3>
                  <p className="text-sm text-gray-700">
                    Constantly adding features and improving data quality
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Not Financial Advice</h2>
              <div className="bg-red-50 border-2 border-red-500 p-6 rounded-lg">
                <p className="font-bold text-red-800 text-lg mb-3">⚠️ CRITICAL DISCLAIMER</p>
                <p className="text-red-700 mb-3">
                  <strong>Suburb Intel AU does NOT provide financial, investment, legal, or tax advice.</strong>
                </p>
                <p className="text-sm text-red-700 mb-2">
                  We are NOT licensed financial advisors, mortgage brokers, or real estate agents. All information, 
                  analysis, and reports are for general informational and educational purposes only.
                </p>
                <p className="text-sm text-red-700 font-semibold">
                  You MUST consult with qualified professionals (financial advisors, accountants, lawyers, licensed real estate agents) 
                  before making any property investment decisions.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Our Commitment</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-teal-600 font-bold mr-3">✓</span>
                  <span><strong>Transparency:</strong> We clearly state data sources and limitations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 font-bold mr-3">✓</span>
                  <span><strong>Privacy:</strong> Your data is protected and never sold</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 font-bold mr-3">✓</span>
                  <span><strong>Improvement:</strong> We listen to feedback and continuously enhance our platform</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 font-bold mr-3">✓</span>
                  <span><strong>Affordability:</strong> We keep pricing accessible for everyday investors</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 font-bold mr-3">✓</span>
                  <span><strong>Support:</strong> We're here to help you understand and use our tools</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Our Roadmap</h2>
              <p className="mb-4">We're committed to continuous improvement. See our <Link href="/roadmap" className="text-teal-600 underline">full roadmap</Link> for upcoming features.</p>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <div>
                    <p className="font-semibold">Phase 1: Core Platform (COMPLETED)</p>
                    <p className="text-sm text-gray-600">Search, calculator, comparison tools</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 text-xl mr-3">→</span>
                  <div>
                    <p className="font-semibold">Phase 2: Enhanced Data (IN PROGRESS)</p>
                    <p className="text-sm text-gray-600">Expanding to 100+ suburbs, improving data quality</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-400 text-xl mr-3">○</span>
                  <div>
                    <p className="font-semibold">Phase 3: Premium Features (PLANNED)</p>
                    <p className="text-sm text-gray-600">AI reports, PDF exports, email alerts</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-400 text-xl mr-3">○</span>
                  <div>
                    <p className="font-semibold">Phase 4: Professional Tools (Q2 2026)</p>
                    <p className="text-sm text-gray-600">Portfolio tracker, API access, advanced analytics</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Company Information</h2>
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-lg border-l-4 border-teal-500">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Quantum Leap Ventures Pvt Ltd</h3>
                <p className="text-gray-700 mb-4">
                  Suburb Intel AU is owned and operated by <strong>Quantum Leap Ventures Pvt Ltd</strong>, 
                  an Australian-registered company specializing in financial technology and property intelligence platforms.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">
                    <strong>Company Name:</strong> Quantum Leap Ventures Pvt Ltd
                  </p>
                  <p className="text-gray-700">
                    <strong>Product:</strong> Suburb Intel AU - Property Intelligence Platform
                  </p>
                  <p className="text-gray-700">
                    <strong>Jurisdiction:</strong> Registered in Australia
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Our Mission</h3>
                <p className="text-gray-700">
                  We're property investors ourselves, and we built Suburb Intel AU because we wanted better tools 
                  to analyze the Australian market without spending hundreds of dollars per month. Our mission is to 
                  democratize access to professional-grade property data using FREE official government sources.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Contact Us</h2>
              <p className="mb-4">Have questions, feedback, or suggestions? We'd love to hear from you!</p>
              <div className="bg-teal-50 p-6 rounded-lg space-y-3">
                <p><strong>Contact:</strong> <a href="mailto:saravananvijayakumar@quantumleapventures.com.au" className="text-teal-600 underline">saravananvijayakumar@quantumleapventures.com.au</a></p>
              </div>
            </section>

            <section className="border-t pt-6 mt-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Owned by:</strong> Quantum Leap Ventures Pvt Ltd
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Product:</strong> Suburb Intel AU - Australian Property Intelligence Platform
                </p>
                <p className="text-sm text-gray-600 italic">
                  Last Updated: November 11, 2025 | Version 1.1 (Beta)
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
