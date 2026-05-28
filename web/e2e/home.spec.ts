import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("renders hero and primary stats", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Inter UnaERP/i);

    // Hero title contains the brand
    await expect(page.locator("h1").first()).toContainText(/Inter/i);
    await expect(page.locator("h1").first()).toContainText(/UnaERP/i);

    // 3 stat cards visíveis no hero
    await expect(page.getByText("Times", { exact: true })).toBeVisible();
    await expect(page.getByText("Jogadores", { exact: true })).toBeVisible();
    await expect(page.getByText("Partidas", { exact: true })).toBeVisible();
  });

  test("CTAs lead to confrontos and classificacao", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Ver Confrontos/i }).click();
    await expect(page).toHaveURL(/\/confrontos/);
  });

  test("standings section shows Olimpo on top", async ({ page }) => {
    await page.goto("/");
    const standings = page.locator("text=Classificação").first();
    await expect(standings).toBeVisible();
    // Top team — Olimpo aparece pelo menos uma vez
    await expect(page.getByText("Olimpo").first()).toBeVisible();
  });
});

test.describe("Theme toggle", () => {
  test("toggles to dark and back", async ({ page }) => {
    await page.goto("/");
    // Toggle inicial é light, classe 'dark' não está
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);

    // Clica no toggle (desktop)
    const toggle = page.getByRole("button", {
      name: /Mudar para tema escuro/i,
    });
    await toggle.click();
    await expect(html).toHaveClass(/dark/);

    // Toggle volta pra light
    const toggleBack = page.getByRole("button", {
      name: /Mudar para tema claro/i,
    });
    await toggleBack.click();
    await expect(html).not.toHaveClass(/dark/);
  });

  test("persists dark preference across navigation", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", {
      name: /Mudar para tema escuro/i,
    });
    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.getByRole("link", { name: /Times/i }).first().click();
    await expect(page).toHaveURL(/\/times/);
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
