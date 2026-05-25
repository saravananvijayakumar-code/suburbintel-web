'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Agent {
  id: string;
  userId: string;
  agencyName: string;
  licenseNumber: string;
  state: string;
  verificationStatus: string;
  subscriptionTier: string;
  activeListings: number;
  createdAt: string;
}

interface StatusCounts {
  pending: number;
  verified: number;
  rejected: number;
  suspended: number;
}

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    pending: 0,
    verified: 0,
    rejected: 0,
    suspended: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isAdmin = true; // No authentication required

  useEffect(() => {
    fetchAgents();
  }, [filterStatus, page]);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('status', filterStatus);
      params.append('page', page.toString());

      const response = await fetch(`/api/admin/agents?${params}`);
      const data = await response.json();
      
      setAgents(data.agents || []);
      setStatusCounts(data.statusCounts);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAgentStatus = async (agentId: string, newStatus: string, reason?: string) => {
    if (newStatus === 'rejected' || newStatus === 'suspended') {
      const userReason = prompt(`Please provide a reason for ${newStatus}:`);
      if (!userReason) return;
      reason = userReason;
    }

    try {
      const response = await fetch('/api/admin/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          action: newStatus === 'verified' ? 'approve' : newStatus === 'rejected' ? 'reject' : 'suspend',
          reason,
        }),
      });

      if (response.ok) {
        alert(`Agent ${newStatus} successfully`);
        fetchAgents();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update agent status');
      }
    } catch (error) {
      console.error('Error updating agent:', error);
      alert('An error occurred');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      verified: 'bg-green-100 text-green-800 border border-green-200',
      rejected: 'bg-red-100 text-red-800 border border-red-200',
      suspended: 'bg-gray-100 text-gray-800 border border-gray-200',
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agent Verification</h1>
              <p className="text-gray-600 mt-1">Review and approve agent registrations</p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Admin
            </Link>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600 mb-1">Pending Review</div>
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600 mb-1">Verified</div>
              <div className="text-2xl font-bold text-green-600">{statusCounts.verified}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600 mb-1">Rejected</div>
              <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600 mb-1">Suspended</div>
              <div className="text-2xl font-bold text-gray-600">{statusCounts.suspended}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => { setFilterStatus('pending'); setPage(1); }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({statusCounts.pending})
            </button>
            <button
              onClick={() => { setFilterStatus('verified'); setPage(1); }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === 'verified'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Verified ({statusCounts.verified})
            </button>
            <button
              onClick={() => { setFilterStatus('rejected'); setPage(1); }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected ({statusCounts.rejected})
            </button>
            <button
              onClick={() => { setFilterStatus('suspended'); setPage(1); }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === 'suspended'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Suspended ({statusCounts.suspended})
            </button>
          </div>
        </div>

        {/* Agents List */}
        {agents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No agents found</h3>
            <p className="text-gray-600">No agents with status: {filterStatus}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{agent.agencyName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(agent.verificationStatus)}`}>
                        {agent.verificationStatus.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {agent.subscriptionTier.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>License: {agent.licenseNumber} ({agent.state})</div>
                      <div>Active Listings: {agent.activeListings}</div>
                      <div>Registered: {new Date(agent.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {agent.verificationStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => updateAgentStatus(agent.id, 'verified')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => updateAgentStatus(agent.id, 'rejected')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                      >
                        ✗ Reject
                      </button>
                    </>
                  )}
                  {agent.verificationStatus === 'verified' && (
                    <button
                      onClick={() => updateAgentStatus(agent.id, 'suspended')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium"
                    >
                      Suspend Account
                    </button>
                  )}
                  {(agent.verificationStatus === 'rejected' || agent.verificationStatus === 'suspended') && (
                    <button
                      onClick={() => updateAgentStatus(agent.id, 'verified')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                    >
                      Reinstate
                    </button>
                  )}
                  <Link
                    href={`/agents/${agent.userId}`}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
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
