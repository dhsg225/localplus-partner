// [2025-11-29] - Superuser Events Dashboard
// Operations dashboard for super admins to view and manage ALL events
// [2025-11-30] - Added edit modal and view modal for event management
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { authService } from '../services/authService';
import { supabase } from '../services/supabase';
import EditEventModal from '../components/EditEventModal';
import ViewEventModal from '../components/ViewEventModal';
import CreateEventModal from '../components/CreateEventModal';
import CreateOrganizerModal from '../components/CreateOrganizerModal';
import CreateLocationModal from '../components/CreateLocationModal';

interface EventRecord {
  id: string;
  title: string;
  description?: string;
  subtitle?: string;
  status: string;
  start_time: string;
  end_time: string;
  event_type: string;
  event_type_names?: string; // [2025-12-01] - Resolved category names from WordPress term IDs
  business_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  location?: string;
  venue_area?: string;
  hero_image_url?: string;
  theme_color_hex?: string;
  venue_map_url?: string;
  learn_more_url?: string;
  timezone_id?: string;
  venue_latitude?: number;
  venue_longitude?: number;
  is_recurring?: boolean;
  recurrence_rule?: {
    frequency: string;
    interval: number;
    byweekday?: number[];
    bymonthday?: number | null;
    bysetpos?: number | null;
    until?: string | null;
    count?: number | null;
    exceptions?: string[];
    additional_dates?: string[];
    timezone: string;
  };
  metadata?: {
    eventon_organizer_id?: string;
    organizer_name?: string;
    organizer_description?: string;
    organizer_contact?: string;
    organizer_address?: string;
    organizer_image?: string;
    [key: string]: any;
  };
}

interface PaginationInfo {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}

