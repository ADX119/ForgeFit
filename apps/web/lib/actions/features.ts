"use server";

import {
  completionSchema,
  groceryRecipeSchema,
  workoutEntrySchema,
  zonedDay,
} from "@forgefit/domain";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { fail, ok, type MutationResult } from "./state";

const SIGNED_OUT = "You've been signed out. Sign in again to continue.";
const TRY_AGAIN = "That didn't save. Check your connection and try again.";

const idSchema = z.uuid();

async function userOrNull() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? { supabase, user } : null;
}

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** ISO weekday (1 = Monday) of a YYYY-MM-DD calendar date. */
function isoWeekday(date: string) {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay();
  return ((day + 6) % 7) + 1;
}

export async function addWorkoutEntry(formData: FormData): Promise<MutationResult> {
  const parsed = workoutEntrySchema.safeParse({
    exerciseId: formData.get("exerciseId"),
    dayOfWeek: Number(formData.get("dayOfWeek")),
  });
  if (!parsed.success) return fail("Choose a day for this exercise.");
  const session = await userOrNull();
  if (!session) return fail(SIGNED_OUT);
  const { supabase, user } = session;
  const { data: plan } = await supabase
    .from("workout_plans")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!plan) return fail("We couldn't find your workout plan. Reload the page and try again.");
  const { data, error } = await supabase
    .from("workout_entries")
    .upsert(
      {
        workout_plan_id: plan.id,
        exercise_id: parsed.data.exerciseId,
        day_of_week: parsed.data.dayOfWeek,
      },
      { onConflict: "workout_plan_id,exercise_id,day_of_week", ignoreDuplicates: true },
    )
    .select("id");
  if (error) return fail(TRY_AGAIN);
  revalidatePath("/train");
  revalidatePath("/today");
  revalidatePath("/train/equipment");
  const dayName = DAY_NAMES[parsed.data.dayOfWeek - 1];
  // ignoreDuplicates returns no row when the exercise was already on that day.
  return data?.length ? ok(`Added to ${dayName}.`) : ok(`Already on ${dayName}.`);
}

export async function removeWorkoutEntry(formData: FormData): Promise<MutationResult> {
  const id = idSchema.safeParse(formData.get("entryId"));
  if (!id.success) return fail("That exercise no longer exists. Reload the page.");
  const session = await userOrNull();
  if (!session) return fail(SIGNED_OUT);
  const { error } = await session.supabase.from("workout_entries").delete().eq("id", id.data);
  if (error) return fail(TRY_AGAIN);
  revalidatePath("/train");
  revalidatePath("/today");
  revalidatePath("/train/equipment");
  return ok("Removed from your plan.");
}

export async function setWorkoutCompletion(formData: FormData): Promise<MutationResult> {
  const parsed = completionSchema.safeParse({
    entryId: formData.get("entryId"),
    completionDate: formData.get("completionDate"),
    completed: formData.get("completed") === "true",
  });
  if (!parsed.success) return fail("That exercise no longer exists. Reload the page.");
  const session = await userOrNull();
  if (!session) return fail(SIGNED_OUT);
  const { supabase, user } = session;
  const { entryId, completionDate, completed } = parsed.data;

  const [{ data: profile }, { data: entry }] = await Promise.all([
    supabase.from("profiles").select("timezone").eq("id", user.id).single(),
    supabase.from("workout_entries").select("day_of_week").eq("id", entryId).single(),
  ]);
  if (!entry) return fail("That exercise no longer exists. Reload the page.");
  const today = zonedDay(profile?.timezone ?? "");
  // A completion belongs to the entry's own weekday and can't be logged ahead of time.
  if (isoWeekday(completionDate) !== entry.day_of_week)
    return fail("That date doesn't match this exercise's day. Reload the page.");
  if (completionDate > today.date) return fail("You can mark this complete on the day itself.");

  const { error } = completed
    ? // Insert-or-ignore: ON CONFLICT DO NOTHING needs only the INSERT grant this table has.
      await supabase
        .from("workout_completions")
        .upsert(
          { user_id: user.id, entry_id: entryId, completion_date: completionDate },
          { onConflict: "entry_id,completion_date", ignoreDuplicates: true },
        )
    : await supabase
        .from("workout_completions")
        .delete()
        .eq("entry_id", entryId)
        .eq("completion_date", completionDate);
  if (error) return fail(TRY_AGAIN);
  revalidatePath("/today");
  revalidatePath("/train");
  return ok();
}

export async function addRecipeToGrocery(formData: FormData): Promise<MutationResult> {
  const parsed = groceryRecipeSchema.safeParse({
    recipeId: formData.get("recipeId"),
    servings: Number(formData.get("servings")),
  });
  if (!parsed.success) return fail("Servings must be between 0.5 and 20.");
  const session = await userOrNull();
  if (!session) return fail(SIGNED_OUT);
  const { error } = await session.supabase.rpc("add_recipe_to_grocery_list", {
    p_recipe_id: parsed.data.recipeId,
    p_servings: parsed.data.servings,
  });
  if (error) return fail(TRY_AGAIN);
  revalidatePath("/nutrition/grocery");
  return ok("Ingredients added to your grocery list.");
}

export async function updateGroceryItem(formData: FormData): Promise<MutationResult> {
  const id = idSchema.safeParse(formData.get("itemId"));
  if (!id.success) return fail("That item is no longer on your list. Reload the page.");
  const session = await userOrNull();
  if (!session) return fail(SIGNED_OUT);
  const checked = formData.get("checked");
  const selectedAlternative = formData.get("selectedAlternative");
  const changes: { checked?: boolean; selected_alternative?: string | null } = {};
  if (checked !== null) changes.checked = checked === "true";
  if (selectedAlternative !== null)
    changes.selected_alternative = String(selectedAlternative) || null;
  const { error } = await session.supabase.from("grocery_items").update(changes).eq("id", id.data);
  if (error) return fail(TRY_AGAIN);
  revalidatePath("/nutrition/grocery");
  return ok();
}

export async function removeGroceryItem(formData: FormData): Promise<MutationResult> {
  const id = idSchema.safeParse(formData.get("itemId"));
  if (!id.success) return fail("That item is no longer on your list. Reload the page.");
  const session = await userOrNull();
  if (!session) return fail(SIGNED_OUT);
  const { error } = await session.supabase.from("grocery_items").delete().eq("id", id.data);
  if (error) return fail(TRY_AGAIN);
  revalidatePath("/nutrition/grocery");
  return ok("Removed from your list.");
}

export async function clearCheckedGroceries(): Promise<MutationResult> {
  const session = await userOrNull();
  if (!session) return fail(SIGNED_OUT);
  const { error } = await session.supabase
    .from("grocery_items")
    .delete()
    .eq("user_id", session.user.id)
    .eq("checked", true);
  if (error) return fail(TRY_AGAIN);
  revalidatePath("/nutrition/grocery");
  return ok("Checked items cleared.");
}
