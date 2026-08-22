import { currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

// Quién es el que está mirando el panel y qué puede ver.
// El alta se hace por EMAIL (puedes autorizar a alguien antes de que se registre);
// el clerk_id se rellena solo en su primer acceso.

export type PanelMember = {
  id: string
  email: string
  clerk_id: string | null
  name: string | null
  workspace: string
  role: 'admin' | 'comercial' | 'cliente'
  active: boolean
  created_at?: string
}

export type PanelContext = {
  email: string
  name: string
  member: PanelMember | null
}

function adminEmails(): string[] {
  return (process.env.PANEL_ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

// Devuelve siempre el email de quien mira, aunque no tenga acceso: así la
// pantalla de "sin acceso" puede decirle con qué cuenta ha entrado.
export async function getPanelContext(): Promise<PanelContext | null> {
  const user = await currentUser()
  if (!user) return null

  const email = (user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress || '')
    .trim()
    .toLowerCase()
  if (!email) return null

  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || email.split('@')[0]

  const { data: existing } = await supabaseAdmin
    .from('panel_members')
    .select('*')
    .eq('email', email)
    .maybeSingle()

  if (existing) {
    // Primer acceso de alguien autorizado por email: le atamos su cuenta
    if (!existing.clerk_id) {
      await supabaseAdmin
        .from('panel_members')
        .update({ clerk_id: user.id, name: existing.name || name })
        .eq('id', existing.id)
      existing.clerk_id = user.id
    }
    return { email, name, member: existing as PanelMember }
  }

  // Arranque: o el email está en PANEL_ADMIN_EMAILS, o el panel está vacío y
  // por tanto quien entra es el dueño montándolo por primera vez.
  const { count } = await supabaseAdmin
    .from('panel_members')
    .select('id', { count: 'exact', head: true })

  if (adminEmails().includes(email) || !count) {
    const { data } = await supabaseAdmin
      .from('panel_members')
      .insert({ email, clerk_id: user.id, name, role: 'admin', workspace: 'allostudios' })
      .select('*')
      .single()
    return { email, name, member: (data as PanelMember) || null }
  }

  return { email, name, member: null }
}

export type Lead = {
  id: string
  external_id: string
  owner_clerk_id: string | null
  owner_email: string | null
  name: string
  sector_label: string | null
  phone: string | null
  website: string | null
  instagram: string | null
  address: string | null
  city: string | null
  rating: number | null
  reviews: number | null
  score: number | null
  tier: string | null
  problems: string[] | null
  hook: string | null
  message: string | null
  status: string
  notes: string | null
  contacted_at: string | null
  created_at: string
}

// Los comerciales ven SOLO sus leads; el admin ve todo su espacio de trabajo.
export async function getLeads(member: PanelMember): Promise<Lead[]> {
  let q = supabaseAdmin
    .from('captador_leads')
    .select(
      'id, external_id, owner_clerk_id, owner_email, name, sector_label, phone, website, instagram, address, city, rating, reviews, score, tier, problems, hook, message, status, notes, contacted_at, created_at',
    )
    .eq('workspace', member.workspace)
    .order('score', { ascending: false, nullsFirst: false })
    .limit(500)

  if (member.role !== 'admin') {
    q = q.or(`owner_clerk_id.eq.${member.clerk_id},owner_email.eq.${member.email}`)
  }

  const { data, error } = await q
  if (error) return []
  return (data || []) as Lead[]
}

// El equipo del espacio de trabajo (para asignar leads y para la pestaña Equipo)
export async function getMembers(workspace: string): Promise<PanelMember[]> {
  const { data } = await supabaseAdmin
    .from('panel_members')
    .select('*')
    .eq('workspace', workspace)
    .order('created_at', { ascending: true })
  return (data || []) as PanelMember[]
}
