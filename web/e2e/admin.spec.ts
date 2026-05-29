import { test, expect, type Page } from "@playwright/test";

const BASE = process.env.E2E_BASE_PATH ?? "";

// ─────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────
const ADMIN_USER = {
  userId: 1,
  email: "mizakesgschool@gmail.com",
  login: "mizake",
  role: 1,
};

const NON_ADMIN_USER = {
  userId: 2,
  email: "player@example.com",
  login: "player",
  role: 2,
};

const t = (id: string, name: string, slug: string, color: string) => ({
  __typename: "Team",
  id,
  name,
  slug,
  primaryColor: color,
  logoUrl: null,
});
const TEAMS = [
  t("t-1", "Olimpo", "olimpo", "#0073B7"),
  t("t-2", "Thunder", "thunder", "#A4CD3A"),
  t("t-3", "Dragon", "dragon", "#EC4899"),
];
const editionTeam = (id: string, wins: number, losses: number, team: typeof TEAMS[0]) => ({
  __typename: "EditionTeam",
  id,
  wins,
  losses,
  finalPlacement: null,
  team,
});
const SAMPLE_EDITION = {
  __typename: "Edition",
  id: "ed-2025",
  year: 2025,
  name: "Inter UnaERP 2025",
  status: "ongoing",
  startedAt: "2025-05-01T00:00:00Z",
  endedAt: null,
  teams: [
    editionTeam("et-1", 5, 1, TEAMS[0]),
    editionTeam("et-2", 4, 2, TEAMS[1]),
    editionTeam("et-3", 2, 4, TEAMS[2]),
  ],
};

const matchTeam = (id: string, team: typeof TEAMS[0]) => ({
  __typename: "EditionTeam",
  id,
  team,
});

const SAMPLE_MATCHES = [
  {
    __typename: "Match",
    id: "m-1",
    round: "Rodada 1",
    status: "live",
    scheduledAt: "2025-06-07T19:00:00Z",
    teamA: matchTeam("et-1", TEAMS[0]),
    teamB: matchTeam("et-2", TEAMS[1]),
    edition: { __typename: "Edition", id: "ed-2025", game: { __typename: "Game", slug: "valorant" } },
    result: null,
  },
  {
    __typename: "Match",
    id: "m-2",
    round: "Rodada 1",
    status: "scheduled",
    scheduledAt: "2025-06-08T19:00:00Z",
    teamA: matchTeam("et-2", TEAMS[1]),
    teamB: matchTeam("et-3", TEAMS[2]),
    edition: { __typename: "Edition", id: "ed-2025", game: { __typename: "Game", slug: "valorant" } },
    result: null,
  },
  {
    __typename: "Match",
    id: "m-3",
    round: "Rodada 1",
    status: "done",
    scheduledAt: "2025-06-01T19:00:00Z",
    teamA: matchTeam("et-1", TEAMS[0]),
    teamB: matchTeam("et-3", TEAMS[2]),
    edition: { __typename: "Edition", id: "ed-2025", game: { __typename: "Game", slug: "valorant" } },
    result: {
      __typename: "MatchResult",
      id: "r-1",
      map: "Ascent",
      scoreA: 13,
      scoreB: 7,
      playedAt: "2025-06-01T20:30:00Z",
      winner: matchTeam("et-1", TEAMS[0]),
    },
  },
];

// ─────────────────────────────────────────────────────────────
// Mock GraphQL helper
// ─────────────────────────────────────────────────────────────
type MockOpts = {
  user?: typeof ADMIN_USER | typeof NON_ADMIN_USER | null;
  populated?: boolean;
  onMutation?: (operation: string, vars: Record<string, unknown>) => void;
};

