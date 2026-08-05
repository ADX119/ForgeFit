const unitAliases: Record<string, string> = {
  grams: "g",
  gram: "g",
  kilograms: "kg",
  kilogram: "kg",
  millilitres: "ml",
  milliliters: "ml",
  pieces: "piece",
  pcs: "piece",
};

export function normalizeIngredientName(name: string): string {
  return name.trim().toLocaleLowerCase("en-IN").replace(/\s+/g, " ");
}

export function normalizeUnit(unit: string): string {
  const normalized = unit.trim().toLocaleLowerCase("en-IN");
  return unitAliases[normalized] ?? normalized;
}

export function scaleQuantity(
  quantity: number,
  recipeServings: number,
  desiredServings: number,
): number {
  if (quantity < 0 || recipeServings <= 0 || desiredServings <= 0) {
    throw new Error("Quantities and servings must be positive");
  }
  return Math.round(quantity * (desiredServings / recipeServings) * 100) / 100;
}
