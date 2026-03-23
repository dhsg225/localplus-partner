// [2025-12-02] - DMO Dashboard - Destination Marketing Organization overview
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';

interface DMOStats {
  totalAttractions: number;
  publishedAttractions: number;
  featuredAttractions: number;
  totalEvents: number;
  upcomingEvents: number;
  totalActivities: number;
  publishedActivities: number;
}

const DMODashboard: React.FC = () => {
  const [stats, setStats] = useState<DMOStats>({
    totalAttractions: 0,
    publishedAttractions: 0,
    featuredAttractions: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    totalActivities: 0,
    publishedActivities: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Implement apiService.getDMOStats() when API endpoint is ready
      // For now, show placeholder stats
      setStats({
        totalAttractions: 0,
        publishedAttractions: 0,
        featuredAttractions: 0,
        totalEvents: 0,
        upcomingEvents: 0,
        totalActivities: 0,
        publishedActivities: 0
      });
    } catch (err: any) {
      console.error('[DMODashboard] Error loading stats:', err);
      setError(err?.message || 'Failed to load DMO statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading DMO dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm border border-red-200 bg-red-50 rounded-md p-3">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">DMO Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Destination Marketing Organization overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Attractions Stats */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Attractions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalAttractions}</p>
            </div>
            <div className="text-3xl">🏖️</div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Published</span>
              <span className="font-semibold text-green-600">{stats.publishedAttractions}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Featured</span>
              <span className="font-semibold text-yellow-600">{stats.featuredAttractions}</span>
            </div>
          </div>
        </div>

        {/* Events Stats */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Events</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalEvents}</p>
            </div>
            <div className="text-3xl">🎟️</div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Upcoming</span>
              <span className="font-semibold text-blue-600">{stats.upcomingEvents}</span>
            </div>
          </div>
        </div>

        {/* Activities Stats */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalActivities}</p>
            </div>
            <div className="text-3xl">🏄</div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Published</span>
              <span className="font-semibold text-green-600">{stats.publishedActivities}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Quick Actions</p>
            </div>
            <div className="text-3xl">⚡</div>
          </div>
          <div className="mt-4 space-y-2">
            <a
              href="/attractions"
              className="block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center text-sm"
            >
              Manage Attractions
            </a>
            <a
              href="/events"
              className="block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-center text-sm"
            >
              Manage Events
            </a>
            <a
              href="/activities"
              className="block px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 text-center text-sm"
            >
              Manage Activities
            </a>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-gray-500">
          <p>Recent activity will appear here once the system is fully integrated.</p>
        </div>
      </div>

      {/* Content Management Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Management</h3>
          <div className="space-y-2">
            <a
              href="/attractions-content"
              className="block px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-center"
            >
              Manage Attraction Content
            </a>
            <a
              href="/attractions-locations"
              className="block px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-center"
            >
              Manage Attraction Locations
            </a>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Taxonomy & Categories</h3>
          <div className="space-y-2">
            <a
              href="/taxonomy"
              className="block px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-center"
            >
              Manage Categories
            </a>
            <a
              href="/venues"
              className="block px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-center"
            >
              Manage Venues
            </a>
            <a
              href="/locations"
              className="block px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-center"
            >
              Manage Locations
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DMODashboard;

