'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AgentProfile {
  id: string;
  agencyName: string;
  licenseNumber: string;
  state: string;
  bio: string | null;
  websiteUrl: string | null;
  phoneNumber: string | null;
  areasServed: string[];
  verificationStatus: string;
  subscriptionTier: string;
  subscriptionExpiresAt: string | null;
}

export default function AgentSettingsPage() {
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [agencyName, setAgencyName] = useState('');
  const [bio, setBio] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [areasServed, setAreasServed] = useState<string[]>([]);
  const [newArea, setNewArea] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/agents/profile');
      const data = await response.json();
      
      if (data.profile) {
        setProfile(data.profile);
        setAgencyName(data.profile.agencyName);
        setBio(data.profile.bio || '');
        setWebsiteUrl(data.profile.websiteUrl || '');
        setPhoneNumber(data.profile.phoneNumber || '');
        setAreasServed(data.profile.areasServed || []);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/agents/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agencyName,
          bio: bio || null,
          websiteUrl: websiteUrl || null,
          phoneNumber: phoneNumber || null,
          areasServed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to update profile');
        return;
      }

      alert('Profile updated successfully!');
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating your profile');
    } finally {
      setSaving(false);
    }
  };

  const addArea = () => {
    if (newArea.trim() && !areasServed.includes(newArea.trim())) {
      setAreasServed([...areasServed, newArea.trim()]);
      setNewArea('');
    }
  };

  const removeArea = (area: string) => {
    setAreasServed(areasServed.filter(a => a !== area));
  };

  const getTierBadge = (tier: string) => {
    const badges = {
      basic: 'bg-gray-100 text-gray-800 border border-gray-300',
      premium: 'bg-blue-100 text-blue-800 border border-blue-300',
      enterprise: 'bg-purple-100 text-purple-800 border border-purple-300',
    };
    return badges[tier as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
              <p className="text-gray-600 mt-1">Manage your agent profile and subscription</p>
            </div>
            <Link
              href="/dashboard/agent"
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Subscription Info */}
        {profile && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Current Plan</h2>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-4 py-2 rounded-full font-bold text-sm ${getTierBadge(profile.subscriptionTier)} bg-white`}>
                    {profile.subscriptionTier.toUpperCase()}
                  </span>
                  {profile.subscriptionExpiresAt && (
                    <span className="text-blue-100">
                      Expires: {new Date(profile.subscriptionExpiresAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="text-blue-100">
                  {profile.subscriptionTier === 'basic' && (
                    <p>Free plan - 5 active listings</p>
                  )}
                  {profile.subscriptionTier === 'premium' && (
                    <p>$49/month - 20 active listings + priority support</p>
                  )}
                  {profile.subscriptionTier === 'enterprise' && (
                    <p>$199/month - Unlimited listings + dedicated account manager</p>
                  )}
                </div>
              </div>
              {profile.subscriptionTier !== 'enterprise' && (
                <Link
                  href="/dashboard/agent/upgrade"
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
                >
                  Upgrade Plan
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Verification Status */}
        {profile && profile.verificationStatus !== 'verified' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Your account is pending verification. Some features may be limited until verification is complete.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow p-6 mb-8 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Information</h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Agency Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                License Number
              </label>
              <input
                type="text"
                value={profile?.licenseNumber || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">License number cannot be changed. Contact support if needed.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={profile?.state || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., 0412 345 678"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourwebsite.com.au"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio / About Me
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                placeholder="Tell potential clients about yourself, your experience, and what makes you a great agent..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">This will appear on your public agent profile</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Areas Served
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArea())}
                  placeholder="e.g., Parramatta, Sydney CBD"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addArea}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {areasServed.map((area, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {area}
                    <button
                      type="button"
                      onClick={() => removeArea(area)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <button
                type="submit"
                disabled={saving}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>

        {/* Account Actions */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account Actions</h2>
          
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-semibold text-gray-900">Change Password</p>
              <p className="text-sm text-gray-600">Update your account password</p>
            </div>
            <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
              Change
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-semibold text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Manage your email preferences</p>
            </div>
            <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
              Configure
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-semibold text-gray-900">Privacy Settings</p>
              <p className="text-sm text-gray-600">Control your profile visibility</p>
            </div>
            <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
              Manage
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold text-red-600">Delete Account</p>
              <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 text-red-600 hover:text-red-700 font-medium">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

