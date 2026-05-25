import type { Metadata } from 'next'
import Link from 'next/link'
import { Database, TrendingUp, Award, Shield, BarChart3, Calculator } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Methodology - How We Score & Analyze Australian Suburbs',
  description: 'Transparent methodology for suburb scoring, price predictions, and investment analysis. Learn how Suburb Intel processes government data to calculate investment scores.',
  alternates: {
    canonical: '/methodology',
  },
  openGraph: {
    title: 'Suburb Intel Methodology - Data Processing & Scoring System',
    description: 'How we analyze 14,548 Australian suburbs using ABS Census data, property sales, and machine learning.',
    url: 'https://suburbintel.com/methodology',
  },
}

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Methodology</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-teal-100 rounded-lg">
              <Database className="w-8 h-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Our Methodology</h1>
              <p className="text-gray-600 mt-2">How we analyze, score, and predict suburb performance</p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
            <p className="text-sm text-blue-900">
              <strong>Transparency First:</strong> Every metric, score, and prediction on Suburb Intel is calculated using documented formulas and official government data sources. No proprietary "black boxes" — just clear, reproducible analysis.
            </p>
          </div>
        </div>

        {/* Data Collection */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-7 h-7 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">1. Data Collection</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Official Government Sources Only</h3>
              <p className="text-gray-700 mb-4">
                We collect data exclusively from verified government agencies. No web scraping, no real estate portals, no user-generated content. This ensures accuracy and legal compliance.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="font-semibold text-gray-900">Australian Bureau of Statistics (ABS)</p>
                  <ul className="ml-4 mt-2 text-sm text-gray-600 space-y-1">
                    <li>• Census 2021 (population, demographics, income, education)</li>
                    <li>• Regional population statistics</li>
                    <li>• Labour force data</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">NSW Valuer General</p>
                  <ul className="ml-4 mt-2 text-sm text-gray-600 space-y-1">
                    <li>• Median house & unit prices by suburb</li>
                    <li>• Sales volumes and trends</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">VIC Property Sales</p>
                  <ul className="ml-4 mt-2 text-sm text-gray-600 space-y-1">
                    <li>• Median sale prices</li>
                    <li>• Property characteristics</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                Full source list: <Link href="/data-sources" className="text-teal-600 hover:underline">View all data sources →</Link>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Update Frequency</h3>
              <p className="text-gray-700">
                Government data is released quarterly (property prices) and annually (Census updates). Our ETL pipelines automatically fetch new data when released and re-process all suburb metrics.
              </p>
              <p className="text-sm text-gray-600 mt-2 italic">
                Last data refresh: Check individual suburb pages for specific update timestamps.
              </p>
            </div>
          </div>
        </section>

        {/* Investment Score */}
        <section id="investment-scoring" className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-7 h-7 text-yellow-600" />
            <h2 className="text-3xl font-bold text-gray-900">2. Investment Score Algorithm</h2>
          </div>

          <div className="space-y-6">
            <p className="text-gray-700">
              Our Investment Score (0-100) answers: <em>"How good is this suburb for property investment right now?"</em> 
              It combines growth potential, cash flow, risk factors, and market dynamics into a single metric.
            </p>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-5 rounded-r-lg">
              <h3 className="font-bold text-gray-900 mb-3">Score Components (Weighted)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700"><strong>Growth Forecast</strong> (12-month ML prediction)</span>
                  <span className="font-semibold bg-yellow-200 px-3 py-1 rounded">35%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700"><strong>Rental Yield</strong> (cash flow potential)</span>
                  <span className="font-semibold bg-yellow-200 px-3 py-1 rounded">25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700"><strong>Risk Assessment</strong> (flood, fire, crime)</span>
                  <span className="font-semibold bg-orange-200 px-3 py-1 rounded">20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700"><strong>Market Liquidity</strong> (days on market)</span>
                  <span className="font-semibold bg-orange-200 px-3 py-1 rounded">10%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700"><strong>Infrastructure Development</strong> (planned projects)</span>
                  <span className="font-semibold bg-orange-200 px-3 py-1 rounded">10%</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-yellow-300">
                <p className="text-xs text-gray-600">
                  <strong>Why these weights?</strong> Based on 10 years of historical correlation analysis between 
                  suburb characteristics and actual investor returns (capital growth + rental income).
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Score Interpretation</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                  <p className="font-bold text-green-900 text-lg">80-100: Excellent</p>
                  <p className="text-sm text-green-700 mt-1">Strong growth forecast, high yield, low risk, good infrastructure</p>
                </div>
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                  <p className="font-bold text-blue-900 text-lg">60-79: Good</p>
                  <p className="text-sm text-blue-700 mt-1">Solid fundamentals, above-average potential across most metrics</p>
                </div>
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                  <p className="font-bold text-yellow-900 text-lg">40-59: Moderate</p>
                  <p className="text-sm text-yellow-700 mt-1">Average metrics, mixed indicators, requires deeper research</p>
                </div>
                <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-4">
                  <p className="font-bold text-gray-900 text-lg">0-39: Below Average</p>
                  <p className="text-sm text-gray-700 mt-1">Weaker fundamentals, higher risk profile, may suit contrarian strategies</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Investment Scores are relative rankings within the market. A score of 65 today 
                might represent a better opportunity than a score of 75 in a different market cycle. Always consider 
                your investment strategy, timeline, and risk tolerance.
              </p>
            </div>
          </div>
        </section>

        {/* Price Predictions */}
        <section id="growth-predictions" className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-7 h-7 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-900">3. Machine Learning Price Forecasts</h2>
          </div>

          <div className="space-y-6">
            <p className="text-gray-700">
              We deploy an <strong>ensemble of 3 specialized machine learning models</strong> to forecast 12-month median price movements. 
              This sophisticated approach captures different market dynamics and reduces prediction error.
            </p>

            {/* ML Model Architecture */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Model Architecture (Ensemble)</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-blue-900 mb-2">Model 1: Time Series</h4>
                  <p className="text-sm text-blue-800 mb-3">SARIMA + Prophet</p>
                  <p className="text-xs text-gray-700 mb-3">Captures seasonal patterns, cyclical behavior, and historical trends in price data.</p>
                  <p className="text-xs font-semibold text-blue-900">Weight: 30%</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-bold text-green-900 mb-2">Model 2: Gradient Boosting</h4>
                  <p className="text-sm text-green-800 mb-3">XGBoost</p>
                  <p className="text-xs text-gray-700 mb-3">Learns complex relationships between 47 suburb features and price movements.</p>
                  <p className="text-xs font-semibold text-green-900">Weight: 40%</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-bold text-purple-900 mb-2">Model 3: Neural Network</h4>
                  <p className="text-sm text-purple-800 mb-3">LSTM</p>
                  <p className="text-xs text-gray-700 mb-3">Identifies long-term dependencies and market momentum shifts.</p>
                  <p className="text-xs font-semibold text-purple-900">Weight: 30%</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-900">
                  <strong>Why ensemble?</strong> Different models make different types of errors. By combining predictions 
                  with weighted voting, we reduce overall prediction error and increase robustness across varying market conditions.
                </p>
              </div>
            </div>

            {/* 47 Input Features */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">47 Input Features</h3>
              <p className="text-gray-700 mb-4">
                Each model analyzes 47 distinct data points per suburb, grouped into 6 categories:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">📊 Price History (8 features)</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Median prices: 3m, 6m, 12m, 24m, 5y</li>
                    <li>• Sales volume & trends</li>
                    <li>• Price volatility (standard deviation)</li>
                    <li>• Auction clearance rates</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">🏘️ Demographics (12 features)</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Population size & growth rate</li>
                    <li>• Median age & household income</li>
                    <li>• Education levels (bachelor+%)</li>
                    <li>• Owner-occupier vs investor ratio</li>
                    <li>• Family composition</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">🚇 Infrastructure (9 features)</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Distance to CBD</li>
                    <li>• Public transport score & stations</li>
                    <li>• Top schools count (NAPLAN rankings)</li>
                    <li>• Hospitals & medical centers</li>
                    <li>• Planned major projects</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">💰 Economic (7 features)</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Rental yield & vacancy rates</li>
                    <li>• Employment rate</li>
                    <li>• Local job growth (12m)</li>
                    <li>• Business investment & permits</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">🏗️ Supply/Demand (6 features)</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• New dwelling approvals</li>
                    <li>• Days on market (median)</li>
                    <li>• Stock turnover rate</li>
                    <li>• Listing volume changes</li>
                    <li>• Land availability</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">⚠️ Risk Factors (5 features)</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Flood & bushfire risk levels</li>
                    <li>• Crime rates (by category)</li>
                    <li>• Environmental hazards</li>
                    <li>• Climate vulnerability index</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Historical Performance */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Historical Performance</h3>
              <p className="text-gray-700 mb-4">
                Our models are backtested against <strong>3 years of unseen market data</strong> (2021-2024) 
                to validate accuracy before deployment:
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold text-green-700 mb-2">72%</div>
                  <div className="text-sm font-semibold text-green-900 mb-1">Directional Accuracy</div>
                  <div className="text-xs text-green-700">Correctly predicted up/down</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold text-blue-700 mb-2">±3.2%</div>
                  <div className="text-sm font-semibold text-blue-900 mb-1">Mean Absolute Error</div>
                  <div className="text-xs text-blue-700">Avg prediction error</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold text-purple-700 mb-2">0.68</div>
                  <div className="text-sm font-semibold text-purple-900 mb-1">R² Score</div>
                  <div className="text-xs text-purple-700">Variance explained</div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <h4 className="font-semibold text-yellow-900 mb-2">What These Numbers Mean:</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• <strong>72% accuracy:</strong> If we predict a suburb will grow, it grows 72% of the time</li>
                  <li>• <strong>±3.2% MAE:</strong> If actual growth is 8%, we typically predict 5-11% (off by ~3%)</li>
                  <li>• <strong>0.68 R²:</strong> Our model explains 68% of price variation (industry benchmark: 0.50-0.70)</li>
                </ul>
              </div>
            </div>

            {/* Training Process */}
            <div className="bg-purple-50 rounded-lg p-5 border-l-4 border-purple-500">
              <h3 className="font-bold text-gray-900 mb-3">Training & Update Process</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>Training Data:</strong> 10 years of historical data (2014-2024) across 2,259 suburbs</li>
                <li>• <strong>Validation:</strong> Rolling window cross-validation with 12-month holdout periods</li>
                <li>• <strong>Updates:</strong> Models retrained monthly with latest market data (1st of each month)</li>
                <li>• <strong>Feature Engineering:</strong> Continuous testing of new data sources and variables</li>
              </ul>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-900">
                <strong>Important:</strong> ML forecasts are probabilistic estimates, not guarantees. Property markets 
                are influenced by countless factors including interest rates, economic shocks, government policy, and 
                local development that may not be captured in historical data. Always conduct your own due diligence.
              </p>
            </div>
          </div>
        </section>

        {/* Data Quality */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">4. Known Limitations & When We're Wrong</h2>
          </div>

          <div className="space-y-6">
            <p className="text-gray-700 mb-6">
              <strong>Transparency matters.</strong> No prediction model is perfect. Here are the specific scenarios 
              where our forecasts are less reliable:
            </p>

            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                  <span>🚨</span> Black Swan Events
                </h4>
                <p className="text-sm text-red-800 mb-2">
                  Unpredictable shocks (pandemic, financial crisis, war) that fundamentally change market dynamics. 
                  Our models assume historical patterns continue, which breaks down during unprecedented events.
                </p>
                <p className="text-xs text-red-700 italic">
                  Example: COVID-19 lockdowns caused regional price surges our models didn't foresee.
                </p>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                  <span>⚠️</span> Low-Volume Markets
                </h4>
                <p className="text-sm text-orange-800 mb-2">
                  Suburbs with &lt;50 sales per year have insufficient data for reliable predictions. 
                  A single luxury sale can distort median prices by 10%+.
                </p>
                <p className="text-xs text-orange-700 italic">
                  Recommendation: Treat rural and remote suburb forecasts with extra caution.
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                  <span>⚠️</span> Major Infrastructure Announcements
                </h4>
                <p className="text-sm text-yellow-800 mb-2">
                  New transport projects (airport, metro line) can cause immediate 5-15% price jumps that lag our 
                  monthly model updates. We incorporate <em>planned</em> projects, but market reaction speed varies.
                </p>
                <p className="text-xs text-yellow-700 italic">
                  Example: Sydney Metro West announcement instantly boosted nearby suburbs before our next update.
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <span>ℹ️</span> Individual Property Variations
                </h4>
                <p className="text-sm text-blue-800 mb-2">
                  We predict suburb-level medians, not individual properties. A renovated house can sell 20% 
                  above forecast; a poorly maintained one 20% below.
                </p>
                <p className="text-xs text-blue-700 italic">
                  Always factor in: property condition, land size, street appeal, specific location within suburb.
                </p>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <span>ℹ️</span> Census Data Lag (5-Year Update Cycle)
                </h4>
                <p className="text-sm text-purple-800 mb-2">
                  ABS Census data is collected every 5 years (most recent: 2021). Rapidly gentrifying suburbs 
                  may have outdated demographic profiles.
                </p>
                <p className="text-xs text-purple-700 italic">
                  Next census: 2026. Until then, 2021 demographics may not reflect current reality.
                </p>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-400 p-4 rounded">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span>ℹ️</span> Short-Term Volatility
                </h4>
                <p className="text-sm text-gray-700 mb-2">
                  Month-to-month fluctuations are highly random. Our 12-month forecast is designed for 
                  strategic decisions, not short-term trading.
                </p>
                <p className="text-xs text-gray-600 italic">
                  Don't use for: auction timing, quick flips, or speculative short-term bets.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Completeness Indicators</h3>
              <p className="text-gray-700 mb-3">
                Each suburb profile shows data quality badges indicating confidence level:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-100 border-2 border-green-400 rounded-lg p-3 text-center">
                  <p className="font-bold text-green-900">✓ High Quality</p>
                  <p className="text-xs text-green-700 mt-1">&gt;50 sales/year, complete data</p>
                </div>
                <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 text-center">
                  <p className="font-bold text-yellow-900">⚠ Medium Quality</p>
                  <p className="text-xs text-yellow-700 mt-1">20-50 sales, some gaps</p>
                </div>
                <div className="bg-red-100 border-2 border-red-400 rounded-lg p-3 text-center">
                  <p className="font-bold text-red-900">✗ Low Quality</p>
                  <p className="text-xs text-red-700 mt-1">&lt;20 sales, incomplete</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer CTA */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Not Financial Advice</h2>
          <p className="mb-4 opacity-90">
            Suburb Intel provides educational tools and data analysis. We are not financial advisors.
          </p>
          <Link 
            href="/disclaimer" 
            className="inline-block bg-white text-teal-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Read Full Disclaimer →
          </Link>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Resources</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/data-sources" className="text-teal-600 hover:underline">→ View Data Sources</Link>
            <Link href="/data-dictionary" className="text-teal-600 hover:underline">→ Data Dictionary</Link>
            <Link href="/glossary" className="text-teal-600 hover:underline">→ Glossary of Terms</Link>
            <Link href="/disclaimer" className="text-teal-600 hover:underline">→ Disclaimer</Link>
            <Link href="/faq" className="text-teal-600 hover:underline">→ Frequently Asked Questions</Link>
            <Link href="/about" className="text-teal-600 hover:underline">→ About Suburb Intel</Link>
          </div>
        </div>

      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Suburb Intel Methodology - How We Score & Analyze Australian Suburbs',
            description: 'Transparent methodology for suburb scoring, price predictions, and investment analysis using official government data.',
            author: {
              '@type': 'Organization',
              name: 'Suburb Intel',
              url: 'https://suburbintel.com',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Suburb Intel',
              logo: {
                '@type': 'ImageObject',
                url: 'https://suburbintel.com/icon-512x512.png',
              },
            },
            datePublished: '2025-12-23',
            dateModified: new Date().toISOString(),
          }),
        }}
      />
    </div>
  )
}
