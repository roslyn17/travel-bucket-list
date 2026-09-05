-- Lets a user opt in to a read-only public profile page at /u/[display name]
-- (see src/app/u/[username]/page.tsx), shareable as a snapshot image (see
-- src/lib/shareSnapshot.ts). Off by default -- nothing is publicly visible
-- until a user explicitly flips this on. Visibility is all-or-nothing, no
-- per-list hiding.
alter table public.profiles add column is_public boolean not null default false;

-- There's no separate "username" field -- the editable display_name doubles
-- as the public handle in the /u/[username] URL, so it must resolve to
-- exactly one profile. Enforced case-insensitively; multiple profiles may
-- still share a null (unset) display_name, since only public ones are ever
-- looked up by it.
create unique index profiles_display_name_unique_idx
  on public.profiles (lower(display_name))
  where display_name is not null;

create policy "Public profiles are viewable by anyone"
  on public.profiles for select
  using (is_public = true);

-- A public profile's list selections and checked-off items need to be
-- readable by anyone (including signed-out visitors) too, so the public
-- profile page can render them -- previously these were locked to
-- auth.uid() = user_id only.
create policy "Public profile's list selections are viewable by anyone"
  on public.user_lists for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = user_lists.user_id and p.is_public = true
    )
  );

create policy "Public profile's progress is viewable by anyone"
  on public.user_progress for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = user_progress.user_id and p.is_public = true
    )
  );
