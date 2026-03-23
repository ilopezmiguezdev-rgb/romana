-- Trigger function: log expense creation
create or replace function public.log_expense_created()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.group_events (group_id, actor_id, event_type, payload)
  values (
    new.group_id,
    new.paid_by,
    'expense_created',
    jsonb_build_object(
      'expense_id', new.id,
      'description', new.description,
      'amount', new.amount
    )
  );
  return new;
end;
$$;

create trigger on_expense_created
  after insert on public.expenses
  for each row execute procedure public.log_expense_created();

-- Trigger function: log settlement creation
create or replace function public.log_settlement_created()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.group_events (group_id, actor_id, event_type, payload)
  values (
    new.group_id,
    new.from_user,
    'settlement_created',
    jsonb_build_object(
      'settlement_id', new.id,
      'from_user', new.from_user,
      'to_user', new.to_user,
      'amount', new.amount
    )
  );
  return new;
end;
$$;

create trigger on_settlement_created
  after insert on public.settlements
  for each row execute procedure public.log_settlement_created();

-- Trigger function: log member joining
create or replace function public.log_member_joined()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.group_events (group_id, actor_id, event_type, payload)
  values (
    new.group_id,
    new.user_id,
    'member_joined',
    jsonb_build_object('user_id', new.user_id, 'role', new.role)
  );
  return new;
end;
$$;

create trigger on_member_joined
  after insert on public.group_members
  for each row execute procedure public.log_member_joined();
