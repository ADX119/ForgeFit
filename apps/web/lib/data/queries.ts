import "server-only";
import { cache } from "react";
import { calculateMacroTarget, zonedDay, zonedWeekDates, type DietGoal } from "@forgefit/domain";
import type {
  EquipmentRow,
  ExerciseRow,
  GroceryItemRow,
  ProfileRow,
  RecipeRow,
} from "@forgefit/supabase";
import { createClient } from "@/lib/supabase/server";

export interface ExerciseView extends ExerciseRow {
  muscle: { id: string; name: string; slug: string };
  equipment: EquipmentRow[];
  steps?: { position: number; instruction: string }[];
}

export interface RecipeView extends RecipeRow {
  goals: DietGoal[];
  ingredients?: (import("@forgefit/supabase").IngredientRow & {
    alternatives: { id: string; name: string }[];
  })[];
  steps?: { position: number; instruction: string }[];
}

export interface WorkoutEntryView {
  id: string;
  day_of_week: number;
  exercise: Pick<ExerciseRow, "id" | "name" | "suggested_sets" | "suggested_reps" | "difficulty">;
  completed?: boolean;
}

// Cached per request: pages and their queries share one auth check and one profile read.
export const getCurrentProfile = cache(async (): Promise<ProfileRow> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentication required");
  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (error || !data) throw new Error(error?.message ?? "Profile not found");
  return data as ProfileRow;
});

export async function getDashboard() {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  const today = zonedDay(profile.timezone);
  const { data: plan } = await supabase
    .from("workout_plans")
    .select("id")
    .eq("user_id", profile.id)
    .single();
  const { data: entriesData } = plan
    ? await supabase
        .from("workout_entries")
        .select("id,day_of_week,exercises(id,name,suggested_sets,suggested_reps,difficulty)")
        .eq("workout_plan_id", plan.id)
        .eq("day_of_week", today.dayOfWeek)
        .order("created_at")
    : { data: [] };
  const entryIds = (entriesData ?? []).map((entry) => entry.id);
  const { data: completions } = entryIds.length
    ? await supabase
        .from("workout_completions")
        .select("entry_id")
        .in("entry_id", entryIds)
        .eq("completion_date", today.date)
    : { data: [] };
  const completeIds = new Set((completions ?? []).map((item) => item.entry_id));
  const entries: WorkoutEntryView[] = (entriesData ?? []).map((entry) => ({
    id: entry.id,
    day_of_week: entry.day_of_week,
    exercise: entry.exercises as unknown as WorkoutEntryView["exercise"],
    completed: completeIds.has(entry.id),
  }));
  const target =
    profile.height_cm &&
    profile.weight_kg &&
    profile.age &&
    profile.calculation_sex &&
    profile.activity_level &&
    profile.goal
      ? calculateMacroTarget({
          heightCm: profile.height_cm,
          weightKg: profile.weight_kg,
          age: profile.age,
          calculationSex: profile.calculation_sex,
          activityLevel: profile.activity_level,
          goal: profile.goal,
        })
      : null;
  return { profile, today, entries, target };
}

export async function getExercises(): Promise<ExerciseView[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .select(
      "*,muscle_groups!exercises_primary_muscle_group_id_fkey(id,name,slug),exercise_equipment(equipment(*)),exercise_steps(position,instruction)",
    )
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    ...row,
    muscle: row.muscle_groups,
    equipment: row.exercise_equipment.map((link: { equipment: EquipmentRow }) => link.equipment),
    steps: row.exercise_steps,
  })) as unknown as ExerciseView[];
}

export async function getWorkout() {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  const { data: plan } = await supabase
    .from("workout_plans")
    .select("id,name")
    .eq("user_id", profile.id)
    .single();
  const { data: entries } = plan
    ? await supabase
        .from("workout_entries")
        .select("id,day_of_week,exercises(id,name,suggested_sets,suggested_reps,difficulty)")
        .eq("workout_plan_id", plan.id)
        .order("day_of_week")
    : { data: [] };

  const today = zonedDay(profile.timezone);
  const weekDates = zonedWeekDates(profile.timezone);
  const entryIds = (entries ?? []).map((entry) => entry.id);
  const { data: completions } = entryIds.length
    ? await supabase
        .from("workout_completions")
        .select("entry_id,completion_date")
        .in("entry_id", entryIds)
        .gte("completion_date", weekDates[0]!)
        .lte("completion_date", weekDates[6]!)
    : { data: [] };
  const completedKeys = new Set(
    (completions ?? []).map((item) => `${item.entry_id}:${item.completion_date}`),
  );

  return {
    plan,
    today,
    weekDates,
    entries: (entries ?? []).map((entry) => ({
      id: entry.id,
      day_of_week: entry.day_of_week,
      exercise: entry.exercises,
      // Done means completed on this week's date for the entry's own weekday.
      completed: completedKeys.has(`${entry.id}:${weekDates[entry.day_of_week - 1]}`),
    })) as unknown as WorkoutEntryView[],
  };
}

export async function getRecipes(): Promise<RecipeView[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("*,recipe_goals(goal)")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    ...row,
    goals: row.recipe_goals.map((item: { goal: DietGoal }) => item.goal),
  })) as unknown as RecipeView[];
}

export async function getRecipe(id: string): Promise<RecipeView | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(
      "*,recipe_goals(goal),recipe_steps(position,instruction),ingredients(*,ingredient_alternatives(id,name))",
    )
    .eq("id", id)
    .single();
  if (error) return null;
  return {
    ...data,
    goals: data.recipe_goals.map((item: { goal: DietGoal }) => item.goal),
    steps: data.recipe_steps,
    ingredients: data.ingredients.map(
      (
        item: import("@forgefit/supabase").IngredientRow & {
          ingredient_alternatives: { id: string; name: string }[];
        },
      ) => ({ ...item, alternatives: item.ingredient_alternatives }),
    ),
  } as unknown as RecipeView;
}

export async function getGroceries(): Promise<GroceryItemRow[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("grocery_items")
    .select("*")
    .eq("user_id", user.id)
    .order("checked")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as GroceryItemRow[];
}

/** Equipment page: what can be bought, what the user owns, and what their plan uses. */
export async function getEquipmentOverview() {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  const [{ data: items, error }, { data: owned }, { data: plan }] = await Promise.all([
    supabase.from("equipment").select("*").eq("purchasable", true).order("name"),
    supabase.from("user_equipment").select("equipment_id").eq("user_id", profile.id),
    supabase.from("workout_plans").select("id").eq("user_id", profile.id).single(),
  ]);
  if (error) throw new Error(error.message);
  let usedByPlan = new Set<string>();
  if (plan) {
    const { data: entries } = await supabase
      .from("workout_entries")
      .select("exercises(exercise_equipment(equipment_id))")
      .eq("workout_plan_id", plan.id);
    const typedEntries = (entries ?? []) as unknown as {
      exercises: { exercise_equipment: { equipment_id: string }[] } | null;
    }[];
    usedByPlan = new Set(
      typedEntries.flatMap(
        (entry) => entry.exercises?.exercise_equipment.map((item) => item.equipment_id) ?? [],
      ),
    );
  }
  return {
    items: (items ?? []) as EquipmentRow[],
    owned: new Set((owned ?? []).map((row) => row.equipment_id as string)),
    usedByPlan,
    location: profile.training_location,
  };
}
