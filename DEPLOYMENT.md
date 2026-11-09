# DEPLOYMENT — Obsidixz parent website

**Intended production domain:** https://obsidixz.pp.ua/
**Build output:** `dist/` — static HTML/CSS/JS, fonts, images. No server code, no database, no
secrets, no environment variables.

**Status at handover (2026-11-09):** the production build, workflow and custom-domain configuration
are prepared and tested locally; **the site has not been deployed** from this branch. Publishing
requires a merge to `main` plus the one-time Pages settings below, which need repository-owner
access. Nothing here has been purchased.

---

## 1. How deployment works

`.github/workflows/deploy.yml`:

1. runs on **push to `main`** and on manual dispatch *selected on `main`* — never on a feature branch;
2. installs with `npm ci`, builds with `npm run build`, and refuses to deploy if `npm run verify`
   fails;
3. uploads `dist/` as a Pages artefact and deploys it with the official Pages actions.

Feature branches run `.github/workflows/ci.yml` (type check, build, structural verify, browser
suite) but cannot deploy. There is no preview environment, so no preview URL can compete with the
production canonical URLs in search results.

## 2. One-time repository settings (owner)

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. **Settings → Pages → Custom domain:** enter `obsidixz.pp.ua` and save.
   *This step is what establishes the domain for an Actions deployment.* The `CNAME` file in
   `public/` is published with the site and is used by branch-based publishing, but **a CNAME file in
   the artefact does not configure a custom domain for Actions workflows**.
3. Wait for GitHub's DNS check to pass, then enable **Enforce HTTPS**.
4. Confirm the environment (`github-pages`) allows deployments from `main`.

If the Pages API reports `https_certificate.state: new` for a while, that is normal issuance. Do not
change correct DNS to chase a pending certificate.

## 3. DNS — inspect before you change anything

The zone also serves the business sites (`realestate.`, `commercial.`), other records and mail. **Do
not delete or replace unrelated records**, and do not change MX/TXT records to make the website work.

Inspect from any machine with DNS access:

```bash
dig +short obsidixz.pp.ua A
dig +short obsidixz.pp.ua AAAA
dig +short obsidixz.pp.ua MX
dig +short obsidixz.pp.ua TXT
dig +short realestate.obsidixz.pp.ua CNAME
dig +short commercial.obsidixz.pp.ua CNAME
dig +short _github-pages-challenge-richard-olasehinde.obsidixz.pp.ua TXT
```

Record the current values before editing. (This build environment's network policy blocks DNS and
HTTPS to the Obsidixz domains, so the zone could not be inspected from here — this is the first
founder action in §6.)

### 3a. Apex / root domain (`obsidixz.pp.ua`)

GitHub Pages cannot use a CNAME on an apex domain. Use A/AAAA records (or an ALIAS/ANAME if the DNS
provider specifically supports apex aliases):

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

Leave `MX`, `TXT` (including any `_github-pages-challenge-…` verification record) and the business
subdomains untouched.

### 3b. Optional `www` subdomain

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| CNAME | `www` | `richard-olasehinde.github.io.` | 3600 (or the zone default) |

Trailing dot included. `www` is optional; if added, set it as an additional custom domain? No —
GitHub redirects `www` to the apex automatically once the apex is configured. Do not add a CNAME on
the apex.

### 3c. What must not change

- `realestate.obsidixz.pp.ua` and `commercial.obsidixz.pp.ua` records and their Pages settings.
- Any mail-related record.

## 4. Verification after deployment

```bash
# 1. Resolution and TLS
dig +short obsidixz.pp.ua A
curl -sI https://obsidixz.pp.ua/                     # expect HTTP/2 200
curl -sI http://obsidixz.pp.ua/                      # expect 301 → https once enforced

# 2. Routes
for p in / /about/ /businesses/ /contact/ /privacy/ /terms/ /sitemap-index.xml /robots.txt \
         /brand/obsidixz-parent-logo-on-light.png /og/obsidixz-sharing.jpg; do
  printf '%s ' "$p"; curl -s -o /dev/null -w '%{http_code}\n' "https://obsidixz.pp.ua$p"
done

# 3. 404
curl -s -o /dev/null -w '%{http_code}\n' https://obsidixz.pp.ua/does-not-exist/   # expect 404

# 4. Canonicals and metadata
curl -s https://obsidixz.pp.ua/ | grep -o '<link rel="canonical"[^>]*>'
curl -s https://obsidixz.pp.ua/businesses/ | grep -o '<title>[^<]*</title>'

# 5. Business destinations (must be current, not assumed)
curl -sI https://realestate.obsidixz.pp.ua/ | head -1
curl -sI http://commercial.obsidixz.pp.ua/ | head -1
```

`npm run verify` already checks titles, descriptions, canonicals, internal links, assets, sitemap
coverage, the exact `mailto:` literal, third-party hosts and claim patterns against `dist/`.

## 5. Commercial HTTPS switch (one-line change)

At handover the Commercial site was reported live over **HTTP** with its certificate pending, so this
site links `http://commercial.obsidixz.pp.ua/` and says so in one line beside the button.

When `curl -sI https://commercial.obsidixz.pp.ua/` returns 200 with a valid certificate:

1. `src/data/site.ts` → `businesses[1].url` → `https://commercial.obsidixz.pp.ua/`
2. delete `urlInsecure: true` on the same object;
3. remove the now-unused notes rendered by `business.urlInsecure` in `BusinessFeature.astro`,
   `businesses.astro` and `contact.astro`;
4. `npm run build && npm run verify` and redeploy.

Nothing else in the codebase hard-codes that destination.

## 6. Remaining actions (in order)

| # | Action | Owner | Notes |
| --- | --- | --- | --- |
| 1 | Inspect the existing `obsidixz.pp.ua` DNS records (A/AAAA/MX/TXT/CNAME) and save a copy | Founder | Sandbox egress blocked; must be done with real DNS access |
| 2 | Add apex A/AAAA records from §3a, preserving MX/TXT and business subdomains | Founder | Do not touch `realestate.`/`commercial.` |
| 3 | Pages → Source: GitHub Actions; Custom domain `obsidixz.pp.ua`; save | Founder | Owner access required |
| 4 | Merge this work to `main` so `deploy.yml` runs | Founder | First deployment |
| 5 | Wait for certificate, then tick **Enforce HTTPS** | Founder | No fixed issuance time promised |
| 6 | Run the §4 checks against the live domain and record the results here | Founder | Implementation tested locally; live deployment not verified from this sandbox |
| 7 | Switch the Commercial link when its HTTPS works (§5) | Founder | Optional until verified |

## 7. Rollback

The site holds no data. To roll back, revert the commit on `main` (or re-run a previous successful
`deploy` workflow from the Actions tab); Pages will serve the earlier `dist/`. No DNS change is
needed for a content rollback.

## 8. Notes and known constraints

- `.nojekyll` is published so `/…/_astro/*` files are served untouched.
- The build uses the production origin from `astro.config.mjs` for canonicals, Open Graph URLs and
  the sitemap **at build time**. If you ever publish a staging build, override `site` in
  `astro.config.mjs` and add `noindex` so a preview cannot compete with production.
- `server.allowedHosts` in `astro.config.mjs` only affects `astro dev` / `astro preview` (it permits
  the sandbox preview proxy). It has no effect on the deployed static output.
- No environment variables or secrets are required. Do not add any for email: the site only opens
  the visitor's own mail client.
