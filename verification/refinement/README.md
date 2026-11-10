# Refinement captures — 2026-11-10

Before/after pairs for the editorial and visual refinement (`DECISION_LOG.md` §15–§17).

| Pair | Route | Viewport | Capture |
| --- | --- | --- | --- |
| `before-home-desktop.png` / `after-home-desktop.png` | `/` | 1440 wide, full page | full-page screenshot |
| `before-home-mobile.png` / `after-home-mobile.png` | `/` | 390×844, full page | full-page screenshot |
| `before-businesses.png` / `after-businesses.png` | `/businesses/` | 1440×900 | viewport |
| `before-menu.png` / `after-menu.png` | `/` | 390×844 | mobile menu opened |
| `before-contact.png` / `after-contact.png` | `/contact/` | 1440×900 | viewport |

**How they were produced.** Both sets come from the same harness
(`scripts/rendered-checks.mjs`, `shots` mode) against `npm run preview` serving the production
build, with the packaged `@sparticuz/chromium` binary at a viewport of the same size. "Before" is
the `main` content at the start of the refinement branch; "after" is the final build of the branch.
The refreshed full set lives in `../screenshots/`.

**What the pairs should show.** The homepage loses the research-desk section, the architecture
diagram and the business-inbox directory; the parent introduction is shorter; each business profile
is reduced to name, description, one supporting line and a website action; the foundation band keeps
the mission and the six value names only. Navigation, menu behaviour, contact routing and the
photographic hero are unchanged.

These images are evidence of what was rendered. They are not founder approval.
