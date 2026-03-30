import { createClient } from './supabase/client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.localplus.city'

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const url = `${API_BASE_URL}${endpoint}`
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...((options.headers as any) || {}),
  }

  // Workaround headers for special endpoints (as seen in legacy ApiService)
  const isSpecialEndpoint = endpoint.includes('/events/all') || endpoint.includes('/media')
  if (token && isSpecialEndpoint) {
    headers['X-User-Token'] = token
    headers['X-Supabase-Token'] = token
    headers['X-Original-Authorization'] = `Bearer ${token}`
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

export const aiApi = {
  async getDiscovery(organizationId: string) {
    return apiRequest(`/api/ai/discovery?organizationId=${organizationId}`)
  }
}

export const organizationApi = {
  async getPartnerBusiness() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: partners } = await supabase
      .from('partners')
      .select('business_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(1)

    return partners?.[0]?.business_id || null
  },

  async getAllPartners(isSuperAdmin?: boolean) {
    const supabase = createClient()
    
    let query = supabase
      .from('partners')
      .select('*')
      .is('deleted_at', null)
      .order('business_name', { ascending: true })

    if (isSuperAdmin === false) {
       const { data: { user } } = await supabase.auth.getUser()
       if (user) {
          query = query.eq('user_id', user.id)
       }
    }

    const { data: partners, error } = await query
    if (error) return []
    return partners
  },

  async checkPermissions() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { isSuperAdmin: false }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['super_admin', 'events_superuser'])
      .eq('is_active', true)

    return {
      isSuperAdmin: (roles?.length || 0) > 0
    }
  },

  async getStaff(organizationId: string) {
    return apiRequest(`/api/staff?organizationId=${organizationId}`)
  },

  async getVenues(organizationId: string) {
    return apiRequest(`/api/venues?organizationId=${organizationId}`)
  }
}
