export default ({ env }) => {
  // Use Cloudinary only when credentials are provided; otherwise Strapi falls
  // back to its built-in local uploader (files saved to public/uploads). This
  // lets local dev / Codespaces upload images without a Cloudinary account.
  const hasCloudinary = Boolean(env('CLOUDINARY_NAME'));

  return {
    ...(hasCloudinary && {
      upload: {
        config: {
          provider: 'cloudinary',
          providerOptions: {
            cloud_name: env('CLOUDINARY_NAME'),
            api_key: env('CLOUDINARY_KEY'),
            api_secret: env('CLOUDINARY_SECRET'),
          },
          actionOptions: {
            upload: {},
            uploadStream: {},
            delete: {},
          },
        },
      },
    }),

    // GraphQL endpoint (alongside REST)
    graphql: {
      config: {
        endpoint: '/graphql',
        shadowCRUD: true,
        playgroundAlways: env.bool('GRAPHQL_PLAYGROUND', false),
        depthLimit: 10,
        amountLimit: 100,
        apolloServer: {
          tracing: false,
          introspection: env.bool('GRAPHQL_INTROSPECTION', true),
        },
      },
    },

    // JWT auth / RBAC
    'users-permissions': {
      config: {
        jwt: {
          expiresIn: env('JWT_EXPIRES_IN', '7d'),
        },
      },
    },
  };
};
