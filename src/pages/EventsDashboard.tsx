// [2025-11-28 23:35] - Partner Events dashboard showing events from Event Engine for the current business
// [2025-11-29] - Auto-redirects super admins to SuperuserEventsDashboard
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { authService } from '../services/authService';
import { supabase } from '../services/supabase';
import SuperuserEventsDashboard from './SuperuserEventsDashboard';
import CreateEventModal from '../components/CreateEventModal';

interface EventRecord {
  id: string;
  title: string;
  description?: string;
  status: string;
  start_time: string;
  end_time: string;
  event_type: string;
  business_id: string | null;
}

const EventsDashboard: React.FC = () => {
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [duplicateEventData, setDuplicateEventData] = useState<any>(null); // [2025-12-07] - Event data for duplication

  // [2025-11-28 23:35] - Reuse business lookup pattern from BookingDashboard to scope events per partner
  // [2025-11-30] - Fixed: Use Supabase session directly instead of API call
  const getBusinessId = async (): Promise<string | null> => {
    try {
      // [2025-11-30] - Get user from Supabase session directly (no API call needed)
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return null;
      }

      // Set Supabase session
      const { data: { session } } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: token
      } as any);

      if (!session) {
        return null;
      }

      // Get user from Supabase session
      const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !supabaseUser) {
        console.error('[EventsDashboard] Error getting Supabase user:', userError);
        return null;
      }

      const { data: partners, error: partnersError } = await supabase
        .from('partners')
        .select('business_id')
        .eq('user_id', supabaseUser.id)
        .eq('is_active', true)
        .limit(1);

      if (partnersError) {
        console.error('[EventsDashboard] Error fetching partner businesses:', partnersError);
        return null;
      }

      if (partners && partners.length > 0) {
        return partners[0].business_id;
      }

      return null;
    } catch (err) {
      console.error('[EventsDashboard] Error getting business ID:', err);
      return null;
    }
  };

  // [2025-11-29] - Check if user is super admin by querying user_roles table
  // [2025-11-30] - Fixed: Use Supabase session directly instead of API call
  const checkSuperAdmin = async (): Promise<boolean> => {
    try {
      // [2025-11-30] - Get user from Supabase session directly (no API call needed)
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.log('[EventsDashboard] No auth token found');
        return false;
      }

      // Set Supabase session FIRST before any queries
      // This is critical for RLS policies to work (auth.uid() needs to be set)
      const { data: { session }, error: sessionError } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: token // Use access_token as fallback
      } as any);

      if (sessionError) {
        console.error('[EventsDashboard] Error setting Supabase session:', sessionError);
        return false;
      }

      if (!session) {
        console.error('[EventsDashboard] No Supabase session after setSession');
        return false;
      }

      // [2025-11-30] - Get user from Supabase session (not API)
      const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !supabaseUser) {
        console.error('[EventsDashboard] Error getting Supabase user after setSession:', userError);
        return false;
      }

      console.log('[EventsDashboard] Checking super admin for user:', supabaseUser.id);
      console.log('[EventsDashboard] Supabase auth.uid():', supabaseUser.id);
      console.log('[EventsDashboard] Session valid:', !!session);

      // [2025-01-XX] - Verify session is fully set before querying
      // Wait a moment to ensure session propagation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Double-check session is still valid
      const { data: { user: verifyUser }, error: verifyError } = await supabase.auth.getUser();
      if (verifyError || !verifyUser) {
        console.error('[EventsDashboard] Session lost after setSession:', verifyError);
        return false;
      }
      console.log('[EventsDashboard] Verified session user ID:', verifyUser.id);

      // [2025-01-XX] - Query user_roles table to check for super_admin OR events_superuser role
      // [2025-11-30] - RLS policies should allow this now that session is set
      // Using supabaseUser.id instead of user.id (from API)
      console.log('[EventsDashboard] Querying user_roles for user_id:', supabaseUser.id);
      console.log('[EventsDashboard] Session access_token present:', !!session?.access_token);
      
      // Try querying with explicit auth header
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', supabaseUser.id)
        .in('role', ['super_admin', 'events_superuser'])
        .eq('is_active', true)
        .limit(1);

      console.log('[EventsDashboard] Query result - data:', roles, 'error:', error);
      if (error) {
        console.error('[EventsDashboard] Full error object:', JSON.stringify(error, null, 2));
      }
      
      if (error) {
        console.error('[EventsDashboard] Error checking super admin role:', error);
        console.error('[EventsDashboard] Error code:', error.code);
        console.error('[EventsDashboard] Error message:', error.message);
        console.error('[EventsDashboard] Error details:', JSON.stringify(error, null, 2));
        return false;
      }

      const isSuperAdmin = (roles && roles.length > 0) || false;
      console.log('[EventsDashboard] Super admin check result:', isSuperAdmin);
      console.log('[EventsDashboard] Roles found:', roles);
      
      return isSuperAdmin;
    } catch (err) {
      console.error('[EventsDashboard] Error checking super admin:', err);
      return false;
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // [2025-11-29] - Super admins can view all events, not just their business
      const userIsSuperAdmin = await checkSuperAdmin();
      
      let businessId: string | undefined = undefined;
      
      if (!userIsSuperAdmin) {
        // Regular partners: filter by their business
        businessId = await getBusinessId() || undefined;
        if (!businessId) {
          setError('No business found for your account. Please contact support.');
          setLoading(false);
          return;
        }
      }
      // Super admins: businessId remains undefined to fetch all events

      const response = await apiService.getEvents({
        ...(businessId && { businessId }), // Only include businessId if not super admin
        ...(!userIsSuperAdmin && { status: 'published' }), // Only filter by status for non-super admins
        limit: 100
      });

      console.log('[EventsDashboard] API response:', response);
      const data = Array.isArray(response.data) ? response.data : response?.data?.data || [];
      console.log('[EventsDashboard] Parsed events:', data.length, 'events');
      setEvents(data);
    } catch (err: any) {
      console.error('[EventsDashboard] Error loading events:', err);
      setError(err?.message || 'Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // [2025-11-30] - Fixed React Hooks violation: All hooks must be called before any conditional returns
  useEffect(() => {
    // Check if user is super admin first
    checkSuperAdmin().then((result) => {
      console.log('[EventsDashboard] Initial super admin check result:', result);
      setIsSuperAdmin(result);
    }).catch((err) => {
      console.error('[EventsDashboard] Error in initial super admin check:', err);
      setIsSuperAdmin(false);
    });
  }, []);

  // [2025-11-30] - Load events for regular partners (not super admins)
  // This hook must be called before conditional returns to follow Rules of Hooks
  useEffect(() => {
    // Only load events if we've determined the user is NOT a super admin
    if (isSuperAdmin === false) {
      loadEvents();
    }
  }, [isSuperAdmin]);

  // [2025-12-01] - Handle create event success
  const handleCreateSuccess = async () => {
    await loadEvents();
    setDuplicateEventData(null); // [2025-12-07] - Clear duplicate data after success
  };

  // [2025-12-07] - Handle duplicate event - fetch full event details and open modal
  const handleDuplicateEvent = async (eventId: string) => {
    try {
      setLoading(true);
      const response = await apiService.getEvent(eventId);
      const eventData = response.data?.data || response.data;
      
      if (eventData) {
        setDuplicateEventData(eventData);
        setCreateModalVisible(true);
      } else {
        setError('Failed to load event details for duplication');
      }
    } catch (err: any) {
      console.error('[EventsDashboard] Error loading event for duplication:', err);
      setError(err?.message || 'Failed to load event details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If super admin, show superuser dashboard
  if (isSuperAdmin === true) {
    return <SuperuserEventsDashboard />;
  }

  // If still checking, show loading
  if (isSuperAdmin === null) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Checking permissions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateModalVisible(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Event
          </button>
          <button
            onClick={loadEvents}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm border border-red-200 bg-red-50 rounded-md p-3">
          {error}
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div className="text-gray-500 text-sm border border-gray-200 bg-white rounded-md p-6 text-center">
          No events found.
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="space-y-4">
          {events.map((event) => {
            const start = new Date(event.start_time);
            const end = new Date(event.end_time);
            return (
              <div
                key={event.id}
                className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-900">{event.title}</h2>
                    {event.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {event.event_type}
                    </span>
                    {/* [2025-12-07] - Duplicate button */}
                    <button
                      onClick={() => handleDuplicateEvent(event.id)}
                      disabled={loading}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 flex items-center gap-1"
                      title="Duplicate this event"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Duplicate
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 mt-2">
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="font-medium capitalize">{event.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Start</p>
                    <p className="font-medium">
                      {start.toLocaleString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">End</p>
                    <p className="font-medium">
                      {end.toLocaleString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateEventModal
        visible={createModalVisible}
        onClose={() => {
          setCreateModalVisible(false);
          setDuplicateEventData(null); // [2025-12-07] - Clear duplicate data when closing
        }}
        onSuccess={handleCreateSuccess}
        initialData={duplicateEventData} // [2025-12-07] - Pass duplicate data to modal
      />
    </div>
  );
};

export default EventsDashboard;