const SuperuserEventsDashboard: React.FC = () => {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    limit: 50,
    offset: 0,
    total: 0,
    hasMore: false
  });

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    eventType: '',
    onlyUpcoming: false,
    onlyScraped: false,
    sortBy: 'start_time' as 'start_time' | 'created_at' | 'title' | 'event_type' | 'status' | 'location' | 'organizer',
    sortOrder: 'desc' as 'asc' | 'desc' // [2025-12-23] - Default to descending (newest first)
  });

  // [2025-12-05] - Search query
  const [searchQuery, setSearchQuery] = useState('');

  // [2025-12-05] - Multi-select state
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());

  // [2025-11-30] - View mode: 'list' or 'card'
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');

  // [2025-11-30] - Edit modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);

  // [2025-11-30] - View modal state
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<EventRecord | null>(null);

  // [2025-12-01] - Create event modal state
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [createOrganizerModalVisible, setCreateOrganizerModalVisible] = useState(false);
  const [createLocationModalVisible, setCreateLocationModalVisible] = useState(false);
  const [duplicateEventData, setDuplicateEventData] = useState<any>(null); // [2025-12-07] - Event data for duplication

  // [2025-11-30] - Check if user is super admin using Supabase session directly
  // Fixed: Use Supabase session instead of API call to avoid "Invalid or expired token" errors
  const isSuperAdmin = async (): Promise<boolean> => {
    try {
      // Get user from Supabase session directly (no API call needed)
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.log('[SuperuserEventsDashboard] No auth token found');
        return false;
      }

      // Set Supabase session FIRST before any queries
      // This is critical for RLS policies to work (auth.uid() needs to be set)
      const { data: { session }, error: sessionError } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: token // Use access_token as fallback
      } as any);

      if (sessionError) {
        console.error('[SuperuserEventsDashboard] Error setting Supabase session:', sessionError);
        return false;
      }

      if (!session) {
        console.error('[SuperuserEventsDashboard] No Supabase session after setSession');
        return false;
      }

      // [2025-01-XX] - Get user from Supabase session (not API)
      const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !supabaseUser) {
        console.error('[SuperuserEventsDashboard] Error getting Supabase user after setSession:', userError);
        return false;
      }

      console.log('[SuperuserEventsDashboard] Checking super admin for user:', supabaseUser.id);
      console.log('[SuperuserEventsDashboard] Supabase auth.uid():', supabaseUser.id);
      console.log('[SuperuserEventsDashboard] Session valid:', !!session);

      // [2025-01-XX] - Verify session is fully set before querying
      // Wait a moment to ensure session propagation
      await new Promise(resolve => setTimeout(resolve, 100));

      // Double-check session is still valid
      const { data: { user: verifyUser }, error: verifyError } = await supabase.auth.getUser();
      if (verifyError || !verifyUser) {
        console.error('[SuperuserEventsDashboard] Session lost after setSession:', verifyError);
        return false;
      }
      console.log('[SuperuserEventsDashboard] Verified session user ID:', verifyUser.id);

      // [2025-01-XX] - Query user_roles table to check for super_admin OR events_superuser role
      // [2025-11-30] - RLS policies should allow this now that session is set
      // Using supabaseUser.id instead of user.id (from API)
      console.log('[SuperuserEventsDashboard] Querying user_roles for user_id:', supabaseUser.id);
      console.log('[SuperuserEventsDashboard] Session access_token present:', !!session?.access_token);
      console.log('[SuperuserEventsDashboard] RLS policy should match: user_id = auth.uid()');
      console.log('[SuperuserEventsDashboard] Expected: user_id =', supabaseUser.id, 'auth.uid() =', verifyUser.id);

      // Test query: Try querying ALL roles first to see if RLS is working at all
      const { data: allRoles, error: allRolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', supabaseUser.id);

      console.log('[SuperuserEventsDashboard] Test query (all roles for user):', allRoles, 'error:', allRolesError);

      // Now query with filters
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', supabaseUser.id)
        .in('role', ['super_admin', 'events_superuser'])
        .eq('is_active', true)
        .limit(1);

      console.log('[SuperuserEventsDashboard] Query result - data:', roles, 'error:', error);
      if (error) {
        console.error('[SuperuserEventsDashboard] Full error object:', JSON.stringify(error, null, 2));
        console.error('[SuperuserEventsDashboard] Error checking super admin role:', error);
        console.error('[SuperuserEventsDashboard] Error code:', error.code);
        console.error('[SuperuserEventsDashboard] Error message:', error.message);
        console.error('[SuperuserEventsDashboard] Error details:', JSON.stringify(error, null, 2));
        return false;
      }

      const isSuperAdmin = (roles && roles.length > 0) || false;
      console.log('[SuperuserEventsDashboard] Super admin check result:', isSuperAdmin);
      console.log('[SuperuserEventsDashboard] Roles found:', roles);

      return isSuperAdmin;
    } catch (err) {
      console.error('[SuperuserEventsDashboard] Error checking super admin:', err);
      return false;
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const userIsSuperAdmin = await isSuperAdmin();
      if (!userIsSuperAdmin) {
        setError('Super admin access required');
        setLoading(false);
        return;
      }

      // [2025-11-29] - Use dedicated superuser endpoint
      // [2025-01-XX] - Include search query for server-side search
      const response = await apiService.getSuperuserEvents({
        limit: pagination.limit,
        offset: pagination.offset,
        status: filters.status || undefined,
        eventType: filters.eventType || undefined,
        onlyUpcoming: filters.onlyUpcoming || undefined,
        onlyScraped: filters.onlyScraped || undefined,
        search: searchQuery.trim() || undefined, // [2025-01-XX] - Server-side search
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });

      console.log('[SuperuserEventsDashboard] API response:', response);

      if (response.success) {
        const data = Array.isArray(response.data) ? response.data : [];
        setEvents(data);
        if (response.pagination) {
          setPagination({
            ...pagination,
            total: response.pagination.total || 0,
            hasMore: response.pagination.hasMore || false
          });
        }
      } else {
        setError(response.error || 'Failed to load events');
      }
    } catch (err: any) {
      console.error('[SuperuserEventsDashboard] Error loading events:', err);
      setError(err?.message || 'Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [pagination.offset, filters, searchQuery]); // [2025-01-XX] - Reload when search query changes

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, offset: 0 })); // Reset to first page
  };

  // [2025-01-06] - Handle column header click for sorting
  const handleSort = (column: 'start_time' | 'created_at' | 'title' | 'event_type' | 'status' | 'location' | 'organizer') => {
    if (filters.sortBy === column) {
      // Toggle sort order if clicking the same column
      setFilters(prev => ({
        ...prev,
        sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      // Set new sort column with ascending order
      setFilters(prev => ({
        ...prev,
        sortBy: column,
        sortOrder: 'asc'
      }));
    }
    setPagination(prev => ({ ...prev, offset: 0 })); // Reset to first page
  };

  // [2025-01-06] - Get sort icon for column header
  const getSortIcon = (column: 'start_time' | 'created_at' | 'title' | 'event_type' | 'status' | 'location' | 'organizer') => {
    if (filters.sortBy !== column) {
      return (
        <span className="ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
          ↕
        </span>
      );
    }
    return (
      <span className="ml-1 text-blue-600">
        {filters.sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  const handlePageChange = (newOffset: number) => {
    setPagination(prev => ({ ...prev, offset: newOffset }));
  };

  // [2025-12-05] - Multi-select handlers
  const handleSelectEvent = (eventId: string) => {
    setSelectedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  // [2025-12-05] - Calculate filtered events at component level for use in handleSelectAll
  // [2025-01-XX] - Server-side search now handles filtering, so we just use events directly
  // Client-side filtering removed since search is now done server-side
  const filteredEvents = events;

  const handleSelectAll = () => {
    if (selectedEvents.size === filteredEvents.length && filteredEvents.length > 0) {
      setSelectedEvents(new Set());
    } else {
      setSelectedEvents(new Set(filteredEvents.map(e => e.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEvents.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedEvents.size} event(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      const deletePromises = Array.from(selectedEvents).map(eventId =>
        apiService.superuserDeleteEvent(eventId, `Bulk delete via Superuser Dashboard`)
      );
      await Promise.all(deletePromises);
      setSelectedEvents(new Set());
      await loadEvents();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete events');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkPublish = async () => {
    if (selectedEvents.size === 0) return;

    const eventIds = Array.from(selectedEvents);
    const total = eventIds.length;

    try {
      setLoading(true);
      setError(null);

      // [2025-12-05] - Process in batches of 10 to avoid overwhelming the API
      const batchSize = 10;
      let successCount = 0;
      let failCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < eventIds.length; i += batchSize) {
        const batch = eventIds.slice(i, i + batchSize);
        const batchPromises = batch.map(async (eventId) => {
          try {
            await apiService.superuserUpdateEvent(eventId, { status: 'published' }, 'Bulk publish via Superuser Dashboard');
            successCount++;
            return { eventId, success: true };
          } catch (err: any) {
            failCount++;
            const errorMsg = err?.message || 'Unknown error';
            errors.push(`Event ${eventId.substring(0, 8)}: ${errorMsg}`);
            return { eventId, success: false, error: errorMsg };
          }
        });

        await Promise.all(batchPromises);

        // Small delay between batches to avoid rate limiting
        if (i + batchSize < eventIds.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      if (failCount > 0) {
        setError(`Published ${successCount}/${total} events. ${failCount} failed. ${errors.slice(0, 3).join('; ')}${errors.length > 3 ? '...' : ''}`);
      } else {
        setError(null);
      }

      setSelectedEvents(new Set());
      await loadEvents();
    } catch (err: any) {
      setError(err?.message || 'Failed to publish events');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDraft = async () => {
    if (selectedEvents.size === 0) return;

    const eventIds = Array.from(selectedEvents);
    const total = eventIds.length;

    try {
      setLoading(true);
      setError(null);

      // [2025-12-05] - Process in batches of 10
      const batchSize = 10;
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < eventIds.length; i += batchSize) {
        const batch = eventIds.slice(i, i + batchSize);
        const batchPromises = batch.map(async (eventId) => {
          try {
            await apiService.superuserUpdateEvent(eventId, { status: 'draft' }, 'Bulk set to draft via Superuser Dashboard');
            successCount++;
            return { success: true };
          } catch (err: any) {
            failCount++;
            return { success: false };
          }
        });

        await Promise.all(batchPromises);

        if (i + batchSize < eventIds.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      if (failCount > 0) {
        setError(`Updated ${successCount}/${total} events. ${failCount} failed.`);
      }

      setSelectedEvents(new Set());
      await loadEvents();
    } catch (err: any) {
      setError(err?.message || 'Failed to update events');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCancel = async () => {
    if (selectedEvents.size === 0) return;

    if (!confirm(`Are you sure you want to cancel ${selectedEvents.size} event(s)?`)) {
      return;
    }

    const eventIds = Array.from(selectedEvents);
    const total = eventIds.length;

    try {
      setLoading(true);
      setError(null);

      // [2025-12-05] - Process in batches of 10
      const batchSize = 10;
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < eventIds.length; i += batchSize) {
        const batch = eventIds.slice(i, i + batchSize);
        const batchPromises = batch.map(async (eventId) => {
          try {
            await apiService.superuserUpdateEvent(eventId, { status: 'cancelled' }, 'Bulk cancel via Superuser Dashboard');
            successCount++;
            return { success: true };
          } catch (err: any) {
            failCount++;
            return { success: false };
          }
        });

        await Promise.all(batchPromises);

        if (i + batchSize < eventIds.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      if (failCount > 0) {
        setError(`Cancelled ${successCount}/${total} events. ${failCount} failed.`);
      }

      setSelectedEvents(new Set());
      await loadEvents();
    } catch (err: any) {
      setError(err?.message || 'Failed to cancel events');
    } finally {
      setLoading(false);
    }
  };

  // [2025-11-30] - Handle view button click
  const handleViewClick = (event: EventRecord) => {
    setViewingEvent(event);
    setViewModalVisible(true);
  };

  // [2025-11-30] - Handle edit button click
  const handleEditClick = (event: EventRecord) => {
    setSelectedEvent(event);
    setEditModalVisible(true);
  };

  // [2025-11-30] - Handle edit from view modal
  const handleEditFromView = () => {
    if (viewingEvent) {
      setViewModalVisible(false);
      setSelectedEvent(viewingEvent);
      setEditModalVisible(true);
    }
  };

  // [2025-11-30] - Handle save event updates
  // [2025-12-05] - Updated to handle recurrence_rules
  const handleSaveEvent = async (updates: Partial<EventRecord> & { recurrence_rules?: any }) => {
    if (!selectedEvent) return;

    try {
      await apiService.superuserUpdateEvent(selectedEvent.id, updates, 'Updated via Superuser Dashboard');
      // Reload events to show updated data
      await loadEvents();
    } catch (err: any) {
      throw new Error(err?.message || 'Failed to update event');
    }
  };

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
      console.error('[SuperuserEventsDashboard] Error loading event for duplication:', err);
      setError(err?.message || 'Failed to load event details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scraped_draft': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // [2025-11-30] - Get category color for card view (EventOn-style)
  const getCategoryColor = (eventType: string) => {
    switch (eventType?.toLowerCase()) {
      case 'music': return 'bg-blue-500';
      case 'food': return 'bg-pink-500';
      case 'art': return 'bg-purple-500';
      case 'wellness': return 'bg-green-500';
      case 'sports': return 'bg-orange-500';
      default: return 'bg-indigo-500';
    }
  };

  // [2025-11-30] - Format date for card view (EventOn-style)
  const formatCardDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString(undefined, { month: 'short' }).toUpperCase(),
      full: date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-6 w-full">
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">Superuser Events Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage all events across the platform</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 2xl:justify-end flex-1 min-w-0">
          {/* [2025-12-05] - Search bar with button */}
          <div className="relative flex items-center gap-2 flex-grow max-w-md">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    loadEvents();
                  }
                }}
                className="pl-10 pr-4 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={() => {
                setPagination(prev => ({ ...prev, offset: 0 })); // Reset to first page
                loadEvents();
              }}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              title="Search events"
            >
              Search
            </button>
            {searchQuery.trim() && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPagination(prev => ({ ...prev, offset: 0 }));
                  loadEvents();
                }}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                title="Clear search"
              >
                Clear
              </button>
            )}
          </div>
          {/* [2025-12-05] - Bulk actions */}
          {selectedEvents.size > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-md">
              <span className="text-sm font-medium text-blue-700">
                {selectedEvents.size} selected
              </span>
              <div className="h-4 w-px bg-blue-300"></div>
              <button
                onClick={handleBulkPublish}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                title="Publish selected events"
              >
                Publish
              </button>
              <button
                onClick={handleBulkDraft}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                title="Set selected events to draft"
              >
                Draft
              </button>
              <button
                onClick={handleBulkCancel}
                className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors"
                title="Cancel selected events"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                title="Delete selected events"
              >
                Delete
              </button>
              <div className="h-4 w-px bg-blue-300"></div>
              <button
                onClick={() => setSelectedEvents(new Set())}
                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors"
                title="Clear selection"
              >
                Clear
              </button>
            </div>
          )}
          {/* [2025-12-05] - Refresh Button */}
          <button
            onClick={loadEvents}
            disabled={loading}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 flex-shrink-0 transition-colors shadow-sm"
            title="Refresh events"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">{loading ? '...' : 'Refresh'}</span>
          </button>

          {/* [2025-12-01] - Create dropdown menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowCreateDropdown(!showCreateDropdown)}
              className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center gap-1.5 transition-colors shadow-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create</span>
              <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showCreateDropdown && (
              <>
                {/* Click outside to close */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowCreateDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setCreateModalVisible(true);
                        setShowCreateDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Create Event
                    </button>
                    <button
                      onClick={() => {
                        setCreateOrganizerModalVisible(true);
                        setShowCreateDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Create Organiser
                    </button>
                    <button
                      onClick={() => {
                        setCreateLocationModalVisible(true);
                        setShowCreateDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Create Location
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* [2025-11-30] - View selector buttons */}
          <div className="flex items-center gap-0 border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm flex-shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1.5 transition-colors border-r border-gray-300 ${viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'text-gray-500 hover:bg-gray-50'
                }`}
              title="List View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`px-2.5 py-1.5 transition-colors ${viewMode === 'card'
                ? 'bg-blue-600 text-white'
                : 'text-gray-500 hover:bg-gray-50'
                }`}
              title="Card View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scraped_draft">Scraped Draft</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filters.eventType}
              onChange={(e) => handleFilterChange('eventType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="music">Music</option>
              <option value="festival">Festival</option>
              <option value="wellness">Wellness</option>
              <option value="food">Food</option>
              <option value="sports">Sports</option>
            </select>
          </div>

        </div>

        <div className="mt-4 flex gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.onlyUpcoming}
              onChange={(e) => handleFilterChange('onlyUpcoming', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Only Upcoming</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.onlyScraped}
              onChange={(e) => handleFilterChange('onlyScraped', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Only Scraped</span>
          </label>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm border border-red-200 bg-red-50 rounded-md p-3">
          {error}
        </div>
      )}

      {/* Events Display - List or Card View */}
      {!loading && !error && (() => {
        return (
          <>
            {searchQuery.trim() && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-sm text-blue-700">
                Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} matching "{searchQuery}"
                {pagination.total > 0 && ` (${pagination.total} total)`}
              </div>
            )}
            {viewMode === 'list' ? (
              /* List View (Table) */
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {/* [2025-12-05] - Select all checkbox */}
                        <th className="px-4 py-3 w-12">
                          <input
                            type="checkbox"
                            checked={filteredEvents.length > 0 && selectedEvents.size === filteredEvents.length}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            title="Select all events"
                          />
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group transition-colors min-w-[400px]"
                          onClick={() => handleSort('title')}
                        >
                          <div className="flex items-center">
                            Title
                            {getSortIcon('title')}
                          </div>
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group transition-colors"
                          onClick={() => handleSort('start_time')}
                        >
                          <div className="flex items-center">
                            Date & Time
                            {getSortIcon('start_time')}
                          </div>
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group transition-colors"
                          onClick={() => handleSort('event_type')}
                        >
                          <div className="flex items-center">
                            Category
                            {getSortIcon('event_type')}
                          </div>
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group transition-colors"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center">
                            Status
                            {getSortIcon('status')}
                          </div>
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group transition-colors"
                          onClick={() => handleSort('location')}
                        >
                          <div className="flex items-center">
                            Location
                            {getSortIcon('location')}
                          </div>
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group transition-colors"
                          onClick={() => handleSort('organizer')}
                        >
                          <div className="flex items-center">
                            Organizer
                            {getSortIcon('organizer')}
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[150px]">Address</th>
                        <th
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group transition-colors"
                          onClick={() => handleSort('created_at')}
                        >
                          <div className="flex items-center">
                            Created
                            {getSortIcon('created_at')}
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEvents.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                            {searchQuery.trim() ? `No events found matching "${searchQuery}"` : 'No events found'}
                          </td>
                        </tr>
                      ) : (
                        filteredEvents.map((event) => (
                          <tr key={event.id} className={`hover:bg-gray-50 ${selectedEvents.has(event.id) ? 'bg-blue-50' : ''}`}>
                            {/* [2025-12-05] - Select checkbox */}
                            <td className="px-4 py-4">
                              <input
                                type="checkbox"
                                checked={selectedEvents.has(event.id)}
                                onChange={() => handleSelectEvent(event.id)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                {event.is_recurring && (
                                  <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full" title="Recurring event">
                                    🔁
                                  </span>
                                )}
                              </div>
                              {event.subtitle && (
                                <div className="text-xs text-gray-500 mt-1">{event.subtitle}</div>
                              )}
                              {event.is_recurring && event.recurrence_rule && (
                                <div className="text-xs text-purple-600 mt-1">
                                  {event.recurrence_rule.frequency === 'daily' && `Every ${event.recurrence_rule.interval} day(s)`}
                                  {event.recurrence_rule.frequency === 'weekly' && `Every ${event.recurrence_rule.interval} week(s)`}
                                  {event.recurrence_rule.frequency === 'monthly' && `Every ${event.recurrence_rule.interval} month(s)`}
                                  {event.recurrence_rule.frequency === 'yearly' && `Every ${event.recurrence_rule.interval} year(s)`}
                                </div>
                              )}
                              {event.business_id && (
                                <div className="text-xs text-gray-400 mt-1">Business: {event.business_id.substring(0, 8)}...</div>
                              )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatDate(event.start_time)}</div>
                              <div className="text-xs text-gray-500">to {formatDate(event.end_time)}</div>
                              {event.is_recurring && (
                                <div className="mt-1 flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded w-fit whitespace-nowrap">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                  <span>Repeats</span>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {event.event_type_names || event.event_type || 'general'}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(event.status)}`}>
                                {event.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              {event.venue_area || event.location || '—'}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              {event.metadata?.organizer_name || '—'}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 max-w-[200px]">
                              <div className="whitespace-normal break-words text-xs">
                                {event.metadata?.organizer_address || event.location || event.venue_area || '—'}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(event.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4 text-xs font-medium">
                              <div className="flex flex-col items-start gap-1.5">
                                <button
                                  onClick={() => handleViewClick(event)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => handleEditClick(event)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDuplicateEvent(event.id)}
                                  disabled={loading}
                                  className="text-green-600 hover:text-green-900"
                                  title="Duplicate this event"
                                >
                                  Duplicate
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Card View (EventOn-style) */
              <div className="space-y-4">
                {filteredEvents.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                    {searchQuery.trim() ? `No events found matching "${searchQuery}"` : 'No events found'}
                  </div>
                ) : (
                  filteredEvents.map((event) => {
                    const startDate = formatCardDate(event.start_time);
                    const endDate = formatCardDate(event.end_time);
                    const categoryColor = getCategoryColor(event.event_type);
                    const isSameDay = startDate.day === endDate.day && startDate.month === endDate.month;
                    const isSelected = selectedEvents.has(event.id);

                    return (
                      <div
                        key={event.id}
                        className={`${categoryColor} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow ${isSelected ? 'ring-4 ring-blue-400' : ''} relative`}
                      >
                        {/* [2025-12-05] - Select checkbox for card view */}
                        <div className="absolute top-4 right-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectEvent(event.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="flex items-start gap-4">
                          {/* Date Indicator */}
                          <div className="flex-shrink-0">
                            <div className="text-center">
                              <div className="text-3xl font-bold">{startDate.day}</div>
                              <div className="text-xs font-medium opacity-90">{startDate.month}</div>
                              {!isSameDay && (
                                <>
                                  <div className="text-lg font-bold mt-2">{endDate.day}</div>
                                  <div className="text-xs font-medium opacity-90">{endDate.month}</div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Event Content */}
                          <div className="flex-1 min-w-0">
                            {/* Status Badge */}
                            <div className="mb-2">
                              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${event.status === 'published' ? 'bg-green-500' :
                                event.status === 'draft' ? 'bg-gray-400' :
                                  event.status === 'scraped_draft' ? 'bg-yellow-500' :
                                    'bg-red-400'
                                }`}>
                                {event.status.toUpperCase()}
                              </span>
                            </div>

                            {/* Title */}
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold leading-tight">{event.title}</h3>
                              {event.is_recurring && (
                                <span className="px-2 py-1 text-xs font-medium bg-white bg-opacity-30 text-white rounded-full" title="Recurring event">
                                  🔁 Recurring
                                </span>
                              )}
                            </div>

                            {event.subtitle && (
                              <div className="text-sm italic opacity-90 mb-3 uppercase tracking-wider">
                                {event.subtitle}
                              </div>
                            )}
                            {event.is_recurring && event.recurrence_rule && (
                              <div className="mb-2 text-sm opacity-90">
                                {event.recurrence_rule.frequency === 'daily' && `Repeats every ${event.recurrence_rule.interval} day(s)`}
                                {event.recurrence_rule.frequency === 'weekly' && `Repeats every ${event.recurrence_rule.interval} week(s)`}
                                {event.recurrence_rule.frequency === 'monthly' && `Repeats every ${event.recurrence_rule.interval} month(s)`}
                                {event.recurrence_rule.frequency === 'yearly' && `Repeats every ${event.recurrence_rule.interval} year(s)`}
                              </div>
                            )}

                            {/* Date & Time */}
                            <div className="mb-2 text-sm opacity-90">
                              <span className="font-medium">{startDate.full}</span>
                              {!isSameDay && (
                                <> to <span className="font-medium">{endDate.full}</span></>
                              )}
                            </div>
                            <div className="mb-2 text-sm opacity-90">
                              {new Date(event.start_time).toLocaleTimeString(undefined, {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })}
                              {' - '}
                              {new Date(event.end_time).toLocaleTimeString(undefined, {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </div>

                            {/* Location */}
                            {(event.venue_area || event.location) && (
                              <div className="mb-2 text-sm opacity-90">
                                📍 {event.venue_area || event.location}
                              </div>
                            )}

                            {/* Category */}
                            <div className="mb-3">
                              <span className="inline-block px-3 py-1 bg-white bg-opacity-20 text-white text-xs font-semibold rounded-full">
                                {event.event_type_names || event.event_type || 'General'}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-4">
                              <button
                                onClick={() => handleViewClick(event)}
                                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-sm font-medium rounded-md transition-colors"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleEditClick(event)}
                                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-sm font-medium rounded-md transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDuplicateEvent(event.id)}
                                disabled={loading}
                                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                                title="Duplicate this event"
                              >
                                Duplicate
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Pagination */}
            {pagination.total > 0 && !searchQuery.trim() && (
              <div className="bg-white border border-gray-200 rounded-lg px-6 py-3 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} events
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(Math.max(0, pagination.offset - pagination.limit))}
                    disabled={pagination.offset === 0}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.offset + pagination.limit)}
                    disabled={!pagination.hasMore}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        );
      })()}

      {loading && (
        <div className="text-center py-8 text-gray-500">
          Loading events...
        </div>
      )}

      {/* View Event Modal */}
      <ViewEventModal
        visible={viewModalVisible}
        event={viewingEvent}
        onClose={() => {
          setViewModalVisible(false);
          setViewingEvent(null);
        }}
        onEdit={handleEditFromView}
      />

      {/* Edit Event Modal */}
      <EditEventModal
        visible={editModalVisible}
        event={selectedEvent}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedEvent(null);
        }}
        onSave={handleSaveEvent}
      />

      {/* Create Event Modal */}
      <CreateEventModal
        visible={createModalVisible}
        onClose={() => {
          setCreateModalVisible(false);
          setDuplicateEventData(null); // [2025-12-07] - Clear duplicate data when closing
        }}
        onSuccess={handleCreateSuccess}
        initialData={duplicateEventData} // [2025-12-07] - Pass duplicate data to modal
      />

      {/* Create Organizer Modal */}
      <CreateOrganizerModal
        visible={createOrganizerModalVisible}
        onClose={() => setCreateOrganizerModalVisible(false)}
        onSuccess={() => {
          // Refresh organizers list in CreateEventModal if needed
          // For now, just close
        }}
      />

      {/* Create Location Modal */}
      <CreateLocationModal
        visible={createLocationModalVisible}
        onClose={() => setCreateLocationModalVisible(false)}
        onSuccess={() => {
          // Refresh locations list if needed
        }}
      />
    </div>
  );
};

export default SuperuserEventsDashboard;

