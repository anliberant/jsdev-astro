import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import { siteConfig } from '@/app/config/site';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

const MAX_ITEMS = 50;
const MAX_CONTENT_CHARS = 8000;

function stripTags(html) {
	return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function truncate(text, maxLen) {
	if (!text) return '';
	return text.length > maxLen ? `${text.slice(0, maxLen - 1)}…` : text;
}

export async function GET(context) {
	const allPosts = await getCollection('posts', ({ data }) => !data.isDraft);
	const allHowtos = await getCollection('howtos', ({ data }) => !data.isDraft);
	const allSnippets = await getCollection('snippets', ({ data }) => !data.isDraft);
	const allFridays = await getCollection('fridays', ({ data }) => !data.isDraft);

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
		items: sorted.slice(0, MAX_ITEMS).map((entry) => {
			const link = `/${String(entry.data.permalink).replace(/^\/|\/$/g, '')}/`;

			const rawHtml =
				entry.id.endsWith('.mdx')
					? ''
					: sanitizeHtml(parser.render(entry.body), {
						allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
						allowedAttributes: {
							a: ['href', 'name', 'target', 'rel'],
							img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
						},
						allowVulnerableTags: false,
					});

			const fallbackDesc = typeof entry.data.desc === 'string' ? entry.data.desc : '';
			const excerptFromHtml = rawHtml ? truncate(stripTags(rawHtml), 260) : '';
			const description = fallbackDesc || excerptFromHtml;

			const content = rawHtml ? truncate(rawHtml, MAX_CONTENT_CHARS) : undefined;

			return {
				title: entry.data.title,
				pubDate: entry.data.date,
				description,
				link,
				...(content ? { content } : {}),
			};
		}),
		customData: `<language>en-us</language>`,
	});
}
