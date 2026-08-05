import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Check, Flame, Plus, Target, Utensils } from "lucide-react";
import { Badge, Card, EmptyState, PageHeader } from "@fitforge/ui";
import { generateDietPlan, generateWorkoutPlan } from "@fitforge/domain";
import { setWorkoutCompletion } from "@/lib/actions/features";
import { getDashboard } from "@/lib/data/queries";

export default async function DashboardPage() {
  const { profile, today, entries, target } = await getDashboard();
  const completed = entries.filter((entry) => entry.completed).length;
  const progress = entries.length ? Math.round((completed / entries.length) * 100) : 0;
  const profileComplete =
    profile.age !== null &&
    profile.height_cm !== null &&
    profile.weight_kg !== null &&
    profile.calculation_sex !== null &&
    profile.activity_level !== null &&
    profile.goal !== null;
  const profileMetrics = profileComplete
    ? {
        age: profile.age as number,
        heightCm: profile.height_cm as number,
        weightKg: profile.weight_kg as number,
        calculationSex: profile.calculation_sex as "MALE" | "FEMALE" | "PREFER_NOT_TO_SAY",
        activityLevel: profile.activity_level as
          | "SEDENTARY"
          | "LIGHTLY_ACTIVE"
          | "MODERATELY_ACTIVE"
          | "VERY_ACTIVE"
          | "EXTRA_ACTIVE",
        goal: profile.goal as "MUSCLE_GAIN" | "FAT_LOSS" | "MAINTENANCE" | "RECOMPOSITION",
      }
    : null;
  const [dietPlan, workoutPlan] = profileMetrics
    ? await Promise.all([
        generateDietPlan(profileMetrics),
        generateWorkoutPlan(profileMetrics),
      ])
    : [
        "Complete your profile to get personalized meal and workout suggestions.",
        "Complete your profile to get personalized meal and workout suggestions.",
      ];

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow={`${today.weekday} · Your daily forge`}
        title={`Ready, ${profile.display_name.split(" ")[0]}?`}
        description="Make the next useful choice. Consistency beats complexity."
      />
      {profileComplete ? (
        <Card className="p-5">
          <div className="grid gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-sky-300">Personalized suggestions</p>
              <h2 className="mt-2 text-xl font-black">Plan your next meals and workouts</h2>
            </div>
            <div className="grid gap-3 rounded-3xl bg-zinc-950 p-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-lime-300">Diet</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-300">{dietPlan}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-sky-300">Workout</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-300">{workoutPlan}</p>
              </div>
            </div>
          </div>
        </Card>
      ) : null}
      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-white/8 p-5">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-lime-300">
                Today’s workout
              </p>
              <h2 className="mt-1 text-xl font-black">
                {completed} of {entries.length} complete
              </h2>
            </div>
            <div className="grid size-14 place-items-center rounded-full border-4 border-lime-300 text-sm font-black">
              {progress}%
            </div>
          </div>
          {entries.length ? (
            <div className="grid gap-2 p-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 rounded-xl border border-white/7 bg-zinc-950/40 p-3"
                >
                  <form action={setWorkoutCompletion}>
                    <input type="hidden" name="entryId" value={entry.id} />
                    <input type="hidden" name="completionDate" value={today.date} />
                    <input
                      type="hidden"
                      name="completed"
                      value={entry.completed ? "false" : "true"}
                    />
                    <button
                      aria-label={`${entry.completed ? "Mark incomplete" : "Complete"} ${entry.exercise.name}`}
                      className={`grid size-11 place-items-center rounded-xl border ${entry.completed ? "border-lime-300 bg-lime-300 text-zinc-950" : "border-zinc-700 text-zinc-600 hover:border-lime-300 hover:text-lime-300"}`}
                    >
                      <Check className="size-5" />
                    </button>
                  </form>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-bold ${entry.completed ? "text-zinc-500 line-through" : "text-white"}`}
                    >
                      {entry.exercise.name}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {entry.exercise.suggested_sets} sets · {entry.exercise.suggested_reps} reps
                    </p>
                  </div>
                  <Badge>{entry.exercise.difficulty}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4">
              <EmptyState
                title="Recovery day—or a blank plan"
                description="Add exercises to today and FitForge will surface them here."
                action={
                  <Link
                    href="/exercises"
                    className="inline-flex items-center gap-2 font-bold text-lime-300"
                  >
                    <Plus className="size-4" /> Add exercises
                  </Link>
                }
              />
            </div>
          )}
        </Card>
        <Card className="flex flex-col">
          <div className="flex items-center justify-between">
            <div className="grid size-11 place-items-center rounded-xl bg-orange-300/10 text-orange-300">
              <Flame className="size-5" />
            </div>
            <Badge tone="orange">Estimate</Badge>
          </div>
          <h2 className="mt-5 text-lg font-black">Daily nutrition target</h2>
          {target ? (
            <>
              <p className="mt-2 text-4xl font-black tracking-tight">
                {target.calories.toLocaleString("en-IN")}{" "}
                <span className="text-base text-zinc-500">kcal</span>
              </p>
              <div className="mt-6 grid grid-cols-3 gap-2">
                {[
                  ["Protein", target.proteinG],
                  ["Carbs", target.carbsG],
                  ["Fat", target.fatG],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-zinc-950 p-3">
                    <p className="text-[11px] text-zinc-500">{label}</p>
                    <p className="mt-1 font-black">{value}g</p>
                  </div>
                ))}
              </div>
              <p className="mt-auto pt-6 text-xs leading-5 text-zinc-600">{target.disclaimer}</p>
            </>
          ) : (
            <p className="mt-3 text-sm text-zinc-400">
              Complete your profile to calculate an estimate.
            </p>
          )}
        </Card>
      </section>
      <section>
        <details className="group overflow-hidden rounded-3xl border border-white/8 bg-zinc-950">
          <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-left transition hover:border-lime-300/25">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-lime-300">
                Quick actions
              </p>
              <h2 className="mt-1 text-2xl font-black">Keep moving</h2>
            </div>
            <span className="text-sm text-zinc-400 transition group-open:rotate-90">›</span>
          </summary>
          <div className="grid grid-auto gap-4 border-t border-white/8 p-5 pt-4">
            {[
              {
                href: "/workout",
                icon: Target,
                title: "Shape this week",
                body: "Balance your plan across seven days.",
              },
              {
                href: "/diet",
                icon: Utensils,
                title: "Choose the next meal",
                body: "Find a recipe aligned to your goal.",
              },
              {
                href: "/grocery",
                icon: Plus,
                title: "Review groceries",
                body: "Check off everything added from recipes.",
              },
            ].map(({ href, icon: Icon, title, body }) => (
              <Link href={href as Route} key={href}>
                <Card className="group h-full hover:border-lime-300/25">
                  <Icon className="size-6 text-lime-300" />
                  <h3 className="mt-5 font-black">{title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{body}</p>
                  <ArrowRight className="mt-5 size-4 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-lime-300" />
                </Card>
              </Link>
            ))}
          </div>
        </details>
      </section>
    </div>
  );
}
