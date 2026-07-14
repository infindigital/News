import type { Metadata } from 'next';
import { Check } from 'lucide-react';

import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { Breadcrumbs } from '@/components/features/breadcrumbs';
import { NewsletterForm } from '@/components/features/newsletter-form';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Newsletter',
  description: `Get the day's essential reporting from ${siteConfig.name} delivered to your inbox.`,
  path: '/newsletter',
});

const benefits = [
  'A concise morning briefing of the stories that matter.',
  'Exclusive analysis and reporting from our correspondents.',
  'Breaking-news alerts the moment big stories develop.',
  'No spam, ever — unsubscribe in one click.',
];

export default function NewsletterPage() {
  return (
    <div className="container py-8">
      <Breadcrumbs
        items={[
          { name: 'Home', url: '/' },
          { name: 'Newsletter', url: '/newsletter' },
        ]}
      />

      <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6 text-center sm:p-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Stay informed
        </p>
        <h1 className="font-serif text-3xl font-black leading-tight sm:text-4xl">
          The {siteConfig.name} Newsletter
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Join thousands of readers who start their day with our free briefing —
          the essential news, cut through and delivered to your inbox.
        </p>

        <ul className="mx-auto mt-6 max-w-md space-y-2 text-left">
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-start gap-3 text-sm text-muted-foreground"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {benefit}
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-8 max-w-md">
          <NewsletterForm compact />
        </div>
      </div>
    </div>
  );
}
