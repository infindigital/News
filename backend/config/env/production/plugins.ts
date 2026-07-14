/**
 * Production plugin overrides. Forces Cloudinary for uploads and locks down
 * GraphQL introspection/playground.
 */
export default ({ env }) => ({
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
    },
  },
  graphql: {
    config: {
      playgroundAlways: false,
      apolloServer: {
        introspection: false,
      },
    },
  },
});
