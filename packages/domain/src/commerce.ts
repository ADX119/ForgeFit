// Shopping is a set of links to real retailers' own search pages. ForgeFit doesn't show prices,
// take orders or see what people buy: the retailer handles all of that.

export const GROCERY_PROVIDER_IDS = [
  "bigbasket",
  "blinkit",
  "zepto",
  "instamart",
  "jiomart",
] as const;
export const FOOD_PROVIDER_IDS = ["swiggy", "zomato"] as const;
export const EQUIPMENT_PROVIDER_IDS = ["amazon", "flipkart", "decathlon"] as const;

export type GroceryProviderId = (typeof GROCERY_PROVIDER_IDS)[number];
export type FoodProviderId = (typeof FOOD_PROVIDER_IDS)[number];
export type EquipmentProviderId = (typeof EQUIPMENT_PROVIDER_IDS)[number];
export type ProviderId = GroceryProviderId | FoodProviderId | EquipmentProviderId;

const q = encodeURIComponent;

const providers: Record<ProviderId, { name: string; search: (query: string) => string }> = {
  bigbasket: { name: "BigBasket", search: (s) => `https://www.bigbasket.com/ps/?q=${q(s)}` },
  blinkit: { name: "Blinkit", search: (s) => `https://blinkit.com/s/?q=${q(s)}` },
  zepto: { name: "Zepto", search: (s) => `https://www.zeptonow.com/search?query=${q(s)}` },
  instamart: {
    name: "Swiggy Instamart",
    search: (s) => `https://www.swiggy.com/instamart/search?query=${q(s)}`,
  },
  jiomart: { name: "JioMart", search: (s) => `https://www.jiomart.com/search/${q(s)}` },
  swiggy: { name: "Swiggy", search: (s) => `https://www.swiggy.com/search?query=${q(s)}` },
  zomato: { name: "Zomato", search: (s) => `https://www.zomato.com/search?q=${q(s)}` },
  amazon: { name: "Amazon", search: (s) => `https://www.amazon.in/s?k=${q(s)}` },
  flipkart: { name: "Flipkart", search: (s) => `https://www.flipkart.com/search?q=${q(s)}` },
  decathlon: { name: "Decathlon", search: (s) => `https://www.decathlon.in/search?query=${q(s)}` },
};

export const DEFAULT_GROCERY_PROVIDER: GroceryProviderId = "bigbasket";

export function providerName(id: ProviderId): string {
  return providers[id].name;
}

/** The retailer's own search page for `query`. */
export function providerSearchUrl(id: ProviderId, query: string): string {
  return providers[id].search(query.trim());
}

export function isGroceryProvider(value: unknown): value is GroceryProviderId {
  return GROCERY_PROVIDER_IDS.includes(value as GroceryProviderId);
}
