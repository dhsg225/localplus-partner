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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const businessId = await getBusinessIdForRequest()
  if (!businessId) return NextResponse.json({ error: 'No partner profile' }, { status: 404 })

  const body = await req.json().catch(() => ({}))

  try {
    const existing = await apiRequest(`/api/bookings/${params.id}`)
    if (!existing?.data || existing.data.business_id !== businessId) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const data = await apiRequest(`/api/bookings/${params.id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason: body.reason })
    })
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
