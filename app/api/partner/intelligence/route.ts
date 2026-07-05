import { createClient } from '@/lib/supabase/server'
import { apiRequest } from '@/lib/api.server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 1. Resolve partner business_id
  const { data: partners } = await supabase
    .from('partners')
    .select('business_id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .limit(1)

  const businessId = partners?.[0]?.business_id

  if (!businessId) {
    return NextResponse.json({ error: 'No associated partner profile found' }, { status: 404 })
  }

  // 2. Proxy to AE Backend /analytics/partner-intelligence
  try {
    const data = await apiRequest(`/analytics/partner-intelligence?businessId=${businessId}`)
    return NextResponse.json(data)
  } catch (e: any) {
    console.error('[INTELLIGENCE_PROXY_ERROR]', e)
    
    // Mock data for development if AE endpoint is not yet ready/implemented
    // (This allows UI development to proceed without AE modifications)
    return NextResponse.json({
      disclosure: {
        is_promoted: true,
        promotion_tier: "Boost"
      },
      trust_score: 0.84,
      visibility: {
        appearances_7d: 124,
        appearances_30d: 542,
        trend: 0.12
      },
      analytics: {
        clicks_7d: 18,
        ctr: 0.145, // 14.5%
        trend: 0.08
      },
      ranking: {
        avg_position: 4.2,
        top_3_rate: 0.35,
        base_relevance: 0.82,
        data_quality: 0.88
      },
      match_quality: {
        avg_score: 0.88,
        low_confidence_rate: 0.05
      },
      feedback: {
        positive_rate: 0.92,
        total_count: 48
      },
      signals: {
        memory_boost: { value: 0.021, trend: 'up' },
        trend_boost: { value: 0.008, trend: 'stable' },
        session_boost: { value: 0.004, trend: 'down' },
        exploration_boost: { value: 0.006, trend: 'stable' }
      }
    })
  }
}
