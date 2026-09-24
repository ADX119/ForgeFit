import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Check, Flame, Plus, Target, Utensils } from "lucide-react";
import { Badge, Card, EmptyState, PageHeader } from "@forgefit/ui";
import { ActionForm, PendingButton } from "@/components/action-form";
import { setWorkoutCompletion } from "@/lib/actions/features";
import { getDashboard } from "@/lib/data/queries";

export default async function DashboardPage() {
  const { profile, today, entries, target } = await getDashboard();
  const completed = entries.filter((entry) => entry.completed).length;
  const progress = entries.length ? Math.round((completed / entries.length) * 100) : 0;

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow={`${today.weekday} · Your daily forge`}
        title={`Ready, ${profile.display_name.split(" ")[0]}?`}
        description="Make the next useful choice. Consistency beats complexity."
      />
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
                  <ActionForm action={setWorkoutCompletion}>
                    <input type="hidden" name="entryId" value={entry.id} />
                    <input type="hidden" name="completionDate" value={today.date} />
                    <input
                      type="hidden"
                      name="completed"
                      value={entry.completed ? "false" : "true"}
                    />
                    <PendingButton
                      label={`${entry.completed ? "Mark incomplete" : "Complete"} ${entry.exercise.name}`}
                      className={`grid size-11 place-items-center rounded-xl border disabled:opacity-60 ${entry.completed ? "border-lime-300 bg-lime-300 text-zinc-950" : "border-zinc-500 text-zinc-400 hover:border-lime-300 hover:text-lime-300"}`}
                      icon={<Check className="size-5" />}
                    />
                  </ActionForm>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-bold ${entry.completed ? "text-zinc-400 line-through" : "text-white"}`}
                    >
                      {entry.exercise.name}
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
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
                description="Add exercises to today and ForgeFit will surface them here."
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
                <span className="text-base text-zinc-400">kcal</span>
              </p>
              <div className="mt-6 grid grid-cols-3 gap-2">
                {[
                  ["Protein", target.proteinG],
                  ["Carbs", target.carbsG],
                  ["Fat", target.fatG],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-zinc-950 p-3">
                    <p className="text-[11px] text-zinc-400">{label}</p>
                    <p className="mt-1 font-black">{value}g</p>
                  </div>
                ))}
              </div>
              <p className="mt-auto pt-6 text-xs leading-5 text-zinc-400">{target.disclaimer}</p>
            </>
          ) : (
            <p className="mt-3 text-sm text-zinc-400">
              Complete your profile to calculate an estimate.
            </p>
          )}
        </Card>
      </section>
      <section aria-labelledby="quick-actions">
        <h2 id="quick-actions" className="text-lg font-bold">
          Keep moving
        </h2>
        <div className="mt-4 grid grid-auto gap-4">
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
                <ArrowRight className="mt-5 size-4 text-zinc-400 transition group-hover:translate-x-1 group-hover:text-lime-300" />
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
