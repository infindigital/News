import type { MetadataRoute } from 'next';
import { siteConfig, primaryCategories } from '@/config/site';
import { getAllArticleSlugs } from '@/services/articles';
import { getTags } from '@/services/taxonomy';

const BASE = siteConfig.url;

/** Primary XML sitemap: static routes, categories, tags and all articles. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, tags] = await Promise.all([
    getAllArticleSlugs(),
    getTags(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/contact',
    '/opinion',
    '/editorial',
    '/fact-check',
    '/explainers',
    '/videos',
    '/gallery',
    '/podcasts',
    '/events',
    '/live',
    '/elections',
    '/archive',
    '/privacy-policy',
    '/terms',
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'hourly' : 'weekly',
    priority: path === '' ? 1 : 0.6,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = primaryCategories.map((c) => ({
    url: `${BASE}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'hourly',
    priority: 0.8,
  }));

  const tagRoutes: MetadataRoute.Sitemap = tags.map((t) => ({
    url: `${BASE}/tag/${t.slug}`,
    changeFrequency: 'daily',
    priority: 0.4,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/article/${a.slug}`,
    lastModified: a.updatedAt ? new Date(a.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...tagRoutes,
    ...articleRoutes,
  ];
}
