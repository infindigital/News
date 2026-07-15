/**
 * Strapi application entry.
 *
 * `bootstrap` runs once the app is ready. We use it to automatically grant the
 * public (unauthenticated) role read access to published content, plus the two
 * safe public writes (newsletter, comment) and the article view counter — so
 * the frontend works immediately with no manual clicking in Settings → Roles.
 */

const READ_COLLECTIONS = [
  'article',
  'category',
  'subcategory',
  'author',
  'tag',
  'page',
  'menu',
  'advertisement',
  'poll',
  'live-blog',
  'gallery',
  'video',
  'podcast',
  'event',
  'site-setting',
  'seo-setting',
  'comment',
];

export default {
  register(/* { strapi } */) {},

  async bootstrap({ strapi }: { strapi: any }) {
    try {
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (!publicRole) return;

      // Build the list of action UIDs the public role should have.
      const actions: string[] = [];
      for (const ct of READ_COLLECTIONS) {
        actions.push(`api::${ct}.${ct}.find`);
        actions.push(`api::${ct}.${ct}.findOne`);
      }
      actions.push(
        'api::newsletter-subscriber.newsletter-subscriber.create',
        'api::comment.comment.create',
        'api::article.article.incrementView',
      );

      let granted = 0;
      for (const action of actions) {
        // Only create the permission if it doesn't already exist (idempotent).
        const existing = await strapi
          .query('plugin::users-permissions.permission')
          .findOne({ where: { action, role: publicRole.id } });

        if (!existing) {
          await strapi
            .query('plugin::users-permissions.permission')
            .create({ data: { action, role: publicRole.id } });
          granted += 1;
        }
      }

      if (granted > 0) {
        strapi.log.info(
          `[bootstrap] Granted ${granted} public read/write permissions for the frontend.`,
        );
      }
    } catch (err) {
      strapi.log.warn(
        `[bootstrap] Could not auto-configure public permissions: ${
          (err as Error).message
        } — set them manually in Settings → Roles → Public.`,
      );
    }
  },
};
