import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';
import type { Video } from '@/types';
import { mediaUrl } from '@/lib/media';
import { formatDuration } from '@/lib/utils';

/** Horizontal strip of video thumbnails for the homepage. */
export function MultimediaStrip({ videos }: { videos: Video[] }) {
  if (!videos.length) return null;
  return (
    <section aria-label="Videos" className="rounded-lg bg-foreground p-6 text-background">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-3 font-serif text-2xl font-bold">
          <span className="h-6 w-1.5 rounded-full bg-breaking" />
          Watch
        </h2>
        <Link href="/videos" className="text-sm font-semibold hover:underline">
          All videos →
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {videos.slice(0, 3).map((video) => (
          <Link key={video.id} href={`/videos/${video.slug}`} className="group">
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={mediaUrl(video.thumbnail, 'medium')}
                alt={video.title}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-breaking/90 text-white">
                  <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" />
                </span>
              </span>
              {video.durationSeconds && (
                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs text-white">
                  {formatDuration(video.durationSeconds)}
                </span>
              )}
            </div>
            <h3 className="mt-2 line-clamp-2 text-sm font-semibold group-hover:text-breaking">
              {video.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
