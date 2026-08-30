-- Replaces the 8-item placeholder sample with the complete Pixar theatrical
-- feature filmography, in release order, through the most recently
-- confirmed release known at authoring time (Elio, 2025). Pixar's slate
-- beyond that (e.g. Hoppers, Toy Story 5) was announced for 2026 but not
-- yet confirmed released -- add those once they've actually come out.
delete from public.list_items
where list_id = (select id from public.lists where slug = 'pixar-films');

with target_list as (
  select id from public.lists where slug = 'pixar-films'
)
insert into public.list_items (list_id, name, code, sort_order, metadata)
select target_list.id, v.name, v.code, v.sort_order, v.metadata
from target_list, (values
  ('Toy Story', 'TOYSTORY', 1, '{"year":"1995"}'::jsonb),
  ('A Bug''s Life', 'BUGSLIFE', 2, '{"year":"1998"}'::jsonb),
  ('Toy Story 2', 'TOYSTORY2', 3, '{"year":"1999"}'::jsonb),
  ('Monsters, Inc.', 'MONSTERSINC', 4, '{"year":"2001"}'::jsonb),
  ('Finding Nemo', 'NEMO', 5, '{"year":"2003"}'::jsonb),
  ('The Incredibles', 'INCREDIBLES', 6, '{"year":"2004"}'::jsonb),
  ('Cars', 'CARS', 7, '{"year":"2006"}'::jsonb),
  ('Ratatouille', 'RATATOUILLE', 8, '{"year":"2007"}'::jsonb),
  ('WALL-E', 'WALLE', 9, '{"year":"2008"}'::jsonb),
  ('Up', 'UP', 10, '{"year":"2009"}'::jsonb),
  ('Toy Story 3', 'TOYSTORY3', 11, '{"year":"2010"}'::jsonb),
  ('Cars 2', 'CARS2', 12, '{"year":"2011"}'::jsonb),
  ('Brave', 'BRAVE', 13, '{"year":"2012"}'::jsonb),
  ('Monsters University', 'MONSTERSU', 14, '{"year":"2013"}'::jsonb),
  ('Inside Out', 'INSIDEOUT', 15, '{"year":"2015"}'::jsonb),
  ('The Good Dinosaur', 'GOODDINO', 16, '{"year":"2015"}'::jsonb),
  ('Finding Dory', 'DORY', 17, '{"year":"2016"}'::jsonb),
  ('Cars 3', 'CARS3', 18, '{"year":"2017"}'::jsonb),
  ('Coco', 'COCO', 19, '{"year":"2017"}'::jsonb),
  ('Incredibles 2', 'INCREDIBLES2', 20, '{"year":"2018"}'::jsonb),
  ('Toy Story 4', 'TOYSTORY4', 21, '{"year":"2019"}'::jsonb),
  ('Onward', 'ONWARD', 22, '{"year":"2020"}'::jsonb),
  ('Soul', 'SOUL', 23, '{"year":"2020"}'::jsonb),
  ('Luca', 'LUCA', 24, '{"year":"2021"}'::jsonb),
  ('Turning Red', 'TURNINGRED', 25, '{"year":"2022"}'::jsonb),
  ('Lightyear', 'LIGHTYEAR', 26, '{"year":"2022"}'::jsonb),
  ('Elemental', 'ELEMENTAL', 27, '{"year":"2023"}'::jsonb),
  ('Inside Out 2', 'INSIDEOUT2', 28, '{"year":"2024"}'::jsonb),
  ('Elio', 'ELIO', 29, '{"year":"2025"}'::jsonb)
) as v(name, code, sort_order, metadata);
