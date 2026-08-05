create extension if not exists pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'diet_goal'
      AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.diet_goal AS ENUM ('MUSCLE_GAIN', 'FAT_LOSS', 'MAINTENANCE', 'RECOMPOSITION');
  END IF;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'activity_level'
      AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.activity_level AS ENUM ('SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTRA_ACTIVE');
  END IF;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'calculation_sex'
      AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.calculation_sex AS ENUM ('MALE', 'FEMALE', 'PREFER_NOT_TO_SAY');
  END IF;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'difficulty'
      AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.difficulty AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
  END IF;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'order_type'
      AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.order_type AS ENUM ('INGREDIENT', 'DISH', 'EQUIPMENT');
  END IF;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 80),
  height_cm numeric(5,1) check (height_cm between 120 and 230),
  weight_kg numeric(5,1) check (weight_kg between 35 and 300),
  age smallint check (age between 18 and 100),
  calculation_sex public.calculation_sex,
  activity_level public.activity_level,
  goal public.diet_goal,
  timezone text not null default 'Asia/Kolkata',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.muscle_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text not null,
  image_path text not null,
  mock_price_inr numeric(10,2) not null check (mock_price_inr > 0)
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  primary_muscle_group_id uuid not null references public.muscle_groups(id),
  difficulty public.difficulty not null,
  image_path text not null,
  suggested_sets smallint not null check (suggested_sets between 1 and 10),
  suggested_reps text not null,
  description text not null
);

create table if not exists public.exercise_steps (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  position smallint not null check (position > 0),
  instruction text not null,
  unique (exercise_id, position)
);

create table if not exists public.exercise_equipment (
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  equipment_id uuid not null references public.equipment(id) on delete cascade,
  primary key (exercise_id, equipment_id)
);

create table if not exists public.exercise_secondary_muscles (
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  muscle_group_id uuid not null references public.muscle_groups(id) on delete cascade,
  primary key (exercise_id, muscle_group_id)
);

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  servings numeric(4,1) not null check (servings > 0),
  prep_time_minutes smallint not null check (prep_time_minutes > 0),
  difficulty public.difficulty not null,
  calories_per_serving numeric(7,1) not null check (calories_per_serving > 0),
  protein_g numeric(6,1) not null check (protein_g >= 0),
  carbs_g numeric(6,1) not null check (carbs_g >= 0),
  fat_g numeric(6,1) not null check (fat_g >= 0),
  image_path text not null,
  description text not null
);

create table if not exists public.recipe_goals (
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  goal public.diet_goal not null,
  primary key (recipe_id, goal)
);

create table if not exists public.recipe_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  position smallint not null check (position > 0),
  instruction text not null,
  unique (recipe_id, position)
);

create table if not exists public.ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  name text not null,
  normalized_name text not null,
  quantity numeric(9,2) not null check (quantity >= 0),
  unit text not null,
  unique (recipe_id, normalized_name)
);

create table if not exists public.ingredient_alternatives (
  id uuid primary key default gen_random_uuid(),
  ingredient_id uuid not null references public.ingredients(id) on delete cascade,
  name text not null,
  unique (ingredient_id, name)
);

create table if not exists public.workout_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null default 'My Workout Plan' check (char_length(name) between 2 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workout_entries (
  id uuid primary key default gen_random_uuid(),
  workout_plan_id uuid not null references public.workout_plans(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id),
  day_of_week smallint not null check (day_of_week between 1 and 7),
  created_at timestamptz not null default now(),
  unique (workout_plan_id, exercise_id, day_of_week)
);

create table if not exists public.workout_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_id uuid not null references public.workout_entries(id) on delete cascade,
  completion_date date not null,
  completed_at timestamptz not null default now(),
  unique (entry_id, completion_date)
);

create table if not exists public.grocery_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  normalized_name text not null,
  quantity numeric(10,2) not null check (quantity >= 0),
  unit text not null,
  selected_alternative text,
  checked boolean not null default false,
  source_recipe_id uuid references public.recipes(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, normalized_name, unit)
);

