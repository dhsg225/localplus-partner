import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .in('role', ['super_admin', 'events_superuser'])
    .eq('is_active', true)

  return NextResponse.json({
    isSuperAdmin: (roles?.length ?? 0) > 0,
    roles: roles?.map(r => r.role) ?? [],
  })
}
