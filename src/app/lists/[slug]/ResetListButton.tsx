"use client";

import { useTransition } from "react";
import { resetListProgress } from "@/lib/listActions";

export default function ResetListButton({ listId, listSlug }: { listId: string; listSlug: string }) {
  const [isPending, startTransition] = useTransition();

  function handleReset() {
    const confirmed = window.confirm(
      "This will permanently remove every item you've checked off on this list. This can't be undone. Continue?",
    );
    if (!confirmed) return;
    startTransition(async () => {
      await resetListProgress(listId, listSlug);
    });
  }

  return (
    <button
      type="button"
      onClick={handleReset}
      disabled={isPending}
      className="text-xs text-zinc-400 underline hover:text-red-600 disabled:opacity-50 dark:hover:text-red-400"
    >
      {isPending ? "Resetting..." : "Reset progress"}
    </button>
  );
}
