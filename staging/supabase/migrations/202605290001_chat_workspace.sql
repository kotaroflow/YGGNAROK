-- Chat workspace: projetos de conversa, threads e mensagens (separado de public.profiles)

create table if not exists public.chat_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  path_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.chat_projects(id) on delete set null,
  title text not null default 'Nova conversa',
  last_message_preview text,
  model_id text,
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('system', 'user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_projects_user_updated_idx
  on public.chat_projects (user_id, updated_at desc);

create index if not exists chat_conversations_user_updated_idx
  on public.chat_conversations (user_id, updated_at desc);

create index if not exists chat_conversations_project_idx
  on public.chat_conversations (project_id);

create index if not exists chat_messages_conversation_created_idx
  on public.chat_messages (conversation_id, created_at asc);

alter table public.chat_projects enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;

insert into public.permissions(key, module, description)
values
  ('chat.view', 'chat', 'Ver chat e conversas'),
  ('chat.create', 'chat', 'Criar conversas e projetos de chat'),
  ('chat.edit', 'chat', 'Editar conversas e projetos de chat'),
  ('chat.delete', 'chat', 'Excluir conversas e projetos de chat')
on conflict (key) do nothing;

insert into public.role_permissions(role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.key in ('owner', 'admin', 'manager', 'creator', 'editor')
  and p.key in ('chat.view', 'chat.create', 'chat.edit', 'chat.delete')
on conflict do nothing;

create policy "chat_projects owner read"
  on public.chat_projects for select
  using (user_id = auth.uid() and private.user_has_permission(auth.uid(), 'chat.view'));

create policy "chat_projects owner write"
  on public.chat_projects for all
  using (user_id = auth.uid() and private.user_has_permission(auth.uid(), 'chat.edit'))
  with check (user_id = auth.uid() and private.user_has_permission(auth.uid(), 'chat.create'));

create policy "chat_conversations owner read"
  on public.chat_conversations for select
  using (user_id = auth.uid() and private.user_has_permission(auth.uid(), 'chat.view'));

create policy "chat_conversations owner write"
  on public.chat_conversations for all
  using (user_id = auth.uid() and private.user_has_permission(auth.uid(), 'chat.edit'))
  with check (user_id = auth.uid() and private.user_has_permission(auth.uid(), 'chat.create'));

create policy "chat_messages owner read"
  on public.chat_messages for select
  using (
    user_id = auth.uid()
    and private.user_has_permission(auth.uid(), 'chat.view')
    and exists (
      select 1 from public.chat_conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );

create policy "chat_messages owner write"
  on public.chat_messages for all
  using (
    user_id = auth.uid()
    and private.user_has_permission(auth.uid(), 'chat.edit')
    and exists (
      select 1 from public.chat_conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  )
  with check (
    user_id = auth.uid()
    and private.user_has_permission(auth.uid(), 'chat.create')
    and exists (
      select 1 from public.chat_conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );
