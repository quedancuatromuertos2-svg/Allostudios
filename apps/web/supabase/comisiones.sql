-- Comisiones de comerciales (20/09/2026). Ejecutar una vez en Supabase → SQL editor.
--
-- Regla: cada venta (pedido pagado) lleva el comercial que la cerró y un % fijado en el momento de la
-- venta según la escalera SEMANAL (lunes-domingo, hora de Madrid) de ese comercial:
--   venta 1.ª y 2.ª de la semana → 20 % · 3.ª y 4.ª → 25 % · 5.ª en adelante → 30 %.
-- Ese % se aplica a TODAS las cuotas que pague ese cliente durante sus 12 primeros meses.
-- Cada cuota cobrada (invoice.paid en Stripe) genera una fila en `comisiones`; el día 5 se cierra el
-- mes en `liquidaciones` (una por comercial y mes) y se paga contra su factura.

-- El comercial se identifica por su slug (va en los enlaces: allostudios.net/?c=fran)
alter table public.panel_members add column if not exists slug text unique;
alter table public.panel_members add column if not exists iban text;
alter table public.panel_members add column if not exists nif  text;

-- Atribución de la venta
alter table public.pedidos add column if not exists comercial      text;          -- slug de panel_members
alter table public.pedidos add column if not exists comision_pct   numeric(5,2);  -- 20 / 25 / 30, fijado al pagar
alter table public.pedidos add column if not exists semana_venta   text;          -- '2026-W39'
create index if not exists pedidos_comercial_idx on public.pedidos (comercial, pagado_at);

-- Una fila por cuota cobrada
create table if not exists public.comisiones (
  id            uuid primary key default gen_random_uuid(),
  pedido_id     uuid not null references public.pedidos(id) on delete cascade,
  comercial     text not null,
  stripe_invoice_id text unique,                 -- idempotencia: Stripe reintenta webhooks
  numero_cuota  int not null,                    -- 1..12 (solo se comisionan 12)
  base_cent     int not null,                    -- lo que pagó el cliente (sin IVA)
  pct           numeric(5,2) not null,
  importe_cent  int not null,                    -- base × pct
  mes           text not null,                   -- 'AAAA-MM' del cobro → mes de liquidación
  cobrado_at    timestamptz not null default now(),
  liquidacion_id uuid
);
create index if not exists comisiones_comercial_mes on public.comisiones (comercial, mes);

-- Cierre mensual por comercial (día 5): lo que se le paga contra factura
create table if not exists public.liquidaciones (
  id            uuid primary key default gen_random_uuid(),
  comercial     text not null,
  mes           text not null,                   -- 'AAAA-MM'
  total_cent    int not null,
  cuotas        int not null,
  estado        text not null default 'pendiente', -- pendiente | pagada
  factura_ref   text,                            -- nº de factura del comercial
  pagada_at     timestamptz,
  created_at    timestamptz not null default now(),
  unique (comercial, mes)
);
