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
  vite: {
    ssr: {
      // The /api/keystatic route imports keystatic.config.ts, which pulls in the
      // documentLink NodeView and with it the whole Keystar editor UI. Left
      // external, those packages are resolved by Node at runtime - and they ship
      // ESM syntax inside .js files without declaring "type": "module", which
      // Node's ESM loader rejects ("does not provide an export named ..."), so
      // every /api/keystatic request dies with an empty 500. Bundling them
      // resolves the imports at build time, where the syntax is unambiguous.
      noExternal: [
        /^@keystar\//,
        /^@keystatic\//,
        // Both the scoped packages and the umbrella ones - Keystar imports from
        // `react-aria/...` and `react-stately/...`, which re-export the scoped
        // `@react-aria/*` packages and would drag them back in as externals.
        /^@?react-aria(\/|$)/,
        /^@?react-stately(\/|$)/,
        /^@react-types\//,
        /^@internationalized\//,
      ],
    },
  },
});
