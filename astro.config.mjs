// @ts-check
import { defineConfig } from 'astro/config';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

// Öffentliche Seiten werden statisch vorgerendert; nur die von Keystatic
// injizierten Routen (/keystatic, /api/keystatic) laufen on-demand (prerender:false).
// Der Adapter ist später für eigenen Server auf @astrojs/node tauschbar.
export default defineConfig({
  adapter: netlify(),
  integrations: [react(), keystatic()],
});
