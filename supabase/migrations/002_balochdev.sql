-- BalochDev: projects, site images metadata, form submissions, blog cover image, storage bucket

-- Optional cover image in storage bucket `site-images`
alter table public.blog_posts
  add column if not exists cover_image_path text;

-- Project / portfolio entries (editable in Supabase or future admin)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  title text not null,
  slug text not null unique,
  summary text default '',
  body_html text default '',
  image_path text,
  category text not null default 'client' check (category in ('partner', 'balochdev', 'client', 'future')),
  featured boolean default true,
  published boolean default true,
  sort_order int default 0
);

create index if not exists projects_published_idx on public.projects (published, sort_order, created_at desc);

alter table public.projects enable row level security;

create policy "Public read published projects"
  on public.projects for select
  using (published = true);

-- Metadata for images used on the site (files live in storage.objects under bucket site-images)
create table if not exists public.site_images (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  path text not null,
  alt text default '',
  label text default '',
  sort_order int default 0
);

alter table public.site_images enable row level security;

create policy "Public read site_images"
  on public.site_images for select
  using (true);

-- All form leads (contact, proposal, estimate) — backend uses service role to insert
create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  form_type text not null check (form_type in ('contact', 'proposal', 'estimate')),
  name text,
  email text,
  phone text,
  company text,
  message text,
  meta jsonb default '{}'::jsonb,
  client_ip text
);

create index if not exists form_submissions_created_idx on public.form_submissions (created_at desc);

alter table public.form_submissions enable row level security;

-- No public policies — only service role inserts/selects from API

-- Storage: public bucket for site & blog imagery (upload via Supabase dashboard or future signed upload)
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

-- Public can read objects in site-images
drop policy if exists "Public read site-images" on storage.objects;
create policy "Public read site-images"
  on storage.objects for select
  using (bucket_id = 'site-images');

-- Allow authenticated users to upload to site-images (team / admin accounts)
drop policy if exists "Auth upload site-images" on storage.objects;
create policy "Auth upload site-images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-images');

drop policy if exists "Auth update own site-images" on storage.objects;
create policy "Auth update own site-images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-images');

drop policy if exists "Auth delete site-images" on storage.objects;
create policy "Auth delete site-images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-images');

-- Seed future / mission projects (short copy; edit anytime in Table Editor)
insert into public.projects (title, slug, summary, category, sort_order, published)
values
  ('Balochi in Microsoft Office', 'balochi-ms-office', 'Partner initiative to introduce Balochi language support in MS Office ecosystem.', 'partner', 10, true),
  ('Balochi in Google Keyboard', 'balochi-google-keyboard', 'Partner project: Balochi input on Google Keyboard for millions of devices.', 'partner', 20, true),
  ('Balochi Academy LLM / Chatbot', 'balochi-academy-chatbot', 'Conversational assistant that answers in Balochi for learners and community.', 'partner', 30, true),
  ('Balochi Music AI', 'balochi-music-ai', 'Promote Balochi music worldwide with ethical AI-assisted discovery and tools.', 'balochdev', 40, true),
  ('Large-scale Balochi AI model', 'balochi-foundation-model', 'Research-track foundation model for Balochi — similar ambition to leading open models.', 'future', 50, true),
  ('Balochi music device', 'balochi-music-device', 'Physical product concept: voice-first device to play and learn Balochi music.', 'future', 60, true),
  ('Balochi in Chrome & browsers', 'balochi-browsers', 'Extend Balochi typography and input to Chrome and other browsers.', 'balochdev', 70, true),
  ('International client delivery', 'client-web-mobile', 'Web and mobile apps for global clients — our ongoing services arm.', 'client', 5, true)
on conflict (slug) do nothing;
