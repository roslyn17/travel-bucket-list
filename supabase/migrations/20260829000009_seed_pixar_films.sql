-- PLACEHOLDER DATA: the full feature filmography is ~28 films; this seeds
-- a representative sample of well-known titles so the list type and browse
-- page can be verified end-to-end. Replace with the complete filmography
-- (in release order) when that data is provided.
with target_list as (
  select id from public.lists where slug = 'pixar-films'
)
insert into public.list_items (list_id, name, code, sort_order, metadata)
select target_list.id, v.name, v.code, v.sort_order, v.metadata
from target_list, (values
  ('Toy Story', 'TOYSTORY', 1, '{"year":"1995"}'::jsonb),
  ('Finding Nemo', 'NEMO', 2, '{"year":"2003"}'::jsonb),
  ('The Incredibles', 'INCREDIBLES', 3, '{"year":"2004"}'::jsonb),
  ('Ratatouille', 'RATATOUILLE', 4, '{"year":"2007"}'::jsonb),
  ('WALL-E', 'WALLE', 5, '{"year":"2008"}'::jsonb),
  ('Up', 'UP', 6, '{"year":"2009"}'::jsonb),
  ('Inside Out', 'INSIDEOUT', 7, '{"year":"2015"}'::jsonb),
  ('Coco', 'COCO', 8, '{"year":"2017"}'::jsonb)
) as v(name, code, sort_order, metadata);
