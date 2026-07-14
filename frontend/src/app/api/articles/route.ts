import { NextResponse } from 'next/server';
import { getArticles } from '@/services/articles';

/**
 * Client-facing article listing endpoint used by the infinite-scroll hook.
 * Wraps the server-only service so the browser never talks to Strapi directly.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const num = (key: string) => {
    const v = searchParams.get(key);
    return v ? Number(v) : undefined;
  };

  const result = await getArticles({
    page: num('page') ?? 1,
    pageSize: num('pageSize') ?? 12,
    category: searchParams.get('category') ?? undefined,
    subcategory: searchParams.get('subcategory') ?? undefined,
    tag: searchParams.get('tag') ?? undefined,
    author: searchParams.get('author') ?? undefined,
    search: searchParams.get('search') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
    trending: searchParams.get('trending') === 'true' || undefined,
    editorsPick: searchParams.get('editorsPick') === 'true' || undefined,
  });

  return NextResponse.json(result, {
    headers: {
      // Cache at the edge/CDN; SWR keeps lists fresh without hammering origin.
      'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
    },
  });
}
