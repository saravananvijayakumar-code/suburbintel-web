'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  listingId?: string;
  onUploadComplete: (url: string) => void;
  maxFiles?: number;
}

export default function ImageUpload({ listingId, onUploadComplete, maxFiles = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (!rightsConfirmed) {
      alert('Please confirm you have rights to use these images');
      return;
    }

    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!rightsConfirmed) {
      alert('Please confirm you have rights to use these images');
      e.target.value = '';
      return;
    }

    const files = Array.from(e.target.files || []);
    await uploadFiles(files);
  };

  const uploadFiles = async (files: File[]) => {
    if (uploadedImages.length + files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images`);
      return;
    }

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        if (listingId) formData.append('listingId', listingId);
        formData.append('isPrimary', i === 0 && uploadedImages.length === 0 ? 'true' : 'false');
        formData.append('rightsConfirmed', 'true');

        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        
        if (!response.ok) {
          alert(data.error || 'Failed to upload image');
          continue;
        }

        setUploadedImages(prev => [...prev, data.url]);
        onUploadComplete(data.url);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Rights Confirmation */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={rightsConfirmed}
            onChange={(e) => setRightsConfirmed(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm text-yellow-800">
            <strong>Image Rights Confirmation:</strong> I confirm that I own these images or have the legal right to use them for this property listing. I understand that using copyrighted images without permission may result in account suspension.
          </span>
        </label>
      </div>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => rightsConfirmed && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : rightsConfirmed
            ? 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            : 'border-gray-200 bg-gray-100 cursor-not-allowed'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          disabled={!rightsConfirmed}
          className="hidden"
        />
        
        <div className="flex flex-col items-center">
          <svg
            className={`w-16 h-16 mb-4 ${rightsConfirmed ? 'text-gray-400' : 'text-gray-300'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className={`text-lg font-semibold mb-2 ${rightsConfirmed ? 'text-gray-900' : 'text-gray-500'}`}>
            {uploading ? 'Uploading...' : 'Drop images here or click to browse'}
          </p>
          <p className="text-sm text-gray-600">
            JPEG, PNG, or WebP • Max 10MB per file • Up to {maxFiles} images
          </p>
          {!rightsConfirmed && (
            <p className="text-sm text-red-600 mt-2">
              Please confirm image rights first
            </p>
          )}
        </div>
      </div>

      {/* Uploaded Images Preview */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploadedImages.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                  Primary
                </div>
              )}
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-600 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="flex items-center justify-center py-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Uploading images...</span>
        </div>
      )}
    </div>
  );
}
