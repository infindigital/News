import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Article } from '@/types';

export function PrevNextNav({
  previous,
  next,
}: {
  previous?: Article | null;
  next?: Article | null;
}) {
  if (!previous && !next) return null;
  return (
    <nav
      aria-label="Article navigation"
      className="grid gap-4 border-y py-6 sm:grid-cols-2"
    >
      {previous ? (
        <Link
          href={`/article/${previous.slug}`}
          className="group flex flex-col gap-1 rounded-lg border p-4 transition-colors hover:border-primary"
        >
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Previous
          </span>
          <span className="line-clamp-2 font-semibold group-hover:text-primary">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/article/${next.slug}`}
          className="group flex flex-col items-end gap-1 rounded-lg border p-4 text-right transition-colors hover:border-primary"
        >
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Next <ArrowRight className="h-3.5 w-3.5" />
          </span>
          <span className="line-clamp-2 font-semibold group-hover:text-primary">
            {next.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
