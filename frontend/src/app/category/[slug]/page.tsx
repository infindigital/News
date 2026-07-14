import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { getCategoryBySlug, getCategories } from '@/services/taxonomy';
import { getArticles } from '@/services/articles';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/features/page-header';
import { Breadcrumbs } from '@/components/features/breadcrumbs';
import { ArticleList } from '@/components/features/article-list';
import { AdSlot } from '@/components/features/ad-slot';

export const revalidate = 120;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return buildMetadata({
    title: category.name,
    description:
      category.description ??
      `Latest ${category.name} news, analysis and features.`,
    path: `/category/${category.slug}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, initial] = await Promise.all([
    getCategoryBySlug(slug),
    getArticles({ category: slug, pageSize: 12 }),
  ]);

  if (!category) notFound();

  return (
    <div>
      <PageHeader
        eyebrow="Section"
        title={category.name}
        description={
          category.description ??
          `The latest ${category.name} stories from our newsroom.`
        }
      />
      <div className="container py-8">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: category.name, url: `/category/${category.slug}` },
          ]}
        />
        <AdSlot placement="leaderboard" className="mb-8" />
        <ArticleList
          filter={{ category: slug, pageSize: 12 }}
          initial={initial}
          emptyMessage={`No ${category.name} articles yet — check back soon.`}
        />
      </div>
    </div>
  );
}
