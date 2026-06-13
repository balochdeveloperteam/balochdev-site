-- BalochDev blog CMS (Part 1) — upgrade blog_posts in place; apply manually via Supabase SQL Editor.
-- Requires 003_team_management.sql (team_members + team_access_role) for author_member_id FK and blog_can_manage().
--
-- Related articles: we use related_slugs text[] on posts (not a join table) because Part 1
-- only needs admin multi-select + storage; slug strings are enough until Part 2 resolves
-- related posts for public rendering. Fewer tables, simpler editor save/load.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

do $$ begin
  create type public.blog_post_type as enum ('article', 'image_caption');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.blog_post_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- Columns (ALTER — keeps existing rows)
-- ---------------------------------------------------------------------------

alter table public.blog_posts
  add column if not exists post_type public.blog_post_type not null default 'article',
  add column if not exists content_html text,
  add column if not exists cover_image_url text,
  add column if not exists cover_image_alt text,
  add column if not exists meta_title text default '',
  add column if not exists meta_description text default '',
  add column if not exists focus_keyword text default '',
  add column if not exists tags text[] not null default '{}',
  add column if not exists category text default '',
  add column if not exists og_image_url text,
  add column if not exists reading_time_minutes int not null default 1,
  add column if not exists status public.blog_post_status not null default 'draft',
  add column if not exists author_name text not null default 'BalochDev',
  add column if not exists author_member_id uuid references public.team_members (id) on delete set null,
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists view_count int not null default 0,
  add column if not exists like_count int not null default 0,
  add column if not exists related_slugs text[] not null default '{}';

-- Legacy data migration (source columns confirmed on live blog_posts:
-- id, title, slug, excerpt, body_html, published, published_at, author_id, created_at).
-- cover_image_url has no legacy source — stays null until set via the CMS editor.

-- Migrate legacy body → content_html
update public.blog_posts
set content_html = body_html
where (content_html is null or content_html = '')
  and body_html is not null
  and body_html <> '';

-- Map published boolean → status
update public.blog_posts
set status = case when published is true then 'published'::public.blog_post_status else 'draft'::public.blog_post_status end
where status = 'draft'::public.blog_post_status
  and published is not null;

-- Ensure published posts have published_at
update public.blog_posts
set published_at = coalesce(published_at, created_at, now())
where status = 'published'::public.blog_post_status
  and published_at is null;

-- Default author from legacy author_id email when possible (best-effort)
update public.blog_posts bp
set author_name = coalesce(u.raw_user_meta_data ->> 'full_name', u.email, 'BalochDev')
from auth.users u
where bp.author_id = u.id
  and bp.author_name = 'BalochDev';

create index if not exists blog_posts_status_published_idx
  on public.blog_posts (status, published_at desc nulls last);

create index if not exists blog_posts_slug_idx on public.blog_posts (slug);

-- Keep published boolean in sync for legacy queries (prerender script, old API filters)
create or replace function public.blog_posts_sync_legacy()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  new.published := (new.status = 'published'::public.blog_post_status);

  if new.content_html is not null and new.content_html <> '' then
    new.body_html := new.content_html;
  elsif (new.content_html is null or new.content_html = '') and new.body_html is not null then
    new.content_html := new.body_html;
  end if;

  if new.status = 'published'::public.blog_post_status and new.published_at is null then
    new.published_at := now();
  end if;

  if new.og_image_url is null or new.og_image_url = '' then
    new.og_image_url := new.cover_image_url;
  end if;

  return new;
end;
$$;

drop trigger if exists blog_posts_sync_legacy_trg on public.blog_posts;
create trigger blog_posts_sync_legacy_trg
  before insert or update on public.blog_posts
  for each row execute function public.blog_posts_sync_legacy();

-- ---------------------------------------------------------------------------
-- RLS helpers
-- ---------------------------------------------------------------------------

create or replace function public.blog_can_manage()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
    or exists (
      select 1
      from public.team_members tm
      where tm.auth_user_id = auth.uid()
        and tm.access_role in ('admin'::public.team_access_role, 'manager'::public.team_access_role)
    );
$$;

-- ---------------------------------------------------------------------------
-- RLS policies
-- ---------------------------------------------------------------------------

drop policy if exists "Public read published posts" on public.blog_posts;

create policy "Public read published blog posts"
  on public.blog_posts for select
  using (status = 'published'::public.blog_post_status);

create policy "Blog managers read all posts"
  on public.blog_posts for select
  to authenticated
  using (public.blog_can_manage());

create policy "Blog managers insert posts"
  on public.blog_posts for insert
  to authenticated
  with check (public.blog_can_manage());

create policy "Blog managers update posts"
  on public.blog_posts for update
  to authenticated
  using (public.blog_can_manage())
  with check (public.blog_can_manage());

create policy "Blog managers delete posts"
  on public.blog_posts for delete
  to authenticated
  using (public.blog_can_manage());
