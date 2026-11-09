# PROJECT STATUS — Obsidixz parent website

**Date:** 2026-11-09 (UTC) · **Branch:** `arena/576f68a7-obsidixz` · **Repo:** `Richard-Olasehinde/obsidixz`
**Intended production origin:** https://obsidixz.pp.ua/
**Stack:** Astro 6.4.8 (static), plain CSS, self-hosted fonts, ~4 kB progressive-enhancement JS.

This is the single authoritative status file. Anything contradicted here is superseded.

## Stage results

| Stage | Status | Evidence |
| --- | --- | --- |
| 1. Foundation & references | **DONE** | Empty repo initialised; Astro 6.4.8 stack installed and building; brand artwork copied and hash-verified; four generated photographs; design tokens, type scale and shared layout in `src/styles/global.css` |
| 2. Homepage & navigation | **DONE** | Photographic hero, hero index, parent role + architecture, two image-led business features, Game Studio entry, dark foundation, editorial photograph, invitation, footer. Header/menu behaviour tested |
| 3. About & Our Businesses | **DONE** | Approved description/mission/vision/values; three accurate profiles with scope limits; Game Studio kept to a brief entry with no date, link or launch promise |
| 4. Contact & policies | **DONE** | Three routes + copy button, exact general `mailto:`, privacy notice and website terms written to actual configuration; no form infrastructure |
| 5. Responsive & accessibility | **DONE** | 6 routes × 320/390/768/1024/1440 px: no horizontal overflow, no console errors, no failed requests, no broken visible images; 200% root font-size clean; no-JS suite; focus/inert/Escape/focus-return suite |
| 6. SEO & production prep | **DONE** | Unique titles/descriptions, production canonicals, OG/Twitter, derived favicon set, 1200×630 social card, sitemap, robots, `/.nojekyll`, social manifest |
| 7. Rendered verification | **DONE (local)** | Screenshots in `verification/screenshots/` produced from the served **production** build by headless Chromium; each file's viewport and page are listed below |
| 8. Deployment & handover | **BLOCKED (owner access)** | Workflow and instructions ready (`DEPLOYMENT.md`); DNS/Pages settings require repository-owner access; site is **not** live from this branch |

## Delivery status — kept separate on purpose

1. **Implementation — COMPLETE.** `npm run build` ✓, `npm run check` 0 errors ✓,
   `npm run verify` 10/10 ✓, rendered suite ✓ (see below).
2. **Visual verification — PASS at the tested commit.** Screenshots were produced, inspected and
   corrected (image stretch, hero index alignment, mobile scrim, stretched link underlines,
   invitation composition, tablet strip wrapping). No founder approval has been given or implied.
3. **Deployment — NOT DONE.** Not deployed from this branch. No domain or DNS change was made.
4. **Inbox receipt/reply — NOT VERIFIED.** Contact behaviour (exact `mailto:`, subject, copy
   success/denial) is verified in the browser. Whether `obsidixz@outlook.com` receives and replies
   was **not** independently tested; no such claim is made anywhere on the site.

## Tests performed (actual results)

| Suite | Command | Result |
| --- | --- | --- |
| Type/diagnostics | `npm run check` | 0 errors, 0 warnings, 4 hints (intentional deprecated `execCommand` fallback ×3, one removed unused import) |
| Structural (no browser) | `npm run verify` | 10/10 checks passed — routes, unique titles/descriptions, canonicals, `#main`, skip link, exact mailto, internal links, `/_astro` assets, no third-party hosts, sitemap/robots, brand dimensions, claim hygiene |
| Rendered sweep | `rendered-checks check` | 6 routes × 5 widths (320/390/768/1024/1440) — no overflow, no console errors, no failed requests, no broken images, fonts applied; unknown path → branded 404 page with status 404 |
| Interaction | `rendered-checks interact` | open/dialog semantics/focus move/`inert`/body lock; Escape → close + focus return; close button; Tab trap (14 presses stay inside); resize closes and reveals desktop nav; clipboard success, denial message, legacy fallback; 5 primary CTAs carry the exact `mailto` |
| No JavaScript | `rendered-checks nojs` | Static navigation block visible at 390 px, hidden at desktop width; no dialog semantics; copy button hidden; exact mailto intact; body text present |
| Text-size simulation | `rendered-checks zoom` | 200% root font-size clean on 6 routes at 390 and 1440 px (simulation only — real browser zoom is not driven by puppeteer, see §Limits) |
| Console/asset errors | within `check` | None across 30 page loads |

Not run: Lighthouse, axe, real-browser zoom automation, screen-reader session, cross-browser engine
testing. These are declared as limits rather than claimed as passes.

## Continuous integration (GitHub Actions)

`.github/workflows/ci.yml` runs on every pull request and on manual dispatch. Two jobs:
**Build and structural checks** (`npm ci`, `astro check`, `npm run build`, `npm run verify`) and
**Rendered, interaction and no-JS checks** (installs Chromium system libraries, serves
`npm run preview -- --port 4321`, waits for the port, then runs `check`, `interact`, `nojs`, `zoom`
one mode at a time).

