import Link from "next/link";
import { ArrowRight, Check, Dumbbell, Salad, ShoppingBasket, Sparkles } from "lucide-react";
import { Badge, Card } from "@fitforge/ui";
import { Brand } from "@/components/brand";

const pillars = [
  {
    icon: Dumbbell,
    title: "Train with intent",
    body: "Build a balanced weekly plan from 21 guided exercises, filtered by muscle, equipment, and level.",
  },
  {
    icon: Salad,
    title: "Fuel the goal",
    body: "Get transparent calorie and macro estimates plus recipes designed around your current objective.",
  },
  {
    icon: ShoppingBasket,
    title: "Shop without friction",
    body: "Turn recipes into one grocery list and see equipment that actually matches your programme.",
  },
];

export default function LandingPage() {
  return (
    <main>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <Brand />
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-xl px-4 py-3 text-sm font-bold text-zinc-300 hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-lime-300 px-4 py-3 text-sm font-black text-zinc-950 hover:bg-lime-200"
          >
            Start forging
          </Link>
        </div>
      </nav>
      <section className="mx-auto grid min-h-[76vh] max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <Badge tone="lime">
            <Sparkles className="mr-1 size-3" /> Your daily performance system
          </Badge>
          <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.055em] text-white sm:text-7xl">
            Build the body.
            <br />
            <span className="text-lime-300">Forge the habits.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
            One focused place for workouts, goal-led meals, a consolidated grocery list, and
            equipment that fits your plan.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-lime-300 px-5 font-black text-zinc-950 hover:bg-lime-200"
            >
              Build my plan <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#features"
              className="inline-flex min-h-12 items-center rounded-xl border border-zinc-700 px-5 font-bold text-zinc-200 hover:border-zinc-500"
            >
              Explore features
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-zinc-500">
            {["21 guided exercises", "12 goal-based recipes", "No real purchases"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <Check className="size-4 text-lime-300" />
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-8 -z-10 rounded-full bg-lime-300/10 blur-3xl" />
          <Card className="overflow-hidden border-lime-300/15 bg-zinc-950 p-0">
            <div className="flex items-center justify-between border-b border-white/8 p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-lime-300">
                  Tuesday · Push
                </p>
                <h2 className="mt-1 text-xl font-black">Today’s forge</h2>
              </div>
              <span className="grid size-12 place-items-center rounded-full border-4 border-lime-300 text-sm font-black">
                67%
              </span>
            </div>
            <div className="grid gap-3 p-5">
              {["Dumbbell bench press", "Overhead press", "Band triceps press"].map(
                (exercise, index) => (
                  <div
                    key={exercise}
                    className="flex items-center gap-4 rounded-xl border border-white/7 bg-zinc-900 p-4"
                  >
                    <span
                      className={`grid size-9 place-items-center rounded-lg text-sm font-black ${index < 2 ? "bg-lime-300 text-zinc-950" : "bg-zinc-800 text-zinc-500"}`}
                    >
                      {index < 2 ? <Check className="size-4" /> : "3"}
                    </span>
                    <div className="flex-1">
                      <p className="font-bold">{exercise}</p>
                      <p className="mt-1 text-xs text-zinc-500">3 sets · 8–12 reps</p>
                    </div>
                  </div>
                ),
              )}
            </div>
            <div className="grid grid-cols-3 gap-px bg-white/8">
              <div className="bg-zinc-900 p-4">
                <p className="text-xs text-zinc-500">Calories</p>
                <p className="mt-1 text-xl font-black">2,420</p>
              </div>
              <div className="bg-zinc-900 p-4">
                <p className="text-xs text-zinc-500">Protein</p>
                <p className="mt-1 text-xl font-black">140g</p>
              </div>
              <div className="bg-zinc-900 p-4">
                <p className="text-xs text-zinc-500">Groceries</p>
                <p className="mt-1 text-xl font-black">8</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
      <section id="features" className="border-y border-white/8 bg-zinc-950/45">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-lime-300">
            Everything connects
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
            Less switching. More consistency.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {pillars.map(({ icon: Icon, title, body }) => (
              <Card key={title}>
                <Icon className="size-7 text-lime-300" />
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Brand />
        <p>Demo commerce only · Fitness estimates are not medical advice.</p>
      </footer>
    </main>
  );
}
