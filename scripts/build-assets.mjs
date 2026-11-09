/**
 * Derives the website icon set and the social-sharing image from supplied artwork.
 *
 * Sources (both authentic, supplied by the founder):
 *   public/brand/obsidixz-parent-symbol-transparent.png   (2000×1500, transparent)
 *   public/brand/obsidixz-parent-logo-on-dark.png         (931×785, transparent)
 *   src/assets/images/hero-architecture.jpg               (generated for this project)
 *
 * Processing is limited to: trimming transparent padding, proportional resizing,
 * square padding and compositing on a background. The emblem and wordmark are
 * never redrawn, recoloured or distorted.
 *
 * Usage: npm run assets
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
const SYMBOL = join(PUBLIC, 'brand', 'obsidixz-parent-symbol-transparent.png');
const LOCKUP_DARK = join(PUBLIC, 'brand', 'obsidixz-parent-logo-on-dark.png');
const HERO = join(ROOT, 'src', 'assets', 'images', 'hero-architecture.jpg');

/** Alpha bounding box, so padding is removed without guessing thresholds. */
async function alphaBBox(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let minX = info.width;
  let minY = info.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

const symbolBox = await alphaBBox(SYMBOL);

/** Square icon: trimmed emblem, small even margin, transparent. */
async function emblemIcon(size, { background = { r: 255, g: 255, b: 255, alpha: 1 }, margin = 0.08 } = {}) {
  const inner = Math.round(size * (1 - margin * 2));
  const emblem = await sharp(SYMBOL)
    .extract(symbolBox)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const base = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background,
    },
  });

  return base.composite([{ input: emblem, gravity: 'center' }]).png({ compressionLevel: 9 }).toBuffer();
}

/** Minimal ICO container holding PNG frames (supported by all current browsers). */
function buildIco(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(frames.length, 4);

  const directory = Buffer.alloc(16 * frames.length);
  let offset = header.length + directory.length;

  frames.forEach(({ size, data }, index) => {
    const entry = index * 16;
    directory[entry] = size >= 256 ? 0 : size;
    directory[entry + 1] = size >= 256 ? 0 : size;
    directory[entry + 2] = 0; // palette
    directory[entry + 3] = 0; // reserved
    directory.writeUInt16LE(1, entry + 4); // colour planes
    directory.writeUInt16LE(32, entry + 6); // bits per pixel
    directory.writeUInt32LE(data.length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });

  return Buffer.concat([header, directory, ...frames.map((frame) => frame.data)]);
}

const frames = [];
for (const size of [16, 32, 48]) {
  const data = await emblemIcon(size);
  await writeFile(join(PUBLIC, `favicon-${size}x${size}.png`), data);
  frames.push({ size, data });
}
await writeFile(join(PUBLIC, 'favicon.ico'), buildIco(frames));

await writeFile(join(PUBLIC, 'apple-touch-icon.png'), await emblemIcon(180, {
  background: { r: 255, g: 255, b: 255, alpha: 1 },
  margin: 0.1,
}));
await writeFile(join(PUBLIC, 'icon-192.png'), await emblemIcon(192, {
  background: { r: 255, g: 255, b: 255, alpha: 1 },
  margin: 0.1,
}));
await writeFile(join(PUBLIC, 'icon-512.png'), await emblemIcon(512, {
  background: { r: 255, g: 255, b: 255, alpha: 1 },
  margin: 0.1,
}));

await mkdir(join(PUBLIC, 'og'), { recursive: true });

/* Social card: hero photograph beside a solid brand panel carrying the approved
   dark-background lockup (the emblem's knockout reads correctly on flat black). */
const OG_W = 1200;
const OG_H = 630;
const PANEL_W = 496;
const lockup = await sharp(LOCKUP_DARK)
  .extract(await alphaBBox(LOCKUP_DARK))
  .resize({ width: 300 })
  .toBuffer();
const lockupMeta = await sharp(lockup).metadata();

const panel = Buffer.from(
  `<svg width="${PANEL_W}" height="${OG_H}" xmlns="http://www.w3.org/2000/svg">
     <rect width="${PANEL_W}" height="${OG_H}" fill="#111111"/>
     <rect x="0" y="0" width="4" height="${OG_H}" fill="#b47745"/>
   </svg>`
);

const photo = await sharp(HERO)
  .resize(OG_W - PANEL_W, OG_H, { fit: 'cover', position: 'centre' })
  .toBuffer();

const og = await sharp({
  create: { width: OG_W, height: OG_H, channels: 3, background: '#111111' },
})
  .composite([
    { input: photo, top: 0, left: PANEL_W },
    { input: panel, top: 0, left: 0 },
    {
      input: lockup,
      top: Math.round((OG_H - (lockupMeta.height ?? 0)) / 2),
      left: Math.round((PANEL_W - 300) / 2),
    },
  ])
  .jpeg({ quality: 88, progressive: true, mozjpeg: true })
  .toBuffer();
await writeFile(join(PUBLIC, 'og', 'obsidixz-sharing.jpg'), og);

console.log('Assets written:');
console.log(`  favicon.ico (16/32/48), favicon-16/32/48, apple-touch-icon, icon-192/512`);
console.log(`  og/obsidixz-sharing.jpg (${OG_W}×${OG_H})`);
console.log(`  emblem source box: ${symbolBox.width}×${symbolBox.height} at ${symbolBox.left},${symbolBox.top}`);
