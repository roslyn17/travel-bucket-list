"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LIST_EMOJI } from "@/lib/listEmoji";
import { removeList, reorderLists } from "@/lib/listActions";

export type DashboardListCard = {
  id: string;
  slug: string;
  name: string;
  actionVerb: string;
  visited: number;
  total: number;
  pct: number;
};

/** Drag-and-drop-reorderable grid of the user's bucket list cards. Order is
 * kept optimistically in local state and persisted via reorderLists --
 * syncing back to the server-given order only when the *set* of lists
 * changes (add/remove), so a pending drag or in-flight save is never
 * clobbered by an unrelated re-render. */
export default function SortableListGrid({ lists }: { lists: DashboardListCard[] }) {
  const propIds = lists.map((l) => l.id);
  // Only the *set* of ids -- order-independent -- so a pure reorder's
  // eventual revalidated props (which will match what we already set
  // optimistically) doesn't fight with local drag state.
  const setKey = [...propIds].sort().join(",");

  const [orderedIds, setOrderedIds] = useState(propIds);
  const [lastSetKey, setLastSetKey] = useState(setKey);
  // Adjusting state during render (not in an effect) when the set of lists
  // actually changed -- e.g. a list was added or removed elsewhere.
  if (setKey !== lastSetKey) {
    setLastSetKey(setKey);
    setOrderedIds(propIds);
  }

  const [, startTransition] = useTransition();
  const byId = new Map(lists.map((l) => [l.id, l]));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrderedIds((current) => {
      const oldIndex = current.indexOf(String(active.id));
      const newIndex = current.indexOf(String(over.id));
      const next = arrayMove(current, oldIndex, newIndex);
      startTransition(() => {
        reorderLists(next).catch(() => {
          // Best-effort: on failure, fall back to whatever the server last
          // confirmed rather than leaving a card order that didn't save.
          setOrderedIds(lists.map((l) => l.id));
        });
      });
      return next;
    });
  }

  return (
    <DndContext id="dashboard-lists" sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={orderedIds} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {orderedIds.map((id) => {
            const list = byId.get(id);
            if (!list) return null;
            return <SortableListCard key={id} list={list} />;
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableListCard({ list }: { list: DashboardListCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: list.id,
  });
  const [isPending, startTransition] = useTransition();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      aria-label={`${list.name}, draggable to reorder`}
      className={`touch-none cursor-grab rounded-lg border border-zinc-200 p-5 transition-colors hover:border-zinc-400 active:cursor-grabbing dark:border-zinc-800 dark:hover:border-zinc-600 ${
        isDragging ? "z-10 opacity-70" : ""
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xl">{LIST_EMOJI[list.slug] ?? "📍"}</span>
        <h2 className="font-medium text-zinc-900 dark:text-zinc-50">{list.name}</h2>
      </div>

      <Link href={`/lists/${list.slug}`} className="block">
        <p className="mb-3 text-sm text-zinc-500">
          {list.visited} / {list.total} {list.actionVerb.toLowerCase()}
        </p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-zinc-900 dark:bg-zinc-50"
            style={{ width: `${list.pct}%` }}
          />
        </div>
      </Link>

      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => removeList(list.id, list.slug))}
        className="mt-3 text-xs text-zinc-400 underline hover:text-red-600 disabled:opacity-50 dark:hover:text-red-400"
      >
        Remove
      </button>
    </div>
  );
}
