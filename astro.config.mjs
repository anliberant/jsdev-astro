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

  output: 'static',
  adapter: netlify(),

  markdown: {
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  },

  build: {
    inlineStylesheets: 'auto',
  },

  vite: {
    build: {
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Разделяем по папкам
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            if (id.includes('src/features/search')) {
              return 'search';
            }
            if (id.includes('src/features/tools')) {
              return 'tools';
            }
            if (id.includes('src/shared/ui')) {
              return 'ui';
            }
          },
        }
      }
    }
  }
});