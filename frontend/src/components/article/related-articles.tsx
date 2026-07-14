import type { Article } from '@/types';
import { ArticleCard } from './article-card';
import { SectionHeading } from '@/components/features/section-heading';

export function RelatedArticles({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  return (
    <section aria-label="Related articles">
      <SectionHeading title="Related Stories" accent />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {articles.slice(0, 4).map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="default"
            showSummary={false}
          />
        ))}
      </div>
    </section>
  );
}
