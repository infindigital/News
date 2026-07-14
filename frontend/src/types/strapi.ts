/**
 * Generic Strapi v5 response envelope helpers.
 * Strapi v5 flattens attributes onto the entity (unlike v4), so entities are
 * plain objects with a `documentId`. These types model the REST shape.
 */

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiResponse<T> {
  data: T;
  meta: StrapiMeta;
}

export interface StrapiError {
  status: number;
  name: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface StrapiMediaFormat {
  url: string;
  width: number;
  height: number;
  size: number;
}

export interface StrapiMedia {
  id: number;
  documentId?: string;
  url: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  mime?: string;
  formats?: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  };
}

/** Common list query params accepted by the API service layer. */
export interface QueryParams {
  page?: number;
  pageSize?: number;
  sort?: string | string[];
  filters?: Record<string, unknown>;
  populate?: string | string[] | Record<string, unknown>;
  search?: string;
}
