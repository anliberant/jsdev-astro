import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import { remarkReadingTime } from './src/shared/utils/remark-reading-time.mjs';

import netlify from '@astrojs/netlify';

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

  adapter: netlify(),
});