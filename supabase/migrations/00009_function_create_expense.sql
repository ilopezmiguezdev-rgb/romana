create or replace function public.create_expense(
  p_group_id uuid,
  p_paid_by uuid,
  p_description text,
  p_amount numeric,
  p_split_type text,
  p_participant_ids uuid[],
  p_percentages numeric[],
  p_item_amounts numeric[]
)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  new_expense_id uuid;
  n integer;
  i integer;
  base_share numeric;
  remainder numeric;
  share_amount numeric;
begin
  -- Verify caller is a member of the group
  if not exists (
    select 1 from public.group_members
    where group_id = p_group_id and user_id = auth.uid()
  ) then
    raise exception 'Not a member of this group';
  end if;

  -- Verify paid_by is also a member
  if not exists (
    select 1 from public.group_members
    where group_id = p_group_id and user_id = p_paid_by
  ) then
    raise exception 'paid_by user is not a member of this group';
  end if;

  insert into public.expenses (group_id, paid_by, description, amount, split_type)
  values (p_group_id, p_paid_by, p_description, p_amount, p_split_type)
  returning id into new_expense_id;

  n := array_length(p_participant_ids, 1);

  if n is null or n = 0 then
    raise exception 'participant_ids must not be empty';
  end if;

  if p_split_type = 'even' then
    base_share := floor(p_amount * 100 / n) / 100;
    remainder := round((p_amount - base_share * n) * 100) / 100;

    for i in 1..n loop
      if i = n then
        share_amount := base_share + remainder;
      else
        share_amount := base_share;
      end if;

      insert into public.expense_shares (expense_id, user_id, amount)
      values (new_expense_id, p_participant_ids[i], share_amount);
    end loop;

  elsif p_split_type = 'percent' then
    if abs(( select sum(v) from unnest(p_percentages) v ) - 100) > 0.01 then
      raise exception 'Percentages must sum to 100';
    end if;
    for i in 1..n loop
      share_amount := floor(p_amount * p_percentages[i] / 100 * 100) / 100;
      insert into public.expense_shares (expense_id, user_id, amount)
      values (new_expense_id, p_participant_ids[i], share_amount);
    end loop;

  elsif p_split_type = 'item' then
    for i in 1..n loop
      insert into public.expense_shares (expense_id, user_id, amount)
      values (new_expense_id, p_participant_ids[i], p_item_amounts[i]);
    end loop;
  end if;

  return new_expense_id;
end;
$$;
