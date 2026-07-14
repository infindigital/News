import type { QueryParams } from '@/types';

/**
 * Serialize a QueryParams object into a Strapi v5 REST query string.
 * Supports nested filters, populate, sort and pagination without extra deps.
 */
export function buildQuery(params: QueryParams = {}): string {
  const search = new URLSearchParams();

  const append = (key: string, value: unknown) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((v, i) => append(`${key}[${i}]`, v));
    } else if (typeof value === 'object') {
      Object.entries(value as Record<string, unknown>).forEach(([k, v]) =>
        append(`${key}[${k}]`, v),
      );
    } else {
      search.append(key, String(value));
    }
  };

  if (params.page || params.pageSize) {
    append('pagination[page]', params.page ?? 1);
    append('pagination[pageSize]', params.pageSize ?? 12);
  }
  if (params.sort) append('sort', params.sort);
  if (params.filters) append('filters', params.filters);
  if (params.populate) append('populate', params.populate);

  const qs = search.toString();
  return qs ? `?${qs}` : '';
}
