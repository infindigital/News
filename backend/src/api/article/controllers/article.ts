import { factories } from '@strapi/strapi';

/**
 * Article controller. Extends the core controller with an `incrementView`
 * action used by the frontend to record reads without exposing full write
 * access to the collection.
 */
export default factories.createCoreController(
  'api::article.article',
  ({ strapi }) => ({
    async incrementView(ctx) {
      const { id } = ctx.params;
      const entity = await strapi.documents('api::article.article').findOne({
        documentId: id,
        fields: ['viewCount'],
      });
      if (!entity) return ctx.notFound();

      const updated = await strapi.documents('api::article.article').update({
        documentId: id,
        data: { viewCount: (entity.viewCount ?? 0) + 1 },
      });
      ctx.body = { viewCount: updated.viewCount };
    },
  }),
);
