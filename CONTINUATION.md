# CONTINUATION — Obsidixz parent website

Everything needed to pick this up in a fresh conversation or on another machine.

## 1. Where things stand (read this first)

- The six pages, 404, navigation, contact routing and policies are **implemented and tested**.
- The production build in `dist/` passes `npm run verify` and the rendered suites.
- **Live:** https://obsidixz.pp.ua/ (GitHub Pages, published 2026-11-09; refined 2026-11-10).
- Screenshots of the actual rendered build are in `verification/screenshots/`; before/after captures
  for the 2026-11-10 refinement are in `verification/refinement/`.
- **Outstanding:** founder review of the refinement before it is merged, the parent-inbox retention
  decision, and the live checks in `DEPLOYMENT.md` §4 that have not been recorded yet.
- **Environment limit:** this sandbox's egress allows GitHub, npm, PyPI and DNS. Business sites and
  the Obsidixz pages cannot be opened over HTTP(S); DNS *can* be queried. TLS, redirects and live
  HTML are therefore unverified from here, and no live visual comparison is claimed.

## 2. Run it

```bash
npm ci
npm run dev            # http://localhost:4321
npm run build          # dist/
npm run preview        # serve dist/ on http://localhost:4321
npm run check          # astro check — expect 0 errors
npm run verify         # structural checks — expect "Structural verification passed."
```

## 3. Browser verification

The harness lives in `scripts/rendered-checks.mjs` and needs a Chromium binary.

**Normal machine (recommended):**

```bash
npm run preview -- --port 4321 &          # serve the production build
export CHROME_PATH=/path/to/chrome        # or chromium / Google Chrome
BASE_URL=http://127.0.0.1:4321 node scripts/rendered-checks.mjs all
```

**No system browser (this sandbox):** `@sparticuz/chromium` ships a self-contained binary that needs
`libnspr4`, `libnss3` and `libnssutil3`. Those libraries are inside the package's own
`bin/al2023.tar.br` bundle, so no NSS build is needed:

```bash
cd /path/to/repo
node -e "const z=require('node:zlib'),fs=require('node:fs');\
fs.writeFileSync('/tmp/al2023.tar', z.brotliDecompressSync(fs.readFileSync('node_modules/@sparticuz/chromium/bin/al2023.tar.br')))"
mkdir -p /tmp/al2023 && tar -xf /tmp/al2023.tar -C /tmp/al2023

npm run preview -- --port 4321 &          # serve the production build
export LD_LIBRARY_PATH=/tmp/al2023/lib
BASE_URL=http://127.0.0.1:4321 node scripts/rendered-checks.mjs all
```

The `LD_LIBRARY_PATH` export is required on every run. GitHub Actions does not need it: the CI
workflow installs the system packages with `apt-get` instead.

Modes: `check` (routes × 5 widths + expected 404), `interact` (menu, keyboard, clipboard
success/denial/legacy), `nojs`, `zoom` (200% root font-size — a text-size simulation, **not** real
browser zoom), `shots`, `all`.

## 4. Known constraints

- **Astro 6, not 7.** Astro 7 needs Node ≥ 22.23.4; the build machine had 22.22.3. Vite is pinned to
  `^7` with an override because a transitive dependency otherwise hoists Vite 8.
- **Commercial now links over HTTPS.** The switch was made on 2026-11-10 after the founder's live
  check (HTTPS 200, HTTP redirects). The sandbox cannot repeat that check, so re-verify after any
  deploy — see `DEPLOYMENT.md` §5.
- **The homepage is deliberately five sections.** Hero → short parent introduction → business
  overview → compact shared foundation → contact invitation. Facts, deliverable detail and scope
  statements belong on `/businesses/`; values explanations belong on `/about/#values`. Do not
  re-inflate the homepage with the removed research/architecture material — see `DECISION_LOG.md` §15.
- **Assertions on styling must wait for CSS.** `domcontentloaded` does not wait for stylesheets, and
  the hamburger's hidden state is a CSS rule (`html:not(.js) .menu-btn`). The no-JS mode consequently
  calls `waitForStyles()` before reading computed styles; a premature read made CI flaky. Any new
  style-dependent assertion should do the same.
- **No analytics, forms, cookies or third-party embeds.** Keep it that way unless the privacy notice
  is updated at the same time.

## 5. What remains (in order)

1. **Founder:** review the refinement branch's preview and before/after captures
   (`verification/refinement/`), then authorise the merge. Deployment runs from `main` as before.
2. **Founder:** after the refinement deploys, re-run the live checks in `DEPLOYMENT.md` §4 — branded
   404, `http://` → `https://`, `www` → apex, canonicals, sitemap — and record them here or in
   `PROJECT_STATUS.md`.
3. **Founder:** decide the parent-inbox retention period, then update `/privacy/`. Until then the
   notice says no fixed period is set.
4. **Whoever continues:** confirm the Commercial destination again after each deploy
   (`DEPLOYMENT.md` §5).

## 6. Things not to do

- Do not push to `main` from this branch's tooling; deployment is a founder action.
- Do not add a Game Studio website, launch date, countdown, store link or test invitation. The studio
  website stays deferred **until Word Quest launches** (milestone revised 2026-11-10, superseding the
  closed-testing trigger); the parent site keeps one brief entry.
- Do not modify `obsidixz-estate` or `obsidixz-commercial`, their deployments or their DNS.
- Do not invent legal entities, founding dates, clients, awards, revenue or an office.
- Do not replace the supplied logo artwork with re-typed text or a redrawn emblem.
