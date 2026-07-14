import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';

import {
  getArticleBySlug,
  getAllArticleSlugs,
  getArticles,
} from '@/services/articles';
import { mediaUrl, mediaAlt } from '@/lib/media';
import { articleMetadata, newsArticleSchema } from '@/lib/seo';
import { extractHeadings } from '@/lib/toc';
import { siteConfig } from '@/config/site';
import { formatDateTime, youtubeId } from '@/lib/utils';

import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/features/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { ReadingProgress } from '@/components/article/reading-progress';
import { TableOfContents } from '@/components/article/table-of-contents';
import { ShareButtons } from '@/components/article/share-buttons';
import { ArticleBody } from '@/components/article/article-body';
import { ArticleMeta } from '@/components/article/article-meta';
import { AuthorCard } from '@/components/article/author-card';
import { RelatedArticles } from '@/components/article/related-articles';
import { PrevNextNav } from '@/components/article/prev-next-nav';
import { CommentsSection } from '@/components/article/comments-section';
import { YouTubeEmbed } from '@/components/features/youtube-embed';
import { AdSlot } from '@/components/features/ad-slot';
import Link from 'next/link';

export const revalidate = 120;

// Pre-render the freshest articles; the rest render on-demand (ISR).
export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.slice(0, 50).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return articleMetadata(article);
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const url = `${siteConfig.url}/article/${article.slug}`;
  const headings = extractHeadings(article.content ?? '');
  const ytId = youtubeId(article.videoUrl);

  // Prev / next by publish date within the same section.
  const sectionList = await getArticles({
    category: article.category?.slug,
    pageSize: 30,
  });
  const idx = sectionList.items.findIndex((a) => a.slug === article.slug);
  const previous = idx > 0 ? sectionList.items[idx - 1] : null;
  const next =
    idx >= 0 && idx < sectionList.items.length - 1
      ? sectionList.items[idx + 1]
      : null;

  return (
    <>
      <ReadingProgress />
      <JsonLd data={newsArticleSchema(article)} />

      <article className="container py-6">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            ...(article.category
              ? [
                  {
                    name: article.category.name,
                    url: `/category/${article.category.slug}`,
                  },
                ]
              : []),
            { name: article.title, url: `/article/${article.slug}` },
          ]}
        />

        {/* Header */}
        <header className="mx-auto max-w-3xl">
          <div className="mb-3 flex items-center gap-2">
            {article.breaking && <Badge variant="breaking">Breaking</Badge>}
            {article.category && (
              <Link
                href={`/category/${article.category.slug}`}
                className="text-sm font-bold uppercase tracking-wider text-primary hover:underline"
              >
                {article.category.name}
              </Link>
            )}
          </div>
          <h1 className="font-serif text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            {article.title}
          </h1>
          {article.subtitle && (
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
              {article.subtitle}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y py-4">
            <ArticleMeta article={article} />
            <ShareButtons
              url={url}
              title={article.title}
              orientation="horizontal"
            />
          </div>
          {article.updatedAt && (
            <p className="mt-2 text-xs text-muted-foreground">
              Updated {formatDateTime(article.updatedAt)}
            </p>
          )}
        </header>

        {/* Featured image */}
        {article.featuredImage && (
          <figure className="mx-auto mt-8 max-w-4xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
              <Image
                src={mediaUrl(article.featuredImage, 'large')}
                alt={mediaAlt(article.featuredImage, article.title)}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover"
              />
            </div>
            {article.imageCaption && (
              <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                {article.imageCaption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Body grid: sticky share rail · content · TOC */}
        <div className="mx-auto mt-10 grid max-w-6xl gap-8 lg:grid-cols-[auto_minmax(0,1fr)_240px]">
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <ShareButtons url={url} title={article.title} />
            </div>
          </div>

          <div className="mx-auto w-full max-w-3xl">
            <ArticleBody html={article.content ?? ''} />

            {ytId && (
              <YouTubeEmbed id={ytId} title={article.title} />
            )}

            <AdSlot placement="in-article" className="my-10" />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            {article.author && (
              <div className="mt-8">
                <AuthorCard author={article.author} />
              </div>
            )}

            <div className="mt-10">
              <PrevNextNav previous={previous} next={next} />
            </div>

            <div className="mt-10">
              <CommentsSection articleId={article.id} />
            </div>
          </div>

          <aside className="hidden lg:block">
            <TableOfContents items={headings} />
          </aside>
        </div>

        {/* Related */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <div className="mx-auto mt-16 max-w-6xl">
            <RelatedArticles articles={article.relatedArticles} />
          </div>
        )}
      </article>
    </>
  );
}
