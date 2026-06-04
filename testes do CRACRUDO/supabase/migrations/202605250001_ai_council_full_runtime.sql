create extension if not exists vector with schema extensions;

create table if not exists public.ai_council_agents (
  key text primary key,
  name text not null,
  role text not null,
  status text not null default 'active' check (status in ('active', 'paused', 'disabled', 'pending_enable')),
  risk_level text not null default 'low' check (risk_level in ('low', 'medium', 'high')),
  provider_preference jsonb not null default '{}'::jsonb,
  config jsonb not null default '{}'::jsonb,
  paused_reason text,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_provider_status (
  provider text primary key,
  status text not null default 'unknown' check (status in ('online', 'offline', 'degraded', 'disabled', 'unknown')),
  last_checked_at timestamptz,
  latency_ms integer,
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_council_decisions (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.ai_jobs(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  profile_id uuid references public.profiles(id) on delete set null,
  decision_type text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'executed', 'blocked', 'archived')),
  risk text not null default 'low' check (risk in ('low', 'medium', 'high')),
  authority text not null default 'council_auto',
  summary text not null default '',
  payload jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_memory_candidates (
  id uuid primary key default gen_random_uuid(),
  library_item_id uuid references public.library_items(id) on delete set null,
  job_id uuid references public.ai_jobs(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  profile_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  origin text not null default 'ai_council',
  agent_key text not null default 'memory',
  model text,
  scope text not null default 'profile',
  risk text not null default 'low' check (risk in ('low', 'medium', 'high')),
  confidence numeric(4,3) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'archived')),
  justification text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_vector_memory (
  id uuid primary key default gen_random_uuid(),
  memory_candidate_id uuid references public.ai_memory_candidates(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  embedding extensions.vector(1536),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_cost_ledger (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.ai_jobs(id) on delete set null,
  provider text not null,
  model text,
  estimated_cost numeric(12,6) not null default 0,
  currency text not null default 'USD',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_automations (
  key text primary key,
  name text not null,
  status text not null default 'active' check (status in ('active', 'paused', 'disabled')),
  interval_ms integer not null default 5000,
  last_run_at timestamptz,
  next_run_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_council_decisions_status_risk_idx on public.ai_council_decisions(status, risk, created_at desc);
create index if not exists ai_council_decisions_job_idx on public.ai_council_decisions(job_id);
create index if not exists ai_memory_candidates_status_risk_idx on public.ai_memory_candidates(status, risk, created_at desc);
create index if not exists ai_memory_candidates_profile_idx on public.ai_memory_candidates(profile_id, status);
create index if not exists ai_cost_ledger_job_idx on public.ai_cost_ledger(job_id);

drop trigger if exists ai_council_agents_touch_updated_at on public.ai_council_agents;
create trigger ai_council_agents_touch_updated_at before update on public.ai_council_agents for each row execute function public.touch_updated_at();
drop trigger if exists ai_provider_status_touch_updated_at on public.ai_provider_status;
create trigger ai_provider_status_touch_updated_at before update on public.ai_provider_status for each row execute function public.touch_updated_at();
drop trigger if exists ai_council_decisions_touch_updated_at on public.ai_council_decisions;
create trigger ai_council_decisions_touch_updated_at before update on public.ai_council_decisions for each row execute function public.touch_updated_at();
drop trigger if exists ai_memory_candidates_touch_updated_at on public.ai_memory_candidates;
create trigger ai_memory_candidates_touch_updated_at before update on public.ai_memory_candidates for each row execute function public.touch_updated_at();
drop trigger if exists ai_automations_touch_updated_at on public.ai_automations;
create trigger ai_automations_touch_updated_at before update on public.ai_automations for each row execute function public.touch_updated_at();

alter table public.ai_council_agents enable row level security;
alter table public.ai_provider_status enable row level security;
alter table public.ai_council_decisions enable row level security;
alter table public.ai_memory_candidates enable row level security;
alter table public.ai_vector_memory enable row level security;
alter table public.ai_cost_ledger enable row level security;
alter table public.ai_automations enable row level security;

grant select, insert, update, delete on public.ai_council_agents to authenticated, service_role;
grant select, insert, update, delete on public.ai_provider_status to authenticated, service_role;
grant select, insert, update, delete on public.ai_council_decisions to authenticated, service_role;
grant select, insert, update, delete on public.ai_memory_candidates to authenticated, service_role;
grant select, insert, update, delete on public.ai_vector_memory to authenticated, service_role;
grant select, insert, update, delete on public.ai_cost_ledger to authenticated, service_role;
grant select, insert, update, delete on public.ai_automations to authenticated, service_role;

drop policy if exists "ai council agents admin read" on public.ai_council_agents;
create policy "ai council agents admin read" on public.ai_council_agents for select using (private.user_has_permission(auth.uid(), 'admin.access'));
drop policy if exists "ai council agents admin write" on public.ai_council_agents;
create policy "ai council agents admin write" on public.ai_council_agents for all using (private.user_has_permission(auth.uid(), 'admin.access')) with check (private.user_has_permission(auth.uid(), 'admin.access'));

drop policy if exists "ai provider status admin read" on public.ai_provider_status;
create policy "ai provider status admin read" on public.ai_provider_status for select using (private.user_has_permission(auth.uid(), 'admin.system_health') or private.user_has_permission(auth.uid(), 'admin.access'));
drop policy if exists "ai provider status admin write" on public.ai_provider_status;
create policy "ai provider status admin write" on public.ai_provider_status for all using (private.user_has_permission(auth.uid(), 'admin.access')) with check (private.user_has_permission(auth.uid(), 'admin.access'));

drop policy if exists "ai council decisions admin read" on public.ai_council_decisions;
create policy "ai council decisions admin read" on public.ai_council_decisions for select using (private.user_has_permission(auth.uid(), 'admin.access') or user_id = auth.uid());
drop policy if exists "ai council decisions admin write" on public.ai_council_decisions;
create policy "ai council decisions admin write" on public.ai_council_decisions for all using (private.user_has_permission(auth.uid(), 'admin.access')) with check (private.user_has_permission(auth.uid(), 'admin.access'));

drop policy if exists "ai memory candidates admin read" on public.ai_memory_candidates;
create policy "ai memory candidates admin read" on public.ai_memory_candidates for select using (private.user_has_permission(auth.uid(), 'admin.access') or user_id = auth.uid() or private.is_profile_member(profile_id, auth.uid()));
drop policy if exists "ai memory candidates admin write" on public.ai_memory_candidates;
create policy "ai memory candidates admin write" on public.ai_memory_candidates for all using (private.user_has_permission(auth.uid(), 'admin.access')) with check (private.user_has_permission(auth.uid(), 'admin.access'));

drop policy if exists "ai vector memory admin read" on public.ai_vector_memory;
create policy "ai vector memory admin read" on public.ai_vector_memory for select using (private.user_has_permission(auth.uid(), 'admin.access') or private.is_profile_member(profile_id, auth.uid()));
drop policy if exists "ai vector memory admin write" on public.ai_vector_memory;
create policy "ai vector memory admin write" on public.ai_vector_memory for all using (private.user_has_permission(auth.uid(), 'admin.access')) with check (private.user_has_permission(auth.uid(), 'admin.access'));

drop policy if exists "ai cost ledger admin read" on public.ai_cost_ledger;
create policy "ai cost ledger admin read" on public.ai_cost_ledger for select using (private.user_has_permission(auth.uid(), 'admin.access'));
drop policy if exists "ai cost ledger admin write" on public.ai_cost_ledger;
create policy "ai cost ledger admin write" on public.ai_cost_ledger for all using (private.user_has_permission(auth.uid(), 'admin.access')) with check (private.user_has_permission(auth.uid(), 'admin.access'));

drop policy if exists "ai automations admin read" on public.ai_automations;
create policy "ai automations admin read" on public.ai_automations for select using (private.user_has_permission(auth.uid(), 'admin.access'));
drop policy if exists "ai automations admin write" on public.ai_automations;
create policy "ai automations admin write" on public.ai_automations for all using (private.user_has_permission(auth.uid(), 'admin.access')) with check (private.user_has_permission(auth.uid(), 'admin.access'));

insert into public.permissions(key, module, description)
values
  ('ai_council.manage', 'ai_council', 'Gerenciar Conselho de IAs'),
  ('ai_council.approve', 'ai_council', 'Aprovar decisoes e memorias do Conselho'),
  ('ai_council.kill_switch', 'ai_council', 'Acionar kill switch do Conselho')
on conflict (key) do nothing;

insert into public.ai_council_agents(key, name, role, risk_level, provider_preference, config)
values
  ('creator', 'Creator Agent', 'creator', 'low', '{"primary":"ollama","fallback":"openrouter"}', '{"enabled":true}'),
  ('critic', 'Critic Agent', 'critic', 'low', '{"primary":"ollama","fallback":"openrouter"}', '{"enabled":true}'),
  ('strategy', 'Strategy Agent', 'strategy', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true}'),
  ('consistency', 'Consistency Agent', 'consistency', 'medium', '{"primary":"ollama","fallback":"openrouter"}', '{"enabled":true}'),
  ('safety', 'Safety/Governance Agent', 'safety', 'high', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true}'),
  ('memory', 'Memory Agent', 'memory', 'medium', '{"primary":"ollama","fallback":"openrouter"}', '{"enabled":true}'),
  ('supervisor', 'Supervisor Agent', 'supervisor', 'medium', '{"primary":"openrouter","premium":"openai"}', '{"enabled":true}'),
  ('momonga', 'Momonga/Admin Override', 'admin_override', 'high', '{"primary":"human"}', '{"enabled":true,"manual_required_for_high_risk":true}')
on conflict (key) do update set
  name = excluded.name,
  role = excluded.role,
  risk_level = excluded.risk_level,
  provider_preference = excluded.provider_preference,
  config = public.ai_council_agents.config || excluded.config,
  updated_at = now();

insert into public.ai_provider_status(provider, status, metadata)
values
  ('ollama', 'unknown', '{"kind":"local_text"}'),
  ('openai', 'unknown', '{"kind":"premium_text"}'),
  ('openrouter', 'unknown', '{"kind":"fallback_text"}'),
  ('comfyui', 'unknown', '{"kind":"image_generation"}')
on conflict (provider) do nothing;

insert into public.ai_automations(key, name, interval_ms, metadata)
values
  ('worker_loop', 'AI Worker Loop', 5000, '{"source":"worker"}'),
  ('provider_health', 'Provider Health Check', 60000, '{"source":"worker"}'),
  ('memory_review', 'Memory Review Queue', 300000, '{"source":"momonga"}')
on conflict (key) do nothing;
