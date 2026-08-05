import type { DietGoal, ProfileMetrics } from "./types";

const OPENAI_API_BASE = process.env.OPENAI_API_BASE ?? "https://api.openai.com/v1";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const HF_API_KEY = process.env.HF_API_KEY;

async function callOpenAi(prompt: string) {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a helpful fitness and nutrition assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${details}`);
  }

  const body = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return body.choices?.[0]?.message?.content?.trim() ?? "";
}

async function callHuggingFace(prompt: string) {
  if (!HF_API_KEY) {
    throw new Error("HF_API_KEY is not configured.");
  }

  const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-small", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${HF_API_KEY}`,
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { max_new_tokens: 400, temperature: 0.7 },
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Hugging Face request failed: ${response.status} ${details}`);
  }

  const body = (await response.json()) as { generated_text?: string };
  return body.generated_text?.trim() ?? "";
}

function fallbackRecipeRecommendations(
  profile: ProfileMetrics,
  dietaryPreferences?: string,
  excludedIngredients?: string[],
) {
  const goalCopy = {
    MUSCLE_GAIN: "support muscle growth with extra protein",
    FAT_LOSS: "stay lean with balanced macros and lower calories",
    MAINTENANCE: "keep energy stable with a balanced meal",
    RECOMPOSITION: "build strength while staying lean",
  }[profile.goal];

  const preferenceText = dietaryPreferences ? ` that fits ${dietaryPreferences}` : "";
  const exclusionText = excludedIngredients?.length
    ? ` Avoid ${excludedIngredients.join(", ")}.`
    : "";

  return [
    `Paneer Power Bowl — a high-protein meal with paneer, greens, and brown rice to ${goalCopy}.${preferenceText}${exclusionText}`,
    `Spiced Lentil Salad — hearty dal, mixed vegetables, and a tangy dressing designed to keep protein up and carbs steady for your ${profile.goal.toLowerCase()} goal.${preferenceText}${exclusionText}`,
    `Turmeric Chickpea Stir-fry — quick, flavourful, and rich in plant protein, made to match your energy needs for ${profile.goal.toLowerCase()} nutrition.${preferenceText}${exclusionText}`,
  ].join("\n\n");
}

function fallbackIngredientSubstitutes(ingredient: string, restrictions?: string) {
  const normalized = ingredient.toLowerCase();
  const substitutions: Record<string, string[]> = {
    milk: ["almond milk", "soya milk", "coconut milk"],
    paneer: ["tofu", "chickpea tofu", "tempeh"],
    eggs: ["moong dal chilla", "besan omelette", "soy scrambled"],
    chicken: ["soya chunks", "paneer", "mixed lentils"],
    rice: ["quinoa", "millet", "buckwheat"],
  };

  const options = substitutions[normalized] ?? ["roasted lentils", "tofu", "vegetable protein"];
  return options
    .slice(0, 3)
    .map(
      (substitute) =>
        `${substitute} — a strong swap for ${ingredient}${restrictions ? ` when ${restrictions}` : ""}.`,
    )
    .join("\n");
}

function fallbackSearchPhrase(ingredient: string) {
  return `Buy ${ingredient} online India`;
}

function fallbackWorkoutPlan(profile: ProfileMetrics) {
  const goalPhrase = {
    MUSCLE_GAIN: "strength focus with compound lifts and progressive overload",
    FAT_LOSS: "mixed cardio and full-body strength with higher movement volume",
    MAINTENANCE: "balanced strength and conditioning to keep fitness stable",
    RECOMPOSITION: "strength training plus moderate cardio for lean muscle",
  }[profile.goal];

  const intensity =
    profile.activityLevel === "VERY_ACTIVE" || profile.activityLevel === "EXTRA_ACTIVE"
      ? "higher intensity"
      : profile.activityLevel === "SEDENTARY"
        ? "gentle conditioning"
        : "moderate training";

  return `3-day plan: Day 1 lower body, Day 2 upper body, Day 3 full body. ${goalPhrase}. Use ${intensity} and rest between sets. Aim for 8–12 reps on strength moves and 15–20 reps on conditioning exercises.`;
}

function fallbackDietPlan(profile: ProfileMetrics) {
  const calories = {
    MUSCLE_GAIN: "slightly above maintenance with extra protein",
    FAT_LOSS: "slightly below maintenance with lean protein and vegetables",
    MAINTENANCE: "at maintenance with balanced macros across meals",
    RECOMPOSITION: "at maintenance with high protein and moderate carbs",
  }[profile.goal];

  return `Daily plan: breakfast with protein and whole grains, lunch with lean protein and vegetables, dinner with fibre-rich carbs and greens. ${calories}, plus one protein-rich snack.`;
}

function fallbackShoppingCopy(profile: ProfileMetrics) {
  const goalPhrase = {
    MUSCLE_GAIN: "choose protein-rich ingredients and lean carbs for recovery",
    FAT_LOSS: "focus on high-fiber, nutrient-dense foods with moderate calories",
    MAINTENANCE: "pick balanced meals that keep your energy steady",
    RECOMPOSITION: "combine strength-building protein with clean carbs",
  }[profile.goal];
  return `For ${profile.goal.toLowerCase()}, ${goalPhrase}.`;
}

export async function generateRecipeRecommendations(
  profile: ProfileMetrics,
  dietaryPreferences?: string,
  excludedIngredients?: string[],
) {
  const prompt = `Create 3 recipe recommendations for a user with the following profile:
- Goal: ${profile.goal}
- Age: ${profile.age}
- Height: ${profile.heightCm} cm
- Weight: ${profile.weightKg} kg
- Activity level: ${profile.activityLevel}
${
  dietaryPreferences
    ? `- Dietary preferences: ${dietaryPreferences}
`
    : ""
}${
    excludedIngredients?.length
      ? `- Exclude: ${excludedIngredients.join(", ")}
`
      : ""
  }

Return each recommendation on a separate line with a title, macro focus, and why it fits the goal. Use simple Indian-friendly meal ideas.`;

  if (OPENAI_API_KEY) return callOpenAi(prompt);
  if (HF_API_KEY) return callHuggingFace(prompt);
  return fallbackRecipeRecommendations(profile, dietaryPreferences, excludedIngredients);
}

export async function suggestIngredientSubstitutes(ingredient: string, restrictions?: string) {
  const prompt = `Suggest 3 substitute ingredients for '${ingredient}' in a fitness meal. ${
    restrictions ? `Apply the following restrictions: ${restrictions}.` : ""
  } Give the substitute name and why it is a good swap.`;
  if (OPENAI_API_KEY) return callOpenAi(prompt);
  if (HF_API_KEY) return callHuggingFace(prompt);
  return fallbackIngredientSubstitutes(ingredient, restrictions);
}

export async function generateGrocerySearchPhrase(ingredient: string, locale = "en-IN") {
  const prompt = `Create a short product search phrase suitable for Indian grocery apps for the ingredient '${ingredient}'. Return only the search phrase.`;
  if (OPENAI_API_KEY) return callOpenAi(prompt);
  if (HF_API_KEY) return callHuggingFace(prompt);
  return fallbackSearchPhrase(ingredient);
}

export async function generatePersonalizedShoppingCopy(profile: ProfileMetrics) {
  const prompt = `Write a one-sentence personalized shopping tip for a user who wants ${profile.goal.toLowerCase()} and is ${profile.activityLevel.toLowerCase()} active.`;
  if (OPENAI_API_KEY) return callOpenAi(prompt);
  if (HF_API_KEY) return callHuggingFace(prompt);
  return fallbackShoppingCopy(profile);
}

export async function generateWorkoutPlan(profile: ProfileMetrics) {
  const prompt = `Create a short personalized 3-day workout plan for a user with the following profile:
- Goal: ${profile.goal}
- Age: ${profile.age}
- Height: ${profile.heightCm} cm
- Weight: ${profile.weightKg} kg
- Activity level: ${profile.activityLevel}

Return a clear daily outline with simple exercise suggestions, number of sets, and recovery notes.`;
  if (OPENAI_API_KEY) return callOpenAi(prompt);
  if (HF_API_KEY) return callHuggingFace(prompt);
  return fallbackWorkoutPlan(profile);
}

export async function generateDietPlan(profile: ProfileMetrics) {
  const prompt = `Create a short personalized daily diet plan for a user with the following profile:
- Goal: ${profile.goal}
- Age: ${profile.age}
- Height: ${profile.heightCm} cm
- Weight: ${profile.weightKg} kg
- Activity level: ${profile.activityLevel}

Return a clear meal outline with breakfast, lunch, dinner, and one snack, using simple Indian-friendly food suggestions.`;
  if (OPENAI_API_KEY) return callOpenAi(prompt);
  if (HF_API_KEY) return callHuggingFace(prompt);
  return fallbackDietPlan(profile);
}
