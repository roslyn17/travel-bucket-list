"use client";

import { usePathname } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";

/** The right-hand side of the top bar. Route-aware (not just auth-aware):
 * on a public profile page, everyone sees a "viewing a public profile"
 * indicator instead of account info -- even a signed-in visitor looking at
 * someone else's page shouldn't see their own email/sign-out there, since
 * that reads as if it belongs to the profile being viewed. */
export default function HeaderRight({ email }: { email: string | null }) {
  const pathname = usePathname();
  const isPublicProfile = pathname?.startsWith("/u/");

  if (isPublicProfile) {
    return <span className="text-sm text-zinc-500">👀 Viewing a public profile</span>;
  }

  if (!email) return null;

  return (
    <div className="flex items-center gap-4">
      <span className="hidden text-sm text-zinc-500 sm:inline">{email}</span>
      <SignOutButton />
    </div>
  );
}
