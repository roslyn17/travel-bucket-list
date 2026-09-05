// Fallback avatar rendering (initials on a colored circle) for contexts
// where there's no editable avatar picker -- the public profile page
// (components/AvatarDisplay.tsx) and the shareable snapshot image
// (lib/shareSnapshot.ts), which draws the same colors directly on canvas so
// the two stay visually consistent.

const AVATAR_COLORS: { bg: string; fg: string }[] = [
  { bg: "#0d9488", fg: "#ffffff" }, // teal
  { bg: "#2563eb", fg: "#ffffff" }, // blue
  { bg: "#9333ea", fg: "#ffffff" }, // purple
  { bg: "#db2777", fg: "#ffffff" }, // pink
  { bg: "#ea580c", fg: "#ffffff" }, // orange
  { bg: "#16a34a", fg: "#ffffff" }, // green
];

/** Deterministic hash so the same name always lands on the same color. */
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getAvatarColorHex(seed: string): { bg: string; fg: string } {
  if (!seed) return AVATAR_COLORS[0];
  return AVATAR_COLORS[hashString(seed) % AVATAR_COLORS.length];
}

/** First letter of up to the first and last "words" in a name, e.g.
 * "Jane Doe" -> "JD", "Roslyn" -> "RO". */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
