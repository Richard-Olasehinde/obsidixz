# Obsidixz — parent-brand website

The official parent-brand website for **Obsidixz**, the organisation behind Obsidixz Real
Estate, Obsidixz Commercial and Obsidixz Game Studio.

Production target: **https://obsidixz.pp.ua/** (GitHub Pages, static).

The site explains what Obsidixz is, introduces its businesses accurately, routes visitors to the
right business site or inbox, and provides one clear general contact route. It is a static,
six-page site plus a branded 404 — no server, no database, no forms, no analytics.

## Stack

| Choice | Why |
| --- | --- |
| [Astro](https://astro.build) 6.4.8, static output | Six pages of reusable templates, zero client framework, tiny JS payload |
| Plain CSS (`src/styles/global.css`) | Full control of spacing/typography, no utility-layer indirection, no build plugin |
| Self-hosted fonts via `@fontsource` (Montserrat 600/700, Open Sans 400/600) | No third-party font CDN or request to Google |
| `astro:assets` + Sharp | Build-time WebP variants with reserved dimensions and real `srcset` |
| ~4 kB of inline/bundled JS | Menu behaviour + copy button only; every page works without it |

No environment variables, no secrets, no API keys. `mailto:` links only — the site never sends,
stores or forwards an enquiry.

## Commands

```bash
npm ci                 # install exact dependency versions
npm run dev            # local dev server → http://localhost:4321
npm run build          # static production build → dist/
npm run preview        # serve dist/ → http://localhost:4321
npm run check          # astro check (TypeScript/Svelte-style diagnostics)
npm run verify         # structural checks on dist/ (no browser needed)
npm run assets         # regenerate favicon set + social image from brand artwork
```

Rendered-browser checks (see `CONTINUATION.md` for the sandbox browser note):

```bash
npm run preview -- --port 4321          # terminal 1
npm run test:render                     # 6 routes × 320/390/768/1024/1440 + expected 404
npm run test:interact                   # menu, keyboard, clipboard success/denial/legacy
npm run test:nojs                       # JavaScript disabled behaviour
npm run shoot                           # screenshots → verification/screenshots/
```

`BASE_URL` overrides the target origin; `CHROME_PATH` points the harness at a system Chromium.
Without `CHROME_PATH` it uses the packaged `@sparticuz/chromium` binary.

## Structure

```
src/
  data/site.ts           ← single source of truth: identity, businesses, emails, nav
  layouts/BaseLayout.astro
  components/brand|layout|sections|ui/
  pages/                 ← /, /about/, /businesses/, /contact/, /privacy/, /terms/, 404
  styles/global.css      ← design tokens + components
  assets/images/         ← three generated photographs in use (see IMAGE_SOURCES.md)
public/                  ← brand artwork, favicons, robots.txt, social image, CNAME
scripts/                 ← verify.mjs, rendered-checks.mjs, build-assets.mjs
verification/screenshots ← rendered evidence
```

## Content rules for future edits

- `src/data/site.ts` holds every business name, description, destination and address. Change it
  there, not in templates.
- Approved parent statements (description, mission, vision, values) are quoted from the identity
  guidelines. Do not extend them into claims about scale, clients, awards or legal structure.
- The website does not invent: a founding date, name origin, employees, offices, clients,
  partnerships, revenue, or a registered company. Keep it that way.
- Game Studio is deliberately brief. Its website is deferred until Word Quest launches; do not add a
  launch date, countdown, store link or test invitation.

## Documentation

| File | Purpose |
| --- | --- |
| `PROJECT_STATUS.md` | Authoritative current status, test results, open actions |
| `DECISION_LOG.md` | Decisions and rationale, with dates |
| `PROJECT_STRUCTURE.md` | File-by-file map |
| `DEPLOYMENT.md` | GitHub Pages, custom domain and DNS instructions |
| `IMAGE_SOURCES.md` | Image/font provenance and the actual basis for use |
| `CONTINUATION.md` | How to pick this up in a fresh session |

## Use

Code and site content belong to the Obsidixz brand owner. The Obsidixz logo artwork is used
exactly as supplied. Generated photography is original to this project; provenance is recorded in
`IMAGE_SOURCES.md`. Do not redistribute brand assets without permission.
