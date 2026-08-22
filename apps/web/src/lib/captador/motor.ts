/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-explicit-any */
// Puente entre el motor del Captador (Node puro, CommonJS, copiado tal cual desde
// captador-valencia) y las rutas de la web. Si allí se mejora el scoring o los
// mensajes, basta con volver a copiar los .js de esta carpeta.

export const cfg = require('./config')
export const places = require('./places')
export const quality = require('./quality')
export const priority = require('./priority')
const { analyzeLead } = require('./analyze')
const { buildMessages } = require('./messages')

export type LeadBruto = Record<string, any>

// Analiza la web del negocio y le pega encima puntuación, problemas y gancho.
export async function analizarLead(lead: LeadBruto): Promise<LeadBruto> {
  const a = await analyzeLead(lead)
  Object.assign(lead, a, { _analizado: true })
  return lead
}

// Mensaje de venta ya redactado (el mismo que manda el Captador por WhatsApp).
function mensajeDe(lead: LeadBruto): string | null {
  try {
    const m = buildMessages(lead)
    return m?.whatsapp || m?.first || null
  } catch {
    return null
  }
}

// Puntuación de respaldo para los leads que no ha dado tiempo a analizar:
// la prioridad de contacto, que no necesita bajarse la web.
function respaldo(lead: LeadBruto) {
  try {
    const c = priority.classify(lead)
    const score = c?.priority ?? null
    return { score, tier: score == null ? null : score >= 70 ? 'A' : score >= 45 ? 'B' : 'C' }
  } catch {
    return { score: null, tier: null }
  }
}

// Convierte un lead del motor en una fila de la tabla captador_leads.
export function filaDesdeLead(l: LeadBruto, { workspace, sector }: { workspace: string; sector?: string }) {
  const analizado = Boolean(l._analizado)
  const alt = analizado ? null : respaldo(l)
  const sectorKey = sector || l.sector || null

  return {
    workspace,
    external_id: String(l.id),
    name: String(l.name || '').slice(0, 200),
    sector: sectorKey,
    sector_label: (sectorKey && cfg.SECTORS[sectorKey]?.label) || l.sectorLabel || null,
    phone: l.phone || null,
    email: l.email || l.guessedEmail || null,
    website: l.website || null,
    instagram: l.instagram || null,
    address: l.address || null,
    city: l.city || 'Valencia',
    lat: l.lat ?? null,
    lon: l.lon ?? null,
    rating: l.rating ?? null,
    reviews: l.reviews ?? null,
    score: analizado ? (l.score ?? null) : alt!.score,
    tier: analizado ? (l.tier ?? null) : alt!.tier,
    problems: Array.isArray(l.problems) ? l.problems.slice(0, 8) : null,
    hook: l.hook || null,
    message: mensajeDe(l),
    place_id: l.placeId || String(l.id),
    analyzed_at: analizado ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }
}
