'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/app/components/DashboardLayout'
import {
  ArrowLeft,
  Zap,
  Plus,
  Loader2,
  Edit2,
  Trash2,
  X,
  Save,
  Copy,
  Tag,
  MessageSquare
} from 'lucide-react'

interface CannedResponse {
  id: string
  title: string
  content: string
  shortcut: string
  category: string
  usageCount: number
  createdAt: string
}

const categoryColors: Record<string, string> = {
  GENERAL: 'bg-gray-100 text-gray-800',
  GREETING: 'bg-blue-100 text-blue-800',
  CLOSING: 'bg-green-100 text-green-800',
  TECHNICAL: 'bg-purple-100 text-purple-800',
  BILLING: 'bg-yellow-100 text-yellow-800',
  ESCALATION: 'bg-red-100 text-red-800',
}

export default function CannedResponsesPage() {
  const [responses, setResponses] = useState<CannedResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingResponse, setEditingResponse] = useState<CannedResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('')

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    shortcut: '',
    category: 'GENERAL',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchResponses()
  }, [filterCategory])

  const fetchResponses = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (filterCategory) params.append('category', filterCategory)

      const response = await fetch(`/api/support/canned-responses?${params}`)
      const data = await response.json()

      if (data.success) {
        setResponses(data.responses)
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('Failed to load canned responses')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = editingResponse
        ? `/api/support/canned-responses?id=${editingResponse.id}`
        : '/api/support/canned-responses'
      
      const response = await fetch(url, {
        method: editingResponse ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        fetchResponses()
        closeModal()
      } else {
        setError(data.error || 'Failed to save response')
      }
    } catch (error) {
      setError('Failed to save response')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (responseId: string) => {
    if (!confirm('Are you sure you want to delete this canned response?')) return

    try {
      const response = await fetch(`/api/support/canned-responses?id=${responseId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        fetchResponses()
      } else {
        setError(data.error || 'Failed to delete response')
      }
    } catch (error) {
      setError('Failed to delete response')
    }
  }

  const copyToClipboard = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const openEditModal = (response: CannedResponse) => {
    setEditingResponse(response)
    setFormData({
      title: response.title,
      content: response.content,
      shortcut: response.shortcut,
      category: response.category,
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingResponse(null)
    setFormData({
      title: '',
      content: '',
      shortcut: '',
      category: 'GENERAL',
    })
    setError(null)
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/support"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Canned Responses</h1>
              <p className="text-gray-600 mt-1">Manage quick reply templates for support agents</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Response
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Filter */}
        <div className="mb-6">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="GENERAL">General</option>
            <option value="GREETING">Greeting</option>
            <option value="CLOSING">Closing</option>
            <option value="TECHNICAL">Technical</option>
            <option value="BILLING">Billing</option>
            <option value="ESCALATION">Escalation</option>
          </select>
        </div>

        {/* Responses List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : responses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No canned responses yet</h3>
            <p className="text-gray-600 mb-4">Create quick reply templates to speed up support</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Response
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {responses.map((response) => (
              <div
                key={response.id}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">{response.title}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${categoryColors[response.category]}`}>
                      {response.category}
                    </span>
                    {response.shortcut && (
                      <code className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        /{response.shortcut}
                      </code>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyToClipboard(response.content, response.id)}
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      title="Copy content"
                    >
                      <Copy className={`w-4 h-4 ${copiedId === response.id ? 'text-green-500' : 'text-gray-500'}`} />
                    </button>
                    <button
                      onClick={() => openEditModal(response)}
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(response.id)}
                      className="p-1.5 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 whitespace-pre-wrap mb-3">{response.content}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    Used {response.usageCount} times
                  </span>
                  <span>
                    Created {new Date(response.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingResponse ? 'Edit Canned Response' : 'New Canned Response'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Welcome Message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Hi there! Thank you for contacting our support team..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shortcut (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">/</span>
                      <input
                        type="text"
                        value={formData.shortcut}
                        onChange={(e) => setFormData({ ...formData, shortcut: e.target.value.toLowerCase().replace(/\s/g, '') })}
                        className="w-full p-3 pl-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="welcome"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="GENERAL">General</option>
                      <option value="GREETING">Greeting</option>
                      <option value="CLOSING">Closing</option>
                      <option value="TECHNICAL">Technical</option>
                      <option value="BILLING">Billing</option>
                      <option value="ESCALATION">Escalation</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {editingResponse ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
