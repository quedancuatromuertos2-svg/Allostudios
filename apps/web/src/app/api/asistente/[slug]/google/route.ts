import { NextRequest, NextResponse } from 'next/server'
import { cargarAsistente } from '@/lib/asistente/motor'

/*  Enlace que se le manda al dueño del negocio para conectar su Google Calendar al asistente:
    https://allostudios.net/api/asistente/<slug>/google?clave=<clave_admin>
    Reutiliza el callback ya registrado en Google Cloud (/api/google/callback) con estado {asistente, clave}. */
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const a = await cargarAsistente(params.slug)
  const clave = req.nextUrl.searchParams.get('clave') || ''
  if (!a || a.clave_admin !== clave) return new NextResponse('Enlace no válido', { status: 403 })
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://allostudios.net').replace(/^﻿/, '').trim().replace(/\/$/, '')
  const u = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  u.searchParams.set('client_id', (process.env.GOOGLE_CLIENT_ID || '').replace(/^﻿/, '').trim())
  u.searchParams.set('redirect_uri', `${appUrl}/api/google/callback`)
  u.searchParams.set('response_type', 'code')
  // events para crear la cita + readonly para ver los huecos (freeBusy)
  u.searchParams.set('scope', 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly')
  u.searchParams.set('access_type', 'offline')
  u.searchParams.set('prompt', 'consent')
  u.searchParams.set('state', Buffer.from(JSON.stringify({ asistente: a.slug, clave })).toString('base64url'))
  return NextResponse.redirect(u.toString())
}
