import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import { siteConfig } from '@/app/config/site';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

export async function GET(context) {
	const allPosts = await getCollection('posts', ({ data }) => !data.isDraft);
	const allHowtos = await getCollection('howtos', ({ data }) => !data.isDraft);
	const allSnippets = await getCollection('snippets', ({ data }) => !data.isDraft);
	const allFridays = await getCollection('fridays', ({ data }) => !data.isDraft);
	const allContent = [...allPosts, ...allHowtos, ...allSnippets, ...allFridays];
	const sortedPosts = allContent.sort((a, b) => {
		return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
	});
	return rss({
		stylesheet: '/rss/styles.xsl',
		title: siteConfig.title,
		// `<description>` field in output xml
		description: siteConfig.description,
		site: context.site,
		// Array of `<item>`s in output xml
		// See "Generating items" section for examples using content collections and glob imports
		items: sortedPosts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.date,
			description: post.data.desc,
			link: `/${post.data.permalink}/`,
			content: post.id.endsWith('.mdx')
				? post.data.desc
				: sanitizeHtml(parser.render(post.body), {
						allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
					}),
		})),
		// (optional) inject custom xml
		customData: `<language>en-us</language>`,
	});
}