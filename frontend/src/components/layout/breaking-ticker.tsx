'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Article } from '@/types';

/**
 * Breaking-news ticker. Renders a duplicated marquee track and animates it via
 * CSS keyframes (see tailwind `animate-ticker`) so it loops seamlessly. Pauses
 * on hover for readability/accessibility.
 */
export function BreakingTicker({ items }: { items: Article[] }) {
  if (!items.length) return null;

  const track = [...items, ...items];

  return (
    <div className="border-b bg-breaking text-breaking-foreground">
      <div className="container flex items-center gap-4 py-2">
        <span className="flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          Breaking
        </span>
        <div className="ticker-mask group relative flex-1 overflow-hidden">
          <motion.div
            className="flex w-max gap-8 whitespace-nowrap animate-ticker group-hover:[animation-play-state:paused]"
            aria-label="Breaking news headlines"
          >
            {track.map((item, i) => (
              <Link
                key={`${item.id}-${i}`}
                href={`/article/${item.slug}`}
                className="text-sm font-medium hover:underline"
              >
                {item.title}
                <span className="mx-4 opacity-50">•</span>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
