-- Diet preference: users say how they eat, recipes say what they contain.
-- Tiers run from most to least restrictive: VEGAN < VEGETARIAN < EGGETARIAN < NON_VEGETARIAN.
-- A recipe suits a user when its tier is at or below the user's tier.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'diet_preference'
      AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.diet_preference AS ENUM ('VEGAN', 'VEGETARIAN', 'EGGETARIAN', 'NON_VEGETARIAN');
  END IF;
END$$;

-- Nullable: existing users are asked on their next visit to Diet or Profile.
alter table public.profiles add column if not exists diet_preference public.diet_preference;

alter table public.recipes add column if not exists diet_type public.diet_preference;

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
end::public.diet_preference
where diet_type is null;

-- Anything unclassified is treated as non-vegetarian so it is never shown to a vegetarian by mistake.
update public.recipes set diet_type = 'NON_VEGETARIAN' where diet_type is null;

alter table public.recipes alter column diet_type set default 'NON_VEGETARIAN';
alter table public.recipes alter column diet_type set not null;

create index if not exists recipes_diet_type_idx on public.recipes (diet_type);
