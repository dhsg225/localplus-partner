import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const AE_BASE = process.env.AE_BASE_URL || 'https://mc-m6cckgy66k.bunny.run'

export async function POST(req: NextRequest) {
  // 1. Verify session
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 2. Resolve owner_id from token — never trust client input
  const { data: partners } = await supabase
    .from('partners')
    .select('business_id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .limit(1)

  const ownerId = partners?.[0]?.business_id ?? null

  // 3. Parse and forward to AE backend with gateway headers
  const body = await req.json()
  const payload = { ...body, owner_id: ownerId }

  const res = await fetch(`${AE_BASE}/entities/upsert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.INTERNAL_API_KEY ?? ''}`,
      'x-source': 'api.localplus',
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
