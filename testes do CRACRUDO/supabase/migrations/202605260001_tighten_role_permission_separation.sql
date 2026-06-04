create or replace function private.user_has_permission(p_user_id uuid, p_permission_key text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
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

with first_user as (
  select id
  from auth.users
  order by created_at asc
  limit 1
), viewer_role as (
  select id
  from public.roles
  where key = 'viewer'
)
update public.profile_members pm
set role_id = viewer_role.id,
    updated_at = now()
from viewer_role
where pm.user_id not in (select id from first_user);

with first_user as (
  select id
  from auth.users
  order by created_at asc
  limit 1
), owner_role as (
  select id
  from public.roles
  where key = 'owner'
)
update public.profile_members pm
set role_id = owner_role.id,
    status = 'active',
    updated_at = now()
from owner_role
where pm.user_id in (select id from first_user);
