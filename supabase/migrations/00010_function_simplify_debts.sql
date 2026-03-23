create or replace function public.simplify_debts(p_group_id uuid)
returns table(from_user uuid, to_user uuid, amount numeric)
language plpgsql
security definer set search_path = public
as $$
declare
  balances jsonb := '{}';
  member_id uuid;
  net_balance numeric;
  creditors jsonb := '[]';
  debtors jsonb := '[]';
  ci integer := 0;
  di integer := 0;
  creditor jsonb;
  debtor jsonb;
  transfer numeric;
  creditor_amount numeric;
  debtor_amount numeric;
begin
  -- Verify caller is a member
  if not exists (
    select 1 from public.group_members
    where group_id = p_group_id and user_id = auth.uid()
  ) then
    raise exception 'Not a member of this group';
  end if;

  -- Calculate net balance per person
  -- Positive = owed money, negative = owes money
  for member_id in
    select user_id from public.group_members where group_id = p_group_id
  loop
    net_balance := 0;

    -- Amount this person paid (credit)
    select coalesce(sum(amount), 0) into net_balance
    from public.expenses
    where group_id = p_group_id and paid_by = member_id;

    -- Subtract what they owe (debit)
    net_balance := net_balance - (
      select coalesce(sum(es.amount), 0)
      from public.expense_shares es
      join public.expenses e on e.id = es.expense_id
      where e.group_id = p_group_id and es.user_id = member_id
    );

    -- Account for settlements
    net_balance := net_balance + (
      select coalesce(sum(amount), 0)
      from public.settlements
      where group_id = p_group_id and to_user = member_id
    );

    net_balance := net_balance - (
      select coalesce(sum(amount), 0)
      from public.settlements
      where group_id = p_group_id and from_user = member_id
    );

    balances := jsonb_set(balances, array[member_id::text], to_jsonb(net_balance));
  end loop;

  -- Build creditors and debtors arrays
  select jsonb_agg(jsonb_build_object('id', key, 'amount', value::numeric) order by value::numeric desc)
  into creditors
  from jsonb_each(balances)
  where value::numeric > 0.005;

  select jsonb_agg(jsonb_build_object('id', key, 'amount', abs(value::numeric)) order by abs(value::numeric) desc)
  into debtors
  from jsonb_each(balances)
  where value::numeric < -0.005;

  if creditors is null or debtors is null then
    return;
  end if;

  ci := 0;
  di := 0;

  while ci < jsonb_array_length(creditors) and di < jsonb_array_length(debtors) loop
    creditor := creditors->ci;
    debtor := debtors->di;

    creditor_amount := (creditor->>'amount')::numeric;
    debtor_amount := (debtor->>'amount')::numeric;

    transfer := least(creditor_amount, debtor_amount);

    if transfer > 0.005 then
      from_user := (debtor->>'id')::uuid;
      to_user := (creditor->>'id')::uuid;
      amount := round(transfer * 100) / 100;
      return next;
    end if;

    creditor_amount := creditor_amount - transfer;
    debtor_amount := debtor_amount - transfer;

    creditors := jsonb_set(creditors, array[ci::text, 'amount'], to_jsonb(creditor_amount));
    debtors := jsonb_set(debtors, array[di::text, 'amount'], to_jsonb(debtor_amount));

    if creditor_amount < 0.005 then ci := ci + 1; end if;
    if debtor_amount < 0.005 then di := di + 1; end if;
  end loop;
end;
$$;
