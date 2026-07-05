import { createClient } from '@/lib/supabase/server'
import { apiRequest } from '@/lib/api.server'
import { NextRequest, NextResponse } from 'next/server'

async function getBusinessIdForRequest() {
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

export async function GET(req: NextRequest) {
  const businessId = await getBusinessIdForRequest()
  if (!businessId) return NextResponse.json({ error: 'No partner profile' }, { status: 404 })

  const searchParams = new URLSearchParams({ businessId })
  const status = req.nextUrl.searchParams.get('status')
  const limit = req.nextUrl.searchParams.get('limit')
  const offset = req.nextUrl.searchParams.get('offset')
  if (status) searchParams.set('status', status)
  if (limit) searchParams.set('limit', limit)
  if (offset) searchParams.set('offset', offset)

  try {
    const data = await apiRequest(`/api/bookings?${searchParams.toString()}`)
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const businessId = await getBusinessIdForRequest()
  if (!businessId) return NextResponse.json({ error: 'No partner profile' }, { status: 404 })

  const body = await req.json()

  try {
    // business_id always comes from the authenticated caller's own partner record,
    // never from the client — the backend trusts whatever business_id it's given.
    const data = await apiRequest('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ ...body, business_id: businessId, source: 'partner_dashboard' })
    })
    return NextResponse.json(data, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
