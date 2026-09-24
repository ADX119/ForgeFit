/* eslint-disable @typescript-eslint/require-await -- providers are async by contract; real integrations will await network calls. */
import type {
  CommerceOffer,
  DemoOrderResult,
  FoodDeliveryProvider,
  ShoppingProvider,
} from "./types";

const hash = (value: string) =>
  [...value].reduce((total, character) => (total * 31 + character.charCodeAt(0)) >>> 0, 17);

const offer = (
  sourceId: string,
  provider: string,
  label: string,
  index: number,
  basePrice: number,
): CommerceOffer => ({
  id: `${sourceId}-${index}`,
  provider,
  label,
  priceInr: basePrice + (hash(`${sourceId}-${index}`) % 180),
  etaMinutes: 15 + (hash(`${provider}-${sourceId}`) % 31),
  demo: true,
});

const confirmOrder = (selected: CommerceOffer): DemoOrderResult => ({
  ...selected,
  status: "DEMO_PLACED",
  message: "Demo order placed. No charge was made and no real order was sent.",
});

export class MockShoppingProvider implements ShoppingProvider {
  // TODO: integrate real e-commerce/delivery API here (e.g. BigBasket, Blinkit, Swiggy, Zomato)
  async getOffers(type: "INGREDIENT" | "EQUIPMENT", sourceId: string, label: string) {
    const providers =
      type === "INGREDIENT"
        ? ["FreshCart Demo", "QuickBasket Demo"]
        : ["ForgeMart Demo", "FitSupply Demo"];
    const basePrice = type === "INGREDIENT" ? 45 : 799;
    return providers.map((provider, index) => offer(sourceId, provider, label, index, basePrice));
  }

  placeDemoOrder(selected: CommerceOffer) {
    return confirmOrder(selected);
  }
}

export class MockFoodDeliveryProvider implements FoodDeliveryProvider {
  // TODO: integrate real e-commerce/delivery API here (e.g. BigBasket, Blinkit, Swiggy, Zomato)
  async getOffers(recipeId: string, recipeName: string) {
    return ["MealDash Demo", "KitchenHop Demo"].map((provider, index) =>
      offer(recipeId, provider, recipeName, index, 179),
    );
  }

  placeDemoOrder(selected: CommerceOffer) {
    return confirmOrder(selected);
  }
}

const buildGoogleSearchUrl = (query: string) =>
  `https://www.google.com/search?q=${encodeURIComponent(query)}`;

const buildProviderSearchUrl = (provider: string, query: string) => {
  switch (provider) {
    case "BigBasket":
      return `https://www.bigbasket.com/ps/?q=${encodeURIComponent(query)}`;
    case "Blinkit":
      return `https://www.blinkit.com/search?query=${encodeURIComponent(query)}`;
    case "JioMart":
      return `https://www.jiomart.com/search?q=${encodeURIComponent(query)}`;
    case "Amazon":
      return `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
    case "Flipkart":
      return `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
    case "Decathlon":
      return `https://www.decathlon.in/search?query=${encodeURIComponent(query)}`;
    case "Swiggy":
      return `https://www.swiggy.com/search?query=${encodeURIComponent(query)}`;
    case "Zomato":
      return `https://www.zomato.com/ncr/search?q=${encodeURIComponent(query)}`;
    case "Dunzo":
      return `https://www.dunzo.com/search?city=Bangalore&q=${encodeURIComponent(query)}`;
    default:
      return buildGoogleSearchUrl(query);
  }
};

export class FreeShoppingProvider implements ShoppingProvider {
  async getOffers(type: "INGREDIENT" | "EQUIPMENT", sourceId: string, label: string) {
    const providers =
      type === "INGREDIENT"
        ? ["BigBasket", "Blinkit", "JioMart"]
        : ["Amazon", "Flipkart", "Decathlon"];
    const basePrice = type === "INGREDIENT" ? 69 : 1299;
    return providers.map((provider, index) => ({
      ...offer(sourceId, provider, label, index, basePrice),
      demo: false,
      externalUrl: buildProviderSearchUrl(provider, label),
    }));
  }

  placeDemoOrder(selected: CommerceOffer) {
    return confirmOrder(selected);
  }
}

export class FreeFoodDeliveryProvider implements FoodDeliveryProvider {
  async getOffers(recipeId: string, recipeName: string) {
    const providers = ["Swiggy", "Zomato", "Dunzo"];
    return providers.map((provider, index) => ({
      ...offer(recipeId, provider, recipeName, index, 199),
      demo: false,
      externalUrl: buildProviderSearchUrl(provider, recipeName),
    }));
  }

  placeDemoOrder(selected: CommerceOffer) {
    return confirmOrder(selected);
  }
}

export class RealShoppingProvider implements ShoppingProvider {
  async getOffers(type: "INGREDIENT" | "EQUIPMENT", sourceId: string, label: string) {
    const providers =
      type === "INGREDIENT"
        ? ["BigBasket", "Blinkit", "JioMart"]
        : ["Amazon", "Flipkart", "Decathlon"];
    const basePrice = type === "INGREDIENT" ? 69 : 1299;
    return providers.map((provider, index) => ({
      ...offer(sourceId, provider, label, index, basePrice),
      demo: false,
      externalUrl: buildProviderSearchUrl(provider, label),
    }));
  }

  placeDemoOrder(selected: CommerceOffer) {
    return confirmOrder(selected);
  }
}

export class RealFoodDeliveryProvider implements FoodDeliveryProvider {
  async getOffers(recipeId: string, recipeName: string) {
    const providers = ["Swiggy", "Zomato", "Dunzo"];
    return providers.map((provider, index) => ({
      ...offer(recipeId, provider, recipeName, index, 199),
      demo: false,
      externalUrl: buildProviderSearchUrl(provider, recipeName),
    }));
  }

  placeDemoOrder(selected: CommerceOffer) {
    return confirmOrder(selected);
  }
}

export function createShoppingProvider() {
  return process.env.GROCERY_API_KEY || process.env.EQUIPMENT_API_KEY
    ? new RealShoppingProvider()
    : new FreeShoppingProvider();
}

export function createFoodDeliveryProvider() {
  return process.env.FOOD_DELIVERY_API_KEY
    ? new RealFoodDeliveryProvider()
    : new FreeFoodDeliveryProvider();
}
