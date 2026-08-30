-- PLACEHOLDER DATA: the full feature filmography is ~23 films; this seeds
-- a representative sample of well-known titles so the list type and browse
-- page can be verified end-to-end. Replace with the complete filmography
-- (in release order) when that data is provided.
with target_list as (
  select id from public.lists where slug = 'studio-ghibli-films'
)
insert into public.list_items (list_id, name, code, sort_order, metadata)
select target_list.id, v.name, v.code, v.sort_order, v.metadata
from target_list, (values
  ('Grave of the Fireflies', 'GRAVE', 1, '{"year":"1988"}'::jsonb),
  ('My Neighbor Totoro', 'TOTORO', 2, '{"year":"1988"}'::jsonb),
  ('Kiki''s Delivery Service', 'KIKI', 3, '{"year":"1989"}'::jsonb),
  ('Princess Mononoke', 'MONONOKE', 4, '{"year":"1997"}'::jsonb),
  ('Spirited Away', 'SPIRITED', 5, '{"year":"2001"}'::jsonb),
  ('Howl''s Moving Castle', 'HOWL', 6, '{"year":"2004"}'::jsonb),
  ('Ponyo', 'PONYO', 7, '{"year":"2008"}'::jsonb),
  ('The Wind Rises', 'WINDRISES', 8, '{"year":"2013"}'::jsonb)
) as v(name, code, sort_order, metadata);
