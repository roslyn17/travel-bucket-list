-- The 5 new list types for the Experiences & Challenges and Culture & Media
-- categories. `category` values here are just the finer freeform label
-- (unused by the browse page's grouping, which now runs off list_group) --
-- kept populated for consistency with existing rows.
insert into public.lists (slug, name, description, category, list_group) values
  ('world-marathon-majors', 'World Marathon Majors', 'Run all seven races in the Abbott World Marathon Majors series.', 'Sports Events', 'experiences_challenges'),
  ('grand-slam-tennis', 'Watch Grand Slam Tennis Tournaments', 'Attend all four of tennis''s Grand Slam tournaments in person.', 'Sports Events', 'experiences_challenges'),
  ('f1-circuits', 'Formula 1 Circuits', 'Watch a race live at every circuit on the current F1 calendar.', 'Sports Events', 'experiences_challenges'),
  ('studio-ghibli-films', 'Studio Ghibli Films', 'Watch the complete theatrical feature filmography from Studio Ghibli.', 'Film', 'culture_media'),
  ('pixar-films', 'Pixar Feature Films', 'Watch the complete theatrical feature filmography from Pixar Animation Studios.', 'Film', 'culture_media');
