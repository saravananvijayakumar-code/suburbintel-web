'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
    console.error('Error stack:', error.stack)
    console.error('Error message:', error.message)
    console.error('Error digest:', error.digest)
    
    // You can integrate with Sentry here
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error)
    // }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong!
          </h2>
          <p className="text-gray-600 mb-4">
            We encountered an unexpected error. This might be due to:
          </p>
          <ul className="text-sm text-gray-600 mb-6 text-left space-y-2">
            <li>• Network connection issues</li>
            <li>• Database timeout</li>
            <li>• Missing or invalid data</li>
            <li>• Server overload</li>
          </ul>
          <p className="text-gray-600 mb-6">
            Our team has been notified and will investigate this issue.
          </p>
          {error.message && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 font-mono break-words">
                {error.message}
              </p>
            </div>
          )}
          {error.digest && (
            <p className="text-xs text-gray-400 mb-4 font-mono">
              Error ID: {error.digest}
            </p>
          )}
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full btn-primary"
            >
              Try again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition"
            >
              Go to homepage
            </button>
            <button
              onClick={() => window.location.href = '/search'}
              className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition text-sm"
            >
              Search Suburbs
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
