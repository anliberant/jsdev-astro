import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

import { siteConfig } from '@/app/config/site';

const parser = new MarkdownIt();

const MAX_ITEMS = 50;
const MAX_CONTENT_CHARS = 8000;
const MAX_EXCERPT_CHARS = 1200;

function stripTags(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function truncate(text, maxLen) {
  if (!text) return '';
  return text.length > maxLen ? `${text.slice(0, maxLen - 1)}…` : text;
}

function stripMdx(content = '') {
  return content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*import\s+.*$/gm, ' ')
    .replace(/^\s*export\s+.*$/gm, ' ')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[>#*_~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET(context) {
  const allPosts = await getCollection('posts', ({ data }) => !data.isDraft);
  const allHowtos = await getCollection('howtos', ({ data }) => !data.isDraft);
  const allSnippets = await getCollection(
    'snippets',
    ({ data }) => !data.isDraft
  );
  const allFridays = await getCollection(
    'fridays',
    ({ data }) => !data.isDraft
  );

  const allContent = [...allPosts, ...allHowtos, ...allSnippets, ...allFridays];

  const sorted = allContent.sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });

  const site = context.site ?? siteConfig.siteUrl;

  return rss({
    stylesheet: '/rss/styles.xsl',
    title: siteConfig.title,
    description: siteConfig.description,
    site,
    items: sorted.slice(0, MAX_ITEMS).map(entry => {
      const link = `/${String(entry.data.permalink).replace(/^\/|\/$/g, '')}/`;
      const absoluteLink = new URL(link, site).toString();

      const rawHtml = entry.id.endsWith('.mdx')
        ? ''
        : sanitizeHtml(parser.render(entry.body), {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            allowedAttributes: {
              a: ['href', 'name', 'target', 'rel'],
              img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
            },
            allowVulnerableTags: false,
          });

      const fallbackDesc =
        typeof entry.data.desc === 'string' ? entry.data.desc : '';
      const excerptFromHtml = rawHtml ? truncate(stripTags(rawHtml), 260) : '';
      const excerptFromMdx = !rawHtml
        ? truncate(stripMdx(entry.body), MAX_EXCERPT_CHARS)
        : '';
      const description =
        fallbackDesc || excerptFromHtml || truncate(excerptFromMdx, 260);

      const content = rawHtml
        ? truncate(rawHtml, MAX_CONTENT_CHARS)
        : excerptFromMdx
          ? `<p>${escapeHtml(excerptFromMdx)}</p>`
          : undefined;

      return {
        title: entry.data.title,
        pubDate: entry.data.date,
        description,
        link: absoluteLink,
        ...(content ? { content } : {}),
      };
    }),
    customData: `<language>en-us</language>`,
  });
}
