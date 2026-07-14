import type { Metadata } from 'next';

import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { Breadcrumbs } from '@/components/features/breadcrumbs';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Terms & Conditions',
  description: `The terms governing your use of ${siteConfig.name}.`,
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-10">
      <Breadcrumbs
        items={[
          { name: 'Home', url: '/' },
          { name: 'Terms & Conditions', url: '/terms' },
        ]}
      />

      <h1 className="font-serif text-4xl font-black leading-tight">
        Terms &amp; Conditions
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: 14 July 2026
      </p>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        These Terms &amp; Conditions govern your access to and use of{' '}
        {siteConfig.name}. Please read them carefully — by using our site you
        agree to be bound by them.
      </p>

      <h2 className="font-serif text-2xl font-bold mt-8 mb-3">Acceptance</h2>
      <p className="mb-4 text-muted-foreground leading-relaxed">
        By accessing or using our website you accept these terms in full. If you
        do not agree with any part of them, you must not use our site.
      </p>

      <h2 className="font-serif text-2xl font-bold mt-8 mb-3">
        Use of Content
      </h2>
      <p className="mb-4 text-muted-foreground leading-relaxed">
        Our content is provided for your personal, non-commercial use and general
        information. You may read, share links to, and quote brief extracts with
        attribution, but you may not republish or redistribute substantial
        portions without our prior written permission.
      </p>

      <h2 className="font-serif text-2xl font-bold mt-8 mb-3">
        Intellectual Property
      </h2>
      <p className="mb-4 text-muted-foreground leading-relaxed">
        All content on this site — including articles, photographs, video, audio,
        graphics, logos and trademarks — is owned by or licensed to{' '}
        {siteConfig.publisher} and is protected by copyright and other laws.
        Unauthorised use is prohibited.
      </p>

      <h2 className="font-serif text-2xl font-bold mt-8 mb-3">User Conduct</h2>
      <p className="mb-4 text-muted-foreground leading-relaxed">
        When using our site you agree not to:
      </p>
      <ul className="list-disc pl-6 space-y-1 text-muted-foreground mb-4">
        <li>Break any applicable law or infringe the rights of others.</li>
        <li>Attempt to gain unauthorised access to our systems.</li>
        <li>Interfere with the operation or security of the site.</li>
        <li>Scrape, harvest or misuse content or data at scale.</li>
      </ul>

      <h2 className="font-serif text-2xl font-bold mt-8 mb-3">Comments</h2>
      <p className="mb-4 text-muted-foreground leading-relaxed">
        Where comments are enabled, you are responsible for what you post. We may
        moderate, edit or remove contributions that are unlawful, abusive,
        defamatory or off-topic, and we may suspend accounts that breach these
        terms. You retain ownership of your comments but grant us a licence to
        display them.
      </p>

      <h2 className="font-serif text-2xl font-bold mt-8 mb-3">Disclaimers</h2>
      <p className="mb-4 text-muted-foreground leading-relaxed">
        Our content is provided &ldquo;as is&rdquo; without warranties of any
        kind. While we strive for accuracy, we do not guarantee that all
        information is complete, current or error-free, and we are not liable for
        reliance placed on it.
      </p>

      <h2 className="font-serif text-2xl font-bold mt-8 mb-3">
        Limitation of Liability
      </h2>
      <p className="mb-4 text-muted-foreground leading-relaxed">
        To the fullest extent permitted by law, {siteConfig.publisher} shall not
        be liable for any indirect, incidental or consequential damages arising
        from your use of, or inability to use, our site.
      </p>

      <h2 className="font-serif text-2xl font-bold mt-8 mb-3">Governing Law</h2>
      <p className="mb-4 text-muted-foreground leading-relaxed">
        These terms are governed by the laws of the jurisdiction in which{' '}
        {siteConfig.publisher} is established, and any disputes are subject to the
        exclusive jurisdiction of its courts.
      </p>

      <h2 className="font-serif text-2xl font-bold mt-8 mb-3">Changes</h2>
      <p className="mb-4 text-muted-foreground leading-relaxed">
        We may update these terms from time to time. Changes take effect when
        posted on this page, and your continued use of the site constitutes
        acceptance of the revised terms.
      </p>

      <h2 className="font-serif text-2xl font-bold mt-8 mb-3">Contact</h2>
      <p className="mb-4 text-muted-foreground leading-relaxed">
        Questions about these terms? Reach us at{' '}
        <a
          href="mailto:legal@meridian.news"
          className="text-primary hover:underline"
        >
          legal@meridian.news
        </a>{' '}
        or via our{' '}
        <a href="/contact" className="text-primary hover:underline">
          contact page
        </a>
        .
      </p>
    </div>
  );
}
