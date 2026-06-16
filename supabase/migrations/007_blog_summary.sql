-- 007_blog_summary.sql — additive sidebar summary for public blog posts.
-- Apply manually via Supabase SQL Editor when ready.
--
-- Adds a short "key takeaways / TL;DR" field shown in the single-post right sidebar.
-- Empty string hides the sidebar card on the public page.

alter table public.blog_posts
  add column if not exists summary text not null default '';

comment on column public.blog_posts.summary is
  'Short 150–300 word key takeaways shown in the post sidebar; empty hides the card.';
