'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SuburbOption {
  id: string;
  name: string;
  state: string;
  postcode: string;
}

export default function CreateListingPage() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Form data
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [suburbId, setSuburbId] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [propertyType, setPropertyType] = useState('House');
  const [listingType, setListingType] = useState('Sale');
  const [price, setPrice] = useState('');
  const [priceDisplay, setPriceDisplay] = useState('');
  const [weeklyRent, setWeeklyRent] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [carSpaces, setCarSpaces] = useState('');
  const [landSize, setLandSize] = useState('');
  const [buildingSize, setBuildingSize] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [availableFrom, setAvailableFrom] = useState('');
  const [inspectionTimes, setInspectionTimes] = useState('');
  const [contentOwnership, setContentOwnership] = useState('');
  const [dataSource, setDataSource] = useState('Agent Direct Entry');

  // Suburb search
  const [suburbSearch, setSuburbSearch] = useState('');
  const [suburbSuggestions, setSuburbSuggestions] = useState<SuburbOption[]>([]);
  const [selectedSuburb, setSelectedSuburb] = useState<SuburbOption | null>(null);

  // Feature input
  const [newFeature, setNewFeature] = useState('');

  // Note: Auth removed - all users are guests

  useEffect(() => {
    if (suburbSearch.length >= 2) {
      searchSuburbs();
    } else {
      setSuburbSuggestions([]);
    }
  }, [suburbSearch]);

  const searchSuburbs = async () => {
    try {
      const response = await fetch(`/api/suburbs/search?q=${encodeURIComponent(suburbSearch)}`);
      const data = await response.json();
      setSuburbSuggestions(data.suburbs || []);
    } catch (error) {
      console.error('Error searching suburbs:', error);
    }
  };

  const selectSuburb = (suburb: SuburbOption) => {
    setSelectedSuburb(suburb);
    setSuburbId(suburb.id);
    setSuburbSearch(`${suburb.name}, ${suburb.state} ${suburb.postcode}`);
    setSuburbSuggestions([]);
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFeatures(features.filter(f => f !== feature));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/listings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          suburbId,
          streetAddress,
          propertyType,
          listingType,
          price: price ? parseFloat(price) : null,
          priceDisplay: priceDisplay || null,
          weeklyRent: weeklyRent ? parseFloat(weeklyRent) : null,
          bedrooms: bedrooms ? parseInt(bedrooms) : null,
          bathrooms: bathrooms ? parseInt(bathrooms) : null,
          carSpaces: carSpaces ? parseInt(carSpaces) : null,
          landSize: landSize ? parseFloat(landSize) : null,
          buildingSize: buildingSize ? parseFloat(buildingSize) : null,
          features,
          availableFrom: availableFrom || null,
          inspectionTimes: inspectionTimes || null,
          contentOwnership,
          dataSource,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to create listing');
        return;
      }

      router.push(`/dashboard/agent/listings/${data.listing.id}/edit`);
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('An error occurred while creating the listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Listing</h1>
              <p className="text-gray-600 mt-1">Add a new property to your portfolio</p>
            </div>
            <Link
              href="/dashboard/agent/listings"
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Cancel
            </Link>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-6">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="font-medium">Details</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200">
              <div className={`h-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
            </div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="font-medium">Features</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200">
              <div className={`h-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} style={{ width: step >= 3 ? '100%' : '0%' }}></div>
            </div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="font-medium">Review</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Details */}
          {step === 1 && (
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Property Details</h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Listing Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g., Stunning 3BR Family Home with Pool"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={6}
                  placeholder="Describe the property, its features, location benefits, and what makes it special..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 50 characters. Be detailed and informative.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Listing Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Sale">For Sale</option>
                    <option value="Rent">For Rent</option>
                    <option value="Sold">Sold</option>
                    <option value="Leased">Leased</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Unit">Unit</option>
                    <option value="Villa">Villa</option>
                    <option value="Land">Land</option>
                    <option value="Acreage">Acreage</option>
                    <option value="Studio">Studio</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Suburb <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={suburbSearch}
                    onChange={(e) => setSuburbSearch(e.target.value)}
                    required
                    placeholder="Start typing suburb name..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {suburbSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {suburbSuggestions.map((suburb) => (
                        <button
                          key={suburb.id}
                          type="button"
                          onClick={() => selectSuburb(suburb)}
                          className="w-full px-4 py-2 text-left hover:bg-blue-50 transition"
                        >
                          {suburb.name}, {suburb.state} {suburb.postcode}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  required
                  placeholder="e.g., 123 Main Street"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {listingType === 'Rent' || listingType === 'Leased' ? 'Weekly Rent ($)' : 'Price ($)'}
                  </label>
                  {listingType === 'Rent' || listingType === 'Leased' ? (
                    <input
                      type="number"
                      value={weeklyRent}
                      onChange={(e) => setWeeklyRent(e.target.value)}
                      placeholder="e.g., 650"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g., 850000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price Display Text
                  </label>
                  <input
                    type="text"
                    value={priceDisplay}
                    onChange={(e) => setPriceDisplay(e.target.value)}
                    placeholder="e.g., Contact Agent, Auction"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank to show numeric price</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Next: Features →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Features */}
          {step === 2 && (
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Property Features</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bathrooms</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Car Spaces</label>
                  <input
                    type="number"
                    value={carSpaces}
                    onChange={(e) => setCarSpaces(e.target.value)}
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Land Size (sqm)</label>
                  <input
                    type="number"
                    value={landSize}
                    onChange={(e) => setLandSize(e.target.value)}
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Building Size (sqm)</label>
                <input
                  type="number"
                  value={buildingSize}
                  onChange={(e) => setBuildingSize(e.target.value)}
                  min="0"
                  placeholder="e.g., 180"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Property Features
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    placeholder="e.g., Pool, Ducted AC, Solar Panels"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Available From</label>
                  <input
                    type="date"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Inspection Times</label>
                  <input
                    type="text"
                    value={inspectionTimes}
                    onChange={(e) => setInspectionTimes(e.target.value)}
                    placeholder="e.g., Sat 10-11am, Sun 2-3pm"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Next: Review →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Review & Submit</h2>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Title</p>
                  <p className="font-semibold">{title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold">{streetAddress}, {suburbSearch}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-semibold">{propertyType} - {listingType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-semibold">
                      {priceDisplay || (price ? `$${parseFloat(price).toLocaleString()}` : weeklyRent ? `$${weeklyRent}/week` : 'Not specified')}
                    </p>
                  </div>
                </div>
                {(bedrooms || bathrooms || carSpaces) && (
                  <div>
                    <p className="text-sm text-gray-600">Features</p>
                    <p className="font-semibold">
                      {bedrooms && `${bedrooms} bed`}
                      {bedrooms && bathrooms && ' · '}
                      {bathrooms && `${bathrooms} bath`}
                      {(bedrooms || bathrooms) && carSpaces && ' · '}
                      {carSpaces && `${carSpaces} car`}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content Ownership Confirmation <span className="text-red-500">*</span>
                </label>
                <select
                  value={contentOwnership}
                  onChange={(e) => setContentOwnership(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select confirmation type</option>
                  <option value="I am the property owner">I am the property owner</option>
                  <option value="I have owner permission">I have written permission from the owner</option>
                  <option value="Licensed agent with authority">Licensed agent with listing authority</option>
                </select>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> By submitting this listing, you confirm that all information is accurate and that you have the right to list this property. False or misleading information may result in account suspension.
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !contentOwnership}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Listing'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
