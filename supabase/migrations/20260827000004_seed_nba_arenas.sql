-- Current home arenas of all 30 NBA teams, alphabetical by team name.
-- code = standard NBA team abbreviation. metadata holds team name + city.
--
-- NOTE: arena sponsor names churn often (Cleveland's Rocket Arena, Miami's
-- Kaseya Center, Orlando's Kia Center, Phoenix's PHX Arena, San Antonio's
-- Frost Bank Center have all been renamed within the last couple seasons).
-- Confirm current names before relying on this.
with target_list as (
  select id from public.lists where slug = 'nba-arenas'
)
insert into public.list_items (list_id, name, code, sort_order, metadata)
select target_list.id, v.name, v.code, v.sort_order, v.metadata
from target_list, (values
  ('State Farm Arena', 'ATL', 1, '{"team":"Atlanta Hawks","city":"Atlanta, GA"}'::jsonb),
  ('TD Garden', 'BOS', 2, '{"team":"Boston Celtics","city":"Boston, MA"}'::jsonb),
  ('Barclays Center', 'BKN', 3, '{"team":"Brooklyn Nets","city":"Brooklyn, NY"}'::jsonb),
  ('Spectrum Center', 'CHA', 4, '{"team":"Charlotte Hornets","city":"Charlotte, NC"}'::jsonb),
  ('United Center', 'CHI', 5, '{"team":"Chicago Bulls","city":"Chicago, IL"}'::jsonb),
  ('Rocket Arena', 'CLE', 6, '{"team":"Cleveland Cavaliers","city":"Cleveland, OH"}'::jsonb),
  ('American Airlines Center', 'DAL', 7, '{"team":"Dallas Mavericks","city":"Dallas, TX"}'::jsonb),
  ('Ball Arena', 'DEN', 8, '{"team":"Denver Nuggets","city":"Denver, CO"}'::jsonb),
  ('Little Caesars Arena', 'DET', 9, '{"team":"Detroit Pistons","city":"Detroit, MI"}'::jsonb),
  ('Chase Center', 'GSW', 10, '{"team":"Golden State Warriors","city":"San Francisco, CA"}'::jsonb),
  ('Toyota Center', 'HOU', 11, '{"team":"Houston Rockets","city":"Houston, TX"}'::jsonb),
  ('Gainbridge Fieldhouse', 'IND', 12, '{"team":"Indiana Pacers","city":"Indianapolis, IN"}'::jsonb),
  ('Intuit Dome', 'LAC', 13, '{"team":"LA Clippers","city":"Inglewood, CA"}'::jsonb),
  ('Crypto.com Arena', 'LAL', 14, '{"team":"Los Angeles Lakers","city":"Los Angeles, CA"}'::jsonb),
  ('FedExForum', 'MEM', 15, '{"team":"Memphis Grizzlies","city":"Memphis, TN"}'::jsonb),
  ('Kaseya Center', 'MIA', 16, '{"team":"Miami Heat","city":"Miami, FL"}'::jsonb),
  ('Fiserv Forum', 'MIL', 17, '{"team":"Milwaukee Bucks","city":"Milwaukee, WI"}'::jsonb),
  ('Target Center', 'MIN', 18, '{"team":"Minnesota Timberwolves","city":"Minneapolis, MN"}'::jsonb),
  ('Smoothie King Center', 'NOP', 19, '{"team":"New Orleans Pelicans","city":"New Orleans, LA"}'::jsonb),
  ('Madison Square Garden', 'NYK', 20, '{"team":"New York Knicks","city":"New York, NY"}'::jsonb),
  ('Paycom Center', 'OKC', 21, '{"team":"Oklahoma City Thunder","city":"Oklahoma City, OK"}'::jsonb),
  ('Kia Center', 'ORL', 22, '{"team":"Orlando Magic","city":"Orlando, FL"}'::jsonb),
  ('Wells Fargo Center', 'PHI', 23, '{"team":"Philadelphia 76ers","city":"Philadelphia, PA"}'::jsonb),
  ('PHX Arena', 'PHX', 24, '{"team":"Phoenix Suns","city":"Phoenix, AZ"}'::jsonb),
  ('Moda Center', 'POR', 25, '{"team":"Portland Trail Blazers","city":"Portland, OR"}'::jsonb),
  ('Golden 1 Center', 'SAC', 26, '{"team":"Sacramento Kings","city":"Sacramento, CA"}'::jsonb),
  ('Frost Bank Center', 'SAS', 27, '{"team":"San Antonio Spurs","city":"San Antonio, TX"}'::jsonb),
  ('Scotiabank Arena', 'TOR', 28, '{"team":"Toronto Raptors","city":"Toronto, ON, Canada"}'::jsonb),
  ('Delta Center', 'UTA', 29, '{"team":"Utah Jazz","city":"Salt Lake City, UT"}'::jsonb),
  ('Capital One Arena', 'WAS', 30, '{"team":"Washington Wizards","city":"Washington, DC"}'::jsonb)
) as v(name, code, sort_order, metadata);
