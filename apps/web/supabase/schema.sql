-- VoiceFlow AI — Supabase Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  clerk_id text unique not null,
  email text,
  full_name text,
  avatar_url text,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Businesses table
create table if not exists businesses (
  id uuid primary key default uuid_generate_v4(),
  owner_clerk_id text not null references users(clerk_id) on delete cascade,
  name text not null,
  niche text not null default 'BARBER_SHOP',
  phone text,
  address text,
  description text,
  vapi_assistant_id text,
  vapi_phone_number_id text,
  stripe_customer_id text,
  ai_config jsonb default '{}',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Services table
create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  description text,
  duration integer not null default 60,
  price numeric(10,2),
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Calls table
create table if not exists calls (
  id text primary key,
  business_id uuid not null references businesses(id) on delete cascade,
  vapi_call_id text unique,
  status text not null default 'in_progress',
  caller_number text,
  started_at timestamptz,
  ended_at timestamptz,
  duration_seconds integer,
  transcript text,
  recording_url text,
  summary text,
  sentiment text,
  cost_cents integer,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- Appointments table
create table if not exists appointments (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references businesses(id) on delete cascade,
  service_id uuid references services(id) on delete set null,
  customer_name text not null,
  customer_phone text,
  customer_email text,
  scheduled_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'confirmed',
  notes text,
  created_from text default 'manual',
  created_at timestamptz default now()
);

-- Leads table
create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  interest text,
  notes text,
  source text default 'vapi_call',
  status text default 'new',
  created_at timestamptz default now()
);

-- Subscriptions table
create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid unique not null references businesses(id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  plan text not null default 'TRIAL',
  status text not null default 'trialing',
  calls_limit integer not null default 50,
  calls_used integer not null default 0,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RPC to increment calls used
create or replace function increment_calls_used(biz_id uuid)
returns void as $$
  update subscriptions set calls_used = calls_used + 1 where business_id = biz_id;
$$ language sql;

-- Indexes
create index if not exists idx_businesses_owner on businesses(owner_clerk_id);
create index if not exists idx_calls_business on calls(business_id);
create index if not exists idx_calls_started on calls(started_at desc);
create index if not exists idx_appointments_business on appointments(business_id);
create index if not exists idx_appointments_scheduled on appointments(scheduled_at);
create index if not exists idx_leads_business on leads(business_id);
create index if not exists idx_services_business on services(business_id);

-- Row Level Security
alter table users enable row level security;
alter table businesses enable row level security;
alter table services enable row level security;
alter table calls enable row level security;
alter table appointments enable row level security;
alter table leads enable row level security;
alter table subscriptions enable row level security;

-- Service role bypasses RLS (used by supabaseAdmin)
-- Anon/authenticated users: no direct access (all access via server API routes)

-- Allow service role full access (already default in Supabase)
