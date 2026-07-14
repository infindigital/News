'use client';

import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import type { Article } from '@/types';
import type { Paginated } from '@/services/articles';
import {
  useInfiniteArticles,
  type ArticleFilter,
} from '@/hooks/use-infinite-articles';
import { ArticleCard } from '@/components/article/article-card';
import { Button } from '@/components/ui/button';

/**
 * Infinite-scrolling article grid. Server components pass `initial` (the first
 * page rendered on the server) so the list is instant and SEO-friendly, then
 * this hydrates and loads more on scroll.
 */
export function ArticleList({
  filter,
  initial,
  emptyMessage = 'No articles found.',
}: {
  filter: ArticleFilter;
  initial?: Paginated<Article>;
  emptyMessage?: string;
}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteArticles(filter, initial);

  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '400px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const articles = data?.pages.flatMap((p) => p.items) ?? [];

  if (isError) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        Couldn’t load articles. Please refresh the page.
      </p>
    );
  }

  if (!isLoading && articles.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">{emptyMessage}</p>
    );
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, i) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="default"
            priority={i < 3}
          />
        ))}
      </div>

      <div ref={sentinel} className="h-1" />

      <div className="mt-8 flex justify-center">
        {isFetchingNextPage ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : hasNextPage ? (
          <Button variant="outline" onClick={() => fetchNextPage()}>
            Load more
          </Button>
        ) : articles.length > 0 ? (
          <p className="text-sm text-muted-foreground">You’re all caught up.</p>
        ) : null}
      </div>
    </div>
  );
}
