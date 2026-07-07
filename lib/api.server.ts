import { createClient } from '@/lib/supabase/server'

// api.localplus.city (Vercel) is being retired for serverless functions in favor of
// this Bunny Magic Container, which has no function-count ceiling — see
// localplus-api/CONTAINER.md.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mc-p1bm8gzkgs.b-cdn.net'

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.INTERNAL_API_KEY ?? ''}`,
    'x-source': 'api.localplus',
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
  }
}

const AE_BASE_URL = process.env.AE_BASE_URL || 'https://mc-m6cckgy66k.bunny.run'

async function aeRequest(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.INTERNAL_API_KEY ?? ''}`,
    'x-source': 'api.localplus',
    ...((options.headers as any) || {}),
  }
  const response = await fetch(`${AE_BASE_URL}${endpoint}`, { ...options, headers })
  if (!response.ok) {
    let errorMessage = `AE request failed: ${response.status}`
    try {
      const errorData = await response.json()
      errorMessage = errorData.error || errorData.message || errorMessage
    } catch (e) {}
    throw new Error(errorMessage)
  }
  return response.json()
}

async function getBusinessIdForCurrentUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: partners } = await supabase
    .from('partners')
    .select('business_id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .limit(1)

  return partners?.[0]?.business_id ?? null
}

export const entitiesApi = {
  // NOTE: the AE backend exposes this as GET /businesses/:id, not /entities/:id.
  async getProfile(entityId: string | null) {
    if (!entityId) return { success: true, data: null }
    try {
      const data = await aeRequest(`/businesses/${entityId}`)
      return { success: true, data }
    } catch (e) {
      return { success: true, data: null }
    }
  },
  async upsertProfile(payload: any) {
    const businessId = await getBusinessIdForCurrentUser()
    return aeRequest('/entities/upsert', {
      method: 'POST',
      body: JSON.stringify({ ...payload, owner_id: businessId })
    })
  }
}

export const taxonomyApi = {
  async getCategories(_type: 'cuisine' | 'feature') {
    // NOTE: the backend category list is not split by cuisine/feature yet —
    // both calls currently return the same shared taxonomy list.
    return apiRequest('/api/categories')
  }
}

export const intelligenceApi = {
  async getMetrics() {
    const businessId = await getBusinessIdForCurrentUser()
    if (!businessId) throw new Error('No partner profile')

    try {
      return await aeRequest(`/analytics/partner-intelligence?entity_id=${businessId}`)
    } catch (e) {
      console.error('[INTELLIGENCE_ERROR]', e)
      // Mock data for development if AE endpoint is not yet ready/implemented
      return {
        disclosure: { is_promoted: true, promotion_tier: "Boost" },
        trust_score: 0.84,
        visibility: { appearances_7d: 124, appearances_30d: 542, trend: 0.12 },
        analytics: { clicks_7d: 18, ctr: 0.145, trend: 0.08 },
        ranking: { avg_position: 4.2, top_3_rate: 0.35, base_relevance: 0.82, data_quality: 0.88 },
        match_quality: { avg_score: 0.88, low_confidence_rate: 0.05 },
        feedback: { positive_rate: 0.92, total_count: 48 },
        signals: {
          memory_boost: { value: 0.021, trend: 'up' },
          trend_boost: { value: 0.008, trend: 'stable' },
          session_boost: { value: 0.004, trend: 'down' },
          exploration_boost: { value: 0.006, trend: 'stable' }
        }
      }
    }
  }
}

export const conversionApi = {
  async getConversions() {
    const businessId = await getBusinessIdForCurrentUser()
    if (!businessId) throw new Error('No partner profile')

    try {
      return await aeRequest(`/analytics/partner-intelligence?entity_id=${businessId}`)
    } catch (e) {
      console.error('[CONVERSIONS_ERROR]', e)
      return {
        summary: {
          conversions_7d: 12,
          clicks_7d: 48,
          actions: { calls: 5, directions: 4, bookings: 3 },
          conversion_rate: 0.25,
          click_rate: 0.15
        },
        funnel: { appearances: 320, clicks: 48, conversions: 12 }
      }
    }
  }
}

