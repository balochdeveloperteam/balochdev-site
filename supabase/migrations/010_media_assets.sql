-- 010_media_assets.sql — admin media library: catalog of Cloudinary uploads
-- the admin re-uses across blog posts (alt/caption persisted per asset).
-- Apply manually via Supabase SQL Editor. Requires 003_team_management.sql
-- + blog_can_manage() from 005_blog_cms.sql + set_updated_at() from 001/005.

-- ---------------------------------------------------------------------------
-- media_assets table
-- ---------------------------------------------------------------------------

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  cloudinary_public_id text not null unique,
  secure_url text not null,
  alt text not null default '',
  caption text not null default '',
  folder text not null default 'balochdev/blog',
  width integer,
  height integer,
  format text,
  created_by uuid references public.team_members (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists media_assets_created_at_idx
  on public.media_assets (created_at desc);

create index if not exists media_assets_folder_idx
  on public.media_assets (folder, created_at desc);

create trigger media_assets_set_updated_at
  before update on public.media_assets
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS — admin-only (no public access; the SECURE_URL on Cloudinary is the
-- public delivery channel for these assets).
-- ---------------------------------------------------------------------------

alter table public.media_assets enable row level security;

create policy media_assets_manage_select
  on public.media_assets
  for select
  to authenticated
  using (public.blog_can_manage());

create policy media_assets_manage_insert
  on public.media_assets
  for insert
  to authenticated
  with check (public.blog_can_manage());

create policy media_assets_manage_update
  on public.media_assets
  for update
  to authenticated
  using (public.blog_can_manage())
  with check (public.blog_can_manage());

create policy media_assets_manage_delete
  on public.media_assets
  for delete
  to authenticated
  using (public.blog_can_manage());
