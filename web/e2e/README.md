# E2E tests · Playwright

Smoke tests dos golden paths da app.

## Rodar localmente

```bash
# instala os browsers do playwright (1x)
npx playwright install chromium webkit

# roda todos os testes
bun run test:e2e

# modo interativo (UI mode)
bun run test:e2e:ui

# só um arquivo
bun run test:e2e e2e/home.spec.ts
```

O config inicia automaticamente `bun run preview` na porta 4173 com o build de produção. Set `E2E_BASE_URL` para apontar pra outro host.

## Cobertura

- `home.spec.ts` — hero, stats, CTAs, theme toggle persistente
- `navigation.spec.ts` — todas as 9 rotas públicas + 404 + admin guard
- `highlight-modal.spec.ts` — modal de highlight + lightbox de foto + ESC

## Projetos

| Projeto | Device |
|---|---|
| `chromium` | Desktop Chrome 1920×1080 |
| `mobile-safari` | iPhone 13 |

CI roda com `--workers=1` + `retries=2` + reporter `github`.
