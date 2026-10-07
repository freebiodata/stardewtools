# StardewTools — Free Stardew Valley Profit Calculators

A cozy, light-themed static Astro site with 3 free browser-based calculators for Stardew Valley farmers:

| Tool | URL | What it does |
|---|---|---|
| Crop Profit Calculator | `/crop-profit-calculator/` | Gold per day for any crop — raw, keg or jar — with replanting-aware harvest counts |
| Best Crop Finder | `/best-crop-calculator/` | Every crop ranked by gold/day for the days you actually have left |
| Keg & Jar Planner | `/keg-calculator/` | Processing throughput: batches, capacity, machines needed, payout |

Plus support pages: home, all-tools hub, guide (gold per day), about, methodology, contact, changelog, HTML sitemap, privacy, terms, 404.

## Data provenance

Crop prices, growth times, artisan multipliers and processing times are compiled from stardewvalleywiki.com (fetched 2026-10-08) — the full source trail with per-value citations lives in `research/batch3/worker-stardew-data.md` (workspace). The site's copy of the dataset is `src/data/crops.ts`.

**Not affiliated with ConcernedApe** (stated on site).

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output to dist/
npm run preview    # serve the build locally
```

Node 22+ required. No environment variables, no backend, no database.

## Verification

```bash
node scripts/test-math.mjs   # 30 tests (harvests, replanting, artisan rules, quality, profession math)
node scripts/test-dom.mjs    # 14 DOM tests (loads built pages in jsdom, runs the tools)
```

Both must pass before deploy. The DOM tests execute the actual bundled scripts (e.g. starfruit day-1 = 25g/day raw, 132g/day kegged).

## Design notes

This site deliberately uses a **distinct visual identity** from the publisher's other tool sites: warm light theme (cream paper, crop greens, harvest gold), rounded cozy cards, serif-ish display type. Set in `src/styles/global.css`.

## Project structure

```
src/
├── data/
│   ├── crops.ts         # Verified crop dataset (wiki-sourced, with notes)
│   └── site.ts          # Site metadata
├── lib/profit.ts        # Profit math (mirrors scripts/test-math.mjs)
├── layouts/Base.astro   # SEO head: title, meta, canonical, OG, JSON-LD
├── components/          # Header, Footer, Breadcrumbs, Faq, ToolCard, TrustBlock
├── styles/global.css    # Cozy theme design system
└── pages/               # One directory per route
public/                  # robots.txt, favicon.svg, og-default.png, logo-512.png
scripts/
├── test-math.mjs
├── test-dom.mjs
└── gen-assets.py        # Regenerates OG/logo/favicon
```

## Editing guide

- **Add a crop**: append to `src/data/crops.ts` (verify against the wiki first; note the source in the worker file).
- **Change copy**: each page's text lives in its own `src/pages/<tool>/index.astro`.
- **Change colors**: `src/styles/global.css` variables at `:root`.
- **Recompute examples**: `node scripts/test-math.mjs` — never hand-wave numbers.
- **Domain change**: `src/data/site.ts` + `astro.config.mjs` + `public/robots.txt`.

## Deploy (Cloudflare Pages)

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(empty)* |
| Node version | 22+ (`NODE_VERSION=22` if needed) |

After deploy: add custom domain `stardewtools.top`, submit `sitemap-index.xml` to Search Console + Bing.

## Accuracy policy

- Game values trace to wiki tables (compile notes in research/batch3); changes ship with changelog entries.
- Model assumptions (replanting behavior, batch timing) are documented on the methodology page.
- Randomness (quality rolls, extra yields) is documented with averages where the wiki provides them, never invented.
