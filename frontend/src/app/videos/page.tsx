import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';

import { getVideos } from '@/services/multimedia';
import { buildMetadata } from '@/lib/seo';
import { mediaUrl, mediaAlt } from '@/lib/media';
import { formatDuration, timeAgo } from '@/lib/utils';
import { PageHeader } from '@/components/features/page-header';
import { Breadcrumbs } from '@/components/features/breadcrumbs';

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: 'Videos',
  description: 'Documentaries, explainers and reporting in moving pictures.',
  path: '/videos',
});

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <div>
      <PageHeader
        eyebrow="Watch"
        title="Videos"
        description="Documentaries, explainers and original reporting in moving pictures."
      />
      <div className="container py-8">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: 'Videos', url: '/videos' },
          ]}
        />

        {videos.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            No videos published yet — check back soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <article key={video.id} className="group flex flex-col">
                <Link
                  href={`/videos/${video.slug}`}
                  className="relative aspect-video overflow-hidden rounded-lg bg-muted"
                  aria-label={`Play ${video.title}`}
                >
                  <Image
                    src={mediaUrl(video.thumbnail, 'medium')}
                    alt={mediaAlt(video.thumbnail, video.title)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Play overlay */}
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-breaking text-white shadow-lg transition-transform group-hover:scale-110">
                      <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
                    </span>
                  </span>
                  {/* Duration badge */}
                  {video.durationSeconds ? (
                    <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium tabular-nums text-white">
                      {formatDuration(video.durationSeconds)}
                    </span>
                  ) : null}
                </Link>
                <div className="pt-3">
                  {video.category && (
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {video.category.name}
                    </span>
                  )}
                  <h3 className="mt-1 font-serif text-lg font-bold leading-snug">
                    <Link
                      href={`/videos/${video.slug}`}
                      className="hover:text-primary"
                    >
                      {video.title}
                    </Link>
                  </h3>
                  {video.publishedAt && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {timeAgo(video.publishedAt)}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