create table if not exists public.mock_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_type public.order_type not null,
  source_id text not null,
  source_name text not null,
  provider text not null,
  mock_price_inr numeric(10,2) not null check (mock_price_inr > 0),
  mock_eta_minutes smallint not null check (mock_eta_minutes > 0),
  status text not null default 'DEMO_PLACED' check (status = 'DEMO_PLACED'),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'profiles_updated_at'
  ) THEN
    CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'workout_plans_updated_at'
  ) THEN
    CREATE TRIGGER workout_plans_updated_at BEFORE UPDATE ON public.workout_plans FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'grocery_items_updated_at'
  ) THEN
    CREATE TRIGGER grocery_items_updated_at BEFORE UPDATE ON public.grocery_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END$$;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1)));
  insert into public.workout_plans (user_id) values (new.id);
  return new;
end;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END$$;

create or replace function public.add_recipe_to_grocery_list(p_recipe_id uuid, p_servings numeric)
returns void language plpgsql security invoker set search_path = '' as $$
declare
  recipe_servings numeric;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_servings <= 0 or p_servings > 20 then raise exception 'Servings must be between 0 and 20'; end if;
  select servings into recipe_servings from public.recipes where id = p_recipe_id;
  if recipe_servings is null then raise exception 'Recipe not found'; end if;

  insert into public.grocery_items (user_id, name, normalized_name, quantity, unit, source_recipe_id)
  select auth.uid(), i.name, i.normalized_name, round(i.quantity * p_servings / recipe_servings, 2), i.unit, p_recipe_id
  from public.ingredients i where i.recipe_id = p_recipe_id
  on conflict (user_id, normalized_name, unit) do update
  set quantity = public.grocery_items.quantity + excluded.quantity,
      name = excluded.name,
      source_recipe_id = excluded.source_recipe_id,
      checked = false,
      updated_at = now();
end;
$$;

