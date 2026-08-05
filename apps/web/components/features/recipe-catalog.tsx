"use client";

import type { Route } from "next";
import Link from "next/link";
import { Badge, Card, EmptyState } from "@fitforge/ui";
import { Clock, Search, UtensilsCrossed } from "lucide-react";
import { useMemo, useState } from "react";
import type { DietGoal } from "@fitforge/domain";
import type { RecipeView } from "@/lib/data/queries";

const goals: { value: "ALL" | DietGoal; label: string }[] = [
  { value: "ALL", label: "All goals" },
  { value: "MUSCLE_GAIN", label: "Muscle gain" },
  { value: "FAT_LOSS", label: "Fat loss" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "RECOMPOSITION", label: "Recomposition" },
];

export function RecipeCatalog({
  recipes,
  initialGoal = "ALL",
}: {
  recipes: RecipeView[];
  initialGoal?: "ALL" | DietGoal;
}) {
  const [goal, setGoal] = useState<"ALL" | DietGoal>(initialGoal);
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      recipes.filter(
        (recipe) =>
          (goal === "ALL" || recipe.goals.includes(goal)) &&
          (!search.trim() ||
            `${recipe.name} ${recipe.description}`.toLowerCase().includes(search.toLowerCase())),
      ),
    [goal, recipes, search],
  );
  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 lg:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search recipes</span>
          <Search className="absolute left-3 top-3.5 size-4 text-zinc-500" />
          <input
            className="input pl-10"
            placeholder="Search recipes…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {goals.map((item) => (
            <button
              key={item.value}
              onClick={() => setGoal(item.value)}
              className={`min-h-11 shrink-0 rounded-xl border px-4 text-sm font-bold ${goal === item.value ? "border-lime-300 bg-lime-300/10 text-lime-300" : "border-zinc-700 text-zinc-400 hover:text-white"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {filtered.length ? (
        <div className="grid grid-auto gap-4">
          {filtered.map((recipe) => (
            <Link
              href={`/recipes/${recipe.id}` as Route}
              key={recipe.id}
              className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300"
            >
              <Card className="h-full transition hover:-translate-y-0.5 hover:border-lime-300/25">
                <div className="flex items-start justify-between">
                  <div className="grid size-12 place-items-center rounded-xl bg-orange-300/10 text-orange-300">
                    <UtensilsCrossed className="size-6" />
                  </div>
                  <Badge>{recipe.difficulty}</Badge>
                </div>
                <h2 className="mt-5 text-xl font-black">{recipe.name}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{recipe.description}</p>
                <div className="mt-5 flex items-center gap-4 text-xs font-bold text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock className="size-4" />
                    {recipe.prep_time_minutes} min
                  </span>
                  <span>{recipe.calories_per_serving} kcal</span>
                  <span>{recipe.protein_g}g protein</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="No recipes found" description="Try a different goal or search term." />
      )}
    </div>
  );
}
