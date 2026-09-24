"use client";

import {
  DIET_PREFERENCE_DESCRIPTIONS,
  DIET_PREFERENCES,
  type DietPreference,
} from "@forgefit/domain";
import { ActionForm, PendingButton } from "@/components/action-form";
import { saveDietPreference } from "@/lib/actions/profile";
import { DietMark } from "./diet-mark";

/** One-tap diet preference choice, shown where recipes are chosen. */
export function DietPreferencePicker({ current }: { current: DietPreference | null }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {DIET_PREFERENCES.map((preference) => (
        <ActionForm key={preference} action={saveDietPreference}>
          <input type="hidden" name="dietPreference" value={preference} />
          <PendingButton
            aria-pressed={current === preference}
            className={`grid h-full w-full gap-1 rounded-xl border p-4 text-left transition disabled:opacity-60 ${
              current === preference
                ? "border-primary bg-primary/10"
                : "border-line-strong/60 hover:border-muted"
            }`}
          >
            <DietMark diet={preference} />
            <span className="text-sm text-muted">{DIET_PREFERENCE_DESCRIPTIONS[preference]}</span>
          </PendingButton>
        </ActionForm>
      ))}
    </div>
  );
}
