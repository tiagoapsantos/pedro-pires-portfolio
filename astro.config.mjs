import { defineConfig } from 'astro/config';
import { siteOrigin, basePath } from './src/data/publication.ts';
export default defineConfig({ site: siteOrigin, base: basePath, output: 'static', trailingSlash: 'always' });
