import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';
import { remarkReadingTime } from './src/shared/utils/remark-reading-time.mjs';

export default defineConfig({
  site: 'https://jsdev.space',
  alias: {
    '@': './src'
  },

  integrations: [
    mdx(),
    sitemap(),
  ],
  adapter: netlify(),

  markdown: {
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  }
});