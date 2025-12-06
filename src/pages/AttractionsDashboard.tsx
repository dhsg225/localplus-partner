// [2025-12-02] - Attractions Dashboard - Display and manage tourist attractions (DMO managed)
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import CreateAttractionModal from '../components/CreateAttractionModal';

interface AttractionRecord {
  id: string;
  name: string;
  description?: string;
  subtitle?: string;
  attraction_type?: string;
  category?: string;
  status: string;
  is_featured: boolean;
  is_free: boolean;
  admission_fee?: number;
  managed_by_dmo: boolean;
  hero_image_url?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

const AttractionsDashboard: React.FC = () => {
  const [attractions, setAttractions] = useState<AttractionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');

  const loadAttractions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getAttractions();
      const data = Array.isArray(response.data) ? response.data : response?.data?.data || [];
      setAttractions(data);
    } catch (err: any) {
      console.error('[AttractionsDashboard] Error loading attractions:', err);
      setError(err?.message || 'Failed to load attractions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttractions();
  }, []);

  const handleCreateSuccess = async () => {
    await loadAttractions();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attractions</h1>
          <p className="text-sm text-gray-500 mt-1">Manage tourist attractions and landmarks (DMO managed)</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`px-3 py-1 text-sm ${
                viewMode === 'card' ? 'bg-blue-600 text-white' : 'text-gray-600'
              }`}
            >
              Cards
            </button>
          </div>
          <button
            onClick={() => setCreateModalVisible(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Attraction
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm border border-red-200 bg-red-50 rounded-md p-3">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-8 text-gray-500">
          Loading attractions...
        </div>
      )}

      {!loading && attractions.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-lg mb-4">No attractions found.</p>
          <p className="text-gray-500">Click "Create Attraction" to add your first tourist attraction.</p>
        </div>
      )}

      {!loading && attractions.length > 0 && viewMode === 'list' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attractions.map((attraction) => (
                  <tr key={attraction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{attraction.name}</div>
                      {attraction.subtitle && (
                        <div className="text-sm text-gray-500">{attraction.subtitle}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attraction.attraction_type || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attraction.is_free ? 'Free' : `THB ${attraction.admission_fee?.toFixed(2) || '0.00'}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        attraction.status === 'published' ? 'bg-green-100 text-green-800' :
                        attraction.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {attraction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {attraction.is_featured ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          ⭐ Featured
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(attraction.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && attractions.length > 0 && viewMode === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractions.map((attraction) => (
            <div key={attraction.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
              {attraction.hero_image_url && (
                <img
                  src={attraction.hero_image_url}
                  alt={attraction.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{attraction.name}</h3>
                  {attraction.is_featured && (
                    <span className="text-yellow-500">⭐</span>
                  )}
                </div>
                {attraction.subtitle && (
                  <p className="text-sm text-gray-500 mb-2">{attraction.subtitle}</p>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {attraction.attraction_type}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    attraction.status === 'published' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {attraction.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {attraction.is_free ? 'Free admission' : `THB ${attraction.admission_fee?.toFixed(2) || '0.00'}`}
                </p>
                {attraction.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{attraction.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateAttractionModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default AttractionsDashboard;

