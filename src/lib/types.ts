export type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  /** Whether /u/[display_name] is publicly viewable. All-or-nothing --
   * there's no per-list hiding. display_name doubles as the public handle,
   * so it must be set before this can be turned on (see profileActions.ts). */
  is_public: boolean;
};

// Top-level grouping for the "Add a bucket list" browse page. Kept as a
// plain string union (backed by a text + check constraint in the DB, not a
// native enum) so adding a group later doesn't require a breaking type
// migration -- see src/lib/listGroups.ts for display config.
export type ListGroup = "places" | "experiences_challenges" | "culture_media";

// How many points each checked-off item on a list is worth -- see
// src/lib/difficulty.ts for the tier -> points lookup and display labels.
// Every list in the DB has one (NOT NULL + check constraint); any new list
// added to the catalog MUST specify a tier or its seed migration will fail.
export type DifficultyTier = "low" | "medium-low" | "medium" | "medium-high" | "high" | "very-high";

export type List = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  list_group: ListGroup;
  /** What checking off an item on this list means, e.g. "Visited", "Watched", "Ran". */
  action_verb: string;
  difficulty_tier: DifficultyTier;
};

export type ListItem = {
  id: string;
  list_id: string;
  name: string;
  code: string | null;
  sort_order: number;
  metadata: Record<string, string>;
};

export type DatePrecision = "day" | "month" | "year";

export type UserProgress = {
  id: string;
  user_id: string;
  list_item_id: string;
  visited: boolean;
  visited_on: string | null;
  visited_precision: DatePrecision | null;
};

export type ItemWithProgress = {
  item: ListItem;
  progress: UserProgress | null;
};
