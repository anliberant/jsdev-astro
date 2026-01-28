import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// Hardcoded site URL to avoid importing siteConfig directly in a non-Astro context
const SITE_URL = `https://jsdev.space`; 

const contentRoot = path.resolve('src/content');
const outputFilePath = path.resolve('public/LLM_SITEMAP.md'); // Changed output path

// Function to recursively get all .mdx and .md files
const walkDir = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            filelist = walkDir(filepath, filelist);
        } else if (filepath.endsWith('.mdx') || filepath.endsWith('.md')) {
            filelist.push(filepath);
        }
    });
    return filelist;
};

async function generateLlmSitemap() {
    const allFiles = walkDir(contentRoot);
    const allContent = [];

    for (const fullPath of allFiles) {
        const raw = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(raw);

        // Normalize data
        // Infer collection type from path
        let collectionType = '';
        if (fullPath.includes(path.join('src', 'content', 'posts'))) {
            collectionType = 'posts';
        } else if (fullPath.includes(path.join('src', 'content', 'howtos'))) {
            collectionType = 'howtos';
        } else if (fullPath.includes(path.join('src', 'content', 'snippets'))) {
            collectionType = 'snippets';
        } else if (fullPath.includes(path.join('src', 'content', 'fridays'))) {
            collectionType = 'fridays';
        }
        // Filter out drafts based on 'isDraft' frontmatter property, defaulting to false
        const isDraft = data.isDraft === true;
        if (isDraft) {
            continue; // Skip drafts
        }

        allContent.push({
            id: fullPath,
            collection: collectionType,
            data: {
                title: data.title || path.basename(fullPath).replace(/\.(md|mdx)$/, ''),
                desc: data.desc || '',
                permalink: data.permalink || path.basename(path.dirname(fullPath)),
                date: data.date ? new Date(data.date) : new Date(0),
                tags: data.tags || [],
                category: data.category || '',
            },
        });
    }

    // Sort in descending order (newest first)
    const sortedContent = allContent.sort((a, b) => {
        return b.data.date.getTime() - a.data.date.getTime();
    });

    let output = `# JSDev.Space Content Overview for LLM\n\n`;
    output += `This document provides a structured overview of the content available on JSDev.Space, designed for easy consumption by a Large Language Model.\n\n`;
    output += `**Site URL:** ${SITE_URL}\n\n`;
    output += `## Available Content Articles (${sortedContent.length} articles)\n\n`;

    for (const item of sortedContent) {
        output += `### ${item.data.title}\n`;
        output += `- **Type:** ${item.collection}\n`;
        output += `- **Description:** ${item.data.desc}\n`;
        output += `- **URL:** ${SITE_URL}/${item.data.permalink || (item.collection ? item.collection + '/' + path.basename(path.dirname(item.id)) : path.basename(path.dirname(item.id)) )}/\n`;
        if (item.data.date && item.data.date.getTime() > 0) {
            output += `- **Published Date:** ${item.data.date.toISOString().split('T')[0]}\n`;
        }
        if (item.data.tags && item.data.tags.length > 0) {
            output += `- **Tags:** ${item.data.tags.join(', ')}\n`;
        }
        if (item.data.category) {
            output += `- **Category:** ${item.data.category}\n`;
        }
        output += `\n`;
    }

    fs.writeFileSync(outputFilePath, output);
    console.log(`Generated LLM_SITEMAP.md at ${outputFilePath}`);
}

generateLlmSitemap();
