import type { Metadata } from 'next';
import Link from 'next/link';

import { buildMetadata } from '@/lib/seo';
import { primaryCategories } from '@/config/site';
import { PageHeader } from '@/components/features/page-header';
import { Breadcrumbs } from '@/components/features/breadcrumbs';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Sitemap',
  description: 'A complete map of the sections and pages across our site.',
  path: '/sitemap',
});

interface LinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

const groups: LinkGroup[] = [
  {
    title: 'Sections',
    links: primaryCategories.map((c) => ({
      label: c.name,
      href: `/category/${c.slug}`,
    })),
  },
  {
    title: 'Opinion',
    links: [
      { label: 'Opinion', href: '/opinion' },
      { label: 'Editorial', href: '/editorial' },
      { label: 'Fact Check', href: '/fact-check' },
      { label: 'Explainers', href: '/explainers' },
    ],
  },
  {
    title: 'Multimedia',
    links: [
      { label: 'Videos', href: '/videos' },
      { label: 'Photo Gallery', href: '/gallery' },
      { label: 'Podcasts', href: '/podcasts' },
      { label: 'Live Updates', href: '/live' },
      { label: 'Election 2026', href: '/elections' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Newsletter', href: '/newsletter' },
      { label: 'Archive', href: '/archive' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Sitemap', href: '/sitemap' },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Navigate"
        title="Sitemap"
        description="Every section and page across the site, in one place."
      />
      <div className="container py-8">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: 'Sitemap', url: '/sitemap' },
          ]}
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="mb-3 flex items-center gap-3 font-serif text-lg font-bold">
                <span className="h-5 w-1.5 rounded-full bg-breaking" />
                {group.title}
              </h2>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
    </div>
  );
}
