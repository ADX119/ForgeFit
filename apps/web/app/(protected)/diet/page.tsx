import Link from "next/link";
import type { Route } from "next";
import { Card, PageHeader } from "@forgefit/ui";
import { DIET_PREFERENCE_LABELS, recipeMatchesDiet } from "@forgefit/domain";
import { DietMark } from "@/components/features/diet-mark";
import { DietPreferencePicker } from "@/components/features/diet-preference-picker";
import { RecipeCatalog } from "@/components/features/recipe-catalog";
import { getCurrentProfile, getRecipes } from "@/lib/data/queries";

export default async function DietPage() {
  const [recipes, profile] = await Promise.all([getRecipes(), getCurrentProfile()]);
  const preference = profile.diet_preference;

  if (!preference) {
    return (
      <div className="grid gap-8">
        <PageHeader
          eyebrow="Diet & nutrition"
          title="How do you eat?"
          description="We'll only suggest recipes that fit. You can change this anytime in your profile."
        />
        <DietPreferencePicker current={null} />
      </div>
    );
  }

  const suitable = recipes.filter((recipe) => recipeMatchesDiet(recipe.diet_type, preference));
  const forGoal = suitable.filter((recipe) =>
    profile.goal ? recipe.goals.includes(profile.goal) : true,
  );
  // Some goal and diet combinations have few recipes; fall back to any suitable recipe.
  const mealPlanRecipes = (forGoal.length ? forGoal : suitable).slice(0, 3);
  const hiddenCount = recipes.length - suitable.length;

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Diet & nutrition"
        title="Eat for the goal you chose"
        description="Macros are per serving and intentionally transparent. Adjust portions to match your target and appetite."
      />
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-400">
        <span>
          Showing recipes for <DietMark diet={preference} />
        </span>
        {hiddenCount ? (
          <span>
            · {hiddenCount} {hiddenCount === 1 ? "recipe" : "recipes"} hidden
          </span>
        ) : null}
        <Link href={"/profile" as Route} className="font-bold text-lime-300 hover:text-lime-200">
          Change
        </Link>
      </p>
      <Card>
        <div className="grid gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-lime-300">
              Suggested for you
            </p>
            <h2 className="mt-2 text-xl font-black">
              {forGoal.length ? "Recipes that match your goal" : "Recipes that match how you eat"}
            </h2>
            {!forGoal.length && suitable.length ? (
              <p className="mt-1 text-sm text-zinc-400">
                No {DIET_PREFERENCE_LABELS[preference].toLowerCase()} recipes are tagged for your
                goal yet, so these are the closest fits.
              </p>
            ) : null}
          </div>
          {mealPlanRecipes.length ? (
            <div className="space-y-3">
              {mealPlanRecipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.id}` as Route}
                  className="block rounded-2xl border border-white/10 bg-zinc-950/80 p-4 hover:border-lime-300/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{recipe.name}</p>
                      <p className="mt-1 text-xs text-zinc-400">{recipe.description}</p>
                    </div>
                    <div className="shrink-0 text-right text-xs text-zinc-400">
                      <p>{recipe.prep_time_minutes} min</p>
                      <p>{recipe.calories_per_serving} kcal</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-zinc-300">
              No recipes match your diet preference yet. More are on the way.
            </p>
          )}
        </div>
      </Card>
      <RecipeCatalog
        recipes={suitable}
        initialGoal={forGoal.length && profile.goal ? profile.goal : "ALL"}
      />
    </div>
  );
}
