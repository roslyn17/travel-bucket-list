-- The 7 continents, alphabetical by name.
with target_list as (
  select id from public.lists where slug = 'continents'
)
insert into public.list_items (list_id, name, code, sort_order)
select target_list.id, v.name, v.code, v.sort_order
from target_list, (values
  ('Africa', 'AF', 1),
  ('Antarctica', 'AN', 2),
  ('Asia', 'AS', 3),
  ('Australia', 'AU', 4),
  ('Europe', 'EU', 5),
  ('North America', 'NA', 6),
  ('South America', 'SA', 7)
) as v(name, code, sort_order);
