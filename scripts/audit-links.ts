import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = path.resolve('src/content');
const COLLECTIONS = ['posts', 'howtos', 'snippets', 'friday'] as const;

interface Article {
  slug: string;
  title: string;
  permalink: string;
  category: string;
  tags: string[];
  collection: string;
  filePath: string;
  outgoingLinks: string[];   // internal link targets
  incomingLinks: string[];   // filled later
  relatedSlugs: string[];
}

function findMdxFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMdxFiles(full));
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

function extractInternalLinks(content: string): string[] {
  const links: string[] = [];
  // Markdown links: [text](/permalink/) or [text](https://jsdev.space/permalink/)
  const mdLinkRe = /\[([^\]]*)\]\((?:https?:\/\/jsdev\.space)?\/([\w/-]+?)\/?\)/g;
  let m: RegExpExecArray | null;
  while ((m = mdLinkRe.exec(content)) !== null) {
    links.push(m[2]);
  }
  // href="/permalink/"
  const hrefRe = /href=["'](?:https?:\/\/jsdev\.space)?\/([\w/-]+?)\/?["']/g;
  while ((m = hrefRe.exec(content)) !== null) {
    links.push(m[1]);
  }
  // <InlineRelated slug="..." />
  const inlineRe = /slug=["']([\w-]+)["']/g;
  while ((m = inlineRe.exec(content)) !== null) {
    links.push(m[1]);
  }
  return [...new Set(links)];
}

// Load all articles
const articles: Article[] = [];

for (const col of COLLECTIONS) {
  const dir = path.join(CONTENT_DIR, col);
  for (const filePath of findMdxFiles(dir)) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    articles.push({
      slug: data.slug ?? '',
      title: data.title ?? '',
      permalink: data.permalink ?? '',
      category: data.category ?? '',
      tags: data.tags ?? [],
      collection: col,
      filePath: path.relative(process.cwd(), filePath),
      outgoingLinks: extractInternalLinks(content),
      incomingLinks: [],
      relatedSlugs: data.relatedSlugs ?? [],
    });
  }
}

// Build permalink → slug map
const byPermalink = new Map<string, string>();
const bySlug = new Map<string, Article>();
for (const a of articles) {
  byPermalink.set(a.permalink, a.slug);
  bySlug.set(a.slug, a);
}

// Calculate incoming links
for (const a of articles) {
  for (const link of a.outgoingLinks) {
    // Link might be a permalink or slug
    const targetSlug = byPermalink.get(link) ?? link;
    const target = bySlug.get(targetSlug);
    if (target && target.slug !== a.slug) {
      target.incomingLinks.push(a.slug);
    }
  }
}

// --- Reports ---

console.log('\n=== LINK AUDIT REPORT ===\n');

// Summary
const totalArticles = articles.length;
const withOutgoing = articles.filter(a => a.outgoingLinks.length > 0).length;
const withIncoming = articles.filter(a => a.incomingLinks.length > 0).length;
const orphans = articles.filter(a => a.outgoingLinks.length === 0 && a.incomingLinks.length === 0);

console.log(`Total articles: ${totalArticles}`);
console.log(`With outgoing links: ${withOutgoing} (${((withOutgoing / totalArticles) * 100).toFixed(1)}%)`);
console.log(`With incoming links: ${withIncoming} (${((withIncoming / totalArticles) * 100).toFixed(1)}%)`);
console.log(`Orphan articles (no links at all): ${orphans.length}`);

// Orphan articles grouped by category
console.log('\n=== ORPHAN ARTICLES BY CATEGORY ===\n');
const orphansByCategory = new Map<string, Article[]>();
for (const a of orphans) {
  const key = `${a.collection}/${a.category || 'no-category'}`;
  if (!orphansByCategory.has(key)) orphansByCategory.set(key, []);
  orphansByCategory.get(key)!.push(a);
}
for (const [cat, items] of [...orphansByCategory.entries()].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n${cat} (${items.length}):`);
  for (const a of items.slice(0, 10)) {
    console.log(`  - ${a.slug}: "${a.title}" [tags: ${a.tags.join(', ') || 'none'}]`);
  }
  if (items.length > 10) console.log(`  ... and ${items.length - 10} more`);
}

// Suggest interlinking pairs (articles with most shared tags but no links between them)
console.log('\n=== TOP INTERLINKING OPPORTUNITIES ===\n');

interface Opportunity {
  a: Article;
  b: Article;
  sharedTags: string[];
}

const opportunities: Opportunity[] = [];

for (let i = 0; i < articles.length; i++) {
  const a = articles[i];
  if (a.tags.length === 0) continue;
  const aTagsLower = new Set(a.tags.map(t => t.toLowerCase()));

  for (let j = i + 1; j < articles.length; j++) {
    const b = articles[j];
    if (b.tags.length === 0) continue;

    const shared = b.tags.filter(t => aTagsLower.has(t.toLowerCase()));
    if (shared.length >= 2) {
      // Check if they already link to each other
      const aLinksB = a.outgoingLinks.some(l => l === b.slug || l === b.permalink);
      const bLinksA = b.outgoingLinks.some(l => l === a.slug || l === a.permalink);
      if (!aLinksB && !bLinksA) {
        opportunities.push({ a, b, sharedTags: shared });
      }
    }
  }
}

opportunities.sort((x, y) => y.sharedTags.length - x.sharedTags.length);

for (const opp of opportunities.slice(0, 30)) {
  console.log(`[${opp.sharedTags.join(', ')}]`);
  console.log(`  ${opp.a.collection}/${opp.a.slug} ↔ ${opp.b.collection}/${opp.b.slug}`);
}

console.log(`\nTotal opportunities with 2+ shared tags: ${opportunities.length}`);
