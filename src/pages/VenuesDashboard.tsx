// [2025-12-02] - Venues Dashboard - Display and manage all venues
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';

interface VenueRecord {
  id: string;
  name: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  map_url?: string;
  image_url?: string;
  venue_type?: string;
  capacity?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

const VenuesDashboard: React.FC = () => {
  const [venues, setVenues] = useState<VenueRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVenues = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getVenues();
      const data = Array.isArray(response.data) ? response.data : response?.data?.data || [];
      setVenues(data);
    } catch (err: any) {
      console.error('[VenuesDashboard] Error loading venues:', err);
      setError(err?.message || 'Failed to load venues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVenues();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Venues</h1>
          <p className="text-sm text-gray-500 mt-1">Manage event venues</p>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm border border-red-200 bg-red-50 rounded-md p-3">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-8 text-gray-500">
          Loading venues...
        </div>
      )}

      {!loading && !error && venues.length === 0 && (
        <div className="text-gray-500 text-sm border border-gray-200 bg-white rounded-md p-6 text-center">
          No venues found.
        </div>
      )}

      {!loading && !error && venues.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coordinates</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Map URL</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {venues.map((venue) => (
                  <tr key={venue.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{venue.name}</div>
                      {venue.description && (
                        <div className="text-xs text-gray-500 mt-1">{venue.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {venue.venue_type ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {venue.venue_type}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{venue.address || '-'}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {venue.latitude && venue.longitude ? (
                        <div className="text-sm text-gray-900">
                          {venue.latitude.toFixed(6)}, {venue.longitude.toFixed(6)}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {venue.capacity || '-'}
                    </td>
                    <td className="px-4 py-3">
                      {venue.map_url ? (
                        <a
                          href={venue.map_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 truncate max-w-xs block"
                        >
                          View Map
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenuesDashboard;

