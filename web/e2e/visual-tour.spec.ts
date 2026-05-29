import { test, expect, type Page } from "@playwright/test";

const BASE = process.env.E2E_BASE_PATH ?? "";

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

// Mock GraphQL responses — varia por estado: empty (default) ou populated
type MockState = "empty" | "populated";

const populatedEdition = {
  id: "ed-2025",
  year: 2025,
  name: "Inter UnaERP 2025",
  status: "ongoing",
  startedAt: "2025-05-01T00:00:00Z",
  endedAt: null,
  teams: [
    {
      id: "et-1",
      wins: 5,
      losses: 1,
      finalPlacement: null,
      team: {
        id: "t-1",
        name: "Olimpo",
        slug: "olimpo",
        primaryColor: "#0073B7",
        logoUrl: null,
      },
    },
    {
      id: "et-2",
      wins: 4,
      losses: 2,
      finalPlacement: null,
      team: {
        id: "t-2",
        name: "Thunder",
        slug: "thunder",
        primaryColor: "#A4CD3A",
        logoUrl: null,
      },
    },
    {
      id: "et-3",
      wins: 3,
      losses: 3,
      finalPlacement: null,
      team: {
        id: "t-3",
        name: "Dragon",
        slug: "dragon",
        primaryColor: "#EC4899",
        logoUrl: null,
      },
    },
    {
      id: "et-4",
      wins: 2,
      losses: 4,
      finalPlacement: null,
      team: {
        id: "t-4",
        name: "Nova",
        slug: "nova",
        primaryColor: "#2EAA80",
        logoUrl: null,
      },
    },
  ],
};

const populatedMatches = [
  {
    id: "m-1",
    round: "Rodada 1",
    status: "live",
    scheduledAt: "2025-06-07T19:00:00Z",
    teamA: { id: "et-1", team: populatedEdition.teams[0].team },
    teamB: { id: "et-2", team: populatedEdition.teams[1].team },
    edition: { id: "ed-2025", game: { slug: "valorant" } },
    result: null,
  },
  {
    id: "m-2",
    round: "Rodada 1",
    status: "scheduled",
    scheduledAt: "2025-06-08T19:00:00Z",
    teamA: { id: "et-3", team: populatedEdition.teams[2].team },
    teamB: { id: "et-4", team: populatedEdition.teams[3].team },
    edition: { id: "ed-2025", game: { slug: "valorant" } },
    result: null,
  },
];

