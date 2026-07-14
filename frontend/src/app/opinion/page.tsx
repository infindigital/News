import type { Metadata } from 'next';

import { getArticles } from '@/services/articles';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/features/page-header';
import { Breadcrumbs } from '@/components/features/breadcrumbs';
import { ArticleList } from '@/components/features/article-list';
import { AdSlot } from '@/components/features/ad-slot';

export const revalidate = 120;

export const metadata: Metadata = buildMetadata({
  title: 'Opinion',
  description:
    'Columns, commentary and argument from our writers and guest voices.',
  path: '/opinion',
});

export default async function OpinionPage() {
  // In production this filters by an "opinion" content flag; here we use the
  // politics section as a representative stand-in feed.
  const initial = await getArticles({ category: 'politics', pageSize: 12 });

  return (
    <div>
      <PageHeader
        eyebrow="Voices"
        title="Opinion"
        description="Columns, commentary and sharp argument from our writers and guest contributors."
      />
      <div className="container py-8">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: 'Opinion', url: '/opinion' },
          ]}
        />
        <AdSlot placement="leaderboard" className="mb-8" />
        <ArticleList
          filter={{ category: 'politics', pageSize: 12 }}
          initial={initial}
          emptyMessage="No opinion pieces yet — check back soon."
        />
      </div>
    </div>
  );
}
