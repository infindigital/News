import type { Metadata } from 'next';

import { getCategoryBySlug } from '@/services/taxonomy';
import { getArticles } from '@/services/articles';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/features/page-header';
import { Breadcrumbs } from '@/components/features/breadcrumbs';
import { ArticleList } from '@/components/features/article-list';

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}): Promise<Metadata> {
  const { slug, sub } = await params;
  const category = await getCategoryBySlug(slug);
  const label = deslug(sub);
  return buildMetadata({
    title: `${label} — ${category?.name ?? deslug(slug)}`,
    path: `/category/${slug}/${sub}`,
    description: `Latest ${label} coverage in ${category?.name ?? deslug(slug)}.`,
  });
}

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}) {
  const { slug, sub } = await params;
  const [category, initial] = await Promise.all([
    getCategoryBySlug(slug),
    getArticles({ category: slug, subcategory: sub, pageSize: 12 }),
  ]);

  const categoryName = category?.name ?? deslug(slug);
  const subName = deslug(sub);

  return (
    <div>
      <PageHeader eyebrow={categoryName} title={subName} />
      <div className="container py-8">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: categoryName, url: `/category/${slug}` },
            { name: subName, url: `/category/${slug}/${sub}` },
          ]}
        />
        <ArticleList
          filter={{ category: slug, subcategory: sub, pageSize: 12 }}
          initial={initial}
          emptyMessage={`No ${subName} stories yet.`}
        />
      </div>
    </div>
  );
}

function deslug(s: string): string {
  return s
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
