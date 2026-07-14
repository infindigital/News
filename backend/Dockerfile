# ─── Build stage ──────────────────────────────────────────────
FROM node:22-alpine AS build

# Native deps for sharp / better-sqlite3 builds
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev python3 > /dev/null 2>&1

WORKDIR /opt/app
ENV NODE_ENV=production

COPY package.json package-lock.json* ./
RUN npm install --production=false

COPY . .
RUN npm run build

# ─── Runtime stage ────────────────────────────────────────────
FROM node:22-alpine AS runtime

RUN apk add --no-cache vips-dev > /dev/null 2>&1

WORKDIR /opt/app
ENV NODE_ENV=production
ENV PATH=/opt/app/node_modules/.bin:$PATH

COPY --from=build /opt/app ./

RUN addgroup -S strapi && adduser -S strapi -G strapi \
  && chown -R strapi:strapi /opt/app
USER strapi

EXPOSE 1337
CMD ["npm", "run", "start"]
