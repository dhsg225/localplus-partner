import { apiRequest } from '@/lib/api.server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Proxy to Answer Engine /query/feedback as a "click" action
    const data = await apiRequest('/query/feedback', {
      method: 'POST',
      body: JSON.stringify({
        ...body,
        type: 'click',
        source: 'public_search'
      })
    })
    return NextResponse.json(data)
  } catch (e: any) {
    console.error('[PUBLIC_CLICK_ERROR]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
