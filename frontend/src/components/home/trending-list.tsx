import Link from 'next/link';
import type { Article } from '@/types';
import { CategoryBadge } from '@/components/article/category-badge';
import { compactNumber } from '@/lib/utils';

/** Numbered "Most Read / Trending" list for the sidebar. */
export function TrendingList({
  title,
  items,
  showViews = false,
}: {
  title: string;
  items: Article[];
  showViews?: boolean;
}) {
  if (!items.length) return null;
  return (
    <section aria-label={title}>
      <h2 className="mb-4 flex items-center gap-3 font-serif text-xl font-bold">
        <span className="h-5 w-1.5 rounded-full bg-breaking" />
        {title}
      </h2>
      <ol className="space-y-4">
        {items.slice(0, 6).map((article, i) => (
          <li key={article.id} className="flex gap-3">
            <span className="font-serif text-3xl font-black leading-none text-muted-foreground/40">
              {i + 1}
            </span>
            <div className="min-w-0">
              <CategoryBadge
                category={article.category}
                className="text-[10px]"
              />
              <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                <Link
                  href={`/article/${article.slug}`}
                  className="hover:text-primary"
                >
                  {article.title}
                </Link>
              </h3>
              {showViews && article.viewCount ? (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {compactNumber(article.viewCount)} reads
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
