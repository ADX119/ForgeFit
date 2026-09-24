"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Apple, Dumbbell, House, ShoppingBag, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@forgefit/ui";
import { Brand } from "./brand";

type NavItem = { href: Route; label: string; icon: typeof House };

// The four sections. Progress joins when its screens exist.
const primaryNav: NavItem[] = [
  { href: "/today", label: "Today", icon: House },
  { href: "/train", label: "Train", icon: Dumbbell },
  { href: "/nutrition", label: "Nutrition", icon: Apple },
  { href: "/profile", label: "Profile", icon: UserRound },
];

// Secondary destinations: sidebar only, below the main sections.
const secondaryNav: NavItem[] = [{ href: "/shop", label: "Shop", icon: ShoppingBag }];

/**
 * "tab": icon over a small label (mobile bottom bar).
 * "rail": icon over a small label on tablet, icon beside the label on desktop.
 */
function NavLink({ item, variant }: { item: NavItem; variant: "tab" | "rail" }) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-medium text-muted transition-colors hover:bg-raised hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        variant === "rail" &&
          "min-h-14 xl:min-h-11 xl:flex-row xl:justify-start xl:gap-3 xl:px-3 xl:text-sm",
        active && "bg-raised text-ink",
      )}
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
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
    <div className="min-h-screen pb-24 md:pb-0 md:pl-20 xl:pl-60">
      <aside className="fixed inset-y-0 left-0 top-0 z-30 hidden overflow-y-auto border-r border-line bg-canvas p-3 md:flex md:w-20 md:flex-col xl:w-60 xl:p-4">
        <div className="hidden px-1 xl:block">
          <Brand />
        </div>
        <div className="mx-auto xl:hidden">
          <Brand compact />
        </div>
        <nav className="mt-8 grid gap-1" aria-label="Primary">
          {primaryNav.map((item) => (
            <NavLink key={item.href} item={item} variant="rail" />
          ))}
        </nav>
        <nav className="mt-4 grid gap-1 border-t border-line pt-4" aria-label="More">
          {secondaryNav.map((item) => (
            <NavLink key={item.href} item={item} variant="rail" />
          ))}
        </nav>
        <div className="mt-auto hidden border-t border-line pt-4 xl:block">
          <p className="truncate px-3 text-sm font-medium text-ink">{userName}</p>
          <form action={signOutAction}>
            <button className="mt-1 min-h-9 px-3 text-sm text-muted hover:text-ink">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="mx-auto max-w-[1480px] p-5 sm:p-7 lg:p-9">{children}</main>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line bg-canvas px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden"
        aria-label="Primary"
      >
        {primaryNav.map((item) => (
          <NavLink key={item.href} item={item} variant="tab" />
        ))}
      </nav>
    </div>
  );
}
