import { describe, expect, it } from "vitest";
import {
  calculateMacroTarget,
  normalizeIngredientName,
  normalizeUnit,
  providerName,
  providerSearchUrl,
  GROCERY_PROVIDER_IDS,
  recipeMatchesDiet,
  scaleQuantity,
  zonedDay,
  zonedWeekDates,
} from "./index";

describe("time zone helpers", () => {
  // 2026-09-23T20:00:00Z is still Wednesday in New York but already Thursday in India.
  const instant = new Date("2026-09-23T20:00:00Z");

  it("resolves the calendar day in the user's time zone", () => {
    expect(zonedDay("Asia/Kolkata", instant)).toEqual({
      date: "2026-09-24",
      dayOfWeek: 4,
      weekday: "Thu",
    });
    expect(zonedDay("America/New_York", instant)).toMatchObject({
      date: "2026-09-23",
      dayOfWeek: 3,
    });
  });

  it("falls back to the default zone for invalid input", () => {
    expect(zonedDay("Not/AZone", instant).date).toBe("2026-09-24");
  });

  it("returns Monday to Sunday of the current week", () => {
    expect(zonedWeekDates("Asia/Kolkata", instant)).toEqual([
      "2026-09-21",
      "2026-09-22",
      "2026-09-23",
      "2026-09-24",
      "2026-09-25",
      "2026-09-26",
      "2026-09-27",
    ]);
  });
});

describe("diet preference", () => {
  it("allows recipes at or below the preference's tier", () => {
    expect(recipeMatchesDiet("VEGAN", "VEGETARIAN")).toBe(true);
    expect(recipeMatchesDiet("EGGETARIAN", "VEGETARIAN")).toBe(false);
    expect(recipeMatchesDiet("EGGETARIAN", "EGGETARIAN")).toBe(true);
    expect(recipeMatchesDiet("NON_VEGETARIAN", "EGGETARIAN")).toBe(false);
    expect(recipeMatchesDiet("VEGETARIAN", "VEGAN")).toBe(false);
    expect(recipeMatchesDiet("NON_VEGETARIAN", "NON_VEGETARIAN")).toBe(true);
  });

  it("allows everything when no preference is set", () => {
    expect(recipeMatchesDiet("NON_VEGETARIAN", null)).toBe(true);
  });
});

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

describe("shopping links", () => {
  it("builds each retailer's own search URL with the query encoded", () => {
    expect(providerSearchUrl("bigbasket", "paneer")).toBe("https://www.bigbasket.com/ps/?q=paneer");
    expect(providerSearchUrl("jiomart", "brown rice")).toBe(
      "https://www.jiomart.com/search/brown%20rice",
    );
    expect(providerSearchUrl("amazon", " adjustable dumbbells ")).toBe(
      "https://www.amazon.in/s?k=adjustable%20dumbbells",
    );
    expect(providerSearchUrl("swiggy", "egg & roti")).toBe(
      "https://www.swiggy.com/search?query=egg%20%26%20roti",
    );
  });

  it("names every grocery provider", () => {
    expect(GROCERY_PROVIDER_IDS.map(providerName)).toEqual([
      "BigBasket",
      "Blinkit",
      "Zepto",
      "Swiggy Instamart",
      "JioMart",
    ]);
  });
});
