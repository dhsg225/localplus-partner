import { NextRequest, NextResponse } from 'next/server'
import { apiRequest } from '@/lib/api.server'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const query = searchParams.toString()
  try {
    const data = await apiRequest(`/api/data-ingest${query ? `?${query}` : ''}`)
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = await apiRequest('/api/data-ingest', {
      method: 'POST',
      body: JSON.stringify(body)
    })
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const data = await apiRequest('/api/data-ingest', {
      method: 'PUT',
      body: JSON.stringify(body)
    })
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