alter table public.profiles enable row level security;
alter table public.muscle_groups enable row level security;
alter table public.equipment enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_steps enable row level security;
alter table public.exercise_equipment enable row level security;
alter table public.exercise_secondary_muscles enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_goals enable row level security;
alter table public.recipe_steps enable row level security;
alter table public.ingredients enable row level security;
alter table public.ingredient_alternatives enable row level security;
alter table public.workout_plans enable row level security;
alter table public.workout_entries enable row level security;
alter table public.workout_completions enable row level security;
alter table public.grocery_items enable row level security;
alter table public.mock_orders enable row level security;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'catalog muscle groups'
  ) THEN
    CREATE POLICY "catalog muscle groups" ON public.muscle_groups FOR SELECT TO authenticated USING (true);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'catalog equipment'
  ) THEN
    CREATE POLICY "catalog equipment" ON public.equipment FOR SELECT TO authenticated USING (true);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'catalog exercises'
  ) THEN
    CREATE POLICY "catalog exercises" ON public.exercises FOR SELECT TO authenticated USING (true);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'catalog exercise steps'
  ) THEN
    CREATE POLICY "catalog exercise steps" ON public.exercise_steps FOR SELECT TO authenticated USING (true);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'catalog exercise equipment'
  ) THEN
    CREATE POLICY "catalog exercise equipment" ON public.exercise_equipment FOR SELECT TO authenticated USING (true);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'catalog secondary muscles'
  ) THEN
    CREATE POLICY "catalog secondary muscles" ON public.exercise_secondary_muscles FOR SELECT TO authenticated USING (true);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'catalog recipes'
  ) THEN
    CREATE POLICY "catalog recipes" ON public.recipes FOR SELECT TO authenticated USING (true);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'catalog recipe goals'
  ) THEN
    CREATE POLICY "catalog recipe goals" ON public.recipe_goals FOR SELECT TO authenticated USING (true);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'catalog recipe steps'
  ) THEN
    CREATE POLICY "catalog recipe steps" ON public.recipe_steps FOR SELECT TO authenticated USING (true);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'catalog ingredients'
  ) THEN
    CREATE POLICY "catalog ingredients" ON public.ingredients FOR SELECT TO authenticated USING (true);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'catalog alternatives'
  ) THEN
    CREATE POLICY "catalog alternatives" ON public.ingredient_alternatives FOR SELECT TO authenticated USING (true);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'own profile read'
  ) THEN
    CREATE POLICY "own profile read" ON public.profiles FOR SELECT USING ((select auth.uid()) = id);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'own profile update'
  ) THEN
    CREATE POLICY "own profile update" ON public.profiles FOR UPDATE USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'own plan read'
  ) THEN
    CREATE POLICY "own plan read" ON public.workout_plans FOR SELECT USING ((select auth.uid()) = user_id);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'own plan update'
  ) THEN
    CREATE POLICY "own plan update" ON public.workout_plans FOR UPDATE USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'own entries read'
  ) THEN
    CREATE POLICY "own entries read" ON public.workout_entries FOR SELECT USING (
      exists (select 1 from public.workout_plans p where p.id = workout_plan_id and p.user_id = (select auth.uid()))
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'own entries insert'
  ) THEN
    CREATE POLICY "own entries insert" ON public.workout_entries FOR INSERT WITH CHECK (
      exists (select 1 from public.workout_plans p where p.id = workout_plan_id and p.user_id = (select auth.uid()))
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'own entries delete'
  ) THEN
    CREATE POLICY "own entries delete" ON public.workout_entries FOR DELETE USING (
      exists (select 1 from public.workout_plans p where p.id = workout_plan_id and p.user_id = (select auth.uid()))
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'own completions read'
  ) THEN
    CREATE POLICY "own completions read" ON public.workout_completions FOR SELECT USING ((select auth.uid()) = user_id);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'own completions insert'
  ) THEN
    CREATE POLICY "own completions insert" ON public.workout_completions FOR INSERT WITH CHECK (
      (select auth.uid()) = user_id and exists (
        select 1 from public.workout_entries e join public.workout_plans p on p.id = e.workout_plan_id
        where e.id = entry_id and p.user_id = (select auth.uid())
      )
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'own completions delete'
  ) THEN
    CREATE POLICY "own completions delete" ON public.workout_completions FOR DELETE USING ((select auth.uid()) = user_id);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'own groceries read'
  ) THEN
    CREATE POLICY "own groceries read" ON public.grocery_items FOR SELECT USING ((select auth.uid()) = user_id);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'own groceries insert'
  ) THEN
    CREATE POLICY "own groceries insert" ON public.grocery_items FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'own groceries update'
  ) THEN
    CREATE POLICY "own groceries update" ON public.grocery_items FOR UPDATE USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'own groceries delete'
  ) THEN
    CREATE POLICY "own groceries delete" ON public.grocery_items FOR DELETE USING ((select auth.uid()) = user_id);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'own orders read'
  ) THEN
    CREATE POLICY "own orders read" ON public.mock_orders FOR SELECT USING ((select auth.uid()) = user_id);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'own orders insert'
  ) THEN
    CREATE POLICY "own orders insert" ON public.mock_orders FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
  END IF;
END$$;

grant execute on function public.add_recipe_to_grocery_list(uuid, numeric) to authenticated;

-- Table privileges. RLS decides which rows a role may touch; these grants decide
-- whether it may touch the table at all. Both are required, so the policies above
-- are inert without this block. Scoped to match each policy set exactly.
grant select on
  public.muscle_groups,
  public.equipment,
  public.exercises,
  public.exercise_steps,
  public.exercise_equipment,
  public.exercise_secondary_muscles,
  public.recipes,
  public.recipe_goals,
  public.recipe_steps,
  public.ingredients,
  public.ingredient_alternatives
to authenticated;

-- profiles and workout_plans rows are created by handle_new_user(), which is
-- security definer and so needs no insert grant here.
grant select, update on public.profiles to authenticated;
grant select, update on public.workout_plans to authenticated;
grant select, insert, delete on public.workout_entries to authenticated;
grant select, insert, delete on public.workout_completions to authenticated;
-- add_recipe_to_grocery_list() is security invoker, so its insert-on-conflict-update
-- into grocery_items runs with the caller's privileges.
grant select, insert, update, delete on public.grocery_items to authenticated;
grant select, insert on public.mock_orders to authenticated;
