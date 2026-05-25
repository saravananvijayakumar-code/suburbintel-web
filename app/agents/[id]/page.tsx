'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface AgentProfile {
  id: string;
  userId: string;
  agencyName: string;
  licenseNumber: string;
  state: string;
  bio: string | null;
  websiteUrl: string | null;
  phoneNumber: string | null;
  areasServed: string[];
  verificationStatus: string;
  subscriptionTier: string;
  activeListings: number;
  totalInquiries: number;
  createdAt: string;
}

interface Listing {
  id: string;
  title: string;
  suburb: string;
  state: string;
  postcode: string;
  propertyType: string;
  listingType: string;
  price: number | null;
  priceDisplay: string | null;
  weeklyRent: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  carSpaces: number | null;
  primaryImage: string | null;
  views: number;
  createdAt: string;
}

export default function AgentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchAgentProfile();
    }
  }, [params.id]);

  const fetchAgentProfile = async () => {
    setLoading(true);
    try {
      // Fetch agent profile
      const profileRes = await fetch(`/api/agents/${params.id}/public`);
      if (!profileRes.ok) {
        router.push('/properties');
        return;
      }
      const profileData = await profileRes.json();
      setProfile(profileData.profile);

      // Fetch agent's listings
      const listingsRes = await fetch(`/api/agents/${params.id}/listings`);
      if (listingsRes.ok) {
        const listingsData = await listingsRes.json();
        setListings(listingsData.listings || []);
      }
    } catch (error) {
      console.error('Error fetching agent profile:', error);
      router.push('/properties');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-blue-600">
              {profile.agencyName.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{profile.agencyName}</h1>
              <div className="flex items-center gap-4 text-blue-100">
                {profile.verificationStatus === 'verified' && (
                  <span className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Agent
                  </span>
                )}
                <span>📍 {profile.state}</span>
                <span>🏢 License #{profile.licenseNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {profile.bio && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Areas Served */}
            {profile.areasServed.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Areas Served</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.areasServed.map((area, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Current Listings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Current Listings ({listings.length})
              </h2>

              {listings.length === 0 ? (
                <p className="text-gray-600">No active listings at the moment.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {listings.map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/properties/${listing.id}`}
                      className="border border-gray-200 rounded-lg hover:shadow-lg transition overflow-hidden group"
                    >
                      <div className="relative h-48 bg-gray-200">
                        {listing.primaryImage ? (
                          <Image
                            src={listing.primaryImage}
                            alt={listing.title}
                            fill
                            className="object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="font-bold text-lg text-blue-600 mb-1">
                          {listing.price 
                            ? `$${listing.price.toLocaleString()}`
                            : listing.weeklyRent
                            ? `$${listing.weeklyRent}/week`
                            : listing.priceDisplay || 'Contact Agent'}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{listing.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {listing.suburb}, {listing.state} {listing.postcode}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          {listing.bedrooms && <span>🛏️ {listing.bedrooms}</span>}
                          {listing.bathrooms && <span>🛁 {listing.bathrooms}</span>}
                          {listing.carSpaces && <span>🚗 {listing.carSpaces}</span>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact</h3>
              
              {profile.phoneNumber && (
                <a
                  href={`tel:${profile.phoneNumber}`}
                  className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition font-semibold mb-3"
                >
                  📞 {profile.phoneNumber}
                </a>
              )}

              {profile.websiteUrl && (
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  🌐 Visit Website
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Statistics</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Active Listings</div>
                  <div className="text-2xl font-bold text-blue-600">{profile.activeListings}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Inquiries</div>
                  <div className="text-2xl font-bold text-green-600">{profile.totalInquiries}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Member Since</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {new Date(profile.createdAt).toLocaleDateString('en-AU', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
