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

const MAX_DISPLAY_NAME_LENGTH = 40;

/** Updates the user's display name (shown instead of their email around the
 * app). Passing an empty/whitespace-only string clears it, so the UI falls
 * back to the local part of their email address. */
export async function updateDisplayName(name: string) {
  const { supabase, user } = await requireUser();

  const trimmed = name.trim();
  if (trimmed.length > MAX_DISPLAY_NAME_LENGTH) {
    throw new Error(`Name must be ${MAX_DISPLAY_NAME_LENGTH} characters or fewer.`);
  }

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: trimmed || null, updated_at: new Date().toISOString() })
    .eq("id", user.id);
  if (error) throw error;

  revalidatePath("/dashboard");
}
