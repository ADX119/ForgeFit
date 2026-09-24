import { expect, test } from "@playwright/test";

test("landing page communicates the complete ForgeFit loop", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Build the body/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Start forging/i })).toBeVisible();
  await expect(page.getByText("Train with intent")).toBeVisible();
  await expect(page.getByText("Fuel the goal")).toBeVisible();
  await expect(page.getByText("Shop without friction")).toBeVisible();
});

test("manifest is installable and does not cache private routes", async ({ request }) => {
  const manifest = await request.get("/manifest.webmanifest");
  expect(manifest.ok()).toBeTruthy();
  const body = await manifest.json();
  expect(body.display).toBe("standalone");
  expect(body.start_url).toBe("/dashboard");

  const serviceWorker = await request.get("/sw.js");
  const source = await serviceWorker.text();
  expect(source).toContain('const SHELL = ["/offline"');
  expect(source).not.toContain("/dashboard");
  expect(source).not.toContain("supabase");
});
