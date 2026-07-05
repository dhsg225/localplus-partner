import { apiRequest } from '@/lib/api.server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Proxy to Answer Engine /query/feedback
    const data = await apiRequest('/query/feedback', {
      method: 'POST',
      body: JSON.stringify({
        ...body,
        type: 'conversion',
        source: 'public_search_action'
      })
    })
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
