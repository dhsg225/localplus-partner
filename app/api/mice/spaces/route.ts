import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const venueId = req.nextUrl.searchParams.get('venueId')
  if (!venueId) return NextResponse.json({ error: 'Missing venueId' }, { status: 400 })

  const { data, error } = await supabase
    .from('mice_venue_spaces')
    .select('*')
    .eq('venue_id', venueId)
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const body = await req.json()
  
  const { data, error } = await supabase
    .from('mice_venue_spaces')
    .insert(body)
    .select()
    .single()
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
