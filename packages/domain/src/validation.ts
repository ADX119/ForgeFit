import { z } from "zod";
import { DEFAULT_TIME_ZONE, isValidTimeZone } from "./time";
import {
  ACTIVITY_LEVELS,
  CALCULATION_SEXES,
  DIET_GOALS,
  DIET_PREFERENCES,
  ORDER_TYPES,
} from "./types";

export const profileSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  heightCm: z.coerce.number().min(120).max(230),
  weightKg: z.coerce.number().min(35).max(300),
  age: z.coerce.number().int().min(18).max(100),
  calculationSex: z.enum(CALCULATION_SEXES),
  activityLevel: z.enum(ACTIVITY_LEVELS),
  goal: z.enum(DIET_GOALS),
  dietPreference: z.enum(DIET_PREFERENCES, { error: "Choose how you eat." }),
  timezone: z
    .string()
    .min(1)
    .default(DEFAULT_TIME_ZONE)
    .transform((value) => (isValidTimeZone(value) ? value : DEFAULT_TIME_ZONE)),
});

export const dietPreferenceSchema = z.object({
  dietPreference: z.enum(DIET_PREFERENCES),
});

export const authSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(72),
});

export const workoutEntrySchema = z.object({
  exerciseId: z.uuid(),
  dayOfWeek: z.number().int().min(1).max(7),
});

export const completionSchema = z.object({
  entryId: z.uuid(),
  completionDate: z.iso.date(),
  completed: z.boolean(),
});

export const groceryRecipeSchema = z.object({
  recipeId: z.uuid(),
  servings: z.number().positive().max(20),
});

export const demoOrderSchema = z.object({
  type: z.enum(ORDER_TYPES),
  sourceId: z.string().min(1),
  sourceName: z.string().trim().min(1).max(120),
  offerId: z.string().min(1),
  provider: z.string().min(1),
  priceInr: z.number().positive(),
  etaMinutes: z.number().int().positive(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
