-- The 7 races in the Abbott World Marathon Majors series, alphabetical by
-- city. metadata holds the host city/country (same "location" convention
-- as new-7-wonders -- these aren't sports venues with a "team", so
-- list_items renders name + location, not team + name).
with target_list as (
  select id from public.lists where slug = 'world-marathon-majors'
)
insert into public.list_items (list_id, name, code, sort_order, metadata)
select target_list.id, v.name, v.code, v.sort_order, v.metadata
from target_list, (values
  ('Berlin Marathon', 'BER', 1, '{"location":"Berlin, Germany"}'::jsonb),
  ('Boston Marathon', 'BOS', 2, '{"location":"Boston, MA"}'::jsonb),
  ('Chicago Marathon', 'CHI', 3, '{"location":"Chicago, IL"}'::jsonb),
  ('London Marathon', 'LON', 4, '{"location":"London, UK"}'::jsonb),
  ('New York City Marathon', 'NYC', 5, '{"location":"New York, NY"}'::jsonb),
  ('Sydney Marathon', 'SYD', 6, '{"location":"Sydney, Australia"}'::jsonb),
  ('Tokyo Marathon', 'TYO', 7, '{"location":"Tokyo, Japan"}'::jsonb)
) as v(name, code, sort_order, metadata);
