-- Phase 1: training data foundation.
-- Adds routines, starter plan templates, logged workout sessions and sets, personal records and
-- bodyweight. The old weekday plan (workout_plans / workout_entries / workout_completions) stays
-- until the new workout screens replace it, then a later migration drops it.

------------------------------------------------------------------------------------------------
-- Types
------------------------------------------------------------------------------------------------

create type public.experience_level as enum ('NEW', 'INTERMEDIATE', 'EXPERIENCED');
create type public.training_location as enum ('FULL_GYM', 'HOME_DUMBBELLS', 'BODYWEIGHT');
create type public.unit_system as enum ('METRIC', 'IMPERIAL');
-- How a set of an exercise is measured.
create type public.tracking_type as enum ('WEIGHT_REPS', 'REPS', 'REPS_ADDED_WEIGHT', 'DURATION', 'DISTANCE');
create type public.session_status as enum ('IN_PROGRESS', 'COMPLETED', 'DISCARDED');
create type public.session_exercise_status as enum ('ACTIVE', 'SKIPPED');
create type public.set_type as enum ('NORMAL', 'WARMUP', 'DROP', 'FAILURE');
create type public.record_type as enum ('MAX_WEIGHT', 'EST_1RM', 'MAX_REPS', 'MAX_DURATION', 'MAX_SESSION_VOLUME');

------------------------------------------------------------------------------------------------
-- Profiles and exercises
------------------------------------------------------------------------------------------------

alter table public.profiles
  add column experience_level public.experience_level,
  add column training_location public.training_location,
  add column days_per_week smallint check (days_per_week between 1 and 7),
  add column unit_system public.unit_system not null default 'METRIC',
  add column default_rest_seconds smallint not null default 90 check (default_rest_seconds between 15 and 600),
  add column weight_increment_kg numeric(4,2) not null default 2.5 check (weight_increment_kg > 0 and weight_increment_kg <= 25),
  add column nutrition_enabled boolean not null default true;

alter table public.exercises
  add column tracking_type public.tracking_type not null default 'WEIGHT_REPS',
  -- null = global catalogue; set = a user's custom exercise (V1)
  add column owner_user_id uuid references auth.users(id) on delete cascade,
  add column cues text[] not null default '{}',
  add column default_rest_seconds smallint check (default_rest_seconds between 0 and 600),
  add column is_archived boolean not null default false;

update public.exercises set tracking_type = case slug
  when 'push-up' then 'REPS_ADDED_WEIGHT'
  when 'pull-up' then 'REPS_ADDED_WEIGHT'
  when 'bench-triceps-dip' then 'REPS_ADDED_WEIGHT'
  when 'pike-push-up' then 'REPS'
  when 'hanging-knee-raise' then 'REPS'
  when 'dead-bug' then 'REPS'
  when 'resistance-band-fly' then 'REPS'
  when 'band-face-pull' then 'REPS'
  when 'band-hammer-curl' then 'REPS'
  when 'forearm-plank' then 'DURATION'
  when 'bear-crawl' then 'DURATION'
  else 'WEIGHT_REPS'
end::public.tracking_type
where owner_user_id is null;

create index exercises_owner_idx on public.exercises (owner_user_id) where owner_user_id is not null;

-- Custom exercises are private to their owner; the catalogue stays readable by everyone signed in.
drop policy "catalog exercises" on public.exercises;
create policy "catalog and own exercises" on public.exercises for select to authenticated
  using (owner_user_id is null or owner_user_id = (select auth.uid()));

------------------------------------------------------------------------------------------------
-- Starter plan templates (curated, read-only)
------------------------------------------------------------------------------------------------

create table public.plan_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null check (char_length(name) between 2 and 80),
  description text not null,
  goal public.diet_goal,
  level public.experience_level not null,
  location public.training_location not null,
  days_per_week smallint not null check (days_per_week between 1 and 7),
  position smallint not null default 0
);

create table public.plan_template_routines (
  id uuid primary key default gen_random_uuid(),
  plan_template_id uuid not null references public.plan_templates(id) on delete cascade,
  position smallint not null check (position >= 0),
  name text not null check (char_length(name) between 1 and 80),
  unique (plan_template_id, position)
);

create table public.plan_template_exercises (
  id uuid primary key default gen_random_uuid(),
  template_routine_id uuid not null references public.plan_template_routines(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id),
  position smallint not null check (position >= 0),
  target_sets smallint not null default 3 check (target_sets between 1 and 10),
  target_reps_min smallint check (target_reps_min between 1 and 100),
  target_reps_max smallint check (target_reps_max between 1 and 100),
  target_duration_seconds integer check (target_duration_seconds between 1 and 3600),
  rest_seconds smallint not null default 90 check (rest_seconds between 0 and 600),
  unique (template_routine_id, position),
  check (target_reps_max is null or target_reps_min is null or target_reps_max >= target_reps_min)
);

