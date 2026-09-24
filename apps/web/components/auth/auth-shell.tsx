import { Brand } from "@/components/brand";
import { Card } from "@forgefit/ui";
import type { ReactNode } from "react";

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
      <section className="hidden border-r border-white/8 p-12 lg:flex lg:flex-col lg:justify-between">
        <Brand />
        <div className="max-w-xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-lime-300">
            Train · Fuel · Equip
          </p>
          <h2 className="mt-5 text-6xl font-black leading-[0.95] tracking-[-0.05em]">
            One plan.
            <br />
            Every rep.
            <br />
            <span className="text-lime-300">Forged daily.</span>
          </h2>
          <p className="mt-7 max-w-md leading-7 text-zinc-400">
            Your workouts, goal-based meals, grocery list, and equipment recommendations in one
            focused system.
          </p>
        </div>
        <p className="text-xs text-zinc-400">
          Fitness and nutrition estimates are educational, not medical advice.
        </p>
      </section>
      <section className="grid place-items-center p-5 sm:p-8">
        <Card className="w-full max-w-md border-white/10 bg-zinc-950/80 p-7 sm:p-9">
          <div className="mb-8 lg:hidden">
            <Brand />
          </div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-lime-300">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
          <div className="mt-7">{children}</div>
        </Card>
      </section>
    </main>
  );
}
