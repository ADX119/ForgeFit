import type { DietPreference } from "./types";

// Ordered from most to least restrictive: a preference allows its own tier and every tier before it.
const dietRank: Record<DietPreference, number> = {
  VEGAN: 0,
  VEGETARIAN: 1,
  EGGETARIAN: 2,
  NON_VEGETARIAN: 3,
};

export const DIET_PREFERENCE_LABELS: Record<DietPreference, string> = {
  VEGAN: "Vegan",
  VEGETARIAN: "Vegetarian",
  EGGETARIAN: "Eggetarian",
  NON_VEGETARIAN: "Non-vegetarian",
};

export const DIET_PREFERENCE_DESCRIPTIONS: Record<DietPreference, string> = {
  VEGAN: "No meat, fish, eggs, or dairy",
  VEGETARIAN: "No meat, fish, or eggs; dairy is fine",
  EGGETARIAN: "Vegetarian plus eggs",
  NON_VEGETARIAN: "Everything, including meat and fish",
};

/** Whether a recipe of `recipeDiet` suits someone who eats `preference`. No preference allows all. */
export function recipeMatchesDiet(
  recipeDiet: DietPreference,
  preference: DietPreference | null | undefined,
): boolean {
  if (!preference) return true;
  return dietRank[recipeDiet] <= dietRank[preference];
}
