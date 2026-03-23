// [2024-09-26] - API service for Partner app - replaces shared dependencies
// [2025-11-26] - Fixed: Use import.meta.env instead of process.env for Vite
// [2025-11-28 23:30] - Added Event Engine endpoints for listing and creating events
// [2025-11-29] - Updated: API Gateway now includes /api/auth endpoint
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.localplus.city';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('auth_token');

    // [2025-11-29] - Debug logging to see actual URL being called
    console.log('[ApiService] Request URL:', url);
    console.log('[ApiService] API_BASE_URL:', API_BASE_URL);

    // [2025-11-30] - Debug: Log token info and decode to check algorithm
    if (token) {
      console.log('[ApiService] Token present, length:', token.length, 'starts with:', token.substring(0, 20) + '...');

      // [2025-11-30] - Decode token to check algorithm (for debugging token transformation)
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const header = JSON.parse(atob(tokenParts[0]));
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('[ApiService] Token algorithm (from frontend):', header.alg);
          console.log('[ApiService] Token issuer (from frontend):', payload.iss);
          console.log('[ApiService] Token email (from frontend):', payload.email);
          console.log('[ApiService] Token sub (from frontend):', payload.sub);
        }
      } catch (e) {
        console.warn('[ApiService] Could not decode token:', e);
      }
    } else {
      console.warn('[ApiService] ⚠️ No token found in localStorage');
    }

    // [2025-11-30] - Only send custom headers for special endpoints to bypass token transformation
    // [2026-01-07] - Include /media endpoint for workaround
    const isSpecialEndpoint = endpoint.includes('/events/all') || endpoint.includes('/media');

    const config: RequestInit = {
      headers: {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token && {
          Authorization: `Bearer ${token}`,
          // [2025-11-30] - WORKAROUND: Also send token in custom headers for special endpoints
          ...(isSpecialEndpoint && {
            'X-User-Token': token,
            'X-Supabase-Token': token,
            'X-Original-Authorization': `Bearer ${token}`
          })
        }),
        ...options.headers,
      },
      ...options,
    };

    // Remove Content-Type if it was set to 'undefined' (hack for bypassing default)
    if (config.headers && (config.headers as any)['Content-Type'] === 'undefined') {
      delete (config.headers as any)['Content-Type'];
    }

    const response = await fetch(url, config);

    // [2025-11-29] - Better error handling to see actual error message
    if (!response.ok) {
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
        console.error('[ApiService] Error response:', errorData);
      } catch (e) {
        // Response not JSON, use status text
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Auth endpoints
  // [2025-11-29] - Using API Gateway /api/auth endpoint
  async login(email: string, password: string) {
    return this.request('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request('/api/auth', {
      method: 'GET',
    });
  }

  // [2025-12-05] - User registration with business type
  // Note: Registration doesn't require authentication, so we skip the token
  async register(email: string, password: string, businessType: string, businessName: string) {
    const url = `${API_BASE_URL}/api/auth/register`;
    console.log('[ApiService] Registration request URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, business_type: businessType, business_name: businessName }),
    });

    if (!response.ok) {
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
        console.error('[ApiService] Registration error response:', errorData);
      } catch (e) {
        // Response not JSON, use status text
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async logout() {
    return this.request('/api/auth', {
      method: 'DELETE',
    });
  }

  // Booking endpoints
  async getBookings(businessId: string, status?: string, limit = 50, offset = 0) {
    const params = new URLSearchParams({
      businessId,
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (status) {
      params.append('status', status);
    }

    return this.request(`/api/bookings?${params}`);
  }

  async getBookingById(id: string) {
    return this.request(`/api/bookings/${id}`);
  }

  async createBooking(bookingData: any) {
    return this.request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async confirmBooking(id: string, restaurantId: string) {
    return this.request(`/api/bookings/${id}/confirm`, {
      method: 'PUT',
      body: JSON.stringify({ restaurantId }),
    });
  }

  async cancelBooking(id: string, reason?: string) {
    return this.request(`/api/bookings/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  async seatBooking(id: string) {
    return this.request(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        status: 'seated',
        seated_at: new Date().toISOString()
      }),
    });
  }

  async completeBooking(id: string) {
    return this.request(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        status: 'completed',
        completed_at: new Date().toISOString()
      }),
    });
  }

  async markNoShow(id: string) {
    return this.request(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'no_show' }),
    });
  }

  // Notification endpoints
  async getNotificationPreferences(businessId: string) {
    return this.request(`/api/notifications?businessId=${businessId}`);
  }

  async updateNotificationPreferences(preferences: any) {
    return this.request('/api/notifications', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  }

  // Events endpoints - Event Engine Phase 1
  async getEvents(params: {
    businessId?: string;
    status?: string;
    eventType?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const searchParams = new URLSearchParams();

    if (params.businessId) searchParams.set('businessId', params.businessId);
    if (params.status) searchParams.set('status', params.status);
    if (params.eventType) searchParams.set('eventType', params.eventType);
    if (params.startDate) searchParams.set('startDate', params.startDate);
    if (params.endDate) searchParams.set('endDate', params.endDate);

    searchParams.set('limit', String(params.limit ?? 50));
    searchParams.set('offset', String(params.offset ?? 0));

    const query = searchParams.toString();
    const endpoint = query ? `/api/events?${query}` : '/api/events';

    return this.request(endpoint, {
      method: 'GET',
    });
  }

  async createEvent(eventData: any) {
    return this.request('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  // [2025-12-05] - Get single event with recurrence rule
  async getEvent(eventId: string) {
    return this.request(`/api/events/${eventId}`, {
      method: 'GET',
    });
  }

  // [2025-12-05] - Update event with recurrence rules support
  async updateEvent(eventId: string, eventData: any) {
    return this.request(`/api/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  // [2025-12-01] - Organizers endpoints
  // [2025-01-XX] - Added search parameter for autocomplete
  async getOrganizers(search?: string) {
    const url = search ? `/api/organizers?search=${encodeURIComponent(search)}` : '/api/organizers';
    return this.request(url, {
      method: 'GET',
    });
  }

  async createOrganizer(organizerData: {
    name: string;
    description?: string;
    contact?: string;
    address?: string;
    image_url?: string;
    website_url?: string;
  }) {
    return this.request('/api/organizers', {
      method: 'POST',
      body: JSON.stringify(organizerData),
    });
  }

  // [2025-12-01] - Locations endpoints
  // [2025-01-XX] - Added search parameter for autocomplete
  async getLocations(search?: string) {
    const url = search ? `/api/locations?search=${encodeURIComponent(search)}` : '/api/locations';
    return this.request(url, {
      method: 'GET',
    });
  }

  // [2025-01-XX] - Categories endpoints (wp_term_mapping)
  async getCategories(search?: string) {
    const url = search ? `/api/categories?search=${encodeURIComponent(search)}` : '/api/categories';
    return this.request(url, {
      method: 'GET',
    });
  }

  // [2025-01-23] - Calendars endpoints (inspired by EventON's calendar system)
  async getCalendars(search?: string) {
    const url = search ? `/api/calendars?search=${encodeURIComponent(search)}` : '/api/calendars';
    return this.request(url, {
      method: 'GET',
    });
  }

  async createLocation(locationData: {
    name: string;
    description?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    map_url?: string;
    image_url?: string;
    facebook_url?: string;
  }) {
    return this.request('/api/locations', {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
  }

  // [2025-12-02] - Venues endpoints
  async getVenues() {
    return this.request('/api/venues', {
      method: 'GET',
    });
  }

  async createVenue(venueData: {
    name: string;
    description?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    map_url?: string;
    image_url?: string;
    facebook_url?: string;
    venue_type?: string;
    capacity?: number;
  }) {
    return this.request('/api/venues', {
      method: 'POST',
      body: JSON.stringify(venueData),
    });
  }

  // [2025-11-29] - Superuser events endpoints (super admin only)
  async getSuperuserEvents(params: {
    limit?: number;
    offset?: number;
    city?: string;
    businessId?: string;
    category?: string;
    status?: string;
    eventType?: string;
    createdBy?: string;
    startDate?: string;
    endDate?: string;
    onlyUpcoming?: boolean;
    onlyScraped?: boolean;
    needsReview?: boolean;
    search?: string; // [2025-01-XX] - Server-side search query
    sortBy?: 'start_time' | 'created_at' | 'title' | 'event_type' | 'status' | 'location' | 'organizer';
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    const searchParams = new URLSearchParams();

    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.offset) searchParams.set('offset', String(params.offset));
    if (params.city) searchParams.set('city', params.city);
    if (params.businessId) searchParams.set('businessId', params.businessId);
    if (params.category) searchParams.set('category', params.category);
    if (params.status) searchParams.set('status', params.status);
    if (params.eventType) searchParams.set('eventType', params.eventType);
    if (params.createdBy) searchParams.set('createdBy', params.createdBy);
    if (params.startDate) searchParams.set('startDate', params.startDate);
    if (params.endDate) searchParams.set('endDate', params.endDate);
    if (params.onlyUpcoming) searchParams.set('onlyUpcoming', 'true');
    if (params.onlyScraped) searchParams.set('onlyScraped', 'true');
    if (params.needsReview) searchParams.set('needsReview', 'true');
    if (params.search) searchParams.set('search', params.search); // [2025-01-XX] - Add search parameter
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

    const query = searchParams.toString();
    const endpoint = query ? `/api/events/all?${query}` : '/api/events/all';

    return this.request(endpoint, {
      method: 'GET',
    });
  }

  async superuserUpdateEvent(eventId: string, updates: any, reason?: string) {
    return this.request(`/api/events/all?id=${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...updates, reason }),
    });
  }

  async superuserDeleteEvent(eventId: string, reason?: string) {
    return this.request(`/api/events/all?id=${eventId}`, {
      method: 'DELETE',
      body: reason ? JSON.stringify({ reason }) : undefined,
    });
  }

  // [2025-12-02] - Activities endpoints
  async getActivities() {
    return this.request('/api/activities', {
      method: 'GET',
    });
  }

  async createActivity(activityData: any) {
    return this.request('/api/activities', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
  }

  // [2025-12-02] - Attractions endpoints
  async getAttractions() {
    return this.request('/api/attractions', {
      method: 'GET',
    });
  }

  async createAttraction(attractionData: any) {
    return this.request('/api/attractions', {
      method: 'POST',
      body: JSON.stringify(attractionData),
    });
  }

  // [2026-01-07] - Media Manager endpoints
  async uploadMedia(file: File, businessId?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (businessId) formData.append('business_id', businessId);

    // [2026-01-07] - For FormData uploads, we need to let the browser set Content-Type
    // but still include auth headers. We'll bypass the normal request() method.
    const token = localStorage.getItem('auth_token');
    const url = `${import.meta.env.VITE_API_BASE_URL || 'https://api.localplus.city'}/api/media`;

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      // Include workaround headers for /media endpoint
      headers['X-User-Token'] = token;
      headers['X-Supabase-Token'] = token;
      headers['X-Original-Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!response.ok) {
      let errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // Response not JSON
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getMedia(params: { limit?: number; offset?: number } = {}) {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.offset) searchParams.set('offset', String(params.offset));

    const query = searchParams.toString();
    const endpoint = query ? `/api/media?${query}` : '/api/media';

    return this.request(endpoint, {
      method: 'GET',
    });
  }

  async deleteMedia(mediaId: string) {
    return this.request(`/api/media/${mediaId}`, {
      method: 'DELETE',
    });
  }

  // [2026-01-21] - Event Attendance endpoints
  async getEventAttendance(eventId: string) {
    return this.request(`/api/events/${eventId}/attendance`, {
      method: 'GET',
    });
  }

  async submitRSVP(eventId: string, attendanceData: {
    guest_name: string;
    guest_email: string;
    seats_reserved?: number;
    payment_proof_url?: string;
    custom_responses?: Record<string, any>;
    metadata?: any;
  }) {
    return this.request(`/api/events/${eventId}/attendance`, {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  }

  async updateAttendanceStatus(eventId: string, attendanceId: string, updates: {
    status?: string;
    payment_status?: string;
    payment_proof_url?: string;
  }) {
    return this.request(`/api/events/${eventId}/attendance`, {
      method: 'PUT',
      body: JSON.stringify({ attendanceId, ...updates }),
    });
  }

  async cancelAttendance(eventId: string, attendanceId: string) {
    return this.request(`/api/events/${eventId}/attendance?attendanceId=${attendanceId}`, {
      method: 'DELETE',
    });
  }

  async getDMOStats() {
    // TODO: Implement when API endpoint is ready
    return this.request('/api/dmo/stats', {
      method: 'GET',
    });
  }
}

export const apiService = new ApiService();
