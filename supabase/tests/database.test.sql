begin;
select plan(8);

select has_table('public', 'profiles', 'profiles table exists');
select has_table('public', 'workout_entries', 'workout entries table exists');
select has_table('public', 'grocery_items', 'grocery items table exists');
select has_function('public', 'add_recipe_to_grocery_list', array['uuid','numeric'], 'grocery RPC exists');
select results_eq('select count(*)::bigint from public.muscle_groups', array[7::bigint], 'seven muscle groups seeded');
select results_eq('select count(*)::bigint from public.exercises', array[21::bigint], 'twenty-one exercises seeded');
select results_eq('select count(*)::bigint from public.recipes', array[12::bigint], 'twelve recipes seeded');
select results_eq('select count(*)::bigint from public.equipment', array[8::bigint], 'eight equipment products seeded');

select * from finish();
rollback;
