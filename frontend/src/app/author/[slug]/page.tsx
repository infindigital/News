import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Twitter, Linkedin } from 'lucide-react';

import { getAuthorBySlug, getAuthors } from '@/services/taxonomy';
import { getArticles } from '@/services/articles';
import { buildMetadata, personSchema } from '@/lib/seo';
import { mediaUrl } from '@/lib/media';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/features/breadcrumbs';
import { ArticleList } from '@/components/features/article-list';

export const revalidate = 300;

export async function generateStaticParams() {
  const authors = await getAuthors();
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return {};
  return buildMetadata({
    title: author.name,
    description: author.bio ?? `Articles by ${author.name}.`,
    path: `/author/${author.slug}`,
    image: author.avatar ? mediaUrl(author.avatar) : undefined,
  });
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [author, initial] = await Promise.all([
    getAuthorBySlug(slug),
    getArticles({ author: slug, pageSize: 12 }),
  ]);
  if (!author) notFound();

  return (
    <div>
      <JsonLd data={personSchema(author)} />

      <div className="border-b bg-muted/30 py-10">
        <div className="container flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full">
            {author.avatar ? (
              <Image
                src={mediaUrl(author.avatar, 'small')}
                alt={author.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-3xl font-bold text-primary">
                {author.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {author.role ?? 'Contributor'}
            </p>
            <h1 className="font-serif text-3xl font-black">{author.name}</h1>
            {author.bio && (
              <p className="mt-2 max-w-xl text-muted-foreground">{author.bio}</p>
            )}
            <div className="mt-3 flex items-center justify-center gap-3 sm:justify-start">
              {author.twitter && (
                <a
                  href={author.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${author.name} on Twitter`}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {author.linkedin && (
                <a
                  href={author.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${author.name} on LinkedIn`}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: author.name, url: `/author/${author.slug}` },
          ]}
        />
        <h2 className="mb-6 font-serif text-2xl font-bold">
          Latest by {author.name}
        </h2>
        <ArticleList
          filter={{ author: slug, pageSize: 12 }}
          initial={initial}
          emptyMessage="No articles published yet."
        />
      </div>
    </div>
  );
}
