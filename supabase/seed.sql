-- Exercise catalogue (muscle groups, equipment, exercises, steps, cues) lives in
-- supabase/migrations/202609240003_exercise_library.sql. This file seeds recipes only.

insert into public.recipes (id,name,slug,servings,prep_time_minutes,difficulty,calories_per_serving,protein_g,carbs_g,fat_g,image_path,description) values
('d0000000-0000-4000-8000-000000000001','Paneer Power Bowl','paneer-power-bowl',2,25,'BEGINNER',610,38,66,22,'/images/recipes/gain.svg','A high-protein paneer, rice, and vegetable bowl.'),
('d0000000-0000-4000-8000-000000000002','Chicken Oats Khichdi','chicken-oats-khichdi',2,35,'INTERMEDIATE',570,45,61,16,'/images/recipes/gain.svg','Comforting oats khichdi fortified with lean chicken.'),
('d0000000-0000-4000-8000-000000000003','Banana Peanut Lassi','banana-peanut-lassi',1,8,'BEGINNER',520,24,62,21,'/images/recipes/gain.svg','A fast calorie-dense smoothie for busy training days.'),
('d0000000-0000-4000-8000-000000000004','Tandoori Chicken Salad','tandoori-chicken-salad',2,30,'BEGINNER',360,46,24,9,'/images/recipes/loss.svg','Spiced lean chicken over crunchy vegetables and yogurt dressing.'),
('d0000000-0000-4000-8000-000000000005','Moong Dal Chilla','moong-dal-chilla',2,25,'BEGINNER',330,21,48,7,'/images/recipes/loss.svg','Protein-rich savoury pancakes with a fresh herb filling.'),
('d0000000-0000-4000-8000-000000000006','Tofu Vegetable Stir-fry','tofu-vegetable-stir-fry',2,20,'BEGINNER',310,25,27,12,'/images/recipes/loss.svg','Crisp vegetables and tofu in a light ginger-soy glaze.'),
('d0000000-0000-4000-8000-000000000007','Rajma Rice Balance Bowl','rajma-rice-balance-bowl',2,35,'INTERMEDIATE',490,20,79,11,'/images/recipes/maintenance.svg','Classic rajma rice portioned with salad and curd.'),
('d0000000-0000-4000-8000-000000000008','Egg Bhurji Roti Wrap','egg-bhurji-roti-wrap',2,18,'BEGINNER',450,29,44,18,'/images/recipes/maintenance.svg','Spiced scrambled eggs wrapped in whole-wheat rotis.'),
('d0000000-0000-4000-8000-000000000009','Curd Millet Bowl','curd-millet-bowl',2,20,'BEGINNER',420,18,62,13,'/images/recipes/maintenance.svg','Cooling curd millet with cucumber, herbs, and seeds.'),
('d0000000-0000-4000-8000-000000000010','Fish Tikka Quinoa','fish-tikka-quinoa',2,35,'INTERMEDIATE',470,43,48,12,'/images/recipes/recomp.svg','Lean fish tikka paired with quinoa and roasted vegetables.'),
('d0000000-0000-4000-8000-000000000011','Soya Keema Lettuce Cups','soya-keema-lettuce-cups',2,25,'BEGINNER',390,35,37,12,'/images/recipes/recomp.svg','High-protein soya mince served in crisp lettuce cups.'),
('d0000000-0000-4000-8000-000000000012','Greek Yogurt Protein Parfait','greek-yogurt-protein-parfait',1,10,'BEGINNER',410,34,45,11,'/images/recipes/recomp.svg','Layered yogurt, fruit, oats, and seeds for a fast recovery meal.')
on conflict do nothing;

update public.recipes set diet_type = case slug
  when 'paneer-power-bowl' then 'VEGETARIAN'
  when 'chicken-oats-khichdi' then 'NON_VEGETARIAN'
  when 'banana-peanut-lassi' then 'VEGETARIAN'
  when 'tandoori-chicken-salad' then 'NON_VEGETARIAN'
  when 'moong-dal-chilla' then 'VEGAN'
  when 'tofu-vegetable-stir-fry' then 'VEGAN'
  when 'rajma-rice-balance-bowl' then 'VEGETARIAN'
  when 'egg-bhurji-roti-wrap' then 'EGGETARIAN'
  when 'curd-millet-bowl' then 'VEGETARIAN'
  when 'fish-tikka-quinoa' then 'NON_VEGETARIAN'
  when 'soya-keema-lettuce-cups' then 'VEGAN'
  when 'greek-yogurt-protein-parfait' then 'VEGETARIAN'
  else diet_type
end::public.diet_preference;

insert into public.recipe_goals (recipe_id,goal) values
('d0000000-0000-4000-8000-000000000001','MUSCLE_GAIN'),('d0000000-0000-4000-8000-000000000002','MUSCLE_GAIN'),('d0000000-0000-4000-8000-000000000003','MUSCLE_GAIN'),
('d0000000-0000-4000-8000-000000000004','FAT_LOSS'),('d0000000-0000-4000-8000-000000000005','FAT_LOSS'),('d0000000-0000-4000-8000-000000000006','FAT_LOSS'),
('d0000000-0000-4000-8000-000000000007','MAINTENANCE'),('d0000000-0000-4000-8000-000000000008','MAINTENANCE'),('d0000000-0000-4000-8000-000000000009','MAINTENANCE'),
('d0000000-0000-4000-8000-000000000010','RECOMPOSITION'),('d0000000-0000-4000-8000-000000000011','RECOMPOSITION'),('d0000000-0000-4000-8000-000000000012','RECOMPOSITION')
on conflict do nothing;

