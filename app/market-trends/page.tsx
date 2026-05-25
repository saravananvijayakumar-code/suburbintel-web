'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Map,
  Sparkles,
  ArrowLeft,
  BarChart3,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '@/app/components/DashboardLayout';

interface MarketStats {
  hottest: Array<{
    id: string;
    name: string;
    state: string;
    postcode: string;
    medianPrice: number | null;
    growth12m: number | null;
    growth3m: number | null;
    investmentScore: number | null;
    rentalYield: number | null;
  }>;
  coolest: Array<{
    id: string;
    name: string;
    state: string;
    postcode: string;
    medianPrice: number | null;
    growth12m: number | null;
    growth3m: number | null;
    investmentScore: number | null;
  }>;
  highYield: Array<{
    id: string;
    name: string;
    state: string;
    postcode: string;
    rentalYield: number | null;
    medianPrice: number | null;
    weeklyRent: number | null;
  }>;
  bestValue: Array<{
    id: string;
    name: string;
    state: string;
    postcode: string;
    investmentScore: number | null;
    medianPrice: number | null;
    rentalYield: number | null;
    growth12m: number | null;
  }>;
  avgMedianPrice: number;
  avgGrowth12m: number;
  avgYield: number;
  totalSuburbs: number;
  nswSuburbs: number;
  vicSuburbs: number;
}

