import type { Metadata } from 'next';
import { Radio } from 'lucide-react';

import { getActiveLiveBlog } from '@/services/multimedia';
import { buildMetadata } from '@/lib/seo';
import { cn, formatDateTime } from '@/lib/utils';
import { PageHeader } from '@/components/features/page-header';
import { Breadcrumbs } from '@/components/features/breadcrumbs';

// Live coverage updates frequently — revalidate aggressively.
export const revalidate = 30;

export const metadata: Metadata = buildMetadata({
  title: 'Live Updates',
  description: 'Rolling coverage of developing stories as they happen.',
  path: '/live',
});

/** Small pulsing red "LIVE" indicator. */
function LiveDot() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-breaking px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-breaking-foreground">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
      Live
    </span>
  );
}

export default async function LivePage() {
  const liveBlog = await getActiveLiveBlog();

  if (!liveBlog) {
    return (
      <div>
        <PageHeader eyebrow="Live" title="Live Updates" />
        <div className="container py-8">
          <Breadcrumbs
            items={[
              { name: 'Home', url: '/' },
              { name: 'Live Updates', url: '/live' },
            ]}
          />
          <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/30 py-20 text-center">
            <Radio className="mb-4 h-10 w-10 text-muted-foreground" />
            <h2 className="font-serif text-xl font-bold">
              No live coverage right now
            </h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              There are no live blogs running at the moment. When a story breaks,
              our rolling updates will appear here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader eyebrow="Live" title={liveBlog.title}>
        <div className="mt-4 flex items-center gap-3">
          <LiveDot />
          {liveBlog.updatedAt && (
            <span className="text-sm text-muted-foreground">
              Updated {formatDateTime(liveBlog.updatedAt)}
            </span>
          )}
        </div>
      </PageHeader>

      <div className="container py-8">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: 'Live Updates', url: '/live' },
          ]}
        />

        {liveBlog.summary && (
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
            {liveBlog.summary}
          </p>
        )}

        {/* Vertical timeline of entries */}
        <ol
          aria-label="Live updates timeline"
          className="relative mx-auto max-w-3xl space-y-6 border-l pl-6"
        >
          {liveBlog.entries.map((entry) => (
            <li key={entry.id} className="relative">
              {/* Timeline node */}
              <span
                className={cn(
                  'absolute -left-[31px] top-1.5 h-3 w-3 rounded-full ring-4 ring-background',
                  entry.important ? 'bg-breaking' : 'bg-primary',
                )}
                aria-hidden
              />
              <article
                className={cn(
                  'rounded-lg border p-4',
                  entry.important
                    ? 'border-breaking bg-breaking/10'
                    : 'bg-card',
                )}
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <time className="text-xs font-semibold text-muted-foreground">
                    {formatDateTime(entry.timestamp)}
                  </time>
                  {entry.important && (
                    <span className="rounded-sm bg-breaking px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-breaking-foreground">
                      Key update
                    </span>
                  )}
                </div>
                {entry.title && (
                  <h3 className="mb-1 font-serif text-lg font-bold leading-snug">
                    {entry.title}
                  </h3>
                )}
                <div
                  className="text-muted-foreground leading-relaxed [&_p]:mb-2 last:[&_p]:mb-0"
                  dangerouslySetInnerHTML={{ __html: entry.content }}
                />
              </article>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
