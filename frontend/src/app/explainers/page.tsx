import type { Metadata } from 'next';

import { getArticles } from '@/services/articles';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/features/page-header';
import { Breadcrumbs } from '@/components/features/breadcrumbs';
import { ArticleList } from '@/components/features/article-list';
import { AdSlot } from '@/components/features/ad-slot';

export const revalidate = 120;

export const metadata: Metadata = buildMetadata({
  title: 'Explainers',
  description:
    'Clear, contextual guides that unpack the story behind the headlines.',
  path: '/explainers',
});

export default async function ExplainersPage() {
  const initial = await getArticles({ tag: 'explainers', pageSize: 12 });

  return (
    <div>
      <PageHeader
        eyebrow="Understand the story"
        title="Explainers"
        description="Clear, contextual guides that unpack the how and why behind the headlines."
      />
      <div className="container py-8">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: 'Explainers', url: '/explainers' },
          ]}
        />
        <AdSlot placement="leaderboard" className="mb-8" />
        <ArticleList
          filter={{ tag: 'explainers', pageSize: 12 }}
          initial={initial}
          emptyMessage="No explainers yet — check back soon."
        />
      </div>
    </div>
  );
}
