import type { Metadata } from 'next';

import { getArticles } from '@/services/articles';
import { getActivePoll } from '@/services/multimedia';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/features/page-header';
import { Breadcrumbs } from '@/components/features/breadcrumbs';
import { ArticleList } from '@/components/features/article-list';
import { PollWidget } from '@/components/features/poll-widget';
import { AdSlot } from '@/components/features/ad-slot';

export const revalidate = 120;

export const metadata: Metadata = buildMetadata({
  title: 'Election 2026',
  description:
    'Live results, analysis and reaction from the 2026 general election.',
  path: '/elections',
});

export default async function ElectionsPage() {
  const [poll, initial] = await Promise.all([
    getActivePoll(),
    getArticles({ tag: 'elections-2026', pageSize: 12 }),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="Live Coverage"
        title="Election 2026"
        description="Results, seat-by-seat analysis and reaction as the nation votes."
      />
      <div className="container py-8">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: 'Election 2026', url: '/elections' },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main coverage feed */}
          <div>
            <ArticleList
              filter={{ tag: 'elections-2026', pageSize: 12 }}
              initial={initial}
              emptyMessage="Election coverage is on the way — check back soon."
            />
          </div>

          {/* Sidebar: reader poll + ad */}
          <aside aria-label="Election poll" className="space-y-6">
            {poll && <PollWidget poll={poll} />}
            <AdSlot placement="sidebar" />
          </aside>
        </div>
      </div>
    </div>
  );
}
