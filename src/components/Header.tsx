import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HeaderRight from "@/components/HeaderRight";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href={user ? "/dashboard" : "/"} className="font-semibold text-zinc-900 dark:text-zinc-50">
          🧳 Travel Bucket List
        </Link>
        <HeaderRight email={user?.email ?? null} />
      </div>
    </header>
  );
}
