create or replace function public.generate_invite_code()
returns text
language plpgsql
as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text := '';
  i integer;
  max_attempts integer := 10;
  attempt integer := 0;
begin
  loop
    code := '';
    for i in 1..6 loop
      code := code || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    end loop;

    -- Check uniqueness
    if not exists (select 1 from public.groups where invite_code = code) then
      return code;
    end if;

    attempt := attempt + 1;
    if attempt >= max_attempts then
      raise exception 'Could not generate unique invite code after % attempts', max_attempts;
    end if;
  end loop;
end;
$$;
