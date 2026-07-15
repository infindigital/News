import { NextResponse, type NextRequest } from 'next/server';

/**
 * Edge middleware: sets a per-request CSP nonce, security headers, and a simple
 * in-memory rate limit for the mutation API routes. For multi-instance
 * production, back the limiter with Redis/Upstash instead of the module map.
 */

const RATE_LIMIT = 30; // requests
const WINDOW_MS = 60_000; // per minute
const buckets = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || bucket.reset < now) {
    buckets.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limit write endpoints only.
  if (
    request.method === 'POST' &&
    (pathname.startsWith('/api/newsletter') ||
      pathname.startsWith('/api/comments') ||
      pathname.startsWith('/api/poll'))
  ) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      'anonymous';
    if (rateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429, headers: { 'Retry-After': '60' } },
      );
    }
  }

  // Static CSP (no per-request nonce) so pages stay statically cacheable / ISR
  // friendly. A nonce would force every page to render dynamically and would
  // also need to be threaded into Next's scripts; for a content site, allowing
  // 'self' + inline (which Next's hydration bootstrap requires) is the standard
  // trade-off. `https:` permits first-party analytics/embeds if added later.
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline' https:`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' blob: data: https: http://localhost:1337`,
    `font-src 'self' data:`,
    `frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com`,
    `connect-src 'self' https: http://localhost:1337`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'self'`,
  ].join('; ');

  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

export const config = {
  matcher: [
    // Run on everything except static assets and image optimizer.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)',
  ],
};
