import type { Metadata } from 'next';

import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { Breadcrumbs } from '@/components/features/breadcrumbs';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: `How ${siteConfig.name} collects, uses and protects your personal information.`,
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-3xl py-10">
      <Breadcrumbs
        items={[
          { name: 'Home', url: '/' },
          { name: 'Privacy Policy', url: '/privacy-policy' },
        ]}
      />

      <h1 className="font-serif text-4xl font-black leading-tight">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: 14 July 2026
      </p>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        This Privacy Policy explains how {siteConfig.name} (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;) collects, uses, shares and protects your personal
        information when you visit our website or use our services. By using our
        site you agree to the practices described here.
      </p>

      <h2 className="font-serif text-2xl font-bold mt-8 mb-3">
        Information We Collect
      </h2>
      <p className="mb-4 text-muted-foreground leading-relaxed">
        We collect information in a few ways:
      </p>
      <ul className="list-disc pl-6 space-y-1 text-muted-foreground mb-4">
        <li>
          <strong>Information you provide</strong> — such as your email address
          when you subscribe to newsletters, or details you submit through our
          contact forms.
        </li>
        <li>
          <strong>Automatically collected data</strong> — such as your IP
          address, browser type, device information and pages visited.
        </li>
        <li>
          <strong>Cookies and similar technologies</strong> — used to remember
          preferences and understand how our site is used.
        </li>
      </ul>

      <h2 className="font-serif text-2xl font-bold mt-8 mb-3">How We Use It</h2>
      <p className="mb-4 text-muted-foreground leading-relaxed">
        We use the information we collect to:
      </p>
      <ul className="list-disc pl-6 space-y-1 text-muted-foreground mb-4">
        <li>Deliver, maintain and improve our journalism and services.</li>
        <li>Send newsletters and updates you have requested.</li>
        <li>Respond to your enquiries and feedback.</li>
        <li>Analyse usage so we can make the site faster and more relevant.</li>
        <li>Detect, prevent and address technical issues or abuse.</li>
      </ul>

      <h2 className="font-serif text-2xl font-bold mt-8 mb-3">Cookies</h2>
      <p className="mb-4 text-muted-foreground leading-relaxed">
        Cookies are small text files stored on your device. We use essential
        cookies to make the site work, and analytics cookies to understand
        engagement. You can control or delete cookies through your browser
        settings, though some features may not function correctly without them.
      </p>

      <h2 className="font-serif text-2xl font-bold mt-8 mb-3">Third Parties</h2>
      <p className="mb-4 text-muted-foreground leading-relaxed">
        We may share limited data with trusted service providers who help us
        operate the site — for example analytics, email delivery and advertising
        partners. These providers are bound to use your information only as
        needed to provide their services. We do not sell your personal
        information.
      </p>

      <h2 className="font-serif text-2xl font-bold mt-8 mb-3">Your Rights</h2>
      <p className="mb-4 text-muted-foreground leading-relaxed">
        Depending on where you live, you may have the right to:
      </p>
      <ul className="list-disc pl-6 space-y-1 text-muted-foreground mb-4">
        <li>Access the personal information we hold about you.</li>
        <li>Request correction or deletion of your data.</li>
        <li>Object to or restrict certain processing.</li>
        <li>Withdraw consent, such as unsubscribing from newsletters.</li>
      </ul>

      <h2 className="font-serif text-2xl font-bold mt-8 mb-3">Contact</h2>
      <p className="mb-4 text-muted-foreground leading-relaxed">
        If you have questions about this policy or wish to exercise your rights,
        contact us at{' '}
        <a
          href="mailto:privacy@meridian.news"
          className="text-primary hover:underline"
        >
          privacy@meridian.news
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
