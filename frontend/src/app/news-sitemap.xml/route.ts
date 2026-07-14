import { getArticles } from '@/services/articles';
import { siteConfig } from '@/config/site';

const BASE = siteConfig.url;

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      default:
        return '&quot;';
    }
  });
}

/**
 * Google News sitemap. Lists articles published in the last 48 hours with the
 * required <news:news> annotations. Google re-crawls this frequently, so it is
 * cached briefly at the edge.
 */
export async function GET() {
  const { items } = await getArticles({ pageSize: 100 });
  const twoDaysAgo = Date.now() - 48 * 60 * 60 * 1000;

  const recent = items.filter((a) => {
    const published = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    return published >= twoDaysAgo;
  });

  const urls = recent
    .map(
      (a) => `  <url>
    <loc>${BASE}/article/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(siteConfig.name)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${a.publishedAt}</news:publication_date>
      <news:title>${escapeXml(a.title)}</news:title>
    </news:news>
  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=600, stale-while-revalidate=1200',
    },
  });
}
