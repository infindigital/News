'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import type { Article } from '@/types';
import type { Paginated } from '@/services/articles';

export interface ArticleFilter {
  category?: string;
  subcategory?: string;
  tag?: string;
  author?: string;
  search?: string;
  sort?: string;
  trending?: boolean;
  editorsPick?: boolean;
  pageSize?: number;
}

async function fetchPage(
  filter: ArticleFilter,
  page: number,
): Promise<Paginated<Article>> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('pageSize', String(filter.pageSize ?? 12));
  if (filter.category) params.set('category', filter.category);
  if (filter.subcategory) params.set('subcategory', filter.subcategory);
  if (filter.tag) params.set('tag', filter.tag);
  if (filter.author) params.set('author', filter.author);
  if (filter.search) params.set('search', filter.search);
  if (filter.sort) params.set('sort', filter.sort);
  if (filter.trending) params.set('trending', 'true');
  if (filter.editorsPick) params.set('editorsPick', 'true');

  const res = await fetch(`/api/articles?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to load articles');
  return res.json();
}

/**
 * Paginated/infinite article loading backed by TanStack Query.
 * `initialData` seeds the first page from the server render for instant paint.
 */
export function useInfiniteArticles(
  filter: ArticleFilter,
  initial?: Paginated<Article>,
) {
  return useInfiniteQuery({
    queryKey: ['articles', filter],
    queryFn: ({ pageParam }) => fetchPage(filter, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.pageCount ? last.page + 1 : undefined,
    initialData: initial
      ? { pages: [initial], pageParams: [1] }
      : undefined,
  });
}
