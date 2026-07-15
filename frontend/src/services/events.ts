import 'server-only';
import type { EventItem } from '@/types';
import { http, USE_MOCK_FALLBACK } from './http';
import { buildQuery } from './query';
import { normalizeCategory } from './normalize';
import { mockEvents } from './mock/data';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeEvent(raw: any): EventItem {
  const e = raw && 'data' in raw ? raw.data : raw;
  const media = e.featuredImage?.data ?? e.featuredImage;
  return {
    id: e.id,
    documentId: e.documentId,
    title: e.title,
    slug: e.slug,
    summary: e.summary,
    description: e.description,
    featuredImage: media
      ? {
          id: media.id,
          url: media.url,
          alternativeText: media.alternativeText ?? null,
          width: media.width,
          height: media.height,
          formats: media.formats,
        }
      : null,
    startDate: e.startDate,
    endDate: e.endDate,
    venue: e.venue,
    city: e.city,
    registrationUrl: e.registrationUrl,
    isFree: e.isFree,
    category: normalizeCategory(e.category),
    seo: e.seo,
  };
}

/** List events (soonest first). Falls back to bundled mock data. */
export async function getEvents(): Promise<EventItem[]> {
  try {
    const query = buildQuery({
      pageSize: 100,
      sort: 'startDate:asc',
      populate: ['featuredImage', 'category'],
    });
    const { data } = await http.get(`/events${query}`);
    return (data.data as unknown[]).map(normalizeEvent);
  } catch (error) {
    if (!USE_MOCK_FALLBACK) throw error;
    return mockEvents;
  }
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  try {
    const query = buildQuery({
      filters: { slug: { $eq: slug } },
      populate: ['featuredImage', 'category', 'seo', 'seo.ogImage'],
    });
    const { data } = await http.get(`/events${query}`);
    const entity = (data.data as unknown[])[0];
    return entity
      ? normalizeEvent(entity)
      : (mockEvents.find((e) => e.slug === slug) ?? null);
  } catch (error) {
    if (!USE_MOCK_FALLBACK) throw error;
    return mockEvents.find((e) => e.slug === slug) ?? null;
  }
}

export async function getAllEventSlugs(): Promise<string[]> {
  try {
    const { data } = await http.get(`/events${buildQuery({ pageSize: 1000 })}`);
    return (data.data as { slug: string }[]).map((e) => e.slug);
  } catch {
    return mockEvents.map((e) => e.slug);
  }
}
