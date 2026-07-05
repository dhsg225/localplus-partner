import { NextRequest, NextResponse } from 'next/server'
import { apiRequest } from '@/lib/api.server'

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('search')
  try {
    const data = await apiRequest(`/api/categories${search ? `?search=${encodeURIComponent(search)}` : ''}`)
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