function mockGraphQL(page: Page, opts: MockOpts = {}) {
  const populated = opts.populated ?? true;
  // null explícito = sem login. undefined = default admin.
  const user = "user" in opts ? opts.user : ADMIN_USER;

  return page.route("**/graphql", async (route) => {
    const req = route.request();
    const body = req.postDataJSON?.() ?? JSON.parse(req.postData() || "{}");
    const query = (body.query as string) || "";
    const vars = (body.variables as Record<string, unknown>) || {};

    let data: Record<string, unknown> = {};

    // Mutations
    if (query.startsWith("mutation") || query.includes("createTeam") || query.includes("createPlayer")) {
      const opName =
        query.match(/mutation\s+(\w+)/)?.[1] ??
        query.match(/(\w+)\s*\(/)?.[1] ??
        "unknown";
      opts.onMutation?.(opName, vars);
      // Devolve um team mock como se tivesse criado
      data = {
        createTeam: {
          id: "new-team-id",
          name: vars.name ?? "Novo Time",
          slug: vars.slug ?? "novo-time",
          primaryColor: vars.primaryColor ?? "#0073B7",
        },
      };
    } else if (query.includes("me {")) {
      data = { me: user };
    } else if (query.includes("games")) {
      data = { games: [{ id: "1", slug: "valorant" }] };
    } else if (query.includes("activeEdition")) {
      data = { activeEdition: populated ? SAMPLE_EDITION : null };
    } else if (query.includes("editions")) {
      data = {
        editions: populated
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
              {
                id: "ed-2024",
                year: 2024,
                name: "Inter UnaERP 2024",
                status: "finished",
                startedAt: "2024-05-01T00:00:00Z",
                endedAt: "2024-07-01T00:00:00Z",
                game: { slug: "valorant" },
              },
            ]
          : [],
      };
    } else if (query.includes("matches")) {
      data = { matches: populated ? SAMPLE_MATCHES : [] };
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

// ─────────────────────────────────────────────────────────────
// 1. Acesso e Guards
// ─────────────────────────────────────────────────────────────
test.describe("admin · controle de acesso", () => {
  test("sem login redireciona pro auth", async ({ page }) => {
    await mockGraphQL(page, { user: null, populated: false });

    let redirectedToAuth = false;
    page.on("framenavigated", (frame) => {
      if (frame === page.mainFrame() && frame.url().includes("auth.santos-games.com")) {
        redirectedToAuth = true;
      }
    });

    await page.goto(`${BASE}/admin`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: "e2e/screenshots/admin-flow-no-login.png",
      fullPage: true,
    });

    // O texto "Redirecionando para o portal SGA…" deve estar visível
    const txt = await page.locator("body").innerText();
    expect(txt).toMatch(/redirecionando|entrar/i);
  });

  test("logado mas não-admin vê 'Acesso negado'", async ({ page }) => {
    await mockGraphQL(page, { user: NON_ADMIN_USER });
    await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: "e2e/screenshots/admin-flow-denied.png",
      fullPage: true,
    });

    await expect(page.getByText(/acesso negado/i)).toBeVisible();
  });

  test("admin vê dashboard com KPIs", async ({ page }) => {
    await mockGraphQL(page);
    await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);

    // KPIs visíveis
    await expect(page.getByText(/Times confirmados/i)).toBeVisible();
    await expect(page.getByText(/Partidas jogadas/i)).toBeVisible();

    await page.screenshot({
      path: "e2e/screenshots/admin-flow-dashboard.png",
      fullPage: true,
    });
  });
});

