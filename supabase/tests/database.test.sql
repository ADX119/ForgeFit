begin;
select plan(20);

select has_table('public', 'profiles', 'profiles table exists');
select has_table('public', 'workout_entries', 'workout entries table exists');
select has_table('public', 'grocery_items', 'grocery items table exists');
select has_function('public', 'add_recipe_to_grocery_list', array['uuid','numeric'], 'grocery RPC exists');
select results_eq('select count(*)::bigint from public.muscle_groups', array[7::bigint], 'seven muscle groups seeded');
select results_eq('select count(*)::bigint from public.exercises', array[63::bigint], 'sixty-three catalogue exercises');
select results_eq('select count(*)::bigint from public.recipes', array[12::bigint], 'twelve recipes seeded');
select results_eq('select count(*)::bigint from public.equipment', array[12::bigint], 'twelve equipment items');
select has_column('public', 'profiles', 'diet_preference', 'profiles store a diet preference');
select col_not_null('public', 'recipes', 'diet_type', 'every recipe has a diet type');
select results_eq(
  $$select diet_type::text, count(*)::bigint from public.recipes group by diet_type order by diet_type$$,
  $$values ('VEGAN', 3::bigint), ('VEGETARIAN', 5::bigint), ('EGGETARIAN', 1::bigint), ('NON_VEGETARIAN', 3::bigint)$$,
  'seeded recipes are classified by diet'
);
select table_privs_are('public', 'workout_completions', 'authenticated', array['SELECT', 'INSERT', 'DELETE'], 'completions allow select, insert, delete');

select ok(
  (select count(*) = 11 from pg_tables where schemaname = 'public' and rowsecurity and tablename in (
    'plan_templates', 'plan_template_routines', 'plan_template_exercises', 'routines', 'routine_exercises',
    'routine_schedule', 'workout_sessions', 'session_exercises', 'session_sets', 'personal_records', 'body_measurements')),
  'all training tables exist with row level security'
);
select has_index('public', 'workout_sessions', 'workout_sessions_one_active_idx', 'one active workout per user');
select table_privs_are('public', 'personal_records', 'authenticated', array['SELECT', 'DELETE'], 'records are written only by the server');
select ok(
  not has_function_privilege('anon', 'public.handle_new_user()', 'execute')
  and not has_function_privilege('authenticated', 'public.handle_new_user()', 'execute'),
  'sign-up trigger function is not callable through the API'
);
select results_eq(
  $$select tracking_type::text, count(*)::bigint from public.exercises group by tracking_type order by tracking_type$$,
  $$values ('WEIGHT_REPS', 32::bigint), ('REPS', 13::bigint), ('REPS_ADDED_WEIGHT', 9::bigint), ('DURATION', 8::bigint), ('DISTANCE', 1::bigint)$$,
  'catalogue exercises have tracking types'
);

select is_empty(
  $$select e.slug from public.exercises e
    where e.owner_user_id is null
      and ((select count(*) from public.exercise_steps s where s.exercise_id = e.id) < 3
        or cardinality(e.cues) < 2)$$,
  'every catalogue exercise has at least 3 steps and 2 form cues'
);
select is_empty(
  $$select id from public.exercise_steps where instruction like 'Set up in a stable position%'$$,
  'generic placeholder steps are gone'
);
select results_eq(
  $$select count(*)::bigint from public.equipment where not purchasable and mock_price_inr is null$$,
  array[4::bigint],
  'gym machines are catalogued but not for sale'
);

select * from finish();
rollback;
