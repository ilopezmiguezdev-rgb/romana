create table public.expense_shares (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid not null references public.expenses(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  amount numeric(10, 2) not null check (amount >= 0),
  unique(expense_id, user_id)
);

alter table public.expense_shares enable row level security;

create index idx_expense_shares_expense_id on public.expense_shares(expense_id);
create index idx_expense_shares_user_id on public.expense_shares(user_id);
