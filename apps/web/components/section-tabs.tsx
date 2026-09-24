"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@forgefit/ui";

export interface SectionTab {
  href: Route;
  label: string;
  /** Extra path prefixes that also mark this tab active, e.g. recipe detail pages under Recipes. */
  alsoActiveFor?: string[];
}

/** Segmented links between the pages of one section (Train: Plan · Exercises). */
export function SectionTabs({ label, tabs }: { label: string; tabs: SectionTab[] }) {
  const pathname = usePathname();
  const isActive = (tab: SectionTab) =>
    pathname === tab.href ||
    (tab.alsoActiveFor ?? []).some((prefix) => pathname.startsWith(prefix));
  return (
    <nav aria-label={label} className="mb-6">
      <div className="inline-flex rounded-lg border border-line bg-surface p-1">
        {tabs.map((tab) => {
          const active = isActive(tab);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-10 items-center rounded-md px-4 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                active ? "bg-raised text-ink" : "text-muted hover:text-ink",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
