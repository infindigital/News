import type { Metadata } from 'next';
import { Mail, MapPin } from 'lucide-react';

import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/features/page-header';
import { Breadcrumbs } from '@/components/features/breadcrumbs';
import { ContactForm } from '@/components/features/contact-form';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description: `Get in touch with the ${siteConfig.name} newsroom — tips, corrections and enquiries.`,
  path: '/contact',
});

export default function ContactPage() {
  const social = Object.entries(siteConfig.social) as [string, string][];

  return (
    <div>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact Us"
        description="Story tips, corrections, feedback or general enquiries — we’d love to hear from you."
      />
      <div className="container py-8">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: 'Contact', url: '/contact' },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          {/* Form */}
          <div>
            <h2 className="mb-4 font-serif text-2xl font-bold">
              Send us a message
            </h2>
            <ContactForm />
          </div>

          {/* Contact info */}
          <aside className="space-y-6">
            <div className="rounded-lg border bg-card p-5">
              <h3 className="mb-3 font-serif text-lg font-bold">Newsroom</h3>
              <p className="flex items-start gap-3 text-sm text-muted-foreground">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a
                  href="mailto:newsroom@meridian.news"
                  className="hover:text-primary"
                >
                  newsroom@meridian.news
                </a>
              </p>
              <p className="mt-3 flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  {siteConfig.publisher}
                  <br />
                  1 Press Square, Suite 400
                  <br />
                  New York, NY 10001
                </span>
              </p>
            </div>

            <div className="rounded-lg border bg-card p-5">
              <h3 className="mb-3 font-serif text-lg font-bold">Follow us</h3>
              <ul className="space-y-2 text-sm">
                {social.map(([name, url]) => (
                  <li key={name}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="capitalize text-muted-foreground hover:text-primary"
                    >
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
