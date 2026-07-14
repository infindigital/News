import type { Metadata } from 'next';
import type { Article, Author } from '@/types';
import { siteConfig } from '@/config/site';
import { mediaUrl } from './media';
import { truncate } from './utils';

const BASE = siteConfig.url;

interface MetaOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  keywords?: string;
}

/** Build a complete Next.js Metadata object with OG + Twitter cards. */
export function buildMetadata(opts: MetaOptions = {}): Metadata {
  const title = opts.title
    ? `${opts.title} | ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`;
  const description = truncate(
    opts.description ?? siteConfig.description,
    200,
  );
  const url = opts.path ? `${BASE}${opts.path}` : BASE;
  const image = opts.image ?? `${BASE}${siteConfig.ogImage}`;

  return {
    metadataBase: new URL(BASE),
    title,
    description,
    keywords: opts.keywords,
    alternates: { canonical: url },
    robots: opts.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph: {
      type: opts.type ?? 'website',
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(opts.type === 'article' && {
        publishedTime: opts.publishedTime,
        modifiedTime: opts.modifiedTime,
        authors: opts.authors,
        section: opts.section,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      title,
      description,
      images: [image],
    },
  };
}

/** Build article-specific metadata from a domain Article. */
export function articleMetadata(article: Article): Metadata {
  return buildMetadata({
    title: article.seo?.metaTitle ?? article.title,
    description: article.seo?.metaDescription ?? article.summary,
    path: `/article/${article.slug}`,
    image: article.seo?.ogImage
      ? mediaUrl(article.seo.ogImage)
      : article.featuredImage
        ? mediaUrl(article.featuredImage)
        : undefined,
    type: 'article',
    noIndex: article.seo?.noIndex,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: article.author ? [article.author.name] : undefined,
    section: article.category?.name,
    keywords: article.seo?.keywords ?? article.tags?.map((t) => t.name).join(', '),
  });
}

// ── JSON-LD builders ────────────────────────────────────────────────────────

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: siteConfig.name,
    url: BASE,
    logo: `${BASE}/logo.png`,
    sameAs: Object.values(siteConfig.social),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: BASE,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function newsArticleSchema(article: Article) {
  const image = article.featuredImage
    ? mediaUrl(article.featuredImage)
    : `${BASE}${siteConfig.ogImage}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary,
    image: [image],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: article.author
      ? {
          '@type': 'Person',
          name: article.author.name,
          url: `${BASE}/author/${article.author.slug}`,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: { '@type': 'ImageObject', url: `${BASE}/logo.png` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE}/article/${article.slug}`,
    },
    articleSection: article.category?.name,
    keywords: article.tags?.map((t) => t.name).join(', '),
    wordCount: article.content
      ? article.content.replace(/<[^>]*>/g, ' ').split(/\s+/).length
      : undefined,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE}${item.url}`,
    })),
  };
}

export function personSchema(author: Author) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    url: `${BASE}/author/${author.slug}`,
    sameAs: [author.twitter, author.linkedin].filter(Boolean),
  };
}
