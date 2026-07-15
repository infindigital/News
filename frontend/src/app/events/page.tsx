import type { Metadata } from 'next';
import { getEvents } from '@/services/events';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/features/page-header';
import { Breadcrumbs } from '@/components/features/breadcrumbs';
import { EventCard } from '@/components/features/event-card';

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: 'Events',
  description: 'Upcoming events, summits, and gatherings.',
  path: '/events',
});

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div>
      <PageHeader
        eyebrow="What's on"
        title="Events"
        description="Upcoming summits, meetups, and gatherings from across our coverage."
      />
      <div className="container py-8">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: 'Events', url: '/events' },
          ]}
        />
        {events.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            No upcoming events right now — check back soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
