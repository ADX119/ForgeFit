import { ArrowLeft, ChefHat, Clock, ListPlus, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Card } from "@fitforge/ui";
import { DemoOffers } from "@/components/features/demo-offers";
import { addRecipeToGrocery } from "@/lib/actions/features";
import { getRecipe } from "@/lib/data/queries";

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = await getRecipe(id);
  if (!recipe) notFound();
  return (
    <div className="grid gap-7">
      <Link
        href="/diet"
        className="inline-flex w-fit items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="size-4" /> Back to recipes
      </Link>
      <header className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="flex flex-wrap gap-2">
            {recipe.goals.map((goal) => (
              <Badge tone="lime" key={goal}>
                {goal.replaceAll("_", " ")}
              </Badge>
            ))}
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">{recipe.name}</h1>
          <p className="mt-4 max-w-2xl leading-7 text-zinc-400">{recipe.description}</p>
          <div className="mt-5 flex flex-wrap gap-5 text-sm font-bold text-zinc-500">
            <span className="flex items-center gap-2">
              <Clock className="size-4" />
              {recipe.prep_time_minutes} min
            </span>
            <span className="flex items-center gap-2">
              <ChefHat className="size-4" />
              {recipe.difficulty.toLowerCase()}
            </span>
            <span>{recipe.servings} servings</span>
          </div>
        </div>
        <DemoOffers
          type="DISH"
          sourceId={recipe.id}
          sourceName={recipe.name}
          label="Order this dish · Demo"
        />
      </header>
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Calories", recipe.calories_per_serving, "kcal"],
          ["Protein", recipe.protein_g, "g"],
          ["Carbs", recipe.carbs_g, "g"],
          ["Fat", recipe.fat_g, "g"],
        ].map(([label, value, unit]) => (
          <Card key={label} className="p-4">
            <p className="text-xs text-zinc-500">{label}</p>
            <p className="mt-1 text-2xl font-black">
              {value}
              <span className="ml-1 text-xs text-zinc-500">{unit}</span>
            </p>
          </Card>
        ))}
      </section>
      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-lime-300">
                Shopping list
              </p>
              <h2 className="mt-1 text-xl font-black">Ingredients</h2>
            </div>
            <ShoppingBasket className="size-5 text-zinc-600" />
          </div>
          <div className="mt-5 divide-y divide-white/8">
            {recipe.ingredients?.map((ingredient) => (
              <div key={ingredient.id} className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold">{ingredient.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {ingredient.quantity} {ingredient.unit}
                    </p>
                  </div>
                  <DemoOffers
                    type="INGREDIENT"
                    sourceId={ingredient.id}
                    sourceName={ingredient.name}
                    label="Shop · Demo"
                    compact
                  />
                </div>
                {ingredient.alternatives.length ? (
                  <p className="mt-2 text-xs text-zinc-500">
                    Alternatives: {ingredient.alternatives.map((item) => item.name).join(", ")}{" "}
                    <span className="text-zinc-600">· adjust quantities as needed</span>
                  </p>
                ) : null}
              </div>
            ))}
          </div>
          <form action={addRecipeToGrocery} className="mt-5 flex gap-2">
            <input type="hidden" name="recipeId" value={recipe.id} />
            <label className="sr-only" htmlFor="servings">
              Servings
            </label>
            <input
              id="servings"
              className="input w-24"
              name="servings"
              type="number"
              min="0.5"
              max="20"
              step="0.5"
              defaultValue={recipe.servings}
            />
            <Button className="flex-1">
              <ListPlus className="size-4" /> Add to groceries
            </Button>
          </form>
        </Card>
        <Card>
          <p className="text-xs font-black uppercase tracking-wider text-orange-300">Method</p>
          <h2 className="mt-1 text-xl font-black">Cook it step by step</h2>
          <ol className="mt-6 grid gap-5">
            {recipe.steps
              ?.sort((a, b) => a.position - b.position)
              .map((step) => (
                <li key={step.position} className="flex gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-orange-300/10 font-black text-orange-300">
                    {step.position}
                  </span>
                  <p className="pt-1 text-sm leading-6 text-zinc-300">{step.instruction}</p>
                </li>
              ))}
          </ol>
        </Card>
      </section>
    </div>
  );
}
