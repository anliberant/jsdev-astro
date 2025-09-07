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
  },

  build: {
    inlineStylesheets: 'auto',
    rollupOptions: {
      output: {
        manualChunks: {
          'html-converters': [
            'src/features/tools/html/jsx/lib/converter-controller.ts',
            'src/features/tools/html/pug/lib/converter-controller.ts',
            'src/features/tools/html/astro/lib/converter-controller.ts',
          ],
          'html-utilities': [
            'src/features/tools/html/encoder/lib/encoder-controller.ts',
            'src/features/tools/html/tag-remover/lib/tag-remover-controller.ts',
            'src/features/tools/html/markdown/lib/converter-controller.ts',
          ],
          'css-tools': [
            'src/features/tools/css/box-shadow/lib/box-shadow-controller.ts',
            'src/features/tools/css/neobrutalism/lib/neobrutalism-controller.ts',
          ],
          'html-generators': [
            'src/features/tools/html/table/lib/table-generator-controller.ts',
            'src/features/tools/html/iframe/lib/iframe-controller.ts',
            'src/features/tools/html/boilerplate/lib/generator-controller.ts',
          ]
        }
      }
    }
  },

  vite: {
    build: {
      cssMinify: true,
      rollupOptions: {
        external: (id) => {
          if (id === 'netlify-blobs') {
            return true;
          }
          return id.includes('/tools/') && id.includes('/lib/') && id.includes('-controller');
        },
        output: {
          manualChunks: (id) => {
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