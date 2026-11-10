# PROJECT STATUS — Obsidixz parent website

**Date:** 2026-11-10 (UTC) · **Branch:** `arena/1ddb75a3-obsidixz` (refinement) · **Repo:** `Richard-Olasehinde/obsidixz`
**Production origin (live):** https://obsidixz.pp.ua/
**Stack:** Astro 6.4.8 (static), plain CSS, self-hosted fonts, ~4 kB progressive-enhancement JS.

This is the single authoritative status file. Anything contradicted here is superseded.

## Stage results

| Stage | Status | Evidence |
| --- | --- | --- |
| 1. Foundation & references | **DONE** | Empty repo initialised; Astro 6.4.8 stack installed and building; brand artwork copied and hash-verified; four generated photographs; design tokens, type scale and shared layout in `src/styles/global.css` |
| 2. Homepage & navigation | **DONE** | Five sections: photographic hero with index, short parent introduction, business overview with two image-led features plus the brief Game Studio entry, compact shared foundation, general contact invitation. Header/menu behaviour tested. The 2026-11-10 refinement removed the research-desk section, the architecture diagram (now only on About) and the business-inbox directory from this page |
| 3. About & Our Businesses | **DONE** | Approved description/mission/vision/values; three accurate profiles with scope limits; Game Studio kept to a brief entry with no date, link or launch promise |
| 4. Contact & policies | **DONE** | Three routes + copy button, exact general `mailto:`, privacy notice and website terms written to actual configuration; no form infrastructure |
| 5. Responsive & accessibility | **DONE** | 6 routes × 320/390/768/1024/1440 px: no horizontal overflow, no console errors, no failed requests, no broken visible images; 200% root font-size clean; no-JS suite; focus/inert/Escape/focus-return suite |
| 6. SEO & production prep | **DONE** | Unique titles/descriptions, production canonicals, OG/Twitter, derived favicon set, 1200×630 social card, sitemap, robots, `/.nojekyll`, social manifest |
| 7. Rendered verification | **DONE (local)** | Screenshots in `verification/screenshots/` produced from the served **production** build by headless Chromium; each file's viewport and page are listed below |
| 8. Deployment & handover | **DONE** | Deployed by GitHub Actions on 2026-11-09 after Pages was set to "GitHub Actions" and the custom domain was saved; live at https://obsidixz.pp.ua/. The first run failed at `configure-pages` because Pages had not been enabled yet — see `DEPLOYMENT.md` §3 |

## Delivery status — kept separate on purpose

1. **Implementation — COMPLETE.** `npm run build` ✓, `npm run check` 0 errors ✓,
   `npm run verify` 10/10 ✓, rendered suite ✓ (see below).
2. **Visual verification — PASS at the tested commit.** Screenshots were produced, inspected and
   corrected (image stretch, hero index alignment, mobile scrim, stretched link underlines,
   invitation composition, tablet strip wrapping). No founder approval has been given or implied.
3. **Deployment — LIVE.** Published to GitHub Pages at https://obsidixz.pp.ua/ (apex A + AAAA,
`www` CNAME, mail records untouched). Live rendering was seen in the founder's screenshots of
`/` and `/businesses/`; the deployment itself was carried out by the founder, not from this
workspace. TLS, redirects and live headers were **not** measured from here.
4. **Inbox receipt/reply — NOT VERIFIED.** Contact behaviour (exact `mailto:`, subject, copy
   success/denial) is verified in the browser. Whether `obsidixz@outlook.com` receives and replies
   was **not** independently tested; no such claim is made anywhere on the site.

## Refinement pass — 2026-11-10

A bounded editorial and visual refinement of the live site, on branch `arena/1ddb75a3-obsidixz`.

| Change | Detail |
| --- | --- |
| Homepage shortened | 6,852 → **4,674 px** at 1440 (‑32%); 10,044 → **6,158 px** at 390 (‑39%) |
| Parent introduction | Heading "A parent identity, not a shopfront." → **"The organisation behind the businesses."**; approved description kept verbatim; one concise explanation; "At a glance" table removed |
| Business overview | Homepage profiles reduced to name, approved short description, one supporting line and a website action; full body, facts and scope stay on `/businesses/` |
| Research-desk section | Removed, with its image. The architectural hero and the two business photographs carry the visual load |
| Brand architecture | Removed from the homepage (it repeated the business list); kept and clarified on `/about/` |
| Shared foundation | Reduced to the mission quote, the six value *names* and a link to `/about/#values`; the values explanations live only on About |
| Contact invitation | One general invite; the business-address directory was removed from this page and routed through `/contact/` |
| About | Defensive/self-referential passages removed ("not a shopfront", "vision is not a record", "this website does not claim…"); legal identification kept in one sentence |
| Our Businesses | H1 "Three businesses, described as they are." → "Our businesses"; the "Destinations, without guesswork" section (which duplicated every button) replaced by one contact band |
| Commercial HTTPS | Destination switched to `https://commercial.obsidixz.pp.ua/`; `urlInsecure` and the plain-HTTP notices removed from the component, `/businesses/`, `/contact/` and `/terms/` |
| Game Studio | Public copy unchanged in substance; the internal milestone is now "defer until Word Quest launches" (see `DECISION_LOG.md` §17) |
| CSS | ~2.8 kB of rules for the removed sections deleted; `.values-strip`, `.biz-feature__note` and the compact card added |

