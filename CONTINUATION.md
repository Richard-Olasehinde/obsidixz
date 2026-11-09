# CONTINUATION — Obsidixz parent website

Everything needed to pick this up in a fresh conversation or on another machine.

## 1. Where things stand (read this first)

- The six pages, 404, navigation, contact routing and policies are **implemented and tested**.
- The production build in `dist/` passes `npm run verify` and the rendered suites.
- Screenshots of the actual rendered build are in `verification/screenshots/`.
- **Not done:** deployment to GitHub Pages, domain/DNS configuration, live HTTPS verification, and
  founder visual approval. See `PROJECT_STATUS.md` §"Delivery status".
- **Environment limit:** this build ran in a sandbox whose egress allows only GitHub, npm and PyPI.
  The live business sites and the Obsidixz domains could not be opened; reference review used the
  cloned repositories and their stored screenshots. Do not claim a live visual comparison.

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

**No system browser (this sandbox):** `@sparticuz/chromium` is a devDependency and provides a
self-contained binary that needs `libnspr4`, `libnss3` and `libnssutil3`. This workspace has none, so
NSPR/NSS were built from Mozilla sources:

```bash
cd /tmp && rm -rf nssbuild && mkdir nssbuild && cd nssbuild
curl -sL https://codeload.github.com/mozilla/nspr/tar.gz/refs/heads/NSPR_4_39_BRANCH -o nspr.tar.gz
mkdir nspr-src && tar -xzf nspr.tar.gz -C nspr-src --strip-components=1
curl -sL https://codeload.github.com/mozilla/nss/tar.gz/refs/heads/NSS_3_133_BRANCH -o nss.tar.gz
mkdir nss-src && tar -xzf nss.tar.gz -C nss-src --strip-components=1

cd nspr-src
./configure --prefix=/tmp/nssbuild/nspr-install --disable-debug --enable-optimize --enable-64bit
make -j4 && make install

cd ../nss-src
python3 -m venv /tmp/nssbuild/pyenv && /tmp/nssbuild/pyenv/bin/pip install -q ninja gyp-next
PATH=/tmp/nssbuild/pyenv/bin:$PATH ./build.sh --gcc --opt -j 4 --disable-tests \
  --with-nspr=/tmp/nssbuild/nspr-install/include/nspr:/tmp/nssbuild/nspr-install/lib
# The NSS build stops while compiling cmd/ (no zlib headers). The libraries this needs
# are produced before that point — libnss3, libnssutil3, libssl3, libfreebl3.

# then, per run:
export LD_LIBRARY_PATH=/tmp/nssbuild/nspr-install/lib:/tmp/nssbuild/dist/Release/lib
BASE_URL=http://127.0.0.1:4321 node scripts/rendered-checks.mjs all
```

Modes: `check` (routes × 5 widths + expected 404), `interact` (menu, keyboard, clipboard
success/denial/legacy), `nojs`, `zoom` (200% root font-size — a text-size simulation, **not** real
browser zoom), `shots`, `all`.

## 4. Known constraints

- **Astro 6, not 7.** Astro 7 needs Node ≥ 22.23.4; the build machine had 22.22.3. Vite is pinned to
  `^7` with an override because a transitive dependency otherwise hoists Vite 8.
- **Commercial links use HTTP.** Its HTTPS certificate was pending at the 2026-11-09 handoff and
  could not be re-checked from the sandbox. The site says so plainly. Switch in one place —
  see `DEPLOYMENT.md` §5.
- **No analytics, forms, cookies or third-party embeds.** Keep it that way unless the privacy notice
  is updated at the same time.

## 5. What remains (in order)

1. **Founder:** inspect the existing `obsidixz.pp.ua` DNS zone and record it before editing
   (`DEPLOYMENT.md` §3).
2. **Founder:** add apex A/AAAA records; do not touch MX/TXT or the business subdomains.
3. **Founder:** Settings → Pages → Source "GitHub Actions", Custom domain `obsidixz.pp.ua`.
4. **Founder:** merge to `main` to trigger the first deploy; enable "Enforce HTTPS" once the
   certificate is issued.
5. **Founder:** run the live checks in `DEPLOYMENT.md` §4 and record them in `PROJECT_STATUS.md`.
6. **Founder:** visual approval (screenshots are evidence, not approval).
7. **Whoever continues:** switch the Commercial destination to HTTPS once verified (`DEPLOYMENT.md`
   §5), and set a retention period for the parent inbox, then update `/privacy/`.

## 6. Things not to do

- Do not push to `main` from this branch's tooling; deployment is a founder action.
- Do not add a Game Studio website, launch date, countdown, store link or test invitation. The studio
  work stays deferred until Word Quest completes closed testing; the parent site keeps one brief
  entry.
- Do not modify `obsidixz-estate` or `obsidixz-commercial`, their deployments or their DNS.
- Do not invent legal entities, founding dates, clients, awards, revenue or an office.
- Do not replace the supplied logo artwork with re-typed text or a redrawn emblem.

- Rendered checks read computed styles in no-JS mode: they now call `waitForStyles()` first, because
  `domcontentloaded` does not wait for CSS and the hamburger's hidden state is a CSS rule. If you add a
  new assertion that depends on styling, wait for stylesheets the same way.
