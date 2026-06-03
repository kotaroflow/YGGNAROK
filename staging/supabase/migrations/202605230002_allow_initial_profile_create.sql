drop policy if exists "profiles create" on public.profiles;

create policy "profiles create"
on public.profiles
for insert
with check (owner_id = auth.uid());
