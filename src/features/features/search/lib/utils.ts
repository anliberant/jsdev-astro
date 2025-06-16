export function getCategoryDisplayName(category: string): string {
  const displayNames: Record<string, string> = {
    posts: 'Posts',
    howtos: 'How-to Guides',
    snippets: 'Code Snippets',
    fridays: 'Friday Links'
  };
  return displayNames[category] || category;
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    posts: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline>`,
    howtos: `<path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>`,
    snippets: `<path d="M8 4v16m8-16v16M4 8h16M4 16h16"></path>`,
    fridays: `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>`
  };
  return icons[category] || icons.posts;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function highlightText(text: string, query: string): string {
  if (!query) return text;
  
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function formatCount(count: number, singular: string, plural?: string): string {
  if (count === 0) return `No ${plural || singular + 's'}`;
  if (count === 1) return `1 ${singular}`;
  return `${count} ${plural || singular + 's'}`;
}