import 'server-only';
import type { Article } from '@/types';
import { http, USE_MOCK_FALLBACK } from './http';
import { buildQuery } from './query';
import { normalizeArticle } from './normalize';
import { mockArticles } from './mock/data';

export interface Paginated<T> {
  items: T[];
  page: number;
  pageCount: number;
  total: number;
}

interface ListOptions {
  page?: number;
  pageSize?: number;
  category?: string;
  subcategory?: string;
  tag?: string;
  author?: string;
  featured?: boolean;
  breaking?: boolean;
  trending?: boolean;
  editorsPick?: boolean;
  search?: string;
  sort?: string;
}

/**
 * Try Strapi; on any network/CMS failure (or when configured), fall back to
 * bundled mock data so the UI always renders. This keeps local dev, CI and
 * previews working without a running backend.
 */
export async function getArticles(
  opts: ListOptions = {},
): Promise<Paginated<Article>> {
  const {
    page = 1,
    pageSize = 12,
    category,
    subcategory,
    tag,
    author,
    featured,
    breaking,
    trending,
    editorsPick,
    search,
    sort = 'publishedAt:desc',
  } = opts;

  const filters: Record<string, unknown> = {};
  if (category) filters.category = { slug: { $eq: category } };
  if (subcategory) filters.subcategory = { slug: { $eq: subcategory } };
  if (tag) filters.tags = { slug: { $eq: tag } };
  if (author) filters.author = { slug: { $eq: author } };
  if (featured) filters.featured = { $eq: true };
  if (breaking) filters.breaking = { $eq: true };
  if (trending) filters.trending = { $eq: true };
  if (editorsPick) filters.editorsPick = { $eq: true };
  if (search) filters.$or = [
    { title: { $containsi: search } },
    { summary: { $containsi: search } },
  ];

  try {
    const query = buildQuery({
      page,
      pageSize,
      sort,
      filters,
      populate: ['featuredImage', 'category', 'author', 'author.avatar', 'tags'],
    });
    const { data } = await http.get(`/articles${query}`);
    return {
      items: (data.data as unknown[]).map(normalizeArticle),
      page: data.meta?.pagination?.page ?? page,
      pageCount: data.meta?.pagination?.pageCount ?? 1,
      total: data.meta?.pagination?.total ?? data.data.length,
    };
  } catch (error) {
    if (!USE_MOCK_FALLBACK) throw error;
    return mockList(opts);
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const query = buildQuery({
      filters: { slug: { $eq: slug } },
      populate: [
        'featuredImage',
        'gallery',
        'category',
        'subcategory',
        'author',
        'author.avatar',
        'tags',
        'seo',
        'seo.ogImage',
        'relatedArticles',
        'relatedArticles.featuredImage',
        'relatedArticles.category',
      ],
    });
    const { data } = await http.get(`/articles${query}`);
    const entity = (data.data as unknown[])[0];
    return entity ? normalizeArticle(entity) : mockBySlug(slug);
  } catch (error) {
    if (!USE_MOCK_FALLBACK) throw error;
    return mockBySlug(slug);
  }
}

/** All published slugs — for generateStaticParams / sitemaps. */
export async function getAllArticleSlugs(): Promise<
  { slug: string; updatedAt?: string }[]
> {
  try {
    const query = buildQuery({ pageSize: 1000, sort: 'publishedAt:desc' });
    const { data } = await http.get(`/articles${query}`);
    return (data.data as { slug: string; updatedAt?: string }[]).map((a) => ({
      slug: a.slug,
      updatedAt: a.updatedAt,
    }));
  } catch {
    return mockArticles.map((a) => ({ slug: a.slug, updatedAt: a.updatedAt }));
  }
}

// ── Mock helpers ────────────────────────────────────────────────────────────
function mockList(opts: ListOptions): Paginated<Article> {
  const { page = 1, pageSize = 12 } = opts;
  let items = [...mockArticles];
  if (opts.category)
    items = items.filter((a) => a.category?.slug === opts.category);
  if (opts.subcategory)
    items = items.filter((a) => a.subcategory?.slug === opts.subcategory);
  if (opts.tag)
    items = items.filter((a) => a.tags?.some((t) => t.slug === opts.tag));
  if (opts.author)
    items = items.filter((a) => a.author?.slug === opts.author);
  if (opts.featured) items = items.filter((a) => a.featured);
  if (opts.breaking) items = items.filter((a) => a.breaking);
  if (opts.trending) items = items.filter((a) => a.trending);
  if (opts.editorsPick) items = items.filter((a) => a.editorsPick);
  if (opts.search) {
    const q = opts.search.toLowerCase();
    items = items.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary?.toLowerCase().includes(q),
    );
  }
  if (opts.sort?.startsWith('viewCount'))
    items.sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0));
  if (opts.sort?.startsWith('shareCount'))
    items.sort((a, b) => (b.shareCount ?? 0) - (a.shareCount ?? 0));

  const total = items.length;
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
    total,
  };
}

function mockBySlug(slug: string): Article | null {
  return mockArticles.find((a) => a.slug === slug) ?? null;
}
