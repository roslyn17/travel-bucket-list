-- Per-user visited/not-visited status for each list item.
-- visited_on supports a fuzzy date: an exact day, a month, or just a year.
-- When precision is 'month' or 'year', visited_on is normalized to the 1st
-- of that month/year — visited_precision says how much of it to trust.
create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  list_item_id uuid not null references public.list_items (id) on delete cascade,
  visited boolean not null default false,
  visited_on date,
  visited_precision text check (visited_precision in ('day', 'month', 'year')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, list_item_id),
  constraint visited_date_fields_paired
    check ((visited_on is null) = (visited_precision is null)),
  constraint visited_date_requires_visited
    check (visited_on is null or visited = true)
);

create index user_progress_user_id_idx on public.user_progress (user_id);

alter table public.user_progress enable row level security;

-- A user can only ever see or touch their own progress rows.
create policy "Users can view their own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.user_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own progress"
  on public.user_progress for delete
  using (auth.uid() = user_id);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_progress_set_updated_at
  before update on public.user_progress
  for each row execute procedure public.set_updated_at();
