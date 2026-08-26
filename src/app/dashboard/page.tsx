import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { List } from "@/lib/types";

const LIST_EMOJI: Record<string, string> = {
  countries: "🌍",
  "national-parks": "🏞️",
  "us-states": "🗺️",
  "mlb-stadiums": "⚾",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: lists }, { data: items }, { data: progress }] = await Promise.all([
    supabase.from("lists").select("*").order("slug"),
    supabase.from("list_items").select("id, list_id"),
    supabase.from("user_progress").select("list_item_id").eq("user_id", user.id).eq("visited", true),
  ]);

  const itemsByList = new Map<string, number>();
  for (const item of items ?? []) {
    itemsByList.set(item.list_id, (itemsByList.get(item.list_id) ?? 0) + 1);
  }

  const visitedItemIds = new Set((progress ?? []).map((p) => p.list_item_id));
  const itemToList = new Map((items ?? []).map((i) => [i.id, i.list_id]));
  const visitedByList = new Map<string, number>();
  for (const itemId of visitedItemIds) {
    const listId = itemToList.get(itemId);
    if (listId) visitedByList.set(listId, (visitedByList.get(listId) ?? 0) + 1);
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Your bucket lists
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {(lists as List[] | null)?.map((list) => {
          const total = itemsByList.get(list.id) ?? 0;
          const visited = visitedByList.get(list.id) ?? 0;
          const pct = total > 0 ? Math.round((visited / total) * 100) : 0;
          return (
            <Link
              key={list.id}
              href={`/lists/${list.slug}`}
              className="rounded-lg border border-zinc-200 p-5 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xl">{LIST_EMOJI[list.slug] ?? "📍"}</span>
                <h2 className="font-medium text-zinc-900 dark:text-zinc-50">{list.name}</h2>
              </div>
              <p className="mb-3 text-sm text-zinc-500">
                {visited} / {total} visited
              </p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-zinc-900 dark:bg-zinc-50"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
