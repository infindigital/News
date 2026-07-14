import type {
  Article,
  Author,
  Category,
  StrapiMedia,
  Tag,
} from '@/types';
import { estimateReadingTime } from '@/lib/utils';

/**
 * Normalizers: map raw Strapi v5 entities to the app's domain models.
 * Strapi v5 flattens attributes onto the entity, but relations may still
 * arrive wrapped in `{ data: ... }` depending on the API version/plugins, so
 * we defensively unwrap.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Raw = any;

function unwrap(value: Raw): Raw {
  if (value && typeof value === 'object' && 'data' in value) return value.data;
  return value;
}

function normalizeMedia(raw: Raw): StrapiMedia | null {
  const m = unwrap(raw);
  if (!m) return null;
  return {
    id: m.id,
    documentId: m.documentId,
    url: m.url,
    alternativeText: m.alternativeText ?? null,
    caption: m.caption ?? null,
    width: m.width,
    height: m.height,
    mime: m.mime,
    formats: m.formats,
  };
}

export function normalizeCategory(raw: Raw): Category | null {
  const c = unwrap(raw);
  if (!c) return null;
  return {
    id: c.id,
    documentId: c.documentId,
    name: c.name,
    slug: c.slug,
    description: c.description,
    color: c.color,
    featured: c.featured,
  };
}

export function normalizeTag(raw: Raw): Tag {
  const t = unwrap(raw);
  return { id: t.id, documentId: t.documentId, name: t.name, slug: t.slug };
}

export function normalizeAuthor(raw: Raw): Author | null {
  const a = unwrap(raw);
  if (!a) return null;
  return {
    id: a.id,
    documentId: a.documentId,
    name: a.name,
    slug: a.slug,
    bio: a.bio,
    role: a.role,
    email: a.email,
    avatar: normalizeMedia(a.avatar),
    twitter: a.twitter,
    linkedin: a.linkedin,
    articleCount: a.articleCount,
  };
}

export function normalizeArticle(raw: Raw): Article {
  const a = unwrap(raw);
  const content = a.content ?? '';
  const tags = unwrap(a.tags);
  return {
    id: a.id,
    documentId: a.documentId,
    title: a.title,
    slug: a.slug,
    subtitle: a.subtitle,
    summary: a.summary,
    content,
    featuredImage: normalizeMedia(a.featuredImage),
    imageCaption: a.imageCaption,
    gallery: Array.isArray(unwrap(a.gallery))
      ? unwrap(a.gallery).map(normalizeMedia).filter(Boolean)
      : [],
    videoUrl: a.videoUrl,
    category: normalizeCategory(a.category),
    subcategory: normalizeCategory(a.subcategory),
    tags: Array.isArray(tags) ? tags.map(normalizeTag) : [],
    author: normalizeAuthor(a.author),
    publishedAt: a.publishedAt,
    updatedAt: a.updatedAt,
    scheduledAt: a.scheduledAt,
    readingTimeMinutes:
      a.readingTimeMinutes ?? estimateReadingTime(content),
    featured: a.featured ?? false,
    breaking: a.breaking ?? false,
    editorsPick: a.editorsPick ?? false,
    trending: a.trending ?? false,
    viewCount: a.viewCount ?? 0,
    shareCount: a.shareCount ?? 0,
    status: a.status,
    seo: a.seo
      ? {
          metaTitle: a.seo.metaTitle,
          metaDescription: a.seo.metaDescription,
          canonicalUrl: a.seo.canonicalUrl,
          keywords: a.seo.keywords,
          ogImage: normalizeMedia(a.seo.ogImage),
          twitterCard: a.seo.twitterCard,
          structuredData: a.seo.structuredData ?? null,
          noIndex: a.seo.noIndex,
        }
      : undefined,
    relatedArticles: Array.isArray(unwrap(a.relatedArticles))
      ? unwrap(a.relatedArticles).map(normalizeArticle)
      : [],
  };
}
