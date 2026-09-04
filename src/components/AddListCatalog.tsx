"use client";

import { useMemo, useState } from "react";
import type { List, ListGroup } from "@/lib/types";
import { DIFFICULTY_FILTER_TIERS, DIFFICULTY_TIER_LABELS, POINTS_BY_TIER } from "@/lib/difficulty";
import { LIST_EMOJI } from "@/lib/listEmoji";
import { addList } from "@/lib/listActions";

export type CatalogGroup = {
  key: ListGroup;
  label: string;
  emoji: string;
  /** Every list in this category, added or not -- for the header count. */
  totalCount: number;
  /** Lists not yet on the user's dashboard -- what's actually offered below. */
  available: List[];
};

type DifficultyFilter = "all" | keyof typeof DIFFICULTY_FILTER_TIERS;

const DIFFICULTY_FILTER_OPTIONS: { value: DifficultyFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "low-medium", label: "Low–Medium" },
  { value: "high-very-high", label: "High–Very high" },
];

/**
 * Search + difficulty filtering happen entirely client-side over the
 * catalog data the page already fetched -- with only ~14 lists total,
 * there's no backend query support needed for this; it's just an
 * in-memory filter over data already on the page.
 */
export default function AddListCatalog({ groups }: { groups: CatalogGroup[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups.map((group) => ({
      ...group,
      filtered: group.available.filter((list) => {
        const matchesQuery = !q || list.name.toLowerCase().includes(q);
        const matchesDifficulty =
          difficulty === "all" ||
          (difficulty === "low-medium" &&
            DIFFICULTY_FILTER_TIERS["low-medium"].includes(list.difficulty_tier)) ||
          (difficulty === "high-very-high" &&
            DIFFICULTY_FILTER_TIERS["high-very-high"].includes(list.difficulty_tier));
        return matchesQuery && matchesDifficulty;
      }),
    }));
  }, [groups, query, difficulty]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          placeholder="Search bucket lists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <div className="flex gap-2">
          {DIFFICULTY_FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setDifficulty(option.value)}
              className={`rounded-md border px-3 py-2 text-sm whitespace-nowrap ${
                difficulty === option.value
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                  : "border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {filteredGroups.map((group) => (
        <div key={group.key} className="mb-10">
          <h2 className="mb-4 border-b border-zinc-200 pb-2 text-lg font-semibold text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
            {group.emoji} {group.label}
            <span className="ml-2 text-sm font-normal text-zinc-400">
              — {group.totalCount} list{group.totalCount === 1 ? "" : "s"}
            </span>
          </h2>
          {group.available.length === 0 ? (
            <p className="text-sm text-zinc-500">You&apos;ve added every list in this category.</p>
          ) : group.filtered.length === 0 ? (
            <p className="text-sm text-zinc-500">No lists match your search.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {group.filtered.map((list) => (
                <ListCard key={list.id} list={list} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ListCard({ list }: { list: List }) {
  return (
    <div className="flex flex-col rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
      <div className="mb-4 flex-1">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xl">{LIST_EMOJI[list.slug] ?? "📍"}</span>
          <h3 className="font-medium text-zinc-900 dark:text-zinc-50">{list.name}</h3>
        </div>
        <p className="mb-2 text-xs text-zinc-400">
          {DIFFICULTY_TIER_LABELS[list.difficulty_tier]} · {POINTS_BY_TIER[list.difficulty_tier]} pts / item
        </p>
        {list.description && <p className="text-sm text-zinc-500">{list.description}</p>}
      </div>
      <form
        action={async () => {
          await addList(list.id, list.slug);
        }}
      >
        <button
          type="submit"
          className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          + Add to my lists
        </button>
      </form>
    </div>
  );
}
