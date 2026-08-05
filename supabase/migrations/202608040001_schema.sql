create extension if not exists pgcrypto;

create type if not exists public.diet_goal as enum ('MUSCLE_GAIN', 'FAT_LOSS', 'MAINTENANCE', 'RECOMPOSITION');
create type if not exists public.activity_level as enum ('SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTRA_ACTIVE');
create type if not exists public.calculation_sex as enum ('MALE', 'FEMALE', 'PREFER_NOT_TO_SAY');
create type if not exists public.difficulty as enum ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
create type if not exists public.order_type as enum ('INGREDIENT', 'DISH', 'EQUIPMENT');

create table public.profiles (
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

create table public.muscle_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table public.equipment (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text not null,
  image_path text not null,
  mock_price_inr numeric(10,2) not null check (mock_price_inr > 0)
);

create table public.exercises (
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

create table public.exercise_steps (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  position smallint not null check (position > 0),
  instruction text not null,
  unique (exercise_id, position)
);

create table public.exercise_equipment (
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  equipment_id uuid not null references public.equipment(id) on delete cascade,
  primary key (exercise_id, equipment_id)
);

create table public.exercise_secondary_muscles (
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  muscle_group_id uuid not null references public.muscle_groups(id) on delete cascade,
  primary key (exercise_id, muscle_group_id)
);

create table public.recipes (
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

create table public.recipe_goals (
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  goal public.diet_goal not null,
  primary key (recipe_id, goal)
);

create table public.recipe_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  position smallint not null check (position > 0),
  instruction text not null,
  unique (recipe_id, position)
);

create table public.ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  name text not null,
  normalized_name text not null,
  quantity numeric(9,2) not null check (quantity >= 0),
  unit text not null,
  unique (recipe_id, normalized_name)
);

create table public.ingredient_alternatives (
  id uuid primary key default gen_random_uuid(),
  ingredient_id uuid not null references public.ingredients(id) on delete cascade,
  name text not null,
  unique (ingredient_id, name)
);

create table public.workout_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null default 'My Workout Plan' check (char_length(name) between 2 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workout_entries (
  id uuid primary key default gen_random_uuid(),
  workout_plan_id uuid not null references public.workout_plans(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id),
  day_of_week smallint not null check (day_of_week between 1 and 7),
  created_at timestamptz not null default now(),
  unique (workout_plan_id, exercise_id, day_of_week)
);

create table public.workout_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_id uuid not null references public.workout_entries(id) on delete cascade,
  completion_date date not null,
  completed_at timestamptz not null default now(),
  unique (entry_id, completion_date)
);

create table public.grocery_items (
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

create table public.mock_orders (
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

create function public.set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger workout_plans_updated_at before update on public.workout_plans for each row execute function public.set_updated_at();
create trigger grocery_items_updated_at before update on public.grocery_items for each row execute function public.set_updated_at();

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1)));
  insert into public.workout_plans (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create function public.add_recipe_to_grocery_list(p_recipe_id uuid, p_servings numeric)
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

create policy "catalog muscle groups" on public.muscle_groups for select to authenticated using (true);
create policy "catalog equipment" on public.equipment for select to authenticated using (true);
create policy "catalog exercises" on public.exercises for select to authenticated using (true);
create policy "catalog exercise steps" on public.exercise_steps for select to authenticated using (true);
create policy "catalog exercise equipment" on public.exercise_equipment for select to authenticated using (true);
create policy "catalog secondary muscles" on public.exercise_secondary_muscles for select to authenticated using (true);
create policy "catalog recipes" on public.recipes for select to authenticated using (true);
create policy "catalog recipe goals" on public.recipe_goals for select to authenticated using (true);
create policy "catalog recipe steps" on public.recipe_steps for select to authenticated using (true);
create policy "catalog ingredients" on public.ingredients for select to authenticated using (true);
create policy "catalog alternatives" on public.ingredient_alternatives for select to authenticated using (true);

create policy "own profile read" on public.profiles for select using ((select auth.uid()) = id);
create policy "own profile update" on public.profiles for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "own plan read" on public.workout_plans for select using ((select auth.uid()) = user_id);
create policy "own plan update" on public.workout_plans for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "own entries read" on public.workout_entries for select using (
  exists (select 1 from public.workout_plans p where p.id = workout_plan_id and p.user_id = (select auth.uid()))
);
create policy "own entries insert" on public.workout_entries for insert with check (
  exists (select 1 from public.workout_plans p where p.id = workout_plan_id and p.user_id = (select auth.uid()))
);
create policy "own entries delete" on public.workout_entries for delete using (
  exists (select 1 from public.workout_plans p where p.id = workout_plan_id and p.user_id = (select auth.uid()))
);

create policy "own completions read" on public.workout_completions for select using ((select auth.uid()) = user_id);
create policy "own completions insert" on public.workout_completions for insert with check (
  (select auth.uid()) = user_id and exists (
    select 1 from public.workout_entries e join public.workout_plans p on p.id = e.workout_plan_id
    where e.id = entry_id and p.user_id = (select auth.uid())
  )
);
create policy "own completions delete" on public.workout_completions for delete using ((select auth.uid()) = user_id);

create policy "own groceries read" on public.grocery_items for select using ((select auth.uid()) = user_id);
create policy "own groceries insert" on public.grocery_items for insert with check ((select auth.uid()) = user_id);
create policy "own groceries update" on public.grocery_items for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own groceries delete" on public.grocery_items for delete using ((select auth.uid()) = user_id);

create policy "own orders read" on public.mock_orders for select using ((select auth.uid()) = user_id);
create policy "own orders insert" on public.mock_orders for insert with check ((select auth.uid()) = user_id);

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
