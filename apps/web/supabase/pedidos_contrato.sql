-- Modelo de suscripción con contrato (18/09/2026). Ejecutar una vez en Supabase → SQL Editor.
-- Registro de la aceptación del contrato en cada pedido y estados de la vida de la suscripción.
alter table public.pedidos add column if not exists contrato_version     text;
alter table public.pedidos add column if not exists contrato_aceptado_at  timestamptz;
alter table public.pedidos add column if not exists contrato_ip           text;
alter table public.pedidos add column if not exists contrato_ua           text;
-- `estado` ya existe (pendiente/pagado/fallido). Nuevos valores que escribe el webhook:
-- 'impago' (cuota fallida), 'baja_programada' (cancela a fin de periodo), 'baja' (cancelada).
create index if not exists pedidos_stripe_subscription_idx on public.pedidos (stripe_subscription_id);
