import type { ListGroup } from "./types";

// Display config for the top-level list groups, in the order they should
// appear on the "Add a bucket list" browse page.
export const LIST_GROUPS: { key: ListGroup; label: string; emoji: string }[] = [
  { key: "places", label: "Travel", emoji: "🌍" },
  { key: "experiences_challenges", label: "Experiences & Challenges", emoji: "🎯" },
  { key: "culture_media", label: "Culture & Media", emoji: "🎬" },
];
