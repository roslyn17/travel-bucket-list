"use client";

import { useMemo, useState } from "react";
import type { ItemWithProgress } from "@/lib/types";
import ItemRow from "./ItemRow";

export default function ListItemsClient({
  listSlug,
  items,
}: {
  listSlug: string;
  items: ItemWithProgress[];
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(({ item }) => item.name.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div>
      <input
        type="search"
        placeholder="Filter..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-4 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {filtered.map(({ item, progress }) => (
          <ItemRow key={item.id} listSlug={listSlug} item={item} initialProgress={progress} />
        ))}
        {filtered.length === 0 && (
          <li className="py-6 text-center text-sm text-zinc-500">No matches.</li>
        )}
      </ul>
    </div>
  );
}
