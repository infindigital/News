'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

/**
 * Lite YouTube embed: shows the thumbnail and only loads the heavy iframe on
 * click. Keeps article pages fast (no third-party JS until the user opts in).
 */
export function YouTubeEmbed({
  id,
  title = 'YouTube video',
}: {
  id: string;
  title?: string;
}) {
  const [active, setActive] = useState(false);

  return (
    <div className="relative my-8 aspect-video overflow-hidden rounded-lg bg-black">
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button
          onClick={() => setActive(true)}
          className="group absolute inset-0 h-full w-full"
          aria-label={`Play ${title}`}
        >
          <Image
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-breaking text-white shadow-lg transition-transform group-hover:scale-110">
              <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
