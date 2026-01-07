// [2026-01-07] - Media Picker component for Event Media Manager
// Integrated with Bunny.net and Supabase

import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

interface MediaRecord {
    id: string;
    filename: string;
    bunny_path: string;
    cdn_url: string;
    width?: number;
    height?: number;
    created_at: string;
}

interface MediaPickerProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
    title?: string;
}

const MediaPicker: React.FC<MediaPickerProps> = ({
    visible,
    onClose,
    onSelect,
    title = 'Select Media'
}) => {
    const [activeTab, setActiveTab] = useState<'upload' | 'library'>('library');
    const [mediaItems, setMediaItems] = useState<MediaRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        limit: 12,
        offset: 0,
        total: 0,
        hasMore: false
    });

    useEffect(() => {
        if (visible && activeTab === 'library') {
            loadMedia();
        }
    }, [visible, activeTab, pagination.offset]);

    const loadMedia = async () => {
        try {
            setLoading(true);
            const response = await apiService.getMedia({
                limit: pagination.limit,
                offset: pagination.offset
            });

            if (response.success) {
                setMediaItems(response.data);
                setPagination(prev => ({
                    ...prev,
                    total: response.pagination.total,
                    hasMore: response.pagination.hasMore
                }));
            }
        } catch (err: any) {
            console.error('[MediaPicker] Error loading media:', err);
            setError('Failed to load media library');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        try {
            setUploading(true);
            setError(null);
            const response = await apiService.uploadMedia(file);

            if (response.success) {
                // Success! Automatically select the uploaded image
                onSelect(response.data.cdn_url);
                onClose();
            }
        } catch (err: any) {
            console.error('[MediaPicker] Upload error:', err);
            setError(err?.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" onClick={onClose} />

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    {/* Header */}
                    <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`px-6 py-3 text-sm font-medium ${activeTab === 'library' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('library')}
                        >
                            Media Library
                        </button>
                        <button
                            className={`px-6 py-3 text-sm font-medium ${activeTab === 'upload' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('upload')}
                        >
                            Upload New
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 bg-gray-50 min-h-[400px]">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {activeTab === 'upload' ? (
                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                                </svg>
                                <p className="text-gray-600 mb-6">Drag and drop your event image, or click to browse</p>
                                <input
                                    type="file"
                                    id="media-upload"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                    accept="image/*"
                                />
                                <label
                                    htmlFor="media-upload"
                                    className={`px-6 py-3 rounded-md text-white font-medium cursor-pointer transition-all ${uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                >
                                    {uploading ? 'Uploading...' : 'Select File'}
                                </label>
                            </div>
                        ) : (
                            <div>
                                {loading && mediaItems.length === 0 ? (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {mediaItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="group relative aspect-square bg-gray-200 rounded-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all"
                                                    onClick={() => onSelect(item.cdn_url)}
                                                >
                                                    <img
                                                        src={`${item.cdn_url}?width=200&height=200&crop=smart`}
                                                        alt={item.filename}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {mediaItems.length === 0 && !loading && (
                                            <div className="text-center py-12 text-gray-500">
                                                No images found in your library.
                                            </div>
                                        )}

                                        {/* Pagination */}
                                        {pagination.hasMore && (
                                            <div className="mt-8 flex justify-center">
                                                <button
                                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                                    onClick={() => setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }))}
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Loading...' : 'Load More'}
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaPicker;
