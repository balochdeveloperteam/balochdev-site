-- Baloch Developers — Supabase schema (run in SQL editor or supabase db push)

-- Blog posts (published content; API uses service role for writes)
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  published_at timestamptz,
  published boolean default false,
  author_id uuid references auth.users (id) on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text default '',
  body_html text default ''
);

create index if not exists blog_posts_published_idx on public.blog_posts (published, published_at desc);

alter table public.blog_posts enable row level security;

create policy "Public read published posts"
  on public.blog_posts for select
  using (published = true);

-- Optional: allow authenticated users to insert their own posts (if writing from client later)
-- create policy "Authors insert own" on public.blog_posts for insert to authenticated with check (auth.uid() = author_id);

-- Lightweight analytics (aggregate in admin)
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  path text not null default '/',
  referrer text,
  user_agent text
);

create index if not exists analytics_events_created_idx on public.analytics_events (created_at desc);

alter table public.analytics_events enable row level security;

-- No public policies — only service role / backend inserts & reads
