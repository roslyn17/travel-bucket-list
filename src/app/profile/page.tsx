import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { getRankProgress } from "@/lib/rank";
import { getProfileStats } from "@/lib/profileStats";
import AvatarPicker from "@/components/AvatarPicker";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, stats] = await Promise.all([
    supabase.from("profiles").select("id, email, display_name, avatar_url").eq("id", user.id).single(),
    getProfileStats(supabase, user.id),
  ]);

  const displayName =
    (profile as Profile | null)?.display_name || user.email?.split("@")[0] || "Explorer";
  const { rank, nextRank, progressPct, pointsToNext } = getRankProgress(stats.totalVisited);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="mb-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
        <AvatarPicker initialAvatarUrl={(profile as Profile | null)?.avatar_url ?? null} />

        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{displayName}</h1>
          <p className="mt-1 text-sm font-medium text-zinc-500">{rank.name}</p>

          <div className="mt-3 max-w-sm">
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-zinc-900 dark:bg-zinc-50"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-zinc-500">
              {nextRank
                ? `${pointsToNext} pt${pointsToNext === 1 ? "" : "s"} to ${nextRank.name}`
                : "Top rank reached!"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatTile label="Items visited" value={stats.totalVisited} />
        <StatTile label="Lists completed" value={stats.listsCompleted} />
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-5 text-center dark:border-zinc-800">
      <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{label}</p>
    </div>
  );
}
