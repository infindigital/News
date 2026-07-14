import 'server-only';
import type { Author, Category, Tag } from '@/types';
import { http, USE_MOCK_FALLBACK } from './http';
import { buildQuery } from './query';
import {
  normalizeAuthor,
  normalizeCategory,
  normalizeTag,
} from './normalize';
import { mockAuthors, mockCategories, mockTags } from './mock/data';

export async function getCategories(): Promise<Category[]> {
  try {
    const { data } = await http.get(
      `/categories${buildQuery({ pageSize: 100, sort: 'name:asc' })}`,
    );
    return (data.data as unknown[])
      .map(normalizeCategory)
      .filter(Boolean) as Category[];
  } catch (error) {
    if (!USE_MOCK_FALLBACK) throw error;
    return mockCategories;
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  try {
    const { data } = await http.get(
      `/categories${buildQuery({
        filters: { slug: { $eq: slug } },
        populate: ['subcategories'],
      })}`,
    );
    const entity = (data.data as unknown[])[0];
    return entity ? normalizeCategory(entity) : mockCat(slug);
  } catch (error) {
    if (!USE_MOCK_FALLBACK) throw error;
    return mockCat(slug);
  }
}

export async function getAuthors(): Promise<Author[]> {
  try {
    const { data } = await http.get(
      `/authors${buildQuery({ pageSize: 100, populate: ['avatar'] })}`,
    );
    return (data.data as unknown[])
      .map(normalizeAuthor)
      .filter(Boolean) as Author[];
  } catch (error) {
    if (!USE_MOCK_FALLBACK) throw error;
    return mockAuthors;
  }
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  try {
    const { data } = await http.get(
      `/authors${buildQuery({
        filters: { slug: { $eq: slug } },
        populate: ['avatar'],
      })}`,
    );
    const entity = (data.data as unknown[])[0];
    return entity ? normalizeAuthor(entity) : mockAuthor(slug);
  } catch (error) {
    if (!USE_MOCK_FALLBACK) throw error;
    return mockAuthor(slug);
  }
}

export async function getTags(): Promise<Tag[]> {
  try {
    const { data } = await http.get(
      `/tags${buildQuery({ pageSize: 200, sort: 'name:asc' })}`,
    );
    return (data.data as unknown[]).map(normalizeTag);
  } catch (error) {
    if (!USE_MOCK_FALLBACK) throw error;
    return mockTags;
  }
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  try {
    const { data } = await http.get(
      `/tags${buildQuery({ filters: { slug: { $eq: slug } } })}`,
    );
    const entity = (data.data as unknown[])[0];
    return entity ? normalizeTag(entity) : mockTag(slug);
  } catch (error) {
    if (!USE_MOCK_FALLBACK) throw error;
    return mockTag(slug);
  }
}

const mockCat = (s: string) =>
  mockCategories.find((c) => c.slug === s) ?? null;
const mockAuthor = (s: string) =>
  mockAuthors.find((a) => a.slug === s) ?? null;
const mockTag = (s: string) => mockTags.find((t) => t.slug === s) ?? null;
