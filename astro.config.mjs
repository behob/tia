// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://tiadecors.com',
  integrations: [
    sitemap({
      filter: (url) =>
        !/^\/(?:index-[2-9]|blog-(?:list|standard|single|details)|search|404|error-page|coming-soon)(?:\/|$)/.test(
          new URL(url).pathname,
        ),
    }),
  ],
  adapter: cloudflare({
    imageService: 'compile',
  }),
  output: 'static',
});
