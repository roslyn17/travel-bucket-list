-- Reference data: the 4 predefined lists and their items.
-- Read-only from the client — writable only via migrations / the SQL editor
-- (no insert/update/delete policies are granted below).

create table public.lists (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table public.list_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.lists (id) on delete cascade,
  name text not null,
  code text,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (list_id, code)
);

create index list_items_list_id_idx on public.list_items (list_id);

alter table public.lists enable row level security;
alter table public.list_items enable row level security;

create policy "Lists are readable by everyone"
  on public.lists for select
  using (true);

create policy "List items are readable by everyone"
  on public.list_items for select
  using (true);
