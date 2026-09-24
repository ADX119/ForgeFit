"use client";

import { Badge, Card, EmptyState } from "@forgefit/ui";
import { Dumbbell, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { ExerciseView } from "@/lib/data/queries";
import { ActionForm, PendingButton } from "@/components/action-form";
import { addWorkoutEntry } from "@/lib/actions/features";

export function ExerciseCatalog({ exercises }: { exercises: ExerciseView[] }) {
  const [search, setSearch] = useState("");
  const [muscle, setMuscle] = useState("ALL");
  const [difficulty, setDifficulty] = useState("ALL");
  const [equipment, setEquipment] = useState("ALL");
  const muscles = [...new Set(exercises.map((item) => item.muscle.name))];
  const equipmentOptions = [
    ...new Set(exercises.flatMap((item) => item.equipment.map((entry) => entry.name))),
  ];
  const filtered = useMemo(
    () =>
      exercises.filter((item) => {
        const query = search.trim().toLowerCase();
        return (
          (!query || `${item.name} ${item.description}`.toLowerCase().includes(query)) &&
          (muscle === "ALL" || item.muscle.name === muscle) &&
          (difficulty === "ALL" || item.difficulty === difficulty) &&
          (equipment === "ALL" || item.equipment.some((entry) => entry.name === equipment))
        );
      }),
    [difficulty, equipment, exercises, muscle, search],
  );

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 lg:grid-cols-[1fr_repeat(3,minmax(150px,0.35fr))]">
        <label className="relative">
          <span className="sr-only">Search exercises</span>
          <Search className="absolute left-3 top-3.5 size-4 text-zinc-400" />
          <input
            className="input pl-10"
            placeholder="Search exercises…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <select
          aria-label="Muscle group"
          className="input"
          value={muscle}
          onChange={(event) => setMuscle(event.target.value)}
        >
          <option value="ALL">All muscles</option>
          {muscles.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          aria-label="Difficulty"
          className="input"
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value)}
        >
          <option value="ALL">All levels</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
        <select
          aria-label="Equipment"
          className="input"
          value={equipment}
          onChange={(event) => setEquipment(event.target.value)}
        >
          <option value="ALL">All equipment</option>
          {equipmentOptions.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      {filtered.length ? (
        <div className="grid grid-auto gap-4">
          {filtered.map((exercise) => (
            <Card key={exercise.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <div className="grid size-12 place-items-center rounded-xl bg-lime-300/10 text-lime-300">
                  <Dumbbell className="size-6" />
                </div>
                <Badge>{exercise.difficulty}</Badge>
              </div>
              <p className="mt-5 text-xs font-black uppercase tracking-wider text-lime-300">
                {exercise.muscle.name}
              </p>
              <h2 className="mt-1 text-xl font-black">{exercise.name}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-zinc-400">{exercise.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-400">
                <span>{exercise.suggested_sets} sets</span>
                <span>·</span>
                <span>{exercise.suggested_reps} reps</span>
                {exercise.equipment.length ? (
                  <>
                    <span>·</span>
                    <span>{exercise.equipment.map((item) => item.name).join(", ")}</span>
                  </>
                ) : (
                  <>
                    <span>·</span>
                    <span>Bodyweight</span>
                  </>
                )}
              </div>
              {exercise.steps?.length ? (
                <details className="mt-4 rounded-2xl border border-white/10 bg-zinc-950/80 p-4 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between text-sm font-bold text-sky-300">
                    Step-by-step instructions
                    <span className="text-xs text-zinc-400">{exercise.steps.length} steps</span>
                  </summary>
                  <ol className="mt-4 space-y-3 text-sm text-zinc-300">
                    {exercise.steps.map((step) => (
                      <li key={step.position} className="space-y-1 rounded-xl bg-white/5 p-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                          Step {step.position}
                        </p>
                        <p>{step.instruction}</p>
                      </li>
                    ))}
                  </ol>
                </details>
              ) : null}
              <ActionForm action={addWorkoutEntry} className="mt-5 flex gap-2">
                <input type="hidden" name="exerciseId" value={exercise.id} />
                <select
                  className="input min-w-0"
                  name="dayOfWeek"
                  aria-label={`Day for ${exercise.name}`}
                >
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                    <option value={index + 1} key={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <PendingButton
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-lime-300 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-lime-200 disabled:opacity-60"
                  icon={<Plus className="size-4" />}
                >
                  Add
                </PendingButton>
              </ActionForm>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Search className="size-8" />}
          title="No exercises found"
          description="Try clearing a filter or using a broader search."
        />
      )}
    </div>
  );
}
