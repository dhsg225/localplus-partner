import { NextRequest, NextResponse } from 'next/server'

const AE_BASE = process.env.AE_BASE_URL || 'https://mc-m6cckgy66k.bunny.run'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${AE_BASE}/businesses/${params.id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.INTERNAL_API_KEY ?? ''}`,
      'x-source': 'api.localplus',
    },
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
