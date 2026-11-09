import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Intended production origin. Used for canonical URLs, Open Graph URLs and the sitemap.
// Local development is unaffected: `astro dev` serves on http://localhost:4321.
//
// PREVIEW_ALLOWED_HOSTS (optional, comma-separated) adds hostnames permitted by the
// dev/preview server. `.e2b.app` covers the sandbox preview proxy used during
// development; these settings only affect local dev/preview, never the static output.
const previewAllowedHosts = (process.env.PREVIEW_ALLOWED_HOSTS ?? '')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);

export default defineConfig({
  site: 'https://obsidixz.pp.ua',
  trailingSlash: 'ignore',
  server: {
    allowedHosts: [...previewAllowedHosts, '.e2b.app'],
  },
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.8,
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
