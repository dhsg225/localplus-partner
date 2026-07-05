import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: partners } = await supabase
    .from('partners')
    .select('business_id, business_name, is_active')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .limit(1)

  return NextResponse.json({
    business_id:   partners?.[0]?.business_id   ?? null,
    business_name: partners?.[0]?.business_name ?? null,
  })
}
