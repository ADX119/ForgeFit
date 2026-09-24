import { expect, test } from "@playwright/test";

const email = process.env.FORGEFIT_E2E_EMAIL;
const password = process.env.FORGEFIT_E2E_PASSWORD;

test.describe("authenticated ForgeFit journey", () => {
  test.skip(
    !email || !password,
    "Set FORGEFIT_E2E_EMAIL and FORGEFIT_E2E_PASSWORD for the seeded test account.",
  );

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Password").fill(password!);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/(dashboard|onboarding)/);
  });

  test("builds a workout, shops groceries and marks equipment", async ({ page }) => {
    test.skip(
      page.url().includes("onboarding"),
      "Complete the test account profile before running the journey.",
    );
    await page.goto("/train/exercises");
    const pushUp = page.locator("form").filter({ has: page.getByLabel("Day for Push-up") });
    await pushUp.getByRole("button", { name: "Add" }).click();
    await expect(page.getByText(/Added to|Already on/)).toBeVisible();
    await page.goto("/train");
    await expect(page.getByText("Push-up").first()).toBeVisible();

    await page.goto("/nutrition");
    await page.getByRole("button", { name: "All goals" }).click();
    await page
      .getByRole("link", { name: /Paneer Power Bowl/i })
      .first()
      .click();
    await page.getByRole("button", { name: /Add to groceries/i }).click();
    await expect(page.getByText("Ingredients added to your grocery list.")).toBeVisible();

    // Shopping is a link to the chosen store's own search, never an order inside ForgeFit.
    await page.goto("/nutrition/grocery");
    await page.getByRole("button", { name: "Blinkit" }).click();
    await expect(page.getByText("Shopping on Blinkit.")).toBeVisible();
    const search = page.getByRole("link", { name: /^Search Paneer on Blinkit/ }).first();
    await expect(search).toHaveAttribute("href", "https://blinkit.com/s/?q=Paneer");
    await expect(search).toHaveAttribute("target", "_blank");

    // Equipment: marking an item as owned hides its retailer links.
    await page.goto("/train/equipment");
    const mat = page.getByRole("button", { name: "I own Yoga Mat" });
    const ownedBefore = await mat.getAttribute("aria-pressed");
    await mat.click();
    await expect(mat).toHaveAttribute("aria-pressed", ownedBefore === "true" ? "false" : "true");
  });
});
