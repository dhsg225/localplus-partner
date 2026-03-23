import React, { useState, useEffect } from 'react';
// Removed shared component import - using native HTML elements
import { bookingService } from '../services/bookingService';
import { supabase } from '../services/supabase';
import { authService } from '../services/authService';

const BookingDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]); // Store all bookings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // Selected date filter (YYYY-MM-DD)
  const [weekOffset, setWeekOffset] = useState(0); // Week offset for navigation (0 = current week)

  // Get business ID from authenticated user's partner profile
  const getBusinessId = async (): Promise<string | null> => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        console.log('[DEBUG] No user found');
        return null;
      }

      console.log('[DEBUG] User found:', user.id, user.email);

      // Check Supabase auth session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('[DEBUG] Supabase session:', session ? 'exists' : 'missing', sessionError?.message || '');
      if (!session) {
        console.log('[DEBUG] Setting Supabase session...');
        const token = localStorage.getItem('auth_token');
        if (token) {
          const { data: sessionData, error: setSessionError } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: ''
          } as any);
          console.log('[DEBUG] Set session result:', sessionData?.session ? 'success' : 'failed', setSessionError?.message || '');
        }
      }

      // Query partners table to get business IDs for this user
      // RLS policy requires auth.uid() = user_id, so Supabase client must be authenticated
      console.log('[DEBUG] Querying partners table for user:', user.id);
      const { data: partners, error: partnersError } = await supabase
        .from('partners')
        .select('business_id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .limit(1);

      if (partnersError) {
        console.error('[DEBUG] Error fetching partner businesses:', partnersError);
        return null;
      }

      console.log('[DEBUG] Partners found:', partners?.length || 0);

      if (partners && partners.length > 0) {
        console.log('[DEBUG] Business ID:', partners[0].business_id);
        return partners[0].business_id;
      }

      console.log('[DEBUG] No partner records found');
      return null;
    } catch (err) {
      console.error('[DEBUG] Error getting business ID:', err);
      return null;
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Re-filter bookings when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      setBookings(allBookings.filter(b => b.booking_date === selectedDate));
    } else {
      setBookings(allBookings);
    }
  }, [selectedDate, allBookings]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const businessId = await getBusinessId();
      if (!businessId) {
        setError('No business found for your account. Please contact support.');
        setLoading(false);
        return;
      }

      console.log('Loading bookings for business:', businessId);
      const data = await bookingService.getBookings(businessId);
      console.log('Loaded bookings:', data.length);
      setAllBookings(data); // Store all bookings - useEffect will handle filtering
    } catch (error: any) {
      console.error('Error loading bookings:', error);
      setError(error?.message || 'Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (bookingId: string, businessId: string) => {
    try {
      await bookingService.confirmBooking(bookingId, businessId);
      await loadBookings();
    } catch (error: any) {
      console.error('Error confirming booking:', error);
      setError(error?.message || 'Failed to confirm booking');
    }
  };

  const handleSeat = async (bookingId: string, businessId: string) => {
    try {
      await bookingService.seatBooking(bookingId, businessId);
      await loadBookings();
    } catch (error: any) {
      console.error('Error seating booking:', error);
      setError(error?.message || 'Failed to seat booking');
    }
  };

  const handleComplete = async (bookingId: string, businessId: string) => {
    try {
      await bookingService.completeBooking(bookingId, businessId);
      await loadBookings();
    } catch (error: any) {
      console.error('Error completing booking:', error);
      setError(error?.message || 'Failed to complete booking');
    }
  };

  const handleCancel = async (bookingId: string, businessId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    try {
      const reason = prompt('Please provide a cancellation reason:') || 'Cancelled by restaurant';
      await bookingService.cancelBooking(bookingId, businessId, reason);
      await loadBookings();
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      setError(error?.message || 'Failed to cancel booking');
    }
  };

  const handleMarkNoShow = async (bookingId: string, businessId: string) => {
    if (!confirm('Mark this booking as no-show?')) {
      return;
    }
    try {
      await bookingService.markNoShow(bookingId, businessId);
      await loadBookings();
    } catch (error: any) {
      console.error('Error marking no-show:', error);
      setError(error?.message || 'Failed to mark as no-show');
    }
  };

  // Generate calendar days (1 week, 7 days)
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate start of current week (Sunday)
    const startOfWeek = new Date(today);
    const dayOfWeek = startOfWeek.getDay(); // 0 = Sunday, 1 = Monday, etc.
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    
    // Apply week offset
    const weekStart = new Date(startOfWeek);
    weekStart.setDate(startOfWeek.getDate() + (weekOffset * 7));
    
    // Generate 7 days for the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue, etc.
      const dayNum = date.getDate(); // 1, 2, 3, etc.
      
      // Count bookings for this date
      const bookingCount = allBookings.filter(b => b.booking_date === dateStr).length;
      
      // Check if this is today
      const todayStr = today.toISOString().split('T')[0];
      const isToday = dateStr === todayStr;
      const isSelected = selectedDate === dateStr;
      
      days.push({
        date: dateStr,
        dayName,
        dayNum,
        bookingCount,
        isToday,
        isSelected
      });
    }
    
    return days;
  };

  const handlePreviousWeek = () => {
    setWeekOffset(weekOffset - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset(weekOffset + 1);
  };

  const handleToday = () => {
    setWeekOffset(0);
    setSelectedDate(null);
    setBookings(allBookings);
  };

  const handleDateClick = (dateStr: string) => {
    if (selectedDate === dateStr) {
      // Clicking the same date again clears the filter
      setSelectedDate(null);
      setBookings(allBookings);
    } else {
      // Filter bookings for selected date
      setSelectedDate(dateStr);
      setBookings(allBookings.filter(b => b.booking_date === dateStr));
    }
  };

  const calendarDays = generateCalendarDays();

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

      {/* Calendar View */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {selectedDate ? `Bookings for ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}` : 'Select a Date'}
          </h2>
          <button
            onClick={handleToday}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Today
          </button>
        </div>
        <div className="flex items-center gap-2">
          {/* Previous Week Arrow */}
          <button
            onClick={handlePreviousWeek}
            className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors flex-shrink-0"
            aria-label="Previous week"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2 flex-1">
            {calendarDays.map((day) => (
              <button
                key={day.date}
                onClick={() => handleDateClick(day.date)}
                className={`
                  p-3 rounded-lg border-2 transition-all text-center
                  ${day.isToday 
                    ? 'border-blue-500 bg-blue-50 font-semibold' 
                    : day.isSelected
                    ? 'border-green-500 bg-green-50 font-semibold'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }
                  ${day.bookingCount > 0 ? 'shadow-sm' : ''}
                `}
              >
                <div className="text-xs text-gray-500 mb-1">{day.dayName}</div>
                <div className={`text-lg ${day.isToday || day.isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                  {day.dayNum}
                </div>
                {day.bookingCount > 0 && (
                  <div className={`text-xs mt-1 px-1.5 py-0.5 rounded-full inline-block ${
                    day.isSelected ? 'bg-green-200 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {day.bookingCount}
                  </div>
                )}
              </button>
            ))}
          </div>
          
          {/* Next Week Arrow */}
          <button
            onClick={handleNextWeek}
            className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors flex-shrink-0"
            aria-label="Next week"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        {selectedDate && (
          <button
            onClick={() => {
              setSelectedDate(null);
              setBookings(allBookings);
            }}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Show All Bookings
          </button>
        )}
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {selectedDate ? 'Bookings' : 'All Bookings'}
        </h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No bookings found</p>
            <p className="text-sm mt-2">
              Customer bookings will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => {
              const bookingDate = new Date(`${booking.booking_date}T${booking.booking_time}`);
              const statusColors: Record<string, string> = {
                pending: 'bg-yellow-100 text-yellow-800',
                confirmed: 'bg-green-100 text-green-800',
                seated: 'bg-blue-100 text-blue-800',
                completed: 'bg-gray-100 text-gray-800',
                cancelled: 'bg-red-100 text-red-800',
                'no-show': 'bg-red-100 text-red-800'
              };

              // Alternating subtle background colors for visual contrast
              const backgroundColors = [
                'bg-blue-50',      // Light blue
                'bg-purple-50',    // Light purple
                'bg-pink-50',      // Light pink
                'bg-indigo-50',    // Light indigo
                'bg-cyan-50',      // Light cyan
                'bg-amber-50',     // Light amber
                'bg-emerald-50',   // Light emerald
                'bg-violet-50',    // Light violet
                'bg-rose-50',      // Light rose
                'bg-teal-50',      // Light teal
                'bg-orange-50',    // Light orange
                'bg-lime-50',      // Light lime
                'bg-sky-50'        // Light sky
              ];
              const bgColor = backgroundColors[index % backgroundColors.length];

              return (
                <div key={booking.id} className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${bgColor}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.customer_name}</h3>
                      <p className="text-sm text-gray-600">{booking.customer_email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status] || 'bg-gray-100 text-gray-800'}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                    <div>
                      <p className="text-gray-500">Date & Time</p>
                      <p className="font-medium">{bookingDate.toLocaleString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Party Size</p>
                      <p className="font-medium">{booking.party_size} guests</p>
                    </div>
                    {booking.confirmation_code && (
                      <div>
                        <p className="text-gray-500">Confirmation</p>
                        <p className="font-medium font-mono text-xs">{booking.confirmation_code}</p>
                      </div>
                    )}
                    {booking.customer_phone && (
                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="font-medium">{booking.customer_phone}</p>
                      </div>
                    )}
                  </div>

                  {booking.special_requests && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-500">Special Requests:</p>
                      <p className="text-sm text-gray-700">{booking.special_requests}</p>
                    </div>
                  )}

                  {booking.cancellation_reason && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-red-600">Cancellation Reason:</p>
                      <p className="text-sm text-gray-700">{booking.cancellation_reason}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleConfirm(booking.id, booking.business_id)}
                        className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                      >
                        ✓ Confirm
                      </button>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleSeat(booking.id, booking.business_id)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                      >
                        🪑 Seat
                      </button>
                    )}
                    {booking.status === 'seated' && (
                      <button
                        onClick={() => handleComplete(booking.id, booking.business_id)}
                        className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
                      >
                        ✓ Complete
                      </button>
                    )}
                    {!['cancelled', 'completed', 'no-show'].includes(booking.status) && (
                      <>
                        <button
                          onClick={() => handleCancel(booking.id, booking.business_id)}
                          className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                        >
                          ✕ Cancel
                        </button>
                        <button
                          onClick={() => handleMarkNoShow(booking.id, booking.business_id)}
                          className="px-3 py-1.5 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700 transition-colors"
                        >
                          ⚠️ No Show
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDashboard;
