'use client'

import { WifiOff, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <WifiOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">You're Offline</h1>
          <p className="text-gray-600">
            It looks like you've lost your internet connection. Don't worry - you can still access some features!
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Available Offline:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Previously viewed suburb reports</li>
              <li>• Saved searches and favorites</li>
              <li>• Market trend data (cached)</li>
              <li>• Investment calculator</li>
            </ul>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">Requires Internet:</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• New suburb searches</li>
              <li>• Real-time market data</li>
              <li>• User account features</li>
              <li>• Data synchronization</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 inline-block"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>Suburb Intel will automatically reconnect when your internet returns.</p>
        </div>
      </div>
    </div>
  )
}