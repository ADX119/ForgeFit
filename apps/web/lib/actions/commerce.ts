"use server";

import {
  equipmentOwnershipSchema,
  groceryProviderSchema,
  providerName,
  trainingLocationSchema,
} from "@forgefit/domain";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { fail, ok, type MutationResult } from "./state";

const SIGNED_OUT = "You've been signed out. Sign in again to continue.";
const TRY_AGAIN = "That didn't save. Check your connection and try again.";

async function userOrNull() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? { supabase, user } : null;
}

export async function setGroceryProvider(formData: FormData): Promise<MutationResult> {
  const parsed = groceryProviderSchema.safeParse({ provider: formData.get("provider") });
  if (!parsed.success) return fail("Choose one of the listed stores.");
  const session = await userOrNull();
  if (!session) return fail(SIGNED_OUT);
  const { error } = await session.supabase
    .from("profiles")
    .update({ preferred_grocery_provider: parsed.data.provider })
    .eq("id", session.user.id);
  if (error) return fail(TRY_AGAIN);
  revalidatePath("/nutrition/grocery");
  return ok(`Shopping on ${providerName(parsed.data.provider)}.`);
}

export async function setTrainingLocation(formData: FormData): Promise<MutationResult> {
  const parsed = trainingLocationSchema.safeParse({ location: formData.get("location") });
  if (!parsed.success) return fail("Choose where you train.");
  const session = await userOrNull();
  if (!session) return fail(SIGNED_OUT);
  const { error } = await session.supabase
    .from("profiles")
    .update({ training_location: parsed.data.location })
    .eq("id", session.user.id);
  if (error) return fail(TRY_AGAIN);
  revalidatePath("/train/equipment");
  return ok();
}

export async function setEquipmentOwned(formData: FormData): Promise<MutationResult> {
  const parsed = equipmentOwnershipSchema.safeParse({
    equipmentId: formData.get("equipmentId"),
    owned: formData.get("owned") === "true",
  });
  if (!parsed.success) return fail("That equipment no longer exists. Reload the page.");
  const session = await userOrNull();
  if (!session) return fail(SIGNED_OUT);
  const { supabase, user } = session;
  const { equipmentId, owned } = parsed.data;
  const { error } = owned
    ? await supabase
        .from("user_equipment")
        .upsert(
          { user_id: user.id, equipment_id: equipmentId },
          { onConflict: "user_id,equipment_id", ignoreDuplicates: true },
        )
    : await supabase
        .from("user_equipment")
        .delete()
        .eq("user_id", user.id)
        .eq("equipment_id", equipmentId);
  if (error) return fail(TRY_AGAIN);
  revalidatePath("/train/equipment");
  return ok();
}
