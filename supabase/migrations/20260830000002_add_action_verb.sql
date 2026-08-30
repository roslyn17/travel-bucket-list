-- "Visited" doesn't make sense for every list type (you don't "visit" a
-- marathon or a movie). Lets each list say what checking off an item
-- actually means, shown in place of "visited" wherever progress is
-- summarized (e.g. "12 / 30 watched").
alter table public.lists add column action_verb text not null default 'Visited';

update public.lists set action_verb = 'Ran' where slug = 'world-marathon-majors';
update public.lists set action_verb = 'Attended' where slug = 'grand-slam-tennis';
update public.lists set action_verb = 'Watched' where slug in ('f1-circuits', 'studio-ghibli-films', 'pixar-films');
