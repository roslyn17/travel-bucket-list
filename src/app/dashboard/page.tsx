import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { List, Profile } from "@/lib/types";
import { LIST_EMOJI } from "@/lib/listEmoji";
import { removeList } from "@/lib/listActions";
import { getRankProgress } from "@/lib/rank";
import { getProfileStats } from "@/lib/profileStats";
import AvatarPicker from "@/components/AvatarPicker";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: allLists }, { data: userLists }, { data: items }, { data: progress }, { data: profile }, stats] =
    await Promise.all([
      supabase.from("lists").select("*").order("slug"),
      supabase.from("user_lists").select("list_id").eq("user_id", user.id),
      supabase.from("list_items").select("id, list_id"),
      supabase.from("user_progress").select("list_item_id").eq("user_id", user.id).eq("visited", true),
      supabase.from("profiles").select("id, email, display_name, avatar_url").eq("id", user.id).single(),
      getProfileStats(supabase, user.id),
    ]);

  const addedListIds = new Set((userLists ?? []).map((ul) => ul.list_id));
  const lists = (allLists as List[] | null)?.filter((list) => addedListIds.has(list.id)) ?? [];

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

  const displayName =
    (profile as Profile | null)?.display_name || user.email?.split("@")[0] || "Explorer";
  const { rank, nextRank, progressPct, pointsToNext } = getRankProgress(stats.totalVisited);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
        <AvatarPicker initialAvatarUrl={(profile as Profile | null)?.avatar_url ?? null} />

        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{displayName}</h1>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {lists.map((list) => {
          const total = itemsByList.get(list.id) ?? 0;
          const visited = visitedByList.get(list.id) ?? 0;
          const pct = total > 0 ? Math.round((visited / total) * 100) : 0;
          return (
            <div
              key={list.id}
              className="rounded-lg border border-zinc-200 p-5 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
            >
              <Link href={`/lists/${list.slug}`} className="block">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xl">{LIST_EMOJI[list.slug] ?? "📍"}</span>
                  <h2 className="font-medium text-zinc-900 dark:text-zinc-50">{list.name}</h2>
                </div>
                <p className="mb-3 text-sm text-zinc-500">
                  {visited} / {total} {list.action_verb.toLowerCase()}
                </p>
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-zinc-900 dark:bg-zinc-50"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </Link>
              <form
                action={async () => {
                  "use server";
                  await removeList(list.id, list.slug);
                }}
                className="mt-3"
              >
                <button
                  type="submit"
                  className="text-xs text-zinc-400 underline hover:text-red-600 dark:hover:text-red-400"
                >
                  Remove
                </button>
              </form>
            </div>
          );
        })}
      </div>
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
