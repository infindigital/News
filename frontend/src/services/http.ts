import axios, { type AxiosInstance } from 'axios';

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ?? 'http://localhost:1337/api';

/**
 * Shared axios instance for Strapi REST.
 * - Attaches a server-only API token when present (SSR/ISR privileged reads).
 * - Short timeout so mock fallback kicks in fast during local dev.
 */
export const http: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  // Only available on the server; never bundled to the client.
  const token = process.env.STRAPI_API_TOKEN;
  if (token && typeof window === 'undefined') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const USE_MOCK_FALLBACK =
  process.env.NEXT_PUBLIC_USE_MOCK_FALLBACK !== 'false';
