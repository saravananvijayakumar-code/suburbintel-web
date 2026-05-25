'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit2, Trash2, Eye, EyeOff, BarChart3 } from 'lucide-react'
import DashboardLayout from '@/app/components/DashboardLayout'

interface Listing {
  id: string
  title: string
  address: string
  suburb: string
  state: string
  listingType: string
  price?: number
  weeklyRent?: number
  bedrooms?: number
  bathrooms?: number
  carSpaces?: number
  status: string
  isPublished: boolean
  views: number
  inquiries: number
  createdAt: string
}

export default function AgentDashboard() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalViews: 0,
    totalInquiries: 0
  })

  useEffect(() => {
    if (false) {
      router.push('/sign-in?redirect=/agent/listings')
    } else if (user) {
      fetchMyListings()
    }
  }, [])

  const fetchMyListings = async () => {
    try {
      const response = await fetch('/api/properties/my-listings')
      const data = await response.json()
      if (data.success) {
        setListings(data.listings)
        calculateStats(data.listings)
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (listings: Listing[]) => {
    setStats({
      total: listings.length,
      active: listings.filter(l => l.status === 'active').length,
      totalViews: listings.reduce((sum, l) => sum + l.views, 0),
      totalInquiries: listings.reduce((sum, l) => sum + l.inquiries, 0)
    })
  }

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/properties/listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !currentStatus })
      })
      
      if (response.ok) {
        fetchMyListings()
      }
    } catch (error) {
      console.error('Error toggling publish:', error)
    }
  }

  const deleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return
    
    try {
      const response = await fetch(`/api/properties/listings/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchMyListings()
      }
    } catch (error) {
      console.error('Error deleting listing:', error)
    }
  }

  if (loading) {
    return null
  }

  return (
    <DashboardLayout>
      {/* Modern Header with Glass morphism */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Listings</h1>
              <p className="text-blue-100 text-lg">Manage your property listings</p>
            </div>
            
            <button
              onClick={() => router.push('/agent/listings/new')}
              className="group relative overflow-hidden bg-white text-blue-600 hover:text-white px-8 py-4 rounded-2xl font-semibold shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              <div className="relative flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Listing
              </div>
            </button>
          </div>

          {/* Stats Cards - Apple-style design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Listings', value: stats.total, icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
              { label: 'Active', value: stats.active, icon: Eye, color: 'from-green-500 to-emerald-500' },
              { label: 'Total Views', value: stats.totalViews, icon: Eye, color: 'from-purple-500 to-pink-500' },
              { label: 'Inquiries', value: stats.totalInquiries, icon: BarChart3, color: 'from-orange-500 to-red-500' }
            ].map((stat, i) => (
              <div key={i} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 from-white to-transparent rounded-2xl transition-opacity" />
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-blue-100 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Listings Table */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg mb-6">
              <Plus className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-6">Create your first property listing to get started</p>
            <button
              onClick={() => router.push('/agent/listings/new')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Create Listing
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div key={listing.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 truncate">{listing.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          listing.status === 'active' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {listing.status}
                        </span>
                        {listing.isPublished ? (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 flex items-center gap-1">
                            <Eye className="h-3 w-3" /> Published
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 flex items-center gap-1">
                            <EyeOff className="h-3 w-3" /> Draft
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-4">{listing.address}, {listing.suburb}, {listing.state}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {listing.listingType === 'Sale' 
                              ? `$${(listing.price! / 1000).toFixed(0)}k`
                              : `$${listing.weeklyRent}/wk`}
                          </span>
                        </span>
                        {listing.bedrooms && <span>{listing.bedrooms} bed</span>}
                        {listing.bathrooms && <span>{listing.bathrooms} bath</span>}
                        {listing.carSpaces && <span>{listing.carSpaces} car</span>}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm">
                          <Eye className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{listing.views} views</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <BarChart3 className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{listing.inquiries} inquiries</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => router.push(`/agent/listings/${listing.id}/edit`)}
                        className="p-3 rounded-xl bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => togglePublish(listing.id, listing.isPublished)}
                        className="p-3 rounded-xl bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-600 transition-colors"
                        title={listing.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {listing.isPublished ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                      
                      <button
                        onClick={() => deleteListing(listing.id)}
                        className="p-3 rounded-xl bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

