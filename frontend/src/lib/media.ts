import type { StrapiMedia } from '@/types';

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';

/**
 * Resolve a Strapi/Cloudinary media object to an absolute URL.
 * Strapi returns relative paths for local uploads; Cloudinary returns absolute.
 */
export function mediaUrl(
  media?: StrapiMedia | null,
  size: 'thumbnail' | 'small' | 'medium' | 'large' | 'original' = 'original',
): string {
  if (!media) return '/placeholder.svg';
  const chosen =
    size !== 'original' && media.formats?.[size]
      ? media.formats[size]!.url
      : media.url;
  if (!chosen) return '/placeholder.svg';
  return chosen.startsWith('http') ? chosen : `${STRAPI_URL}${chosen}`;
}

export function mediaAlt(media?: StrapiMedia | null, fallback = ''): string {
  return media?.alternativeText || fallback;
}
