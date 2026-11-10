# DECISION LOG — Obsidixz parent website

Decisions are dated and kept in order. Superseded entries are marked rather than deleted.

---

## 1. Stack — Astro static site, no framework, no server (2026-11-09)

**Decision.** Astro with `output: 'static'`, plain CSS, and about 4 kB of progressive-enhancement
JavaScript.

**Why.** Six static pages with shared header/footer/metadata need templates, not a runtime. A static
build deploys to GitHub Pages with no server, no secrets and nothing to keep patched. Plain CSS keeps
the design tokens readable in one file and avoids a utility layer and its build plugin.

**Considered.** Astro + Tailwind (as the two business sites do) — rejected as unnecessary for this
size of site; Next.js (as Real Estate) — rejected as server-capable tooling for a static page set.

**Compatibility note.** Astro 7.4.8 is current but requires Node ≥ 22.23.4; this workspace runs
22.22.3. Astro **6.4.8** (Node ≥ 22.12) was pinned instead. Vite is pinned to `^7` via
`package.json.overrides` because a transitive dependency otherwise hoists Vite 8, which Astro 6 does
not support. On a machine with Node ≥ 22.23.4, upgrading to Astro 7 is a deliberate future decision,
not an automatic one.

## 2. Fonts self-hosted from npm, never a font CDN (2026-11-09)

Montserrat 600/700 and Open Sans 400/600 come from `@fontsource` packages, so the files ship from
`/_astro/*.woff2` and no request leaves the visitor's browser for typography. Both families are
SIL Open Font License 1.1 — web embedding and commercial use are permitted.

## 3. Photography is generated for this project, not borrowed from the business sites (2026-11-09)

**Decision.** Four original photographs were generated with Arena's image-generation tool: an
architectural detail (hero), a US residential street (Real Estate), a packaging/materials bench
(Commercial), and an open notebook on a desk (editorial).

**Why.** The parent site needs its own subject matter and must not reuse a business's sector assets
as if they were shared brand imagery. Generated output has clear provenance and no third-party stock
licence. The business sites' recorded provenance was reviewed (their images are also generated) but
neither repository was modified and no asset was copied.

**Guardrails.** No text, brands, faces or identifiable buildings in any output; each image is
captioned on-page as illustrative and not an Obsidixz property, office or client work.
`IMAGE_SOURCES.md` records the actual basis for use and refuses a blanket copyright guarantee.

## 4. Parent header uses the complete logo with no business label (2026-11-09)

The header carries the supplied lockup alone at 80 / 96 / 112 px wide (automatic height), inside a
5.5 / 6.25 / 7.25 rem header. No "Parent", "Group" or "HQ" suffix: the reference sites add a business
label because they represent one business; this site represents the parent itself. The artwork is
never redrawn, recoloured or re-proportioned; only transparent padding was trimmed for icon exports.

## 5. Favicons derive from the standalone emblem, never the wordmark (2026-11-09)

`scripts/build-assets.mjs` trims the transparent margin from
`obsidixz-parent-symbol-transparent.png`, pads, and resizes to 16/32/48 (PNG-in-ICO), 180, 192 and
512. No redraw, crop or recolour. A full lockup at 16 px would be illegible, hence the emblem-only.

## 6. Social card is a composition of real brand elements (2026-11-09)

1200×630: a black panel carrying the approved on-dark lockup beside the hero photograph. No
re-typeset wordmark, no invented tagline.

## 7. Obsidixz Commercial is linked over HTTP, transparently (2026-11-09) — SUPERSEDED 2026-11-10, see §16

At the 2026-11-09 handoff the Commercial site was live over HTTP with its HTTPS certificate still
pending. This sandbox cannot reach the site to re-check (see §8), so the site links the **working**
HTTP destination and says so in a single line next to the button, rather than sending visitors to a
certificate error.

**Single point of change:** `src/data/site.ts` → `businesses[1].url` (and `urlInsecure`). When
`https://commercial.obsidixz.pp.ua/` returns 200 with a valid certificate, switch the URL to HTTPS,
delete `urlInsecure`, and remove the two conditional notes in `BusinessFeature.astro` /
`businesses.astro` / `contact.astro`.

## 8. Live business sites could not be opened from this environment (2026-11-09)

Outbound network access in this workspace is limited to GitHub, npm and PyPI. `realestate.`,
`commercial.` and `obsidixz.pp.ua` were **not** fetched; TLS connections were refused by the sandbox
egress policy, not by the destinations. Both reference repositories were cloned from GitHub and
their source, screenshots and `IMAGE_SOURCES.md` were reviewed instead. The reference review is
therefore limited to stored artefacts, and no live visual comparison is claimed.