Runs observed on this branch:

| Run | Config | Result |
| --- | --- | --- |
| [42691287195](https://github.com/Richard-Olasehinde/obsidixz/actions/runs/42691287195) | push + PR triggers | both jobs ✓ |
| [42691297433](https://github.com/Richard-Olasehinde/obsidixz/actions/runs/42691297433) | push + PR triggers | both jobs ✓ |
| [42691190533](https://github.com/Richard-Olasehinde/obsidixz/actions/runs/42691190533) | push + PR triggers | both jobs ✓ |
| [42691176814](https://github.com/Richard-Olasehinde/obsidixz/actions/runs/42691176814) | push + PR triggers | rendered job ✗ once |
| [42693453485](https://github.com/Richard-Olasehinde/obsidixz/actions/runs/42693453485) | push + PR triggers | both jobs ✓ |
| [42693467644](https://github.com/Richard-Olasehinde/obsidixz/actions/runs/42693467644) | push + PR triggers | rendered job ✗ once |
| [42693965330](https://github.com/Richard-Olasehinde/obsidixz/actions/runs/42693965330) | pull request only | both jobs ✓ |

The rendered job failed three times intermittently. The job log itself is not retrievable from this
sandbox (the log download host is outside the allowed network), but after the workflow was changed to
re-emit failing lines as `::error::` annotations, the third failure identified itself:

```
FAIL  no-js: hamburger toggle still visible
```

**Cause (confirmed, and it was the harness, not the site):** the no-JS mode navigated with
`waitUntil: 'domcontentloaded'`, which does not wait for stylesheets. The hamburger is hidden only by
the `html:not(.js) .menu-btn` CSS rule, so on a slow runner `getComputedStyle` was read before the
stylesheet applied and returned `inline-grid` instead of `none`. The first two failures were almost
certainly the same race, but their logs are unavailable, so that is stated as probable rather than
proven. The no-JS **behaviour of the site is correct** — it was the measurement that was premature.

Fix: `waitForStyles()` polls (from Node, since page timers do not run with JavaScript disabled) until
every `<link rel="stylesheet">` reports a parsed `sheet`, and fails explicitly if that never happens.
Full suite re-run after the change: `all` → 0 failures.

Mitigations applied (none of which weaken an assertion):

- CI now runs **once per pull request** instead of once per branch push plus once per pull request, so
  two identical Chromium suites no longer compete on the runner for the same commit;
- the Chromium launch retries up to three times (120 s launch timeout, 180 s protocol timeout);
- each rendered mode runs separately, so one failure cannot mask the others, and every `FAIL` /
  launch / `net::ERR` line is re-emitted as a `::error::` annotation, which is readable even when the
  full job log is not;
- `actions/checkout` and `actions/setup-node` moved to v5 for the Node 20 runner deprecation.

Latest run at the head commit: both jobs green.

## Contrast and focus measurements

Measured from the shipped tokens (WCAG 2.1 relative luminance, computed in `node`). Two tokens were
darkened during the audit because small text failed 4.5:1: `--muted` (#767F8A → **#66707A**) and a
new `--gold-ink` (#9A5F34) for small gold numerals on light backgrounds. Brand gold (#B47745) is
still used for decorative squares, rules and for text on black, where it measures 5.09:1.

| Pair | Ratio | Use |
| --- | --- | --- |
| Royal `#315C9B` on white | 6.70:1 | eyebrows, links, addresses |
| Royal-deep on white | 9.74:1 | copy-status text |
| Slate `#59616B` on white / light grey | 6.27:1 / 5.75:1 | body copy |
| Muted `#66707A` on white / light grey | 5.04:1 / 4.62:1 | captions, labels, notes |
| Charcoal `#292D32` on white | 13.86:1 | headings |
| Gold-ink `#9A5F34` on white / light grey | 5.17:1 / 4.74:1 | small numerals |
| Gold `#B47745` on black | 5.09:1 | hero second line, accents on dark |
| Gold-soft `#D3A175` on black | 8.20:1 | menu numbers, dark accents |
| Royal-soft `#8FB2DE` on black | 8.62:1 | inverse eyebrows, menu links |
| `#E9ECF0` on black | 15.93:1 | dark-section body |
| `#A8B0BA` on black | 8.62:1 | dark-section secondary |
| `#8E97A2` on black (footer small) | 6.38:1 | footer meta |
| White on royal (primary button) | 6.70:1 | buttons |

Keyboard focus: pressing Tab produced a `2px solid rgb(31, 76, 140)` outline on the skip link, the
logo link and each nav item, with `:focus-visible` matching (measured in the browser, not assumed).
On dark surfaces the outline switches to `#A9C6EC`.

## Screenshots (evidence, not approval)

Produced from `npm run preview` (the production `dist/`) with the packaged Chromium at the commit
recorded in the handover message.

| File | Page | Viewport |
| --- | --- | --- |
| `home-desktop-header-hero-1440x900.png` | `/` header + hero | 1440×900 |
| `home-desktop-full-1440.png` | `/` full page | 1440 wide |
| `home-lower-businesses-1440x900.png` | `/` Real Estate feature | 1440×900 |
| `home-lower-commercial-1440x900.png` | `/` Commercial feature | 1440×900 |
| `home-lower-studio-1440x900.png` | `/` Game Studio + foundation start | 1440×900 |
| `home-lower-foundation-1440x900.png` | `/` dark foundation | 1440×900 |
| `home-editorial-1440x900.png` | `/` editorial photograph | 1440×900 |
| `home-invite-1440x900.png` | `/` contact invitation + footer | 1440×900 |
| `home-mobile-390x844.png` | `/` full page | 390×844 |
| `home-mobile-hero-390x844.png` | `/` hero | 390×844 |
| `home-mobile-parent-390x844.png` | `/` parent role | 390×844 |
| `home-mobile-real-estate-390x844.png` | `/` Real Estate feature | 390×844 |
| `home-mobile-commercial-390x844.png` | `/` Commercial feature | 390×844 |
| `home-mobile-studio-390x844.png` | `/` Game Studio entry | 390×844 |
| `home-mobile-foundation-390x844.png` | `/` foundation | 390×844 |
| `home-mobile-editorial-390x844.png` | `/` editorial | 390×844 |
| `home-mobile-invite-390x844.png` | `/` invitation | 390×844 |
| `home-mobile-footer-390x844.png` | `/` footer | 390×844 |
| `mobile-menu-expanded-390x844.png` | `/` menu open | 390×844 |
| `tablet-home-768x1024.png` | `/` | 768×1024 |
| `mobile-home-320x700.png` | `/` | 320×700 |
| `businesses-desktop-1440x900.png`, `businesses-desktop-full-1440.png`, `businesses-mobile-390x844.png` | `/businesses/` | 1440×900, 1440 wide, 390×844 |
| `contact-desktop-1440x900.png`, `contact-mobile-390x844.png` | `/contact/` | 1440×900, 390×844 |
| `about-desktop-1440x900.png`, `about-mobile-390x844.png` | `/about/` | 1440×900, 390×844 |
| `privacy-desktop-1440x900.png`, `terms-desktop-1440x900.png` | `/privacy/`, `/terms/` | 1440×900 |
| `not-found-1440x900.png` | unknown path | 1440×900 |

## Content accuracy record

- Approved statements used verbatim: organisational description, mission, vision, six values.
- No founding date, name origin, pronunciation, employees, offices, clients, partners, awards,
  funding, revenue, or registered entity appears anywhere. `scripts/verify.mjs` fails on patterns
  that would imply them.
- Brand architecture is described as naming only, with an explicit note that it is not
  incorporation, subsidiaries or a group structure.
- Real Estate and Commercial each carry a "Scope" statement of what they do **not** do.
- Game Studio: relationship, Word Quest as current identified project, "Website to follow", general
  inbox. No date, no store link, no test invitation, no games subdomain.
- Business destinations: Real Estate `https://realestate.obsidixz.pp.ua/` (as recorded);
  Commercial `http://commercial.obsidixz.pp.ua/` marked as HTTP pending its certificate.

## Open items requiring resolution

| # | Item | Where | State |
| --- | --- | --- | --- |
| 1 | Parent-inbox retention period is not fixed; `/privacy/` says so rather than inventing one | `/privacy/#retention` | **Open — policy decision for the founder** |
| 2 | Commercial destination returns to HTTPS | `src/data/site.ts` | **Open — depends on the business site's certificate** (`DEPLOYMENT.md` §5) |
| 3 | Deployment, custom domain and HTTPS enforcement | GitHub Pages settings + DNS | **Open — owner access** (`DEPLOYMENT.md` §6) |
| 4 | Live post-deployment verification | `DEPLOYMENT.md` §4 | **Open — cannot run from this sandbox** |
| 5 | Founder visual approval | `verification/screenshots/` | **Open** |
| 6 | Parent mailbox receipt/reply test | `obsidixz@outlook.com` | **Not verified** — out of scope for this environment |
| 7 | Optional vector (SVG) logo artwork | `public/brand/` | **Optional** — raster artwork is used as supplied |

## Limits of this verification

- The sandbox cannot reach the Obsidixz domains or the live business sites (egress limited to
  GitHub, npm, PyPI). DNS, HTTPS, deployment and destination liveness are therefore **unverified**;
  upstream statuses are quoted from the 2026-11-09 handoff, not re-measured.
- "Zoom" is a 200% root font-size simulation. Real browser zoom was not automated.
- Screenshots are implementation evidence. They are not founder approval and do not prove visual
  quality on the founder's own displays.
- Email behaviour is limited to opening the visitor's mail client; the site cannot know whether a
  message was sent, so it never claims one was.
