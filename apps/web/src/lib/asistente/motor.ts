/*  El motor del asistente de WhatsApp: el mismo para el negocio de un cliente (Pack Pro/Max) y para
    AlloStudios (setter/closer). Recibe un mensaje, carga la conversación, mira la agenda, pregunta al
    modelo y ejecuta lo que el modelo decida: reservar una cita o avisar al dueño.

    Contrato con el modelo (sin function calling, para que valga con Anthropic y con OpenAI):
      - Responde en texto normal, como un WhatsApp.
      - Si cierra una cita, añade al final una línea: @@CITA {"inicio":"2026-09-22T17:30","nombre":"Marcos","servicio":"corte + barba"}
      - Si hay que pasar a una persona, añade: @@AVISO {"motivo":"presupuesto raro","resumen":"…"}
    Esas líneas se quitan antes de enviar la respuesta.                                           */

import { supabaseAdmin } from '@/lib/supabase'
import { sendAvisoAsistente } from '@/lib/email'
import { ahoraMadrid, etiqueta, fechaMadrid, huecos, reservar, type Horario } from './calendario'

export type Asistente = {
  id: string; slug: string; nombre: string; activo: boolean; canal: 'meta' | 'twilio'
  meta_phone_number_id: string | null; meta_token: string | null; verify_token: string; clave_admin: string
  ig_user_id: string | null; ig_token: string | null   // Instagram: id de la cuenta profesional y su token
  conocimiento: string; tono: string | null; reglas: string | null
  citas: boolean; duracion_min: number; horario: Horario; google_tokens: { access_token: string; refresh_token?: string; expiry_date?: number } | null
  aviso_email: string | null; aviso_whatsapp: string | null
}

const MAX_HISTORIA = 14

export async function cargarAsistente(slug: string): Promise<Asistente | null> {
  const { data } = await supabaseAdmin.from('asistentes').select('*').eq('slug', slug).single()
  return (data as Asistente) || null
}

function sistema(a: Asistente, agenda: string) {
  return `Eres el asistente de WhatsApp de «${a.nombre}». Atiendes a clientes como lo haría la persona del mostrador: ${a.tono || 'cercano y directo, tuteando, frases cortas'}.
Hoy es ${ahoraMadrid()} (hora de España).

LO QUE SABES DEL NEGOCIO (solo esto; si algo no está aquí, no lo inventes):
${a.conocimiento}

${a.reglas ? `REGLAS DEL NEGOCIO:\n${a.reglas}\n` : ''}
CÓMO RESPONDES:
- Como un WhatsApp: 1-3 frases, sin listas largas, sin markdown, sin firmar.
- Una pregunta cada vez. Si preguntan precio, dilo tal cual está arriba.
- Si piden algo que no está en lo que sabes, o se quejan, o quieren hablar con una persona, o es un presupuesto a medida: di que se lo pasas al responsable y que le escribe hoy mismo. Y añade al final la línea @@AVISO {"motivo":"…","resumen":"…"} (resumen de 1-2 frases con lo que pide y su nombre si lo ha dicho).
${a.citas ? `
CITAS (duración ${a.duracion_min} min). Huecos libres ahora mismo:
${agenda}
- Ofrece como mucho 2-3 huecos concretos que encajen con lo que pide. No ofrezcas horas que no estén en la lista.
- Antes de cerrar necesitas: día y hora (de la lista), nombre y qué servicio. Cuando el cliente confirme, responde confirmando (día, hora, servicio, dirección si la sabes) y añade al final la línea @@CITA {"inicio":"AAAA-MM-DDTHH:MM","nombre":"…","servicio":"…"}.
- Si quiere cambiar o anular una cita, no lo hagas tú: avisa con @@AVISO motivo "cambio de cita".` : ''}
- Responde siempre en el idioma en el que te escriben (normalmente español).`
}

type Msg = { role: 'user' | 'assistant'; content: string }

async function preguntarModelo(system: string, historia: Msg[]): Promise<string> {
  const anthropic = process.env.ANTHROPIC_API_KEY
  const openai = process.env.OPENAI_API_KEY
  if (anthropic) {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': anthropic, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: process.env.ASISTENTE_MODELO || 'claude-sonnet-5', max_tokens: 400, system, messages: historia }),
    })
    if (!r.ok) throw new Error('anthropic ' + r.status + ' ' + (await r.text()).slice(0, 200))
    const j = await r.json()
    return (j.content || []).map((c: { text?: string }) => c.text || '').join('').trim()
  }
  if (openai) {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openai}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', max_tokens: 400, temperature: 0.6, messages: [{ role: 'system', content: system }, ...historia] }),
    })
    if (!r.ok) throw new Error('openai ' + r.status)
    const j = await r.json()
    return (j.choices?.[0]?.message?.content || '').trim()
  }
  throw new Error('Sin clave de modelo (ANTHROPIC_API_KEY u OPENAI_API_KEY)')
}

/* Separa el texto para el cliente de las órdenes @@CITA / @@AVISO */
function separar(salida: string) {
  let texto = salida, cita: Record<string, string> | null = null, aviso: Record<string, string> | null = null
  const re = /@@(CITA|AVISO)\s*(\{[\s\S]*?\})/g
  let m: RegExpExecArray | null
  while ((m = re.exec(salida))) {
    try { const j = JSON.parse(m[2]); if (m[1] === 'CITA') cita = j; else aviso = j } catch { /* línea mal formada: se ignora */ }
  }
  texto = texto.replace(re, '').replace(/\n{3,}/g, '\n\n').trim()
  return { texto, cita, aviso }
}