export default function MarketTrendsPage() {
  const [stats, setStats] = useState<MarketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hottest' | 'coolest' | 'yield' | 'value'>('hottest');

  useEffect(() => {
    fetchMarketStats();
  }, []);

  const fetchMarketStats = async () => {
    try {
      const response = await fetch('/api/market-trends');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch market trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return 'N/A';
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const formatPercent = (value: number | null) => {
    if (value === null) return 'N/A';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getGrowthColor = (value: number | null) => {
    if (!value) return 'text-gray-500';
    if (value > 5) return 'text-green-600';
    if (value > 0) return 'text-green-500';
    if (value > -5) return 'text-orange-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading market trends...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
        <div className="text-center py-20">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load market trends</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 Market Trends Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Real-time insights into Australian property markets
          </p>
        </div>

        {/* AI Market Insights */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <div className="flex items-start">
            <Sparkles className="w-8 h-8 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-4">🤖 AI Market Analysis</h2>
              <div className="space-y-2 text-white/90">
                <p>
                  <strong>Current Market Status:</strong>{' '}
                  {(stats.avgGrowth12m ?? 0) > 3
                    ? 'Strong growth phase - High buyer demand'
                    : (stats.avgGrowth12m ?? 0) > 0
                    ? 'Moderate growth - Stable market conditions'
                    : 'Cooling market - Good buying opportunities'}
                </p>
                <p>
                  <strong>Investment Recommendation:</strong>{' '}
                  {(stats.avgYield ?? 0) > 4
                    ? 'Focus on cashflow properties - High rental yields available'
                    : 'Capital growth strategy recommended - Lower yields, higher appreciation potential'}
                </p>
                <p>
                  <strong>Top Opportunities:</strong> Regional NSW suburbs offering{' '}
                  {stats.avgYield ? stats.avgYield.toFixed(2) : '0.00'}% average yield with {(stats.avgGrowth12m || 0) > 0 ? 'positive' : 'recovering'} growth trends
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Market Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Suburbs Analyzed</h3>
              <Map className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalSuburbs.toLocaleString()}</div>
            <p className="text-sm text-gray-500 mt-1">
              Combined NSW ({stats.nswSuburbs.toLocaleString()}) + VIC ({stats.vicSuburbs.toLocaleString()})
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Avg Median Price</h3>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              ${stats.avgMedianPrice ? (stats.avgMedianPrice / 1000).toFixed(0) : '0'}K
            </div>
            <p className="text-sm text-gray-500 mt-1">NSW + VIC combined</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Avg 12M Growth</h3>
              {(stats.avgGrowth12m ?? 0) >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className={`text-3xl font-bold ${getGrowthColor(stats.avgGrowth12m ?? 0)}`}>
              {formatPercent(stats.avgGrowth12m ?? 0)}
            </div>
            <p className="text-sm text-gray-500 mt-1">NSW + VIC combined</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Avg Rental Yield</h3>
              <Percent className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{(stats.avgYield ?? 0).toFixed(2)}%</div>
            <p className="text-sm text-gray-500 mt-1">NSW + VIC combined</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-lg shadow-lg">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('hottest')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'hottest'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔥 Hottest Markets
              </button>
              <button
                onClick={() => setActiveTab('coolest')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'coolest'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ❄️ Cooling Markets
              </button>
              <button
                onClick={() => setActiveTab('yield')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'yield'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                💰 High Yield
              </button>
              <button
                onClick={() => setActiveTab('value')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'value'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ⭐ Best Value
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'hottest' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Top 25 Fastest Growing Suburbs - NSW & VIC Combined (12 Month Growth)
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Rank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Suburb
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Median Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          12M Growth
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          3M Growth
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.hottest.map((suburb, index) => (
                        <tr key={suburb.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-bold text-gray-900">#{index + 1}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{suburb.name}</div>
                            <div className="text-sm text-gray-500">
                              {suburb.state} {suburb.postcode}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(suburb.medianPrice)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-semibold ${getGrowthColor(suburb.growth12m)}`}>
                              {formatPercent(suburb.growth12m)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-semibold ${getGrowthColor(suburb.growth3m)}`}>
                              {formatPercent(suburb.growth3m)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-blue-600">
                              {suburb.investmentScore || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Link
                              href={`/suburb/${encodeURIComponent(suburb.name.toLowerCase())}?state=${suburb.state}&postcode=${suburb.postcode}`}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'coolest' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Top 25 Cooling Suburbs - NSW & VIC Combined (Buying Opportunities)
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Rank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Suburb
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Median Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          12M Growth
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          3M Growth
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.coolest.map((suburb, index) => (
                        <tr key={suburb.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-bold text-gray-900">#{index + 1}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{suburb.name}</div>
                            <div className="text-sm text-gray-500">
                              {suburb.state} {suburb.postcode}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {suburb.medianPrice !== null ? formatCurrency(suburb.medianPrice) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-semibold ${suburb.growth12m !== null ? getGrowthColor(suburb.growth12m) : 'text-gray-500'}`}>
                              {suburb.growth12m !== null ? formatPercent(suburb.growth12m) : 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-semibold ${suburb.growth3m !== null ? getGrowthColor(suburb.growth3m) : 'text-gray-500'}`}>
                              {suburb.growth3m !== null ? formatPercent(suburb.growth3m) : 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Link
                              href={`/suburb/${encodeURIComponent(suburb.name.toLowerCase())}?state=${suburb.state}&postcode=${suburb.postcode}`}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'yield' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Top 10 Highest Rental Yield Suburbs (Cashflow Properties)
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Rank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Suburb
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Rental Yield
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Median Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Weekly Rent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.highYield.map((suburb, index) => (
                        <tr key={suburb.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-bold text-gray-900">#{index + 1}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{suburb.name}</div>
                            <div className="text-sm text-gray-500">
                              {suburb.state} {suburb.postcode}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-lg font-bold ${suburb.rentalYield !== null ? 'text-green-600' : 'text-gray-500'}`}>
                              {suburb.rentalYield !== null ? `${suburb.rentalYield.toFixed(2)}%` : 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {suburb.medianPrice !== null ? formatCurrency(suburb.medianPrice) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {suburb.weeklyRent !== null ? `$${suburb.weeklyRent}` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Link
                              href={`/suburb/${encodeURIComponent(suburb.name.toLowerCase())}?state=${suburb.state}&postcode=${suburb.postcode}`}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'value' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Top 10 Best Value Suburbs (Highest Investment Scores)
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Rank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Suburb
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Median Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Yield
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          12M Growth
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.bestValue.map((suburb, index) => (
                        <tr key={suburb.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-bold text-gray-900">#{index + 1}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{suburb.name}</div>
                            <div className="text-sm text-gray-500">
                              {suburb.state} {suburb.postcode}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xl font-bold text-blue-600">
                              {suburb.investmentScore}/100
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {suburb.medianPrice !== null ? formatCurrency(suburb.medianPrice) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            {suburb.rentalYield !== null ? `${suburb.rentalYield.toFixed(2)}%` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-semibold ${suburb.growth12m !== null ? getGrowthColor(suburb.growth12m) : 'text-gray-500'}`}>
                              {suburb.growth12m !== null ? formatPercent(suburb.growth12m) : 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Link
                              href={`/suburb/${encodeURIComponent(suburb.name.toLowerCase())}?state=${suburb.state}&postcode=${suburb.postcode}`}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}
