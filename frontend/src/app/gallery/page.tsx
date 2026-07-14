import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Images } from 'lucide-react';

import { getGalleries } from '@/services/multimedia';
import { buildMetadata } from '@/lib/seo';
import { mediaUrl, mediaAlt } from '@/lib/media';
import { PageHeader } from '@/components/features/page-header';
import { Breadcrumbs } from '@/components/features/breadcrumbs';

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: 'Photo Gallery',
  description: 'The week in pictures — visual storytelling from our photographers.',
  path: '/gallery',
});

export default async function GalleryIndexPage() {
  const galleries = await getGalleries();

  return (
    <div>
      <PageHeader
        eyebrow="In pictures"
        title="Photo Gallery"
        description="Visual storytelling and photojournalism from around the world."
      />
      <div className="container py-8">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: 'Photo Gallery', url: '/gallery' },
          ]}
        />

        {galleries.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            No galleries published yet — check back soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleries.map((gallery) => {
              const cover = gallery.images[0];
              return (
                <article key={gallery.id} className="group flex flex-col">
                  <Link
                    href={`/gallery/${gallery.slug}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted"
                  >
                    <Image
                      src={mediaUrl(cover, 'medium')}
                      alt={mediaAlt(cover, gallery.title)}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-black/80 px-2 py-0.5 text-xs font-medium text-white">
                      <Images className="h-3.5 w-3.5" />
                      {gallery.images.length}
                    </span>
                  </Link>
                  <div className="pt-3">
                    <h3 className="font-serif text-lg font-bold leading-snug">
                      <Link
                        href={`/gallery/${gallery.slug}`}
                        className="hover:text-primary"
                      >
                        {gallery.title}
                      </Link>
                    </h3>
                    {gallery.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {gallery.description}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
