import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import { remarkReadingTime } from './src/shared/utils/remark-reading-time.mjs';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://jsdev.space',
  output: 'static',

  integrations: [
    mdx(),
    sitemap(),
  ],

  markdown: {
    remarkPlugins: [remarkReadingTime],
    syntaxHighlight: 'prism',
    gfm: true,
  },

  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },

  adapter: node({
    mode: 'standalone',
  }),
});