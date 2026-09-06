import { SITE_NAME } from './categories';

const fallbackSite = 'https://nestlyraliving.com';

/** Canonical production origin. RSS must never emit localhost or http URLs. */
export const RSS_SITE_ORIGIN = 'https://nestlyraliving.com';

export function getSiteUrl(): string {
  return (import.meta.env.PUBLIC_SITE_URL || fallbackSite).replace(/\/$/, '');
}

export function getRssSiteOrigin(): string {
  return RSS_SITE_ORIGIN;
}

export function absoluteUrl(path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

export function buildPageTitle(title?: string): string {
  if (!title || title === SITE_NAME) {
    return `${SITE_NAME} — Home Decor Inspiration`;
  }
  return `${title} | ${SITE_NAME}`;
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: getSiteUrl(),
    logo: absoluteUrl('/favicon.svg'),
    description:
      'Nestlyra is a home decor inspiration magazine for calm, elevated living — with curated rooms, styling ideas, and affiliate product picks.',
    email: 'hello@nestlyraliving.com',
    sameAs: [] as string[],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: getSiteUrl(),
    description:
      'Nestlyra is a home decor inspiration magazine for calm, elevated living — with curated rooms, styling ideas, and affiliate product picks.',
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: getSiteUrl(),
      logo: absoluteUrl('/favicon.svg'),
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${getSiteUrl()}/search/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  url: string;
  image: string;
  author: string;
  publishDate: Date;
  updatedDate?: Date;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    image: [input.image],
    author: {
      '@type': 'Person',
      name: input.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: getSiteUrl(),
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/favicon.svg'),
      },
    },
    datePublished: input.publishDate.toISOString(),
    dateModified: (input.updatedDate ?? input.publishDate).toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': input.url,
    },
  };
}
