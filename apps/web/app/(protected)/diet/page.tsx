import { Card, PageHeader } from "@fitforge/ui";
import { RecipeCatalog } from "@/components/features/recipe-catalog";
import { generateDietPlan, generateRecipeRecommendations } from "@fitforge/domain";
import { getCurrentProfile, getRecipes } from "@/lib/data/queries";

export default async function DietPage() {
  const [recipes, profile] = await Promise.all([getRecipes(), getCurrentProfile()]);
  const recipeSuggestions =
    profile.age !== null && profile.height_cm !== null && profile.weight_kg !== null && profile.calculation_sex !== null && profile.activity_level !== null && profile.goal !== null
      ? await generateRecipeRecommendations(
          {
            age: profile.age,
            heightCm: profile.height_cm,
            weightKg: profile.weight_kg,
            calculationSex: profile.calculation_sex,
            activityLevel: profile.activity_level,
            goal: profile.goal,
          },
        )
      : "Complete your profile to see personalized meal ideas.";
  const dietPlan =
    profile.age !== null && profile.height_cm !== null && profile.weight_kg !== null && profile.calculation_sex !== null && profile.activity_level !== null && profile.goal !== null
      ? await generateDietPlan(
          {
            age: profile.age,
            heightCm: profile.height_cm,
            weightKg: profile.weight_kg,
            calculationSex: profile.calculation_sex,
            activityLevel: profile.activity_level,
            goal: profile.goal,
          },
        )
      : "Complete your profile to see a personalized diet plan.";

  const recommendedRecipes = recipes.filter((recipe) =>
    profile.goal ? recipe.goals.includes(profile.goal) : true,
  );
  const mealPlanRecipes = recommendedRecipes.slice(0, 3);

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Diet & nutrition"
        title="Eat for the goal you chose"
        description="Macros are per serving and intentionally transparent. Adjust portions to match your target and appetite."
      />
      <Card>
        <div className="grid gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-lime-300">Your meal plan</p>
            <h2 className="mt-2 text-xl font-black">Real recipes from your database</h2>
          </div>
          {mealPlanRecipes.length ? (
            <div className="space-y-3">
              {mealPlanRecipes.map((recipe) => (
                <div key={recipe.id} className="rounded-3xl border border-white/10 bg-zinc-950/80 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{recipe.name}</p>
                      <p className="mt-1 text-xs text-zinc-500">{recipe.description}</p>
                    </div>
                    <div className="text-right text-xs text-zinc-400">
                      <p>{recipe.prep_time_minutes} min</p>
                      <p>{recipe.calories_per_serving} kcal</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-zinc-300">No recipes were found for your goal yet. Browse the recipe catalog below.</p>
          )}
        </div>
      </Card>
      <Card>
        <div className="grid gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-sky-300">AI-generated plan</p>
            <h2 className="mt-2 text-xl font-black">Daily diet plan</h2>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-300">{dietPlan}</p>
        </div>
      </Card>
      <RecipeCatalog recipes={recipes} initialGoal={profile.goal ?? "ALL"} />
    </div>
  );
}
