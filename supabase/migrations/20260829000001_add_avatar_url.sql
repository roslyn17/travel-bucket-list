-- Lets users set a profile picture: either an uploaded photo (stored in the
-- 'avatars' Storage bucket, see next migration) or one of the app's built-in
-- preset images (served from /public/avatars, referenced by path).
alter table public.profiles add column avatar_url text;
