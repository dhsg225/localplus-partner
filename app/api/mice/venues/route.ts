import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const orgId = req.nextUrl.searchParams.get('orgId')
  if (!orgId) return NextResponse.json({ error: 'Missing orgId' }, { status: 400 })

  const { data, error } = await supabase
    .from('mice_venues')
    .select('*')
    .eq('organization_id', orgId)
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const body = await req.json()
  
  const { data, error } = await supabase
    .from('mice_venues')
    .insert(body)
    .select()
    .single()
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
