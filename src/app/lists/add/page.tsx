import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { List } from "@/lib/types";
import { LIST_GROUPS } from "@/lib/listGroups";
import AddListCatalog, { type CatalogGroup } from "@/components/AddListCatalog";

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
  const groups: CatalogGroup[] = LIST_GROUPS.filter((group) => allByGroup.has(group.key)).map(
    (group) => ({
      key: group.key,
      label: group.label,
      emoji: group.emoji,
      totalCount: allByGroup.get(group.key)?.length ?? 0,
      available: availableByGroup.get(group.key) ?? [],
    }),
  );

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <Link href="/dashboard" className="mb-4 inline-block text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">
        ← Your bucket lists
      </Link>
      <h1 className="mb-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Add a bucket list
      </h1>

      <AddListCatalog groups={groups} />
    </div>
  );
}
