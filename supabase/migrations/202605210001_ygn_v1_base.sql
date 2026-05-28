create extension if not exists pgcrypto;
create schema if not exists private;
revoke all on schema private from public;

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  module text not null,
  description text,
  created_at timestamptz not null default now()
);

create table public.role_permissions (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (role_id, permission_id)
);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  avatar_url text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profile_members (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id uuid not null references public.roles(id),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, user_id)
);

create table public.profile_tags (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  tag_group text not null,
  tag_key text not null,
  created_at timestamptz not null default now(),
  unique (profile_id, tag_group, tag_key)
);

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  title text not null,
  content_type text not null,
  status text not null default 'idea',
  idea text,
  script text,
  caption text,
  hashtags text[],
  platform text,
  scheduled_for timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  type text not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  payload jsonb not null default '{}'::jsonb,
  result jsonb,
  error_message text,
  attempts integer not null default 0,
  max_attempts integer not null default 3,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  content_id uuid references public.content_items(id) on delete set null,
  job_id uuid references public.ai_jobs(id) on delete set null,
  asset_type text not null,
  storage_provider text not null default 'cloudflare_r2',
  r2_key text not null,
  public_url text,
  mime_type text,
  size_bytes bigint,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.library_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  type text not null,
  title text not null,
  body text,
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.manual_posting_queue (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  content_id uuid not null references public.content_items(id) on delete cascade,
  platform text not null,
  status text not null default 'waiting' check (status in ('waiting', 'ready', 'posted', 'skipped', 'needs_fix')),
  checklist jsonb not null default '{}'::jsonb,
  caption_to_copy text,
  hashtags_to_copy text[],
  media_asset_id uuid references public.media_assets(id) on delete set null,
  planned_date date,
  posted_at timestamptz,
  posted_by uuid references auth.users(id),
  post_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  profile_id uuid references public.profiles(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id text,
  old_data jsonb,
  new_data jsonb,
  reason text,
  created_at timestamptz not null default now()
);

create table public.health_logs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  status text not null check (status in ('info', 'warning', 'error', 'critical')),
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.ai_jobs(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  profile_id uuid references public.profiles(id) on delete set null,
  agent_key text not null check (agent_key in ('hefesto', 'gaia', 'morax', 'yomi', 'hotei', 'heimdall', 'maat', 'isis')),
  module text not null,
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  status text not null default 'processing',
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  content_id uuid references public.content_items(id) on delete set null,
  report_type text not null,
  period_start date not null,
  period_end date not null,
  metrics jsonb not null default '{}'::jsonb,
  summary text,
  recommendations text,
  created_at timestamptz not null default now()
);

create index profiles_owner_id_idx on public.profiles(owner_id);
create index profiles_status_created_at_idx on public.profiles(status, created_at desc);
create index profile_members_profile_user_idx on public.profile_members(profile_id, user_id);
create index profile_members_user_status_idx on public.profile_members(user_id, status);
create index profile_tags_profile_id_idx on public.profile_tags(profile_id);
create index profile_tags_tag_key_idx on public.profile_tags(tag_key);
create index content_items_profile_status_idx on public.content_items(profile_id, status);
create index content_items_created_by_idx on public.content_items(created_by);
create index content_items_created_at_idx on public.content_items(created_at desc);
create index media_assets_profile_id_idx on public.media_assets(profile_id);
create index media_assets_user_id_idx on public.media_assets(user_id);
create index media_assets_job_id_idx on public.media_assets(job_id);
create index library_items_profile_status_idx on public.library_items(profile_id, status);
create index manual_posting_queue_profile_status_idx on public.manual_posting_queue(profile_id, status);
create index ai_jobs_status_created_at_idx on public.ai_jobs(status, created_at);
create index ai_jobs_user_id_idx on public.ai_jobs(user_id);
create index ai_jobs_profile_id_idx on public.ai_jobs(profile_id);
create index audit_logs_profile_created_at_idx on public.audit_logs(profile_id, created_at desc);
create index audit_logs_user_created_at_idx on public.audit_logs(user_id, created_at desc);
create index health_logs_source_created_at_idx on public.health_logs(source, created_at desc);
create index agent_runs_job_id_idx on public.agent_runs(job_id);
create index reports_profile_period_idx on public.reports(profile_id, period_start, period_end);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at before update on public.profiles for each row execute function public.touch_updated_at();
create trigger profile_members_touch_updated_at before update on public.profile_members for each row execute function public.touch_updated_at();
create trigger content_items_touch_updated_at before update on public.content_items for each row execute function public.touch_updated_at();
create trigger media_assets_touch_updated_at before update on public.media_assets for each row execute function public.touch_updated_at();
create trigger library_items_touch_updated_at before update on public.library_items for each row execute function public.touch_updated_at();
create trigger manual_posting_queue_touch_updated_at before update on public.manual_posting_queue for each row execute function public.touch_updated_at();
create trigger ai_jobs_touch_updated_at before update on public.ai_jobs for each row execute function public.touch_updated_at();

create or replace function private.is_profile_member(p_profile_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = p_profile_id
      and p.owner_id = p_user_id
  ) or exists (
    select 1
    from public.profile_members pm
    where pm.profile_id = p_profile_id
      and pm.user_id = p_user_id
      and pm.status = 'active'
  );
$$;

create or replace function private.user_has_permission(p_user_id uuid, p_permission_key text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select (
    p_user_id is not null
    and p_permission_key = 'profiles.create'
  ) or exists (
    select 1
    from public.profiles p
    join public.roles r on r.key = 'owner'
    join public.role_permissions rp on rp.role_id = r.id
    join public.permissions perm on perm.id = rp.permission_id
    where p.owner_id = p_user_id
      and perm.key = p_permission_key
  ) or exists (
    select 1
    from public.profile_members pm
    join public.roles r on r.id = pm.role_id
    join public.role_permissions rp on rp.role_id = r.id
    join public.permissions perm on perm.id = rp.permission_id
    where pm.user_id = p_user_id
      and pm.status = 'active'
      and perm.key = p_permission_key
  );
$$;

create or replace function private.add_profile_owner_member()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  owner_role_id uuid;
begin
  select id into owner_role_id
  from public.roles
  where key = 'owner';

  if owner_role_id is not null then
    insert into public.profile_members(profile_id, user_id, role_id, status)
    values (new.id, new.owner_id, owner_role_id, 'active')
    on conflict (profile_id, user_id) do nothing;
  end if;

  return new;
end;
$$;

create trigger profiles_add_owner_member
after insert on public.profiles
for each row execute function private.add_profile_owner_member();

create or replace function public.claim_next_ai_job()
returns public.ai_jobs
language plpgsql
security invoker
set search_path = public
as $$
declare
  claimed public.ai_jobs;
begin
  select *
  into claimed
  from public.ai_jobs
  where status = 'pending'
    and attempts < max_attempts
  order by created_at asc
  for update skip locked
  limit 1;

  if not found then
    return null;
  end if;

  update public.ai_jobs
  set status = 'processing',
      attempts = attempts + 1,
      started_at = now(),
      updated_at = now(),
      error_message = null
  where id = claimed.id
  returning * into claimed;

  return claimed;
end;
$$;

create or replace function public.recover_zombie_ai_jobs(p_timeout interval default interval '15 minutes')
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare
  recovered integer := 0;
begin
  update public.ai_jobs
  set status = case when attempts < max_attempts then 'pending' else 'failed' end,
      error_message = case when attempts < max_attempts then 'Recovered zombie job' else 'Job failed after zombie timeout' end,
      completed_at = case when attempts < max_attempts then null else now() end,
      updated_at = now()
  where status = 'processing'
    and started_at < now() - p_timeout;

  get diagnostics recovered = row_count;

  if recovered > 0 then
    insert into public.health_logs(source, status, message, metadata)
    values ('job_runner', 'warning', 'Zombie jobs recovered', jsonb_build_object('count', recovered));
  end if;

  return recovered;
end;
$$;

revoke execute on function public.claim_next_ai_job() from anon, authenticated;
grant execute on function public.claim_next_ai_job() to service_role;
revoke execute on function public.recover_zombie_ai_jobs(interval) from anon, authenticated;
grant execute on function public.recover_zombie_ai_jobs(interval) to service_role;

alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.profiles enable row level security;
alter table public.profile_members enable row level security;
alter table public.profile_tags enable row level security;
alter table public.content_items enable row level security;
alter table public.media_assets enable row level security;
alter table public.library_items enable row level security;
alter table public.manual_posting_queue enable row level security;
alter table public.ai_jobs enable row level security;
alter table public.audit_logs enable row level security;
alter table public.health_logs enable row level security;
alter table public.agent_runs enable row level security;
alter table public.reports enable row level security;

grant usage on schema public to authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to service_role;

create policy "roles admin read" on public.roles for select using (private.user_has_permission(auth.uid(), 'admin.access'));
create policy "roles admin write" on public.roles for all using (private.user_has_permission(auth.uid(), 'admin.manage_roles')) with check (private.user_has_permission(auth.uid(), 'admin.manage_roles'));
create policy "permissions admin read" on public.permissions for select using (private.user_has_permission(auth.uid(), 'admin.access'));
create policy "permissions admin write" on public.permissions for all using (private.user_has_permission(auth.uid(), 'admin.manage_permissions')) with check (private.user_has_permission(auth.uid(), 'admin.manage_permissions'));
create policy "role_permissions admin write" on public.role_permissions for all using (private.user_has_permission(auth.uid(), 'admin.manage_permissions')) with check (private.user_has_permission(auth.uid(), 'admin.manage_permissions'));

create policy "profiles member read" on public.profiles for select using (owner_id = auth.uid() or private.is_profile_member(id, auth.uid()));
create policy "profiles create" on public.profiles for insert with check (owner_id = auth.uid() and private.user_has_permission(auth.uid(), 'profiles.create'));
create policy "profiles edit" on public.profiles for update using (private.is_profile_member(id, auth.uid()) and private.user_has_permission(auth.uid(), 'profiles.edit')) with check (private.is_profile_member(id, auth.uid()) and private.user_has_permission(auth.uid(), 'profiles.edit'));
create policy "profiles delete" on public.profiles for delete using (owner_id = auth.uid() and private.user_has_permission(auth.uid(), 'profiles.delete'));

create policy "profile_members member read" on public.profile_members for select using (private.is_profile_member(profile_id, auth.uid()));
create policy "profile_members admin write" on public.profile_members for all using (private.user_has_permission(auth.uid(), 'admin.manage_roles')) with check (private.user_has_permission(auth.uid(), 'admin.manage_roles'));

create policy "profile_tags member read" on public.profile_tags for select using (private.is_profile_member(profile_id, auth.uid()));
create policy "profile_tags profile edit" on public.profile_tags for all using (private.is_profile_member(profile_id, auth.uid()) and private.user_has_permission(auth.uid(), 'profiles.edit')) with check (private.is_profile_member(profile_id, auth.uid()) and private.user_has_permission(auth.uid(), 'profiles.edit'));

create policy "content member read" on public.content_items for select using (private.is_profile_member(profile_id, auth.uid()) and private.user_has_permission(auth.uid(), 'content.view'));
create policy "content create" on public.content_items for insert with check (created_by = auth.uid() and private.is_profile_member(profile_id, auth.uid()) and private.user_has_permission(auth.uid(), 'content.create'));
create policy "content edit" on public.content_items for update using (private.is_profile_member(profile_id, auth.uid()) and private.user_has_permission(auth.uid(), 'content.edit')) with check (private.is_profile_member(profile_id, auth.uid()) and private.user_has_permission(auth.uid(), 'content.edit'));
create policy "content delete" on public.content_items for delete using (private.is_profile_member(profile_id, auth.uid()) and private.user_has_permission(auth.uid(), 'content.delete'));

create policy "media member read" on public.media_assets for select using ((profile_id is null and user_id = auth.uid()) or private.is_profile_member(profile_id, auth.uid()));
create policy "media create own" on public.media_assets for insert with check (user_id = auth.uid() and (profile_id is null or private.is_profile_member(profile_id, auth.uid())));

create policy "library member read" on public.library_items for select using (private.is_profile_member(profile_id, auth.uid()) and private.user_has_permission(auth.uid(), 'library.view'));
create policy "library create" on public.library_items for insert with check (created_by = auth.uid() and private.is_profile_member(profile_id, auth.uid()) and private.user_has_permission(auth.uid(), 'library.create'));
create policy "library edit" on public.library_items for update using (private.is_profile_member(profile_id, auth.uid()) and (private.user_has_permission(auth.uid(), 'library.restore') or private.user_has_permission(auth.uid(), 'library.delete'))) with check (private.is_profile_member(profile_id, auth.uid()));

create policy "posting member read" on public.manual_posting_queue for select using (private.is_profile_member(profile_id, auth.uid()) and private.user_has_permission(auth.uid(), 'posting.view'));
create policy "posting manage" on public.manual_posting_queue for all using (private.is_profile_member(profile_id, auth.uid()) and private.user_has_permission(auth.uid(), 'posting.manage')) with check (private.is_profile_member(profile_id, auth.uid()) and private.user_has_permission(auth.uid(), 'posting.manage'));

create policy "ai_jobs own or profile read" on public.ai_jobs for select using (user_id = auth.uid() or (profile_id is not null and private.is_profile_member(profile_id, auth.uid()) and private.user_has_permission(auth.uid(), 'ai_jobs.view_own')) or private.user_has_permission(auth.uid(), 'ai_jobs.manage_all'));
create policy "ai_jobs create own" on public.ai_jobs for insert with check (user_id = auth.uid() and private.user_has_permission(auth.uid(), 'ai_jobs.create'));
create policy "ai_jobs admin update" on public.ai_jobs for update using (private.user_has_permission(auth.uid(), 'ai_jobs.manage_all')) with check (private.user_has_permission(auth.uid(), 'ai_jobs.manage_all'));

create policy "audit admin read" on public.audit_logs for select using (private.user_has_permission(auth.uid(), 'admin.view_logs'));
create policy "audit user insert" on public.audit_logs for insert with check (user_id = auth.uid() or private.user_has_permission(auth.uid(), 'admin.view_logs'));
create policy "health admin read" on public.health_logs for select using (private.user_has_permission(auth.uid(), 'admin.system_health'));
create policy "agent_runs admin read" on public.agent_runs for select using (private.user_has_permission(auth.uid(), 'admin.view_logs'));
create policy "reports profile read" on public.reports for select using (private.is_profile_member(profile_id, auth.uid()) and private.user_has_permission(auth.uid(), 'reports.view'));

insert into public.roles(key, name, description)
values
  ('owner', 'Owner', 'Controle total do perfil'),
  ('admin', 'Admin', 'Administração técnica e governança'),
  ('manager', 'Manager', 'Gestão operacional'),
  ('creator', 'Creator', 'Criação de conteúdo'),
  ('editor', 'Editor', 'Edição e aprovação'),
  ('viewer', 'Viewer', 'Leitura')
on conflict (key) do nothing;

insert into public.permissions(key, module, description)
values
  ('profiles.view', 'profiles', 'Ver perfis'),
  ('profiles.create', 'profiles', 'Criar perfis'),
  ('profiles.edit', 'profiles', 'Editar perfis'),
  ('profiles.delete', 'profiles', 'Excluir perfis'),
  ('content.view', 'content', 'Ver conteúdos'),
  ('content.create', 'content', 'Criar conteúdos'),
  ('content.edit', 'content', 'Editar conteúdos'),
  ('content.approve', 'content', 'Aprovar conteúdos'),
  ('content.delete', 'content', 'Excluir conteúdos'),
  ('library.view', 'library', 'Ver biblioteca'),
  ('library.create', 'library', 'Criar itens de biblioteca'),
  ('library.restore', 'library', 'Restaurar itens'),
  ('library.delete', 'library', 'Excluir itens'),
  ('posting.view', 'posting', 'Ver postagem manual'),
  ('posting.manage', 'posting', 'Gerenciar postagem manual'),
  ('reports.view', 'reports', 'Ver relatórios'),
  ('reports.global_view', 'reports', 'Ver relatórios globais'),
  ('ai_jobs.create', 'jobs', 'Criar jobs'),
  ('ai_jobs.view_own', 'jobs', 'Ver próprios jobs'),
  ('ai_jobs.manage_all', 'jobs', 'Gerenciar todos os jobs'),
  ('admin.access', 'admin', 'Acessar sistema'),
  ('admin.manage_roles', 'admin', 'Gerenciar cargos'),
  ('admin.manage_permissions', 'admin', 'Gerenciar permissões'),
  ('admin.view_logs', 'admin', 'Ver logs'),
  ('admin.system_health', 'admin', 'Ver saúde do sistema')
on conflict (key) do nothing;

insert into public.role_permissions(role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.key = 'owner'
on conflict do nothing;

insert into public.role_permissions(role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.key in (
  'profiles.view', 'profiles.create', 'profiles.edit',
  'content.view', 'content.create', 'content.edit', 'content.approve',
  'library.view', 'library.create', 'library.restore',
  'posting.view', 'posting.manage',
  'reports.view',
  'ai_jobs.create', 'ai_jobs.view_own',
  'admin.access', 'admin.view_logs', 'admin.system_health'
)
where r.key in ('admin', 'manager')
on conflict do nothing;

insert into public.role_permissions(role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.key in (
  'profiles.view',
  'content.view', 'content.create', 'content.edit',
  'library.view', 'library.create',
  'posting.view',
  'ai_jobs.create', 'ai_jobs.view_own'
)
where r.key in ('creator', 'editor')
on conflict do nothing;

insert into public.role_permissions(role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.key in ('profiles.view', 'content.view', 'library.view', 'posting.view', 'reports.view', 'ai_jobs.view_own')
where r.key = 'viewer'
on conflict do nothing;
