import type { SearchableContent, SearchResult, SearchOptions } from './types.js';

export class SearchStore {
  private data: SearchableContent[] = [];
  private options: SearchOptions = {
    minQueryLength: 2,
    maxResults: 20,
    fuzzySearch: false,
    categoryOrder: ['posts', 'howtos', 'snippets', 'fridays'],
    debounceDelay: 300
  };

  constructor(initialData: SearchableContent[] = []) {
    this.data = initialData;
  }

  search(query: string): SearchResult[] {
    if (!query || query.length < this.options.minQueryLength) {
      return [];
    }

    const hasEnglishChars = /[a-zA-Z]/.test(query);
    if (!hasEnglishChars) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    for (const item of this.data) {
      const score = this.calculateScore(item, searchTerm);
      if (score > 0) {
        results.push({
          ...item,
          score,
          highlightedTitle: this.highlightMatch(item.title, query)
        });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, this.options.maxResults);
  }

  private calculateScore(item: SearchableContent, searchTerm: string): number {
    const title = item.title.toLowerCase();
    const excerpt = (item.excerpt || '').toLowerCase();
    const tags = (item.tags || []).join(' ').toLowerCase();

    let score = 0;

    if (title === searchTerm) {
      score += 100;
    }
    else if (title.startsWith(searchTerm)) {
      score += 80;
    }
    else if (title.includes(searchTerm)) {
      score += 60;
    }

    if (tags.includes(searchTerm)) {
      score += 40;
    }

    if (excerpt.includes(searchTerm)) {
      score += 20;
    }

    const categoryIndex = this.options.categoryOrder.indexOf(item.category);
    if (categoryIndex !== -1) {
      score += (4 - categoryIndex) * 2;
    }

    return score;
  }

  private highlightMatch(text: string, query: string): string {
    if (!query) return text;
    
    const regex = new RegExp(`(${this.escapeRegExp(query)})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  groupByCategory(results: SearchResult[]): Record<string, SearchResult[]> {
    const grouped = results.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, SearchResult[]>);

    const sortedGrouped: Record<string, SearchResult[]> = {};
    for (const category of this.options.categoryOrder) {
      if (grouped[category] && grouped[category].length > 0) {
        sortedGrouped[category] = grouped[category];
      }
    }

    return sortedGrouped;
  }

  updateData(data: SearchableContent[]): void {
    this.data = data;
  }

  getData(): SearchableContent[] {
    return this.data;
  }

  getOptions(): SearchOptions {
    return this.options;
  }

  updateOptions(newOptions: Partial<SearchOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }
}