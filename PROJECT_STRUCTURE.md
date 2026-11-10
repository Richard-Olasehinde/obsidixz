# PROJECT STRUCTURE — Obsidixz parent website

```
obsidixz/
├── astro.config.mjs           site origin, sitemap, trailing-slash policy, dev host allowlist
├── tsconfig.json              extends astro/tsconfigs/strict
├── package.json               scripts, pinned stack, vite ^7 override
├── .gitignore
├── README.md                  overview, commands, content rules
├── PROJECT_STATUS.md          authoritative status + test results + open actions
├── DECISION_LOG.md            dated decisions with rationale
├── PROJECT_STRUCTURE.md       this file
├── DEPLOYMENT.md              GitHub Pages, DNS, HTTPS, verification
├── IMAGE_SOURCES.md           image and font provenance
├── CONTINUATION.md            resume instructions for a fresh session
│
├── .github/workflows/
│   ├── deploy.yml             build + verify + deploy to Pages (main only)
│   └── ci.yml                 check/build/verify + browser suite on pull requests
│
├── public/
│   ├── .nojekyll              stop GitHub Pages running Jekyll over /_astro
│   ├── CNAME                  obsidixz.pp.ua (branch publishing only; Actions needs the UI setting)
│   ├── robots.txt             allow all + sitemap: /sitemap-index.xml
│   ├── site.webmanifest       name, theme colour, 192/512 icons
│   ├── favicon.ico            16/32/48 PNG-in-ICO, derived from the emblem
│   ├── favicon-16x16.png  favicon-32x32.png  favicon-48x48.png
│   ├── apple-touch-icon.png  180px, emblem on white
│   ├── icon-192.png  icon-512.png
│   ├── og/obsidixz-sharing.jpg   1200×630 social card
│   └── brand/
│       ├── obsidixz-parent-logo-on-light.png   931×785, supplied artwork (unmodified)
│       ├── obsidixz-parent-logo-on-dark.png    931×785, supplied artwork (unmodified)
│       └── obsidixz-parent-symbol-transparent.png  2000×1500, supplied emblem (unmodified)
│
├── src/
│   ├── assets/images/          source photography (JPEG, 1264×848)
│   │   ├── hero-architecture.jpg
│   │   ├── real-estate-neighbourhood.jpg
│   │   └── commercial-packaging.jpg
│   ├── data/site.ts            identity, businesses, emails, nav, values, email copy
│   ├── styles/global.css       tokens, reset, layout, components, responsive rules
│   ├── layouts/BaseLayout.astro    head/meta/fonts, skip link, header, main, footer
│   ├── components/
│   │   ├── brand/LogoLockup.astro       light/dark artwork at CSS-controlled widths
│   │   ├── layout/SiteHeader.astro      desktop nav, CTA, hamburger, expanded menu + script
│   │   ├── layout/SiteFooter.astro      brand column, nav, businesses, contact, legal bar
│   │   ├── layout/LegalLayout.astro     policy page shell with "on this page" aside
│   │   ├── sections/BusinessFeature.astro   image + facts + scope + actions
│   │   ├── sections/BrandArchitecture.astro parent → businesses → product diagram
│   │   ├── sections/EmailBlock.astro        address, CTA, copy button, helper copy
│   │   └── ui/Arrow.astro
│   └── pages/
│       ├── index.astro        hero, parent introduction, businesses, studio, foundation, invite
│       ├── about.astro        organisation, architecture, mission/vision, values, status
│       ├── businesses.astro   three profiles, Game Studio panel, destination notes
│       ├── contact.astro      general route, business routes, studio route, how-it-works
│       ├── privacy.astro      privacy notice (12 sections)
│       ├── terms.astro        website terms (9 sections)
│       └── 404.astro          branded not-found page (noindex, built to /404.html)
│
├── scripts/
│   ├── verify.mjs             structural checks on dist/ (routes, metadata, links, claims)
│   ├── rendered-checks.mjs    Puppeteer: layout sweep, interactions, no-JS, zoom, screenshots
│   └── build-assets.mjs       favicon set + social card derivation (Sharp)
│
└── verification/screenshots/  rendered evidence (see PROJECT_STATUS.md for the index)
```

## Where to change what

| Change | File |
| --- | --- |
| Business name, description, destination, inbox | `src/data/site.ts` |
| General email address or mailto subject | `src/data/site.ts` (`emails`, `GENERAL_MAILTO`) |
| Navigation items | `src/data/site.ts` (`primaryNav`) |
| Meta title/description for a page | that page's `<BaseLayout …>` props |
| Colours, spacing, type scale | `src/styles/global.css` (`:root` tokens) |
| Production origin | `astro.config.mjs` + `src/data/site.ts` (`site.url`) |
| Favicon / social card | run `npm run assets` after changing brand artwork |
