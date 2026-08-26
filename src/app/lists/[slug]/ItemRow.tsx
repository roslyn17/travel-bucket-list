"use client";

import { useState, useTransition } from "react";
import type { DatePrecision, ListItem, UserProgress } from "@/lib/types";
import { formatVisitedDate } from "@/lib/date";
import { clearVisitedDate, setVisited, setVisitedDate } from "./actions";

const CURRENT_YEAR = new Date().getFullYear();

export default function ItemRow({
  listSlug,
  item,
  initialProgress,
}: {
  listSlug: string;
  item: ListItem;
  initialProgress: UserProgress | null;
}) {
  const [progress, setProgress] = useState(initialProgress);
  const [editingDate, setEditingDate] = useState(false);
  const [precision, setPrecision] = useState<DatePrecision>(
    progress?.visited_precision ?? "day",
  );
  const [dateValue, setDateValue] = useState(() => toInputValue(progress, precision));
  const [isPending, startTransition] = useTransition();

  const visited = progress?.visited ?? false;
  const savedDateLabel =
    progress?.visited_on && progress.visited_precision
      ? formatVisitedDate(progress.visited_on, progress.visited_precision)
      : null;

  function toggleVisited(next: boolean) {
    startTransition(async () => {
      await setVisited(item.id, listSlug, next);
      setProgress((prev) =>
        next
          ? { ...(prev ?? emptyProgress(item.id)), visited: true }
          : { ...(prev ?? emptyProgress(item.id)), visited: false, visited_on: null, visited_precision: null },
      );
      if (!next) setEditingDate(false);
    });
  }

  function saveDate() {
    const visitedOn = toVisitedOn(dateValue, precision);
    if (!visitedOn) return;
    startTransition(async () => {
      await setVisitedDate(item.id, listSlug, visitedOn, precision);
      setProgress((prev) => ({
        ...(prev ?? emptyProgress(item.id)),
        visited: true,
        visited_on: visitedOn,
        visited_precision: precision,
      }));
      setEditingDate(false);
    });
  }

  function clearDate() {
    startTransition(async () => {
      await clearVisitedDate(item.id, listSlug);
      setProgress((prev) => ({
        ...(prev ?? emptyProgress(item.id)),
        visited: true,
        visited_on: null,
        visited_precision: null,
      }));
      setEditingDate(false);
    });
  }

  return (
    <li className="py-3">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={visited}
          disabled={isPending}
          onChange={(e) => toggleVisited(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700"
        />
        <div className="flex-1">
          <span className={visited ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-700 dark:text-zinc-300"}>
            {item.name}
          </span>
          {item.metadata?.state && (
            <span className="ml-2 text-xs text-zinc-400">{item.metadata.state}</span>
          )}
        </div>
        {visited && !editingDate && (
          <button
            onClick={() => setEditingDate(true)}
            className="text-xs text-zinc-500 underline hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            {savedDateLabel ?? "Add date"}
          </button>
        )}
      </div>

      {visited && editingDate && (
        <div className="mt-2 ml-7 flex flex-wrap items-center gap-2">
          <select
            value={precision}
            onChange={(e) => {
              const next = e.target.value as DatePrecision;
              setPrecision(next);
              setDateValue(toInputValue(progress, next));
            }}
            className="rounded-md border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="day">Exact date</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>

          {precision === "day" && (
            <input
              type="date"
              value={dateValue}
              max={`${CURRENT_YEAR}-12-31`}
              onChange={(e) => setDateValue(e.target.value)}
              className="rounded-md border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
            />
          )}
          {precision === "month" && (
            <input
              type="month"
              value={dateValue}
              max={`${CURRENT_YEAR}-12`}
              onChange={(e) => setDateValue(e.target.value)}
              className="rounded-md border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
            />
          )}
          {precision === "year" && (
            <input
              type="number"
              value={dateValue}
              min={1900}
              max={CURRENT_YEAR}
              onChange={(e) => setDateValue(e.target.value)}
              className="w-20 rounded-md border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
            />
          )}

          <button
            onClick={saveDate}
            disabled={isPending || !dateValue}
            className="rounded-md bg-zinc-900 px-2 py-1 text-xs font-medium text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
          >
            Save
          </button>
          {progress?.visited_on && (
            <button
              onClick={clearDate}
              disabled={isPending}
              className="text-xs text-zinc-500 underline hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setEditingDate(false)}
            className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            Cancel
          </button>
        </div>
      )}
    </li>
  );
}

function emptyProgress(listItemId: string): UserProgress {
  return {
    id: "",
    user_id: "",
    list_item_id: listItemId,
    visited: false,
    visited_on: null,
    visited_precision: null,
  };
}

/** Builds the initial value for the date input matching the given precision. */
function toInputValue(progress: UserProgress | null, precision: DatePrecision): string {
  if (!progress?.visited_on) {
    return precision === "year" ? String(CURRENT_YEAR) : "";
  }
  const [year, month, day] = progress.visited_on.split("-");
  if (precision === "year") return year;
  if (precision === "month") return `${year}-${month}`;
  return progress.visited_precision === "day" ? `${year}-${month}-${day}` : "";
}

/** Normalizes a raw input value into a full YYYY-MM-DD for storage. */
function toVisitedOn(value: string, precision: DatePrecision): string | null {
  if (!value) return null;
  if (precision === "day") return value; // already YYYY-MM-DD
  if (precision === "month") return `${value}-01`; // value is YYYY-MM
  const year = parseInt(value, 10);
  if (!Number.isFinite(year)) return null;
  return `${String(year).padStart(4, "0")}-01-01`;
}
