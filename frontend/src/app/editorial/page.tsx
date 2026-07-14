import type { Metadata } from 'next';

import { getArticles } from '@/services/articles';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/features/page-header';
import { Breadcrumbs } from '@/components/features/breadcrumbs';
import { ArticleList } from '@/components/features/article-list';
import { AdSlot } from '@/components/features/ad-slot';

export const revalidate = 120;

export const metadata: Metadata = buildMetadata({
  title: 'Editorial',
  description:
    'The considered view of the newsroom on the issues that matter.',
  path: '/editorial',
});

export default async function EditorialPage() {
  // Editorials are surfaced here via the editor's-pick flag as a stand-in feed;
  // in production this filters by an "editorial" content type.
  const initial = await getArticles({ editorsPick: true, pageSize: 12 });

  return (
    <div>
      <PageHeader
        eyebrow="From the Editors"
        title="Editorial"
        description="The considered view of our newsroom on the issues shaping the day."
      />
      <div className="container py-8">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: 'Editorial', url: '/editorial' },
          ]}
        />
        <AdSlot placement="leaderboard" className="mb-8" />
        <ArticleList
          filter={{ editorsPick: true, pageSize: 12 }}
          initial={initial}
          emptyMessage="No editorials yet — check back soon."
        />
      </div>
    </div>
  );
}
