/**
 * Rendered-browser checks and screenshots for the production build.
 *
 * Dependencies (declared in package.json, installed by `npm ci`):
 *   - @sparticuz/chromium   bundled Chromium binary (no browser CDN download)
 *   - puppeteer-core        drives that binary
 *
 * On a normal machine with a system Chromium, set CHROME_PATH to its executable
 * and the packaged binary is skipped.
 *
 * Linux system libraries are required for Chromium to start. GitHub-hosted
 * ubuntu-latest has them; a minimal sandbox may not (see CONTINUATION.md for the
 * NSPR/NSS build procedure used in this workspace).
 *
 * Usage (serve dist/ first: `npm run preview -- --port 4321`):
 *   node scripts/rendered-checks.mjs check     # 5 widths × routes, overflow/console/requests
 *   node scripts/rendered-checks.mjs interact  # menu + clipboard + keyboard behaviour
 *   node scripts/rendered-checks.mjs nojs      # JavaScript disabled behaviour
 *   node scripts/rendered-checks.mjs zoom      # 200% root font-size simulation
 *   node scripts/rendered-checks.mjs shots     # screenshot set → verification/screenshots/
 *   node scripts/rendered-checks.mjs all
 *
 * Environment:
 *   BASE_URL    target origin (default http://127.0.0.1:4321)
 *   SHOTS_DIR   screenshot output directory
 *
 * Honest limits:
 *   - "zoom" simulates a 200% root font-size; it is not the same as real browser
 *     zoom, which puppeteer-core cannot drive reliably. Real zoom is checked
 *     manually and reported separately.
 *   - This harness cannot verify the live GitHub Pages deployment; point
 *     BASE_URL at any reachable instance to check another environment.
 */
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = process.env.SHOTS_DIR ?? join(ROOT, 'verification', 'screenshots');

const ROUTES = ['/', '/about/', '/businesses/', '/contact/', '/privacy/', '/terms/'];
/** A path that must produce the 404 page, checked separately from the route sweep. */
const MISSING_PATH = '/a-page-that-does-not-exist/';
const WIDTHS = [320, 390, 768, 1024, 1440];
const EXACT_MAILTO =
  'mailto:obsidixz@outlook.com?subject=Obsidixz%20%E2%80%94%20Website%20enquiry';

const mode = process.argv[2] ?? 'check';
const failures = [];
const fail = (msg) => {
  failures.push(msg);
  console.error(`FAIL  ${msg}`);
};
const ok = (msg) => console.log(`ok    ${msg}`);

const executablePath = process.env.CHROME_PATH ?? (await chromium.executablePath());
const browser = await puppeteer.launch({
  executablePath,
  args: chromium.args,
  headless: true,
  protocolTimeout: 120_000,
  defaultViewport: { width: 1440, height: 900 },
});

const newPage = async (width, height = 900, extra = {}) => {
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  if (extra.javaScriptEnabled === false) await page.setJavaScriptEnabled(false);
  return page;
};

/** Scrolls the page so lazy images load, then waits for every image to finish. */
async function settle(page) {
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const limit = Math.min(document.documentElement.scrollHeight, 30000);
    const step = Math.max(240, Math.floor(window.innerHeight * 0.9));

    for (let y = 0; y <= limit; y += step) {
      window.scrollTo(0, y);
      await sleep(50);
    }

    // Any remaining lazy images are forced to load before the assertion pass.
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      img.loading = 'eager';
    });
    window.scrollTo(0, 0);

    await Promise.race([
      Promise.all(
        Array.from(document.images).map((img) =>
          typeof img.decode === 'function' ? img.decode().catch(() => {}) : Promise.resolve()
        )
      ),
      sleep(6000),
    ]);
    await Promise.race([document.fonts?.ready ?? Promise.resolve(), sleep(2000)]);
  });
  await new Promise((resolve) => setTimeout(resolve, 400));
}

