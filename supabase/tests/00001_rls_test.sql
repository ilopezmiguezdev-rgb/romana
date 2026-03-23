begin;
select plan(4);

-- Setup: two users in different groups
insert into auth.users (id, email) values
  ('a0000000-0000-0000-0000-000000000001', 'alice@test.com'),
  ('a0000000-0000-0000-0000-000000000002', 'bob@test.com');

insert into public.groups (id, name, invite_code, created_by) values
  ('b0000000-0000-0000-0000-000000000001', 'Alice Group', 'ALICE1',
   'a0000000-0000-0000-0000-000000000001'),
  ('c0000000-0000-0000-0000-000000000002', 'Bob Group', 'BOBS01',
   'a0000000-0000-0000-0000-000000000002');

insert into public.group_members (group_id, user_id, role) values
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'admin'),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'admin');

-- Add expense in Alice's group
-- Using direct insert since create_expense RPC uses auth.uid() which doesn't work in test context
insert into public.expenses (id, group_id, paid_by, description, amount, split_type)
values ('e0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'Alice Dinner', 30.00, 'even');

insert into public.expense_shares (id, expense_id, user_id, amount)
values ('d0000000-0000-0000-0000-000000000001',
        'e0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        30.00);

-- Test as Alice: can see own group
set local role authenticated;
set local request.jwt.claims to '{"sub": "a0000000-0000-0000-0000-000000000001"}';

select is(
  (select count(*)::int from public.groups),
  1, 'Alice can only see her own group'
);

select is(
  (select count(*)::int from public.expenses),
  1, 'Alice can see expenses in her group'
);

-- Test as Bob: cannot see Alice's group
set local request.jwt.claims to '{"sub": "a0000000-0000-0000-0000-000000000002"}';

select is(
  (select count(*)::int from public.groups),
  1, 'Bob can only see his own group'
);

select is(
  (select count(*)::int from public.expenses),
  0, 'Bob cannot see expenses in Alice group'
);

select * from finish();
rollback;
