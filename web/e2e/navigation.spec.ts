import { test, expect } from "@playwright/test";

const publicRoutes = [
  { path: "/", title: /Inter UnaERP/i },
  { path: "/times", header: /Times/i },
  { path: "/jogadores", header: /Ranking/i },
  { path: "/confrontos", header: /Agenda/i },
  { path: "/classificacao", header: /Classificação/i },
  { path: "/highlights", header: /Highlights/i },
  { path: "/galeria", header: /Galeria/i },
  { path: "/edicoes", header: /Edições/i },
  { path: "/entrar", header: /Entrar com|Santos Games/i },
];

test.describe("Public navigation", () => {
  for (const route of publicRoutes) {
    test(`route ${route.path} renders`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(route.path);
      await expect(page.locator("body")).toBeVisible();
      if (route.header) {
        await expect(page.locator("h1, h2").first()).toContainText(route.header);
      }
      expect(errors, errors.join("\n")).toHaveLength(0);
    });
  }
});

test.describe("Team detail navigation", () => {
  test("click on team card opens detail page", async ({ page }) => {
    await page.goto("/times");
    // Cards de times são links — clica no primeiro time (Olimpo, lider)
    await page.getByRole("link", { name: /Olimpo/i }).first().click();
    await expect(page).toHaveURL(/\/times\/olimpo/);
    await expect(page.locator("h1").first()).toContainText(/Olimpo/i);
  });
});

test.describe("404 handling", () => {
  test("unknown route shows 404 page", async ({ page }) => {
    await page.goto("/rota-que-nao-existe");
    await expect(page.getByText(/não encontrada/i)).toBeVisible();
    // Botão pra voltar à home
    await page.getByRole("link", { name: /Voltar à Home/i }).click();
    await expect(page).toHaveURL("/");
  });
});

test.describe("Admin guard", () => {
  test("redirects to login screen when not authenticated", async ({ page }) => {
    await page.goto("/admin");
    // Sem cookie sg_auth, deve mostrar tela de Login necessário
    await expect(page.getByText(/Login necessário/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /Entrar com SGA/i })).toBeVisible();
  });
});
