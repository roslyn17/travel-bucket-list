-- Replaces the 8-item placeholder sample with the full 24-race calendar,
-- in calendar order. Based on the most recently completed full season
-- known at authoring time (2025) -- F1 calendars are the most volatile
-- data in this app and change year to year (races get added, dropped, or
-- swapped -- e.g. Imola's future on the calendar and Madrid's addition
-- have both been unsettled). Confirm against the actual current-season
-- calendar before relying on this, and update sort_order/items as needed.
delete from public.list_items
where list_id = (select id from public.lists where slug = 'f1-circuits');

with target_list as (
  select id from public.lists where slug = 'f1-circuits'
)
insert into public.list_items (list_id, name, code, sort_order, metadata)
select target_list.id, v.name, v.code, v.sort_order, v.metadata
from target_list, (values
  ('Albert Park Circuit', 'AUS', 1, '{"location":"Melbourne, Australia"}'::jsonb),
  ('Shanghai International Circuit', 'CHN', 2, '{"location":"Shanghai, China"}'::jsonb),
  ('Suzuka International Racing Course', 'JPN', 3, '{"location":"Suzuka, Japan"}'::jsonb),
  ('Bahrain International Circuit', 'BHR', 4, '{"location":"Sakhir, Bahrain"}'::jsonb),
  ('Jeddah Corniche Circuit', 'KSA', 5, '{"location":"Jeddah, Saudi Arabia"}'::jsonb),
  ('Miami International Autodrome', 'MIA', 6, '{"location":"Miami, FL"}'::jsonb),
  ('Autodromo Enzo e Dino Ferrari', 'EMI', 7, '{"location":"Imola, Italy"}'::jsonb),
  ('Circuit de Monaco', 'MON', 8, '{"location":"Monte Carlo, Monaco"}'::jsonb),
  ('Circuit de Barcelona-Catalunya', 'ESP', 9, '{"location":"Barcelona, Spain"}'::jsonb),
  ('Circuit Gilles Villeneuve', 'CAN', 10, '{"location":"Montreal, Canada"}'::jsonb),
  ('Red Bull Ring', 'AUT', 11, '{"location":"Spielberg, Austria"}'::jsonb),
  ('Silverstone Circuit', 'GBR', 12, '{"location":"Silverstone, UK"}'::jsonb),
  ('Circuit de Spa-Francorchamps', 'BEL', 13, '{"location":"Stavelot, Belgium"}'::jsonb),
  ('Hungaroring', 'HUN', 14, '{"location":"Budapest, Hungary"}'::jsonb),
  ('Circuit Zandvoort', 'NED', 15, '{"location":"Zandvoort, Netherlands"}'::jsonb),
  ('Autodromo Nazionale Monza', 'ITA', 16, '{"location":"Monza, Italy"}'::jsonb),
  ('Baku City Circuit', 'AZE', 17, '{"location":"Baku, Azerbaijan"}'::jsonb),
  ('Marina Bay Street Circuit', 'SGP', 18, '{"location":"Singapore"}'::jsonb),
  ('Circuit of the Americas', 'USA', 19, '{"location":"Austin, TX"}'::jsonb),
  ('Autódromo Hermanos Rodríguez', 'MEX', 20, '{"location":"Mexico City, Mexico"}'::jsonb),
  ('Autódromo José Carlos Pace', 'BRA', 21, '{"location":"São Paulo, Brazil"}'::jsonb),
  ('Las Vegas Strip Circuit', 'LVG', 22, '{"location":"Las Vegas, NV"}'::jsonb),
  ('Lusail International Circuit', 'QAT', 23, '{"location":"Lusail, Qatar"}'::jsonb),
  ('Yas Marina Circuit', 'ABU', 24, '{"location":"Abu Dhabi, UAE"}'::jsonb)
) as v(name, code, sort_order, metadata);
