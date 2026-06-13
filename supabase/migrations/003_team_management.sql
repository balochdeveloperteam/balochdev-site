-- BalochDev internal team management (admin-only — no public RLS policies)
-- Apply via Supabase SQL Editor or: supabase db push (after review)

-- ---------------------------------------------------------------------------
-- Enum types
-- ---------------------------------------------------------------------------

create type public.team_access_role as enum ('admin', 'manager', 'member');
create type public.team_member_status as enum ('trial', 'active', 'warned', 'inactive');
create type public.weekly_hours_status as enum ('pending', 'submitted', 'approved', 'rejected');
create type public.task_frequency as enum ('one_time', 'daily', 'weekly');
create type public.task_status as enum ('pending', 'in_progress', 'completed', 'verified', 'rejected');
create type public.warning_type as enum ('red_week', 'warning_letter', 'final');
create type public.policy_category as enum (
  'general',
  'ethics',
  'data_safety',
  'social_boundaries',
  'trial',
  'conduct'
);

-- ---------------------------------------------------------------------------
-- Trigger / utility functions (no team table references)
-- ---------------------------------------------------------------------------

-- Week starts Sunday (hours_sun … hours_sat).
create or replace function public.current_week_sunday()
returns date
language sql
stable
as $$
  select (current_date - extract(dow from current_date)::integer)::date;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.weekly_hours_recalc_total()
returns trigger
language plpgsql
as $$
begin
  new.total_hours :=
    coalesce(new.hours_sun, 0) +
    coalesce(new.hours_mon, 0) +
    coalesce(new.hours_tue, 0) +
    coalesce(new.hours_wed, 0) +
    coalesce(new.hours_thu, 0) +
    coalesce(new.hours_fri, 0) +
    coalesce(new.hours_sat, 0);
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role_title text not null default '',
  department text not null default '',
  access_role public.team_access_role not null default 'member',
  auth_user_id uuid references auth.users (id) on delete set null,
  email text,
  avatar_url text,
  status public.team_member_status not null default 'trial',
  trial_start_date date,
  trial_end_date date,
  joined_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint team_members_email_unique unique (email),
  constraint team_members_auth_user_unique unique (auth_user_id)
);

create index team_members_access_role_idx on public.team_members (access_role);
create index team_members_status_idx on public.team_members (status);
create index team_members_auth_user_idx on public.team_members (auth_user_id);

create trigger team_members_set_updated_at
  before update on public.team_members
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------

create table public.member_responsibilities (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.team_members (id) on delete cascade,
  title text not null,
  description text not null default '',
  ordering int not null default 0
);

create index member_responsibilities_member_idx
  on public.member_responsibilities (member_id, ordering);

-- ---------------------------------------------------------------------------

create table public.weekly_hours (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.team_members (id) on delete cascade,
  week_start_date date not null,
  week_end_date date not null,
  project_task text not null default '',
  task_details text not null default '',
  hours_sun numeric(5, 2),
  hours_mon numeric(5, 2),
  hours_tue numeric(5, 2),
  hours_wed numeric(5, 2),
  hours_thu numeric(5, 2),
  hours_fri numeric(5, 2),
  hours_sat numeric(5, 2),
  total_hours numeric(6, 2) not null default 0,
  notes text not null default '',
  status public.weekly_hours_status not null default 'pending',
  reviewed_by uuid references public.team_members (id) on delete set null,
  reviewed_at timestamptz,
  is_red boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint weekly_hours_member_week_unique unique (member_id, week_start_date)
);

create index weekly_hours_member_idx on public.weekly_hours (member_id, week_start_date desc);
create index weekly_hours_status_idx on public.weekly_hours (status, week_start_date desc);

create trigger weekly_hours_set_updated_at
  before update on public.weekly_hours
  for each row execute function public.set_updated_at();

create trigger weekly_hours_recalc_total
  before insert or update of
    hours_sun, hours_mon, hours_tue, hours_wed, hours_thu, hours_fri, hours_sat
  on public.weekly_hours
  for each row execute function public.weekly_hours_recalc_total();

