-- Current home ballparks of all 30 MLB teams, alphabetical by team name.
-- code = standard MLB team abbreviation. metadata holds team name + city.
--
-- NOTE on two teams in transitional stadium situations as of the 2025-2026
-- seasons -- update these rows directly in list_items if they change:
--   - Athletics: playing at Sutter Health Park (West Sacramento) while a
--     new Las Vegas ballpark is built.
--   - Tampa Bay Rays: seeded here with Tropicana Field, their long-term
--     home; they played 2025 at Steinbrenner Field during Tropicana Field
--     repairs. Confirm their current park before relying on this row.
with target_list as (
  select id from public.lists where slug = 'mlb-stadiums'
)
insert into public.list_items (list_id, name, code, sort_order, metadata)
select target_list.id, v.name, v.code, v.sort_order, v.metadata
from target_list, (values
  ('Chase Field', 'ARI', 1, '{"team":"Arizona Diamondbacks","city":"Phoenix, AZ"}'::jsonb),
  ('Truist Park', 'ATL', 2, '{"team":"Atlanta Braves","city":"Cumberland, GA"}'::jsonb),
  ('Sutter Health Park', 'ATH', 3, '{"team":"Athletics","city":"West Sacramento, CA"}'::jsonb),
  ('Oriole Park at Camden Yards', 'BAL', 4, '{"team":"Baltimore Orioles","city":"Baltimore, MD"}'::jsonb),
  ('Fenway Park', 'BOS', 5, '{"team":"Boston Red Sox","city":"Boston, MA"}'::jsonb),
  ('Wrigley Field', 'CHC', 6, '{"team":"Chicago Cubs","city":"Chicago, IL"}'::jsonb),
  ('Rate Field', 'CWS', 7, '{"team":"Chicago White Sox","city":"Chicago, IL"}'::jsonb),
  ('Great American Ball Park', 'CIN', 8, '{"team":"Cincinnati Reds","city":"Cincinnati, OH"}'::jsonb),
  ('Progressive Field', 'CLE', 9, '{"team":"Cleveland Guardians","city":"Cleveland, OH"}'::jsonb),
  ('Coors Field', 'COL', 10, '{"team":"Colorado Rockies","city":"Denver, CO"}'::jsonb),
  ('Comerica Park', 'DET', 11, '{"team":"Detroit Tigers","city":"Detroit, MI"}'::jsonb),
  ('Daikin Park', 'HOU', 12, '{"team":"Houston Astros","city":"Houston, TX"}'::jsonb),
  ('Kauffman Stadium', 'KC', 13, '{"team":"Kansas City Royals","city":"Kansas City, MO"}'::jsonb),
  ('Angel Stadium', 'LAA', 14, '{"team":"Los Angeles Angels","city":"Anaheim, CA"}'::jsonb),
  ('Dodger Stadium', 'LAD', 15, '{"team":"Los Angeles Dodgers","city":"Los Angeles, CA"}'::jsonb),
  ('loanDepot park', 'MIA', 16, '{"team":"Miami Marlins","city":"Miami, FL"}'::jsonb),
  ('American Family Field', 'MIL', 17, '{"team":"Milwaukee Brewers","city":"Milwaukee, WI"}'::jsonb),
  ('Target Field', 'MIN', 18, '{"team":"Minnesota Twins","city":"Minneapolis, MN"}'::jsonb),
  ('Citi Field', 'NYM', 19, '{"team":"New York Mets","city":"Queens, NY"}'::jsonb),
  ('Yankee Stadium', 'NYY', 20, '{"team":"New York Yankees","city":"Bronx, NY"}'::jsonb),
  ('Citizens Bank Park', 'PHI', 21, '{"team":"Philadelphia Phillies","city":"Philadelphia, PA"}'::jsonb),
  ('PNC Park', 'PIT', 22, '{"team":"Pittsburgh Pirates","city":"Pittsburgh, PA"}'::jsonb),
  ('Petco Park', 'SD', 23, '{"team":"San Diego Padres","city":"San Diego, CA"}'::jsonb),
  ('Oracle Park', 'SF', 24, '{"team":"San Francisco Giants","city":"San Francisco, CA"}'::jsonb),
  ('T-Mobile Park', 'SEA', 25, '{"team":"Seattle Mariners","city":"Seattle, WA"}'::jsonb),
  ('Busch Stadium', 'STL', 26, '{"team":"St. Louis Cardinals","city":"St. Louis, MO"}'::jsonb),
  ('Tropicana Field', 'TB', 27, '{"team":"Tampa Bay Rays","city":"St. Petersburg, FL"}'::jsonb),
  ('Globe Life Field', 'TEX', 28, '{"team":"Texas Rangers","city":"Arlington, TX"}'::jsonb),
  ('Rogers Centre', 'TOR', 29, '{"team":"Toronto Blue Jays","city":"Toronto, ON, Canada"}'::jsonb),
  ('Nationals Park', 'WSH', 30, '{"team":"Washington Nationals","city":"Washington, DC"}'::jsonb)
) as v(name, code, sort_order, metadata);
