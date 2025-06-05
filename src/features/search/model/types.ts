export interface SearchableContent {
  id: string;
  title: string;
  href: string;
  category: 'posts' | 'howtos' | 'snippets' | 'fridays';
  excerpt?: string;
  tags?: string[];
  data?: {
    title: string;
    permalink: string;
    description?: string;
    tags?: string[];
    date?: Date;
    draft?: boolean;
  };
}

export interface SearchResult extends SearchableContent {
  score: number;
  highlightedTitle: string;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  isOpen: boolean;
  isLoading: boolean;
  groupedResults: Record<string, SearchResult[]>;
}

export interface SearchOptions {
  minQueryLength: number;
  maxResults: number;
  fuzzySearch: boolean;
  categoryOrder: string[];
  debounceDelay: number;
}