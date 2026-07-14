import { cn } from '@/lib/utils';

/**
 * Advertisement placeholder slot. In production this renders the creative from
 * the Strapi `Advertisement` collection (or a GPT/AdSense tag). Kept as a
 * labelled placeholder so layouts reserve space and avoid CLS.
 */
export function AdSlot({
  placement,
  className,
}: {
  placement:
    | 'leaderboard'
    | 'sidebar'
    | 'in-article'
    | 'footer';
  className?: string;
}) {
  const sizes: Record<string, string> = {
    leaderboard: 'h-[90px] md:h-[120px]',
    sidebar: 'h-[250px]',
    'in-article': 'h-[250px]',
    footer: 'h-[90px]',
  };
  return (
    <div
      className={cn(
        'flex w-full items-center justify-center rounded-md border border-dashed bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground',
        sizes[placement],
        className,
      )}
      aria-label="Advertisement"
      data-ad-placement={placement}
    >
      Advertisement
    </div>
  );
}