function watch(page, label, { expect404 = false } = {}) {
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    // The branded 404 page intentionally returns a 404 status for unknown paths.
    if (expect404 && /404/.test(message.text())) return;
    fail(`${label}: console error — ${message.text()}`);
  });
  page.on('pageerror', (error) => fail(`${label}: page error — ${error.message}`));
  page.on('requestfailed', (request) => {
    const url = request.url();
    if (url.startsWith('data:')) return;
    fail(`${label}: request failed — ${url} (${request.failure()?.errorText})`);
  });
  page.on('response', (response) => {
    const status = response.status();
    // An expected 404 page legitimately returns one 404 status for its own URL.
    if (expect404 && status === 404) return;
    if (status >= 400) fail(`${label}: HTTP ${status} — ${response.url()}`);
  });
}

/* ------------------------------------------------------------------ check */
async function runCheck() {
  for (const width of WIDTHS) {
    for (const route of ROUTES) {
      const label = `${route} @${width}`;
      const page = await newPage(width);
      watch(page, label);
      const response = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2' });
      if (!response) {
        fail(`${label}: no response`);
        await page.close();
        continue;
      }
      const status = response.status();
      if (status !== 200 && status !== 304) fail(`${label}: status ${status} (expected 200)`);

      await settle(page);

      const report = await page.evaluate(() => {
        const doc = document.documentElement;
        const overflowing = [];
        for (const el of document.querySelectorAll('body *')) {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          const style = getComputedStyle(el);
          if (style.position === 'fixed' || style.visibility === 'hidden') continue;
          if (rect.right > doc.clientWidth + 1 || rect.left < -1) {
            overflowing.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} (${Math.round(rect.left)}→${Math.round(rect.right)})`);
          }
        }
        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          overflowing: overflowing.slice(0, 6),
          brokenImages: Array.from(document.images)
            .filter((img) => img.complete && img.naturalWidth === 0 && img.offsetParent !== null)
            .map((img) => img.currentSrc || img.src),
          visibleNoAlt: Array.from(document.images).filter(
            (img) => img.offsetParent !== null && !img.hasAttribute('alt')
          ).length,
          h1: document.querySelectorAll('h1').length,
          fontFamily: getComputedStyle(document.querySelector('h1')).fontFamily,
          bodyFont: getComputedStyle(document.body).fontFamily,
          fontLoaded: document.fonts.check('700 1rem Montserrat'),
          bodyFontLoaded: document.fonts.check('400 1rem "Open Sans"'),
        };
      });

      if (report.scrollWidth > report.clientWidth + 1)
        fail(`${label}: horizontal overflow (${report.scrollWidth} > ${report.clientWidth}) — ${report.overflowing.join('; ')}`);
      for (const src of report.brokenImages) fail(`${label}: broken visible image ${src}`);
      if (report.visibleNoAlt > 0) fail(`${label}: ${report.visibleNoAlt} visible image(s) without alt`);
      if (width >= 1024 && report.h1 !== 1) fail(`${label}: ${report.h1} h1 elements`);
      if (!report.fontFamily.includes('Montserrat')) fail(`${label}: heading font not applied (${report.fontFamily})`);
      if (!report.bodyFont.includes('Open Sans')) fail(`${label}: body font not applied (${report.bodyFont})`);
      if (!report.fontLoaded || !report.bodyFontLoaded) fail(`${label}: self-hosted webfonts did not load`);

      await page.close();
    }
    ok(`checked ${ROUTES.length} routes at ${width}px`);
  }

  // Expected 404 behaviour: unknown path returns 404 and the branded not-found page.
  const page = await newPage(1280);
  watch(page, '404', { expect404: true });
  let status = 0;
  try {
    const response = await page.goto(`${BASE}${MISSING_PATH}`, { waitUntil: 'networkidle2' });
    status = response?.status() ?? 0;
  } catch {
    status = 0;
  }
  const notFound = await page.evaluate(() => ({
    text: document.body.innerText,
    title: document.title,
  }));
  if (status !== 404) fail(`404: unknown path returned ${status} (expected 404)`);
  if (!notFound.text.includes('This page isn’t here.') && !notFound.text.includes("This page isn't here."))
    fail('404: branded not-found content not served');
  if (!/noindex/.test(await page.content())) fail('404: not marked noindex');
  ok('unknown routes return the branded 404 page with a 404 status');
  await page.close();
}

/* --------------------------------------------------------------- interact */
async function runInteract() {
  // Mobile menu
  const page = await newPage(390, 844);
  watch(page, 'menu');
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle2' });
  await settle(page);

  const toggle = '[data-testid="menu-toggle"]';
  const panel = '#mobile-menu';

  const state = () =>
    page.evaluate(() => {
      const panelEl = document.querySelector('#mobile-menu');
      const toggleEl = document.querySelector('[data-testid="menu-toggle"]');
      return {
        open: panelEl?.dataset.open === 'true',
        expanded: toggleEl?.getAttribute('aria-expanded'),
        label: toggleEl?.getAttribute('aria-label'),
        role: panelEl?.getAttribute('role'),
        modal: panelEl?.getAttribute('aria-modal'),
        inertMain: document.getElementById('main')?.hasAttribute('inert') ?? false,
        inertFooter: document.getElementById('site-footer')?.hasAttribute('inert') ?? false,
        bodyLocked: document.body.classList.contains('menu-open'),
        focusInPanel: panelEl?.contains(document.activeElement) ?? false,
        focusIs: document.activeElement?.getAttribute('data-testid') ?? document.activeElement?.tagName,
      };
    });

  let current = await state();
  if (current.open) fail('menu: open before interaction');
  if (current.expanded !== 'false') fail('menu: aria-expanded should start false');

  await page.click(toggle);
  await new Promise((r) => setTimeout(r, 300));
  current = await state();
  if (!current.open) fail('menu: did not open on click');
  if (current.expanded !== 'true') fail('menu: aria-expanded not true when open');
  if (current.label !== 'Close menu') fail(`menu: toggle label is "${current.label}"`);
  if (current.role !== 'dialog' || current.modal !== 'true') fail('menu: dialog semantics missing while open');
  if (!current.inertMain || !current.inertFooter) fail('menu: background not isolated with inert');
  if (!current.bodyLocked) fail('menu: body scroll not locked');
  if (!current.focusInPanel) fail('menu: focus not moved into the panel');
  const box = await page.$eval(panel, (el) => {
    const rect = el.getBoundingClientRect();
    return { w: rect.width, h: rect.height, top: rect.top, left: rect.left, visible: getComputedStyle(el).display !== 'none' };
  });
  if (!box.visible || box.w < 300 || box.h < 500) fail(`menu: panel geometry wrong ${JSON.stringify(box)}`);
  ok('menu opens with dialog semantics, focus moved, background inert');

  // Escape closes and returns focus
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 300));
  current = await state();
  if (current.open) fail('menu: Escape did not close the menu');
  if (current.expanded !== 'false') fail('menu: aria-expanded not reset after Escape');
  if (current.role) fail('menu: dialog role left behind after close');
  if (current.inertMain) fail('menu: background still inert after close');
  if (current.bodyLocked) fail('menu: body still locked after close');
  if (current.focusIs !== 'menu-toggle') fail(`menu: focus not returned to the toggle (on ${current.focusIs})`);
  ok('Escape closes, clears semantics and returns focus');

  // Re-open and close with the close button
  await page.click(toggle);
  await new Promise((r) => setTimeout(r, 250));
  await page.click('[data-testid="menu-close"]');
  await new Promise((r) => setTimeout(r, 250));
  current = await state();
  if (current.open) fail('menu: close button did not close the menu');
  ok('close button works');

  // Keyboard: open with Enter, tab stays inside
  await page.focus(toggle);
  await page.keyboard.press('Enter');
  await new Promise((r) => setTimeout(r, 250));
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press('Tab');
    const inside = await page.evaluate((sel) =>
      document.querySelector(sel)?.contains(document.activeElement) ?? false, panel);
    if (!inside) {
      fail(`menu: focus escaped the panel after ${i + 1} tabs`);
      break;
    }
  }
  ok('keyboard opens; Tab stays inside the dialog');

  // Resize to desktop closes the menu
  await page.setViewport({ width: 1280, height: 900 });
  await new Promise((r) => setTimeout(r, 350));
  current = await state();
  if (current.open) fail('menu: still open after switching to desktop width');
  const desktopNavVisible = await page.evaluate(() =>
    getComputedStyle(document.querySelector('.nav')).display !== 'none');
  if (!desktopNavVisible) fail('menu: desktop navigation not visible at 1280px');
  ok('resize closes the menu and reveals desktop navigation');

  await page.close();

  // Clipboard success path
  const copyPage = await newPage(1280, 900);
  watch(copyPage, 'copy-success');
  await copyPage.goto(`${BASE}/contact/`, { waitUntil: 'networkidle2' });
  await copyPage.evaluate(() => {
    window.__copied = null;
    navigator.clipboard.writeText = async (text) => {
      window.__copied = text;
    };
  });
  const copySelector = '[data-testid="general-email-copy"]';
  const copyVisible = await copyPage.$eval(copySelector, (el) => !el.hidden);
  if (!copyVisible) fail('copy: button is hidden even though JavaScript is enabled');
  await copyPage.click(copySelector);
  await new Promise((r) => setTimeout(r, 200));
  const copied = await copyPage.evaluate(() => ({
    value: window.__copied,
    status: document.querySelector('[data-copy-status]')?.textContent?.trim(),
    state: document.querySelector('[data-copy-status]')?.dataset.state,
  }));
  if (copied.value !== 'obsidixz@outlook.com') fail(`copy: clipboard value was ${copied.value}`);
  if (copied.status !== 'Email address copied') fail(`copy: status was "${copied.status}"`);
  if (copied.state !== 'success') fail('copy: status state not marked success');
  ok('clipboard success copies the general address and announces it');

  // Clipboard denied path
  await copyPage.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw new Error('denied');
    };
    document.execCommand = () => false;
    const status = document.querySelector('[data-copy-status]');
    if (status) status.textContent = '';
  });
  await copyPage.click(copySelector);
  await new Promise((r) => setTimeout(r, 300));
  const denied = await copyPage.evaluate(() =>
    document.querySelector('[data-copy-status]')?.textContent?.trim());
  if (denied !== 'Copy unavailable. Select and copy the email address above.')
    fail(`copy: denial message was "${denied}"`);
  ok('clipboard denial shows the fallback instruction');

  // Legacy path
  await copyPage.evaluate(() => {
    navigator.clipboard.writeText = undefined;
    document.execCommand = (command) => command === 'copy';
  });
  await copyPage.click(copySelector);
  await new Promise((r) => setTimeout(r, 250));
  const legacy = await copyPage.evaluate(() => ({
    status: document.querySelector('[data-copy-status]')?.textContent?.trim(),
    hidden: document.querySelector('[data-testid="general-email-copy"]')?.hidden,
  }));
  if (legacy.status !== 'Email address copied') fail(`copy: legacy fallback status "${legacy.status}"`);
  if (legacy.hidden) fail('copy: button hidden after interaction');
  ok('legacy execCommand fallback still reports success');

  // Exact general mailto on every CTA that should carry it
  const mailtos = await copyPage.evaluate(() =>
    Array.from(document.querySelectorAll('a[href^="mailto:obsidixz@outlook.com"]')).map((a) => ({
      href: a.getAttribute('href'),
      text: a.textContent?.trim().slice(0, 24),
    })));
  const primary = mailtos.filter((m) => m.href === 'mailto:obsidixz@outlook.com?subject=Obsidixz%20%E2%80%94%20Website%20enquiry');
  if (primary.length === 0) fail(`exact general mailto missing on /contact/ (found ${JSON.stringify(mailtos)})`);
  ok(`exact general mailto present (${primary.length} primary CTAs)`);

  await copyPage.close();
}

/* -------------------------------------------------------------------- nojs */
async function runNoJs() {
  const page = await newPage(390, 900);
  await page.setJavaScriptEnabled(false);
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const report = await page.evaluate(() => {
    const panel = document.querySelector('#mobile-menu');
    const links = Array.from(panel?.querySelectorAll('a[href]') ?? []).map((a) => a.textContent?.trim());
    return {
      panelDisplay: panel ? getComputedStyle(panel).display : 'missing',
      panelPosition: panel ? getComputedStyle(panel).position : 'missing',
      links,
      toggleDisplay: getComputedStyle(document.querySelector('[data-testid="menu-toggle"]')).display,
      role: panel?.getAttribute('role') ?? null,
      copyHidden: document.querySelector('[data-copy-email]')?.hidden ?? null,
      h1: document.querySelector('h1')?.textContent?.trim(),
      mailto: document.querySelector('[data-testid="cta-email"]')?.getAttribute('href'),
      visibleText: document.body.innerText.length,
    };
  });
  if (report.panelDisplay === 'none') fail('no-js: menu panel hidden, navigation unusable');
  if (report.panelPosition === 'fixed') fail('no-js: menu panel is a fixed overlay');
  if (report.role) fail('no-js: dialog semantics present without JavaScript');
  if (report.toggleDisplay !== 'none') fail('no-js: hamburger toggle still visible');
  if (report.copyHidden === false) fail('no-js: copy button is visible without JavaScript');
  if (!report.links.some((link) => link.includes('Our Businesses')))
    fail(`no-js: nav links missing (${report.links.join(', ')})`);
  if (report.mailto !== EXACT_MAILTO) fail(`no-js: general mailto wrong (${report.mailto})`);
  if (report.visibleText < 1200) fail('no-js: page content appears missing');
  ok('no-JS: static navigation, no dialog semantics, email links intact');

  const desktop = await newPage(1280, 900);
  await desktop.setJavaScriptEnabled(false);
  await desktop.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const desktopPanel = await desktop.evaluate(() =>
    getComputedStyle(document.querySelector('#mobile-menu')).display);
  if (desktopPanel !== 'none') fail('no-js: duplicate menu panel visible at desktop width');
  ok('no-JS: desktop width hides the static panel');

  await page.close();
  await desktop.close();
}

/* -------------------------------------------------------------------- zoom */
async function runZoom() {
  for (const width of [390, 1440]) {
    for (const route of ROUTES) {
      const page = await newPage(width, 900);
      watch(page, `zoom ${route} @${width}`);
      await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2' });
      await page.addStyleTag({ content: 'html { font-size: 32px !important; }' });
      await settle(page);
      const report = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      if (report.scrollWidth > report.clientWidth + 1)
        fail(
          `zoom ${route} @${width}: horizontal overflow at 200% root font-size ` +
            `(${report.scrollWidth} > ${report.clientWidth})`
        );
      await page.close();
    }
    ok(`200% root font-size clean at ${width}px across ${ROUTES.length} routes`);
  }
}

/* ------------------------------------------------------------------- shots */
async function runShots() {
  mkdirSync(SHOTS, { recursive: true });

  const shot = async ({ name, route, width, height = 900, fullPage = false, after, at, expect404 = false }) => {
    const page = await newPage(width, height);
    watch(page, name, { expect404 });
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2' });
    await settle(page);
    if (at) {
      await page.evaluate((selector) => {
        const target = document.querySelector(selector);
        target?.scrollIntoView({ block: 'start', behavior: 'instant' });
      }, at);
      // Offset for the sticky header so the section heading is not hidden.
      await page.evaluate(() => window.scrollBy(0, -140));
    }
    if (after) await after(page);
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: join(SHOTS, `${name}.png`), fullPage });
    const metrics = await page.evaluate(() => ({
      scrollHeight: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    console.log(`shot  ${name}.png  ${width}×${fullPage ? metrics.scrollHeight : height}`);
    await page.close();
  };

  await shot({ name: 'home-desktop-header-hero-1440x900', route: '/', width: 1440 });
  await shot({ name: 'home-desktop-full-1440', route: '/', width: 1440, fullPage: true });
  await shot({ name: 'home-lower-businesses-1440x900', route: '/', width: 1440, at: '#real-estate' });
  await shot({ name: 'home-lower-commercial-1440x900', route: '/', width: 1440, at: '#commercial' });
  await shot({ name: 'home-lower-studio-1440x900', route: '/', width: 1440, at: '.studio' });
  await shot({ name: 'home-lower-foundation-1440x900', route: '/', width: 1440, at: '#foundation-title' });
  await shot({ name: 'home-editorial-1440x900', route: '/', width: 1440, at: '#approach-title' });
  await shot({ name: 'home-invite-1440x900', route: '/', width: 1440, at: '#invite-title' });
  await shot({ name: 'home-mobile-390x844', route: '/', width: 390, height: 844, fullPage: true });
  await shot({ name: 'home-mobile-hero-390x844', route: '/', width: 390, height: 844 });
  await shot({ name: 'home-mobile-parent-390x844', route: '/', width: 390, height: 844, at: '#parent-title' });
  await shot({ name: 'home-mobile-real-estate-390x844', route: '/', width: 390, height: 844, at: '#real-estate' });
  await shot({ name: 'home-mobile-commercial-390x844', route: '/', width: 390, height: 844, at: '#commercial' });
  await shot({ name: 'home-mobile-studio-390x844', route: '/', width: 390, height: 844, at: '.studio' });
  await shot({ name: 'home-mobile-foundation-390x844', route: '/', width: 390, height: 844, at: '#foundation-title' });
  await shot({ name: 'home-mobile-editorial-390x844', route: '/', width: 390, height: 844, at: '#approach-title' });
  await shot({ name: 'home-mobile-invite-390x844', route: '/', width: 390, height: 844, at: '#invite-title' });
  await shot({ name: 'home-mobile-footer-390x844', route: '/', width: 390, height: 844, at: '#site-footer' });
  await shot({ name: 'mobile-menu-expanded-390x844', route: '/', width: 390, height: 844, after: async (page) => {
    await page.click('[data-testid="menu-toggle"]');
    await new Promise((r) => setTimeout(r, 450));
  } });
  await shot({ name: 'businesses-desktop-1440x900', route: '/businesses/', width: 1440 });
  await shot({ name: 'businesses-desktop-full-1440', route: '/businesses/', width: 1440, fullPage: true });
  await shot({ name: 'businesses-mobile-390x844', route: '/businesses/', width: 390, height: 844, fullPage: true });
  await shot({ name: 'contact-desktop-1440x900', route: '/contact/', width: 1440 });
  await shot({ name: 'contact-mobile-390x844', route: '/contact/', width: 390, height: 844, fullPage: true });
  await shot({ name: 'about-desktop-1440x900', route: '/about/', width: 1440 });
  await shot({ name: 'about-mobile-390x844', route: '/about/', width: 390, height: 844, fullPage: true });
  await shot({ name: 'privacy-desktop-1440x900', route: '/privacy/', width: 1440 });
  await shot({ name: 'terms-desktop-1440x900', route: '/terms/', width: 1440 });
  await shot({ name: 'not-found-1440x900', route: MISSING_PATH, width: 1440, expect404: true });
  await shot({ name: 'tablet-home-768x1024', route: '/', width: 768, height: 1024 });
  await shot({ name: 'mobile-home-320x700', route: '/', width: 320, height: 700 });
}

/* -------------------------------------------------------------------- main */
try {
  if (mode === 'check' || mode === 'all') await runCheck();
  if (mode === 'interact' || mode === 'all') await runInteract();
  if (mode === 'nojs' || mode === 'all') await runNoJs();
  if (mode === 'zoom' || mode === 'all') await runZoom();
  if (mode === 'shots') await runShots();
} catch (error) {
  fail(`harness error — ${error.message}`);
} finally {
  await browser.close();
}

console.log(`\n${failures.length} failure(s).`);
if (failures.length > 0) process.exit(1);
console.log(`Rendered checks passed (${mode}).`);
