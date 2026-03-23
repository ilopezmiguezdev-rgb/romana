create table public.group_events (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  actor_id uuid references auth.users(id),
  event_type text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

alter table public.group_events enable row level security;

create index idx_group_events_group_id on public.group_events(group_id);
