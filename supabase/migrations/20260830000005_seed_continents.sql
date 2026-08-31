-- New list type: the 7 continents, under the Travel category (list_group =
-- 'places'). action_verb stays at its default ('Visited'), same as the
-- other places-category lists.
insert into public.lists (slug, name, description, category, list_group) values
  ('continents', 'The 7 Continents', 'Set foot on all seven continents.', 'Continents', 'places');
