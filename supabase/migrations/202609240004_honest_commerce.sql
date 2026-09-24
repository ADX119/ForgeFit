-- Phase 2: honest commerce.
-- Shopping becomes plain links to real retailers' own search pages. ForgeFit no longer invents
-- prices or "demo orders". Users record the equipment they own, which plans and the exercise
-- library use, and pick the grocery store and food app they prefer.

-- What each user owns (home equipment). Gym machines are implied by training at a full gym.
create table public.user_equipment (
  user_id uuid not null references auth.users(id) on delete cascade,
  equipment_id uuid not null references public.equipment(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, equipment_id)
);

create index user_equipment_equipment_idx on public.user_equipment (equipment_id);

alter table public.user_equipment enable row level security;

create policy "own equipment" on public.user_equipment for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant select, insert, delete on public.user_equipment to authenticated;

-- Preferred retailers; the ids match the provider registry in packages/domain/src/commerce.ts.
alter table public.profiles
  add column preferred_grocery_provider text
    check (preferred_grocery_provider in ('bigbasket', 'blinkit', 'zepto', 'instamart', 'jiomart')),
  add column preferred_food_provider text
    check (preferred_food_provider in ('swiggy', 'zomato'));

-- Invented prices and simulated orders are gone.
drop table public.mock_orders;
drop type public.order_type;
alter table public.equipment drop constraint if exists equipment_price_when_purchasable;
alter table public.equipment drop column mock_price_inr;
