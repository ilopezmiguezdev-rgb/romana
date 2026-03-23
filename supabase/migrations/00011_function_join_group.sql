create or replace function public.join_group(p_invite_code text)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  target_group_id uuid;
begin
  -- Find group by invite code
  select id into target_group_id
  from public.groups
  where invite_code = upper(p_invite_code);

  if target_group_id is null then
    raise exception 'Invalid invite code';
  end if;

  -- Check if already a member
  if exists (
    select 1 from public.group_members
    where group_id = target_group_id and user_id = auth.uid()
  ) then
    raise exception 'Already a member of this group';
  end if;

  insert into public.group_members (group_id, user_id, role)
  values (target_group_id, auth.uid(), 'member');

  return target_group_id;
end;
$$;
