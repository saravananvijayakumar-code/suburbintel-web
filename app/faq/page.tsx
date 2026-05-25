import { COVERAGE_MESSAGING } from '@/lib/constants/coverage'
import { PRICING, getPricingMessage } from '@/lib/constants/pricing'

export default function FAQPage() {
  const pricingMessage = getPricingMessage('monthly')
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {/* Data Sources */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">What data sources do you use?</h2>
            <p className="text-gray-700 mb-3">
              We exclusively use official Australian government data sources and publicly available data from verified government portals:
            </p>
            <div className="space-y-2 text-gray-600">
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <strong>State Valuer-General Offices:</strong> NSW, VIC, QLD, WA, SA, TAS, NT, ACT
                  <p className="text-sm text-gray-500 ml-5">Median property prices, land valuations, sales data</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <strong>Australian Bureau of Statistics (ABS):</strong>
                  <p className="text-sm text-gray-500 ml-5">Census data, demographics, population, median income, employment statistics</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <strong>Government Open Data Portals:</strong>
                  <p className="text-sm text-gray-500 ml-5">data.nsw.gov.au, discover.data.vic.gov.au, data.qld.gov.au, api.data.abs.gov.au</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <strong>Publicly Available Internet Sources:</strong>
                  <p className="text-sm text-gray-500 ml-5">Infrastructure projects, school ratings, amenity data from verified government and public sources</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
              <strong>Note:</strong> {COVERAGE_MESSAGING.faq_which_suburbs}
            </div>
          </div>

          {/* Accuracy */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">How accurate is your data?</h2>
            <p className="text-gray-700 mb-3">
              All data is sourced from official Australian government agencies and publicly available verified sources. However:
            </p>
            <div className="space-y-2 text-gray-600">
              <p>✓ <strong>Government Data:</strong> Official and verified, but may be 3-6 months old due to quarterly update cycles</p>
              <p>✓ <strong>Coverage:</strong> {COVERAGE_MESSAGING.details}</p>
              <p>⚠️ <strong>Important:</strong> Property markets change rapidly. Always verify current data with licensed agents and valuers before making investment decisions</p>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
              <strong>Disclaimer:</strong> While we use official government sources, we do not guarantee accuracy or completeness. Government data represents historical snapshots and may not reflect current market conditions.
            </div>
          </div>

          {/* Update Frequency */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">How often is data updated?</h2>
            <p className="text-gray-700 mb-3">
              Data update frequency depends on the government source:
            </p>
            <div className="space-y-2 text-gray-600">
              <p>📊 <strong>Property Valuations:</strong> Quarterly updates from State Valuer-General offices</p>
              <p>📈 <strong>Market Data:</strong> Monthly updates from government open data portals</p>
              <p>👥 <strong>Demographics:</strong> Annual updates from ABS Census and surveys</p>
              <p>🏗️ <strong>Infrastructure:</strong> Real-time updates from public announcements and government project databases</p>
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm text-green-800">
              We refresh our database monthly to incorporate the latest government data releases.
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">How does your AI analysis work?</h2>
            <p className="text-gray-700 mb-3">
              Our AI-powered insights use GPT-4 to analyze official government data and provide:
            </p>
            <div className="space-y-2 text-gray-600">
              <p>🤖 <strong>Pattern Recognition:</strong> Identifies trends across 69+ data points from government sources</p>
              <p>📊 <strong>Multi-Dimensional Analysis:</strong> Combines pricing, demographics, infrastructure, and market data</p>
              <p>💡 <strong>Investment Insights:</strong> Generates summaries, risk warnings, and future predictions based on historical government data</p>
            </div>
            <div className="mt-4 p-3 bg-purple-50 rounded-lg text-sm text-purple-800">
              <strong>Important:</strong> AI analysis is for informational purposes only and does not constitute financial advice. Always consult licensed professionals.
            </div>
          </div>

          {/* Investment Scores */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">How are investment scores calculated?</h2>
            <p className="text-gray-700 mb-3">
              Our 5-factor algorithm analyzes government data across multiple dimensions:
            </p>
            <div className="space-y-2 text-gray-600">
              <p>1. <strong>Rental Yield (0-25 points):</strong> Calculated from median rent and median price data</p>
              <p>2. <strong>Growth (0-30 points):</strong> Historical price growth from Valuer-General records</p>
              <p>3. <strong>Momentum (0-20 points):</strong> Recent market trends and acceleration</p>
              <p>4. <strong>Affordability (0-15 points):</strong> Price relative to state median and income data</p>
              <p>5. <strong>Market Dynamics (0-10 points):</strong> Supply, demand, and location factors</p>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
              Scores are automatically recalculated monthly when government data is updated.
            </div>
          </div>

          {/* Data Verification */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Should I verify the data independently?</h2>
            <p className="text-gray-700 mb-3">
              <strong>YES, ABSOLUTELY!</strong> While our data comes from official government sources:
            </p>
            <div className="space-y-2 text-gray-600">
              <p>⚠️ Government data may be 3-6 months old</p>
              <p>⚠️ Property markets change rapidly and current prices may differ</p>
              <p>⚠️ Local factors not captured in government data can affect value</p>
              <p>⚠️ You must conduct due diligence before making investment decisions</p>
            </div>
            <div className="mt-4 p-3 bg-red-50 rounded-lg text-sm text-red-800">
              <strong>Legal Requirement:</strong> Always verify current data with licensed real estate agents, property valuers, and qualified financial advisors before investing.
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">What are your pricing plans?</h2>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900">Free Tier - $0/month</p>
                <p className="text-sm text-gray-600">Basic search, limited suburb data, 5 comparisons/month</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-blue-900">Pro - {pricingMessage.headline}</p>
                <p className="text-sm text-blue-700">{COVERAGE_MESSAGING.hero}, unlimited comparisons, AI insights, investment heatmap, portfolio tracking</p>
                <p className="text-xs text-amber-700 font-semibold mt-1">{pricingMessage.fine_print}</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
              <strong>Beta Pricing:</strong> Current pricing reflects beta status. Prices may change after full launch with 30 days notice.
            </div>
          </div>

          {/* Coverage */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Which areas do you cover?</h2>
            <p className="text-gray-700 mb-3">
              {COVERAGE_MESSAGING.faq_which_suburbs}
            </p>
            <div className="grid grid-cols-2 gap-3 text-gray-600">
              <div className="p-3 bg-blue-50 rounded">
                <p className="font-semibold text-blue-900">NSW</p>
                <p className="text-sm text-blue-700">Sydney metro + regional</p>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <p className="font-semibold text-purple-900">VIC</p>
                <p className="text-sm text-purple-700">Melbourne metro + regional</p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <p className="font-semibold text-green-900">QLD</p>
                <p className="text-sm text-green-700">Brisbane, Gold Coast + more</p>
              </div>
              <div className="p-3 bg-orange-50 rounded">
                <p className="font-semibold text-orange-900">WA, SA, TAS, NT, ACT</p>
                <p className="text-sm text-orange-700">Major cities + regions</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm text-green-800">
              We're continuously expanding coverage with new government data releases.
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">How can I contact support?</h2>
            <p className="text-gray-700 mb-3">
              For questions, issues, or feedback:
            </p>
            <div className="space-y-2 text-gray-600">
              <p>📧 <strong>Email:</strong> <a href="mailto:saravananvijayakumar@quantumleapventures.com.au" className="text-blue-600 hover:underline">saravananvijayakumar@quantumleapventures.com.au</a></p>
              <p>🏢 <strong>Company:</strong> Quantum Leap Ventures Pvt Ltd</p>
              <p>⏱️ <strong>Response Time:</strong> Typically within 24-48 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
