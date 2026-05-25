'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/app/components/DashboardLayout'
import { Bell, Mail, Settings, Trash2, Plus, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'

interface Alert {
  id: string
  suburbName: string
  state: string
  alertTypes: string[]
  frequency: string
  priceChangeThreshold?: number
  isActive: boolean
  lastTriggered?: string
  createdAt: string
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSetupForm, setShowSetupForm] = useState(false)

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/alerts')
      const data = await response.json()

      if (data.success) {
        setAlerts(data.alerts || [])
      } else {
        setError(data.error || 'Failed to load alerts')
      }
    } catch (err) {
      setError('Failed to load alerts')
    } finally {
      setLoading(false)
    }
  }

  const deleteAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setAlerts(alerts.filter(a => a.id !== alertId))
      } else {
        setError('Failed to delete alert')
      }
    } catch (err) {
      setError('Failed to delete alert')
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Email Alerts</h1>
              <p className="text-gray-600">Get notified about suburb price changes and market updates</p>
            </div>
          </div>

          {/* Pro Required Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Pro Feature Required</h3>
                <p className="text-gray-600">Email alerts are available for Pro subscribers only. Upgrade to get notified about price changes, new listings, and market updates.</p>
              </div>
              <Link
                href="/pricing"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Alerts Set Up</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create your first alert to get notified about price changes and market updates in your favorite suburbs.
              </p>
              <button
                onClick={() => setShowSetupForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <Plus className="h-5 w-5 inline mr-2" />
                Set Up First Alert
              </button>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {alert.suburbName}, {alert.state}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        alert.isActive
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {alert.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Alert Types</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {alert.alertTypes.map((type) => (
                            <span key={type} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                              {type.replace('-', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-500">Frequency</span>
                        <p className="text-gray-900 capitalize">{alert.frequency}</p>
                      </div>

                      {alert.priceChangeThreshold && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Price Change Threshold</span>
                          <p className="text-gray-900">{alert.priceChangeThreshold}%</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Created {new Date(alert.createdAt).toLocaleDateString()}</span>
                      {alert.lastTriggered && (
                        <span>Last triggered {new Date(alert.lastTriggered).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete alert"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Setup Form Placeholder */}
        {showSetupForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Set Up Alert</h3>
              <p className="text-gray-600 mb-6">
                Alert setup requires a Pro subscription. Upgrade to create custom alerts for price changes and market updates.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSetupForm(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <Link
                  href="/pricing"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-center hover:from-blue-700 hover:to-purple-700"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
