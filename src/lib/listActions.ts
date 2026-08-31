"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { supabase, user };
}

/**
 * Adds a predefined list to the current user's dashboard. If `redirectTo`
 * is given, navigates there afterwards (used when adding from the catalog
 * page); otherwise just revalidates in place (used when adding from a
 * list's own preview page, so the "not added yet" banner disappears
 * without leaving the page).
 */
export async function addList(listId: string, listSlug: string, redirectTo?: string) {
  const { supabase, user } = await requireUser();

  // New lists join at the end of the user's current card order.
  const { data: lastRow } = await supabase
    .from("user_lists")
    .select("sort_order")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSortOrder = (lastRow?.sort_order ?? -1) + 1;

  const { error } = await supabase
    .from("user_lists")
    .insert({ user_id: user.id, list_id: listId, sort_order: nextSortOrder });
  if (error) throw error;

  revalidatePath("/dashboard");
  revalidatePath("/lists/add");
  revalidatePath(`/lists/${listSlug}`);
  if (redirectTo) redirect(redirectTo);
}

/** Removes a list from the current user's dashboard. Their visited
 * progress is preserved -- re-adding the list restores it. */
export async function removeList(listId: string, listSlug: string) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("user_lists")
    .delete()
    .eq("user_id", user.id)
    .eq("list_id", listId);
  if (error) throw error;

  revalidatePath("/dashboard");
  revalidatePath("/lists/add");
  revalidatePath(`/lists/${listSlug}`);
}

/**
 * Persists a new card order for the user's dashboard lists. `orderedListIds`
 * is every list_id the user has added, in their new order; each row's
 * sort_order is set to its index in that array.
 */
export async function reorderLists(orderedListIds: string[]) {
  const { supabase, user } = await requireUser();

  const results = await Promise.all(
    orderedListIds.map((listId, index) =>
      supabase
        .from("user_lists")
        .update({ sort_order: index })
        .eq("user_id", user.id)
        .eq("list_id", listId),
    ),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;

  revalidatePath("/dashboard");
}

/**
 * Permanently clears the current user's visited status (and any saved
 * dates) for every item in a list. Unlike removeList, this cannot be
 * undone -- callers should confirm with the user before calling it.
 */
export async function resetListProgress(listId: string, listSlug: string) {
  const { supabase, user } = await requireUser();

  const { data: items, error: itemsError } = await supabase
    .from("list_items")
    .select("id")
    .eq("list_id", listId);
  if (itemsError) throw itemsError;

  const itemIds = (items ?? []).map((item) => item.id);
  if (itemIds.length > 0) {
    const { error } = await supabase
      .from("user_progress")
      .delete()
      .eq("user_id", user.id)
      .in("list_item_id", itemIds);
    if (error) throw error;
  }

  revalidatePath(`/lists/${listSlug}`);
  revalidatePath("/dashboard");
}
