import { getCollection } from 'astro:content';

export async function getUniqueTags(collectionName: string): Promise<string[]> {
  const allPosts = await getCollection(collectionName);

  const tags = new Set<string>();

  allPosts.forEach(post => {
    if (post.data.tags && Array.isArray(post.data.tags)) {
      post.data.tags.forEach(tag => {
        if (tag && typeof tag === 'string') {
          tags.add(tag);
        }
      });
    }
  });

  return Array.from(tags).sort();
}

export async function getTagsWithCount(
  collectionName: string
): Promise<{ name: string; count: number; slug: string }[]> {
  const allPosts = await getCollection(collectionName);
  const tagCount: Record<string, number> = {};

  allPosts.forEach(post => {
    if (post.data.tags && Array.isArray(post.data.tags)) {
      post.data.tags.forEach(tag => {
        if (tag && typeof tag === 'string') {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        }
      });
    }
  });

  return Object.entries(tagCount)
    .map(([name, count]) => ({
      name,
      count,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
    }))
    .sort((a, b) => b.count - a.count);
}
