/**
 * Structural verification of the production build in `dist/`.
 *
 * Runs without a browser: it checks the generated HTML, assets and metadata.
 * Rendered behaviour (layout, menu, clipboard) is covered by
 * `scripts/rendered-checks.mjs`.
 *
 * Usage: npm run build && npm run verify
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const ORIGIN = 'https://obsidixz.pp.ua';

const PAGES = [
  { file: 'index.html', path: '/', title: 'Obsidixz | Our Businesses and Shared Foundation' },
  { file: 'about/index.html', path: '/about/' },
  { file: 'businesses/index.html', path: '/businesses/' },
  { file: 'contact/index.html', path: '/contact/' },
  { file: 'privacy/index.html', path: '/privacy/' },
  { file: 'terms/index.html', path: '/terms/' },
  { file: '404.html', path: '/404.html' },
];

const REQUIRED_FILES = [
  'robots.txt',
  'sitemap-index.xml',
  'site.webmanifest',
  'favicon.ico',
  'favicon-32x32.png',
  'favicon-16x16.png',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'og/obsidixz-sharing.jpg',
  'brand/obsidixz-parent-logo-on-light.png',
  'brand/obsidixz-parent-logo-on-dark.png',
  'brand/obsidixz-parent-symbol-transparent.png',
  '.nojekyll',
];

const EXACT_MAILTO =
  'mailto:obsidixz@outlook.com?subject=Obsidixz%20%E2%80%94%20Website%20enquiry';

const failures = [];
const notes = [];
const pass = (msg) => notes.push(`PASS  ${msg}`);
const fail = (msg) => {
  failures.push(msg);
  console.error(`FAIL  ${msg}`);
};

const read = (file) => readFileSync(join(DIST, file), 'utf8');

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}

/* ---------- Required files ---------- */
for (const file of REQUIRED_FILES) {
  if (!existsSync(join(DIST, file))) fail(`missing file: ${file}`);
}
pass(`required files present (${REQUIRED_FILES.length} checked)`);

/* ---------- Pages ---------- */
const seenTitles = new Map();
const seenDescriptions = new Map();

for (const page of PAGES) {
  if (!existsSync(join(DIST, page.file))) {
    fail(`missing page: ${page.file}`);
    continue;
  }
  const html = read(page.file);
  const label = page.path;

  // Title + description
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1]?.trim();
  if (!title) fail(`${label}: no <title>`);
  else if (seenTitles.has(title)) fail(`${label}: duplicate title with ${seenTitles.get(title)}`);
  else seenTitles.set(title, label);

  if (page.title && title !== page.title) fail(`${label}: expected title "${page.title}", got "${title}"`);

  const description = html.match(/<meta name="description" content="(.*?)"/s)?.[1]?.trim();
  if (!description) fail(`${label}: no meta description`);
  else if (!page.path.startsWith('/404')) {
    if (seenDescriptions.has(description))
      fail(`${label}: duplicate meta description with ${seenDescriptions.get(description)}`);
    else seenDescriptions.set(description, label);
    if (description.length < 70 || description.length > 200)
      fail(`${label}: meta description length ${description.length} (expect 70–200)`);
  }

  // Canonical
  if (page.path === '/404.html') {
    if (!/name="robots" content="noindex/.test(html)) fail(`${label}: 404 should be noindex`);
  } else {
    const canonical = html.match(/<link rel="canonical" href="(.*?)"/)?.[1];
    if (canonical !== `${ORIGIN}${page.path}`)
      fail(`${label}: canonical is ${canonical ?? 'missing'}, expected ${ORIGIN}${page.path}`);
    if (!/name="robots" content="index, follow"/.test(html))
      fail(`${label}: robots meta should allow indexing`);
  }

  // Single H1
  const h1s = [...html.matchAll(/<h1[^>]*>/g)];
  if (h1s.length !== 1) fail(`${label}: expected exactly one <h1>, found ${h1s.length}`);

  // Shell
  if (!/<html lang="en-GB"/.test(html)) fail(`${label}: missing lang attribute`);
  if (!/name="viewport"/.test(html)) fail(`${label}: missing viewport meta`);
  if (!/class="skip-link"/.test(html)) fail(`${label}: missing skip link`);
  if (!/id="main"/.test(html)) fail(`${label}: missing main landmark`);

  // General contact route and email addresses
  if (!html.includes(EXACT_MAILTO)) fail(`${label}: exact general mailto not found`);
  if (!html.includes('obsidixz@outlook.com')) fail(`${label}: missing the general contact address`);
  if (
    (page.path === '/businesses/' || page.path === '/contact/') &&
    (!html.includes('obsidixz.realestate@outlook.com') ||
      !html.includes('obsidixz.commercial@outlook.com'))
  ) {
    fail(`${label}: missing a business contact address`);
  }

  // Social metadata
  const ogImage = html.match(/property="og:image" content="(.*?)"/)?.[1];
  if (ogImage !== `${ORIGIN}/og/obsidixz-sharing.jpg`) fail(`${label}: og:image is ${ogImage ?? 'missing'}`);
  if (!/property="og:url" content="https:\/\/obsidixz\.pp\.ua/.test(html)) fail(`${label}: og:url must use the production origin`);

  // Leaks
  if (/localhost|127\.0\.0\.1|e2b\.app|\.vercel\.app|netlify\.app/i.test(html))
    fail(`${label}: contains a development or preview URL`);

  // Images: alt + local asset existence
  for (const tag of html.match(/<img\b[^>]*>/g) ?? []) {
    if (!/\balt=/.test(tag)) fail(`${label}: <img> without alt: ${tag.slice(0, 90)}`);
    const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
    if (src?.startsWith('/') && !src.startsWith('/_astro/')) {
      if (!existsSync(join(DIST, src))) fail(`${label}: missing image ${src}`);
    }
  }

  // Local links resolve
  for (const tag of html.match(/<a\b[^>]*>/g) ?? []) {
    const href = tag.match(/href="([^"]+)"/)?.[1];
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) continue;
    const clean = href.split('#')[0].replace(/\/$/, '');
    if (!clean) continue;
    const candidates = [
      join(DIST, clean),
      join(DIST, `${clean}.html`),
      join(DIST, clean, 'index.html'),
    ];
    if (!candidates.some((path) => existsSync(path) && statSync(path).isFile()))
      fail(`${label}: broken internal link ${href}`);
  }

  // Keyboard-visible focus styles are global; confirm the rule shipped
  // via the external stylesheet reference.
  if (!/rel="stylesheet"/.test(html)) fail(`${label}: no stylesheet linked`);
}
pass(`pages checked: ${PAGES.length}`);

