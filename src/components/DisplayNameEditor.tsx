"use client";

import { useState } from "react";
import { updateDisplayName } from "@/lib/profileActions";

const MAX_LENGTH = 40;

/** Shows the user's display name with a hover-revealed "Edit" control that
 * swaps in a text input. Saving an empty value clears the name, falling
 * back to `fallbackName` (the local part of their email) elsewhere. */
export default function DisplayNameEditor({
  initialName,
  fallbackName,
}: {
  initialName: string | null;
  fallbackName: string;
}) {
  const [name, setName] = useState(initialName);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialName ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setBusy(true);
    setError(null);
    try {
      await updateDisplayName(value);
      setName(value.trim() || null);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save name. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function handleCancel() {
    setValue(name ?? "");
    setError(null);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex flex-col items-center gap-2 sm:items-start">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
          placeholder={fallbackName}
          maxLength={MAX_LENGTH}
          autoFocus
          disabled={busy}
          className="rounded-md border border-zinc-300 px-2 py-1 text-2xl font-semibold text-zinc-900 focus:border-zinc-500 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={busy}
            className="text-xs font-medium text-zinc-900 underline disabled:opacity-50 dark:text-zinc-50"
          >
            {busy ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={busy}
            className="text-xs text-zinc-500 underline disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div className="group flex items-center justify-center gap-2 sm:justify-start">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{name || fallbackName}</h1>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-xs text-zinc-400 underline opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
      >
        Edit
      </button>
    </div>
  );
}
