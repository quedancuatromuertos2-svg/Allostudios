/*  Agenda del negocio: huecos libres según su horario y su Google Calendar, y creación de la cita.
    Todo en Europe/Madrid. Si el negocio no ha conectado Google, los huecos salen solo del horario
    (y de las citas ya guardadas en asistente_citas).                                              */

import { createCalendarEvent, getValidAccessToken } from '@/lib/google-calendar'

export type Horario = Record<string, string[]> // { lun: ['09:30-14:00','16:00-20:00'], … }
type Tokens = { access_token: string; refresh_token?: string; expiry_date?: number }

const NOMBRES: Record<string, string> = { dom: 'domingo', lun: 'lunes', mar: 'martes', mie: 'miércoles', jue: 'jueves', vie: 'viernes', sab: 'sábado' }
const TZ = 'Europe/Madrid'

/* Fecha local (Madrid) → partes. Se evita depender de la zona horaria del servidor. */
function partes(d: Date) {
  const f = new Intl.DateTimeFormat('es-ES', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false })
  const o: Record<string, string> = {}
  for (const p of f.formatToParts(d)) o[p.type] = p.value
  // el día de la semana sale de Intl (hora de Madrid), no de getDay() (hora del servidor)
  const dia = (o.weekday || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace('.', '').slice(0, 3).toLowerCase()
  return { y: +o.year, m: +o.month, d: +o.day, h: +o.hour % 24, min: +o.minute, dia }
}

/* Construye un Date a partir de fecha local Madrid (sin librerías: se calcula el desfase con Intl) */
export function fechaMadrid(y: number, m: number, d: number, h: number, min: number): Date {
  const utc = Date.UTC(y, m - 1, d, h, min)
  const enMadrid = new Date(new Date(utc).toLocaleString('en-US', { timeZone: TZ }))
  const enUtc = new Date(new Date(utc).toLocaleString('en-US', { timeZone: 'UTC' }))
  return new Date(utc - (enMadrid.getTime() - enUtc.getTime()))
}

async function ocupados(tokens: Tokens | null, desde: Date, hasta: Date): Promise<[number, number][]> {
  if (!tokens?.access_token) return []
  try {
    const token = await getValidAccessToken(tokens)
    const r = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ timeMin: desde.toISOString(), timeMax: hasta.toISOString(), timeZone: TZ, items: [{ id: 'primary' }] }),
    })
    if (!r.ok) return []
    const j = await r.json()
    return (j.calendars?.primary?.busy || []).map((b: { start: string; end: string }) => [Date.parse(b.start), Date.parse(b.end)])
  } catch { return [] }
}

/* Huecos libres de los próximos `dias` días, como texto para el modelo y como lista para validar */
export async function huecos(opts: { horario: Horario; duracion: number; tokens: Tokens | null; citas: [number, number][]; dias?: number }) {
  const ahora = new Date()
  const hasta = new Date(ahora.getTime() + (opts.dias || 7) * 86400000)
  const busy = [...(await ocupados(opts.tokens, ahora, hasta)), ...opts.citas]
  const libres: { inicio: Date; etiqueta: string }[] = []
  const p0 = partes(ahora)
  for (let i = 0; i < (opts.dias || 7); i++) {
    const dia = new Date(Date.UTC(p0.y, p0.m - 1, p0.d + i, 12))
    const dp = partes(dia)
    const tramos = opts.horario[dp.dia] || []
    for (const t of tramos) {
      const [a, b] = t.split('-')
      const [ah, am] = a.split(':').map(Number), [bh, bm] = b.split(':').map(Number)
      for (let mins = ah * 60 + am; mins + opts.duracion <= bh * 60 + bm; mins += opts.duracion) {
        const ini = fechaMadrid(dp.y, dp.m, dp.d, Math.floor(mins / 60), mins % 60)
        const fin = new Date(ini.getTime() + opts.duracion * 60000)
        if (ini.getTime() < ahora.getTime() + 30 * 60000) continue // media hora de margen
        if (busy.some(([s, e]) => ini.getTime() < e && fin.getTime() > s)) continue
        libres.push({ inicio: ini, etiqueta: etiqueta(ini) })
      }
    }
  }
  // Para el modelo: por día, como mucho 8 horas repartidas (mañana y tarde), para no inflar el prompt
  const porDia = new Map<string, string[]>()
  for (const h of libres) {
    const k = h.etiqueta.split(' ')[0] + ' ' + h.etiqueta.split(' ')[1]
    const arr = porDia.get(k) || []
    arr.push(h.etiqueta.split(' ').slice(2).join(' '))
    porDia.set(k, arr)
  }
  const muestra = (hs: string[]) => hs.length <= 8 ? hs : Array.from({ length: 8 }, (_, i) => hs[Math.round(i * (hs.length - 1) / 7)])
  const texto = Array.from(porDia.entries()).map(([d, hs]) => `${d}: ${muestra(hs).join(', ')}`).join('\n') || 'Sin huecos en los próximos días.'
  return { libres, texto }
}

export function etiqueta(d: Date) {
  const p = partes(d)
  const nombreDia = NOMBRES[p.dia] || p.dia
  return `${nombreDia} ${String(p.d).padStart(2, '0')}/${String(p.m).padStart(2, '0')} ${String(p.h).padStart(2, '0')}:${String(p.min).padStart(2, '0')}`
}

/* Crea el evento en el Google Calendar del negocio (si está conectado). Devuelve el id o null. */
export async function reservar(tokens: Tokens | null, ev: { titulo: string; descripcion: string; inicio: Date; fin: Date }) {
  if (!tokens?.access_token) return null
  try {
    const r = await createCalendarEvent(tokens, { summary: ev.titulo, description: ev.descripcion, startDateTime: ev.inicio.toISOString(), endDateTime: ev.fin.toISOString() })
    return (r?.id as string) || null
  } catch (e) {
    console.error('asistente: no se pudo crear el evento', e)
    return null
  }
}

export const ahoraMadrid = () => etiqueta(new Date())
