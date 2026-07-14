import type { Metadata } from 'next';

import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { Breadcrumbs } from '@/components/features/breadcrumbs';

// Mostly-static editorial content.
export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'About Us',
  description: `Who we are and how we report — the mission and standards behind ${siteConfig.name}.`,
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="container max-w-3xl py-10">
      <Breadcrumbs
        items={[
          { name: 'Home', url: '/' },
          { name: 'About Us', url: '/about' },
        ]}
      />

      <h1 className="font-serif text-4xl font-black leading-tight">About Us</h1>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
        {siteConfig.name} is an independent newsroom dedicated to fair, fearless
        and factual reporting for a connected world.
      </p>

      <h2 className="font-serif text-2xl font-bold mt-8 mb-3">Our mission</h2>
      <p className="mb-4 text-muted-foreground leading-relaxed">
        We exist to hold power to account and to help readers make sense of a
        fast-changing world. From local stories to global affairs, we pursue the
        truth without fear or favour, and we believe quality journalism is a
        public good worth defending.
      </p>

      <h2 className="font-serif text-2xl font-bold mt-8 mb-3">
        Editorial standards
      </h2>
      <p className="mb-4 text-muted-foreground leading-relaxed">
        Accuracy comes first. Every story is reported from primary sources,
        checked by editors and corrected transparently when we get something
        wrong. Our commitments include:
      </p>
      <ul className="list-disc pl-6 space-y-1 text-muted-foreground mb-4">
        <li>Independence from political and commercial influence.</li>
        <li>Clear separation between news reporting and opinion.</li>
        <li>Named sources wherever possible, and a high bar for anonymity.</li>
        <li>Prompt, visible corrections when errors are identified.</li>
        <li>Respect for privacy and the dignity of the people we cover.</li>
      </ul>

      <h2 className="font-serif text-2xl font-bold mt-8 mb-3">Our history</h2>
      <p className="mb-4 text-muted-foreground leading-relaxed">
        Founded in {siteConfig.founded}, {siteConfig.name} grew from a small
        digital startup into a full-service newsroom covering politics, business,
        technology, science, sport and culture. Today our reporting reaches
        millions of readers across every platform, published by{' '}
        {siteConfig.publisher}.
      </p>

      <h2 className="font-serif text-2xl font-bold mt-8 mb-3">Leadership</h2>
      <p className="mb-4 text-muted-foreground leading-relaxed">
        Our newsroom is led by an experienced team of editors and correspondents.
        Detailed leadership profiles are published here:
      </p>
      <ul className="list-disc pl-6 space-y-1 text-muted-foreground mb-4">
        <li>Editor-in-Chief — profile coming soon.</li>
        <li>Managing Editor — profile coming soon.</li>
        <li>Head of Investigations — profile coming soon.</li>
        <li>Standards &amp; Ethics Editor — profile coming soon.</li>
      </ul>

      <h2 className="font-serif text-2xl font-bold mt-8 mb-3">Get in touch</h2>
      <p className="mb-4 text-muted-foreground leading-relaxed">
        Have a tip, a correction or a question? Visit our{' '}
        <a href="/contact" className="text-primary hover:underline">
          contact page
        </a>{' '}
        to reach the newsroom.
      </p>
    </div>
  );
}
