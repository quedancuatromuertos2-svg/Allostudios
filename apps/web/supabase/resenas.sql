-- Petición automática de reseña a los clientes (23/09/2026). Ejecutar en Supabase → SQL editor.
alter table public.pedidos add column if not exists resena_pedida_at     timestamptz;  -- día 7: entrega
alter table public.pedidos add column if not exists resena_recordada_at  timestamptz;  -- día 30: con el informe
alter table public.pedidos add column if not exists resena_dejada        boolean not null default false;
create index if not exists pedidos_resena_idx on public.pedidos (estado, pagado_at);