/* ---------- Unique titles/descriptions ---------- */
if (seenTitles.size !== PAGES.length) fail('titles are not unique across pages');
else pass('all page titles are unique');

/* ---------- Assets referenced by CSS/HTML exist ---------- */
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const distFiles = walk(DIST);
for (const file of distFiles.filter((f) => f.endsWith('.html') || f.endsWith('.css'))) {
  const content = readFileSync(file, 'utf8');
  for (const match of content.matchAll(/\/_astro\/[A-Za-z0-9_.\-]+/g)) {
    const asset = match[0];
    if (!existsSync(join(DIST, asset))) fail(`${file.replace(DIST + '/', '')}: missing asset ${asset}`);
  }
}
pass('all /_astro asset references resolve');

/* ---------- Fonts self-hosted, no third-party embeds ---------- */
const allHtml = distFiles.filter((f) => f.endsWith('.html')).map((f) => readFileSync(f, 'utf8'));
for (const html of allHtml) {
  for (const remote of [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'google-analytics',
    'googletagmanager',
    'facebook.net',
    'youtube.com/embed',
    'cdn.jsdelivr',
  ]) {
    if (html.includes(remote)) fail(`third-party embed or font host found: ${remote}`);
  }
}
pass('no third-party font/CDN/tracker hosts in HTML');

const woff2 = distFiles.filter((f) => f.endsWith('.woff2'));
if (woff2.length === 0) fail('no self-hosted font files in dist');
else pass(`self-hosted font files: ${woff2.length}`);

/* ---------- Sitemap ---------- */
const sitemapDir = readdirSync(DIST).filter((f) => f.startsWith('sitemap'));
const sitemapFiles = sitemapDir.filter((f) => f.endsWith('.xml'));
const sitemapXml = sitemapFiles.map((f) => readFileSync(join(DIST, f), 'utf8')).join('\n');
for (const page of PAGES.filter((p) => p.path !== '/404.html')) {
  const url = `${ORIGIN}${page.path}`;
  if (!sitemapXml.includes(`<loc>${url}</loc>`)) fail(`sitemap missing ${url}`);
}
if (sitemapXml.includes('/404')) fail('sitemap should not include the 404 page');
if (!existsSync(join(DIST, 'sitemap-index.xml'))) fail('sitemap-index.xml missing');
pass(`sitemap checked (${sitemapFiles.join(', ')})`);

/* ---------- robots ---------- */
const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap-index.xml`)) fail('robots.txt sitemap URL incorrect');
if (!/User-agent: \*/i.test(robots)) fail('robots.txt missing user-agent rule');
pass('robots.txt points at the production sitemap');

/* ---------- Brand artwork dimensions ---------- */
const pngInfo = (file) => {
  const buffer = readFileSync(join(DIST, file));
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
};
const lightLogo = pngInfo('brand/obsidixz-parent-logo-on-light.png');
const darkLogo = pngInfo('brand/obsidixz-parent-logo-on-dark.png');
const symbol = pngInfo('brand/obsidixz-parent-symbol-transparent.png');
if (lightLogo.width !== 931 || lightLogo.height !== 785) fail('on-light logo dimensions changed');
if (darkLogo.width !== 931 || darkLogo.height !== 785) fail('on-dark logo dimensions changed');
if (symbol.width !== 2000 || symbol.height !== 1500) fail('symbol dimensions changed');
pass('brand artwork dimensions unchanged (931×785 lockup, 2000×1500 symbol)');

/* ---------- Claim hygiene (documents must not overstate) ---------- */
const claimPatterns = [
  /\b(we|obsidixz) (are|is) (a )?registered (company|office|subsidiary)/i,
  /registered (company|office) (number|no\.)/i,
  /est(ablished)?\.? ?(in )?(19|20)\d{2}/i,
  /\b(our team of|our employees|our staff)\b/i,
  /\b(award[- ]winning|iso[- ]certified)\b/i,
];
for (const file of distFiles.filter((f) => f.endsWith('.html'))) {
  const text = readFileSync(file, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
  for (const pattern of claimPatterns) {
    if (pattern.test(text)) fail(`${file.replace(DIST + '/', '')}: unsupported claim pattern ${pattern}`);
  }
}
pass('claim-hygiene patterns absent');

/* ---------- Result ---------- */
console.log(`\n${notes.length} checks passed, ${failures.length} failed.`);
if (failures.length > 0) process.exit(1);
console.log('Structural verification passed.');
