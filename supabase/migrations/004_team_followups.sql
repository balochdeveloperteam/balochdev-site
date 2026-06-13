-- BalochDev team follow-ups: manager write access on member_responsibilities
-- Apply via Supabase SQL Editor after review (migration 003 must already be applied).

-- Managers can insert/update/delete responsibility rows (UI already exposes this).
-- Admins retain full access via existing "member_responsibilities admin all" policy.
-- (FOR ALL here also covers SELECT for managers/admins; read policies remain unchanged.)

create policy "member_responsibilities manager write"
  on public.member_responsibilities
  for all
  to authenticated
  using (public.is_team_manager_or_admin())
  with check (public.is_team_manager_or_admin());
