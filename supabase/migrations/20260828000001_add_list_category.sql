-- Groups predefined lists for the "Add a bucket list" catalog page.
alter table public.lists add column category text;

update public.lists set category = 'Geography' where slug in ('countries', 'us-states');
update public.lists set category = 'Sports Venues' where slug in ('mlb-stadiums', 'nfl-stadiums', 'nba-arenas');
update public.lists set category = 'Landmarks & Nature' where slug in ('national-parks', 'new-7-wonders');

alter table public.lists alter column category set not null;
