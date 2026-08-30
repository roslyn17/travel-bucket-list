import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { List } from "@/lib/types";
import { LIST_EMOJI } from "@/lib/listEmoji";
import { LIST_GROUPS } from "@/lib/listGroups";
import { addList } from "@/lib/listActions";

export default async function AddListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: allLists }, { data: userLists }] = await Promise.all([
    supabase.from("lists").select("*").order("name"),
    supabase.from("user_lists").select("list_id").eq("user_id", user.id),
  ]);

  const addedListIds = new Set((userLists ?? []).map((ul) => ul.list_id));
  const allByGroup = new Map<string, List[]>();
  const availableByGroup = new Map<string, List[]>();
  for (const list of (allLists as List[] | null) ?? []) {
    const bucket = allByGroup.get(list.list_group) ?? [];
    bucket.push(list);
    allByGroup.set(list.list_group, bucket);

    if (!addedListIds.has(list.id)) {
      const availableBucket = availableByGroup.get(list.list_group) ?? [];
      availableBucket.push(list);
      availableByGroup.set(list.list_group, availableBucket);
    }
  }
  // Hide a group's section entirely if it has no list types at all yet;
  // groups that just have everything already added still get a header
  // (with a light empty state below) so users see the category exists.
  const groups = LIST_GROUPS.filter((group) => allByGroup.has(group.key));

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <Link href="/dashboard" className="mb-4 inline-block text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">
        ← Your bucket lists
      </Link>
      <h1 className="mb-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Add a bucket list
      </h1>

      {groups.map((group) => {
        const listsInGroup = availableByGroup.get(group.key) ?? [];
        return (
          <div key={group.key} className="mb-10">
            <h2 className="mb-4 border-b border-zinc-200 pb-2 text-lg font-semibold text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
              {group.emoji} {group.label}
            </h2>
            {listsInGroup.length === 0 ? (
              <p className="text-sm text-zinc-500">You&apos;ve added every list in this category.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {listsInGroup.map((list) => (
                  <ListCard key={list.id} list={list} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ListCard({ list }: { list: List }) {
  return (
    <div className="flex flex-col rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
      <div className="mb-4 flex-1">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xl">{LIST_EMOJI[list.slug] ?? "📍"}</span>
          <h3 className="font-medium text-zinc-900 dark:text-zinc-50">{list.name}</h3>
        </div>
        {list.description && <p className="text-sm text-zinc-500">{list.description}</p>}
      </div>
      <form
        action={async () => {
          "use server";
          await addList(list.id, list.slug);
        }}
      >
        <button
          type="submit"
          className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          + Add to my lists
        </button>
      </form>
    </div>
  );
}
