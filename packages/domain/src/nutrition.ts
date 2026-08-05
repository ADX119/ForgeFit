import type { ActivityLevel, DietGoal, MacroTarget, ProfileMetrics } from "./types";

const activityMultipliers: Record<ActivityLevel, number> = {
  SEDENTARY: 1.2,
  LIGHTLY_ACTIVE: 1.375,
  MODERATELY_ACTIVE: 1.55,
  VERY_ACTIVE: 1.725,
  EXTRA_ACTIVE: 1.9,
};

const calorieAdjustments: Record<DietGoal, number> = {
  MUSCLE_GAIN: 300,
  FAT_LOSS: -400,
  MAINTENANCE: 0,
  RECOMPOSITION: -200,
};

const proteinPerKg: Record<DietGoal, number> = {
  MUSCLE_GAIN: 1.8,
  FAT_LOSS: 2,
  MAINTENANCE: 1.6,
  RECOMPOSITION: 2,
};

const sexConstants = { MALE: 5, FEMALE: -161, PREFER_NOT_TO_SAY: -78 } as const;
const oneDecimal = (value: number) => Math.round(value * 10) / 10;

export function calculateMacroTarget(profile: ProfileMetrics): MacroTarget {
  const bmr =
    10 * profile.weightKg +
    6.25 * profile.heightCm -
    5 * profile.age +
    sexConstants[profile.calculationSex];
  const targetCalories = Math.max(
    bmr,
    bmr * activityMultipliers[profile.activityLevel] + calorieAdjustments[profile.goal],
  );
  const proteinG = profile.weightKg * proteinPerKg[profile.goal];
  const fatG = profile.weightKg * 0.8;
  const carbsG = Math.max(0, (targetCalories - proteinG * 4 - fatG * 9) / 4);

  return {
    bmr: Math.round(bmr),
    calories: Math.round(targetCalories),
    proteinG: oneDecimal(proteinG),
    carbsG: oneDecimal(carbsG),
    fatG: oneDecimal(fatG),
    disclaimer: "Estimated targets for educational use only — not medical advice.",
  };
}
