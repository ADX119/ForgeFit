begin;
select plan(12);

select has_table('public', 'profiles', 'profiles table exists');
select has_table('public', 'workout_entries', 'workout entries table exists');
select has_table('public', 'grocery_items', 'grocery items table exists');
select has_function('public', 'add_recipe_to_grocery_list', array['uuid','numeric'], 'grocery RPC exists');
select results_eq('select count(*)::bigint from public.muscle_groups', array[7::bigint], 'seven muscle groups seeded');
select results_eq('select count(*)::bigint from public.exercises', array[21::bigint], 'twenty-one exercises seeded');
select results_eq('select count(*)::bigint from public.recipes', array[12::bigint], 'twelve recipes seeded');
select results_eq('select count(*)::bigint from public.equipment', array[8::bigint], 'eight equipment products seeded');
select has_column('public', 'profiles', 'diet_preference', 'profiles store a diet preference');
select col_not_null('public', 'recipes', 'diet_type', 'every recipe has a diet type');
select results_eq(
  $$select diet_type::text, count(*)::bigint from public.recipes group by diet_type order by diet_type$$,
  $$values ('VEGAN', 3::bigint), ('VEGETARIAN', 5::bigint), ('EGGETARIAN', 1::bigint), ('NON_VEGETARIAN', 3::bigint)$$,
  'seeded recipes are classified by diet'
);
select table_privs_are('public', 'workout_completions', 'authenticated', array['SELECT', 'INSERT', 'DELETE'], 'completions allow select, insert, delete');

select * from finish();
rollback;