-- ---------------------------------------------------------------------------

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  responsibility text not null default '',
  guide text not null default '',
  assigned_to uuid references public.team_members (id) on delete set null,
  created_by uuid references public.team_members (id) on delete set null,
  frequency public.task_frequency not null default 'one_time',
  due_date date,
  status public.task_status not null default 'pending',
  completed_at timestamptz,
  verified_by uuid references public.team_members (id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create index tasks_assigned_to_idx on public.tasks (assigned_to, status);
create index tasks_created_by_idx on public.tasks (created_by, created_at desc);
create index tasks_status_idx on public.tasks (status, due_date);

-- ---------------------------------------------------------------------------

create table public.warnings (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.team_members (id) on delete cascade,
  type public.warning_type not null,
  reason text not null,
  week_start_date date,
  issued_by uuid references public.team_members (id) on delete set null,
  member_response text not null default '',
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create index warnings_member_idx on public.warnings (member_id, created_at desc);
create index warnings_resolved_idx on public.warnings (resolved, created_at desc);

-- ---------------------------------------------------------------------------

create table public.policies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category public.policy_category not null default 'general',
  content text not null default '',
  ordering int not null default 0,
  updated_at timestamptz not null default now()
);

create index policies_category_idx on public.policies (category, ordering);

create trigger policies_set_updated_at
  before update on public.policies
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------

create table public.weekly_reports (
  id uuid primary key default gen_random_uuid(),
  week_start_date date not null,
  generated_by uuid references public.team_members (id) on delete set null,
  doc_url text,
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index weekly_reports_week_idx on public.weekly_reports (week_start_date desc);

-- ---------------------------------------------------------------------------
-- RLS helper functions (security definer — query public.team_members)
-- ---------------------------------------------------------------------------

create or replace function public.team_member_id_for_auth()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select tm.id
  from public.team_members tm
  where tm.auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function public.team_access_role_for_auth()
returns public.team_access_role
language sql
stable
security definer
set search_path = public
as $$
  select tm.access_role
  from public.team_members tm
  where tm.auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function public.is_team_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.team_members tm
    where tm.auth_user_id = auth.uid()
      and tm.access_role = 'admin'
  );
$$;

create or replace function public.is_team_manager_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.team_members tm
    where tm.auth_user_id = auth.uid()
      and tm.access_role in ('admin', 'manager')
  );
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.team_members enable row level security;
alter table public.member_responsibilities enable row level security;
alter table public.weekly_hours enable row level security;
alter table public.tasks enable row level security;
alter table public.warnings enable row level security;
alter table public.policies enable row level security;
alter table public.weekly_reports enable row level security;

-- team_members ---------------------------------------------------------------

create policy "team_members admin all"
  on public.team_members
  for all
  to authenticated
  using (public.is_team_admin())
  with check (public.is_team_admin());

create policy "team_members manager read all"
  on public.team_members
  for select
  to authenticated
  using (public.is_team_manager_or_admin());

create policy "team_members member read own"
  on public.team_members
  for select
  to authenticated
  using (id = public.team_member_id_for_auth());

-- member_responsibilities ----------------------------------------------------

create policy "member_responsibilities admin all"
  on public.member_responsibilities
  for all
  to authenticated
  using (public.is_team_admin())
  with check (public.is_team_admin());

create policy "member_responsibilities manager read all"
  on public.member_responsibilities
  for select
  to authenticated
  using (public.is_team_manager_or_admin());

create policy "member_responsibilities member read own"
  on public.member_responsibilities
  for select
  to authenticated
  using (member_id = public.team_member_id_for_auth());

-- weekly_hours ---------------------------------------------------------------

create policy "weekly_hours admin all"
  on public.weekly_hours
  for all
  to authenticated
  using (public.is_team_admin())
  with check (public.is_team_admin());

create policy "weekly_hours manager read all"
  on public.weekly_hours
  for select
  to authenticated
  using (public.is_team_manager_or_admin());

create policy "weekly_hours manager review"
  on public.weekly_hours
  for update
  to authenticated
  using (
    public.is_team_manager_or_admin()
    and not public.is_team_admin()
  )
  with check (
    public.is_team_manager_or_admin()
    and status in ('approved', 'rejected', 'submitted', 'pending')
  );

create policy "weekly_hours member read own"
  on public.weekly_hours
  for select
  to authenticated
  using (member_id = public.team_member_id_for_auth());

create policy "weekly_hours member insert current week"
  on public.weekly_hours
  for insert
  to authenticated
  with check (
    member_id = public.team_member_id_for_auth()
    and week_start_date = public.current_week_sunday()
    and status in ('pending', 'submitted')
  );

create policy "weekly_hours member update current week"
  on public.weekly_hours
  for update
  to authenticated
  using (
    member_id = public.team_member_id_for_auth()
    and week_start_date = public.current_week_sunday()
    and status in ('pending', 'submitted', 'rejected')
  )
  with check (
    member_id = public.team_member_id_for_auth()
    and week_start_date = public.current_week_sunday()
    and status in ('pending', 'submitted', 'rejected')
  );

-- tasks ----------------------------------------------------------------------

create policy "tasks admin all"
  on public.tasks
  for all
  to authenticated
  using (public.is_team_admin())
  with check (public.is_team_admin());

create policy "tasks manager read all"
  on public.tasks
  for select
  to authenticated
  using (public.is_team_manager_or_admin());

create policy "tasks manager insert"
  on public.tasks
  for insert
  to authenticated
  with check (
    public.is_team_manager_or_admin()
    and created_by = public.team_member_id_for_auth()
  );

