-- ============================================================
--  Panel de captación (allostudios.net/panel)
--  Quién entra y qué leads ve cada uno.
--  Sirve para los comerciales del equipo y, más adelante, para
--  los clientes que paguen la mensualidad de captación: cambia
--  el `workspace` y cada uno ve solo lo suyo.
-- ============================================================

-- ── Quién puede entrar ──────────────────────────────────────
-- Se da de alta por EMAIL (así puedes autorizar a alguien antes
-- de que se registre); el clerk_id se rellena solo en su primer
-- acceso. El primer admin se crea automáticamente con la env
-- PANEL_ADMIN_EMAILS.
create table if not exists public.panel_members (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  clerk_id    text unique,
  name        text,
  workspace   text not null default 'allostudios',
  role        text not null default 'comercial',  -- admin | comercial | cliente
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists panel_members_ws_idx on public.panel_members (workspace);

-- ── Los leads de captación ──────────────────────────────────
-- Se suben desde el Captador local con POST /api/panel/sync.
create table if not exists public.captador_leads (
  id             uuid primary key default gen_random_uuid(),
  workspace      text not null default 'allostudios',
  external_id    text not null,          -- id del Captador (node/123, place id…)
  owner_clerk_id text,                   -- comercial asignado; null = sin asignar
  owner_email    text,                   -- para asignar antes de que se registre

  name           text not null,
  sector         text,
  sector_label   text,
  phone          text,
  website        text,
  instagram      text,
  address        text,
  city           text,
  lat            double precision,
  lon            double precision,

  rating         numeric,
  reviews        integer,
  score          integer,
  tier           text,
  problems       jsonb,
  hook           text,
  message        text,                   -- mensaje de venta ya redactado
  place_id       text,

  status         text not null default 'nuevo',  -- nuevo|contactado|interesado|cliente|descartado
  notes          text,
  contacted_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  unique (workspace, external_id)
);

create index if not exists captador_leads_ws_status_idx on public.captador_leads (workspace, status);
create index if not exists captador_leads_owner_idx     on public.captador_leads (owner_clerk_id);
create index if not exists captador_leads_score_idx     on public.captador_leads (workspace, score desc);

-- ── Seguridad ───────────────────────────────────────────────
-- RLS activado y SIN políticas públicas: solo el service role
-- (las rutas de servidor de Next) puede leer y escribir. El
-- navegador nunca habla directamente con estas tablas.
alter table public.panel_members   enable row level security;
alter table public.captador_leads  enable row level security;
