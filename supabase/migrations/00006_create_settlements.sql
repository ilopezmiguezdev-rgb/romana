create table public.settlements (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  from_user uuid not null references auth.users(id),
  to_user uuid not null references auth.users(id),
  amount numeric(10, 2) not null check (amount > 0),
  created_at timestamptz not null default now()
);

alter table public.settlements enable row level security;

create index idx_settlements_group_id on public.settlements(group_id);
create index idx_settlements_from_user on public.settlements(from_user);
create index idx_settlements_to_user on public.settlements(to_user);
