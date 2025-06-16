import { getCollection } from 'astro:content';
import type { SearchableContent } from './types.js';

export function transformCollectionToSearchable(
  collection: any[],
  category: 'posts' | 'howtos' | 'snippets' | 'fridays'
): SearchableContent[] {
  return collection.map((item, index) => {
    let href = `/${item.data?.permalink || item.slug}/`;
    
    return {
      id: item.id || `${category}-${index}`,
      title: item.data?.title || 'Untitled',
      href,
      category,
      excerpt: item.data?.description || '',
      tags: item.data?.tags || [],
      data: item.data
    };
  });
}

export async function getAllSearchData(): Promise<SearchableContent[]> {
  try {
    const [posts, howtos, snippets, fridays] = await Promise.all([
      getCollection('posts').catch(() => []),
      getCollection('howtos').catch(() => []),
      getCollection('snippets').catch(() => []),
      getCollection('fridays').catch(() => [])
    ]);

    const searchData = [
      ...transformCollectionToSearchable(posts, 'posts'),
      ...transformCollectionToSearchable(howtos, 'howtos'),
      ...transformCollectionToSearchable(snippets, 'snippets'),
      ...transformCollectionToSearchable(fridays, 'fridays')
    ];

    return searchData;
  } catch (error) {
    console.error('Error loading search data:', error);
    return [];
  }
}

export function filterByCategory(
  data: SearchableContent[], 
  category: string
): SearchableContent[] {
  return data.filter(item => item.category === category);
}

export function getPopularContent(data: SearchableContent[], limit = 5): SearchableContent[] {
  const categories = ['posts', 'howtos', 'snippets', 'fridays'];
  const popular: SearchableContent[] = [];
  
  categories.forEach(category => {
    const categoryItems = filterByCategory(data, category);
    if (categoryItems.length > 0) {
      popular.push(categoryItems[0]);
    }
  });
  
  return popular.slice(0, limit);
}