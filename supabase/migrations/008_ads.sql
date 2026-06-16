-- 008_ads.sql — blog ad placements (hero + post sidebar slots).
-- Apply manually via Supabase SQL Editor. Requires 003_team_management.sql + blog_can_manage() from 005.

-- ---------------------------------------------------------------------------
-- Enum
-- ---------------------------------------------------------------------------

do $$ begin
  create type public.ad_placement as enum ('blog_hero', 'post_sidebar_a', 'post_sidebar_b');
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- ads table
-- ---------------------------------------------------------------------------

create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  placement public.ad_placement not null,
  image_url text not null,
  image_alt text not null default '',
  link_url text not null default '',
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  advertiser_name text not null default '',
  notes text not null default '',
  created_by uuid references public.team_members (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ads_placement_active_idx
  on public.ads (placement, is_active);

create index if not exists ads_updated_at_idx
  on public.ads (placement, updated_at desc);

create trigger ads_set_updated_at
  before update on public.ads
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.ads enable row level security;

-- Public read: active rows within optional schedule window
create policy ads_public_select
  on public.ads
  for select
  to anon, authenticated
  using (
    is_active = true
    and (starts_at is null or now() >= starts_at)
    and (ends_at is null or now() <= ends_at)
  );

-- Admin + manager CRUD (same gate as blog CMS)
create policy ads_manage_select
  on public.ads
  for select
  to authenticated
  using (public.blog_can_manage());

create policy ads_manage_insert
  on public.ads
  for insert
  to authenticated
  with check (public.blog_can_manage());

create policy ads_manage_update
  on public.ads
  for update
  to authenticated
  using (public.blog_can_manage())
  with check (public.blog_can_manage());

create policy ads_manage_delete
  on public.ads
  for delete
  to authenticated
  using (public.blog_can_manage());
