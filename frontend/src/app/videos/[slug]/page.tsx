import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

import { getVideos } from '@/services/multimedia';
import { buildMetadata } from '@/lib/seo';
import { mediaUrl } from '@/lib/media';
import { formatDate } from '@/lib/utils';
import { Breadcrumbs } from '@/components/features/breadcrumbs';
import { YouTubeEmbed } from '@/components/features/youtube-embed';

export const revalidate = 300;

export async function generateStaticParams() {
  const videos = await getVideos();
  return videos.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const videos = await getVideos();
  const video = videos.find((v) => v.slug === slug);
  if (!video) return {};
  return buildMetadata({
    title: video.title,
    description: video.description,
    path: `/videos/${video.slug}`,
    image: video.thumbnail ? mediaUrl(video.thumbnail, 'large') : undefined,
  });
}

export default async function VideoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const videos = await getVideos();
  const video = videos.find((v) => v.slug === slug);
  if (!video) notFound();

  return (
    <div className="container py-8">
      <Breadcrumbs
        items={[
          { name: 'Home', url: '/' },
          { name: 'Videos', url: '/videos' },
          { name: video.title, url: `/videos/${video.slug}` },
        ]}
      />

      <div className="mx-auto max-w-4xl">
        {/* Responsive 16:9 YouTube embed. video.youtubeId is already an id. */}
        {video.youtubeId && (
          <YouTubeEmbed id={video.youtubeId} title={video.title} />
        )}

        <div className="mb-3 flex flex-wrap items-center gap-3">
          {video.category && (
            <Link
              href={`/category/${video.category.slug}`}
              className="text-sm font-bold uppercase tracking-wider text-primary hover:underline"
            >
              {video.category.name}
            </Link>
          )}
          {video.publishedAt && (
            <span className="text-sm text-muted-foreground">
              {formatDate(video.publishedAt)}
            </span>
          )}
        </div>

        <h1 className="font-serif text-3xl font-black leading-tight sm:text-4xl">
          {video.title}
        </h1>

        {video.description && (
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
}
