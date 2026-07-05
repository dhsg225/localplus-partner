import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const isSuperAdmin = req.nextUrl.searchParams.get('isSuperAdmin') === 'true'

  let query = supabase
    .from('partners')
    .select('*')
    .is('deleted_at', null)
    .order('business_name', { ascending: true })

  if (!isSuperAdmin) {
    query = query.eq('user_id', user.id)
  }

  const { data: partners, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(partners ?? [])
}
