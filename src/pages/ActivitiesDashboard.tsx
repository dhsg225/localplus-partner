// [2025-12-02] - Activities Dashboard - Display and manage tourism activities
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import CreateActivityModal from '../components/CreateActivityModal';

interface ActivityRecord {
  id: string;
  name: string;
  description?: string;
  subtitle?: string;
  activity_type?: string;
  category?: string;
  duration_minutes?: number;
  price?: number;
  currency?: string;
  capacity?: number;
  difficulty_level?: string;
  status: string;
  is_available: boolean;
  hero_image_url?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

const ActivitiesDashboard: React.FC = () => {
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getActivities();
      const data = Array.isArray(response.data) ? response.data : response?.data?.data || [];
      setActivities(data);
    } catch (err: any) {
      console.error('[ActivitiesDashboard] Error loading activities:', err);
      setError(err?.message || 'Failed to load activities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleCreateSuccess = async () => {
    await loadActivities();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <p className="text-sm text-gray-500 mt-1">Manage tourism activities and experiences</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateModalVisible(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Activity
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
          Loading activities...
        </div>
      )}

      {!loading && activities.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-lg mb-4">No activities found.</p>
          <p className="text-gray-500">Click "Create Activity" to add your first tourism activity.</p>
        </div>
      )}

      {!loading && activities.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{activity.name}</div>
                      {activity.subtitle && (
                        <div className="text-sm text-gray-500">{activity.subtitle}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.activity_type || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.duration_minutes ? `${activity.duration_minutes} min` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.price ? `${activity.currency || 'THB'} ${activity.price.toFixed(2)}` : 'Free'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.capacity || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        activity.status === 'published' ? 'bg-green-100 text-green-800' :
                        activity.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CreateActivityModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default ActivitiesDashboard;

