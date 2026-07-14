import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { getTagBySlug, getTags } from '@/services/taxonomy';
import { getArticles } from '@/services/articles';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/features/page-header';
import { Breadcrumbs } from '@/components/features/breadcrumbs';
import { ArticleList } from '@/components/features/article-list';

export const revalidate = 300;

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) return {};
  return buildMetadata({
    title: `#${tag.name}`,
    path: `/tag/${tag.slug}`,
    description: `All stories tagged ${tag.name}.`,
  });
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [tag, initial] = await Promise.all([
    getTagBySlug(slug),
    getArticles({ tag: slug, pageSize: 12 }),
  ]);
  if (!tag) notFound();

  return (
    <div>
      <PageHeader eyebrow="Topic" title={`#${tag.name}`} />
      <div className="container py-8">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: `#${tag.name}`, url: `/tag/${tag.slug}` },
          ]}
        />
        <ArticleList
          filter={{ tag: slug, pageSize: 12 }}
          initial={initial}
          emptyMessage={`No stories tagged ${tag.name} yet.`}
        />
      </div>
    </div>
  );
}
