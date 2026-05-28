# Inter UnaERP · Web

Frontend do ecossistema Inter UnaERP — React 19 + Vite + TanStack Router + Tailwind + Apollo Client.

## Stack

- **React 19** + **Vite 6** + **TypeScript 5.7**
- **TanStack Router** (file-based, autoCodeSplitting)
- **TanStack Query** + **Apollo Client** (GraphQL contra `api/`)
- **Tailwind 3.4** com tokens UnaERP
- **Barlow Condensed** + **Inter** (Google Fonts)
- **framer-motion** + **Phosphor Icons** + **shadcn/ui** + **Radix UI**
- **Bun** como runtime e package manager

## Identidade visual

Estilo "Light SGA" — fundo claro com tipografia condensada italic gigante, cantos pontiagudos, brutal shadows com offset duro. Paleta oficial UnaERP:

```
azul       #0073B7   primário
teal       #2EAA80   secundário
lime       #A4CD3A   destaque / ação
navy       #0A1A3D   texto, fundo admin
```

## Setup

```bash
bun install
cp .env.example .env
# edite VITE_GRAPHQL_URL apontando para a API rodando
bun run dev
```

Servidor de dev em `http://localhost:5173`.

## Rotas

### Públicas

| Rota | O que mostra |
|---|---|
| `/` | Hero, live match, bracket progress, standings, podium top 3, highlights |
| `/times` | Grid 3-col de times com filtro por grupo |
| `/times/$slug` | Hero do time, roster, partidas recentes, achievements, mapas |
| `/jogadores` | Pódio top 3 + tabela ordenável (K/D, Frags, ACS, HS%, FB) |
| `/jogadores/$id` | Stats do jogador, time atual, role |
| `/confrontos` | Tabs Live/Próximas/Disputadas, agrupado por dia |
| `/confrontos/$id` | Scoreboard 144px, highlights da partida |
| `/classificacao` | Tabela completa + stats da edição + tabela por grupo |
| `/highlights` | Featured + grid 4-col + filtros por categoria/time |
| `/galeria` | Álbuns recentes + masonry de fotos |
| `/edicoes` | Edição atual + timeline histórica |
| `/edicoes/$year` | Edição específica com campeão e roster |
| `/entrar` | Redirect para auth SGA (cookie `sg_auth`) |

### Admin

| Rota | O que faz |
|---|---|
| `/admin` | Dashboard com KPIs, partidas, A fazer, atividade, health check |
| `/admin/edicoes` | Cards de edições com stats |
| `/admin/times` | CRUD de times |
| `/admin/jogadores` | CRUD de jogadores filtravel por time |
| `/admin/confrontos` | CRUD de partidas + registrar resultado |
| `/admin/midia` | Drop zone para upload R2 + pastas + storage stats |
| `/admin/highlights` | CRUD de highlights ligados ao Cloudflare Stream |
| `/admin/importar` | Import em massa de edições históricas via JSON |

Layout admin tem sidebar navy com lime accent (não o top nav público).

## Scripts

```bash
bun run dev       # vite dev server
bun run build     # tsc -b && vite build → dist/
bun run preview   # serve dist/ em :4173
bun run lint      # eslint
```

## Variáveis de ambiente

| Var | Default | Descrição |
|---|---|---|
| `VITE_GRAPHQL_URL` | `http://localhost:8080/graphql` | Endpoint da API Go |
| `VITE_SGA_AUTH_URL` | `https://santos-games.com/login` | Portal de auth da SGA |

## Deploy

Multi-stage Dockerfile com **Bun** (build) → **Nginx** (runtime).

```bash
docker build \
  --build-arg VITE_GRAPHQL_URL=https://api.inter-unaerp.com/graphql \
  --build-arg VITE_SGA_AUTH_URL=https://santos-games.com/login \
  -t inter-unaerp-web .

docker run -p 8080:80 inter-unaerp-web
```

`nginx.conf` cuida do SPA fallback (`try_files $uri /index.html`), gzip de assets, cache de longo prazo para `/assets/*` (vite gera hash), e headers de segurança.

No Easypanel: builda direto pela aba "Build" passando as build args. O serviço escuta na porta 80.

## Estrutura

```
src/
├── main.tsx                    # entrypoint: Apollo + Query + Router
├── routeTree.gen.ts            # gerado pelo plugin do TanStack
├── data/
│   ├── types.ts                # Team, Player, Match, Highlight, Edition
│   └── mock.ts                 # fixtures realistas pra dev sem API
├── lib/
│   ├── apollo.ts               # Apollo Client wired com sg_auth cookie
│   ├── graphql/queries.ts      # fragments + queries + mutations
│   └── utils.ts                # cn() helper
├── components/
│   ├── layout/                 # Nav, Footer, Brand, PageHeader
│   ├── admin/                  # AdminSidebar, AdminTopbar, DataTable, RowActions
│   ├── home/                   # Hero, LiveMatchFeature, BracketProgress
│   ├── cards/                  # MatchCard, HighlightCard, TeamCard, StandingsTable, PlayerPodium
│   └── ui/                     # Button, Card, Section, TeamLogo, LiveDot, FilterPill
├── routes/                     # file-based, TanStack
└── styles/globals.css          # tokens + Tailwind base
```

## Próximos passos

- [ ] Substituir `import { ... } from "@/data/mock"` por `useQuery(GET_X)` quando a API estiver no ar
- [ ] Apollo cache strategies (lista vs detalhe)
- [ ] Skeleton loaders por rota
- [ ] DataLoader no backend pra resolver N+1 nas rotas com sub-resolvers
- [ ] Mobile: hamburger menu na Nav (atualmente 8 links flat)
- [ ] OG images dinâmicas por edição/time/jogador

## Powered by

Santos Games Arena · Inter UnaERP 2025
