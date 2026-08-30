import type { SupabaseClient } from "@supabase/supabase-js";

export type ProfileStats = {
  /** Total items checked off across all of the user's lists -- also their score, at 1 pt/item. */
  totalVisited: number;
  /** Count of the user's tracked lists (via user_lists) where every item is checked off. */
  listsCompleted: number;
};

/** Computes profile stats from user_lists / list_items / user_progress. */
export async function getProfileStats(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfileStats> {
  const [{ data: userLists }, { data: items }, { data: progress }] = await Promise.all([
    supabase.from("user_lists").select("list_id").eq("user_id", userId),
    supabase.from("list_items").select("id, list_id"),
    supabase.from("user_progress").select("list_item_id").eq("user_id", userId).eq("visited", true),
  ]);

  const addedListIds = new Set((userLists ?? []).map((ul) => ul.list_id as string));

  const itemsByList = new Map<string, number>();
  const itemToList = new Map<string, string>();
  for (const item of items ?? []) {
    itemsByList.set(item.list_id, (itemsByList.get(item.list_id) ?? 0) + 1);
    itemToList.set(item.id, item.list_id);
  }

  const visitedItemIds = new Set((progress ?? []).map((p) => p.list_item_id as string));

  const visitedByList = new Map<string, number>();
  for (const itemId of visitedItemIds) {
    const listId = itemToList.get(itemId);
    if (listId) visitedByList.set(listId, (visitedByList.get(listId) ?? 0) + 1);
  }

  let listsCompleted = 0;
  for (const listId of addedListIds) {
    const total = itemsByList.get(listId) ?? 0;
    const visited = visitedByList.get(listId) ?? 0;
    if (total > 0 && visited === total) listsCompleted++;
  }

  return {
    totalVisited: visitedItemIds.size,
    listsCompleted,
  };
}
