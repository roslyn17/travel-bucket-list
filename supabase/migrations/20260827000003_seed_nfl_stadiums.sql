-- Current home stadiums of all 32 NFL teams, alphabetical by team name.
-- code = standard NFL team abbreviation. metadata holds team name + city.
--
-- NOTE: several of these are sponsor names that churn every few years
-- (Cleveland's Huntington Bank Field, Jacksonville's EverBank Stadium,
-- Pittsburgh's Acrisure Stadium, Washington's Commanders Field all renamed
-- within the last few seasons), and a few teams have stadium changes in
-- progress (Buffalo's Highmark Stadium is being rebuilt on the same site;
-- Tennessee's Nissan Stadium is being replaced by a new domed stadium
-- targeting a 2027 opening). Confirm current names before relying on this.
with target_list as (
  select id from public.lists where slug = 'nfl-stadiums'
)
insert into public.list_items (list_id, name, code, sort_order, metadata)
select target_list.id, v.name, v.code, v.sort_order, v.metadata
from target_list, (values
  ('State Farm Stadium', 'ARI', 1, '{"team":"Arizona Cardinals","city":"Glendale, AZ"}'::jsonb),
  ('Mercedes-Benz Stadium', 'ATL', 2, '{"team":"Atlanta Falcons","city":"Atlanta, GA"}'::jsonb),
  ('M&T Bank Stadium', 'BAL', 3, '{"team":"Baltimore Ravens","city":"Baltimore, MD"}'::jsonb),
  ('Highmark Stadium', 'BUF', 4, '{"team":"Buffalo Bills","city":"Orchard Park, NY"}'::jsonb),
  ('Bank of America Stadium', 'CAR', 5, '{"team":"Carolina Panthers","city":"Charlotte, NC"}'::jsonb),
  ('Soldier Field', 'CHI', 6, '{"team":"Chicago Bears","city":"Chicago, IL"}'::jsonb),
  ('Paycor Stadium', 'CIN', 7, '{"team":"Cincinnati Bengals","city":"Cincinnati, OH"}'::jsonb),
  ('Huntington Bank Field', 'CLE', 8, '{"team":"Cleveland Browns","city":"Cleveland, OH"}'::jsonb),
  ('AT&T Stadium', 'DAL', 9, '{"team":"Dallas Cowboys","city":"Arlington, TX"}'::jsonb),
  ('Empower Field at Mile High', 'DEN', 10, '{"team":"Denver Broncos","city":"Denver, CO"}'::jsonb),
  ('Ford Field', 'DET', 11, '{"team":"Detroit Lions","city":"Detroit, MI"}'::jsonb),
  ('Lambeau Field', 'GB', 12, '{"team":"Green Bay Packers","city":"Green Bay, WI"}'::jsonb),
  ('NRG Stadium', 'HOU', 13, '{"team":"Houston Texans","city":"Houston, TX"}'::jsonb),
  ('Lucas Oil Stadium', 'IND', 14, '{"team":"Indianapolis Colts","city":"Indianapolis, IN"}'::jsonb),
  ('EverBank Stadium', 'JAX', 15, '{"team":"Jacksonville Jaguars","city":"Jacksonville, FL"}'::jsonb),
  ('GEHA Field at Arrowhead Stadium', 'KC', 16, '{"team":"Kansas City Chiefs","city":"Kansas City, MO"}'::jsonb),
  ('Allegiant Stadium', 'LV', 17, '{"team":"Las Vegas Raiders","city":"Las Vegas, NV"}'::jsonb),
  ('SoFi Stadium', 'LAC', 18, '{"team":"Los Angeles Chargers","city":"Inglewood, CA"}'::jsonb),
  ('SoFi Stadium', 'LAR', 19, '{"team":"Los Angeles Rams","city":"Inglewood, CA"}'::jsonb),
  ('Hard Rock Stadium', 'MIA', 20, '{"team":"Miami Dolphins","city":"Miami Gardens, FL"}'::jsonb),
  ('U.S. Bank Stadium', 'MIN', 21, '{"team":"Minnesota Vikings","city":"Minneapolis, MN"}'::jsonb),
  ('Gillette Stadium', 'NE', 22, '{"team":"New England Patriots","city":"Foxborough, MA"}'::jsonb),
  ('Caesars Superdome', 'NO', 23, '{"team":"New Orleans Saints","city":"New Orleans, LA"}'::jsonb),
  ('MetLife Stadium', 'NYG', 24, '{"team":"New York Giants","city":"East Rutherford, NJ"}'::jsonb),
  ('MetLife Stadium', 'NYJ', 25, '{"team":"New York Jets","city":"East Rutherford, NJ"}'::jsonb),
  ('Lincoln Financial Field', 'PHI', 26, '{"team":"Philadelphia Eagles","city":"Philadelphia, PA"}'::jsonb),
  ('Acrisure Stadium', 'PIT', 27, '{"team":"Pittsburgh Steelers","city":"Pittsburgh, PA"}'::jsonb),
  ('Levi''s Stadium', 'SF', 28, '{"team":"San Francisco 49ers","city":"Santa Clara, CA"}'::jsonb),
  ('Lumen Field', 'SEA', 29, '{"team":"Seattle Seahawks","city":"Seattle, WA"}'::jsonb),
  ('Raymond James Stadium', 'TB', 30, '{"team":"Tampa Bay Buccaneers","city":"Tampa, FL"}'::jsonb),
  ('Nissan Stadium', 'TEN', 31, '{"team":"Tennessee Titans","city":"Nashville, TN"}'::jsonb),
  ('Commanders Field', 'WAS', 32, '{"team":"Washington Commanders","city":"Landover, MD"}'::jsonb)
) as v(name, code, sort_order, metadata);
