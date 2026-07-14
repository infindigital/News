'use client';

import { useEffect, useState } from 'react';
import type { TocItem } from '@/lib/toc';
import { cn } from '@/lib/utils';

/** Sticky table of contents with scrollspy highlighting the active section. */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!items.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 },
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="sticky top-28">
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        In this article
      </p>
      <ul className="space-y-2 border-l">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? 'ml-3' : ''}>
            <a
              href={`#${item.id}`}
              className={cn(
                '-ml-px block border-l-2 py-0.5 pl-3 text-sm transition-colors',
                activeId === item.id
                  ? 'border-primary font-medium text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
