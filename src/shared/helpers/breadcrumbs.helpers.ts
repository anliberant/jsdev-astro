export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

export function generateTagBreadcrumbs(
  tagName: string,
  tagSlug: string,
  currentPage?: number
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { label: 'Tags', href: '/tags/' },
    { label: tagName, href: `/tags/${tagSlug}/` },
  ];

  if (currentPage && currentPage > 1) {
    items[1].href = `/tags/${tagSlug}/`; 
    items.push({ label: `Page ${currentPage}` });
  }

  return items;
}

export function generateCategoryBreadcrumbs(
  categoryName: string,
  categorySlug: string,
  currentPage?: number,
  isHowto = false,
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { label: isHowto ? 'Howto' : 'Categories', href: isHowto ? '/howto/' : '/categories/' },
    { label: categoryName, href: `/${categorySlug}/` },
  ];

  if (currentPage && currentPage > 1) {
    items[1].href = `/${categorySlug}/`;
    items.push({ label: `Page ${currentPage}` });
  }

  return items;
}

export function generatePostBreadcrumbs(
  categoryName: string,
  categorySlug: string,
  postTitle: string
): BreadcrumbItem[] {
  return [
    { label: 'Categories', href: '/categories/' },
    { label: categoryName, href: `/${categorySlug}/` },
    { label: postTitle },
  ];
}

export function generateHowtoBreadcrumbs(
  categoryName?: string,
  categorySlug?: string,
  currentPage?: number
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ label: 'How-to', href: '/howto/' }];

  if (categoryName && categorySlug) {
    items.push({ label: categoryName, href: `/howto/${categorySlug}/` });

    if (currentPage && currentPage > 1) {
      items[1].href = `/howto/${categorySlug}/`; 
      items.push({ label: `Page ${currentPage}` });
    }
  } else if (currentPage && currentPage > 1) {
    items[0].href = '/howto/'; 
    items.push({ label: `Page ${currentPage}` });
  }

  return items;
}

export function generateSnippetsBreadcrumbs(
  currentPage?: number
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ label: 'Snippets', href: '/snippets/' }];

  if (currentPage && currentPage > 1) {
    items[0].href = '/snippets/';
    items.push({ label: `Page ${currentPage}` });
  }

  return items;
}

export function generateFridayBreadcrumbs(
  currentPage?: number
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ label: 'Friday Links', href: '/friday/' }];

  if (currentPage && currentPage > 1) {
    items[0].href = '/friday/';
    items.push({ label: `Page ${currentPage}` });
  }

  return items;
}

export function generateToolsBreadcrumbs(toolName?: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ label: 'Tools', href: '/tools/' }];

  if (toolName) {
    items.push({ label: toolName });
  }

  return items;
}

export function generateBreadcrumbsFromPath(
  pathname: string
): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [];

  let currentPath = '';

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    items.push({
      label,
      href: isLast ? undefined : `${currentPath}/`,
      isActive: isLast,
    });
  });

  return items;
}
