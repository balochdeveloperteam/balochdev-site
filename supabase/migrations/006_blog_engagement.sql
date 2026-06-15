-- BalochDev blog engagement (Part 2) — comments + anonymous likes.
-- Apply manually via Supabase SQL Editor. Requires 005_blog_cms.sql (blog_posts + blog_can_manage()).
--
-- Public INSERT for comments/likes is intended to go through Express API (rate-limit, honeypot, ip_hash).
-- RLS still allows service-role writes; direct anon client INSERT is blocked for comments (no anon INSERT policy).

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

do $$ begin
  create type public.blog_comment_status as enum ('visible', 'hidden', 'deleted');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.blog_like_target_type as enum ('post', 'comment');
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- blog_posts: comment_count (like_count already exists in 005)
-- ---------------------------------------------------------------------------

alter table public.blog_posts
  add column if not exists comment_count int not null default 0;

-- ---------------------------------------------------------------------------
-- blog_comments
-- ---------------------------------------------------------------------------

create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts (id) on delete cascade,
  parent_id uuid references public.blog_comments (id) on delete cascade,
  author_name text not null,
  author_email text,
  content text not null,
  status public.blog_comment_status not null default 'visible',
  is_pinned boolean not null default false,
  like_count int not null default 0,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists blog_comments_post_created_idx
  on public.blog_comments (post_id, created_at desc);

create index if not exists blog_comments_parent_idx
  on public.blog_comments (parent_id)
  where parent_id is not null;

-- ---------------------------------------------------------------------------
-- blog_likes (one like per visitor_key per target)
-- ---------------------------------------------------------------------------

create table if not exists public.blog_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts (id) on delete cascade,
  target_type public.blog_like_target_type not null default 'post',
  target_id uuid not null,
  visitor_key text not null,
  created_at timestamptz not null default now(),
  constraint blog_likes_unique_visitor unique (target_type, target_id, visitor_key)
);

create index if not exists blog_likes_post_idx on public.blog_likes (post_id);
create index if not exists blog_likes_target_idx on public.blog_likes (target_type, target_id);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.blog_comments enable row level security;
alter table public.blog_likes enable row level security;

-- Public read: visible comments on published posts only
drop policy if exists "Public read visible blog comments" on public.blog_comments;
create policy "Public read visible blog comments"
  on public.blog_comments for select
  using (
    status = 'visible'::public.blog_comment_status
    and exists (
      select 1
      from public.blog_posts bp
      where bp.id = blog_comments.post_id
        and bp.status = 'published'::public.blog_post_status
    )
  );

drop policy if exists "Blog managers full access comments" on public.blog_comments;
create policy "Blog managers full access comments"
  on public.blog_comments for all
  to authenticated
  using (public.blog_can_manage())
  with check (public.blog_can_manage());

-- Public read like rows (for count aggregation via API; service role used in Express)
drop policy if exists "Public read blog likes" on public.blog_likes;
create policy "Public read blog likes"
  on public.blog_likes for select
  using (
    exists (
      select 1
      from public.blog_posts bp
      where bp.id = blog_likes.post_id
        and bp.status = 'published'::public.blog_post_status
    )
  );

drop policy if exists "Blog managers full access likes" on public.blog_likes;
create policy "Blog managers full access likes"
  on public.blog_likes for all
  to authenticated
  using (public.blog_can_manage())
  with check (public.blog_can_manage());
