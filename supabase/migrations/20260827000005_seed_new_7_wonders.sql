-- The 7 monuments named winners of the 2007 New7Wonders of the World poll,
-- alphabetical by name. metadata holds the location (no "team" here --
-- these aren't sports venues, so list_items renders name as primary and
-- location as the secondary line).
with target_list as (
  select id from public.lists where slug = 'new-7-wonders'
)
insert into public.list_items (list_id, name, code, sort_order, metadata)
select target_list.id, v.name, v.code, v.sort_order, v.metadata
from target_list, (values
  ('Chichen Itza', 'CHI', 1, '{"location":"Yucatán, Mexico"}'::jsonb),
  ('Christ the Redeemer', 'CTR', 2, '{"location":"Rio de Janeiro, Brazil"}'::jsonb),
  ('Colosseum', 'COL', 3, '{"location":"Rome, Italy"}'::jsonb),
  ('Great Wall of China', 'GWC', 4, '{"location":"China"}'::jsonb),
  ('Machu Picchu', 'MAP', 5, '{"location":"Cusco Region, Peru"}'::jsonb),
  ('Petra', 'PET', 6, '{"location":"Ma''an, Jordan"}'::jsonb),
  ('Taj Mahal', 'TAJ', 7, '{"location":"Agra, India"}'::jsonb)
) as v(name, code, sort_order, metadata);
