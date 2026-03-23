-- Profiles: users can read all profiles (needed to show member names), update own
create policy "Profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Groups: only members can see their groups
create policy "Members can view their groups" on public.groups
  for select using (
    exists (
      select 1 from public.group_members
      where group_members.group_id = groups.id
        and group_members.user_id = auth.uid()
    )
  );

create policy "Authenticated users can create groups" on public.groups
  for insert with check (auth.uid() = created_by);

-- Group members: members can view members of their groups
create policy "Members can view group members" on public.group_members
  for select using (
    exists (
      select 1 from public.group_members gm
      where gm.group_id = group_members.group_id
        and gm.user_id = auth.uid()
    )
  );

create policy "Members can join groups" on public.group_members
  for insert with check (auth.uid() = user_id);

create policy "Members can leave groups" on public.group_members
  for delete using (auth.uid() = user_id);

-- Expenses: members of the group can view expenses
create policy "Members can view group expenses" on public.expenses
  for select using (
    exists (
      select 1 from public.group_members
      where group_members.group_id = expenses.group_id
        and group_members.user_id = auth.uid()
    )
  );

create policy "Members can create expenses" on public.expenses
  for insert with check (
    exists (
      select 1 from public.group_members
      where group_members.group_id = expenses.group_id
        and group_members.user_id = auth.uid()
    )
  );

-- Expense shares: same as expenses
create policy "Members can view expense shares" on public.expense_shares
  for select using (
    exists (
      select 1 from public.expenses
      join public.group_members on group_members.group_id = expenses.group_id
      where expenses.id = expense_shares.expense_id
        and group_members.user_id = auth.uid()
    )
  );

create policy "Members can insert expense shares" on public.expense_shares
  for insert with check (
    exists (
      select 1 from public.expenses
      join public.group_members on group_members.group_id = expenses.group_id
      where expenses.id = expense_shares.expense_id
        and group_members.user_id = auth.uid()
    )
  );

-- Settlements: members of the group can view settlements
create policy "Members can view settlements" on public.settlements
  for select using (
    exists (
      select 1 from public.group_members
      where group_members.group_id = settlements.group_id
        and group_members.user_id = auth.uid()
    )
  );

create policy "Members can create settlements" on public.settlements
  for insert with check (
    auth.uid() = from_user
    and exists (
      select 1 from public.group_members
      where group_members.group_id = settlements.group_id
        and group_members.user_id = auth.uid()
    )
  );

-- Group events: members can view events
create policy "Members can view group events" on public.group_events
  for select using (
    exists (
      select 1 from public.group_members
      where group_members.group_id = group_events.group_id
        and group_members.user_id = auth.uid()
    )
  );

create policy "Members can insert group events" on public.group_events
  for insert with check (
    exists (
      select 1 from public.group_members
      where group_members.group_id = group_events.group_id
        and group_members.user_id = auth.uid()
    )
  );
