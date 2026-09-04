import type { DifficultyTier } from "@/lib/types";
import { DIFFICULTY_TIER_COLORS, DIFFICULTY_TIER_LABELS } from "@/lib/difficulty";

/** Small color-coded pill for a list's difficulty tier -- green (low) to
 * purple (very high) -- shared by the dashboard cards, the catalog cards,
 * and the scoring info modal's legend, so the color-to-tier mapping reads
 * the same everywhere. */
export default function DifficultyBadge({ tier }: { tier: DifficultyTier }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${DIFFICULTY_TIER_COLORS[tier]}`}
    >
      {DIFFICULTY_TIER_LABELS[tier]}
    </span>
  );
}
