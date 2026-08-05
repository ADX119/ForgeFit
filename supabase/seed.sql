insert into public.muscle_groups (id, name, slug) values
('a0000000-0000-4000-8000-000000000001','Chest','chest'),
('a0000000-0000-4000-8000-000000000002','Back','back'),
('a0000000-0000-4000-8000-000000000003','Shoulders','shoulders'),
('a0000000-0000-4000-8000-000000000004','Arms','arms'),
('a0000000-0000-4000-8000-000000000005','Legs','legs'),
('a0000000-0000-4000-8000-000000000006','Core','core'),
('a0000000-0000-4000-8000-000000000007','Full Body','full-body')
on conflict do nothing;

insert into public.equipment (id, name, slug, description, image_path, mock_price_inr) values
('b0000000-0000-4000-8000-000000000001','Adjustable Dumbbells','adjustable-dumbbells','Space-saving adjustable weights for progressive strength work.','/images/equipment/dumbbells.svg',4999),
('b0000000-0000-4000-8000-000000000002','Flat Bench','flat-bench','Stable padded bench for pressing, rows, and split squats.','/images/equipment/bench.svg',3499),
('b0000000-0000-4000-8000-000000000003','Resistance Bands','resistance-bands','Portable resistance set with multiple tension levels.','/images/equipment/bands.svg',799),
('b0000000-0000-4000-8000-000000000004','Pull-up Bar','pull-up-bar','Door-frame bar for pull-ups, hangs, and core training.','/images/equipment/pullup.svg',1299),
('b0000000-0000-4000-8000-000000000005','Yoga Mat','yoga-mat','High-grip training mat for floor and mobility sessions.','/images/equipment/mat.svg',699),
('b0000000-0000-4000-8000-000000000006','Kettlebell','kettlebell','Cast-iron kettlebell for swings, carries, and squats.','/images/equipment/kettlebell.svg',1499),
('b0000000-0000-4000-8000-000000000007','Barbell Set','barbell-set','Entry-level bar and plates for compound strength training.','/images/equipment/barbell.svg',8999),
('b0000000-0000-4000-8000-000000000008','Foam Roller','foam-roller','Textured recovery roller for cooldown and mobility work.','/images/equipment/roller.svg',599)
on conflict do nothing;

insert into public.exercises (id,name,slug,primary_muscle_group_id,difficulty,image_path,suggested_sets,suggested_reps,description) values
('c0000000-0000-4000-8000-000000000001','Push-up','push-up','a0000000-0000-4000-8000-000000000001','BEGINNER','/images/exercises/chest.svg',3,'8–15','A foundational bodyweight press with full-body tension.'),
('c0000000-0000-4000-8000-000000000002','Dumbbell Bench Press','dumbbell-bench-press','a0000000-0000-4000-8000-000000000001','INTERMEDIATE','/images/exercises/chest.svg',4,'8–12','A controlled horizontal press with independent arm loading.'),
('c0000000-0000-4000-8000-000000000003','Resistance Band Fly','resistance-band-fly','a0000000-0000-4000-8000-000000000001','BEGINNER','/images/exercises/chest.svg',3,'12–15','A chest isolation movement with continuous band tension.'),
('c0000000-0000-4000-8000-000000000004','Pull-up','pull-up','a0000000-0000-4000-8000-000000000002','INTERMEDIATE','/images/exercises/back.svg',4,'5–10','A vertical pull that develops the lats and upper back.'),
('c0000000-0000-4000-8000-000000000005','One-arm Dumbbell Row','one-arm-dumbbell-row','a0000000-0000-4000-8000-000000000002','BEGINNER','/images/exercises/back.svg',3,'10–12 / side','A supported row for back strength and scapular control.'),
('c0000000-0000-4000-8000-000000000006','Band Face Pull','band-face-pull','a0000000-0000-4000-8000-000000000002','BEGINNER','/images/exercises/back.svg',3,'12–20','A shoulder-friendly upper-back and rear-delt movement.'),
('c0000000-0000-4000-8000-000000000007','Dumbbell Overhead Press','dumbbell-overhead-press','a0000000-0000-4000-8000-000000000003','INTERMEDIATE','/images/exercises/shoulders.svg',4,'8–12','An overhead strength movement for all three deltoid heads.'),
('c0000000-0000-4000-8000-000000000008','Lateral Raise','lateral-raise','a0000000-0000-4000-8000-000000000003','BEGINNER','/images/exercises/shoulders.svg',3,'12–15','A strict isolation exercise for shoulder width.'),
('c0000000-0000-4000-8000-000000000009','Pike Push-up','pike-push-up','a0000000-0000-4000-8000-000000000003','INTERMEDIATE','/images/exercises/shoulders.svg',3,'6–12','A bodyweight vertical press emphasizing the shoulders.'),
('c0000000-0000-4000-8000-000000000010','Dumbbell Curl','dumbbell-curl','a0000000-0000-4000-8000-000000000004','BEGINNER','/images/exercises/arms.svg',3,'10–15','A classic elbow flexion exercise for the biceps.'),
('c0000000-0000-4000-8000-000000000011','Bench Triceps Dip','bench-triceps-dip','a0000000-0000-4000-8000-000000000004','INTERMEDIATE','/images/exercises/arms.svg',3,'8–12','A bodyweight triceps exercise using a stable bench.'),
('c0000000-0000-4000-8000-000000000012','Band Hammer Curl','band-hammer-curl','a0000000-0000-4000-8000-000000000004','BEGINNER','/images/exercises/arms.svg',3,'12–15','A neutral-grip curl for the biceps and forearms.'),
('c0000000-0000-4000-8000-000000000013','Goblet Squat','goblet-squat','a0000000-0000-4000-8000-000000000005','BEGINNER','/images/exercises/legs.svg',4,'8–15','A front-loaded squat that reinforces an upright torso.'),
('c0000000-0000-4000-8000-000000000014','Romanian Deadlift','romanian-deadlift','a0000000-0000-4000-8000-000000000005','INTERMEDIATE','/images/exercises/legs.svg',4,'8–12','A hip hinge targeting hamstrings and glutes.'),
('c0000000-0000-4000-8000-000000000015','Bulgarian Split Squat','bulgarian-split-squat','a0000000-0000-4000-8000-000000000005','ADVANCED','/images/exercises/legs.svg',3,'8–12 / side','A demanding unilateral squat for strength and balance.'),
('c0000000-0000-4000-8000-000000000016','Forearm Plank','forearm-plank','a0000000-0000-4000-8000-000000000006','BEGINNER','/images/exercises/core.svg',3,'30–60 sec','An anti-extension hold that builds trunk stiffness.'),
('c0000000-0000-4000-8000-000000000017','Dead Bug','dead-bug','a0000000-0000-4000-8000-000000000006','BEGINNER','/images/exercises/core.svg',3,'8–12 / side','A controlled core drill that protects the lower back.'),
('c0000000-0000-4000-8000-000000000018','Hanging Knee Raise','hanging-knee-raise','a0000000-0000-4000-8000-000000000006','INTERMEDIATE','/images/exercises/core.svg',3,'8–15','A hanging core movement with grip-strength benefits.'),
('c0000000-0000-4000-8000-000000000019','Kettlebell Swing','kettlebell-swing','a0000000-0000-4000-8000-000000000007','INTERMEDIATE','/images/exercises/full-body.svg',5,'15','An explosive hip hinge for power and conditioning.'),
('c0000000-0000-4000-8000-000000000020','Dumbbell Thruster','dumbbell-thruster','a0000000-0000-4000-8000-000000000007','ADVANCED','/images/exercises/full-body.svg',4,'8–12','A squat-to-press combination for total-body conditioning.'),
('c0000000-0000-4000-8000-000000000021','Bear Crawl','bear-crawl','a0000000-0000-4000-8000-000000000007','INTERMEDIATE','/images/exercises/full-body.svg',4,'20–30 sec','A locomotion drill that challenges shoulders, hips, and core.')
on conflict do nothing;

