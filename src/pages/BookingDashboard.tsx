import React, { useState, useEffect } from 'react';
// Removed shared component import - using native HTML elements

const BookingDashboard: React.FC = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      // This will be implemented when we have the booking service
      console.log('Loading bookings...');
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
        <button 
          onClick={loadBookings} 
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          All Bookings
        </h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-500">Loading bookings...</p>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No bookings found</p>
            <p className="text-sm mt-2">
              Customer bookings will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDashboard;