create policy "tasks manager verify"
  on public.tasks
  for update
  to authenticated
  using (
    public.is_team_manager_or_admin()
    and not public.is_team_admin()
  )
  with check (
    public.is_team_manager_or_admin()
    and status in ('pending', 'in_progress', 'completed', 'verified', 'rejected')
  );

create policy "tasks member read assigned"
  on public.tasks
  for select
  to authenticated
  using (assigned_to = public.team_member_id_for_auth());

create policy "tasks member complete assigned"
  on public.tasks
  for update
  to authenticated
  using (
    assigned_to = public.team_member_id_for_auth()
    and status in ('pending', 'in_progress', 'completed')
  )
  with check (
    assigned_to = public.team_member_id_for_auth()
    and status in ('in_progress', 'completed')
  );

-- warnings -------------------------------------------------------------------

create policy "warnings admin all"
  on public.warnings
  for all
  to authenticated
  using (public.is_team_admin())
  with check (public.is_team_admin());

create policy "warnings manager read all"
  on public.warnings
  for select
  to authenticated
  using (public.is_team_manager_or_admin());

create policy "warnings manager insert"
  on public.warnings
  for insert
  to authenticated
  with check (
    public.is_team_manager_or_admin()
    and issued_by = public.team_member_id_for_auth()
  );

create policy "warnings member read own"
  on public.warnings
  for select
  to authenticated
  using (member_id = public.team_member_id_for_auth());

create policy "warnings member respond own"
  on public.warnings
  for update
  to authenticated
  using (member_id = public.team_member_id_for_auth())
  with check (member_id = public.team_member_id_for_auth());

-- policies -------------------------------------------------------------------

create policy "policies admin all"
  on public.policies
  for all
  to authenticated
  using (public.is_team_admin())
  with check (public.is_team_admin());

create policy "policies team read"
  on public.policies
  for select
  to authenticated
  using (
    public.is_team_admin()
    or public.is_team_manager_or_admin()
    or public.team_member_id_for_auth() is not null
  );

-- weekly_reports -------------------------------------------------------------

create policy "weekly_reports admin all"
  on public.weekly_reports
  for all
  to authenticated
  using (public.is_team_admin())
  with check (public.is_team_admin());

create policy "weekly_reports manager read all"
  on public.weekly_reports
  for select
  to authenticated
  using (public.is_team_manager_or_admin());

create policy "weekly_reports manager insert"
  on public.weekly_reports
  for insert
  to authenticated
  with check (
    public.is_team_manager_or_admin()
    and generated_by = public.team_member_id_for_auth()
  );

-- ---------------------------------------------------------------------------
-- Seed team members (status active; link auth_user_id after Supabase Auth signup)
-- ---------------------------------------------------------------------------

insert into public.team_members (
  full_name,
  role_title,
  department,
  access_role,
  email,
  status,
  joined_date
)
values
  (
    'Adeel Baloch',
    'Founder & CTO / Full Stack',
    'Leadership',
    'admin',
    'admin@balochdev.com',
    'active',
    '2024-01-15'
  ),
  (
    'Jaber Baloch',
    'CEO / Full Stack (Frontend)',
    'Engineering',
    'admin',
    'jaberali@balochdev.com',
    'active',
    '2024-07-01'
  ),
  (
    'Fazeela Baloch',
    'Team Manager',
    'Operations',
    'manager',
    'fazeelabaloch@balochdev.com',
    'active',
    '2024-02-01'
  ),
  (
    'Sohail Baloch',
    'Lead Generation / Deal Maker',
    'Sales',
    'member',
    'sohailhussain@balochdev.com',
    'active',
    '2024-03-01'
  ),
  (
    'Shees Baloch',
    'Software Engineer (Mobile App)',
    'Engineering',
    'member',
    'shees@balochdev.com',
    'active',
    '2024-04-01'
  ),
  (
    'Shams Baloch',
    'Graphic Designer / Social Media',
    'Design',
    'member',
    'shams@balochdev.com',
    'active',
    '2024-05-01'
  ),
  (
    'Nabeel Baloch',
    'Junior Developer / Social Media',
    'Engineering',
    'member',
    'nabeel@balochdev.com',
    'active',
    '2024-06-01'
  ),
  (
    'Mariyam Baloch',
    'Social Media Manager',
    'Marketing',
    'member',
    'marybaloch@balochdev.com',
    'active',
    '2024-08-01'
  ),
  (
    'Iqra Baloch',
    'YouTube Content Manager',
    'Content',
    'member',
    'iqrakarim@balochdev.com',
    'active',
    '2024-09-01'
  ),
  (
    'Jwad Baloch',
    'Junior Developer / Social Media',
    'Engineering',
    'member',
    'jwad@balochdev.com',
    'active',
    '2024-10-01'
  )
on conflict (email) do nothing;
