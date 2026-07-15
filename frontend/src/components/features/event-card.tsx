import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, MapPin } from 'lucide-react';
import type { EventItem } from '@/types';
import { mediaUrl, mediaAlt } from '@/lib/media';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function EventCard({ event }: { event: EventItem }) {
  const href = `/events/${event.slug}`;
  return (
    <article className="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
      <Link href={href} className="relative block aspect-[16/9] overflow-hidden">
        <Image
          src={mediaUrl(event.featuredImage, 'medium')}
          alt={mediaAlt(event.featuredImage, event.title)}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge
          variant={event.isFree ? 'category' : 'default'}
          className="absolute left-3 top-3"
        >
          {event.isFree ? 'Free' : 'Ticketed'}
        </Badge>
      </Link>
      <div className="p-4">
        {event.category && (
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            {event.category.name}
          </span>
        )}
        <h3 className="mt-1 font-serif text-lg font-bold leading-snug">
          <Link href={href} className="hover:text-primary">
            {event.title}
          </Link>
        </h3>
        <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0" />
            {formatDate(event.startDate)}
            {event.endDate ? ` – ${formatDate(event.endDate)}` : ''}
          </p>
          {(event.venue || event.city) && (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              {[event.venue, event.city].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
