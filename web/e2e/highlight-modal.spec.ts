import { test, expect } from "@playwright/test";

test.describe("Highlight modal", () => {
  test("opens when clicking a highlight card", async ({ page }) => {
    await page.goto("/highlights");
    // Pegando a primeira card da grid
    const firstCard = page
      .getByRole("button")
      .filter({ has: page.locator("text=Clutch, text=Ace, text=Play, text=Recap") })
      .first()
      .or(page.locator(".aspect-\\[16\\/10\\]").first().locator(".."));

    // Mais simples: clica em qualquer um dos featured ou cards
    await page.locator("[class*='aspect-[16/10]']").first().click({ force: true });
    // O modal usa Radix Dialog — verifica presença do role
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 4000 });
  });

  test("closes modal with X button", async ({ page }) => {
    await page.goto("/highlights");
    await page.locator("[class*='aspect-[16/10]']").first().click({ force: true });
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: /Fechar/i }).first().click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});

test.describe("Photo lightbox", () => {
  test("opens photo and closes with ESC", async ({ page }) => {
    await page.goto("/galeria");
    // Click primeiro botão de foto na masonry
    await page.locator(".columns-2 button, .columns-4 button, .columns-5 button").first().click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 4000 });
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});
