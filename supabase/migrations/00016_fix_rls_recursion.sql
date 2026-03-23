-- Fix: group_members SELECT policy was self-referential, causing infinite recursion.
-- Solution: security definer function to check membership without triggering RLS.

create or replace function public.is_member_of(p_group_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.group_members
    where group_id = p_group_id
      and user_id = auth.uid()
  );
$$;

-- Drop and recreate all policies that referenced group_members to use the helper function

drop policy if exists "Members can view group members" on public.group_members;
create policy "Members can view group members" on public.group_members
  for select using (public.is_member_of(group_id));

drop policy if exists "Members can view their groups" on public.groups;
create policy "Members can view their groups" on public.groups
  for select using (public.is_member_of(id));

drop policy if exists "Members can view group expenses" on public.expenses;
create policy "Members can view group expenses" on public.expenses
  for select using (public.is_member_of(group_id));

drop policy if exists "Members can create expenses" on public.expenses;
create policy "Members can create expenses" on public.expenses
  for insert with check (public.is_member_of(group_id));

drop policy if exists "Members can view expense shares" on public.expense_shares;
create policy "Members can view expense shares" on public.expense_shares
  for select using (
    exists (
      select 1 from public.expenses
      where expenses.id = expense_shares.expense_id
        and public.is_member_of(expenses.group_id)
    )
  );

drop policy if exists "Members can insert expense shares" on public.expense_shares;
create policy "Members can insert expense shares" on public.expense_shares
  for insert with check (
    exists (
      select 1 from public.expenses
      where expenses.id = expense_shares.expense_id
        and public.is_member_of(expenses.group_id)
    )
  );

drop policy if exists "Members can view settlements" on public.settlements;
create policy "Members can view settlements" on public.settlements
  for select using (public.is_member_of(group_id));

drop policy if exists "Members can create settlements" on public.settlements;
create policy "Members can create settlements" on public.settlements
  for insert with check (
    auth.uid() = from_user
    and public.is_member_of(group_id)
  );

drop policy if exists "Members can view group events" on public.group_events;
create policy "Members can view group events" on public.group_events
  for select using (public.is_member_of(group_id));
