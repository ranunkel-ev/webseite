// @ts-check
import { defineConfig } from 'astro/config';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react(), keystatic()],
});
