import { NextRequest, NextResponse } from 'next/server'
import { cargarAsistente, responder } from '@/lib/asistente/motor'

export const runtime = 'nodejs'

/*  Chat de la web (widget «Pregunta a allo»): mismo motor que WhatsApp, pero la conversación se
    identifica por una sesión anónima del navegador (web:<id>) en vez de por un teléfono.
    POST { sesion, texto } → { respuesta }                                                        */

const ultimo = new Map<string, number[]>() // limitador simple por sesión: 20 mensajes / 10 min

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const a = await cargarAsistente(params.slug)
  if (!a || !a.activo) return NextResponse.json({ respuesta: 'Ahora mismo no estoy disponible. Escríbenos por WhatsApp y te contestamos hoy.' })
  const d = await req.json().catch(() => ({}))
  const sesion = String(d?.sesion || '').replace(/[^a-z0-9-]/gi, '').slice(0, 48)
  const texto = String(d?.texto || '').trim().slice(0, 600)
  if (!sesion || !texto) return NextResponse.json({ error: 'Falta el mensaje' }, { status: 400 })
  const ahora = Date.now(), v = (ultimo.get(sesion) || []).filter((t) => ahora - t < 600000)
  if (v.length >= 20) return NextResponse.json({ respuesta: 'Vamos a seguir por WhatsApp, que aquí me quedo corto 🙂' })
  ultimo.set(sesion, [...v, ahora])
  const r = await responder(a, `web:${sesion}`, texto)
  return NextResponse.json({ respuesta: r || '' })
}
