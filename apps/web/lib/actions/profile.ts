"use server";

import { dietPreferenceSchema, profileSchema } from "@forgefit/domain";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fail, ok, type ActionState, type MutationResult } from "./state";

export async function saveProfile(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      status: "error",
      message: "Please correct the highlighted profile fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Your session expired. Sign in again." };
  const data = parsed.data;
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: data.displayName,
      height_cm: data.heightCm,
      weight_kg: data.weightKg,
      age: data.age,
      calculation_sex: data.calculationSex,
      activity_level: data.activityLevel,
      goal: data.goal,
      diet_preference: data.dietPreference,
      timezone: data.timezone,
      onboarding_completed: true,
    })
    .eq("id", user.id);
  if (error)
    return {
      status: "error",
      message: "Your profile didn't save. Check your connection and try again.",
    };
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function saveDietPreference(formData: FormData): Promise<MutationResult> {
  const parsed = dietPreferenceSchema.safeParse({ dietPreference: formData.get("dietPreference") });
  if (!parsed.success) return fail("Choose one of the options.");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return fail("You've been signed out. Sign in again to continue.");
  const { error } = await supabase
    .from("profiles")
    .update({ diet_preference: parsed.data.dietPreference })
    .eq("id", user.id);
  if (error) return fail("That didn't save. Check your connection and try again.");
  revalidatePath("/diet");
  revalidatePath("/profile");
  return ok("Recipes now match how you eat.");
}
