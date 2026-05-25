import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service | Suburb Intel AU',
  description: 'Terms of Service for Suburb Intel AU - Rules and guidelines for using our platform',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-teal-600 hover:underline mb-6 inline-block">
          ← Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-2">
            <strong>Quantum Leap Ventures Pvt Ltd</strong>
          </p>
          <p className="text-gray-600 mb-8">Last Updated: November 25, 2025</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Suburb Intel AU ("the Service"), a product of <strong>Quantum Leap Ventures Pvt Ltd</strong>, 
                you agree to be bound by these Terms of Service ("Terms"). 
                If you disagree with any part of these terms, you may not access the Service.
              </p>
              <p className="mt-3 text-sm bg-blue-50 p-3 rounded">
                <strong>Company Details:</strong> Suburb Intel AU is owned and operated by Quantum Leap Ventures Pvt Ltd, 
                an Australian-registered company.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Description of Service</h2>
              <p className="mb-4">
                Suburb Intel AU provides property market intelligence and analysis tools for Australian suburbs. Our services include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Suburb search and property market data</li>
                <li>Financial calculators for investment analysis</li>
                <li>Suburb comparison tools</li>
                <li>Market insights and analytical reports</li>
              </ul>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                <p className="font-semibold text-yellow-800">⚠️ BETA SERVICE NOTICE</p>
                <p className="text-sm text-yellow-700 mt-2">
                  This platform is currently in BETA. Data may be limited, incomplete, or contain inaccuracies. 
                  We are actively improving data quality and adding features.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">3. Data Sources and Accuracy</h2>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <p className="font-semibold text-green-800">✓ OFFICIAL GOVERNMENT DATA SOURCES</p>
                <p className="text-sm text-green-700 mt-2">
                  All property data on Suburb Intel AU is sourced from official Australian government agencies and publicly available data portals.
                </p>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Official Data Sources:</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>State Valuer-General Offices:</strong> NSW, VIC, QLD, WA, SA, TAS, NT, ACT
                  <ul className="list-circle pl-6 text-sm mt-1">
                    <li>Median property prices by suburb</li>
                    <li>Land valuations and sales data</li>
                    <li>Official property market statistics</li>
                    <li>Quarterly valuation updates</li>
                  </ul>
                </li>
                <li><strong>Australian Bureau of Statistics (ABS):</strong>
                  <ul className="list-circle pl-6 text-sm mt-1">
                    <li>Census data (demographics, population, household composition)</li>
                    <li>Median household income by suburb</li>
                    <li>Employment statistics and socio-economic indexes (SEIFA)</li>
                    <li>Housing characteristics and rental statistics</li>
                    <li>Age distribution and education levels</li>
                  </ul>
                </li>
                <li><strong>Government Open Data Portals:</strong>
                  <ul className="list-circle pl-6 text-sm mt-1">
                    <li>data.nsw.gov.au - NSW Government Open Data Portal</li>
                    <li>discover.data.vic.gov.au - Victorian Data Directory</li>
                    <li>data.qld.gov.au - Queensland Open Data Portal</li>
                    <li>data.sa.gov.au - South Australian Open Data</li>
                    <li>api.data.abs.gov.au - ABS Data API</li>
                  </ul>
                </li>
                <li><strong>Publicly Available Internet Sources:</strong>
                  <ul className="list-circle pl-6 text-sm mt-1">
                    <li>Government infrastructure project databases and announcements</li>
                    <li>School performance data from MySchool (ACARA)</li>
                    <li>Crime statistics from state police departments</li>
                    <li>Public transport data from transport authorities</li>
                    <li>Amenity and facility data from local council websites</li>
                    <li>Environmental data from government environmental agencies</li>
                  </ul>
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-800">Data Coverage:</h3>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-green-800 mb-2">
                  <strong>Current Coverage:</strong> 2,259+ Australian suburbs across all states and territories
                </p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>✓ NSW: Sydney metro, regional cities, coastal areas</li>
                  <li>✓ VIC: Melbourne metro, Geelong, regional Victoria</li>
                  <li>✓ QLD: Brisbane, Gold Coast, Sunshine Coast, Cairns</li>
                  <li>✓ WA: Perth metro, regional Western Australia</li>
                  <li>✓ SA: Adelaide metro, regional South Australia</li>
                  <li>✓ TAS: Hobart, Launceston, regional Tasmania</li>
                  <li>✓ NT: Darwin, Alice Springs</li>
                  <li>✓ ACT: Canberra suburbs</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-gray-800">Data Attribution:</h3>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-800 mb-2">
                  We acknowledge and attribute our data sources in accordance with government open data licensing:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✓ Property valuations: State Valuer-General offices</li>
                  <li>✓ Demographics: Australian Bureau of Statistics</li>
                  <li>✓ Market data: Government open data portals</li>
                </ul>
                <p className="text-xs text-blue-600 mt-2 italic">
                  All data used in accordance with Creative Commons licensing and Australian Government open data policies.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-gray-800">Data Accuracy and Limitations:</h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                <p className="font-semibold text-yellow-800">⚠️ IMPORTANT DISCLAIMER</p>
                <p className="text-sm text-yellow-700 mt-2">
                  While we use official government data sources, property markets are dynamic and data may be 3-6 months old 
                  due to quarterly government update cycles. We do NOT guarantee the accuracy, completeness, timeliness, 
                  or reliability of any information provided.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="font-semibold text-red-800 uppercase">Critical Legal Requirement</p>
                <p className="text-sm text-red-700 mt-2">
                  <strong>You MUST verify all data independently</strong> with licensed real estate agents, property valuers, 
                  and current market sources before making any financial or investment decisions. Government data represents 
                  historical snapshots and may not reflect current market conditions.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-gray-800 mt-4">No Warranty:</h3>
              <p className="text-sm text-gray-700">
                While our data comes from reputable government sources, we provide the Service "as is" without any warranties, 
                express or implied. We do not warrant that data will be error-free, up-to-date, or suitable for your specific purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Not Financial Advice</h2>
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="font-semibold text-red-800">⚠️ CRITICAL DISCLAIMER</p>
                <p className="text-sm text-red-700 mt-2">
                  <strong>Quantum Leap Ventures Pvt Ltd and Suburb Intel AU do NOT provide financial, investment, legal, or tax advice.</strong> 
                  All information, analysis, and reports are for general informational and educational purposes only. 
                </p>
                <p className="text-sm text-red-700 mt-3">
                  You should consult with qualified professionals (financial advisors, accountants, lawyers, licensed real estate agents) 
                  before making any investment decisions.
                </p>
                <p className="text-sm text-red-700 mt-3">
                  <strong>We are NOT:</strong>
                </p>
                <ul className="text-sm text-red-700 space-y-1 mt-2 pl-4">
                  <li>✗ Licensed financial advisors or planners</li>
                  <li>✗ Licensed real estate agents or brokers</li>
                  <li>✗ Qualified property valuers</li>
                  <li>✗ Tax accountants or legal advisors</li>
                  <li>✗ Mortgage brokers or lenders</li>
                </ul>
                <p className="text-sm text-red-700 mt-3 font-semibold">
                  Past performance and government data does not guarantee future results. Property investment carries risks 
                  including capital loss, market volatility, and liquidity issues.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">5. User Accounts</h2>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">5.1 Account Creation</h3>
              <p className="mb-3">To access premium features, you must create an account. You agree to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Be responsible for all activity under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-800">5.2 Account Eligibility</h3>
              <p>You must be at least 18 years old to create an account. By creating an account, you represent that you meet this requirement.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">6. Subscription and Payment</h2>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">6.1 Pricing</h3>
              <p className="mb-3">We offer the following subscription tiers:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Free Tier:</strong> $0 AUD/month - Basic search and limited features</li>
                <li><strong>Premium:</strong> $29 AUD/month - Full access to all features</li>
              </ul>
              <p className="text-sm bg-blue-50 p-3 rounded">
                <strong>Beta Pricing Notice:</strong> Current pricing reflects beta status and includes access to FREE government data sources. 
                Prices may change after full launch with 30 days notice to existing subscribers.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-800 mt-4">6.2 Billing</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Subscriptions renew automatically monthly unless cancelled</li>
                <li>Payments are processed securely through Stripe</li>
                <li>All fees are in Australian Dollars (AUD)</li>
                <li>No refunds for partial months or unused features</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-800 mt-4">6.3 Cancellation</h3>
              <p>
                You may cancel your subscription at any time. Access continues until the end of your current billing period. 
                No refunds will be provided for the remaining subscription period.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">7. Acceptable Use</h2>
              <p className="mb-3">You agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service for any illegal purpose</li>
                <li>Scrape, copy, or redistribute our data without permission</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Upload viruses, malware, or harmful code</li>
                <li>Impersonate others or misrepresent your affiliation</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Use automated tools (bots) to access the Service excessively</li>
                <li>Reverse engineer or decompile any part of the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">8. Intellectual Property</h2>
              <p>
                All content, features, and functionality of the Service, including but not limited to text, graphics, logos, 
                and software, are owned by Suburb Intel AU and protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="mt-3">
                You may not copy, modify, distribute, sell, or create derivative works without our explicit written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">9. Limitation of Liability</h2>
              <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
                <p className="font-semibold text-gray-800 uppercase">Important Legal Protection</p>
                <p className="text-sm text-gray-700 mt-2">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, QUANTUM LEAP VENTURES PTY LTD AND SUBURB INTEL AU SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
                  SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2 text-sm text-gray-700">
                  <li>Loss of profits or revenue from investment decisions</li>
                  <li>Loss of data or business opportunities</li>
                  <li>Investment losses based on government data or our information</li>
                  <li>Errors, omissions, or inaccuracies in data provided (including government data)</li>
                  <li>Service interruptions or unavailability</li>
                  <li>Reliance on outdated government data</li>
                </ul>
                <p className="text-sm text-gray-700 mt-3">
                  <strong>OUR TOTAL LIABILITY IS LIMITED TO THE AMOUNT YOU PAID IN THE LAST 12 MONTHS, OR $100 AUD, WHICHEVER IS LESS.</strong>
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>GOVERNMENT DATA DISCLAIMER:</strong> While we use official government sources, we are not responsible for 
                  any errors, delays, or omissions in government-published data. You acknowledge that government data may be outdated 
                  and must be independently verified.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">10. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Quantum Leap Ventures Pvt Ltd, Suburb Intel AU, 
                its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses 
                (including legal fees) arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">11. Service Availability</h2>
              <p>
                We strive for 99% uptime but do not guarantee uninterrupted access. We may suspend or terminate the Service 
                for maintenance, updates, or unforeseen circumstances without liability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">12. Termination</h2>
              <p className="mb-3">We may terminate or suspend your account immediately, without notice, for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violation of these Terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Non-payment of fees</li>
                <li>At our sole discretion for any reason</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">13. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Material changes will be communicated via email or 
                prominent notice on the website. Continued use after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">14. Governing Law</h2>
              <p>
                These Terms are governed by the laws of New South Wales, Australia. Any disputes shall be resolved in the courts 
                of New South Wales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">15. Contact Information</h2>
              <p className="mb-3">For questions about these Terms:</p>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="mb-2"><strong>Company:</strong> Quantum Leap Ventures Pvt Ltd</p>
                <p className="mb-2"><strong>Product:</strong> Suburb Intel AU</p>
                <p className="mb-2"><strong>Support Email:</strong> <a href="mailto:saravananvijayakumar@quantumleapventures.com.au" className="text-teal-600 underline">saravananvijayakumar@quantumleapventures.com.au</a></p>
                <p className="mb-2"><strong>Contact:</strong> <a href="mailto:saravananvijayakumar@quantumleapventures.com.au" className="text-teal-600 underline">saravananvijayakumar@quantumleapventures.com.au</a></p>
              </div>
            </section>

            <section className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-600 mb-3">
                By using Suburb Intel AU, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Company:</strong> Quantum Leap Ventures Pvt Ltd | <strong>Product:</strong> Suburb Intel AU - Australian Property Intelligence Platform
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