async function avisarDueno(a: Asistente, telefono: string, motivo: string, resumen: string) {
  await supabaseAdmin.from('asistente_avisos').insert({ asistente_id: a.id, telefono, motivo, resumen }).then(() => {}, () => {})
  const texto = `${a.nombre} · el asistente te pasa una conversación\nMotivo: ${motivo}\n${resumen}\nCliente: +${telefono} → https://wa.me/${telefono}`
  const apikey = process.env.CALLMEBOT_APIKEY
  if (apikey && a.aviso_whatsapp) fetch(`https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(a.aviso_whatsapp)}&text=${encodeURIComponent(texto)}&apikey=${encodeURIComponent(apikey)}`).catch(() => {})
  if (a.aviso_email) sendAvisoAsistente(a.aviso_email, { negocio: a.nombre, titulo: 'Te toca a ti', motivo, resumen, telefono }).catch(() => {})
}

/* Punto de entrada: un mensaje entrante → respuesta para enviar */
export async function responder(a: Asistente, telefono: string, texto: string, waId?: string): Promise<string | null> {
  if (!a.activo) return null
  // idempotencia: WhatsApp reintenta el webhook si tardamos
  if (waId) {
    const { data: ya } = await supabaseAdmin.from('asistente_mensajes').select('id').eq('wa_id', waId).maybeSingle()
    if (ya) return null
  }
  const { data: prev } = await supabaseAdmin.from('asistente_mensajes').select('role, content').eq('asistente_id', a.id).eq('telefono', telefono).order('created_at', { ascending: false }).limit(MAX_HISTORIA)
  const historia: Msg[] = ((prev || []) as Msg[]).reverse()
  await supabaseAdmin.from('asistente_mensajes').insert({ asistente_id: a.id, telefono, role: 'user', content: texto, wa_id: waId || null })

  let agenda = ''
  let libres: { inicio: Date }[] = []
  if (a.citas) {
    const { data: citas } = await supabaseAdmin.from('asistente_citas').select('inicio, fin').eq('asistente_id', a.id).eq('estado', 'confirmada').gte('fin', new Date().toISOString())
    const h = await huecos({ horario: a.horario, duracion: a.duracion_min, tokens: a.google_tokens, citas: ((citas || []) as { inicio: string; fin: string }[]).map((c) => [Date.parse(c.inicio), Date.parse(c.fin)]) })
    agenda = h.texto; libres = h.libres
  }

  let salida: string
  try {
    salida = await preguntarModelo(sistema(a, agenda), [...historia, { role: 'user', content: texto }])
  } catch (e) {
    console.error('asistente modelo', e)
    await avisarDueno(a, telefono, 'el asistente no ha podido contestar', `Mensaje: «${texto.slice(0, 200)}»`)
    return 'Ahora mismo no puedo contestarte; le paso tu mensaje al responsable y te escribe hoy mismo.'
  }
  const { texto: respuesta, cita, aviso } = separar(salida)

  if (cita?.inicio && a.citas) {
    const [f, h] = cita.inicio.split('T')
    const [y, m, d] = f.split('-').map(Number), [hh, mm] = (h || '00:00').split(':').map(Number)
    const inicio = fechaMadrid(y, m, d, hh, mm)
    const valido = libres.some((l) => l.inicio.getTime() === inicio.getTime())
    if (valido) {
      const fin = new Date(inicio.getTime() + a.duracion_min * 60000)
      const eventoId = await reservar(a.google_tokens, { titulo: `${cita.servicio || 'Cita'} · ${cita.nombre || 'cliente'} (WhatsApp)`, descripcion: `Reservada por el asistente. Cliente: +${telefono}`, inicio, fin })
      await supabaseAdmin.from('asistente_citas').insert({ asistente_id: a.id, telefono, nombre: cita.nombre || null, servicio: cita.servicio || null, inicio: inicio.toISOString(), fin: fin.toISOString(), calendar_event_id: eventoId })
      const apikey = process.env.CALLMEBOT_APIKEY
      if (apikey && a.aviso_whatsapp) fetch(`https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(a.aviso_whatsapp)}&text=${encodeURIComponent(`📅 Nueva cita · ${etiqueta(inicio)} · ${cita.servicio || ''} · ${cita.nombre || ''} (+${telefono})`)}&apikey=${encodeURIComponent(apikey)}`).catch(() => {})
    } else {
      // el modelo ha propuesto una hora que ya no está libre: se lo decimos al cliente y avisamos
      await avisarDueno(a, telefono, 'cita no confirmada (hueco no válido)', `Pedía ${cita.inicio} · ${cita.servicio || ''} · ${cita.nombre || ''}`)
      const r = respuesta + '\n\nUn momento, que compruebo la agenda y te confirmo la hora enseguida.'
      await supabaseAdmin.from('asistente_mensajes').insert({ asistente_id: a.id, telefono, role: 'assistant', content: r })
      return r
    }
  }
  if (aviso) await avisarDueno(a, telefono, aviso.motivo || 'te necesita', aviso.resumen || '')

  const final = respuesta || 'Te leo. ¿Me dices un poco más?'
  await supabaseAdmin.from('asistente_mensajes').insert({ asistente_id: a.id, telefono, role: 'assistant', content: final })
  return final
}
