-- Difficulty tier drives how many points a list's items are worth --
-- see src/lib/difficulty.ts for the tier -> points-per-item lookup.
-- Every list MUST have a tier: NOT NULL + a check constraint, so a new
-- list seeded without one fails its migration loudly instead of silently
-- scoring 0 forever.
alter table public.lists add column difficulty_tier text;

update public.lists set difficulty_tier = 'low'
  where slug in ('us-states', 'pixar-films', 'studio-ghibli-films');
update public.lists set difficulty_tier = 'medium-low'
  where slug in ('nba-arenas', 'nfl-stadiums', 'nhl-arenas', 'mlb-stadiums');
update public.lists set difficulty_tier = 'medium'
  where slug in ('national-parks');
update public.lists set difficulty_tier = 'medium-high'
  where slug in ('countries', 'new-7-wonders');
update public.lists set difficulty_tier = 'high'
  where slug in ('continents', 'f1-circuits');
update public.lists set difficulty_tier = 'very-high'
  where slug in ('grand-slam-tennis', 'world-marathon-majors');

alter table public.lists
  alter column difficulty_tier set not null,
  add constraint lists_difficulty_tier_check
    check (difficulty_tier in ('low', 'medium-low', 'medium', 'medium-high', 'high', 'very-high'));
