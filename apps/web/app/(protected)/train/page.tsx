import { default as NextLink } from "next/link";
import { Check, Plus, Trash2 } from "lucide-react";
import { Badge, buttonClasses, Card, PageHeader } from "@forgefit/ui";
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
          <NextLink href="/train/exercises" className={buttonClasses()}>
            <Plus className="size-4" aria-hidden="true" /> Add exercise
          </NextLink>
        }
      />
      <div className="grid gap-3">
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
              className={`p-0 ${isToday ? "border-primary/40" : ""}`}
              aria-current={isToday ? "date" : undefined}
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">
                    {isToday ? "Today" : `Day ${dayOfWeek}`}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">{day}</h2>
                </div>
                <Badge tone={dayEntries.length ? "lime" : "neutral"}>
                  {dayEntries.length
                    ? isFuture
                      ? `${dayEntries.length} ${dayEntries.length === 1 ? "exercise" : "exercises"}`
                      : `${doneCount} of ${dayEntries.length} done`
                    : "Rest"}
                </Badge>
              </div>
              {dayEntries.length ? (
                <div className="grid gap-2 p-4">
                  {dayEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-3 rounded-xl bg-canvas/50 p-3"
                    >
                      <div className="grid size-10 place-items-center rounded-lg bg-primary/10 font-semibold text-primary">
                        {entry.exercise.suggested_sets}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate font-bold ${entry.completed ? "text-muted line-through" : ""}`}
                        >
                          {entry.exercise.name}
                        </p>
                        <p className="text-xs text-muted">
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
                            className={`grid size-11 place-items-center rounded-xl border disabled:opacity-60 ${entry.completed ? "border-primary bg-primary text-on-primary" : "border-line-strong text-muted hover:border-primary hover:text-primary"}`}
                            icon={<Check className="size-4" />}
                          />
                        </ActionForm>
                      )}

                      <ActionForm action={removeWorkoutEntry}>
                        <input type="hidden" name="entryId" value={entry.id} />
                        <PendingButton
                          label={`Remove ${entry.exercise.name} from ${day}`}
                          className="grid size-11 place-items-center rounded-xl text-muted hover:bg-danger/10 hover:text-danger disabled:opacity-60"
                          icon={<Trash2 className="size-4" />}
                        />
                      </ActionForm>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="px-5 py-4 text-sm text-muted">
                  Rest day.{" "}
                  <NextLink
                    href="/train/exercises"
                    className="text-ink underline-offset-4 hover:underline"
                  >
                    Add an exercise
                  </NextLink>
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
