import { apiRequest } from '@/lib/api.server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Proxy to Answer Engine /query
    const data = await apiRequest('/query', {
      method: 'POST',
      body: JSON.stringify(body)
    })
    return NextResponse.json(data)
  } catch (e: any) {
    console.error('[PUBLIC_QUERY_ERROR]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
