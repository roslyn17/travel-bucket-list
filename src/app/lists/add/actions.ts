"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Adds a predefined list to the current user's dashboard. */
export async function addList(listId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("user_lists")
    .insert({ user_id: user.id, list_id: listId });
  if (error) throw error;

  revalidatePath("/dashboard");
  revalidatePath("/lists/add");
  redirect("/dashboard");
}
