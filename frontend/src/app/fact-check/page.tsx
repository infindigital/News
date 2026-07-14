import type { Metadata } from 'next';

import { getArticles } from '@/services/articles';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/features/page-header';
import { Breadcrumbs } from '@/components/features/breadcrumbs';
import { ArticleList } from '@/components/features/article-list';

export const revalidate = 120;

export const metadata: Metadata = buildMetadata({
  title: 'Fact Check',
  description:
    'We verify viral claims, political statements and misinformation against the record.',
  path: '/fact-check',
});

export default async function FactCheckPage() {
  const initial = await getArticles({ tag: 'fact-check', pageSize: 12 });

  return (
    <div>
      <PageHeader
        eyebrow="Verified"
        title="Fact Check"
        description="Separating fact from fiction, one claim at a time."
      />
      <div className="container py-8">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: 'Fact Check', url: '/fact-check' },
          ]}
        />
        {/* Methodology note */}
        <div className="mb-8 rounded-lg border bg-muted/30 p-5 text-sm text-muted-foreground leading-relaxed">
          Our fact checks trace each claim back to primary sources — official
          records, original documents and named experts — before rating it. Every
          verdict links to the evidence we relied on, and we publish corrections
          openly whenever new information changes the picture.
        </div>
        <ArticleList
          filter={{ tag: 'fact-check', pageSize: 12 }}
          initial={initial}
          emptyMessage="No fact checks published yet — new verifications appear here as we complete them."
        />
      </div>
    </div>
  );
}
