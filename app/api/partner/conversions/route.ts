import { createClient } from '@/lib/supabase/server'
import { apiRequest } from '@/lib/api.server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: partners } = await supabase
    .from('partners')
    .select('business_id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .limit(1)

  const businessId = partners?.[0]?.business_id
  if (!businessId) return NextResponse.json({ error: 'No partner profile' }, { status: 404 })

  try {
    const data = await apiRequest(`/analytics/partner-intelligence?businessId=${businessId}`)
    return NextResponse.json(data)
  } catch (e: any) {
    console.error('[CONVERSIONS_PROXY_ERROR]', e)

    // Mock data for development if AE endpoint is not yet ready/implemented
    return NextResponse.json({
      summary: {
        conversions_7d: 12,
        clicks_7d: 48,
        actions: {
          calls: 5,
          directions: 4,
          bookings: 3
        },
        conversion_rate: 0.25, // Clicks -> Conversions
        click_rate: 0.15      // Appearances -> Clicks
      },
      funnel: {
        appearances: 320,
        clicks: 48,
        conversions: 12
      }
    })
  }
}
