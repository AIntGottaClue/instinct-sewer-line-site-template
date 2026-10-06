import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';
import { ACTIVE_CITY } from './city.config.mjs';
const city = JSON.parse(readFileSync(new URL(`./src/data/cities/${ACTIVE_CITY}.json`, import.meta.url), 'utf8'));
export default defineConfig({
  site: city.site.origin,
  trailingSlash: 'always',
  build: { format: 'directory' }
});
