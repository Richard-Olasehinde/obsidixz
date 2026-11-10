# IMAGE SOURCES — Obsidixz parent website

All dates are 2026-11-09. Nothing here was fetched from a stock library, a search engine or another
website. No image is hotlinked; every file below is committed in this repository.

> **Scope note on rights.** The photographs are **AI-generated for this project**. They are
> recorded here with their actual provenance and with the terms that apply: output generated through
> Arena's image tool, requested for this site. No universal guarantee is made that generated imagery
> is free of every third-party claim in every jurisdiction — no such guarantee is possible, so none
> is printed. Every prompt excluded brands, logos, readable text and people, and each output was
> reviewed before use. On-page captions describe all four as illustrative.

## Photography

| Asset | Path | Origin | Basis for use | Modifications |
| --- | --- | --- | --- | --- |
| Architectural detail (hero) | `src/assets/images/hero-architecture.jpg` (1264×848, 202 kB) | Generated 2026-11-09 with Arena's image tool | Generated for this project | Build-time WebP at 640/960/1280/1600 px via `astro:assets`; no manual retouching |
| Residential street (Real Estate) | `src/assets/images/real-estate-neighbourhood.jpg` (1264×848, 342 kB) | Same | Same | Build-time WebP at 520/720/960 px |
| Packaging and materials bench (Commercial) | `src/assets/images/commercial-packaging.jpg` (1264×848, 187 kB) | Same | Same | Build-time WebP at 520/720/960 px |

**Retired asset (2026-11-10).** `src/assets/images/editorial-notebook.jpg` was deleted with the
homepage "Research before decision" section it illustrated: the notebook styling duplicated the
business sites' research imagery, which the parent site should not echo. It was checked first — no
page, component, metadata or script referenced it after the section was removed. Nothing else in this
file changes for it; the prompt below is kept so the record stays complete.

**Prompts (summarised).** Photorealistic editorial photography, wide landscape.

1. *Hero* — extreme close-up of intersecting contemporary architecture: limestone, concrete, dark
   glass, brushed metal fins; raking low sun, crisp geometric shadow; no people, signage, logos,
   text, skyline or whole building; no CGI look.
2. *Real Estate* — established American residential street: detached houses with porches, mature
   trees, late-afternoon light; no people, cars in the foreground, readable text or agent boards.
3. *Commercial* — packaging and materials study on a dark workbench: plain corrugated carton,
   unprinted cartons, glass jar, kraft paper, twine, material swatches; non-legible pencil marks
   only; no branding or labels.
4. *Editorial* — retired 2026-11-10. Overhead open notebook with faint non-legible notes and pencil
   diagrams, matte pen, stoneware cup, grey paper, steel ruler on pale oak; natural window light; no
   people, devices or readable words.

**Review notes.** Each output was inspected for legible text, faces, logos and identifiable
architecture before being wired into a page. The notebook's handwriting is decorative scribble and
is never presented as readable content; no caption attributes it to Obsidixz. Captions on the site
state "Illustrative photograph" and, where relevant, that the image is not an Obsidixz property,
office or client work.

## Brand artwork — authentic, supplied by the founder

Supplied as chat attachments on 2026-11-09, copied byte-for-byte into `public/brand/`. Verified after
copy: dimensions and SHA-256 unchanged. The artwork is **not** redrawn, recoloured, re-proportioned or
re-typeset anywhere in this project.

| File | Dimensions | SHA-256 (prefix) | Use |
| --- | --- | --- | --- |
| `obsidixz-parent-logo-on-light.png` | 931×785 RGBA | `3da42ec83ae71389` | Header, light backgrounds |
| `obsidixz-parent-logo-on-dark.png` | 931×785 RGBA | `f2d6fb96a53982a9` | Footer, mobile menu, social card |
| `obsidixz-parent-symbol-transparent.png` | 2000×1500 RGBA | `458413f7fe1ae0c5` | Favicon/app-icon source only |

Neither `realestate.obsidixz.pp.ua/brand/…` nor the GitHub HTML pages were used as an image source;
the supplied files are canonical.

### Derived files (trim, pad, resize, composite — no redraw)

| File | Derivation |
| --- | --- |
| `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`, `favicon.ico` | Emblem trimmed of transparent margin (478×396 content box), even padding, square canvas, resized; ICO holds the three PNG frames |
| `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png` | Same emblem, composited on white for OS chrome |
| `og/obsidixz-sharing.jpg` (1200×630) | Black panel + gold rule carrying the on-dark lockup, composited beside the hero photograph |

Regenerate with `npm run assets`.

## Fonts

| Family | Weights | Source | Licence |
| --- | --- | --- | --- |
| Montserrat | 600, 700 (latin) | `@fontsource/montserrat` (npm) | SIL Open Font License 1.1 |
| Open Sans | 400, 600 (latin) | `@fontsource/open-sans` (npm) | SIL Open Font License 1.1 |

Self-hosted at build time (`/_astro/*.woff2`). No Google Fonts, no font CDN, no runtime font request.

## Icons and graphics

Inline SVG only (arrow, menu lines, close cross) drawn in this repository. The rotated-square motif
in the brand-architecture and Game Studio blocks is CSS, echoing the Interlock geometry without
altering the emblem.

## Not used

- No stock photography, no hotlinked images, no third-party embeds or iframes.
- No imagery or screenshots from the Real Estate, Commercial or Commercial `verification/` folders.
- No fabricated dashboards, metrics, client work or team photographs.
