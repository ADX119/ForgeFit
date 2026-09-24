"use server";

import { authSchema } from "@forgefit/domain";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "./state";

const errorState = (message: string): ActionState => ({ status: "error", message });

// Supabase auth error codes → messages people can act on. Raw messages never reach the UI.
const authMessages: Record<string, string> = {
  invalid_credentials: "Email or password is incorrect.",
  email_not_confirmed: "Confirm your email first. Check your inbox for the link.",
  email_address_invalid:
    "That email address can't be used. Check it for typos, or try another address.",
  email_address_not_authorized: "We can't send email to that address yet. Try again later.",
  user_already_exists: "An account with this email already exists. Sign in instead.",
  email_exists: "An account with this email already exists. Sign in instead.",
  weak_password: "Choose a stronger password: at least 8 characters, not a common one.",
  same_password: "Choose a password you haven't used for this account before.",
  over_request_rate_limit: "Too many attempts. Wait a minute and try again.",
  over_email_send_rate_limit: "Too many emails sent. Wait a few minutes and try again.",
  signup_disabled: "New sign-ups are paused right now. Try again later.",
};

function authError(error: { code?: string }): ActionState {
  return errorState(
    (error.code && authMessages[error.code]) ??
      "We couldn't complete that. Check your connection and try again.",
  );
}

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
  if (error) return authError(error);
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
  if (error) return authError(error);
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
    // Lands on /auth/confirm, which signs the user in from the link before showing the form.
    redirectTo: `${siteUrl}/auth/confirm?next=/update-password`,
  });
  if (error) return authError(error);
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
  if (error) return authError(error);
  return { status: "success", message: "Password updated. You can continue to your dashboard." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
