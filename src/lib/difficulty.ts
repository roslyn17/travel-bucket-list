import type { DifficultyTier } from "@/lib/types";

/**
 * Points awarded per item checked off, by the item's list's difficulty
 * tier. No completion bonus -- a list's total score is just this value
 * times however many of its items are checked off.
 *
 * `satisfies Record<DifficultyTier, number>` means adding a new tier to
 * the `DifficultyTier` union without adding it here is a compile error --
 * see lib/types.ts for the other half of that guarantee (every list row
 * must have a tier at all).
 */
export const POINTS_BY_TIER = {
  low: 1,
  "medium-low": 3,
  medium: 5,
  "medium-high": 10,
  high: 15,
  "very-high": 20,
} as const satisfies Record<DifficultyTier, number>;

/** Tiers in ascending difficulty order, with display labels -- for the
 * scoring legend shown to users (see ScoringInfoModal). */
export const DIFFICULTY_TIERS: { tier: DifficultyTier; label: string; points: number }[] = [
  { tier: "low", label: "Low", points: POINTS_BY_TIER.low },
  { tier: "medium-low", label: "Medium-low", points: POINTS_BY_TIER["medium-low"] },
  { tier: "medium", label: "Medium", points: POINTS_BY_TIER.medium },
  { tier: "medium-high", label: "Medium-high", points: POINTS_BY_TIER["medium-high"] },
  { tier: "high", label: "High", points: POINTS_BY_TIER.high },
  { tier: "very-high", label: "Very high", points: POINTS_BY_TIER["very-high"] },
];

/** tier -> display label, e.g. for a "Medium" badge on a list card. */
export const DIFFICULTY_TIER_LABELS = Object.fromEntries(
  DIFFICULTY_TIERS.map(({ tier, label }) => [tier, label]),
) as Record<DifficultyTier, string>;

/** tier -> badge color classes, ramping green (easy) to purple (hardest) --
 * see components/DifficultyBadge.tsx, the one place these get applied. */
export const DIFFICULTY_TIER_COLORS: Record<DifficultyTier, string> = {
  low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  "medium-low": "bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-300",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  "medium-high": "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  high: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  "very-high": "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
};
