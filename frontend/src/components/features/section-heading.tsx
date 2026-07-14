import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  href?: string;
  linkLabel?: string;
  accent?: boolean;
  className?: string;
}

/** Section header with the red accent bar used across homepage rails. */
export function SectionHeading({
  title,
  href,
  linkLabel = 'View all',
  accent = true,
  className,
}: Props) {
  return (
    <div className={cn('mb-5 flex items-center justify-between', className)}>
      <h2 className="flex items-center gap-3 font-serif text-2xl font-bold">
        {accent && <span className="h-6 w-1.5 rounded-full bg-breaking" />}
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