Verification for this pass is in the table below; before/after captures are in
`verification/refinement/` and the refreshed set in `verification/screenshots/`.

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

**Re-run for the 2026-11-10 refinement (all on the final build of this branch):**

| Check | Result |
| --- | --- |
| `astro check` | 0 errors, 0 warnings, 3 hints (the intentional deprecated `execCommand` fallbacks) |
| `npm run verify` | 10/10 checks passed |
| `rendered-checks check` | 6 routes × 320/390/768/1024/1440 — 0 failures; branded 404 with status 404 |
| `rendered-checks interact` | 9/9 — menu, focus, `inert`, Escape, Tab trap, clipboard success/denial/legacy, 5 primary CTAs |
| `rendered-checks nojs` | 2/2 |
| `rendered-checks zoom` | 12/12 (200% text-size simulation) |
| `rendered-checks shots` | 31 captures regenerated, 0 failures |

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
| [42694431040](https://github.com/Richard-Olasehinde/obsidixz/actions/runs/42694431040) | pull request only, annotated failures | rendered job ✗ — diagnosed as the stylesheet race below |
| [42695194116](https://github.com/Richard-Olasehinde/obsidixz/actions/runs/42695194116) | pull request only, stylesheet wait | both jobs ✓ |

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
| `home-lower-values-1440x900.png` | `/` shared foundation: mission + values | 1440×900 |
| `home-invite-1440x900.png` | `/` contact invitation + footer | 1440×900 |
| `home-mobile-390x844.png` | `/` full page | 390×844 |
| `home-mobile-hero-390x844.png` | `/` hero | 390×844 |
| `home-mobile-parent-390x844.png` | `/` parent role | 390×844 |
| `home-mobile-real-estate-390x844.png` | `/` Real Estate feature | 390×844 |
| `home-mobile-commercial-390x844.png` | `/` Commercial feature | 390×844 |
| `home-mobile-studio-390x844.png` | `/` Game Studio entry | 390×844 |
| `home-mobile-foundation-390x844.png` | `/` foundation | 390×844 |
| `home-mobile-values-390x844.png` | `/` shared foundation | 390×844 |
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
- Business destinations: Real Estate `https://realestate.obsidixz.pp.ua/` and Commercial
  `https://commercial.obsidixz.pp.ua/` — both HTTPS as of 2026-11-10; no plain-HTTP notices remain.

## Open items requiring resolution

| # | Item | Where | State |
| --- | --- | --- | --- |
| 1 | Parent-inbox retention period is not fixed; `/privacy/` says so rather than inventing one | `/privacy/#retention` | **Open — policy decision for the founder** |
| 2 | Commercial destination returns to HTTPS | `src/data/site.ts` | **Open — depends on the business site's certificate** (`DEPLOYMENT.md` §5) |
| 3 | Deployment, custom domain and HTTPS enforcement | GitHub Pages settings + DNS | **Done 2026-11-09** — live, DNS check passing; Enforce HTTPS confirmed by the founder |
| 4 | Live post-deployment verification | `DEPLOYMENT.md` §4 | **Partly done** — the founder confirmed `/` and `/businesses/` render live; 404, redirects, canonicals and sitemap are unverified from this workspace |
| 5 | Founder review of the refined pages before merge | `verification/refinement/` | **Open — required before merging this branch** |
| 6 | Parent mailbox receipt/reply test | `obsidixz@outlook.com` | **Not verified** — out of scope for this environment |
| 7 | Optional vector (SVG) logo artwork | `public/brand/` | **Optional** — raster artwork is used as supplied |

## Limits of this verification

- The sandbox cannot open the Obsidixz domains or the business sites over HTTP/HTTPS (egress is
  limited to GitHub, npm, PyPI and DNS). **DNS was verified** on 2026-11-10 (apex A + AAAA, `www`
  CNAME, MX/TXT/NS, business CNAMEs). TLS, redirects, live headers and live HTML remain
  **unverified from here**; the live render is evidenced only by the founder's screenshots.
- The Commercial HTTPS switch rests on the founder's live check of 2026-11-10 (HTTPS 200, HTTP
  redirects). The sandbox could not repeat that check.
- "Zoom" is a 200% root font-size simulation. Real browser zoom was not automated.
- Screenshots are implementation evidence. They are not founder approval and do not prove visual
  quality on the founder's own displays.
- Email behaviour is limited to opening the visitor's mail client; the site cannot know whether a
  message was sent, so it never claims one was.
