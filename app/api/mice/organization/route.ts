import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Same logic as miceService.getMyOrganization
  let orgId = user.app_metadata?.org_id
  if (!orgId) {
    const { data: partner } = await supabase
      .from('partners')
      .select('business_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(1)
      .single()
    if (partner) orgId = partner.business_id
  }

  if (!orgId) return NextResponse.json({ data: null })

  const { data, error } = await supabase
    .from('core_organizations')
    .select('*')
    .eq('id', orgId)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Create unique name
    const orgName = `Dev Org - ${user.email?.split('@')[0]}`
    
    // 1. Create Business
    const { data: org, error: orgError } = await supabase
      .from('core_organizations')
      .insert({
        name: orgName,
        industry: 'MICE',
        legacy_id: 'AUTO_INIT'
      })
      .select()
      .single()
    
    if (orgError) return NextResponse.json({ error: orgError.message }, { status: 500 })

    // 2. Link User in Partners table
    const { error: partnerError } = await supabase
      .from('partners')
      .insert({
        user_id: user.id,
        business_id: org.id,
        role: 'owner',
        is_active: true
      })

    if (partnerError) return NextResponse.json({ error: partnerError.message }, { status: 500 })

    return NextResponse.json({ data: org })
}

export async function PUT(req: NextRequest) {
    const supabase = createClient()
    const body = await req.json()
    const { id, ...updates } = body

    const { data, error } = await supabase
      .from('core_organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
}
