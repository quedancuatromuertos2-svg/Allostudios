import { NextRequest, NextResponse } from 'next/server'
import { cargarAsistente, responder, type Asistente } from '@/lib/asistente/motor'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/*  Mensajes directos de Instagram con el mismo motor que WhatsApp:
      https://allostudios.net/api/instagram/<slug>
    Atiende tres cosas, que es lo que permite la API oficial de Meta:
      · DM normal (dentro de las 24 h desde el último mensaje del usuario)
      · Respuesta a una historia (llega como un DM con `reply_to.story`)
      · «Comenta X y te escribo»: el comentario llega por el campo `comments` y se contesta por DM
    Lo que NO se hace (y por lo que se banean cuentas): mensajes masivos en frío a gente que no
    ha escrito. Aquí solo se responde a quien escribe primero.                                   */

type Mensaje = { sender?: { id: string }; recipient?: { id: string }; timestamp?: number; message?: { mid?: string; text?: string; is_echo?: boolean; is_deleted?: boolean; attachments?: unknown[]; reply_to?: { story?: { id: string } } } }
type Comentario = { id?: string; from?: { id: string; username?: string }; text?: string }

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const a = await cargarAsistente(params.slug)
  if (!a) return NextResponse.json({ error: 'No existe' }, { status: 404 })
  const sp = req.nextUrl.searchParams
  if (sp.get('hub.mode') === 'subscribe' && sp.get('hub.verify_token') === a.verify_token) {
    return new NextResponse(sp.get('hub.challenge') || '', { status: 200 })
  }
  return NextResponse.json({ asistente: a.slug, canal: 'instagram', activo: a.activo })
}

async function enviarDM(a: Asistente, destino: string, texto: string) {
  const id = a.ig_user_id, token = a.ig_token || a.meta_token
  if (!id || !token) { console.error('instagram: faltan credenciales en el asistente', a.slug); return }
  const r = await fetch(`https://graph.instagram.com/v21.0/${id}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipient: { id: destino }, message: { text: texto } }),
  })
  if (!r.ok) console.error('instagram send', r.status, (await r.text()).slice(0, 300))
}

/* Respuesta pública a un comentario (corta) antes de pasar a privado */
async function responderComentario(a: Asistente, comentarioId: string, texto: string) {
  const token = a.ig_token || a.meta_token
  if (!token) return
  fetch(`https://graph.instagram.com/v21.0/${comentarioId}/replies`, {
    method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: texto }),
  }).catch(() => {})
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const a = await cargarAsistente(params.slug)
  if (!a) return NextResponse.json({ error: 'No existe' }, { status: 404 })

  let body: { entry?: { id?: string; messaging?: Mensaje[]; changes?: { field?: string; value?: Comentario }[] }[] }
  try { body = await req.json() } catch { return NextResponse.json({ ok: true }) }

  const dms = body.entry?.flatMap((e) => e.messaging || []) || []
  const comentarios = (body.entry?.flatMap((e) => e.changes || []) || []).filter((c) => c.field === 'comments')

  await Promise.all([
    ...dms.map(async (m) => {
      // is_echo: lo que manda la propia cuenta. Si no se filtra, el bot se contesta a sí mismo.
      if (m.message?.is_echo || m.message?.is_deleted || !m.sender?.id) return
      const texto = m.message?.text?.trim()
      const esHistoria = !!m.message?.reply_to?.story
      const contenido = texto
        ? (esHistoria ? `[responde a una historia] ${texto}` : texto)
        : m.message?.attachments?.length ? '[el cliente ha enviado un archivo o audio que no puedo leer]' : ''
      if (!contenido) return
      const r = await responder(a, `ig:${m.sender.id}`, contenido, m.message?.mid)
      if (r) await enviarDM(a, m.sender.id, r)
    }),
    ...comentarios.map(async (c) => {
      const v = c.value
      if (!v?.from?.id || !v.text) return
      // Al comentario se contesta en público con una línea y la conversación sigue por privado
      if (v.id) responderComentario(a, v.id, 'Te escribo por privado 👌')
      const r = await responder(a, `ig:${v.from.id}`, `[comentario en una publicación] ${v.text}`, v.id)
      if (r) await enviarDM(a, v.from.id, r)
    }),
  ])

  return NextResponse.json({ ok: true })
}
