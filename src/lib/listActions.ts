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

  const { error } = await supabase
    .from("user_lists")
    .insert({ user_id: user.id, list_id: listId });
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
