import type { Metadata } from 'next';
import { getArticles } from '@/services/articles';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/features/page-header';
import { SearchBar } from '@/components/features/search-bar';
import { ArticleList } from '@/components/features/article-list';

// Search results shouldn't be indexed as distinct pages.
export const metadata: Metadata = buildMetadata({
  title: 'Search',
  path: '/search',
  noIndex: true,
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';
  const initial = query
    ? await getArticles({ search: query, pageSize: 12 })
    : undefined;

  return (
    <div>
      <PageHeader eyebrow="Search" title={query ? `Results for “${query}”` : 'Search'}>
        <div className="mt-5">
          <SearchBar initialQuery={query} />
        </div>
        {initial && (
          <p className="mt-3 text-sm text-muted-foreground">
            {initial.total} {initial.total === 1 ? 'result' : 'results'} found
          </p>
        )}
      </PageHeader>

      <div className="container py-8">
        {query ? (
          <ArticleList
            filter={{ search: query, pageSize: 12 }}
            initial={initial}
            emptyMessage={`No results for “${query}”. Try different keywords.`}
          />
        ) : (
          <p className="py-12 text-center text-muted-foreground">
            Enter a search term to find articles.
          </p>
        )}
      </div>
    </div>
  );
}
