export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  url: env('PUBLIC_URL', ''),
  webhooks: {
    // Allow webhook payloads to include entity relations (used for ISR triggers).
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
