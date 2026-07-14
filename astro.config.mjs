import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import { remarkReadingTime } from './src/shared/utils/remark-reading-time.mjs';

const SITE_URL = 'https://jsdev.space';
const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));

const estimateWordCount = (content = '') => {
  const text = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/import\s+.*?from\s+['"].*?['"];?/g, ' ')
    .replace(/[{}[\]()*_#>`~|=:+/\\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return text ? text.split(/\s+/).filter(Boolean).length : 0;
};

const readContentFiles = dir => {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return readContentFiles(fullPath);
    }

    return /\.(md|mdx)$/.test(entry.name) ? [fullPath] : [];
  });
};

const extractFrontmatterValue = (frontmatter, key) => {
  const match = frontmatter.match(
    new RegExp(`^${key}:\\s*['"]?([^'"\\r\\n]+)['"]?\\s*$`, 'm')
  );

  return match?.[1]?.trim();
};

const createThinContentUrlSet = () => {
  const contentDirs = ['posts', 'howtos', 'snippets'].map(dir =>
    path.join(ROOT_DIR, 'src', 'content', dir)
  );

  const urls = new Set();

  for (const file of contentDirs.flatMap(readContentFiles)) {
    const source = fs.readFileSync(file, 'utf8');
    const match = source.match(
      /^\s*---[^\S\r\n]*\r?\n([\s\S]*?)\r?\n---[^\S\r\n]*\r?\n?([\s\S]*)$/
    );

    if (!match) {
      continue;
    }

    const [, frontmatter, body] = match;
    const permalink = extractFrontmatterValue(frontmatter, 'permalink');
    const isDraft = extractFrontmatterValue(frontmatter, 'isDraft') === 'true';

    if (!permalink || isDraft || estimateWordCount(body) >= 250) {
      continue;
    }

    urls.add(`${SITE_URL}/${permalink.replace(/^\/+|\/+$/g, '')}/`);
  }

  return urls;
};

const thinContentUrls = createThinContentUrlSet();

const isNoindexSitemapUrl = page => {
  const { pathname } = new URL(page);

  return (
    page === `${SITE_URL}/thanks/` ||
    thinContentUrls.has(page) ||
    /^\/\d+\/$/.test(pathname) ||
    /^\/(howto|snippets|friday)\/\d+\/$/.test(pathname) ||
    /^\/(?!tag\/)[^/]+\/\d+\/$/.test(pathname) ||
    /^\/howto\/[^/]+\/\d+\/$/.test(pathname) ||
    /^\/tag\/[^/]+\/\d+\/$/.test(pathname)
  );
};

export default defineConfig({
  site: SITE_URL,
  alias: {
    '@': './src',
  },

  integrations: [
    mdx(),
    sitemap({
      filter: page => !isNoindexSitemapUrl(page),
    }),
  ],
  adapter: netlify(),

  markdown: {
    processor: unified({
      remarkPlugins: [remarkReadingTime],
    }),
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
    inlineStylesheets: 'always',
  },

  vite: {
    build: {
      cssMinify: true,
    },
  },
});
