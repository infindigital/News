import { injectHeadingIds } from '@/lib/toc';

/**
 * Renders article rich content. The HTML originates from Strapi's rich-text /
 * blocks field, authored by trusted editors. In production, run it through a
 * sanitizer (e.g. sanitize-html / DOMPurify) at the ingest boundary before
 * storing/serving. Heading ids are injected so the TOC anchors resolve.
 */
export function ArticleBody({ html }: { html: string }) {
  const withIds = injectHeadingIds(html);
  return (
    <div
      className="article-prose"
      dangerouslySetInnerHTML={{ __html: withIds }}
    />
  );
}
