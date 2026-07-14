import { slugify } from './utils';

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Extract h2/h3 headings from article HTML for the table of contents.
 * Ensures each heading has a stable id (added back into the HTML by
 * `injectHeadingIds`) so anchor links and scrollspy line up.
 */
export function extractHeadings(html: string): TocItem[] {
  const items: TocItem[] = [];
  const regex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html))) {
    const level = Number(match[1]) as 2 | 3;
    const text = match[2]!.replace(/<[^>]*>/g, '').trim();
    const idMatch = match[0].match(/id=["']([^"']+)["']/);
    const id = idMatch?.[1] ?? slugify(text);
    if (text) items.push({ id, text, level });
  }
  return items;
}

/** Ensure every h2/h3 carries an id attribute matching the TOC. */
export function injectHeadingIds(html: string): string {
  return html.replace(
    /<h([23])([^>]*)>(.*?)<\/h\1>/gi,
    (full, level, attrs, inner) => {
      if (/id=/.test(attrs)) return full;
      const id = slugify(inner.replace(/<[^>]*>/g, ''));
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    },
  );
}
