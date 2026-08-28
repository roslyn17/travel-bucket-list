import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { List } from "@/lib/types";
import { LIST_EMOJI } from "@/lib/listEmoji";
import { addList } from "./actions";

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
  const available = ((allLists as List[] | null) ?? []).filter((list) => !addedListIds.has(list.id));

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <Link href="/dashboard" className="mb-4 inline-block text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">
        ← Your bucket lists
      </Link>
      <h1 className="mb-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Add a bucket list
      </h1>

      {available.length === 0 ? (
        <p className="text-sm text-zinc-500">You&apos;ve already added every available list.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {available.map((list) => (
            <form
              key={list.id}
              action={async () => {
                "use server";
                await addList(list.id);
              }}
              className="flex flex-col rounded-lg border border-zinc-200 p-5 dark:border-zinc-800"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xl">{LIST_EMOJI[list.slug] ?? "📍"}</span>
                <h2 className="font-medium text-zinc-900 dark:text-zinc-50">{list.name}</h2>
              </div>
              {list.description && (
                <p className="mb-4 flex-1 text-sm text-zinc-500">{list.description}</p>
              )}
              <button
                type="submit"
                className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                + Add to my lists
              </button>
            </form>
          ))}
        </div>
      )}
    </div>
  );
}
