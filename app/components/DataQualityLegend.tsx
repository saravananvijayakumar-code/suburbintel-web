'use client'

import { Info } from 'lucide-react'
import { useState } from 'react'

export default function DataQualityLegend() {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
        title="About Data Quality"
      >
        <Info className="w-4 h-4" />
        <span>Data Quality Guide</span>
      </button>

      {showDetails && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            onClick={() => setShowDetails(false)}
          />

          {/* Modal */}
          <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-6 z-50">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Data Quality Explained</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Real Data */}
              <div className="flex items-start gap-3">
                <span className="text-2xl">🟢</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Real Government Data</h4>
                  <p className="text-sm text-gray-600">
                    Official data from state Valuer-General offices, land registries, and government property databases.
                    Updated quarterly with verified sale prices and property valuations.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    <strong>Coverage:</strong> Victoria (500+ suburbs)
                  </p>
                </div>
              </div>

              {/* Estimated Data */}
              <div className="flex items-start gap-3">
                <span className="text-2xl">🟡</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Estimated Data</h4>
                  <p className="text-sm text-gray-600">
                    Statistical estimates enriched with ABS Census data, employment statistics, and demographic information.
                    Provides good directional accuracy for analysis.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    <strong>Coverage:</strong> Coming soon for all states
                  </p>
                </div>
              </div>

              {/* Generated Data */}
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔴</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Generated Data</h4>
                  <p className="text-sm text-gray-600">
                    Algorithmically generated estimates based on regional averages and historical patterns.
                    Use for comparative analysis only. Real government data coming soon.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    <strong>Coverage:</strong> NSW, QLD, WA, SA, TAS, NT, ACT
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                We're actively working to add real government data for all Australian states.
                Expected completion: Q1 2026
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
