// [2025-12-01] - Locations Dashboard - Display and manage all locations/venues
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import CreateLocationModal from '../components/CreateLocationModal';

interface LocationRecord {
  id: string;
  name: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  map_url?: string;
  image_url?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

const LocationsDashboard: React.FC = () => {
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);

  const loadLocations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getLocations();
      const data = Array.isArray(response.data) ? response.data : response?.data?.data || [];
      setLocations(data);
    } catch (err: any) {
      console.error('[LocationsDashboard] Error loading locations:', err);
      setError(err?.message || 'Failed to load locations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const handleCreateSuccess = async () => {
    await loadLocations();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
          <p className="text-sm text-gray-500 mt-1">Manage event locations and venues</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Create Location button */}
          <button
            onClick={() => setCreateModalVisible(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Location
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
          Loading locations...
        </div>
      )}

      {!loading && !error && locations.length === 0 && (
        <div className="text-gray-500 text-sm border border-gray-200 bg-white rounded-md p-6 text-center">
          No locations found. Create your first location to get started.
        </div>
      )}

      {!loading && !error && locations.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coordinates</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Map URL</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {locations.map((location) => (
                  <tr key={location.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{location.name}</div>
                      {location.description && (
                        <div className="text-xs text-gray-500 mt-1">{location.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{location.address || '-'}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {location.latitude && location.longitude ? (
                        <div className="text-sm text-gray-900">
                          {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {location.map_url ? (
                        <a
                          href={location.map_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 truncate max-w-xs block"
                        >
                          {location.map_url}
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(location.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Location Modal */}
      <CreateLocationModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default LocationsDashboard;

