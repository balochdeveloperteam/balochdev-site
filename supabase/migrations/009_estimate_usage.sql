-- BalochDev AI estimate usage tracking (Part 3).
-- Apply manually via Supabase SQL Editor.
--
-- Public INSERT/SELECT is intended to go through Express API only (rate-limit, daily cap, Gemini).
-- RLS enabled with no anon policies — service-role client in Express handles all access.

-- ---------------------------------------------------------------------------
-- estimate_usage
-- ---------------------------------------------------------------------------

create table if not exists public.estimate_usage (
  id uuid primary key default gen_random_uuid(),
  visitor_key text,
  ip_hash text not null,
  name text,
  email text,
  company text,
  budget text,
  timeline text,
  brief text not null,
  report jsonb,
  model text,
  status text not null default 'ok',
  created_at timestamptz not null default now(),
  constraint estimate_usage_status_check check (status in ('ok', 'error', 'rate_limited'))
);

create index if not exists estimate_usage_ip_created_idx
  on public.estimate_usage (ip_hash, created_at desc);

create index if not exists estimate_usage_visitor_created_idx
  on public.estimate_usage (visitor_key, created_at desc)
  where visitor_key is not null;

-- ---------------------------------------------------------------------------
-- RLS — no anon/authenticated policies; Express service-role only
-- ---------------------------------------------------------------------------

alter table public.estimate_usage enable row level security;
