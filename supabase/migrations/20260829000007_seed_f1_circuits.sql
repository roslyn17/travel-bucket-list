-- PLACEHOLDER DATA: the full current F1 calendar is ~24 circuits; this
-- seeds a representative sample of well-established fixtures so the list
-- type and browse page can be verified end-to-end. Replace with the
-- complete current-season calendar when that data is provided.
with target_list as (
  select id from public.lists where slug = 'f1-circuits'
)
insert into public.list_items (list_id, name, code, sort_order, metadata)
select target_list.id, v.name, v.code, v.sort_order, v.metadata
from target_list, (values
  ('Albert Park Circuit', 'AUS', 1, '{"location":"Melbourne, Australia"}'::jsonb),
  ('Circuit de Monaco', 'MON', 2, '{"location":"Monte Carlo, Monaco"}'::jsonb),
  ('Circuit de Spa-Francorchamps', 'BEL', 3, '{"location":"Stavelot, Belgium"}'::jsonb),
  ('Circuit of the Americas', 'USA', 4, '{"location":"Austin, TX"}'::jsonb),
  ('Marina Bay Street Circuit', 'SGP', 5, '{"location":"Singapore"}'::jsonb),
  ('Silverstone Circuit', 'GBR', 6, '{"location":"Silverstone, UK"}'::jsonb),
  ('Suzuka International Racing Course', 'JPN', 7, '{"location":"Suzuka, Japan"}'::jsonb),
  ('Autodromo Nazionale Monza', 'ITA', 8, '{"location":"Monza, Italy"}'::jsonb)
) as v(name, code, sort_order, metadata);
