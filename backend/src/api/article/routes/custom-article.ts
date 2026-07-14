/**
 * Custom (non-CRUD) article routes. The view-increment endpoint is public so
 * the frontend can record reads; keep it rate-limited at the edge/CDN.
 */
export default {
  routes: [
    {
      method: 'PUT',
      path: '/articles/:id/view',
      handler: 'api::article.article.incrementView',
      config: {
        auth: false,
      },
    },
  ],
};
