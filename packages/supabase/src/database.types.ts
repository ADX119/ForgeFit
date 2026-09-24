import type {
  ActivityLevel,
  CalculationSex,
  DietGoal,
  DietPreference,
  Difficulty,
  OrderType,
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
  mock_price_inr: number;
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

export interface MockOrderRow {
  id: Id;
  user_id: Id;
  order_type: OrderType;
  source_id: string;
  source_name: string;
  provider: string;
  mock_price_inr: number;
  mock_eta_minutes: number;
  status: "DEMO_PLACED";
  created_at: string;
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
