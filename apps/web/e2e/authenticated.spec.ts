import { expect, test } from "@playwright/test";

const email = process.env.FITFORGE_E2E_EMAIL;
const password = process.env.FITFORGE_E2E_PASSWORD;

test.describe("authenticated FitForge journey", () => {
  test.skip(
    !email || !password,
    "Set FITFORGE_E2E_EMAIL and FITFORGE_E2E_PASSWORD for the seeded test account.",
  );

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Password").fill(password!);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/(dashboard|onboarding)/);
  });

  test("builds a workout, adds groceries, and places a disclosed demo order", async ({ page }) => {
    test.skip(
      page.url().includes("onboarding"),
      "Complete the test account profile before running the journey.",
    );
    await page.goto("/exercises");
    const pushUp = page
      .getByRole("heading", { name: "Push-up" })
      .locator("..", { hasText: "Push-up" });
    await pushUp.getByRole("button", { name: "Add" }).click();
    await page.goto("/workout");
    await expect(page.getByText("Push-up")).toBeVisible();

    await page.goto("/diet");
    await page.getByRole("link", { name: /Paneer Power Bowl/i }).click();
    await page.getByRole("button", { name: /Add to groceries/i }).click();
    await page.goto("/grocery");
    await expect(page.getByText("Paneer")).toBeVisible();

    await page.goto("/shop");
    await page
      .getByRole("button", { name: /Buy · Demo/i })
      .first()
      .click();
    await expect(page.getByText("Demo · no charge")).toBeVisible();
    await page.getByRole("button", { name: "Place demo" }).first().click();
    await expect(page.getByRole("heading", { name: "Demo order placed" })).toBeVisible();
    await page.goto("/profile");
    await expect(page.getByText("Demo placed · no charge").first()).toBeVisible();
  });
});
