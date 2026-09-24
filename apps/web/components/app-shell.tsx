"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Apple,
  BicepsFlexed,
  Dumbbell,
  House,
  ListChecks,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@forgefit/ui";
import { Brand } from "./brand";

const nav: { href: Route; label: string; icon: typeof House; mobile: boolean }[] = [
  { href: "/dashboard", label: "Today", icon: House, mobile: true },
  { href: "/exercises", label: "Exercises", icon: BicepsFlexed, mobile: false },
  { href: "/workout", label: "Workout", icon: Dumbbell, mobile: true },
  { href: "/diet", label: "Diet", icon: Apple, mobile: true },
  { href: "/grocery", label: "Grocery", icon: ListChecks, mobile: true },
  { href: "/shop", label: "Shop", icon: ShoppingBag, mobile: false },
  { href: "/profile", label: "Profile", icon: UserRound, mobile: true },
];

/**
 * "tab": icon over a small label (mobile bottom bar).
 * "rail": icon over a small label on tablet, icon beside the label on desktop.
 */
function NavLink({ item, variant }: { item: (typeof nav)[number]; variant: "tab" | "rail" }) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-semibold text-zinc-400 transition hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300",
        variant === "rail" &&
          "min-h-14 xl:min-h-12 xl:flex-row xl:justify-start xl:gap-3 xl:px-3 xl:text-sm xl:font-bold",
        active && "bg-lime-300/10 text-lime-300",
      )}
    >
      <Icon className="size-5 shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

export function AppShell({
  children,
  userName,
  signOutAction,
}: {
  children: ReactNode;
  userName: string;
  signOutAction: () => Promise<void>;
}) {
  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pl-20 xl:pl-64">
      <aside className="fixed inset-y-0 left-0 top-0 z-30 hidden border-r border-white/8 bg-zinc-950/95 p-3 backdrop-blur md:flex md:w-20 md:flex-col xl:w-64 xl:p-5 overflow-y-auto">
        <div className="hidden xl:block">
          <Brand />
        </div>
        <div className="mx-auto xl:hidden">
          <Brand compact />
        </div>
        <nav className="mt-10 grid gap-2" aria-label="Primary">
          {nav.map((item) => (
            <NavLink key={item.href} item={item} variant="rail" />
          ))}
        </nav>
        <div className="mt-auto hidden rounded-xl border border-white/8 bg-zinc-900 p-3 xl:block">
          <p className="truncate text-sm font-bold text-white">{userName}</p>
          <form action={signOutAction}>
            <button className="mt-2 text-xs font-bold text-zinc-400 hover:text-red-300">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="mx-auto max-w-[1480px] p-5 sm:p-7 lg:p-9">{children}</main>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-white/10 bg-zinc-950/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden"
        aria-label="Mobile primary"
      >
        {nav
          .filter((item) => item.mobile)
          .map((item) => (
            <NavLink key={item.href} item={item} variant="tab" />
          ))}
      </nav>
    </div>
  );
}
