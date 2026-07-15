import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CalendarDays, MapPin, Ticket, ExternalLink } from 'lucide-react';

import { getEventBySlug, getAllEventSlugs } from '@/services/events';
import { buildMetadata } from '@/lib/seo';
import { mediaUrl, mediaAlt } from '@/lib/media';
import { formatDateTime } from '@/lib/utils';
import { Breadcrumbs } from '@/components/features/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return buildMetadata({
    title: event.seo?.metaTitle ?? event.title,
    description: event.seo?.metaDescription ?? event.summary,
    path: `/events/${event.slug}`,
    image: event.featuredImage ? mediaUrl(event.featuredImage) : undefined,
    type: 'article',
  });
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  return (
    <article className="container py-6">
      <Breadcrumbs
        items={[
          { name: 'Home', url: '/' },
          { name: 'Events', url: '/events' },
          { name: event.title, url: `/events/${event.slug}` },
        ]}
      />

      <div className="mx-auto max-w-3xl">
        <div className="mb-3 flex items-center gap-2">
          {event.category && (
            <Link
              href={`/category/${event.category.slug}`}
              className="text-sm font-bold uppercase tracking-wider text-primary hover:underline"
            >
              {event.category.name}
            </Link>
          )}
          <Badge variant={event.isFree ? 'category' : 'default'}>
            {event.isFree ? 'Free entry' : 'Ticketed'}
          </Badge>
        </div>

        <h1 className="font-serif text-3xl font-black leading-tight sm:text-4xl">
          {event.title}
        </h1>
        {event.summary && (
          <p className="mt-4 text-lg text-muted-foreground">{event.summary}</p>
        )}

        {event.featuredImage && (
          <figure className="mt-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
              <Image
                src={mediaUrl(event.featuredImage, 'large')}
                alt={mediaAlt(event.featuredImage, event.title)}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          </figure>
        )}

        {/* Key details */}
        <div className="mt-8 grid gap-4 rounded-lg border bg-muted/30 p-5 sm:grid-cols-2">
          <Detail icon={<CalendarDays className="h-5 w-5" />} label="When">
            {formatDateTime(event.startDate)}
            {event.endDate ? ` — ${formatDateTime(event.endDate)}` : ''}
          </Detail>
          {(event.venue || event.city) && (
            <Detail icon={<MapPin className="h-5 w-5" />} label="Where">
              {[event.venue, event.city].filter(Boolean).join(', ')}
            </Detail>
          )}
          <Detail icon={<Ticket className="h-5 w-5" />} label="Admission">
            {event.isFree ? 'Free' : 'Ticketed'}
          </Detail>
        </div>

        {event.registrationUrl && (
          <div className="mt-6">
            <Button asChild>
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Register / Get tickets
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        )}

        {event.description && (
          <div
            className="article-prose mt-10"
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        )}
      </div>
    </article>
  );
}

function Detail({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-primary">{icon}</span>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="font-medium">{children}</p>
      </div>
    </div>
  );
}
