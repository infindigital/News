import Link from 'next/link';
import { getArticles } from '@/services/articles';
import { siteConfig } from '@/config/site';
import { formatDate } from '@/lib/utils';
import { MegaNav } from './mega-nav';
import { MobileNav } from './mobile-nav';
import { HeaderSearch } from './header-search';
import { ThemeToggle } from './theme-toggle';
import { BreakingTicker } from './breaking-ticker';

/**
 * Sticky site header. Server component: fetches breaking headlines for the
 * ticker, then composes client-side interactive bits (nav, search, theme).
 */
export async function SiteHeader() {
  const breaking = await getArticles({ breaking: true, pageSize: 6 });

  return (
    <header className="sticky top-0 z-50 w-full">
      <BreakingTicker items={breaking.items} />

      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        {/* Masthead */}
        <div className="container flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3">
            <MobileNav />
            <Link href="/" className="flex flex-col leading-none">
              <span className="font-serif text-2xl font-black tracking-tight text-primary sm:text-3xl">
                {siteConfig.name}
              </span>
              <span className="hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:block">
                {siteConfig.tagline}
              </span>
            </Link>
          </div>

          <p className="hidden text-xs text-muted-foreground md:block">
            {formatDate(new Date().toISOString())}
          </p>

          <div className="flex items-center gap-1">
            <HeaderSearch />
            <ThemeToggle />
            <Link
              href="/newsletter"
              className="ml-1 hidden rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
            >
              Subscribe
            </Link>
          </div>
        </div>

        {/* Primary nav bar */}
        <div className="border-t">
          <div className="container flex h-11 items-center justify-between">
            <MegaNav />
            <Link
              href="/live"
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-breaking"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-breaking" />
              Live
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
