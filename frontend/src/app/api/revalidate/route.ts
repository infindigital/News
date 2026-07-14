import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * On-demand ISR endpoint. Strapi fires a webhook here on publish/update so
 * pages refresh instantly without waiting for the time-based revalidate window.
 *
 * Configure the Strapi webhook to POST:
 *   { "path": "/article/some-slug", "tag": "articles", "secret": "<REVALIDATE_SECRET>" }
 */
export async function POST(request: Request) {
  const secret =
    request.headers.get('x-revalidate-secret') ??
    new URL(request.url).searchParams.get('secret');

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  let body: { path?: string; tag?: string } = {};
  try {
    body = await request.json();
  } catch {
    // Body optional — allow query-param driven revalidation.
  }

  const revalidated: string[] = [];
  if (body.path) {
    revalidatePath(body.path);
    revalidated.push(`path:${body.path}`);
  }
  if (body.tag) {
    revalidateTag(body.tag);
    revalidated.push(`tag:${body.tag}`);
  }
  // Always refresh the homepage on any content change.
  revalidatePath('/');
  revalidated.push('path:/');

  return NextResponse.json({ revalidated, now: Date.now() });
}