------------------------------------------------------------------------------------------------
-- Routines and weekly schedule
------------------------------------------------------------------------------------------------

create table public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  notes text check (char_length(notes) <= 1000),
  position smallint not null default 0,
  source_template_id uuid references public.plan_templates(id) on delete set null,
  -- Routines used by past workouts are archived rather than deleted.
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index routines_user_idx on public.routines (user_id, position) where archived_at is null;

create table public.routine_exercises (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id),
  position smallint not null check (position >= 0),
  target_sets smallint not null default 3 check (target_sets between 1 and 10),
  target_reps_min smallint check (target_reps_min between 1 and 100),
  target_reps_max smallint check (target_reps_max between 1 and 100),
  target_duration_seconds integer check (target_duration_seconds between 1 and 3600),
  rest_seconds smallint not null default 90 check (rest_seconds between 0 and 600),
  notes text check (char_length(notes) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Deferred so a reorder can swap positions inside one transaction.
  constraint routine_exercises_position_key unique (routine_id, position) deferrable initially deferred,
  check (target_reps_max is null or target_reps_min is null or target_reps_max >= target_reps_min)
);

create index routine_exercises_exercise_idx on public.routine_exercises (exercise_id);

-- One routine per weekday; no row means a rest day.
create table public.routine_schedule (
  user_id uuid not null references auth.users(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 1 and 7),
  routine_id uuid not null references public.routines(id) on delete cascade,
  primary key (user_id, day_of_week)
);

create index routine_schedule_routine_idx on public.routine_schedule (routine_id);

------------------------------------------------------------------------------------------------
-- Logged workouts
------------------------------------------------------------------------------------------------

-- Ids of sessions, session exercises and sets are generated on the device, so retries after a
-- dropped connection are idempotent upserts rather than duplicates.
create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  routine_id uuid references public.routines(id) on delete set null,
  name text not null check (char_length(name) between 1 and 80),
  status public.session_status not null default 'IN_PROGRESS',
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  paused_seconds integer not null default 0 check (paused_seconds >= 0),
  notes text check (char_length(notes) <= 2000),
  -- Cached when the workout finishes.
  total_volume_kg numeric(10,2),
  total_sets integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ended_at is null or ended_at >= started_at),
  check ((status = 'IN_PROGRESS') = (ended_at is null))
);

create unique index workout_sessions_one_active_idx on public.workout_sessions (user_id)
  where status = 'IN_PROGRESS';
create index workout_sessions_user_started_idx on public.workout_sessions (user_id, started_at desc);
create index workout_sessions_routine_idx on public.workout_sessions (routine_id) where routine_id is not null;

create table public.session_exercises (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  -- Copied from the session by trigger; never trusted from the client.
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id),
  position smallint not null check (position >= 0),
  status public.session_exercise_status not null default 'ACTIVE',
  replaced_exercise_id uuid references public.exercises(id),
  notes text check (char_length(notes) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index session_exercises_session_idx on public.session_exercises (session_id, position);
create index session_exercises_user_exercise_idx on public.session_exercises (user_id, exercise_id);

create table public.session_sets (
  id uuid primary key default gen_random_uuid(),
  session_exercise_id uuid not null references public.session_exercises(id) on delete cascade,
  -- Both copied from the session exercise by trigger, for fast "previous performance" queries.
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id),
  set_number smallint not null check (set_number between 1 and 50),
  set_type public.set_type not null default 'NORMAL',
  -- Always stored in kilograms; converted for display.
  weight_kg numeric(6,2) check (weight_kg between 0 and 1000),
  reps smallint check (reps between 0 and 1000),
  duration_seconds integer check (duration_seconds between 0 and 86400),
  distance_m numeric(8,2) check (distance_m between 0 and 1000000),
  rpe numeric(3,1) check (rpe between 1 and 10),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (weight_kg is not null or reps is not null or duration_seconds is not null or distance_m is not null)
);

create index session_sets_session_exercise_idx on public.session_sets (session_exercise_id, set_number);
-- The hottest query: last performance and progress charts for one exercise.
create index session_sets_user_exercise_completed_idx on public.session_sets (user_id, exercise_id, completed_at desc);

create table public.personal_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id),
  record_type public.record_type not null,
  value numeric(10,2) not null check (value >= 0),
  weight_kg numeric(6,2),
  reps smallint,
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  session_set_id uuid references public.session_sets(id) on delete cascade,
  achieved_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index personal_records_lookup_idx on public.personal_records (user_id, exercise_id, record_type, achieved_at desc);
create index personal_records_session_idx on public.personal_records (session_id);
-- Editing or deleting a logged set removes the records it set.
create index personal_records_session_set_idx on public.personal_records (session_set_id)
  where session_set_id is not null;

------------------------------------------------------------------------------------------------
-- Bodyweight
------------------------------------------------------------------------------------------------

