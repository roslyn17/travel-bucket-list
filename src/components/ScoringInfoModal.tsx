"use client";

import { useState } from "react";
import { DIFFICULTY_TIERS } from "@/lib/difficulty";

/** Info button + modal explaining how points and levels work, opened from
 * next to the level display on the dashboard. */
export default function ScoringInfoModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="How scoring works"
        className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        ⓘ
      </button>

      {open && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-5 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
              How scoring works
            </p>
            <p className="mb-4 text-sm text-zinc-500">
              Points are earned by completing items — harder or rarer items are worth more,
              from 1 pt (easy) up to 20 pts (very hard). Level up as you rack up points across
              all your bucket lists.
            </p>

            <ul className="divide-y divide-zinc-100 text-sm dark:divide-zinc-800">
              {DIFFICULTY_TIERS.map(({ tier, label, points }) => (
                <li key={tier} className="flex items-center justify-between py-1.5">
                  <span className="text-zinc-600 dark:text-zinc-300">{label}</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {points} pt{points === 1 ? "" : "s"}/item
                  </span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
