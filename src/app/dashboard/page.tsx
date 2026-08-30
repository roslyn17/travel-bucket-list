import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { List } from "@/lib/types";
import { LIST_EMOJI } from "@/lib/listEmoji";
import { removeList } from "@/lib/listActions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: allLists }, { data: userLists }, { data: items }, { data: progress }] = await Promise.all([
    supabase.from("lists").select("*").order("slug"),
    supabase.from("user_lists").select("list_id").eq("user_id", user.id),
    supabase.from("list_items").select("id, list_id"),
    supabase.from("user_progress").select("list_item_id").eq("user_id", user.id).eq("visited", true),
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

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Your bucket lists
        </h1>
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
