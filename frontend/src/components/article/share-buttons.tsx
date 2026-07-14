'use client';

import { useState } from 'react';
import {
  Facebook,
  Link2,
  Linkedin,
  Mail,
  Twitter,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  url: string;
  title: string;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

/** Social sharing controls. Used both as a sticky rail and inline. */
export function ShareButtons({
  url,
  title,
  orientation = 'vertical',
  className,
}: Props) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  const links = [
    {
      label: 'Share on Twitter',
      href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`,
      icon: Twitter,
    },
    {
      label: 'Share on Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
      icon: Facebook,
    },
    {
      label: 'Share on LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
      icon: Linkedin,
    },
    {
      label: 'Share by email',
      href: `mailto:?subject=${enc(title)}&body=${enc(url)}`,
      icon: Mail,
    },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div
      className={cn(
        'flex gap-2',
        orientation === 'vertical' ? 'flex-col' : 'flex-row items-center',
        className,
      )}
    >
      {orientation === 'vertical' && (
        <span className="text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Share
        </span>
      )}
      {links.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-9 w-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button
        onClick={copy}
        aria-label="Copy link"
        className="flex h-9 w-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
      >
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