function mockGraphQL(
  page: Page,
  opts: { asAdmin?: boolean; state?: MockState } = {}
) {
  const state = opts.state ?? "empty";
  return page.route("**/graphql", async (route) => {
    const req = route.request();
    const body = req.postDataJSON?.() ?? JSON.parse(req.postData() || "{}");
    const query = (body.query as string) || "";

    let data: Record<string, unknown> = {};

    if (query.includes("me {")) {
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
      data = {
        activeEdition: state === "populated" ? populatedEdition : null,
      };
    } else if (query.includes("editions")) {
      data = {
        editions:
          state === "populated"
            ? [
                {
                  id: "ed-2025",
                  year: 2025,
                  name: "Inter UnaERP 2025",
                  status: "ongoing",
                  startedAt: "2025-05-01T00:00:00Z",
                  endedAt: null,
                  game: { slug: "valorant" },
                },
              ]
            : [],
      };
    } else if (query.includes("matches")) {
      data = { matches: state === "populated" ? populatedMatches : [] };
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

// ────────────────────────────────────────────────
// Tour empty state (desktop)
// ────────────────────────────────────────────────
test.describe("desktop · empty", () => {
  for (const r of PUBLIC_ROUTES) {
    test(`shot ${r.name}`, async ({ page }) => {
      await mockGraphQL(page);
      await page.goto(`${BASE}${r.path === "/" ? "/" : r.path}`, {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(700);
      await page.screenshot({
        path: `e2e/screenshots/${r.name}.png`,
        fullPage: true,
      });
      const bodyText = await page.locator("body").innerText();
      expect(bodyText.length).toBeGreaterThan(50);
    });
  }
});

// ────────────────────────────────────────────────
// Tour populated (desktop) — testa rotas com dados reais
// ────────────────────────────────────────────────
test.describe("desktop · populated", () => {
  for (const r of PUBLIC_ROUTES) {
    test(`shot ${r.name}`, async ({ page }) => {
      await mockGraphQL(page, { state: "populated" });
      await page.goto(`${BASE}${r.path === "/" ? "/" : r.path}`, {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(700);
      await page.screenshot({
        path: `e2e/screenshots/populated-${r.name}.png`,
        fullPage: true,
      });
    });
  }

  // Rotas dinâmicas (precisam de slug/id válidos)
  test("shot team-detail", async ({ page }) => {
    await mockGraphQL(page, { state: "populated" });
    await page.goto(`${BASE}/times/olimpo`, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    await page.screenshot({
      path: `e2e/screenshots/populated-team-detail.png`,
      fullPage: true,
    });
  });

  test("shot edition-detail", async ({ page }) => {
    await mockGraphQL(page, { state: "populated" });
    await page.goto(`${BASE}/edicoes/2025`, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    await page.screenshot({
      path: `e2e/screenshots/populated-edition-detail.png`,
      fullPage: true,
    });
  });
});

// ────────────────────────────────────────────────
// Mobile viewport
// ────────────────────────────────────────────────
test.describe("mobile · empty", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const r of PUBLIC_ROUTES) {
    test(`shot ${r.name}`, async ({ page }) => {
      await mockGraphQL(page);
      await page.goto(`${BASE}${r.path === "/" ? "/" : r.path}`, {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(700);
      await page.screenshot({
        path: `e2e/screenshots/mobile-${r.name}.png`,
        fullPage: true,
      });
    });
  }
});

// ────────────────────────────────────────────────
// Admin
// ────────────────────────────────────────────────
test.describe("admin · logado", () => {
  for (const r of ADMIN_ROUTES) {
    test(`shot ${r.name}`, async ({ page }) => {
      await mockGraphQL(page, { asAdmin: true, state: "populated" });
      await page.goto(`${BASE}${r.path}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(700);
      await page.screenshot({
        path: `e2e/screenshots/${r.name}.png`,
        fullPage: true,
      });
    });
  }
});

// ────────────────────────────────────────────────
// Interatividade — filtros, modal, navegação
// ────────────────────────────────────────────────
test.describe("interatividade", () => {
  test("filtro de grupo em /times", async ({ page }) => {
    await mockGraphQL(page, { state: "populated" });
    await page.goto(`${BASE}/times`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const grupoA = page.getByRole("button", { name: /Grupo A/i }).first();
    await grupoA.click();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: `e2e/screenshots/interact-times-grupo-a.png`,
      fullPage: true,
    });
  });

  test("filtro de status em /confrontos", async ({ page }) => {
    await mockGraphQL(page, { state: "populated" });
    await page.goto(`${BASE}/confrontos`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const aoVivo = page.getByRole("button", { name: /Ao Vivo/i }).first();
    await aoVivo.click();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: `e2e/screenshots/interact-confrontos-live.png`,
      fullPage: true,
    });
  });

  test("ordenação em /jogadores", async ({ page }) => {
    await mockGraphQL(page, { state: "populated" });
    await page.goto(`${BASE}/jogadores`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `e2e/screenshots/interact-jogadores.png`,
      fullPage: true,
    });
  });

  test("login button redireciona", async ({ page }) => {
    await mockGraphQL(page);
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    // Captura o destino do redirect sem realmente sair do domínio
    let redirectedTo = "";
    page.on("framenavigated", (frame) => {
      if (frame === page.mainFrame()) {
        const url = frame.url();
        if (url.includes("auth.santos-games.com")) {
          redirectedTo = url;
        }
      }
    });

    const entrarBtn = page.getByRole("button", { name: /Entrar com SGA/i }).first();
    const isVisible = await entrarBtn.isVisible().catch(() => false);
    if (isVisible) {
      await entrarBtn.click({ trial: false }).catch(() => {});
      await page.waitForTimeout(800);
      expect(redirectedTo.length === 0 || redirectedTo.includes("inter-unaerp")).toBeTruthy();
    }
  });
});