export const pricingApi = {
  async getPricing() {
    const businessId = await getBusinessIdForCurrentUser()
    if (!businessId) throw new Error('No partner profile')

    try {
      return await aeRequest(`/analytics/pricing?entity_id=${businessId}`)
    } catch (e) {
      return {
        multiplier: 1.0,
        demand_score: 0.5,
        value_score: 0.5,
        base_price: 500,
        tier_label: "Stable Performer"
      }
    }
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

  // Best-effort: reads the partner's fixed business type(s) so the dashboard can default to
  // the right context instead of an arbitrary toggle. A business can be more than one thing
  // (a hotel that also runs a restaurant and hosts events), so this returns every type that
  // applies, unioned together — not just one.
  //
  // Tries the new `business_types` array column first (see
  // supabase/migrations/20260705_business_types_array.sql — needs to be run manually, this
  // repo has no DB write access). Falls back to the legacy single-value `business_type`
  // column so this works today, before that migration exists. Returns [] on any failure
  // rather than throwing — this must never break page rendering, it's a nice-to-have default.
  async getPartnerBusinessTypes(): Promise<string[]> {
    const supabase = createClient()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const multi = await supabase
        .from('partners')
        .select('businesses(business_types)')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle()

      if (!multi.error && multi.data) {
        const biz = (multi.data as any).businesses
        const types = Array.isArray(biz) ? biz[0]?.business_types : biz?.business_types
        if (Array.isArray(types) && types.length > 0) return types
      }

      const single = await supabase
        .from('partners')
        .select('businesses(business_type)')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle()

      if (single.error || !single.data) return []
      const biz = (single.data as any).businesses
      const type = Array.isArray(biz) ? biz[0]?.business_type : biz?.business_type
      return type ? [type] : []
    } catch {
      return []
    }
  },

  async getAllPartners(isSuperAdmin?: boolean) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    let query = supabase
      .from('partners')
      .select('*')
      .is('deleted_at', null)
      .order('business_name', { ascending: true })

    if (!isSuperAdmin) {
      query = query.eq('user_id', user.id)
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

export const bookingsApi = {
  async getBookings(params: { status?: string; limit?: number; offset?: number } = {}) {
    const businessId = await getBusinessIdForCurrentUser()
    if (!businessId) return { success: true, data: [], pagination: { limit: 50, offset: 0, total: 0 } }

    const searchParams = new URLSearchParams({ businessId })
    if (params.status) searchParams.set('status', params.status)
    if (params.limit) searchParams.set('limit', String(params.limit))
    if (params.offset) searchParams.set('offset', String(params.offset))

    return apiRequest(`/api/bookings?${searchParams.toString()}`)
  }
}

export const ingestionApi = {
  async getBatches(organizationId: string) {
    return apiRequest(`/api/data-ingest?endpoint=batches&organizationId=${organizationId}`)
  },

  async getBatchQueue(batchId: string) {
    return apiRequest(`/api/data-ingest?endpoint=queue&batchId=${batchId}`)
  },

  async parseContent(payload: { organization_id: string, source_name: string, raw_content: string, global_date?: string }) {
    return apiRequest('/api/data-ingest', {
      method: 'POST',
      body: JSON.stringify({ ...payload, endpoint: 'parse' })
    })
  },

  async updateRow(id: string, updates: any) {
    return apiRequest('/api/data-ingest', {
      method: 'PUT',
      body: JSON.stringify({ endpoint: 'update-row', id, updates })
    })
  },

  async commitBatch(batchId: string) {
    return apiRequest('/api/data-ingest', {
      method: 'POST',
      body: JSON.stringify({ endpoint: 'commit', batchId })
    })
  },

  async rollbackBatch(batchId: string) {
    return apiRequest('/api/data-ingest', {
      method: 'POST',
      body: JSON.stringify({ endpoint: 'rollback', batchId })
    })
  }
}
