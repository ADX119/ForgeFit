import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@forgefit/supabase";
import { Brand } from "@/components/brand";
import { SetupRequired } from "@/components/setup-required";
import { ProfileForm } from "@/components/features/profile-form";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  if (!isSupabaseConfigured()) return <SetupRequired />;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profile?.onboarding_completed) redirect("/today");
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      <Brand />
      <div className="mt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Your baseline
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Shape ForgeFit around you.
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted">
          These details power your daily estimate and recipe goal. You can change them anytime.
        </p>
      </div>
      <div className="mt-10 rounded-2xl border border-line bg-surface/75 p-5 sm:p-8">
        <ProfileForm
          profile={profile ?? { display_name: String(user.user_metadata.display_name ?? "") }}
          onboarding
        />
      </div>
      <p className="mt-5 text-xs leading-5 text-muted">
        Adults 18+ only. Results are estimates and not a substitute for medical advice.
      </p>
    </main>
  );
}
