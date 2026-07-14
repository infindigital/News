import type { Metadata } from 'next';
import Image from 'next/image';

import { getPodcasts } from '@/services/multimedia';
import { buildMetadata } from '@/lib/seo';
import { mediaUrl, mediaAlt } from '@/lib/media';
import { formatDuration, formatDate } from '@/lib/utils';
import { PageHeader } from '@/components/features/page-header';
import { Breadcrumbs } from '@/components/features/breadcrumbs';

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: 'Podcasts',
  description: 'Original audio journalism — briefings, interviews and deep dives.',
  path: '/podcasts',
});

export default async function PodcastsPage() {
  const podcasts = await getPodcasts();

  return (
    <div>
      <PageHeader
        eyebrow="Listen"
        title="Podcasts"
        description="Original audio journalism — daily briefings, interviews and deep dives."
      />
      <div className="container py-8">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: 'Podcasts', url: '/podcasts' },
          ]}
        />

        {podcasts.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            No episodes published yet — check back soon.
          </p>
        ) : (
          <div className="space-y-6">
            {podcasts.map((podcast) => (
              <article
                key={podcast.id}
                className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:p-5"
              >
                {/* Cover */}
                <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-md bg-muted sm:w-40">
                  <Image
                    src={mediaUrl(podcast.cover, 'small')}
                    alt={mediaAlt(podcast.cover, podcast.title)}
                    fill
                    sizes="(max-width: 640px) 100vw, 160px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                    {podcast.episode != null && (
                      <span>Episode {podcast.episode}</span>
                    )}
                    {podcast.durationSeconds ? (
                      <span className="text-muted-foreground">
                        · {formatDuration(podcast.durationSeconds)}
                      </span>
                    ) : null}
                    {podcast.publishedAt && (
                      <span className="text-muted-foreground">
                        · {formatDate(podcast.publishedAt)}
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif text-xl font-bold leading-snug">
                    {podcast.title}
                  </h2>
                  {podcast.description && (
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {podcast.description}
                    </p>
                  )}
                  <audio
                    controls
                    preload="none"
                    src={podcast.audioUrl}
                    className="mt-4 w-full"
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
