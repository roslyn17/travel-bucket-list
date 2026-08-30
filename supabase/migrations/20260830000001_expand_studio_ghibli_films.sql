-- Replaces the 8-item placeholder sample with the complete Studio Ghibli
-- theatrical feature filmography (23 films), in release order. Includes
-- The Red Turtle (2016), Ghibli's first international co-production,
-- which is standardly counted in the feature filmography.
delete from public.list_items
where list_id = (select id from public.lists where slug = 'studio-ghibli-films');

with target_list as (
  select id from public.lists where slug = 'studio-ghibli-films'
)
insert into public.list_items (list_id, name, code, sort_order, metadata)
select target_list.id, v.name, v.code, v.sort_order, v.metadata
from target_list, (values
  ('Castle in the Sky', 'CASTLE', 1, '{"year":"1986"}'::jsonb),
  ('Grave of the Fireflies', 'GRAVE', 2, '{"year":"1988"}'::jsonb),
  ('My Neighbor Totoro', 'TOTORO', 3, '{"year":"1988"}'::jsonb),
  ('Kiki''s Delivery Service', 'KIKI', 4, '{"year":"1989"}'::jsonb),
  ('Only Yesterday', 'ONLYYESTERDAY', 5, '{"year":"1991"}'::jsonb),
  ('Porco Rosso', 'PORCOROSSO', 6, '{"year":"1992"}'::jsonb),
  ('Pom Poko', 'POMPOKO', 7, '{"year":"1994"}'::jsonb),
  ('Whisper of the Heart', 'WHISPER', 8, '{"year":"1995"}'::jsonb),
  ('Princess Mononoke', 'MONONOKE', 9, '{"year":"1997"}'::jsonb),
  ('My Neighbors the Yamadas', 'YAMADAS', 10, '{"year":"1999"}'::jsonb),
  ('Spirited Away', 'SPIRITED', 11, '{"year":"2001"}'::jsonb),
  ('The Cat Returns', 'CATRETURNS', 12, '{"year":"2002"}'::jsonb),
  ('Howl''s Moving Castle', 'HOWL', 13, '{"year":"2004"}'::jsonb),
  ('Tales from Earthsea', 'EARTHSEA', 14, '{"year":"2006"}'::jsonb),
  ('Ponyo', 'PONYO', 15, '{"year":"2008"}'::jsonb),
  ('Arrietty', 'ARRIETTY', 16, '{"year":"2010"}'::jsonb),
  ('From Up on Poppy Hill', 'POPPYHILL', 17, '{"year":"2011"}'::jsonb),
  ('The Wind Rises', 'WINDRISES', 18, '{"year":"2013"}'::jsonb),
  ('The Tale of the Princess Kaguya', 'KAGUYA', 19, '{"year":"2013"}'::jsonb),
  ('When Marnie Was There', 'MARNIE', 20, '{"year":"2014"}'::jsonb),
  ('The Red Turtle', 'REDTURTLE', 21, '{"year":"2016"}'::jsonb),
  ('Earwig and the Witch', 'EARWIG', 22, '{"year":"2020"}'::jsonb),
  ('The Boy and the Heron', 'HERON', 23, '{"year":"2023"}'::jsonb)
) as v(name, code, sort_order, metadata);
