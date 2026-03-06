export function initSearchController() {
  if (window.__searchController) {
    return window.__searchController;
  }

  class SearchStore {
    constructor(initialData = []) {
      this.data = initialData;
      this.options = {
        minQueryLength: 2,
        maxResults: 20,
        categoryOrder: ['posts', 'howtos', 'snippets', 'fridays'],
      };
    }

    search(query) {
      if (!query || query.length < this.options.minQueryLength) {
        return [];
      }

      if (!/[a-zA-Z]/.test(query)) {
        return [];
      }

      const searchTerm = query.toLowerCase().trim();
      const results = [];

      for (const item of this.data) {
        const score = this.calculateScore(item, searchTerm);
        if (score > 0) {
          results.push({
            ...item,
            score,
            highlightedTitle: this.highlightMatch(item.title, query),
          });
        }
      }

      return results.sort((a, b) => b.score - a.score).slice(0, this.options.maxResults);
    }

    calculateScore(item, searchTerm) {
      const title = item.title.toLowerCase();
      const excerpt = (item.excerpt || '').toLowerCase();
      const tags = (item.tags || []).join(' ').toLowerCase();

      let score = 0;

      if (title === searchTerm) score += 100;
      else if (title.startsWith(searchTerm)) score += 80;
      else if (title.includes(searchTerm)) score += 60;

      if (tags.includes(searchTerm)) score += 40;
      if (excerpt.includes(searchTerm)) score += 20;

      const categoryIndex = this.options.categoryOrder.indexOf(item.category);
      if (categoryIndex !== -1) {
        score += (4 - categoryIndex) * 2;
      }

      return score;
    }

    highlightMatch(text, query) {
      if (!query) return text;
      const regex = new RegExp(`(${this.escapeRegExp(query)})`, 'gi');
      return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    escapeRegExp(value) {
      return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    groupByCategory(results) {
      const grouped = results.reduce((acc, item) => {
        const category = item.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
      }, {});

      const sortedGrouped = {};
      for (const category of this.options.categoryOrder) {
        if (grouped[category] && grouped[category].length > 0) {
          sortedGrouped[category] = grouped[category];
        }
      }

      return sortedGrouped;
    }

    updateData(data) {
      this.data = data;
    }
  }

  class KeyboardManager {
    constructor() {
      this.shortcuts = [];
      this.isListening = false;
      this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    addShortcut(shortcut) {
      this.shortcuts.push(shortcut);
    }

    startListening() {
      if (!this.isListening) {
        document.addEventListener('keydown', this.handleKeyDown);
        this.isListening = true;
      }
    }

    handleKeyDown(event) {
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') &&
        event.key !== 'Escape'
      ) {
        return;
      }

      for (const shortcut of this.shortcuts) {
        const metaMatch = shortcut.metaKey ? event.metaKey : !event.metaKey;
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey : !event.ctrlKey;

        if (event.key === shortcut.key && metaMatch && ctrlMatch) {
          if (shortcut.preventDefault) {
            event.preventDefault();
          }
          shortcut.action();
          break;
        }
      }
    }
  }

  const debounce = (fn, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), wait);
    };
  };

  const getCategoryDisplayName = category => {
    const displayNames = {
      posts: 'Posts',
      howtos: 'How-to Guides',
      snippets: 'Code Snippets',
      fridays: 'Friday Links',
    };
    return displayNames[category] || category;
  };

  const getCategoryIcon = category => {
    const icons = {
      posts:
        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline>',
      howtos:
        '<path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>',
      snippets: '<path d="M8 4v16m8-16v16M4 8h16M4 16h16"></path>',
      fridays:
        '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>',
    };

    return icons[category] || icons.posts;
  };

  class SearchController {
    constructor() {
      this.searchStore = new SearchStore();
      this.keyboardManager = new KeyboardManager();
      this.debouncedSearch = debounce(this.handleSearch.bind(this), 300);
      this.init();
    }

    init() {
      this.loadSearchData();
      this.bindEvents();
      this.setupKeyboardShortcuts();
    }

    loadSearchData() {
      if (window.searchData) {
        this.searchStore.updateData(window.searchData);
      }
    }

    bindEvents() {
      const trigger = document.getElementById('searchTrigger');
      const overlay = document.getElementById('searchOverlay');
      const closeBtn = document.getElementById('searchClose');
      const input = document.getElementById('searchInput');

      trigger?.addEventListener('click', () => this.openModal());
      closeBtn?.addEventListener('click', () => this.closeModal());
      overlay?.addEventListener('click', () => this.closeModal());
      input?.addEventListener('input', e => this.debouncedSearch(e.target.value));
    }

    setupKeyboardShortcuts() {
      this.keyboardManager.addShortcut({ key: '/', preventDefault: true, action: () => this.openModal() });
      this.keyboardManager.addShortcut({ key: 'k', metaKey: true, preventDefault: true, action: () => this.openModal() });
      this.keyboardManager.addShortcut({ key: 'k', ctrlKey: true, preventDefault: true, action: () => this.openModal() });
      this.keyboardManager.addShortcut({ key: 'Escape', action: () => this.closeModal() });
      this.keyboardManager.startListening();
    }

    openModal() {
      const modal = document.getElementById('searchModal');
      const input = document.getElementById('searchInput');
      modal?.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => input?.focus(), 100);
    }

    closeModal() {
      const modal = document.getElementById('searchModal');
      const input = document.getElementById('searchInput');
      modal?.classList.remove('open');
      document.body.style.overflow = '';
      if (input) {
        input.value = '';
        this.showDefaultState();
      }
    }

    handleSearch(query) {
      const startTime = performance.now();
      if (!query || query.length < 2) {
        this.showDefaultState();
        return;
      }

      const results = this.searchStore.search(query);
      const groupedResults = this.searchStore.groupByCategory(results);
      const searchTime = performance.now() - startTime;

      if (window.searchMetrics) {
        window.searchMetrics.recordSearch(query, results.length, searchTime);
      }

      if (Object.keys(groupedResults).length === 0) this.showEmptyState();
      else this.showResults(groupedResults);
    }

    showDefaultState() {
      document.getElementById('searchDefault')?.classList.remove('hidden');
      document.getElementById('searchResults')?.classList.add('hidden');
      document.getElementById('searchEmpty')?.classList.add('hidden');
    }

    showEmptyState() {
      document.getElementById('searchDefault')?.classList.add('hidden');
      document.getElementById('searchResults')?.classList.add('hidden');
      document.getElementById('searchEmpty')?.classList.remove('hidden');
    }

    showResults(groupedResults) {
      document.getElementById('searchDefault')?.classList.add('hidden');
      document.getElementById('searchEmpty')?.classList.add('hidden');
      document.getElementById('searchResults')?.classList.remove('hidden');
      const resultsContent = document.getElementById('searchResultsContent');
      if (resultsContent) {
        resultsContent.innerHTML = this.renderResults(groupedResults);
      }
    }

    renderResults(groupedResults) {
      let html = '';
      Object.entries(groupedResults).forEach(([category, items]) => {
        const displayName = getCategoryDisplayName(category);
        const icon = getCategoryIcon(category);
        const count = items.length;

        html += `
          <div class="search-category" data-category="${category}">
            <div class="category-header">
              <svg class="category-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${icon}
              </svg>
              <span class="category-title">${displayName}</span>
              <span class="category-count">${count} result${count !== 1 ? 's' : ''}</span>
            </div>
            <div class="category-items">
              ${items.map(item => this.renderSearchItem(item)).join('')}
            </div>
          </div>
        `;
      });

      return html;
    }

    renderSearchItem(item) {
      const excerpt = item.excerpt ? `<div class="search-item-excerpt">${item.excerpt}</div>` : '';
      return `
        <a href="${item.href}" class="search-item">
          <div class="search-item-title">${item.highlightedTitle}</div>
          ${excerpt}
        </a>
      `;
    }
  }

  const controller = new SearchController();
  window.__searchController = controller;
  return controller;
}
