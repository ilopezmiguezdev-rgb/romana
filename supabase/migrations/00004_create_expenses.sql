create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  paid_by uuid not null references auth.users(id),
  description text not null,
  amount numeric(10, 2) not null check (amount > 0),
  split_type text not null check (split_type in ('even', 'percent', 'item')),
  created_at timestamptz not null default now()
);

alter table public.expenses enable row level security;
