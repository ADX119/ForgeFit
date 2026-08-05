import { describe, expect, it } from "vitest";
import {
  calculateMacroTarget,
  MockFoodDeliveryProvider,
  MockShoppingProvider,
  normalizeIngredientName,
  normalizeUnit,
  scaleQuantity,
} from "./index";

describe("calculateMacroTarget", () => {
  it("calculates deterministic maintenance targets", () => {
    const result = calculateMacroTarget({
      age: 30,
      weightKg: 70,
      heightCm: 175,
      calculationSex: "MALE",
      activityLevel: "MODERATELY_ACTIVE",
      goal: "MAINTENANCE",
    });
    expect(result).toMatchObject({ bmr: 1649, calories: 2556, proteinG: 112, fatG: 56 });
    expect(result.carbsG).toBeGreaterThan(300);
  });

  it("never recommends below BMR", () => {
    const result = calculateMacroTarget({
      age: 80,
      weightKg: 35,
      heightCm: 120,
      calculationSex: "FEMALE",
      activityLevel: "SEDENTARY",
      goal: "FAT_LOSS",
    });
    expect(result.calories).toBe(result.bmr);
  });
});

describe("grocery helpers", () => {
  it("normalizes and scales ingredients", () => {
    expect(normalizeIngredientName("  Chicken   Breast ")).toBe("chicken breast");
    expect(normalizeUnit("grams")).toBe("g");
    expect(scaleQuantity(200, 2, 3)).toBe(300);
  });
});

describe("mock commerce", () => {
  it("is deterministic and always discloses demo status", () => {
    const provider = new MockShoppingProvider();
    const first = provider.getOffers("INGREDIENT", "paneer", "Paneer");
    expect(first).toEqual(provider.getOffers("INGREDIENT", "paneer", "Paneer"));
    expect(provider.placeDemoOrder(first[0]!)).toMatchObject({ demo: true, status: "DEMO_PLACED" });
    expect(new MockFoodDeliveryProvider().getOffers("recipe-1", "Power Bowl")).toHaveLength(2);
  });
});
