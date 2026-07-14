/**
 * Article lifecycle hooks:
 *  - Auto-compute reading time from content on create/update.
 *  - Trigger the frontend's on-demand ISR endpoint after publish so pages
 *    refresh immediately (configure REVALIDATE_URL + REVALIDATE_SECRET).
 */

function readingTime(content?: string): number {
  if (!content) return 1;
  const words = content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

async function revalidate(slug?: string) {
  const url = process.env.REVALIDATE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': secret,
      },
      body: JSON.stringify({
        path: slug ? `/article/${slug}` : '/',
        tag: 'articles',
      }),
    });
  } catch (err) {
    strapi.log.warn(`ISR revalidation failed: ${(err as Error).message}`);
  }
}

export default {
  beforeCreate(event: any) {
    const { data } = event.params;
    if (data.content && !data.readingTimeMinutes) {
      data.readingTimeMinutes = readingTime(data.content);
    }
  },
  beforeUpdate(event: any) {
    const { data } = event.params;
    if (data.content) {
      data.readingTimeMinutes = readingTime(data.content);
    }
  },
  async afterUpdate(event: any) {
    await revalidate(event.result?.slug);
  },
  async afterCreate(event: any) {
    await revalidate(event.result?.slug);
  },
};
