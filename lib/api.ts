// [2024-04-13] - API gatekeeper enforcement: removed direct Supabase client.
// All requests now route through local /api proxy which injects tokens.

const API_BASE_URL = ''

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as any) || {}),
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorMessage = `API request failed: ${response.status}`
    try {
      const errorData = await response.json()
      errorMessage = errorData.error || errorData.message || errorMessage
    } catch (e) {}
    throw new Error(errorMessage)
  }

  return response.json()
}

export const eventsApi = {
  async getEvents(params: {
    businessId?: string
    status?: string
    eventType?: string
    search?: string
    sortBy?: string
    sortOrder?: string
    limit?: number
    offset?: number
  } = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.set(key, String(value))
    })
    
    const query = searchParams.toString()
    return apiRequest(`/api/events${query ? `?${query}` : ''}`)
  },

  async getInstances(params: {
    organizationId?: string
    eventId?: string
    status?: string
    startDate?: string
    endDate?: string
    limit?: number
    offset?: number
  } = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.set(key, String(value))
    })
    
    const query = searchParams.toString()
    return apiRequest(`/api/event-instances${query ? `?${query}` : ''}`)
  },

  async createEvent(payload: { event: any, recurrence?: any, rsvp?: any }) {
    return apiRequest('/api/events', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async updateEvent(payload: { id: string, event: any, recurrence?: any }) {
    return apiRequest('/api/events', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  async deleteEvent(eventId: string) {
    return apiRequest(`/api/events?id=${eventId}`, {
      method: 'DELETE'
    })
  },

  async createInstance(payload: { eventId: string, start_time: string, end_time: string, max_capacity?: number }) {
    return apiRequest('/api/event-instances', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async updateInstance(payload: { id: string, status?: string, max_capacity?: number }) {
    return apiRequest('/api/event-instances', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  async getRegistrations(instanceId: string) {
    return apiRequest(`/api/registrations?instanceId=${instanceId}`)
  },

  async updateRegistration(registrationId: string, status: string) {
    return apiRequest('/api/registrations', {
      method: 'PUT',
      body: JSON.stringify({ participantId: registrationId, status })
    })
  },

  async getEvent(eventId: string) {
    return apiRequest(`/api/events/${eventId}`)
  },
  
  async createOrganizer(payload: { name: string, description?: string, contact?: string, address?: string }) {
    return apiRequest('/api/organizers', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  },

  async createLocation(payload: { name: string, address?: string, latitude?: number, longitude?: number, business_id: string }) {
    return apiRequest('/api/locations', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }
}

export const entitiesApi = {
  async getProfile(entityId: string | null) {
    if (!entityId) return { success: true, data: null }
    return apiRequest(`/api/entities/${entityId}`)
  },
  async upsertProfile(payload: any) {
    return apiRequest('/api/entities/upsert', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }
}

export const taxonomyApi = {
  async getCategories(type: 'cuisine' | 'feature') {
    return apiRequest(`/api/categories?type=${type}`)
  }
}

export const intelligenceApi = {
  async getMetrics() {
    return apiRequest('/api/partner/intelligence')
  }
}

export const searchApi = {
  async query(prompt: string, sessionId: string) {
    return apiRequest('/api/public/query', {
      method: 'POST',
      body: JSON.stringify({ prompt, session_id: sessionId })
    })
  },
  async trackClick(entityId: string, sessionId: string) {
    return apiRequest('/api/public/click', {
      method: 'POST',
      body: JSON.stringify({ entity_id: entityId, session_id: sessionId })
    })
  },
  async trackAction(entityId: string, sessionId: string, actionType: string) {
    return apiRequest('/api/public/conversion', {
      method: 'POST',
      body: JSON.stringify({ entity_id: entityId, session_id: sessionId, action: actionType })
    })
  }
}

export const conversionApi = {
  async getConversions() {
    return apiRequest('/api/partner/conversions')
  }
}

export const pricingApi = {
  async getPricing() {
    return apiRequest('/api/partner/pricing')
  }
}

export const aiApi = {
  async getDiscovery(organizationId: string) {
    return apiRequest(`/api/ai/discovery?organizationId=${organizationId}`)
  }
}

export const organizationApi = {
  async getPartnerBusiness() {
    try {
      const res = await apiRequest('/api/partners/me')
      return res.business_id
    } catch (e) {
      return null
    }
  },

  async getAllPartners(isSuperAdmin?: boolean) {
    return apiRequest(`/api/partners?isSuperAdmin=${isSuperAdmin}`)
  },

  async checkPermissions() {
    try {
      const res = await apiRequest('/api/roles/me')
      return { isSuperAdmin: res.isSuperAdmin }
    } catch (e) {
      return { isSuperAdmin: false }
    }
  },

  async getStaff(organizationId: string) {
    return apiRequest(`/api/staff?organizationId=${organizationId}`)
  },

  async getVenues(organizationId: string) {
    return apiRequest(`/api/venues?organizationId=${organizationId}`)
  }
}

export const bookingsApi = {
  async getBookings(params: { status?: string; limit?: number; offset?: number; search?: string } = {}) {
    const searchParams = new URLSearchParams()
    if (params.status) searchParams.set('status', params.status)
    if (params.limit) searchParams.set('limit', String(params.limit))
    if (params.offset) searchParams.set('offset', String(params.offset))
    if (params.search) searchParams.set('search', params.search)
    const query = searchParams.toString()
    return apiRequest(`/api/bookings${query ? `?${query}` : ''}`)
  },

  async createBooking(payload: {
    customer_name: string
    customer_email: string
    customer_phone: string
    party_size: number
    booking_date: string
    booking_time: string
    special_requests?: string
  }) {
    return apiRequest('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  },

  async confirmBooking(id: string) {
    return apiRequest(`/api/bookings/${id}/confirm`, { method: 'PUT' })
  },

  async cancelBooking(id: string, reason?: string) {
    return apiRequest(`/api/bookings/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    })
  },

  async seatBooking(id: string) {
    return apiRequest(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'seated', seated_at: new Date().toISOString() })
    })
  },

  async completeBooking(id: string) {
    return apiRequest(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'completed', completed_at: new Date().toISOString() })
    })
  },

  async markNoShow(id: string) {
    return apiRequest(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'no_show' })
    })
  },

  async updateBooking(id: string, payload: Partial<{
    customer_name: string
    customer_email: string
    customer_phone: string
    party_size: number
    booking_date: string
    booking_time: string
    special_requests: string
  }>) {
    return apiRequest(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    })
  }
}

export const restaurantSettingsApi = {
  async getSettings() {
    return apiRequest('/api/restaurant-settings')
  },

  async updateSettings(payload: Partial<{
    booking_enabled: boolean
    min_party_size: number
    max_party_size: number
    advance_booking_days: number
  }>) {
    return apiRequest('/api/restaurant-settings', {
      method: 'PUT',
      body: JSON.stringify(payload)
    })
  }
}
