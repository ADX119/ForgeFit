import { PageHeader } from "@fitforge/ui";
import { RecipeCatalog } from "@/components/features/recipe-catalog";
import { getCurrentProfile, getRecipes } from "@/lib/data/queries";

export default async function DietPage() {
  const [recipes, profile] = await Promise.all([getRecipes(), getCurrentProfile()]);
  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Diet & nutrition"
        title="Eat for the goal you chose"
        description="Macros are per serving and intentionally transparent. Adjust portions to match your target and appetite."
      />
      <RecipeCatalog recipes={recipes} initialGoal={profile.goal ?? "ALL"} />
    </div>
  );
}
