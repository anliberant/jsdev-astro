import { getCollection } from 'astro:content';

export async function getUniqueCategories(collectionName: string): string[] {
  const allPosts = await getCollection(collectionName);

  const categories = new Set();

  allPosts.forEach(post => {
    if (post.data.category) {
      if (typeof post.data.category === 'string') {
        categories.add(post.data.category);
      } else if (Array.isArray(post.data.category)) {
        post.data.category.forEach(cat => categories.add(cat));
      }
    }
  });

  return Array.from(categories).sort();
}

export async function getCategoriesWithCount(
  collectionName: string
): { name: string; count: number }[] {
  const allPosts = await getCollection(collectionName);
  const categoryCount = {};

  allPosts.forEach(post => {
    if (post.data.category) {
      const categories = Array.isArray(post.data.category)
        ? post.data.category
        : [post.data.category];

      categories.forEach(cat => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
    }
  });

  return Object.entries(categoryCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
