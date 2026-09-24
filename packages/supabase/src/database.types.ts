import type {
  ActivityLevel,
  CalculationSex,
  DietGoal,
  DietPreference,
  FoodProviderId,
  GroceryProviderId,
  Difficulty,
  ExperienceLevel,
  RecordType,
  SessionStatus,
  SetType,
  TrackingType,
  TrainingLocation,
  UnitSystem,
} from "@forgefit/domain";

export type Id = string;

export interface ProfileRow {
  id: Id;
  display_name: string;
  height_cm: number | null;
  weight_kg: number | null;
  age: number | null;
  calculation_sex: CalculationSex | null;
  activity_level: ActivityLevel | null;
  goal: DietGoal | null;
  diet_preference: DietPreference | null;
  timezone: string;
  experience_level: ExperienceLevel | null;
  training_location: TrainingLocation | null;
  days_per_week: number | null;
  unit_system: UnitSystem;
  default_rest_seconds: number;
  weight_increment_kg: number;
  nutrition_enabled: boolean;
  preferred_grocery_provider: GroceryProviderId | null;
  preferred_food_provider: FoodProviderId | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExerciseRow {
  id: Id;
  name: string;
  slug: string;
  primary_muscle_group_id: Id;
  difficulty: Difficulty;
  image_path: string;
  suggested_sets: number;
  suggested_reps: string;
  description: string;
  tracking_type: TrackingType;
  owner_user_id: Id | null;
  cues: string[];
  default_rest_seconds: number | null;
  is_archived: boolean;
}

export interface RecipeRow {
  id: Id;
  name: string;
  slug: string;
  servings: number;
  prep_time_minutes: number;
  difficulty: Difficulty;
  calories_per_serving: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  diet_type: DietPreference;
  image_path: string;
  description: string;
}

export interface IngredientRow {
  id: Id;
  recipe_id: Id;
  name: string;
  normalized_name: string;
  quantity: number;
  unit: string;
}

export interface EquipmentRow {
  id: Id;
  name: string;
  slug: string;
  description: string;
  image_path: string;
  /** False for gym machines: available at a full gym, not something people buy. */
  purchasable: boolean;
}

export interface UserEquipmentRow {
  user_id: Id;
  equipment_id: Id;
  created_at: string;
}

export interface WorkoutEntryRow {
  id: Id;
  workout_plan_id: Id;
  exercise_id: Id;
  day_of_week: number;
  created_at: string;
}

export interface GroceryItemRow {
  id: Id;
  user_id: Id;
  name: string;
  normalized_name: string;
  quantity: number;
  unit: string;
  selected_alternative: string | null;
  checked: boolean;
  source_recipe_id: Id | null;
  created_at: string;
  updated_at: string;
}

export interface PlanTemplateRow {
  id: Id;
  slug: string;
  name: string;
  description: string;
  goal: DietGoal | null;
  level: ExperienceLevel;
  location: TrainingLocation;
  days_per_week: number;
  position: number;
}

export interface PlanTemplateRoutineRow {
  id: Id;
  plan_template_id: Id;
  position: number;
  name: string;
}

/** Targets shared by routine exercises and template exercises. */
export interface ExerciseTargets {
  target_sets: number;
  target_reps_min: number | null;
  target_reps_max: number | null;
  target_duration_seconds: number | null;
  rest_seconds: number;
}

export interface PlanTemplateExerciseRow extends ExerciseTargets {
  id: Id;
  template_routine_id: Id;
  exercise_id: Id;
  position: number;
}

export interface RoutineRow {
  id: Id;
  user_id: Id;
  name: string;
  notes: string | null;
  position: number;
  source_template_id: Id | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoutineExerciseRow extends ExerciseTargets {
  id: Id;
  routine_id: Id;
  exercise_id: Id;
  position: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoutineScheduleRow {
  user_id: Id;
  day_of_week: number;
  routine_id: Id;
}

export interface WorkoutSessionRow {
  id: Id;
  user_id: Id;
  routine_id: Id | null;
  name: string;
  status: SessionStatus;
  started_at: string;
  ended_at: string | null;
  paused_seconds: number;
  notes: string | null;
  total_volume_kg: number | null;
  total_sets: number | null;
  created_at: string;
  updated_at: string;
}

export interface SessionExerciseRow {
  id: Id;
  session_id: Id;
  user_id: Id;
  exercise_id: Id;
  position: number;
  status: "ACTIVE" | "SKIPPED";
  replaced_exercise_id: Id | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionSetRow {
  id: Id;
  session_exercise_id: Id;
  user_id: Id;
  exercise_id: Id;
  set_number: number;
  set_type: SetType;
  weight_kg: number | null;
  reps: number | null;
  duration_seconds: number | null;
  distance_m: number | null;
  rpe: number | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PersonalRecordRow {
  id: Id;
  user_id: Id;
  exercise_id: Id;
  record_type: RecordType;
  value: number;
  weight_kg: number | null;
  reps: number | null;
  session_id: Id;
  session_set_id: Id | null;
  achieved_at: string;
  created_at: string;
}

export interface BodyMeasurementRow {
  id: Id;
  user_id: Id;
  measured_on: string;
  weight_kg: number | null;
  body_fat_pct: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
