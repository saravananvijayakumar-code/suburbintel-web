'use client'

import { useState, useEffect } from 'react'
import { Code, BookOpen, Key, Zap, Shield, Lock } from 'lucide-react'
import Link from 'next/link'
import { isAdmin } from '@/lib/admin'

export default function ApiDocsPage() {
  const [selectedLang, setSelectedLang] = useState<'curl' | 'javascript' | 'python'>('curl')

  // Admin check removed — API docs are public
  const userIsAdmin = true

  // Show access denied for non-admins
  if (!userIsAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-6">
            API Documentation is only available to enterprise customers and developers.
          </p>
          <Link 
            href="/pricing" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View Enterprise Plans
          </Link>
        </div>
      </div>
    )
  }

  const codeExamples = {
    search: {
      curl: `curl -X POST https://suburbintel.com.au/api/search/suburbs \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "Sydney"}'`,
      javascript: `const response = await fetch('https://suburbintel.com.au/api/search/suburbs', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: 'Sydney' }),
});

const data = await response.json();
console.log(data.results);`,
      python: `import requests

response = requests.post(
    'https://suburbintel.com.au/api/search/suburbs',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
    },
    json={'query': 'Sydney'}
)

data = response.json()
print(data['results'])`,
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-10 h-10" />
            <h1 className="text-4xl font-extrabold">API Documentation</h1>
          </div>
          <p className="text-xl text-blue-100">
            Programmatic access to Australian property insights and suburb data
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Getting Started */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Zap className="w-8 h-8 text-blue-600" />
            Getting Started
          </h2>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">1. Get Your API Key</h3>
            <p className="text-gray-700 mb-4">
              To use the Suburb Intel API, you need an API key. Create one from your account dashboard.
            </p>
            <Link
              href="/account/api-keys"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Key className="w-4 h-4" />
              Manage API Keys
            </Link>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">2. Authentication</h3>
            <p className="text-gray-700 mb-4">
              Include your API key in the <code className="px-2 py-1 bg-gray-100 rounded text-sm">Authorization</code> header:
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">Authorization: Bearer YOUR_API_KEY</code>
            </div>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            Rate Limits
          </h2>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Plan</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Daily Limit</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">Free</td>
                  <td className="px-6 py-4 text-sm text-gray-700">1 request</td>
                  <td className="px-6 py-4 text-sm text-gray-700">1 req/min</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">Pro</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Unlimited</td>
                  <td className="px-6 py-4 text-sm text-gray-700">10 req/min</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Endpoints */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Code className="w-8 h-8 text-blue-600" />
            API Endpoints
          </h2>

          {/* Search Suburbs */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-bold">POST</span>
              <code className="text-lg font-mono text-gray-900">/api/search/suburbs</code>
            </div>
            <p className="text-gray-700 mb-4">
              Search for Australian suburbs and retrieve investment insights
            </p>

            {/* Language Selector */}
            <div className="flex gap-2 mb-4">
              {(['curl', 'javascript', 'python'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    selectedLang === lang
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {lang === 'curl' ? 'cURL' : lang === 'javascript' ? 'JavaScript' : 'Python'}
                </button>
              ))}
            </div>

            {/* Code Example */}
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                <code>{codeExamples.search[selectedLang]}</code>
              </pre>
            </div>

            {/* Request Body */}
            <div className="mt-4">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Request Body:</h4>
              <div className="bg-gray-50 border border-gray-200 rounded p-3">
                <code className="text-sm text-gray-800">
                  {`{
  "query": "Sydney" // Suburb name or postcode
}`}
                </code>
              </div>
            </div>

            {/* Response */}
            <div className="mt-4">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Response:</h4>
              <div className="bg-gray-50 border border-gray-200 rounded p-3">
                <code className="text-sm text-gray-800">
                  {`{
  "results": [
    {
      "name": "Sydney",
      "state": "NSW",
      "postcode": "2000",
      "medianPrice": 1450000,
      "weeklyRent": 950,
      "rentalYield": 3.4,
      "growth12m": 8.5,
      "investmentScore": 82
    }
  ]
}`}
                </code>
              </div>
            </div>
          </div>

          {/* Get Suburb Details */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-bold">GET</span>
              <code className="text-lg font-mono text-gray-900">/api/suburbs/[name]</code>
            </div>
            <p className="text-gray-700 mb-4">
              Get detailed information about a specific suburb
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                curl https://suburbintel.com.au/api/suburbs/Sydney \<br/>
                &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY"
              </code>
            </div>
          </div>

          {/* Compare Suburbs */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-bold">POST</span>
              <code className="text-lg font-mono text-gray-900">/api/compare</code>
            </div>
            <p className="text-gray-700 mb-4">
              Compare multiple suburbs side-by-side
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`curl -X POST https://suburbintel.com.au/api/compare \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"suburbs": ["Sydney", "Melbourne", "Brisbane"]}'`}
              </code>
            </div>
          </div>

          {/* Analytics */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-bold">GET</span>
              <code className="text-lg font-mono text-gray-900">/api/analytics</code>
            </div>
            <p className="text-gray-700 mb-4">
              Access market analytics and trends
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                curl https://suburbintel.com.au/api/analytics \<br/>
                &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY"
              </code>
            </div>
          </div>
        </section>

        {/* Error Codes */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Error Codes</h2>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Code</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">400</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Bad Request - Invalid parameters</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">401</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Unauthorized - Invalid or missing API key</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">429</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Too Many Requests - Rate limit exceeded</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">500</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Internal Server Error</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Support */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-blue-800">
            Contact our support team at{' '}
            <a href="mailto:saravananvijayakumar@quantumleapventures.com.au" className="font-medium underline">
              saravananvijayakumar@quantumleapventures.com.au
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
