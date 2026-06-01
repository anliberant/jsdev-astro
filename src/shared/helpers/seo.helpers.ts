import { siteConfig } from '@/app/config/site';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type ArticleJsonLdInput = {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: Date;
  author: string;
  tags?: string[];
  section?: string;
};

const ABSOLUTE_URL_RE = /^https?:\/\//i;

export const absoluteUrl = (url: string): string => {
  if (ABSOLUTE_URL_RE.test(url)) {
    return url;
  }

  return new URL(url.replace(/^\/+/, ''), `${siteConfig.siteUrl}/`).toString();
};

export const estimateWordCount = (content = ''): number => {
  const text = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/import\s+.*?from\s+['"].*?['"];?/g, ' ')
    .replace(/[{}[\]()*_#>`~|=:+/\\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) {
    return 0;
  }

  return text.split(/\s+/).filter(Boolean).length;
};

export const shouldNoindexThinContent = (
  content = '',
  minWords = 250
): boolean => estimateWordCount(content) < minWords;

export const createArticleJsonLd = ({
  title,
  description,
  url,
  image,
  datePublished,
  author,
  tags = [],
  section,
}: ArticleJsonLdInput) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: title,
  description,
  url,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': url,
  },
  image: image ? [absoluteUrl(image)] : undefined,
  datePublished: datePublished.toISOString(),
  dateModified: datePublished.toISOString(),
  author: {
    '@type': 'Person',
    name: author,
  },
  publisher: {
    '@type': 'Organization',
    name: siteConfig.shortTitle,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/icon.png'),
    },
  },
  articleSection: section,
  keywords: tags.join(', '),
});

export const createBreadcrumbJsonLd = (
  items: BreadcrumbItem[],
  currentUrl: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    item: item.href ? absoluteUrl(item.href) : currentUrl,
  })),
});
