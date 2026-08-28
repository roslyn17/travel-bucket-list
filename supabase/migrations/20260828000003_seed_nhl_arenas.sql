-- Current home arenas of all 32 NHL teams, alphabetical by team name.
-- code = standard NHL team abbreviation. metadata holds team name + city.
--
-- NOTE: arena sponsor names churn often (Carolina's Lenovo Center,
-- Florida's Amerant Bank Arena, Minnesota's Grand Casino Arena, and Tampa
-- Bay's Benchmark International Arena have all been renamed within the
-- last couple seasons). The Utah team is also the most volatile row here:
-- the former Arizona Coyotes relocated to Salt Lake City for the 2024-25
-- season as the "Utah Hockey Club" placeholder name before rebranding to
-- the Utah Mammoth. Confirm current names before relying on this.
with target_list as (
  select id from public.lists where slug = 'nhl-arenas'
)
insert into public.list_items (list_id, name, code, sort_order, metadata)
select target_list.id, v.name, v.code, v.sort_order, v.metadata
from target_list, (values
  ('Honda Center', 'ANA', 1, '{"team":"Anaheim Ducks","city":"Anaheim, CA"}'::jsonb),
  ('TD Garden', 'BOS', 2, '{"team":"Boston Bruins","city":"Boston, MA"}'::jsonb),
  ('KeyBank Center', 'BUF', 3, '{"team":"Buffalo Sabres","city":"Buffalo, NY"}'::jsonb),
  ('Scotiabank Saddledome', 'CGY', 4, '{"team":"Calgary Flames","city":"Calgary, AB, Canada"}'::jsonb),
  ('Lenovo Center', 'CAR', 5, '{"team":"Carolina Hurricanes","city":"Raleigh, NC"}'::jsonb),
  ('United Center', 'CHI', 6, '{"team":"Chicago Blackhawks","city":"Chicago, IL"}'::jsonb),
  ('Ball Arena', 'COL', 7, '{"team":"Colorado Avalanche","city":"Denver, CO"}'::jsonb),
  ('Nationwide Arena', 'CBJ', 8, '{"team":"Columbus Blue Jackets","city":"Columbus, OH"}'::jsonb),
  ('American Airlines Center', 'DAL', 9, '{"team":"Dallas Stars","city":"Dallas, TX"}'::jsonb),
  ('Little Caesars Arena', 'DET', 10, '{"team":"Detroit Red Wings","city":"Detroit, MI"}'::jsonb),
  ('Rogers Place', 'EDM', 11, '{"team":"Edmonton Oilers","city":"Edmonton, AB, Canada"}'::jsonb),
  ('Amerant Bank Arena', 'FLA', 12, '{"team":"Florida Panthers","city":"Sunrise, FL"}'::jsonb),
  ('Crypto.com Arena', 'LAK', 13, '{"team":"Los Angeles Kings","city":"Los Angeles, CA"}'::jsonb),
  ('Grand Casino Arena', 'MIN', 14, '{"team":"Minnesota Wild","city":"Saint Paul, MN"}'::jsonb),
  ('Bell Centre', 'MTL', 15, '{"team":"Montreal Canadiens","city":"Montreal, QC, Canada"}'::jsonb),
  ('Bridgestone Arena', 'NSH', 16, '{"team":"Nashville Predators","city":"Nashville, TN"}'::jsonb),
  ('Prudential Center', 'NJD', 17, '{"team":"New Jersey Devils","city":"Newark, NJ"}'::jsonb),
  ('UBS Arena', 'NYI', 18, '{"team":"New York Islanders","city":"Elmont, NY"}'::jsonb),
  ('Madison Square Garden', 'NYR', 19, '{"team":"New York Rangers","city":"New York, NY"}'::jsonb),
  ('Canadian Tire Centre', 'OTT', 20, '{"team":"Ottawa Senators","city":"Ottawa, ON, Canada"}'::jsonb),
  ('Wells Fargo Center', 'PHI', 21, '{"team":"Philadelphia Flyers","city":"Philadelphia, PA"}'::jsonb),
  ('PPG Paints Arena', 'PIT', 22, '{"team":"Pittsburgh Penguins","city":"Pittsburgh, PA"}'::jsonb),
  ('SAP Center', 'SJS', 23, '{"team":"San Jose Sharks","city":"San Jose, CA"}'::jsonb),
  ('Climate Pledge Arena', 'SEA', 24, '{"team":"Seattle Kraken","city":"Seattle, WA"}'::jsonb),
  ('Enterprise Center', 'STL', 25, '{"team":"St. Louis Blues","city":"St. Louis, MO"}'::jsonb),
  ('Benchmark International Arena', 'TBL', 26, '{"team":"Tampa Bay Lightning","city":"Tampa, FL"}'::jsonb),
  ('Scotiabank Arena', 'TOR', 27, '{"team":"Toronto Maple Leafs","city":"Toronto, ON, Canada"}'::jsonb),
  ('Delta Center', 'UTA', 28, '{"team":"Utah Mammoth","city":"Salt Lake City, UT"}'::jsonb),
  ('Rogers Arena', 'VAN', 29, '{"team":"Vancouver Canucks","city":"Vancouver, BC, Canada"}'::jsonb),
  ('T-Mobile Arena', 'VGK', 30, '{"team":"Vegas Golden Knights","city":"Las Vegas, NV"}'::jsonb),
  ('Capital One Arena', 'WSH', 31, '{"team":"Washington Capitals","city":"Washington, DC"}'::jsonb),
  ('Canada Life Centre', 'WPG', 32, '{"team":"Winnipeg Jets","city":"Winnipeg, MB, Canada"}'::jsonb)
) as v(name, code, sort_order, metadata);
