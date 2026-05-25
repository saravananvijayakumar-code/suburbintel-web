'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const isAdmin = true; // No authentication required

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Not authorized</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage agents, listings, and platform settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Agent Verification */}
          <Link
            href="/admin/agents"
            className="bg-white rounded-lg shadow hover:shadow-xl transition p-6 border-t-4 border-yellow-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-2xl">
                👤
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Agent Verification</h3>
            <p className="text-gray-600 text-sm mb-4">
              Review and approve new agent registrations
            </p>
            <div className="text-blue-600 font-semibold">
              Manage Agents →
            </div>
          </Link>

          {/* Listing Moderation */}
          <Link
            href="/admin/listings"
            className="bg-white rounded-lg shadow hover:shadow-xl transition p-6 border-t-4 border-green-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                🏠
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Listing Moderation</h3>
            <p className="text-gray-600 text-sm mb-4">
              Review and approve property listings
            </p>
            <div className="text-blue-600 font-semibold">
              Moderate Listings →
            </div>
          </Link>

          {/* Reports */}
          <Link
            href="/admin/reports"
            className="bg-white rounded-lg shadow hover:shadow-xl transition p-6 border-t-4 border-red-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-2xl">
                🚩
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">User Reports</h3>
            <p className="text-gray-600 text-sm mb-4">
              Handle user-submitted content reports
            </p>
            <div className="text-blue-600 font-semibold">
              View Reports →
            </div>
          </Link>

          {/* Audit Logs */}
          <Link
            href="/admin/audit"
            className="bg-white rounded-lg shadow hover:shadow-xl transition p-6 border-t-4 border-blue-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                📋
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Audit Logs</h3>
            <p className="text-gray-600 text-sm mb-4">
              View system activity and changes
            </p>
            <div className="text-blue-600 font-semibold">
              View Logs →
            </div>
          </Link>

          {/* Data Marketplace */}
          <Link
            href="/admin/data-products"
            className="bg-white rounded-lg shadow hover:shadow-xl transition p-6 border-t-4 border-purple-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                📊
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Data Products</h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage data marketplace products
            </p>
            <div className="text-blue-600 font-semibold">
              Manage Products →
            </div>
          </Link>

          {/* Settings */}
          <Link
            href="/admin/settings"
            className="bg-white rounded-lg shadow hover:shadow-xl transition p-6 border-t-4 border-gray-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                ⚙️
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Platform Settings</h3>
            <p className="text-gray-600 text-sm mb-4">
              Configure system-wide settings
            </p>
            <div className="text-blue-600 font-semibold">
              Configure →
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Agents</div>
              <div className="text-3xl font-bold text-gray-900">-</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Active Listings</div>
              <div className="text-3xl font-bold text-gray-900">-</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Inquiries</div>
              <div className="text-3xl font-bold text-gray-900">-</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Revenue (30d)</div>
              <div className="text-3xl font-bold text-gray-900">$-</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
