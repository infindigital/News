import type { Article } from '@/types';
import { ArticleCard } from '@/components/article/article-card';
import { SectionHeading } from '@/components/features/section-heading';

interface Props {
  title: string;
  slug: string;
  items: Article[];
}

/**
 * A category rail: a lead card plus a column of compact items. Used to render
 * each homepage section (India, World, Business, …).
 */
export function CategoryRail({ title, slug, items }: Props) {
  if (!items.length) return null;
  const [lead, ...rest] = items;

  return (
    <section aria-label={title}>
      <SectionHeading title={title} href={`/category/${slug}`} />
      <div className="grid gap-6 md:grid-cols-2">
        <ArticleCard article={lead!} variant="default" />
        <div className="flex flex-col gap-4">
          {rest.slice(0, 4).map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="compact"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