create table public.body_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  measured_on date not null,
  weight_kg numeric(5,1) check (weight_kg between 20 and 400),
  body_fat_pct numeric(4,1) check (body_fat_pct between 2 and 70),
  notes text check (char_length(notes) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, measured_on),
  check (weight_kg is not null or body_fat_pct is not null)
);

------------------------------------------------------------------------------------------------
-- Triggers
------------------------------------------------------------------------------------------------

-- Security advisor: pin the search path of the shared updated_at trigger.
alter function public.set_updated_at() set search_path = '';

create trigger routines_updated_at before update on public.routines
  for each row execute function public.set_updated_at();
create trigger routine_exercises_updated_at before update on public.routine_exercises
  for each row execute function public.set_updated_at();
create trigger workout_sessions_updated_at before update on public.workout_sessions
  for each row execute function public.set_updated_at();
create trigger session_exercises_updated_at before update on public.session_exercises
  for each row execute function public.set_updated_at();
create trigger session_sets_updated_at before update on public.session_sets
  for each row execute function public.set_updated_at();
create trigger body_measurements_updated_at before update on public.body_measurements
  for each row execute function public.set_updated_at();

-- Ownership columns are derived from the parent row the caller can see (RLS applies, since these
-- run as the caller). A row pointing at someone else's session finds no parent and is rejected.
create or replace function public.set_session_exercise_owner() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  select s.user_id into new.user_id from public.workout_sessions s where s.id = new.session_id;
  if new.user_id is null then raise exception 'Workout session not found'; end if;
  return new;
end;
$$;

create or replace function public.set_session_set_owner() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  select e.user_id, e.exercise_id into new.user_id, new.exercise_id
  from public.session_exercises e where e.id = new.session_exercise_id;
  if new.user_id is null then raise exception 'Session exercise not found'; end if;
  return new;
end;
$$;

create trigger session_exercises_owner before insert or update of session_id on public.session_exercises
  for each row execute function public.set_session_exercise_owner();
create trigger session_sets_owner before insert or update of session_exercise_id on public.session_sets
  for each row execute function public.set_session_set_owner();

-- Swapping an exercise mid-workout keeps its logged sets pointing at the new exercise.
create or replace function public.sync_session_set_exercise() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  update public.session_sets set exercise_id = new.exercise_id where session_exercise_id = new.id;
  return new;
end;
$$;

create trigger session_exercises_sync_sets after update of exercise_id on public.session_exercises
  for each row when (old.exercise_id is distinct from new.exercise_id)
  execute function public.sync_session_set_exercise();

-- Security advisor: the sign-up trigger function must not be callable through the API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

------------------------------------------------------------------------------------------------
-- Row level security
------------------------------------------------------------------------------------------------

alter table public.plan_templates enable row level security;
alter table public.plan_template_routines enable row level security;
alter table public.plan_template_exercises enable row level security;
alter table public.routines enable row level security;
alter table public.routine_exercises enable row level security;
alter table public.routine_schedule enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.session_exercises enable row level security;
alter table public.session_sets enable row level security;
alter table public.personal_records enable row level security;
alter table public.body_measurements enable row level security;

create policy "catalog plan templates" on public.plan_templates for select to authenticated using (true);
create policy "catalog plan template routines" on public.plan_template_routines for select to authenticated using (true);
create policy "catalog plan template exercises" on public.plan_template_exercises for select to authenticated using (true);

create policy "own routines" on public.routines for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "own routine exercises" on public.routine_exercises for all to authenticated
  using (exists (select 1 from public.routines r where r.id = routine_id and r.user_id = (select auth.uid())))
  with check (exists (select 1 from public.routines r where r.id = routine_id and r.user_id = (select auth.uid())));

create policy "own schedule" on public.routine_schedule for all to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.routines r where r.id = routine_id and r.user_id = (select auth.uid()))
  );

create policy "own sessions" on public.workout_sessions for all to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and (routine_id is null or exists (select 1 from public.routines r where r.id = routine_id and r.user_id = (select auth.uid())))
  );

create policy "own session exercises" on public.session_exercises for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "own session sets" on public.session_sets for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Records are written by the finish-workout function (Phase 3); users can read and clear their own.
create policy "own records read" on public.personal_records for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "own records delete" on public.personal_records for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "own body measurements" on public.body_measurements for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

------------------------------------------------------------------------------------------------
-- Grants (RLS decides which rows; these decide which operations)
------------------------------------------------------------------------------------------------

grant select on public.plan_templates, public.plan_template_routines, public.plan_template_exercises to authenticated;
grant select, insert, update, delete on
  public.routines,
  public.routine_exercises,
  public.routine_schedule,
  public.workout_sessions,
  public.session_exercises,
  public.session_sets,
  public.body_measurements
to authenticated;
grant select, delete on public.personal_records to authenticated;
