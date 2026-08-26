"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { DatePrecision } from "@/lib/types";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { supabase, user };
}

/** Marks an item visited/not-visited. Unchecking clears any saved date,
 * since the DB constraint requires visited=true whenever a date is set. */
export async function setVisited(listItemId: string, listSlug: string, visited: boolean) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: user.id,
      list_item_id: listItemId,
      visited,
      visited_on: visited ? undefined : null,
      visited_precision: visited ? undefined : null,
    },
    { onConflict: "user_id,list_item_id" },
  );
  if (error) throw error;

  revalidatePath(`/lists/${listSlug}`);
  revalidatePath("/dashboard");
}

/** Saves a fuzzy visited date (exact day, month, or year) for an item,
 * implicitly marking it visited. */
export async function setVisitedDate(
  listItemId: string,
  listSlug: string,
  visitedOn: string,
  precision: DatePrecision,
) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: user.id,
      list_item_id: listItemId,
      visited: true,
      visited_on: visitedOn,
      visited_precision: precision,
    },
    { onConflict: "user_id,list_item_id" },
  );
  if (error) throw error;

  revalidatePath(`/lists/${listSlug}`);
  revalidatePath("/dashboard");
}

/** Clears a saved date while leaving the item marked visited. */
export async function clearVisitedDate(listItemId: string, listSlug: string) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: user.id,
      list_item_id: listItemId,
      visited: true,
      visited_on: null,
      visited_precision: null,
    },
    { onConflict: "user_id,list_item_id" },
  );
  if (error) throw error;

  revalidatePath(`/lists/${listSlug}`);
}
