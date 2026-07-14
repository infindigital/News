import type { Metadata } from 'next';
import Link from 'next/link';

import { getArticles } from '@/services/articles';
import { getCategories } from '@/services/taxonomy';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/features/page-header';
import { Breadcrumbs } from '@/components/features/breadcrumbs';
import { ArticleList } from '@/components/features/article-list';
import { cn } from '@/lib/utils';

export const revalidate = 120;

export const metadata: Metadata = buildMetadata({
  title: 'Archive',
  description: 'Browse our full archive of reporting by section.',
  path: '/archive',
});

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const [categories, initial] = await Promise.all([
    getCategories(),
    getArticles({ category, pageSize: 12 }),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="Browse"
        title="Archive"
        description="Explore our full catalogue of reporting, filtered by section."
      />
      <div className="container py-8">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: 'Archive', url: '/archive' },
          ]}
        />

        {/* Category filter chips */}
        <nav
          aria-label="Filter by category"
          className="mb-8 flex flex-wrap gap-2"
        >
          <Link
            href="/archive"
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              !category
                ? 'border-primary bg-primary/10 text-primary'
                : 'text-muted-foreground hover:border-primary hover:text-primary',
            )}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/archive?category=${c.slug}`}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                category === c.slug
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:border-primary hover:text-primary',
              )}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        {/* `key` forces a fresh list when the selected category changes. */}
        <ArticleList
          key={category ?? 'all'}
          filter={{ category, pageSize: 12 }}
          initial={initial}
          emptyMessage="No articles in this section yet."
        />
      </div>
    </div>
  );
}
