import { test, expect } from "@playwright/test";

const BASE = "/universitarios/inter-unaerp";

const PUBLIC_ROUTES: Array<{ path: string; name: string }> = [
  { path: "/", name: "home" },
  { path: "/times", name: "times" },
  { path: "/jogadores", name: "jogadores" },
  { path: "/confrontos", name: "confrontos" },
  { path: "/classificacao", name: "classificacao" },
  { path: "/highlights", name: "highlights" },
  { path: "/galeria", name: "galeria" },
  { path: "/edicoes", name: "edicoes" },
];

const ADMIN_ROUTES: Array<{ path: string; name: string }> = [
  { path: "/admin", name: "admin-dashboard" },
  { path: "/admin/times", name: "admin-times" },
  { path: "/admin/jogadores", name: "admin-jogadores" },
  { path: "/admin/confrontos", name: "admin-confrontos" },
  { path: "/admin/highlights", name: "admin-highlights" },
  { path: "/admin/edicoes", name: "admin-edicoes" },
  { path: "/admin/midia", name: "admin-midia" },
  { path: "/admin/importar", name: "admin-importar" },
];

// Intercepta qualquer chamada GraphQL e responde com mock vazio mas válido,
// ou simula um admin logado pra rotas /admin
function mockGraphQL(
  page: import("@playwright/test").Page,
  opts: { asAdmin?: boolean } = {}
) {
  return page.route("**/graphql", async (route) => {
    const req = route.request();
    const body = req.postDataJSON?.() ?? JSON.parse(req.postData() || "{}");
    const operationName = (body.operationName as string) || "";
    const query = (body.query as string) || "";

    const matches = (name: string) =>
      operationName === name || query.includes(`${name.charAt(0).toLowerCase()}${name.slice(1)}`);

    let data: Record<string, unknown> = {};

    if (matches("Me") || query.includes("me {")) {
      data = opts.asAdmin
        ? {
            me: {
              userId: 1,
              email: "mizakesgschool@gmail.com",
              login: "mizake",
              role: 1,
            },
          }
        : { me: null };
    } else if (query.includes("games")) {
      data = { games: [{ id: "1", slug: "valorant" }] };
    } else if (query.includes("activeEdition")) {
      data = { activeEdition: null };
    } else if (query.includes("editions")) {
      data = { editions: [] };
    } else if (query.includes("matches")) {
      data = { matches: [] };
    } else if (query.includes("highlights")) {
      data = { highlights: [] };
    } else if (query.includes("gallery")) {
      data = { gallery: [] };
    } else if (query.includes("standings")) {
      data = { standings: [] };
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data }),
    });
  });
}

test.describe("Visual tour — rotas públicas (desktop)", () => {
  for (const r of PUBLIC_ROUTES) {
    test(`shot ${r.name}`, async ({ page }) => {
      await mockGraphQL(page);
      await page.goto(`${BASE}${r.path === "/" ? "/" : r.path}`, {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(800);
      await page.screenshot({
        path: `e2e/screenshots/${r.name}.png`,
        fullPage: true,
      });
      const bodyText = await page.locator("body").innerText();
      expect(bodyText.length).toBeGreaterThan(50);
    });
  }
});

test.describe("Visual tour — admin (logado como admin via mock)", () => {
  for (const r of ADMIN_ROUTES) {
    test(`shot ${r.name}`, async ({ page }) => {
      await mockGraphQL(page, { asAdmin: true });
      await page.goto(`${BASE}${r.path}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(800);
      await page.screenshot({
        path: `e2e/screenshots/${r.name}.png`,
        fullPage: true,
      });
      const bodyText = await page.locator("body").innerText();
      expect(bodyText.length).toBeGreaterThan(20);
    });
  }
});
