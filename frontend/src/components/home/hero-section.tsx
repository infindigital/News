import type { Article } from '@/types';
import { ArticleCard } from '@/components/article/article-card';

/**
 * Homepage hero: one large lead story with a stack of secondary headlines.
 * Expects the lead as items[0] and up to 4 secondaries.
 */
export function HeroSection({ items }: { items: Article[] }) {
  if (!items.length) return null;
  const [lead, ...rest] = items;
  const secondaries = rest.slice(0, 4);

  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr]" aria-label="Top stories">
      <ArticleCard
        article={lead!}
        variant="overlay"
        priority
        headingClassName="md:text-4xl"
      />
      <div className="flex flex-col divide-y">
        {secondaries.map((article, i) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="horizontal"
            priority={i === 0}
            showSummary={false}
            headingClassName="text-base"
            className="py-4 first:pt-0"
          />
        ))}
      </div>
    </section>
  );
}
