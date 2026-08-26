import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { ItemWithProgress, List, ListItem, UserProgress } from "@/lib/types";
import ListItemsClient from "./ListItemsClient";

export default async function ListPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: list } = await supabase
    .from("lists")
    .select("*")
    .eq("slug", slug)
    .single<List>();
  if (!list) notFound();

  const [{ data: items }, { data: progress }] = await Promise.all([
    supabase
      .from("list_items")
      .select("*")
      .eq("list_id", list.id)
      .order("sort_order")
      .returns<ListItem[]>(),
    supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .returns<UserProgress[]>(),
  ]);

  const progressByItemId = new Map((progress ?? []).map((p) => [p.list_item_id, p]));
  const itemsWithProgress: ItemWithProgress[] = (items ?? []).map((item) => ({
    item,
    progress: progressByItemId.get(item.id) ?? null,
  }));

  const visitedCount = itemsWithProgress.filter((i) => i.progress?.visited).length;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link href="/dashboard" className="mb-4 inline-block text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">
        ← All lists
      </Link>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{list.name}</h1>
      <p className="mt-1 mb-6 text-sm text-zinc-500">
        {visitedCount} / {itemsWithProgress.length} visited
      </p>
      <ListItemsClient listSlug={list.slug} items={itemsWithProgress} />
    </div>
  );
}
