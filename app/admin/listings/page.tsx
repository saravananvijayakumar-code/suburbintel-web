'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  suburb: string;
  state: string;
  propertyType: string;
  listingType: string;
  price: number | null;
  priceDisplay: string | null;
  moderationStatus: string;
  status: string;
  createdAt: string;
  agent: {
    agencyName: string;
    userId: string;
  };
}

interface StatusCounts {
  pending_review: number;
  approved: number;
  rejected: number;
  flagged: number;
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    pending_review: 0,
    approved: 0,
    rejected: 0,
    flagged: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('pending_review');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isAdmin = true; // No authentication required

  useEffect(() => {
    fetchListings();
  }, [filterStatus, page]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('moderationStatus', filterStatus);
      params.append('page', page.toString());

      const response = await fetch(`/api/admin/listings?${params}`);
      const data = await response.json();
      
      setListings(data.listings || []);
      setStatusCounts(data.statusCounts);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const moderateListing = async (listingId: string, action: string, reason?: string) => {
    if (action === 'reject') {
      const userReason = prompt('Please provide a reason for rejection:');
      if (!userReason) return;
      reason = userReason;
    }

    try {
      const response = await fetch('/api/admin/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, action, reason }),
      });

      if (response.ok) {
        alert(`Listing ${action}d successfully`);
        fetchListings();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to moderate listing');
      }
    } catch (error) {
      console.error('Error moderating listing:', error);
      alert('An error occurred');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending_review: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      approved: 'bg-green-100 text-green-800 border border-green-200',
      rejected: 'bg-red-100 text-red-800 border border-red-200',
      flagged: 'bg-orange-100 text-orange-800 border border-orange-200',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Listing Moderation</h1>
              <p className="text-gray-600 mt-1">Review and approve property listings</p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Admin
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600 mb-1">Pending Review</div>
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending_review}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600 mb-1">Approved</div>
              <div className="text-2xl font-bold text-green-600">{statusCounts.approved}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600 mb-1">Rejected</div>
              <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600 mb-1">Flagged</div>
              <div className="text-2xl font-bold text-orange-600">{statusCounts.flagged}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {Object.keys(statusCounts).map((status) => (
              <button
                key={status}
                onClick={() => { setFilterStatus(status); setPage(1); }}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.replace('_', ' ').toUpperCase()} ({statusCounts[status as keyof StatusCounts]})
              </button>
            ))}
          </div>
        </div>

        {listings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600">No listings with status: {filterStatus}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{listing.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(listing.moderationStatus)}`}>
                        {listing.moderationStatus.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Location: {listing.suburb}, {listing.state}</div>
                      <div>Type: {listing.propertyType} - {listing.listingType}</div>
                      <div>Price: {listing.priceDisplay || (listing.price ? `$${listing.price.toLocaleString()}` : 'Contact Agent')}</div>
                      <div>Agent: {listing.agent.agencyName}</div>
                      <div>Listed: {new Date(listing.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {listing.moderationStatus === 'pending_review' && (
                    <>
                      <button
                        onClick={() => moderateListing(listing.id, 'approve')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => moderateListing(listing.id, 'reject')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                      >
                        ✗ Reject
                      </button>
                    </>
                  )}
                  {listing.moderationStatus === 'approved' && (
                    <button
                      onClick={() => moderateListing(listing.id, 'suspend')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium"
                    >
                      Suspend
                    </button>
                  )}
                  <Link
                    href={`/properties/${listing.id}`}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                  >
                    View Listing
                  </Link>
                  <Link
                    href={`/agents/${listing.agent.userId}`}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                  >
                    View Agent
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

