export function formatUrl(basePath: string, pageNumber: number): string {
  const cleanBasePath = basePath.replace(/^\/+|\/+$/g, '');

  if (pageNumber === 1) {
    return cleanBasePath ? `/${cleanBasePath}/` : '/';
  } else {
    return cleanBasePath
      ? `/${cleanBasePath}/${pageNumber}/`
      : `/${pageNumber}/`;
  }
}

export type UrlFormat =
  | {
      type: 'page';
      number: number;
      link: string;
      isActive: boolean;
    }
  | {
      type: 'ellipsis';
    };

export function generateVisiblePages(
  total: number,
  current: number,
  slugBase: string
): UrlFormat[] {
  const pages = [];

  if (current > 3) {
    pages.push({
      type: 'page',
      number: 1,
      link: formatUrl(slugBase, 1),
      isActive: false,
    });

    if (current > 4) {
      pages.push({ type: 'ellipsis' });
    }
  }

  for (
    let i = Math.max(1, current - 2);
    i <= Math.min(total, current + 2);
    i++
  ) {
    pages.push({
      type: 'page',
      number: i,
      link: formatUrl(slugBase, i),
      isActive: i === current,
    });
  }

  if (current < total - 2) {
    if (current < total - 3) {
      pages.push({ type: 'ellipsis' });
    }

    pages.push({
      type: 'page',
      number: total,
      link: formatUrl(slugBase, total),
      isActive: false,
    });
  }

  return pages;
}

export function isActiveLink(path: string, currentPath: string): boolean {
  if (path === '/' && currentPath === '/') {
    return true;
  }
  if (path !== '/' && currentPath.startsWith(path)) {
    return true;
  }
  return false;
}