// ─────────────────────────────────────────────────────────────
// 2. Navegação sidebar
// ─────────────────────────────────────────────────────────────
test.describe("admin · navegação sidebar", () => {
  test("clica em cada item da sidebar e screenshot", async ({ page }) => {
    await mockGraphQL(page);
    await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const sections = [
      { label: "Times", file: "admin-nav-times" },
      { label: "Jogadores", file: "admin-nav-jogadores" },
      { label: "Confrontos", file: "admin-nav-confrontos" },
      { label: "Edições", file: "admin-nav-edicoes" },
      { label: "Mídia", file: "admin-nav-midia" },
      { label: "Highlights", file: "admin-nav-highlights" },
      { label: "Importar", file: "admin-nav-importar" },
      { label: "Dashboard", file: "admin-nav-dashboard" },
    ];

    for (const s of sections) {
      const link = page
        .locator("aside, nav")
        .getByRole("link", { name: new RegExp(s.label, "i") })
        .first();
      const visible = await link.isVisible().catch(() => false);
      if (visible) {
        await link.click();
        await page.waitForTimeout(500);
        await page.screenshot({
          path: `e2e/screenshots/${s.file}.png`,
          fullPage: true,
        });
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────
// 3. Times — formulário de criação
// ─────────────────────────────────────────────────────────────
test.describe("admin · /admin/times CRUD", () => {
  test("abre formulário 'Novo time'", async ({ page }) => {
    await mockGraphQL(page);
    await page.goto(`${BASE}/admin/times`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    await page.getByRole("button", { name: /Novo time/i }).first().click();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: "e2e/screenshots/admin-times-new-form.png",
      fullPage: true,
    });
    await expect(page.getByText(/Payload|Novo time|Nome/i).first()).toBeVisible();
  });

  test("preenche e submete formulário (mutation mockada)", async ({ page }) => {
    let mutationCalled = false;
    let mutationVars: Record<string, unknown> = {};

    await mockGraphQL(page, {
      onMutation: (op, vars) => {
        if (op === "CreateTeam" || op === "createTeam") {
          mutationCalled = true;
          mutationVars = vars;
        }
      },
    });

    await page.goto(`${BASE}/admin/times`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.getByRole("button", { name: /Novo time/i }).first().click();
    await page.waitForTimeout(400);

    // Preencher os campos — Nome (placeholder "Olimpo" — case-sensitive pra distinguir do slug "olimpo")
    await page.getByPlaceholder("Olimpo", { exact: true }).fill("Phoenix");
    await page.waitForTimeout(200);

    await page.screenshot({
      path: "e2e/screenshots/admin-times-filled.png",
      fullPage: true,
    });

    // Submit
    const submit = page.getByRole("button", { name: /Criar time/i }).first();
    await submit.click();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: "e2e/screenshots/admin-times-submitted.png",
      fullPage: true,
    });

    expect(mutationCalled).toBeTruthy();
    expect(mutationVars.name).toBe("Phoenix");
  });
});

// ─────────────────────────────────────────────────────────────
// 4. Confrontos — filtros admin
// ─────────────────────────────────────────────────────────────
test.describe("admin · /admin/confrontos filtros", () => {
  test("filtra por 'Encerradas'", async ({ page }) => {
    await mockGraphQL(page);
    await page.goto(`${BASE}/admin/confrontos`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const encerradas = page.getByRole("button", { name: /Encerradas/i }).first();
    if (await encerradas.isVisible().catch(() => false)) {
      await encerradas.click();
      await page.waitForTimeout(400);
      await page.screenshot({
        path: "e2e/screenshots/admin-confrontos-done.png",
        fullPage: true,
      });
    }
  });

  test("filtra por 'Ao vivo'", async ({ page }) => {
    await mockGraphQL(page);
    await page.goto(`${BASE}/admin/confrontos`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const live = page.getByRole("button", { name: /Ao vivo/i }).first();
    if (await live.isVisible().catch(() => false)) {
      await live.click();
      await page.waitForTimeout(400);
      await page.screenshot({
        path: "e2e/screenshots/admin-confrontos-live.png",
        fullPage: true,
      });
    }
  });
});

// ─────────────────────────────────────────────────────────────
// 5. Importar — validação de payload JSON
// ─────────────────────────────────────────────────────────────
test.describe("admin · /admin/importar", () => {
  test("carrega exemplo e valida", async ({ page }) => {
    await mockGraphQL(page);
    await page.goto(`${BASE}/admin/importar`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    await page.getByRole("button", { name: /Carregar exemplo/i }).first().click();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: "e2e/screenshots/admin-importar-loaded.png",
      fullPage: true,
    });

    await page.getByRole("button", { name: /^Validar$/i }).first().click();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: "e2e/screenshots/admin-importar-valid.png",
      fullPage: true,
    });

    await expect(page.getByText(/Payload válido/i)).toBeVisible();
  });

  test("JSON inválido mostra erro", async ({ page }) => {
    await mockGraphQL(page);
    await page.goto(`${BASE}/admin/importar`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    await page.getByPlaceholder(/Cole aqui/i).fill("{ invalido");
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: /^Validar$/i }).first().click();
    await page.waitForTimeout(400);

    await page.screenshot({
      path: "e2e/screenshots/admin-importar-error.png",
      fullPage: true,
    });
    await expect(page.getByText(/Erro de validação/i)).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────
// 6. Search / Command Palette
// ─────────────────────────────────────────────────────────────
test.describe("admin · command palette (Ctrl+K)", () => {
  test("abre palette com atalho", async ({ page }) => {
    await mockGraphQL(page);
    await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    await page.keyboard.press("Control+k");
    await page.waitForTimeout(300);
    await page.screenshot({
      path: "e2e/screenshots/admin-palette-open.png",
      fullPage: true,
    });
  });
});

// ─────────────────────────────────────────────────────────────
// 7. Mobile admin
// ─────────────────────────────────────────────────────────────
test.describe("admin · mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("dashboard mobile", async ({ page }) => {
    await mockGraphQL(page);
    await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: "e2e/screenshots/admin-mobile-dashboard.png",
      fullPage: true,
    });
  });

  test("times mobile", async ({ page }) => {
    await mockGraphQL(page);
    await page.goto(`${BASE}/admin/times`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: "e2e/screenshots/admin-mobile-times.png",
      fullPage: true,
    });
  });
});
