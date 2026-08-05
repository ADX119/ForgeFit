"use server";

import { profileSchema } from "@fitforge/domain";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "./state";

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
      timezone: data.timezone,
      onboarding_completed: true,
    })
    .eq("id", user.id);
  if (error) return { status: "error", message: error.message };
  revalidatePath("/", "layout");
  redirect("/dashboard");
}
