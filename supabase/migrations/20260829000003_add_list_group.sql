-- Top-level grouping for the "Add a bucket list" browse page: Travel,
-- Experiences & Challenges, Culture & Media. This is deliberately a
-- separate column from the existing `category` (which holds finer
-- subcategories like "Sports Venues" and is no longer used to group the
-- browse page -- see the add-list page for the new grouping).
--
-- Plain text + check constraint rather than a native Postgres enum: adding
-- a fourth top-level group later is a one-line constraint change, not a
-- breaking type migration.
alter table public.lists add column list_group text;

-- Every list that exists today is a location-based "Travel" list.
update public.lists set list_group = 'places';

alter table public.lists
  alter column list_group set not null,
  add constraint lists_list_group_check
    check (list_group in ('places', 'experiences_challenges', 'culture_media'));
