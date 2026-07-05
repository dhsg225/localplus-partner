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
    const data = await apiRequest(`/analytics/pricing?entity_id=${businessId}`)
    return NextResponse.json(data)
  } catch (e: any) {
    // Fallback to base pricing if engine logic fails
    return NextResponse.json({
      multiplier: 1.0,
      demand_score: 0.5,
      value_score: 0.5,
      base_price: 500,
      tier_label: "Stable Performer"
    })
  }
}
