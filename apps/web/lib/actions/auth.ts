"use server";

import { authSchema } from "@fitforge/domain";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "./state";

const errorState = (message: string): ActionState => ({ status: "error", message });

export async function login(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success)
    return {
      status: "error",
      message: "Check your email and password.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return errorState(error.message);
  redirect("/dashboard");
}

export async function register(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const displayName = String(formData.get("displayName") ?? "").trim();
  if (!parsed.success || displayName.length < 2)
    return errorState("Enter your name, a valid email, and a password of at least 8 characters.");
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({
    ...parsed.data,
    options: { data: { display_name: displayName }, emailRedirectTo: `${siteUrl}/auth/confirm` },
  });
  if (error) return errorState(error.message);
  if (!data.session)
    return { status: "success", message: "Check your inbox to confirm your email, then sign in." };
  redirect("/onboarding");
}

export async function requestPasswordReset(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email.includes("@")) return errorState("Enter a valid email address.");
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/update-password`,
  });
  if (error) return errorState(error.message);
  return { status: "success", message: "If that account exists, a reset link is on its way." };
}

export async function updatePassword(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8 || password.length > 72)
    return errorState("Use a password between 8 and 72 characters.");
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return errorState(error.message);
  return { status: "success", message: "Password updated. You can continue to your dashboard." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
