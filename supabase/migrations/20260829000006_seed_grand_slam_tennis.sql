-- The 4 Grand Slam tennis tournaments, alphabetical by name. metadata holds
-- the host city (same "location" convention as new-7-wonders).
with target_list as (
  select id from public.lists where slug = 'grand-slam-tennis'
)
insert into public.list_items (list_id, name, code, sort_order, metadata)
select target_list.id, v.name, v.code, v.sort_order, v.metadata
from target_list, (values
  ('Australian Open', 'AO', 1, '{"location":"Melbourne, Australia"}'::jsonb),
  ('French Open', 'FO', 2, '{"location":"Paris, France"}'::jsonb),
  ('US Open', 'USO', 3, '{"location":"New York, NY"}'::jsonb),
  ('Wimbledon', 'WIM', 4, '{"location":"London, UK"}'::jsonb)
) as v(name, code, sort_order, metadata);
