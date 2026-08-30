// Ranks derived from a user's total score (1 point per item checked off,
// across all their lists). Thresholds are sized against the current item
// pool (~440 items across all lists): 151+ pts means visiting roughly a
// third of everything in the app, which is a lot of ground to cover, so it
// reads as a real top tier rather than something everyone hits fast.
export type Rank = {
  name: string;
  minScore: number;
};

export const RANKS: Rank[] = [
  { name: "Novice Explorer", minScore: 0 },
  { name: "Globetrotter", minScore: 51 },
  { name: "Legendary Wanderer", minScore: 151 },
];

export type RankProgress = {
  rank: Rank;
  nextRank: Rank | null;
  /** 0-100, how far through the current rank's range the score is. 100 once there's no next rank. */
  progressPct: number;
  /** Points needed to reach nextRank; null at the top rank. */
  pointsToNext: number | null;
};

export function getRankProgress(score: number): RankProgress {
  let currentIndex = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (score >= RANKS[i].minScore) currentIndex = i;
  }
  const rank = RANKS[currentIndex];
  const nextRank = RANKS[currentIndex + 1] ?? null;

  if (!nextRank) {
    return { rank, nextRank: null, progressPct: 100, pointsToNext: null };
  }

  const span = nextRank.minScore - rank.minScore;
  const progress = score - rank.minScore;
  const progressPct = Math.max(0, Math.min(100, Math.round((progress / span) * 100)));

  return { rank, nextRank, progressPct, pointsToNext: nextRank.minScore - score };
}
