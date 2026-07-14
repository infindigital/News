# Architecture

## Overview

Meridian News is a **headless** platform: editorial content lives in Strapi and
is consumed by a Next.js frontend over REST (and GraphQL where useful). The two
services are independently deployable and scale separately.

```
Reader ──▶ Cloudflare CDN ──▶ Vercel (Next.js) ──▶ Strapi (Docker) ──▶ PostgreSQL
                                     │                     │
                                 Next/Image            Cloudinary (origin media)
```

## Frontend (`frontend/`)

### Rendering strategy

- **React Server Components** by default — data fetching happens on the server,
  keeping the client bundle small.
- **ISR** (Incremental Static Regeneration): list and article pages set
  `export const revalidate = …` and are refreshed **on demand** when Strapi
  fires the `/api/revalidate` webhook after a publish/update.
- **Client interactivity** is isolated to leaf components (`'use client'`):
  ticker, mega-nav, search, theme toggle, poll, comments, infinite scroll.

### Folder structure

```
src/
├── app/                    # App Router routes, layouts, route handlers
│   ├── api/                # Internal route handlers (newsletter, comments, poll, revalidate, articles)
│   ├── article/[slug]/     # Article detail
│   ├── category/[slug]/    # Category + [sub] subcategory
│   ├── author/[slug]/      # Author pages
│   ├── tag/[slug]/         # Tag pages
│   ├── (sections & static) # opinion, editorial, videos, gallery, podcasts, live, about, legal…
│   ├── sitemap.ts          # XML sitemap
│   ├── news-sitemap.xml/   # Google News sitemap (route handler)
│   ├── robots.ts           # robots.txt
│   └── manifest.ts         # PWA manifest
├── components/
│   ├── ui/                 # shadcn/ui primitives (button, card, badge, …)
│   ├── layout/             # header, footer, nav, ticker, theme toggle
│   ├── article/            # article card, meta, TOC, share, comments, body…
│   ├── home/               # homepage sections (hero, rails, trending…)
│   ├── features/           # cross-cutting widgets (newsletter, poll, ads, search…)
│   ├── seo/                # JSON-LD helper
│   └── providers/          # Query + Theme providers
├── services/               # Server-only data layer (Strapi client + mock fallback)
├── hooks/                  # Client hooks (infinite articles)
├── lib/                    # utils, media, seo, toc
├── config/                 # site config (nav, categories, social)
└── types/                  # Domain + Strapi types
```

### Data layer (`services/`)

- `http.ts` — shared Axios instance; attaches the server-only `STRAPI_API_TOKEN`.
- `query.ts` — serializes Strapi v5 REST query params (filters/populate/sort).
- `normalize.ts` — maps raw Strapi entities → domain models (`types/content.ts`).
- Resource services (`articles.ts`, `taxonomy.ts`, `multimedia.ts`) each try
  Strapi and **gracefully fall back to bundled mock data** when the CMS is
  unreachable (toggle with `NEXT_PUBLIC_USE_MOCK_FALLBACK`). This keeps local
  dev, previews, and CI fully functional without a backend.

Server components import services directly. The browser never talks to Strapi;
client features hit internal route handlers under `/api/*`, which proxy to the
CMS and keep tokens server-side.

### Caching layers

| Layer            | Mechanism                                              |
| ---------------- | ------------------------------------------------------ |
| CDN              | Cloudflare + Vercel edge cache                          |
| Page             | ISR (`revalidate`) + on-demand webhook revalidation     |
| API route lists  | `Cache-Control: s-maxage + stale-while-revalidate`      |
| Client queries   | TanStack Query `staleTime`/`gcTime`                     |
| Images           | Next/Image (AVIF/WebP, responsive `sizes`)              |

## Backend (`backend/`)

Standard Strapi v5 project. Each collection lives under
`src/api/<name>/` with `content-types/<name>/schema.json` plus factory
`routes` / `controllers` / `services`. Reusable field groups are **components**
under `src/components/` (`shared.seo`, `shared.social-links`, `poll.option`,
`live.entry`, `nav.menu-item`).

### Content model

Collections: Article, Category, Subcategory, Author, Tag, Page, Menu,
Advertisement, Poll, Live Blog, Gallery, Video, Podcast, Newsletter Subscriber,
Comment. Single types: Site Settings, SEO Settings. See
[`CONTENT_MODEL.md`](CONTENT_MODEL.md).

### Custom logic

- **Article lifecycle** (`article/content-types/article/lifecycles.ts`)
  auto-computes reading time and fires the ISR revalidation webhook on
  create/update.
- **View counter** — a public `PUT /articles/:id/view` endpoint increments
  reads without granting write access to the collection.
- **Bootstrap** (`src/index.ts`) seeds default public read permissions.

## Security

- JWT sessions via `users-permissions`; RBAC roles map to editorial workflow
  (see [`RBAC.md`](RBAC.md)).
- Frontend `middleware.ts` sets CSP + security headers and rate-limits write
  endpoints at the edge.
- Mutations validate input and treat editor-authored HTML as trusted at the
  ingest boundary (sanitize before storage in production).
- Secrets are environment-only; Cloudinary/DB/JWT credentials never reach the
  client bundle.