insert into public.recipe_steps (recipe_id,position,instruction)
select id,1,'Prepare and measure all ingredients before heating the pan.' from public.recipes
union all select id,2,'Cook the main ingredients over medium heat until safely cooked and well seasoned.' from public.recipes
union all select id,3,'Portion evenly, add the fresh components, and serve warm.' from public.recipes
on conflict do nothing;

insert into public.ingredients (recipe_id,name,normalized_name,quantity,unit) values
('d0000000-0000-4000-8000-000000000001','Paneer','paneer',250,'g'),('d0000000-0000-4000-8000-000000000001','Brown rice','brown rice',140,'g'),('d0000000-0000-4000-8000-000000000001','Mixed vegetables','mixed vegetables',250,'g'),('d0000000-0000-4000-8000-000000000001','Olive oil','olive oil',10,'ml'),
('d0000000-0000-4000-8000-000000000002','Chicken breast','chicken breast',250,'g'),('d0000000-0000-4000-8000-000000000002','Rolled oats','rolled oats',120,'g'),('d0000000-0000-4000-8000-000000000002','Moong dal','moong dal',80,'g'),('d0000000-0000-4000-8000-000000000002','Tomato','tomato',2,'piece'),
('d0000000-0000-4000-8000-000000000003','Banana','banana',1,'piece'),('d0000000-0000-4000-8000-000000000003','Greek yogurt','greek yogurt',250,'g'),('d0000000-0000-4000-8000-000000000003','Peanut butter','peanut butter',30,'g'),('d0000000-0000-4000-8000-000000000003','Milk','milk',200,'ml'),
('d0000000-0000-4000-8000-000000000004','Chicken breast','chicken breast',300,'g'),('d0000000-0000-4000-8000-000000000004','Greek yogurt','greek yogurt',100,'g'),('d0000000-0000-4000-8000-000000000004','Salad greens','salad greens',180,'g'),('d0000000-0000-4000-8000-000000000004','Cucumber','cucumber',1,'piece'),
('d0000000-0000-4000-8000-000000000005','Moong dal','moong dal',160,'g'),('d0000000-0000-4000-8000-000000000005','Onion','onion',1,'piece'),('d0000000-0000-4000-8000-000000000005','Coriander','coriander',20,'g'),('d0000000-0000-4000-8000-000000000005','Olive oil','olive oil',10,'ml'),
('d0000000-0000-4000-8000-000000000006','Tofu','tofu',300,'g'),('d0000000-0000-4000-8000-000000000006','Mixed vegetables','mixed vegetables',350,'g'),('d0000000-0000-4000-8000-000000000006','Soy sauce','soy sauce',20,'ml'),('d0000000-0000-4000-8000-000000000006','Ginger','ginger',15,'g'),
('d0000000-0000-4000-8000-000000000007','Kidney beans','kidney beans',180,'g'),('d0000000-0000-4000-8000-000000000007','Basmati rice','basmati rice',140,'g'),('d0000000-0000-4000-8000-000000000007','Curd','curd',150,'g'),('d0000000-0000-4000-8000-000000000007','Salad greens','salad greens',120,'g'),
('d0000000-0000-4000-8000-000000000008','Eggs','eggs',4,'piece'),('d0000000-0000-4000-8000-000000000008','Whole-wheat roti','whole-wheat roti',4,'piece'),('d0000000-0000-4000-8000-000000000008','Onion','onion',1,'piece'),('d0000000-0000-4000-8000-000000000008','Capsicum','capsicum',1,'piece'),
('d0000000-0000-4000-8000-000000000009','Cooked millet','cooked millet',300,'g'),('d0000000-0000-4000-8000-000000000009','Curd','curd',250,'g'),('d0000000-0000-4000-8000-000000000009','Cucumber','cucumber',1,'piece'),('d0000000-0000-4000-8000-000000000009','Pumpkin seeds','pumpkin seeds',20,'g'),
('d0000000-0000-4000-8000-000000000010','Fish fillet','fish fillet',300,'g'),('d0000000-0000-4000-8000-000000000010','Quinoa','quinoa',140,'g'),('d0000000-0000-4000-8000-000000000010','Mixed vegetables','mixed vegetables',250,'g'),('d0000000-0000-4000-8000-000000000010','Greek yogurt','greek yogurt',80,'g'),
('d0000000-0000-4000-8000-000000000011','Soya granules','soya granules',180,'g'),('d0000000-0000-4000-8000-000000000011','Lettuce','lettuce',1,'piece'),('d0000000-0000-4000-8000-000000000011','Tomato','tomato',2,'piece'),('d0000000-0000-4000-8000-000000000011','Onion','onion',1,'piece'),
('d0000000-0000-4000-8000-000000000012','Greek yogurt','greek yogurt',300,'g'),('d0000000-0000-4000-8000-000000000012','Rolled oats','rolled oats',50,'g'),('d0000000-0000-4000-8000-000000000012','Mixed berries','mixed berries',100,'g'),('d0000000-0000-4000-8000-000000000012','Pumpkin seeds','pumpkin seeds',15,'g')
on conflict do nothing;

insert into public.ingredient_alternatives (ingredient_id,name)
select id, case name
  when 'Paneer' then 'Tofu'
  when 'Chicken breast' then 'Soya chunks'
  when 'Greek yogurt' then 'Hung curd'
  when 'Milk' then 'Soy milk'
  when 'Tofu' then 'Paneer'
  when 'Kidney beans' then 'Black chickpeas'
  when 'Eggs' then 'Firm tofu'
  when 'Fish fillet' then 'Chicken breast'
  when 'Soya granules' then 'Lentil mince'
end
from public.ingredients
where name in ('Paneer','Chicken breast','Greek yogurt','Milk','Tofu','Kidney beans','Eggs','Fish fillet','Soya granules')
on conflict do nothing;
