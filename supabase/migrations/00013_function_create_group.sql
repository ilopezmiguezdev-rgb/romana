create or replace function public.create_group(group_name text)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  new_group_id uuid;
  code text;
begin
  code := public.generate_invite_code();

  insert into public.groups (name, invite_code, created_by)
  values (group_name, code, auth.uid())
  returning id into new_group_id;

  insert into public.group_members (group_id, user_id, role)
  values (new_group_id, auth.uid(), 'admin');

  return new_group_id;
end;
$$;
