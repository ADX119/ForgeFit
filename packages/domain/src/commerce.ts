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
  getOffers(type: "INGREDIENT" | "EQUIPMENT", sourceId: string, label: string) {
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
  getOffers(recipeId: string, recipeName: string) {
    return ["MealDash Demo", "KitchenHop Demo"].map((provider, index) =>
      offer(recipeId, provider, recipeName, index, 179),
    );
  }

  placeDemoOrder(selected: CommerceOffer) {
    return confirmOrder(selected);
  }
}
