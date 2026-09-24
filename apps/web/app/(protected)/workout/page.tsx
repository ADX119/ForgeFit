import { default as NextLink } from "next/link";
import { CalendarDays, Check, Plus, Trash2 } from "lucide-react";
import { Badge, Button, Card, EmptyState, PageHeader } from "@forgefit/ui";
import { ActionForm, PendingButton } from "@/components/action-form";
import { removeWorkoutEntry, setWorkoutCompletion } from "@/lib/actions/features";
import { getWorkout } from "@/lib/data/queries";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default async function WorkoutPage() {
  const { entries, today, weekDates } = await getWorkout();

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="My workout plan"
        title="Your week, built deliberately"
        description="A repeatable plan is more valuable than a perfect one. Start small and distribute hard sessions."
        action={
          <NextLink href="/exercises">
            <Button>
              <Plus className="size-4" /> Add exercise
            </Button>
          </NextLink>
        }
      />
      <div className="grid gap-4 xl:grid-cols-2">
        {days.map((day, index) => {
          const dayOfWeek = index + 1;
          const date = weekDates[index]!;
          const isToday = dayOfWeek === today.dayOfWeek;
          const isFuture = date > today.date;
          const dayEntries = entries.filter((entry) => entry.day_of_week === dayOfWeek);
          const doneCount = dayEntries.filter((entry) => entry.completed).length;
          return (
            <Card
              key={day}
              className={`p-0 ${isToday ? "border-lime-300/40" : ""}`}
              aria-current={isToday ? "date" : undefined}
            >
              <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    {isToday ? "Today" : `Day ${dayOfWeek}`}
                  </p>
                  <h2 className="mt-1 text-lg font-black">{day}</h2>
                </div>
                <Badge tone={dayEntries.length ? "lime" : "neutral"}>
                  {dayEntries.length
                    ? isFuture
                      ? `${dayEntries.length} exercises`
                      : `${doneCount} of ${dayEntries.length} done`
                    : "Recovery"}
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
                        <p
                          className={`truncate font-bold ${entry.completed ? "text-zinc-400 line-through" : ""}`}
                        >
                          {entry.exercise.name}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {entry.exercise.suggested_sets} sets · {entry.exercise.suggested_reps}{" "}
                          reps
                        </p>
                      </div>

                      {isFuture ? null : (
                        <ActionForm action={setWorkoutCompletion}>
                          <input type="hidden" name="entryId" value={entry.id} />
                          <input type="hidden" name="completionDate" value={date} />
                          <input
                            type="hidden"
                            name="completed"
                            value={entry.completed ? "false" : "true"}
                          />
                          <PendingButton
                            label={`Mark ${entry.exercise.name} on ${day} as ${entry.completed ? "not done" : "done"}`}
                            className={`grid size-11 place-items-center rounded-xl border disabled:opacity-60 ${entry.completed ? "border-lime-300 bg-lime-300 text-zinc-950" : "border-zinc-500 text-zinc-400 hover:border-lime-300 hover:text-lime-300"}`}
                            icon={<Check className="size-4" />}
                          />
                        </ActionForm>
                      )}

                      <ActionForm action={removeWorkoutEntry}>
                        <input type="hidden" name="entryId" value={entry.id} />
                        <PendingButton
                          label={`Remove ${entry.exercise.name} from ${day}`}
                          className="grid size-11 place-items-center rounded-xl text-zinc-400 hover:bg-red-400/10 hover:text-red-300 disabled:opacity-60"
                          icon={<Trash2 className="size-4" />}
                        />
                      </ActionForm>
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
