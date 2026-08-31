"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { PRESET_AVATARS } from "@/lib/presetAvatars";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { supabase, user };
}

/** Persists an avatar URL -- either a preset's static path or a public
 * Storage URL for an already-uploaded photo (the upload itself happens
 * client-side; this just saves the resulting URL to the profile). */
export async function updateAvatarUrl(avatarUrl: string) {
  const { supabase, user } = await requireUser();

  const isKnownPreset = PRESET_AVATARS.some((preset) => preset.url === avatarUrl);
  const isOwnUpload = avatarUrl.includes(`/avatars/${user.id}/`);
  if (!isKnownPreset && !isOwnUpload) {
    throw new Error("Invalid avatar URL");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
    .eq("id", user.id);
  if (error) throw error;

  revalidatePath("/dashboard");
}
