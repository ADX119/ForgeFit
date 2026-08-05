"use server";

import {
  completionSchema,
  demoOrderSchema,
  groceryRecipeSchema,
  MockFoodDeliveryProvider,
  MockShoppingProvider,
  workoutEntrySchema,
} from "@fitforge/domain";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "./state";

async function currentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentication required");
  return { supabase, user };
}

export async function addWorkoutEntry(formData: FormData) {
  const parsed = workoutEntrySchema.safeParse({
    exerciseId: formData.get("exerciseId"),
    dayOfWeek: Number(formData.get("dayOfWeek")),
  });
  if (!parsed.success) return;
  const { supabase, user } = await currentUser();
  const { data: plan } = await supabase
    .from("workout_plans")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!plan) throw new Error("Workout plan not found");
  await supabase.from("workout_entries").upsert(
    {
      workout_plan_id: plan.id,
      exercise_id: parsed.data.exerciseId,
      day_of_week: parsed.data.dayOfWeek,
    },
    { onConflict: "workout_plan_id,exercise_id,day_of_week", ignoreDuplicates: true },
  );
  revalidatePath("/workout");
  revalidatePath("/dashboard");
  revalidatePath("/shop");
}

export async function removeWorkoutEntry(formData: FormData) {
  const id = String(formData.get("entryId") ?? "");
  const { supabase } = await currentUser();
  await supabase.from("workout_entries").delete().eq("id", id);
  revalidatePath("/workout");
  revalidatePath("/dashboard");
  revalidatePath("/shop");
}

export async function setWorkoutCompletion(formData: FormData) {
  const parsed = completionSchema.safeParse({
    entryId: formData.get("entryId"),
    completionDate: formData.get("completionDate"),
    completed: formData.get("completed") === "true",
  });
  if (!parsed.success) return;
  const { supabase, user } = await currentUser();
  if (parsed.data.completed)
    await supabase.from("workout_completions").upsert(
      {
        user_id: user.id,
        entry_id: parsed.data.entryId,
        completion_date: parsed.data.completionDate,
      },
      { onConflict: "entry_id,completion_date" },
    );
  else
    await supabase
      .from("workout_completions")
      .delete()
      .eq("entry_id", parsed.data.entryId)
      .eq("completion_date", parsed.data.completionDate);
  revalidatePath("/dashboard");
  revalidatePath("/workout");
}

export async function addRecipeToGrocery(formData: FormData) {
  const parsed = groceryRecipeSchema.safeParse({
    recipeId: formData.get("recipeId"),
    servings: Number(formData.get("servings")),
  });
  if (!parsed.success) return;
  const { supabase } = await currentUser();
  const { error } = await supabase.rpc("add_recipe_to_grocery_list", {
    p_recipe_id: parsed.data.recipeId,
    p_servings: parsed.data.servings,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/grocery");
}

export async function updateGroceryItem(formData: FormData) {
  const id = String(formData.get("itemId") ?? "");
  const { supabase } = await currentUser();
  const checked = formData.get("checked");
  const selectedAlternative = formData.get("selectedAlternative");
  const changes: { checked?: boolean; selected_alternative?: string | null } = {};
  if (checked !== null) changes.checked = checked === "true";
  if (selectedAlternative !== null)
    changes.selected_alternative = String(selectedAlternative) || null;
  await supabase.from("grocery_items").update(changes).eq("id", id);
  revalidatePath("/grocery");
}

export async function removeGroceryItem(formData: FormData) {
  const { supabase } = await currentUser();
  await supabase
    .from("grocery_items")
    .delete()
    .eq("id", String(formData.get("itemId") ?? ""));
  revalidatePath("/grocery");
}

export async function clearCheckedGroceries() {
  const { supabase, user } = await currentUser();
  await supabase.from("grocery_items").delete().eq("user_id", user.id).eq("checked", true);
  revalidatePath("/grocery");
}

export async function placeDemoOrder(input: unknown): Promise<
  ActionState & {
    order?: { provider: string; priceInr: number; etaMinutes: number; status: string };
  }
> {
  const parsed = demoOrderSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "That demo offer is no longer valid." };
  const foodProvider = parsed.data.type === "DISH" ? new MockFoodDeliveryProvider() : null;
  const shoppingProvider = parsed.data.type !== "DISH" ? new MockShoppingProvider() : null;
  const offers = foodProvider
    ? await foodProvider.getOffers(parsed.data.sourceId, parsed.data.sourceName)
    : await shoppingProvider!.getOffers(
        parsed.data.type as "INGREDIENT" | "EQUIPMENT",
        parsed.data.sourceId,
        parsed.data.sourceName,
      );
  const selected = offers.find((item) => item.id === parsed.data.offerId);
  if (
    !selected ||
    selected.provider !== parsed.data.provider ||
    selected.priceInr !== parsed.data.priceInr
  )
    return { status: "error", message: "That demo offer is no longer valid." };
  const result = foodProvider
    ? foodProvider.placeDemoOrder(selected)
    : shoppingProvider!.placeDemoOrder(selected);
  const { supabase, user } = await currentUser();
  const { error } = await supabase.from("mock_orders").insert({
    user_id: user.id,
    order_type: parsed.data.type,
    source_id: parsed.data.sourceId,
    source_name: parsed.data.sourceName,
    provider: result.provider,
    mock_price_inr: result.priceInr,
    mock_eta_minutes: result.etaMinutes,
    status: result.status,
  });
  if (error) return { status: "error", message: error.message };
  revalidatePath("/profile");
  return {
    status: "success",
    message: result.message,
    order: {
      provider: result.provider,
      priceInr: result.priceInr,
      etaMinutes: result.etaMinutes,
      status: result.status,
    },
  };
}
