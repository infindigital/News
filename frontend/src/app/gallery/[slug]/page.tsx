import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';

import { getGalleries, getGalleryBySlug } from '@/services/multimedia';
import { buildMetadata } from '@/lib/seo';
import { mediaUrl, mediaAlt } from '@/lib/media';
import { formatDate } from '@/lib/utils';
import { Breadcrumbs } from '@/components/features/breadcrumbs';

export const revalidate = 300;

export async function generateStaticParams() {
  const galleries = await getGalleries();
  return galleries.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);
  if (!gallery) return {};
  return buildMetadata({
    title: gallery.title,
    description: gallery.description,
    path: `/gallery/${gallery.slug}`,
    image: gallery.images[0] ? mediaUrl(gallery.images[0], 'large') : undefined,
  });
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);
  if (!gallery) notFound();

  return (
    <div className="container py-8">
      <Breadcrumbs
        items={[
          { name: 'Home', url: '/' },
          { name: 'Photo Gallery', url: '/gallery' },
          { name: gallery.title, url: `/gallery/${gallery.slug}` },
        ]}
      />

      <header className="mx-auto mb-8 max-w-3xl">
        <h1 className="font-serif text-3xl font-black leading-tight sm:text-4xl">
          {gallery.title}
        </h1>
        {gallery.description && (
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {gallery.description}
          </p>
        )}
        {gallery.publishedAt && (
          <p className="mt-3 text-sm text-muted-foreground">
            {formatDate(gallery.publishedAt)} · {gallery.images.length} photos
          </p>
        )}
      </header>

      {/* Masonry-style responsive columns */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {gallery.images.map((image, i) => (
          <figure
            key={image.id}
            className="mb-4 break-inside-avoid overflow-hidden rounded-lg border bg-card"
          >
            <div className="relative">
              <Image
                src={mediaUrl(image, 'large')}
                alt={mediaAlt(image, `${gallery.title} — image ${i + 1}`)}
                width={image.width ?? 1200}
                height={image.height ?? 800}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-auto w-full object-cover"
              />
            </div>
            {image.caption && (
              <figcaption className="p-3 text-sm text-muted-foreground">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}
