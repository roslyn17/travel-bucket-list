-- Per-user selection of which predefined lists they're tracking.
-- New users start with none; they add lists themselves from the catalog in
-- `public.lists`. Deleting a row here just un-selects the list -- it does
-- not touch the user's `user_progress` rows, so re-adding a list later
-- restores their prior visited status.
create table public.user_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  list_id uuid not null references public.lists (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, list_id)
);

create index user_lists_user_id_idx on public.user_lists (user_id);

alter table public.user_lists enable row level security;

create policy "Users can view their own list selections"
  on public.user_lists for select
  using (auth.uid() = user_id);

create policy "Users can add their own list selections"
  on public.user_lists for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own list selections"
  on public.user_lists for delete
  using (auth.uid() = user_id);
