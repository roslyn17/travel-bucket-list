import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { DifficultyTier, List, Profile } from "@/lib/types";
import { POINTS_BY_TIER } from "@/lib/difficulty";
import { getLevelProgress } from "@/lib/level";
import { computeProfileStats } from "@/lib/profileStats";
import AvatarDisplay from "@/components/AvatarDisplay";
import DifficultyBadge from "@/components/DifficultyBadge";
import ScoringInfoModal from "@/components/ScoringInfoModal";
import StatTile from "@/components/StatTile";
import { LIST_EMOJI } from "@/lib/listEmoji";
import type { DashboardListCard } from "@/components/SortableListGrid";

/**
 * Read-only public profile at /u/[display_name] -- display_name doubles as
 * the public handle (see the unique index in
 * 20260904000001_add_profile_public_sharing.sql), so this looks a profile
 * up by it rather than by a separate username field. Private profiles (or a
 * name that doesn't match any public profile) render the same "this
 * profile is private" message -- never a hard 404/error -- so a visitor
 * can't tell the difference between "wrong name" and "exists but private".
 */
export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const decoded = decodeURIComponent(username);
  // Escape LIKE metacharacters so a display name containing "%" or "_"
  // can't turn this lookup into a wildcard match.
  const escaped = decoded.replace(/[%_]/g, (c) => `\\${c}`);

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, display_name, avatar_url, is_public")
    .eq("is_public", true)
    .ilike("display_name", escaped)
    .maybeSingle<Profile>();

  if (!profile) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">This profile is private</p>
        <p className="mt-2 text-sm text-zinc-500">
          Either it doesn&apos;t exist, or the owner hasn&apos;t made it public.
        </p>
        <Link href="/" className="mt-6 text-sm font-medium text-zinc-900 underline dark:text-zinc-50">
          ← Back home
        </Link>
      </div>
    );
  }

  const displayName = profile.display_name!;

  const [
    { data: userListRows, error: userListsError },
    { data: items, error: itemsError },
    { data: progress, error: progressError },
    { data: listTiers, error: listTiersError },
  ] = await Promise.all([
    supabase
      .from("user_lists")
      .select("sort_order, list:lists(*)")
      .eq("user_id", profile.id)
      .order("sort_order", { ascending: true })
      .returns<{ sort_order: number; list: List }[]>(),
    supabase.from("list_items").select("id, list_id"),
    supabase.from("user_progress").select("list_item_id").eq("user_id", profile.id).eq("visited", true),
    supabase.from("lists").select("id, difficulty_tier").returns<{ id: string; difficulty_tier: DifficultyTier }[]>(),
  ]);

  const queryError = userListsError ?? itemsError ?? progressError ?? listTiersError;
  if (queryError) throw queryError;

  const lists = (userListRows ?? []).map((row) => row.list);
  const stats = computeProfileStats(userListRows ?? [], items ?? [], progress ?? [], listTiers ?? []);

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

  const { level, nextLevel, progressPct, pointsToNext } = getLevelProgress(stats.totalPoints);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
        <AvatarDisplay avatarUrl={profile.avatar_url} name={displayName} />

        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{displayName}</h1>
          <div className="mt-1 flex items-center justify-center gap-1.5 text-sm font-medium text-zinc-500 sm:justify-start">
            {level.name}
            <ScoringInfoModal />
          </div>

          <div className="mt-3 max-w-sm">
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-zinc-900 dark:bg-zinc-50"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-zinc-500">
              {nextLevel
                ? `${pointsToNext} pt${pointsToNext === 1 ? "" : "s"} to ${nextLevel.name}`
                : "Max level reached!"}
            </p>
          </div>
        </div>
      </div>

      <div className={`mb-10 grid gap-4 ${stats.listsCompleted > 0 ? "grid-cols-3" : "grid-cols-2"}`}>
        <StatTile label="Total points earned" value={stats.totalPoints} />
        <StatTile label="Items completed" value={stats.totalVisited} />
        {stats.listsCompleted > 0 && <StatTile label="Lists completed" value={stats.listsCompleted} />}
      </div>

      <h2 className="mb-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {displayName}&apos;s bucket lists
      </h2>

      {lists.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500">{displayName} hasn&apos;t added any bucket lists yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {lists.map((list) => {
            const total = itemsByList.get(list.id) ?? 0;
            const visited = visitedByList.get(list.id) ?? 0;
            const pct = total > 0 ? Math.round((visited / total) * 100) : 0;
            const card: DashboardListCard = {
              id: list.id,
              slug: list.slug,
              name: list.name,
              actionVerb: list.action_verb,
              visited,
              total,
              pct,
              difficultyTier: list.difficulty_tier,
              pointsPerItem: POINTS_BY_TIER[list.difficulty_tier],
            };
            return <PublicListCard key={card.id} list={card} />;
          })}
        </div>
      )}

      <div className="mt-10 rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Want to track your own travel bucket list?</p>
        <Link
          href="/signup"
          className="mt-4 inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Start your own list
        </Link>
      </div>
    </div>
  );
}

function PublicListCard({ list }: { list: DashboardListCard }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xl">{LIST_EMOJI[list.slug] ?? "📍"}</span>
        <h3 className="font-medium text-zinc-900 dark:text-zinc-50">{list.name}</h3>
      </div>

      <p className="mb-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-zinc-400">
        <DifficultyBadge tier={list.difficultyTier} />
        <span>
          {list.visited * list.pointsPerItem} pts earned · {list.pointsPerItem} pts / item
        </span>
      </p>

      <p className="mb-3 text-sm text-zinc-500">
        {list.visited} / {list.total} {list.actionVerb.toLowerCase()}
      </p>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div className="h-full rounded-full bg-zinc-900 dark:bg-zinc-50" style={{ width: `${list.pct}%` }} />
      </div>
    </div>
  );
}
