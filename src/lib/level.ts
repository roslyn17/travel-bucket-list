// Levels derived from a user's total points -- one single track across all
// lists and categories combined, not tracked per-category. Points come from
// checking off items, weighted by each list's difficulty tier -- see
// lib/difficulty.ts. Levels are ranges: a user's level is whichever range
// their current total falls into, not an exact-match threshold.
export type Level = {
  name: string;
  minPoints: number;
};

export const LEVELS: Level[] = [
  { name: "Beginner", minPoints: 0 },
  { name: "Enthusiast", minPoints: 75 },
  { name: "Achiever", minPoints: 200 },
  { name: "Collector", minPoints: 450 },
  { name: "Completionist", minPoints: 900 },
  { name: "Legend", minPoints: 1800 },
  { name: "Grandmaster", minPoints: 3500 },
];

export type LevelProgress = {
  level: Level;
  nextLevel: Level | null;
  /** 0-100, how far through the current level's range the total is. 100 at the top level. */
  progressPct: number;
  /** Points needed to reach nextLevel; null at the top level (there's nothing next). */
  pointsToNext: number | null;
};

export function getLevelProgress(totalPoints: number): LevelProgress {
  let currentIndex = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (totalPoints >= LEVELS[i].minPoints) currentIndex = i;
  }
  const level = LEVELS[currentIndex];
  const nextLevel = LEVELS[currentIndex + 1] ?? null;

  if (!nextLevel) {
    return { level, nextLevel: null, progressPct: 100, pointsToNext: null };
  }

  const span = nextLevel.minPoints - level.minPoints;
  const progress = totalPoints - level.minPoints;
  const progressPct = Math.max(0, Math.min(100, Math.round((progress / span) * 100)));

  return { level, nextLevel, progressPct, pointsToNext: nextLevel.minPoints - totalPoints };
}
