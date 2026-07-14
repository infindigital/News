import Link from 'next/link';
import type { Category } from '@/types';
import { cn } from '@/lib/utils';

export function CategoryBadge({
  category,
  className,
}: {
  category?: Category | null;
  className?: string;
}) {
  if (!category) return null;
  return (
    <Link
      href={`/category/${category.slug}`}
      className={cn(
        'inline-block text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:text-primary/70',
        className,
      )}
      style={category.color ? { color: category.color } : undefined}
    >
      {category.name}
    </Link>
  );
}
