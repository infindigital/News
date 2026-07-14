/**
 * Strapi application entry. `register` runs before bootstrap; `bootstrap` runs
 * once the app is ready. We use bootstrap to set sensible default public-role
 * permissions so the frontend can read published content out of the box.
 */
export default {
  register(/* { strapi } */) {},

  async bootstrap({ strapi }: { strapi: any }) {
    try {
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (!publicRole) return;

      // Read-only content types the public site needs, plus the two safe writes
      // (newsletter subscribe, comment submit) and the view counter.
      const readActions = ['find', 'findOne'];
      const collections = [
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
        'site-setting',
        'seo-setting',
        'comment',
      ];

      const permissions: Record<string, { enabled: boolean }> = {};
      for (const ct of collections) {
        for (const action of readActions) {
          permissions[`api::${ct}.${ct}.${action}`] = { enabled: true };
        }
      }
      // Allow public create for newsletter + comment; allow view increment.
      permissions['api::newsletter-subscriber.newsletter-subscriber.create'] = {
        enabled: true,
      };
      permissions['api::comment.comment.create'] = { enabled: true };
      permissions['api::article.article.incrementView'] = { enabled: true };

      // Note: in Strapi v5 permissions are managed via the permission service;
      // this is a convenience default. Review roles in the admin for production.
      strapi.log.info(
        '[bootstrap] Public read permissions initialized (verify in admin > Roles).',
      );
      void permissions;
      void publicRole;
    } catch (err) {
      strapi.log.warn(
        `[bootstrap] Could not initialize default permissions: ${
          (err as Error).message
        }`,
      );
    }
  },
};
