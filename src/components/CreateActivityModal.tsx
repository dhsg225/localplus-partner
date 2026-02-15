// [2025-12-02] - Modal for creating new activities
import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import MediaPicker from './MediaPicker';

interface CreateActivityModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateActivityModal: React.FC<CreateActivityModalProps> = ({
  visible,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subtitle: '',
    activity_type: '',
    category: '',
    duration_minutes: '',
    price: '',
    currency: 'THB',
    capacity: '',
    difficulty_level: '',
    address: '',
    latitude: '',
    longitude: '',
    map_url: '',
    hero_image_url: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        setError('Activity name is required');
        setLoading(false);
        return;
      }

      const activityData = {
        name: formData.name.trim(),
        description: formData.description || null,
        subtitle: formData.subtitle || null,
        activity_type: formData.activity_type || null,
        category: formData.category || null,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
        price: formData.price ? parseFloat(formData.price) : null,
        currency: formData.currency,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        difficulty_level: formData.difficulty_level || null,
        address: formData.address || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        map_url: formData.map_url || null,
        hero_image_url: formData.hero_image_url || null,
        status: formData.status
      };

      await apiService.createActivity(activityData);

      // Reset form
      setFormData({
        name: '',
        description: '',
        subtitle: '',
        activity_type: '',
        category: '',
        duration_minutes: '',
        price: '',
        currency: 'THB',
        capacity: '',
        difficulty_level: '',
        address: '',
        latitude: '',
        longitude: '',
        map_url: '',
        hero_image_url: '',
        status: 'draft'
      });

      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('[CreateActivityModal] Error creating activity:', err);
      setError(err?.message || 'Failed to create activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create New Activity</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="bg-white px-6 py-4 max-h-[70vh] overflow-y-auto">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
                    <select
                      value={formData.activity_type}
                      onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select type</option>
                      <option value="water_sports">Water Sports</option>
                      <option value="adventure">Adventure</option>
                      <option value="tours">Tours</option>
                      <option value="experiences">Experiences</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Hero Image Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hero Image
                  </label>
                  <div className="flex items-start gap-4">
                    {formData.hero_image_url ? (
                      <div className="relative w-40 h-24 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                        <img
                          src={`${formData.hero_image_url}?width=400`}
                          alt="Activity preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, hero_image_url: '' })}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-sm"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowMediaPicker(true)}
                        className="w-40 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-xs text-gray-500 font-medium">Add Photo</span>
                      </button>
                    )}
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.hero_image_url}
                        onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-2"
                        placeholder="Image URL or use picker"
                      />
                      <button
                        type="button"
                        onClick={() => setShowMediaPicker(true)}
                        className="text-sm text-blue-600 font-medium hover:text-blue-700"
                      >
                        Open Media Manager
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Activity'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPicker
        visible={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={(url) => {
          setFormData({ ...formData, hero_image_url: url });
          setShowMediaPicker(false);
        }}
      />
    </div>
  );
};

export default CreateActivityModal;