## 9. No form, no tracking, no third-party embeds (2026-11-09)

Every contact action is a `mailto:` link. There is no enquiry endpoint, attachment handling,
transactional email, Outlook API integration or newsletter — therefore no data store to secure and
no submission confirmation to fake. The copy button is progressive enhancement: without JavaScript
it stays hidden rather than presenting a control that cannot work.

## 10. Menu is a JS-enhanced dialog with a no-JS fallback (2026-11-09)

Markup carries **no** dialog semantics. The inline head script adds `js` to `<html>`; CSS hides the
panel until it is opened. On open the script adds `role="dialog"`, `aria-modal`, moves focus to the
close button, sets `inert` on the header inner, main, footer and skip link, locks body scroll and
traps Tab; Escape, the close button and any link close it and focus returns to the toggle. With
JavaScript disabled the panel is a static navigation block (hidden at desktop width). This avoids
both a dead hamburger and a dialog that cannot close.

## 11. Destinations, metadata and identity are centralised (2026-11-09)

`src/data/site.ts` holds every name, description, address, destination, nav item and approved
statement. Titles/descriptions are declared per page and validated by `scripts/verify.mjs` (unique,
70–200 characters, production canonical, one `<h1>`).

## 12. Claim hygiene is tested, not just intended (2026-11-09)

`scripts/verify.mjs` fails the build check if generated HTML contains patterns implying a registered
company, a founding year, staff, awards or certification. This is a guardrail against drift, not a
substitute for review.

## 13. Game Studio stays brief (2026-11-09) — milestone updated 2026-11-10, see §17

One compact entry on the home page and one panel on Our Businesses: relationship, Word Quest as its
current identified project, "Website to follow", general inbox as the route. No date, no countdown,
no store link, no test invitation, no games subdomain, no Game Studio website.

## 14. Policy pages describe the site that exists (2026-11-09)

Privacy covers: email content, Outlook/Microsoft processing, the visitor's own provider, GitHub Pages
hosting and its technical logs, no site cookies/analytics, and a retention position that is honest
about not having fixed a period yet. Terms stay informational: no invented governing law, liability
exclusions, refunds or payment rules; nothing that reads as a service agreement. Both identify the
operator as an individual and the brand as unregistered.

## 15. Homepage cut to five sections (2026-11-10)

**Decision.** The homepage is now hero → short parent introduction → business overview → compact
shared foundation → general contact invitation.

**Why.** The first version carried the language and imagery of the business sites: a research-desk
photograph, a "Research before decision" essay, three parent-voice "principles" that restated the
values, an architecture diagram that repeated the business list, and a directory of business inboxes
next to a second directory of the same addresses. Together they made the parent read like another
research provider and buried the actual destinations. Removing them cut the page by 32% at 1440 px
and 39% at 390 px.

**Guardrails.** The architectural hero, the complete logo, the approved description/mission/vision,
the two substantial business photographs, the Game Studio entry and the direct-email contact model
are unchanged. Facts and scope statements were not deleted — they moved to `/businesses/`, where a
reader is already asking about that business. The values explanations now live only on `/about/`;
the homepage shows the six names and links to them.

## 16. Commercial destination moved to HTTPS (2026-11-10)

**Decision.** `businesses[1].url` is `https://commercial.obsidixz.pp.ua/`; `urlInsecure` and every
plain-HTTP notice were deleted from `BusinessFeature.astro`, `/businesses/`, `/contact/` and
`/terms/`.

**Why.** The founder's live check on 2026-11-10 found HTTPS responding and HTTP redirecting to it, so
the reason for the HTTP link and the notices about a pending certificate no longer existed. This
sandbox could not repeat the check (HTTP/TLS egress is blocked); the switch rests on that
founder-verified state and is re-checked after deployment.

**Not done.** Nothing was changed in the Commercial repository, its DNS, its certificate or its
hosting.

## 17. Game Studio milestone: defer until Word Quest launches (2026-11-10)

**Decision.** The internal milestone is now "defer the Game Studio website until Word Quest
launches", superseding the earlier "until Word Quest completes closed testing".

**Why.** The founder revised the trigger. This is an internal planning note, not a public promise:
the site continues to say only "Website to follow", with no date, countdown, store link, testing
invitation or launch statement, and no Game Studio page, subdomain or inbox was created.
