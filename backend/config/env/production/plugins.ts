/**
 * Production plugin overrides. Cloudinary is configured in the base
 * config/plugins.ts and activates automatically when CLOUDINARY_* env vars are
 * set — so we don't force it here (that would break uploads on a production
 * instance running without Cloudinary, e.g. a self-hosted demo). This file only
 * locks down GraphQL introspection/playground.
 */
export default (/* { env } */) => ({
  graphql: {
    config: {
      playgroundAlways: false,
      apolloServer: {
        introspection: false,
      },
    },
  },
});
