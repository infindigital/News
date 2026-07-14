import 'server-only';
import type { Gallery, LiveBlog, Podcast, Poll, Video } from '@/types';
import { USE_MOCK_FALLBACK } from './http';
import {
  mockGalleries,
  mockLiveBlog,
  mockPodcasts,
  mockPoll,
  mockVideos,
} from './mock/data';

/**
 * Multimedia services. In this reference build they resolve from bundled data;
 * swap the bodies for `http.get(...)` calls once the corresponding Strapi
 * collections are populated. The signatures are already the ones the UI uses.
 */

export async function getVideos(): Promise<Video[]> {
  if (USE_MOCK_FALLBACK) return mockVideos;
  return mockVideos;
}

export async function getPodcasts(): Promise<Podcast[]> {
  return mockPodcasts;
}

export async function getGalleries(): Promise<Gallery[]> {
  return mockGalleries;
}

export async function getGalleryBySlug(
  slug: string,
): Promise<Gallery | null> {
  return mockGalleries.find((g) => g.slug === slug) ?? null;
}

export async function getActiveLiveBlog(): Promise<LiveBlog | null> {
  return mockLiveBlog.active ? mockLiveBlog : null;
}

export async function getActivePoll(): Promise<Poll | null> {
  return mockPoll.active ? mockPoll : null;
}
