'use client'

export default function PortfolioPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Portfolio Tracker</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">
          Track and manage your property investment portfolio.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-800 font-semibold">Coming Soon</p>
          <p className="text-blue-600 mt-2">
            This feature is currently under development and will be available soon.
          </p>
        </div>
      </div>
    </div>
  )
}
