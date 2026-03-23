-- Dev seed data: creates test users, a group, and sample expenses
-- Run via: supabase db reset (which runs seed.sql after migrations)

-- Create test users
insert into auth.users (id, email, raw_user_meta_data) values
  ('11111111-1111-1111-1111-111111111111', 'alice@example.com', '{"display_name": "Alice"}'),
  ('22222222-2222-2222-2222-222222222222', 'bob@example.com', '{"display_name": "Bob"}'),
  ('33333333-3333-3333-3333-333333333333', 'carol@example.com', '{"display_name": "Carol"}');

-- The trigger auto-creates profiles. Create a group.
insert into public.groups (id, name, invite_code, created_by) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Trip to Rome', 'ROME01',
   '11111111-1111-1111-1111-111111111111');

insert into public.group_members (group_id, user_id, role) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'admin'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'member'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'member');

-- Sample expenses (direct inserts since create_expense uses auth.uid() which is unavailable in seed context)
-- Expense 1: Dinner at Trattoria - paid by Alice, split 3 ways ($30 each)
insert into public.expenses (id, group_id, paid_by, description, amount, split_type) values
  ('e1111111-1111-1111-1111-111111111111',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '11111111-1111-1111-1111-111111111111',
   'Dinner at Trattoria', 90.00, 'even');

insert into public.expense_shares (expense_id, user_id, amount) values
  ('e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 30.00),
  ('e1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 30.00),
  ('e1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 30.00);

-- Expense 2: Museum tickets - paid by Bob, split 3 ways ($15 each)
insert into public.expenses (id, group_id, paid_by, description, amount, split_type) values
  ('e2222222-2222-2222-2222-222222222222',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '22222222-2222-2222-2222-222222222222',
   'Museum tickets', 45.00, 'even');

insert into public.expense_shares (expense_id, user_id, amount) values
  ('e2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 15.00),
  ('e2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 15.00),
  ('e2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 15.00);

-- Expense 3: Gelato - paid by Carol, split 3 ways ($5 each)
insert into public.expenses (id, group_id, paid_by, description, amount, split_type) values
  ('e3333333-3333-3333-3333-333333333333',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '33333333-3333-3333-3333-333333333333',
   'Gelato', 15.00, 'even');

insert into public.expense_shares (expense_id, user_id, amount) values
  ('e3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 5.00),
  ('e3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 5.00),
  ('e3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 5.00);
