import { createClient } from '@/lib/supabase/server'

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

  async createEvent(eventData: any) {
    return apiRequest('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    })
  },

  async getEvent(eventId: string) {
    return apiRequest(`/api/events/${eventId}`)
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
  }
}
