import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/types';
import { mediaUrl, mediaAlt } from '@/lib/media';
import { cn, timeAgo } from '@/lib/utils';
import { CategoryBadge } from './category-badge';
import { Badge } from '@/components/ui/badge';

export type ArticleCardVariant =
  | 'default' // image on top, meta below
  | 'horizontal' // image left, text right
  | 'overlay' // text over image (hero)
  | 'minimal' // no image, headline + meta
  | 'compact'; // small horizontal for lists/sidebars

interface Props {
  article: Article;
  variant?: ArticleCardVariant;
  priority?: boolean;
  headingClassName?: string;
  showSummary?: boolean;
  className?: string;
}

/**
 * The workhorse article card. A single component with layout variants keeps
 * every list/grid/hero visually consistent across the site.
 */
export function ArticleCard({
  article,
  variant = 'default',
  priority = false,
  headingClassName,
  showSummary = true,
  className,
}: Props) {
  const href = `/article/${article.slug}`;
  const img = mediaUrl(article.featuredImage, 'medium');
  const alt = mediaAlt(article.featuredImage, article.title);

  if (variant === 'minimal') {
    return (
      <article className={cn('group border-b py-3 last:border-0', className)}>
        <CategoryBadge category={article.category} />
        <h3 className={cn('mt-1 font-semibold leading-snug', headingClassName)}>
          <Link href={href} className="hover:text-primary">
            {article.title}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {timeAgo(article.publishedAt)}
        </p>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className={cn('group flex gap-3', className)}>
        <Link
          href={href}
          className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-md"
        >
          <Image
            src={img}
            alt={alt}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="min-w-0">
          <CategoryBadge category={article.category} className="text-[10px]" />
          <h3 className="line-clamp-3 text-sm font-semibold leading-snug">
            <Link href={href} className="hover:text-primary">
              {article.title}
            </Link>
          </h3>
        </div>
      </article>
    );
  }

  if (variant === 'overlay') {
    return (
      <article
        className={cn(
          'group relative overflow-hidden rounded-lg',
          className,
        )}
      >
        <Link href={href}>
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={mediaUrl(article.featuredImage, 'large')}
              alt={alt}
              fill
              priority={priority}
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
            <div className="mb-2 flex items-center gap-2">
              {article.breaking && <Badge variant="breaking">Breaking</Badge>}
              {article.category && (
                <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                  {article.category.name}
                </span>
              )}
            </div>
            <h2
              className={cn(
                'font-serif text-2xl font-bold leading-tight sm:text-3xl md:text-4xl',
                headingClassName,
              )}
            >
              {article.title}
            </h2>
            {showSummary && article.subtitle && (
              <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-white/80 sm:text-base">
                {article.subtitle}
              </p>
            )}
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article className={cn('group grid grid-cols-[1fr_1.4fr] gap-4', className)}>
        <Link
          href={href}
          className="relative aspect-[4/3] overflow-hidden rounded-lg"
        >
          <Image
            src={img}
            alt={alt}
            fill
            sizes="(max-width: 640px) 40vw, 240px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div>
          <CategoryBadge category={article.category} />
          <h3
            className={cn(
              'mt-1 font-serif text-lg font-bold leading-snug',
              headingClassName,
            )}
          >
            <Link href={href} className="hover:text-primary">
              {article.title}
            </Link>
          </h3>
          {showSummary && article.summary && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {article.summary}
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            {timeAgo(article.publishedAt)}
          </p>
        </div>
      </article>
    );
  }

  // default
  return (
    <article className={cn('group flex flex-col', className)}>
      <Link
        href={href}
        className="relative aspect-[16/10] overflow-hidden rounded-lg"
      >
        <Image
          src={img}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {article.breaking && (
          <Badge variant="breaking" className="absolute left-3 top-3">
            Breaking
          </Badge>
        )}
      </Link>
      <div className="flex flex-1 flex-col pt-3">
        <CategoryBadge category={article.category} />
        <h3
          className={cn(
            'mt-1 font-serif text-xl font-bold leading-snug',
            headingClassName,
          )}
        >
          <Link href={href} className="hover:text-primary">
            {article.title}
          </Link>
        </h3>
        {showSummary && article.summary && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
            {article.summary}
          </p>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          {timeAgo(article.publishedAt)}
          {article.readingTimeMinutes
            ? ` · ${article.readingTimeMinutes} min read`
            : ''}
        </p>
      </div>
    </article>
  );
}
