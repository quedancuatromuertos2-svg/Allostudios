import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Proxy de fotos de Google Places: sirve la imagen del negocio SIN exponer la API key
// en el HTML de la demo. Recibe el "name" del recurso foto (places/.../photos/...).
export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name') || ''
  const key = process.env.GOOGLE_PLACES_KEY || ''
  if (!key || !name.startsWith('places/') || name.includes('..')) {
    return new NextResponse('not found', { status: 404 })
  }
  const url = `https://places.googleapis.com/v1/${name}/media?maxHeightPx=1000&maxWidthPx=1600&key=${key}`
  try {
    const r = await fetch(url, { cache: 'no-store' })
    if (!r.ok) return new NextResponse('not found', { status: 404 })
    const buf = await r.arrayBuffer()
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': r.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    })
  } catch {
    return new NextResponse('error', { status: 500 })
  }
}
