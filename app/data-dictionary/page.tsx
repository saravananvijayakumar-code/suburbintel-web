import type { Metadata } from 'next'
import Link from 'next/link'
import { Database, Info } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Data Dictionary - All Metrics & Fields Explained',
  description: 'Complete reference for every data field and metric available on Suburb Intel. Understand formulas, units, and data sources.',
  alternates: {
    canonical: '/data-dictionary',
  },
}

export default function DataDictionaryPage() {
  const fields = [
    { field: 'suburbName', type: 'String', description: 'Official suburb name from ABS', example: 'Melbourne', source: 'ABS ASGS' },
    { field: 'state', type: 'String (2-3 chars)', description: 'Australian state/territory code', example: 'VIC', source: 'ABS' },
    { field: 'postcode', type: 'String (4 digits)', description: 'Australia Post postcode', example: '3000', source: 'Australia Post' },
    { field: 'medianPrice', type: 'Number (AUD)', description: 'Median house sale price in suburb', example: '1250000', source: 'NSW VG / VIC Property' },
    { field: 'medianUnitPrice', type: 'Number (AUD)', description: 'Median apartment/unit price', example: '650000', source: 'NSW VG / VIC Property' },
    { field: 'weeklyRent', type: 'Number (AUD)', description: 'Median weekly rent for houses', example: '550', source: 'CoreLogic / Domain' },
    { field: 'rentalYield', type: 'Percentage', description: '(weeklyRent × 52 / medianPrice) × 100', example: '2.3%', source: 'Calculated' },
    { field: 'growth12m', type: 'Percentage', description: '% change in median price over 12 months', example: '8.5%', source: 'Calculated from historical prices' },
    { field: 'growth6m', type: 'Percentage', description: '% change in median price over 6 months', example: '4.2%', source: 'Calculated' },
    { field: 'growth3m', type: 'Percentage', description: '% change in median price over 3 months', example: '1.8%', source: 'Calculated' },
    { field: 'investmentScore', type: 'Number (0-100)', description: 'Weighted score: 35% growth12m, 25% yield, 15% affordability, 15% demographics, 10% infrastructure', example: '73', source: 'Proprietary calculation' },
    { field: 'population', type: 'Number', description: 'Total population from Census', example: '15234', source: 'ABS Census 2021' },
    { field: 'medianAge', type: 'Number (years)', description: 'Median age of residents', example: '34', source: 'ABS Census' },
    { field: 'medianIncome', type: 'Number (AUD/year)', description: 'Median household income (annual)', example: '89500', source: 'ABS Census' },
    { field: 'familiesPercent', type: 'Percentage', description: '% of households classified as families', example: '68%', source: 'ABS Census' },
    { field: 'unemploymentRate', type: 'Percentage', description: '% of labour force unemployed', example: '4.2%', source: 'ABS Census' },
    { field: 'schoolQualityScore', type: 'Number (0-100)', description: 'Composite score based on NAPLAN results and school density', example: '82', source: 'ACARA / Calculated' },
    { field: 'trainStationDistance', type: 'Number (km)', description: 'Distance to nearest train station', example: '1.2', source: 'OpenStreetMap / Calculated' },
    { field: 'hospitalDistance', type: 'Number (km)', description: 'Distance to nearest hospital', example: '3.5', source: 'OpenStreetMap' },
    { field: 'lastUpdated', type: 'ISO Date', description: 'Timestamp of last data refresh for this suburb', example: '2025-12-20T05:30:00Z', source: 'System generated' },
    { field: 'dataQuality', type: 'String', description: 'HIGH / MEDIUM / LOW based on sales volume and data completeness', example: 'HIGH', source: 'Calculated' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Data Dictionary</span>
        </nav>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Database className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Data Dictionary</h1>
              <p className="text-gray-600 mt-2">Technical reference for all fields and metrics</p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
            <p className="text-sm text-blue-900">
              <strong>For Developers & Analysts:</strong> This dictionary defines every data field returned by Suburb Intel, including data types, calculation methods, and source attribution.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Field Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Data Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Example</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {fields.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-purple-700">{item.field}</code>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{item.example}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-yellow-900 mb-2">Data Refresh Schedule</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Property Prices:</strong> Quarterly (aligned with NSW VG and VIC Property releases)</li>
                <li>• <strong>Census Data:</strong> Every 5 years (most recent: 2021)</li>
                <li>• <strong>Infrastructure:</strong> Annually (OpenStreetMap updates)</li>
                <li>• <strong>Calculated Metrics:</strong> Updated whenever source data changes</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Resources</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/methodology" className="text-teal-600 hover:underline">→ Methodology</Link>
            <Link href="/data-sources" className="text-teal-600 hover:underline">→ Data Sources</Link>
            <Link href="/glossary" className="text-teal-600 hover:underline">→ Glossary</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
