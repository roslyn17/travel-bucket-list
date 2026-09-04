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
