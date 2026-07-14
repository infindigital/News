import { getArticles } from '@/services/articles';
import { getVideos, getActivePoll } from '@/services/multimedia';
import { primaryCategories } from '@/config/site';

import { HeroSection } from '@/components/home/hero-section';
import { CategoryRail } from '@/components/home/category-rail';
import { LatestGrid } from '@/components/home/latest-grid';
import { TrendingList } from '@/components/home/trending-list';
import { MultimediaStrip } from '@/components/home/multimedia-strip';
import { PollWidget } from '@/components/features/poll-widget';
import { AdSlot } from '@/components/features/ad-slot';
import { NewsletterForm } from '@/components/features/newsletter-form';
import { SectionHeading } from '@/components/features/section-heading';
import { ArticleCard } from '@/components/article/article-card';

// ISR: the homepage revalidates every 60s (also revalidated on-demand via webhook).
export const revalidate = 60;

export default async function HomePage() {
  const [
    featured,
    latest,
    trending,
    mostRead,
    editorsPicks,
    videos,
    poll,
  ] = await Promise.all([
    getArticles({ featured: true, pageSize: 5 }),
    getArticles({ pageSize: 9 }),
    getArticles({ trending: true, pageSize: 6 }),
    getArticles({ sort: 'viewCount:desc', pageSize: 6 }),
    getArticles({ editorsPick: true, pageSize: 4 }),
    getVideos(),
    getActivePoll(),
  ]);

  // Fetch the first three primary categories' rails in parallel.
  const rails = await Promise.all(
    primaryCategories.slice(0, 4).map(async (c) => ({
      ...c,
      items: (await getArticles({ category: c.slug, pageSize: 5 })).items,
    })),
  );

  return (
    <div className="container space-y-12 py-6">
      <AdSlot placement="leaderboard" />

      {/* Hero + trending sidebar */}
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-10">
          <HeroSection items={featured.items} />

          {editorsPicks.items.length > 0 && (
            <section aria-label="Editor's Picks">
              <SectionHeading title="Editor's Picks" href="/opinion" />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {editorsPicks.items.map((a) => (
                  <ArticleCard
                    key={a.id}
                    article={a}
                    variant="default"
                    showSummary={false}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-8">
          <TrendingList title="Trending Now" items={trending.items} />
          {poll && <PollWidget poll={poll} />}
          <AdSlot placement="sidebar" />
          <TrendingList
            title="Most Read"
            items={mostRead.items}
            showViews
          />
        </aside>
      </div>

      <LatestGrid items={latest.items} />

      <AdSlot placement="leaderboard" />

      {rails.map((rail) => (
        <CategoryRail
          key={rail.slug}
          title={rail.name}
          slug={rail.slug}
          items={rail.items}
        />
      ))}

      <MultimediaStrip videos={videos} />

      {/* Newsletter CTA */}
      <section className="rounded-lg bg-primary px-6 py-10 text-primary-foreground sm:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">
            Never miss a headline
          </h2>
          <p className="mt-2 text-primary-foreground/80">
            Get our free daily briefing delivered to your inbox every morning.
          </p>
          <div className="mx-auto mt-6 max-w-md">
            <NewsletterForm compact />
          </div>
        </div>
      </section>
    </div>
  );
}
