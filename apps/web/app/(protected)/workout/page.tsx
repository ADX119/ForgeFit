import Link from "next/link";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { Badge, Button, Card, EmptyState, PageHeader } from "@fitforge/ui";
import { removeWorkoutEntry } from "@/lib/actions/features";
import { getWorkout } from "@/lib/data/queries";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default async function WorkoutPage() {
  const { entries } = await getWorkout();
  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="My workout plan"
        title="Your week, built deliberately"
        description="A repeatable plan is more valuable than a perfect one. Start small and distribute hard sessions."
        action={
          <Link href="/exercises">
            <Button>
              <Plus className="size-4" /> Add exercise
            </Button>
          </Link>
        }
      />
      <div className="grid gap-4 xl:grid-cols-2">
        {days.map((day, index) => {
          const dayEntries = entries.filter((entry) => entry.day_of_week === index + 1);
          return (
            <Card key={day} className="p-0">
              <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-zinc-500">
                    Day {index + 1}
                  </p>
                  <h2 className="mt-1 text-lg font-black">{day}</h2>
                </div>
                <Badge tone={dayEntries.length ? "lime" : "neutral"}>
                  {dayEntries.length ? `${dayEntries.length} exercises` : "Recovery"}
                </Badge>
              </div>
              {dayEntries.length ? (
                <div className="grid gap-2 p-4">
                  {dayEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-3 rounded-xl bg-zinc-950/50 p-3"
                    >
                      <div className="grid size-10 place-items-center rounded-lg bg-lime-300/10 font-black text-lime-300">
                        {entry.exercise.suggested_sets}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold">{entry.exercise.name}</p>
                        <p className="text-xs text-zinc-500">
                          {entry.exercise.suggested_reps} reps
                        </p>
                      </div>
                      <form action={removeWorkoutEntry}>
                        <input type="hidden" name="entryId" value={entry.id} />
                        <button
                          aria-label={`Remove ${entry.exercise.name}`}
                          className="grid size-11 place-items-center rounded-xl text-zinc-600 hover:bg-red-400/10 hover:text-red-300"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4">
                  <EmptyState
                    icon={<CalendarDays className="size-7" />}
                    title="Open for recovery"
                    description="Keep this as rest or add a focused session."
                  />
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
