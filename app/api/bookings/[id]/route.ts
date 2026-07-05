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

// The backend trusts the caller for GET/PUT-by-id (no ownership check of its own),
// so this proxy verifies the booking actually belongs to the caller's business
// before returning or mutating it.
async function loadOwnedBooking(id: string, businessId: string) {
  const res = await apiRequest(`/api/bookings/${id}`)
  if (!res?.data || res.data.business_id !== businessId) return null
  return res.data
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const businessId = await getBusinessIdForRequest()
  if (!businessId) return NextResponse.json({ error: 'No partner profile' }, { status: 404 })

  try {
    const booking = await loadOwnedBooking(params.id, businessId)
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: booking })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

// Generic status update — used for actions the backend has no dedicated endpoint for
// (seat / complete / no_show). Confirm and cancel have their own routes.
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const businessId = await getBusinessIdForRequest()
  if (!businessId) return NextResponse.json({ error: 'No partner profile' }, { status: 404 })

  const body = await req.json()

  try {
    const existing = await loadOwnedBooking(params.id, businessId)
    if (!existing) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

    const data = await apiRequest(`/api/bookings/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    })
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
