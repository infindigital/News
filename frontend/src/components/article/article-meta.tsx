import Link from 'next/link';
import { Clock } from 'lucide-react';
import type { Article } from '@/types';
import { formatDate, timeAgo } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Props {
  article: Pick<
    Article,
    'author' | 'publishedAt' | 'readingTimeMinutes'
  >;
  variant?: 'default' | 'compact';
  relative?: boolean;
  className?: string;
}

export function ArticleMeta({
  article,
  variant = 'default',
  relative = false,
  className,
}: Props) {
  const { author, publishedAt, readingTimeMinutes } = article;
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground',
        className,
      )}
    >
      {author && (
        <>
          <span>
            By{' '}
            <Link
              href={`/author/${author.slug}`}
              className="font-medium text-foreground hover:text-primary"
            >
              {author.name}
            </Link>
          </span>
          <span aria-hidden>·</span>
        </>
      )}
      {publishedAt && (
        <time dateTime={publishedAt}>
          {relative ? timeAgo(publishedAt) : formatDate(publishedAt)}
        </time>
      )}
      {variant === 'default' && readingTimeMinutes ? (
        <>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {readingTimeMinutes} min read
          </span>
        </>
      ) : null}
    </div>
  );
}
