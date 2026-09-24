export const DIET_GOALS = ["MUSCLE_GAIN", "FAT_LOSS", "MAINTENANCE", "RECOMPOSITION"] as const;
export type DietGoal = (typeof DIET_GOALS)[number];

export const DIET_PREFERENCES = ["VEGAN", "VEGETARIAN", "EGGETARIAN", "NON_VEGETARIAN"] as const;
export type DietPreference = (typeof DIET_PREFERENCES)[number];

export const ACTIVITY_LEVELS = [
  "SEDENTARY",
  "LIGHTLY_ACTIVE",
  "MODERATELY_ACTIVE",
  "VERY_ACTIVE",
  "EXTRA_ACTIVE",
] as const;
export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number];

export const CALCULATION_SEXES = ["MALE", "FEMALE", "PREFER_NOT_TO_SAY"] as const;
export type CalculationSex = (typeof CALCULATION_SEXES)[number];

export const DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const ORDER_TYPES = ["INGREDIENT", "DISH", "EQUIPMENT"] as const;
export type OrderType = (typeof ORDER_TYPES)[number];

export interface ProfileMetrics {
  weightKg: number;
  heightCm: number;
  age: number;
  calculationSex: CalculationSex;
  activityLevel: ActivityLevel;
  goal: DietGoal;
}

export interface MacroTarget {
  bmr: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  disclaimer: string;
}

export interface CommerceOffer {
  id: string;
  provider: string;
  label: string;
  priceInr: number;
  etaMinutes: number;
  demo: boolean;
  externalUrl?: string;
}

export interface DemoOrderResult extends CommerceOffer {
  status: "DEMO_PLACED";
  message: string;
}

export interface ShoppingProvider {
  getOffers(
    type: "INGREDIENT" | "EQUIPMENT",
    sourceId: string,
    label: string,
  ): Promise<CommerceOffer[]>;
  placeDemoOrder(offer: CommerceOffer): DemoOrderResult;
}

export interface FoodDeliveryProvider {
  getOffers(recipeId: string, recipeName: string): Promise<CommerceOffer[]>;
  placeDemoOrder(offer: CommerceOffer): DemoOrderResult;
}
