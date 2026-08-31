import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { List, Profile } from "@/lib/types";
import { getRankProgress } from "@/lib/rank";
import { getProfileStats } from "@/lib/profileStats";
import AvatarPicker from "@/components/AvatarPicker";
import DisplayNameEditor from "@/components/DisplayNameEditor";
import SortableListGrid, { type DashboardListCard } from "@/components/SortableListGrid";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: userListRows }, { data: items }, { data: progress }, { data: profile }, stats] =
    await Promise.all([
      supabase
        .from("user_lists")
        .select("sort_order, list:lists(*)")
        .eq("user_id", user.id)
        .order("sort_order", { ascending: true })
        .returns<{ sort_order: number; list: List }[]>(),
      supabase.from("list_items").select("id, list_id"),
      supabase.from("user_progress").select("list_item_id").eq("user_id", user.id).eq("visited", true),
      supabase.from("profiles").select("id, email, display_name, avatar_url").eq("id", user.id).single(),
      getProfileStats(supabase, user.id),
    ]);

  const lists = (userListRows ?? []).map((row) => row.list);

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

  const { rank, nextRank, progressPct, pointsToNext } = getRankProgress(stats.totalVisited);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
        <AvatarPicker initialAvatarUrl={(profile as Profile | null)?.avatar_url ?? null} />

        <div className="flex-1">
          <DisplayNameEditor
            initialName={(profile as Profile | null)?.display_name ?? null}
            fallbackName={user.email?.split("@")[0] || "Explorer"}
          />
          <p className="mt-1 text-sm font-medium text-zinc-500">{rank.name}</p>

          <div className="mt-3 max-w-sm">
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-zinc-900 dark:bg-zinc-50"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-zinc-500">
              {nextRank
                ? `${pointsToNext} pt${pointsToNext === 1 ? "" : "s"} to ${nextRank.name}`
                : "Top rank reached!"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-4">
        <StatTile label="Items completed" value={stats.totalVisited} />
        <StatTile label="Lists completed" value={stats.listsCompleted} />
      </div>

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Your bucket lists
        </h2>
        <Link
          href="/lists/add"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          + Add bucket list
        </Link>
      </div>

      {lists.length === 0 && (
        <div className="rounded-lg border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500">
            You haven&apos;t added any bucket lists yet. Click &ldquo;+ Add bucket list&rdquo; above to get started.
          </p>
        </div>
      )}

      <SortableListGrid
        lists={lists.map((list): DashboardListCard => {
          const total = itemsByList.get(list.id) ?? 0;
          const visited = visitedByList.get(list.id) ?? 0;
          const pct = total > 0 ? Math.round((visited / total) * 100) : 0;
          return {
            id: list.id,
            slug: list.slug,
            name: list.name,
            actionVerb: list.action_verb,
            visited,
            total,
            pct,
          };
        })}
      />
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-5 text-center dark:border-zinc-800">
      <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{label}</p>
    </div>
  );
}
