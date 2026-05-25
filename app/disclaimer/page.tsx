import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Disclaimer - Not Financial Advice | Suburb Intel',
  description: 'Important legal disclaimer: Suburb Intel provides educational data analysis only. We are not financial advisors and do not provide investment recommendations.',
  alternates: {
    canonical: '/disclaimer',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Disclaimer</span>
        </nav>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-red-100 rounded-lg flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Important Disclaimer</h1>
              <p className="text-xl text-red-600 font-semibold">This is NOT financial advice</p>
            </div>
          </div>

          <div className="bg-red-50 border-2 border-red-300 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold text-red-900 mb-3">Read This First</h2>
            <p className="text-red-900 leading-relaxed">
              Suburb Intel is an <strong>educational data analysis platform</strong>. We aggregate official government statistics and present them in an accessible format. We do NOT provide financial advice, investment recommendations, or property valuations.
            </p>
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Not Financial or Investment Advice</h2>
              <p className="mb-3">
                All data, analysis, scores, predictions, and content on Suburb Intel are provided for <strong>informational and educational purposes only</strong>. Nothing on this website constitutes:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Financial advice or recommendations</li>
                <li>Investment advice or property recommendations</li>
                <li>Tax, legal, or accounting advice</li>
                <li>Property valuations or appraisals</li>
                <li>Guarantees of future performance or returns</li>
              </ul>
              <p className="mt-4 font-semibold text-gray-900">
                You should consult qualified professionals (financial advisors, accountants, lawyers) before making any property investment decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Data Accuracy & Limitations</h2>
              <p className="mb-3">
                While we source data from official government agencies (ABS, NSW Valuer General, VIC Property Sales), we cannot guarantee:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Accuracy:</strong> Data may contain errors, delays, or omissions from original sources</li>
                <li><strong>Completeness:</strong> Some suburbs have limited data due to low sales volumes</li>
                <li><strong>Currency:</strong> Government data is released quarterly/annually and may not reflect current market conditions</li>
                <li><strong>Applicability:</strong> Aggregated data does not reflect specific properties or individual circumstances</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Predictions & Forecasts</h2>
              <p className="mb-3 font-semibold text-red-700">
                Past performance is not indicative of future results.
              </p>
              <p>
                Price predictions, growth forecasts, and investment scores are statistical estimates based on historical data. They do not account for:
              </p>
              <ul className="list-disc ml-6 space-y-2 mt-3">
                <li>Future interest rate changes</li>
                <li>Economic conditions and market cycles</li>
                <li>Government policy changes (tax, zoning, grants)</li>
                <li>Local infrastructure projects or closures</li>
                <li>Natural disasters, pandemics, or unforeseen events</li>
                <li>Individual property condition, location within suburb, or specific features</li>
              </ul>
              <p className="mt-4 font-semibold text-gray-900">
                Property markets are highly unpredictable. Any investment carries risk of loss.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Investment Risk</h2>
              <p className="mb-3">
                Property investment involves significant financial risk, including:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Capital loss:</strong> Property values can decline, resulting in negative equity</li>
                <li><strong>Liquidity risk:</strong> Properties cannot be quickly sold without potential loss</li>
                <li><strong>Vacancy risk:</strong> Rental properties may remain vacant for extended periods</li>
                <li><strong>Maintenance costs:</strong> Unexpected repairs and ongoing expenses</li>
                <li><strong>Debt obligations:</strong> Mortgages must be repaid regardless of property value or rental income</li>
              </ul>
              <p className="mt-4 font-semibold text-red-700">
                Only invest money you can afford to lose. Do not rely solely on our data for investment decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. No Warranties</h2>
              <p>
                Suburb Intel is provided "as is" without warranties of any kind, express or implied. We do not warrant that:
              </p>
              <ul className="list-disc ml-6 space-y-2 mt-3">
                <li>The platform will be error-free or uninterrupted</li>
                <li>Data is accurate, complete, or up-to-date</li>
                <li>Results will meet your requirements</li>
                <li>Defects will be corrected</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
              <p className="mb-3">
                To the maximum extent permitted by law, Suburb Intel and its operators:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Are not liable for any direct, indirect, incidental, or consequential damages</li>
                <li>Are not responsible for investment losses or financial harm</li>
                <li>Do not accept liability for decisions made based on our data</li>
                <li>Are not liable for third-party data source errors</li>
              </ul>
              <p className="mt-4 font-semibold text-gray-900">
                Your use of Suburb Intel is entirely at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Links & Data</h2>
              <p>
                We link to external government websites and data sources. We are not responsible for:
              </p>
              <ul className="list-disc ml-6 space-y-2 mt-3">
                <li>Accuracy or availability of third-party content</li>
                <li>Privacy practices of external sites</li>
                <li>Changes or errors in source data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Australian Jurisdiction</h2>
              <p>
                Suburb Intel is operated from Australia and intended for Australian users. Data and analysis are specific to the Australian property market. If you access this platform from outside Australia, you do so at your own risk and are responsible for compliance with local laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Disclaimer</h2>
              <p>
                We may update this disclaimer at any time without notice. Continued use of the platform after changes constitutes acceptance of the updated terms.
              </p>
              <p className="mt-3 text-sm text-gray-600">
                Last updated: December 23, 2025
              </p>
            </section>

          </div>

          <div className="mt-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-3">Understand the Risks</h2>
            <p className="mb-6 opacity-90">
              Property investment is complex. Always seek professional advice before making financial decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/methodology" 
                className="inline-block bg-white text-teal-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
              >
                Our Methodology →
              </Link>
              <Link 
                href="/data-sources" 
                className="inline-block bg-white/10 border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/20 transition"
              >
                Data Sources →
              </Link>
            </div>
          </div>

        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Questions about our disclaimer? <Link href="/support" className="text-teal-600 hover:underline">Contact Support</Link></p>
        </div>

      </div>
    </div>
  )
}
