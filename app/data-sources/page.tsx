'use client'

import Link from 'next/link'
import { Database, Shield, Check, ExternalLink, RefreshCw, Building2, Map, BarChart3, FileText, Globe } from 'lucide-react'

export default function DataSourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <Database className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Data Sources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            100% official Australian government data sources - transparent, reliable, and completely free to access
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-green-600" />
              <h3 className="font-bold text-gray-900">Government Verified</h3>
            </div>
            <p className="text-sm text-gray-600">
              All data sourced from official Australian government agencies and departments
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-3">
              <RefreshCw className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-gray-900">Regularly Updated</h3>
            </div>
            <p className="text-sm text-gray-600">
              Data refreshed quarterly from government sources with automated ETL pipelines
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-6 h-6 text-purple-600" />
              <h3 className="font-bold text-gray-900">Nationwide Coverage</h3>
            </div>
            <p className="text-sm text-gray-600">
              3,852+ suburbs across NSW, VIC, and expanding to all Australian states
            </p>
          </div>
        </div>

        {/* NSW Data Sources */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">New South Wales (NSW)</h2>
          </div>

          <div className="space-y-6">
            {/* Property & Land Data */}
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                Property & Land Valuations
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Property Sales Data</p>
                  <p className="text-sm text-gray-600 mb-2">Median house prices, sale volumes, property transactions</p>
                  <a 
                    href="https://data.nsw.gov.au/data/dataset/property-sales-data" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    data.nsw.gov.au
                  </a>
                  <p className="text-xs text-gray-500 mt-1">License: CC BY 4.0 | Updated: Quarterly</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Land Values</p>
                  <p className="text-sm text-gray-600 mb-2">Official land valuations by Valuer-General</p>
                  <a 
                    href="https://data.nsw.gov.au/data/dataset/land-values" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    data.nsw.gov.au
                  </a>
                  <p className="text-xs text-gray-500 mt-1">License: CC BY 4.0 | Updated: Quarterly</p>
                </div>
              </div>
            </div>

            {/* Rental Market Data */}
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                Rental Market Intelligence
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Rental Bond Lodgements</p>
                  <p className="text-sm text-gray-600 mb-2">New rental agreements, weekly rent data</p>
                  <p className="text-xs text-gray-500">License: CC BY 4.0 | Updated: Quarterly</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Rental Bond Holdings</p>
                  <p className="text-sm text-gray-600 mb-2">Active rental market statistics</p>
                  <p className="text-xs text-gray-500">License: CC BY 4.0 | Updated: Quarterly</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Rental Bond Refunds</p>
                  <p className="text-sm text-gray-600 mb-2">Tenancy completion data</p>
                  <p className="text-xs text-gray-500">License: CC BY 4.0 | Updated: Quarterly</p>
                </div>
              </div>
            </div>

            {/* Environmental Risk Data */}
            <div className="border-l-4 border-red-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                Environmental Risk Assessment
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Bushfire Prone Land</p>
                  <p className="text-sm text-gray-600 mb-2">Bushfire risk zones and prone areas</p>
                  <a 
                    href="https://datasets.seed.nsw.gov.au/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    NSW Rural Fire Service
                  </a>
                  <p className="text-xs text-gray-500 mt-1">License: CC BY 4.0 | Updated: Yearly</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Flood Planning Areas</p>
                  <p className="text-sm text-gray-600 mb-2">Flood risk zones and planning constraints</p>
                  <a 
                    href="https://planningportal.nsw.gov.au/spatialviewer" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    NSW Planning Portal
                  </a>
                  <p className="text-xs text-gray-500 mt-1">License: CC BY 4.0 | Updated: Quarterly</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Coastal Erosion Hazard</p>
                  <p className="text-sm text-gray-600 mb-2">Coastal hazard zones and erosion risk</p>
                  <p className="text-xs text-gray-500">License: CC BY 4.0 | Updated: Yearly</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Flood Risk Precincts</p>
                  <p className="text-sm text-gray-600 mb-2">Detailed flood mapping and risk assessment</p>
                  <p className="text-xs text-gray-500">License: CC BY 4.0 | Updated: Quarterly</p>
                </div>
              </div>
            </div>

            {/* Other NSW Data */}
            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                Community & Infrastructure
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Crime Statistics</p>
                  <p className="text-sm text-gray-600 mb-2">Local Government Area crime data</p>
                  <p className="text-xs text-gray-500">License: CC BY 4.0 | Updated: Quarterly</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Schools Directory</p>
                  <p className="text-sm text-gray-600 mb-2">School locations and information</p>
                  <p className="text-xs text-gray-500">License: CC BY 4.0 | Updated: Yearly</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Transport (GTFS)</p>
                  <p className="text-sm text-gray-600 mb-2">Public transport accessibility data</p>
                  <p className="text-xs text-gray-500">License: CC BY 4.0 | Updated: Monthly</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Census Population</p>
                  <p className="text-sm text-gray-600 mb-2">Population statistics and demographics</p>
                  <p className="text-xs text-gray-500">License: CC BY 4.0 | Updated: Census cycles</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Planning Pipeline</p>
                  <p className="text-sm text-gray-600 mb-2">Development applications and approvals</p>
                  <p className="text-xs text-gray-500">License: CC BY 4.0 | Updated: Quarterly</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Total NSW Datasets:</strong> 14 datasets covering property sales, rentals, environmental risks, crime, schools, transport, and planning
            </p>
          </div>
        </div>

        {/* Victoria Data Sources */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Map className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Victoria (VIC)</h2>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                Property & Market Data
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Property Sales (Last 12 Months)</p>
                  <p className="text-sm text-gray-600 mb-2">Recent property transactions and prices</p>
                  <a 
                    href="https://discover.data.vic.gov.au/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    discover.data.vic.gov.au
                  </a>
                  <p className="text-xs text-gray-500 mt-1">License: CC BY 4.0 | Updated: Monthly</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Property Sales (Last 24 Months)</p>
                  <p className="text-sm text-gray-600 mb-2">Historical property sales trends</p>
                  <p className="text-xs text-gray-500">License: CC BY 4.0 | Updated: Monthly</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Property Sales (Last 36 Months)</p>
                  <p className="text-sm text-gray-600 mb-2">3-year property market analysis</p>
                  <p className="text-xs text-gray-500">License: CC BY 4.0 | Updated: Monthly</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Rental Market</p>
                  <p className="text-sm text-gray-600 mb-2">Rental bond data and median rents</p>
                  <p className="text-xs text-gray-500">License: CC BY 4.0 | Updated: Quarterly</p>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                Safety & Community
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Crime Stats - Assault</p>
                  <p className="text-sm text-gray-600 mb-2">Assault incidents by LGA</p>
                  <p className="text-xs text-gray-500">License: CC BY 4.0 | Updated: Quarterly</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Crime Stats - Burglary</p>
                  <p className="text-sm text-gray-600 mb-2">Burglary and breaking incidents</p>
                  <p className="text-xs text-gray-500">License: CC BY 4.0 | Updated: Quarterly</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Crime Stats - Theft</p>
                  <p className="text-sm text-gray-600 mb-2">Theft and property crime data</p>
                  <p className="text-xs text-gray-500">License: CC BY 4.0 | Updated: Quarterly</p>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-teal-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                Education & Infrastructure
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Schools Master List</p>
                  <p className="text-sm text-gray-600 mb-2">School details and performance data (ACARA)</p>
                  <p className="text-xs text-gray-500">License: CC BY 4.0 | Updated: Yearly</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">School Locations</p>
                  <p className="text-sm text-gray-600 mb-2">Geographic school locations and boundaries</p>
                  <p className="text-xs text-gray-500">License: CC BY 4.0 | Updated: Yearly</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Total VIC Datasets:</strong> 13 datasets covering property sales timeseries, rentals, crime statistics, and education
            </p>
          </div>
        </div>

        {/* National Data Sources */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">National Data Sources</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-green-500">
              <h3 className="font-bold text-gray-900 mb-3">Australian Bureau of Statistics (ABS)</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Census data - population, demographics, household composition</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Median household income by suburb</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Employment statistics and workforce data</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Socio-Economic Indexes for Areas (SEIFA)</span>
                </li>
              </ul>
              <a 
                href="https://www.abs.gov.au/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-4"
              >
                <ExternalLink className="w-4 h-4" />
                Visit ABS Website
              </a>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
              <h3 className="font-bold text-gray-900 mb-3">Australian Curriculum Assessment & Reporting Authority (ACARA)</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>School performance data (NAPLAN)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>School profiles and characteristics</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Education statistics and trends</span>
                </li>
              </ul>
              <a 
                href="https://www.acara.edu.au/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-4"
              >
                <ExternalLink className="w-4 h-4" />
                Visit ACARA Website
              </a>
            </div>
          </div>
        </div>

        {/* Data Pipeline & Quality */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Data Pipeline & Quality Assurance</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">ETL Pipeline Architecture</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Extract</p>
                    <p className="text-sm text-gray-600">Automated downloaders fetch data from government APIs and portals</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Transform</p>
                    <p className="text-sm text-gray-600">Data cleaning, normalization, and standardization across sources</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Load</p>
                    <p className="text-sm text-gray-600">Aggregation and loading into PostgreSQL database with quality checks</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Quality Metrics</h3>
              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-green-900">✓ Data Accuracy</p>
                  <p className="text-xs text-green-700">100% sourced from official government portals</p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900">✓ Coverage</p>
                  <p className="text-xs text-blue-700">3,852 suburbs (NSW: 3,091 | VIC: 761)</p>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-purple-900">✓ Update Frequency</p>
                  <p className="text-xs text-purple-700">Quarterly automated refreshes from government sources</p>
                </div>

                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-orange-900">✓ Data Freshness</p>
                  <p className="text-xs text-orange-700">Last updated: November 25, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Licensing */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Legal & Licensing Information</h2>
          
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Creative Commons Attribution 4.0 (CC BY 4.0)
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                All government data sources are licensed under CC BY 4.0, which allows:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Commercial Use:</strong> Legal to use for commercial applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Redistribution:</strong> Free to share and redistribute</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Attribution Required:</strong> Must credit original source agencies</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-3">Data Attribution</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>We acknowledge and attribute all data sources:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Property & Rental Data: NSW Department of Customer Service, VIC State Revenue Office</li>
                  <li>Environmental Risks: NSW Rural Fire Service, NSW Department of Planning & Environment</li>
                  <li>Crime Statistics: NSW Bureau of Crime Statistics and Research, VIC Crime Statistics Agency</li>
                  <li>Demographics: Australian Bureau of Statistics (ABS)</li>
                  <li>Education: Australian Curriculum Assessment & Reporting Authority (ACARA)</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-lg">
              <h3 className="font-bold text-yellow-900 mb-3">⚠️ Disclaimer</h3>
              <p className="text-sm text-yellow-800">
                While we use 100% official government data sources, Suburb Intel AU is not affiliated with or endorsed by any government agency. 
                All data is provided "as-is" for informational purposes only. Always verify current market conditions with licensed professionals before making investment decisions.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Start Analyzing with Confidence</h2>
            <p className="text-lg mb-6 opacity-90">
              Access 3,852+ suburbs backed by 100% official government data
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/search"
                className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
              >
                Search Suburbs
              </Link>
              <Link 
                href="/pricing"
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
