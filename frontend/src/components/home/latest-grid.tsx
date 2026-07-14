import type { Article } from '@/types';
import { ArticleCard } from '@/components/article/article-card';
import { SectionHeading } from '@/components/features/section-heading';

/** Responsive grid of latest articles. */
export function LatestGrid({
  title = 'Latest News',
  href = '/archive',
  items,
}: {
  title?: string;
  href?: string;
  items: Article[];
}) {
  if (!items.length) return null;
  return (
    <section aria-label={title}>
      <SectionHeading title={title} href={href} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((article) => (
          <ArticleCard key={article.id} article={article} variant="default" />
        ))}
      </div>
    </section>
  );
}
