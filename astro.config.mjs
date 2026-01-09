import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import { remarkReadingTime } from './src/shared/utils/remark-reading-time.mjs';

export default defineConfig({
  site: 'https://jsdev.space',
  alias: {
    '@': './src',
  },

  integrations: [mdx(), sitemap()],
  adapter: netlify(),

  markdown: {
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      theme: 'dracula',
      themes: {
        light: 'github-light',
        dark: 'dracula',
      },
      wrap: true,
      syntaxHighlight: 'shiki',
    },
  },

  build: {
    inlineStylesheets: 'auto',
  },

  vite: {
    build: {
      cssMinify: true,
    },
  },
});