insert into public.exercise_steps (exercise_id, position, instruction)
select id, 1, 'Set up in a stable position and brace your core before starting.' from public.exercises
union all select id, 2, 'Move through a controlled range while keeping the target muscles engaged.' from public.exercises
union all select id, 3, 'Return under control, reset your posture, and repeat without rushing.' from public.exercises
on conflict do nothing;

insert into public.exercise_equipment (exercise_id,equipment_id) values
('c0000000-0000-4000-8000-000000000002','b0000000-0000-4000-8000-000000000001'),('c0000000-0000-4000-8000-000000000002','b0000000-0000-4000-8000-000000000002'),
('c0000000-0000-4000-8000-000000000003','b0000000-0000-4000-8000-000000000003'),('c0000000-0000-4000-8000-000000000004','b0000000-0000-4000-8000-000000000004'),
('c0000000-0000-4000-8000-000000000005','b0000000-0000-4000-8000-000000000001'),('c0000000-0000-4000-8000-000000000005','b0000000-0000-4000-8000-000000000002'),
('c0000000-0000-4000-8000-000000000006','b0000000-0000-4000-8000-000000000003'),('c0000000-0000-4000-8000-000000000007','b0000000-0000-4000-8000-000000000001'),
('c0000000-0000-4000-8000-000000000008','b0000000-0000-4000-8000-000000000001'),('c0000000-0000-4000-8000-000000000010','b0000000-0000-4000-8000-000000000001'),
('c0000000-0000-4000-8000-000000000011','b0000000-0000-4000-8000-000000000002'),('c0000000-0000-4000-8000-000000000012','b0000000-0000-4000-8000-000000000003'),
('c0000000-0000-4000-8000-000000000013','b0000000-0000-4000-8000-000000000006'),('c0000000-0000-4000-8000-000000000014','b0000000-0000-4000-8000-000000000007'),
('c0000000-0000-4000-8000-000000000015','b0000000-0000-4000-8000-000000000002'),('c0000000-0000-4000-8000-000000000016','b0000000-0000-4000-8000-000000000005'),
('c0000000-0000-4000-8000-000000000017','b0000000-0000-4000-8000-000000000005'),('c0000000-0000-4000-8000-000000000018','b0000000-0000-4000-8000-000000000004'),
('c0000000-0000-4000-8000-000000000019','b0000000-0000-4000-8000-000000000006'),('c0000000-0000-4000-8000-000000000020','b0000000-0000-4000-8000-000000000001'),
('c0000000-0000-4000-8000-000000000021','b0000000-0000-4000-8000-000000000005')
on conflict do nothing;

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
