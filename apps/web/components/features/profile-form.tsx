"use client";

import { Button } from "@fitforge/ui";
import { LoaderCircle } from "lucide-react";
import { useActionState } from "react";
import type { ProfileRow } from "@fitforge/supabase";
import { saveProfile } from "@/lib/actions/profile";
import { initialActionState } from "@/lib/actions/state";

export function ProfileForm({
  profile,
  onboarding = false,
}: {
  profile: Partial<ProfileRow>;
  onboarding?: boolean;
}) {
  const [state, action, pending] = useActionState(saveProfile, initialActionState);
  return (
    <form action={action} className="grid gap-5">
      <label className="label">
        Name
        <input
          className="input"
          name="displayName"
          defaultValue={profile.display_name ?? ""}
          required
          minLength={2}
        />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="label">
          Height (cm)
          <input
            className="input"
            name="heightCm"
            type="number"
            min="120"
            max="230"
            step="0.1"
            defaultValue={profile.height_cm ?? ""}
            required
          />
        </label>
        <label className="label">
          Weight (kg)
          <input
            className="input"
            name="weightKg"
            type="number"
            min="35"
            max="300"
            step="0.1"
            defaultValue={profile.weight_kg ?? ""}
            required
          />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="label">
          Age
          <input
            className="input"
            name="age"
            type="number"
            min="18"
            max="100"
            defaultValue={profile.age ?? ""}
            required
          />
        </label>
        <label className="label">
          Calculation sex
          <select
            className="input"
            name="calculationSex"
            defaultValue={profile.calculation_sex ?? "PREFER_NOT_TO_SAY"}
          >
            <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
            <option value="FEMALE">Female</option>
            <option value="MALE">Male</option>
          </select>
          <span className="text-xs font-normal leading-5 text-zinc-500">
            Used only for the calorie estimate.
          </span>
        </label>
      </div>
      <label className="label">
        Activity level
        <select
          className="input"
          name="activityLevel"
          defaultValue={profile.activity_level ?? "MODERATELY_ACTIVE"}
        >
          <option value="SEDENTARY">Sedentary</option>
          <option value="LIGHTLY_ACTIVE">Lightly active</option>
          <option value="MODERATELY_ACTIVE">Moderately active</option>
          <option value="VERY_ACTIVE">Very active</option>
          <option value="EXTRA_ACTIVE">Extra active</option>
        </select>
      </label>
      <label className="label">
        Primary goal
        <select className="input" name="goal" defaultValue={profile.goal ?? "MAINTENANCE"}>
          <option value="MUSCLE_GAIN">Muscle gain</option>
          <option value="FAT_LOSS">Fat loss</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="RECOMPOSITION">Recomposition</option>
        </select>
      </label>
      <input type="hidden" name="timezone" value="Asia/Kolkata" />
      {state.message ? (
        <p
          role="alert"
          className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200"
        >
          {state.message}
        </p>
      ) : null}
      <Button className="mt-2 sm:justify-self-start" disabled={pending}>
        {pending ? <LoaderCircle className="size-4 animate-spin" /> : null}
        {onboarding ? "Create my plan" : "Save changes"}
      </Button>
    </form>
  );
}
