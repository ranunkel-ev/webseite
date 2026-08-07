// @ts-check
import { defineConfig } from 'astro/config';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

// Two build targets from one repo:
//
//   DEPLOY_TARGET=static  -> purely static build for the Strato webspace.
//                            No adapter and no Keystatic integration, because
//                            Strato does not run Node.
//   (unset)               -> Netlify build. Additionally carries the editing
//                            UI: /keystatic and /api/keystatic run on-demand
//                            there (prerender: false).
//
// The Keystatic integration has to be dropped from the static build, otherwise
// Astro fails on the routes it cannot prerender.
const staticOnly = process.env.DEPLOY_TARGET === 'static';

export default defineConfig({
  ...(staticOnly ? {} : { adapter: netlify() }),
  integrations: [react(), ...(staticOnly ? [] : [keystatic()])],
});
