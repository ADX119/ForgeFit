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

export const EXPERIENCE_LEVELS = ["NEW", "INTERMEDIATE", "EXPERIENCED"] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export const TRAINING_LOCATIONS = ["FULL_GYM", "HOME_DUMBBELLS", "BODYWEIGHT"] as const;
export type TrainingLocation = (typeof TRAINING_LOCATIONS)[number];

export const UNIT_SYSTEMS = ["METRIC", "IMPERIAL"] as const;
export type UnitSystem = (typeof UNIT_SYSTEMS)[number];

/** How a set of an exercise is measured. */
export const TRACKING_TYPES = [
  "WEIGHT_REPS",
  "REPS",
  "REPS_ADDED_WEIGHT",
  "DURATION",
  "DISTANCE",
] as const;
export type TrackingType = (typeof TRACKING_TYPES)[number];

export const SESSION_STATUSES = ["IN_PROGRESS", "COMPLETED", "DISCARDED"] as const;
export type SessionStatus = (typeof SESSION_STATUSES)[number];

export const SET_TYPES = ["NORMAL", "WARMUP", "DROP", "FAILURE"] as const;
export type SetType = (typeof SET_TYPES)[number];

export const RECORD_TYPES = [
  "MAX_WEIGHT",
  "EST_1RM",
  "MAX_REPS",
  "MAX_DURATION",
  "MAX_SESSION_VOLUME",
] as const;
export type RecordType = (typeof RECORD_TYPES)[number];

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
