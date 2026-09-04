import type { List } from "@/lib/types";

export type ProfileStats = {
  /** Total items checked off across all of the user's lists -- also their score, at 1 pt/item. */
  totalVisited: number;
  /** Count of the user's tracked lists (via user_lists) where every item is checked off. */
  listsCompleted: number;
};

/**
 * Computes profile stats from data the caller has already fetched, rather
 * than re-querying. Dashboard-page data (user_lists, list_items,
 * user_progress) is needed for other things on the page anyway -- querying
 * it a second time here just for stats used to fire a redundant, duplicate
 * set of requests in the same burst as the page's own queries, which made
 * the whole page's data fetch more likely to trip over a transient network
 * hiccup right after login (cold connection, no pool warm-up yet).
 */
export function computeProfileStats(
  userListRows: { list: Pick<List, "id"> }[],
  items: { id: string; list_id: string }[],
  progress: { list_item_id: string }[],
): ProfileStats {
  const addedListIds = new Set(userListRows.map((row) => row.list.id));

  const itemsByList = new Map<string, number>();
  const itemToList = new Map<string, string>();
  for (const item of items) {
    itemsByList.set(item.list_id, (itemsByList.get(item.list_id) ?? 0) + 1);
    itemToList.set(item.id, item.list_id);
  }

  const visitedItemIds = new Set(progress.map((p) => p.list_item_id));

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
