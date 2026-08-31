-- Lets users manually reorder their bucket list cards on the dashboard.
alter table public.user_lists add column sort_order integer;

-- Backfill existing rows into their current (created_at) order, per user.
with ranked as (
  select id, row_number() over (partition by user_id order by created_at) - 1 as rn
  from public.user_lists
)
update public.user_lists
set sort_order = ranked.rn
from ranked
where public.user_lists.id = ranked.id;

alter table public.user_lists alter column sort_order set not null;
alter table public.user_lists alter column sort_order set default 0;

-- No update policy existed yet -- user_lists was only ever inserted into or
-- deleted from. Reordering needs to update sort_order on existing rows.
create policy "Users can reorder their own list selections"
  on public.user_lists for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
