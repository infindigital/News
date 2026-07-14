# Meridian News — Enterprise News Portal

A production-grade, headless news platform built to the quality bar of outlets
like the BBC, Reuters, The Hindu, and Al Jazeera. It pairs a **Next.js 15**
frontend with a **Strapi v5** headless CMS on **PostgreSQL**, with media on
**Cloudinary** and delivery via **Vercel + Cloudflare**.

```
┌──────────────┐     REST / GraphQL      ┌──────────────┐      ┌────────────┐
│  Next.js 15  │ ─────────────────────▶  │  Strapi v5   │ ───▶ │ PostgreSQL │
│  App Router  │ ◀── on-demand ISR ─────  │  Headless    │      └────────────┘
│  (Vercel)    │      webhook             │  CMS (Docker)│ ───▶ Cloudinary (media)
└──────────────┘                         └──────────────┘
        ▲
     Cloudflare CDN
```

## Monorepo layout

```
News/
├── frontend/          # Next.js 15 App Router client (TypeScript, Tailwind, shadcn/ui)
├── backend/           # Strapi v5 headless CMS (content types, config, Docker)
├── docs/              # Architecture, deployment, content-model docs
├── docker-compose.yml # Postgres + CMS + frontend for local/prod parity
└── README.md
```

## Tech stack

| Layer            | Technology                                                        |
| ---------------- | ----------------------------------------------------------------- |
| Frontend         | Next.js 15 (App Router, RSC), React 19, TypeScript                |
| Styling / UI     | Tailwind CSS, shadcn/ui (Radix), Framer Motion, lucide-react      |
| Data / state     | TanStack Query, Axios, native fetch (server), ISR + route caching |
| CMS              | Strapi v5 (REST + GraphQL), draft/publish, RBAC                   |
| Database         | PostgreSQL 16                                                     |
| Media            | Cloudinary (upload provider) with Next/Image optimization         |
| Auth             | JWT + Role-Based Access Control                                   |
| Deployment       | Vercel (frontend), Docker (CMS), Cloudflare CDN                   |

## Quick start (local, no backend required)

The frontend ships with a **mock data fallback**, so you can run the full UI
without a running CMS:

```bash
cd frontend
cp .env.example .env.local        # defaults enable mock fallback
npm install
npm run dev                        # http://localhost:3000
```

Set `NEXT_PUBLIC_USE_MOCK_FALLBACK=false` once Strapi is running to use live data.

## Full stack with Docker

```bash
cp backend/.env.example backend/.env      # fill in secrets (see below)
docker compose up --build
# Frontend  → http://localhost:3000
# CMS admin → http://localhost:1337/admin
# Postgres  → localhost:5432
```

Generate Strapi secrets:

```bash
for k in APP_KEYS API_TOKEN_SALT ADMIN_JWT_SECRET TRANSFER_TOKEN_SALT JWT_SECRET; do
  echo "$k=$(openssl rand -base64 32)";
done
```

## Running the CMS standalone

```bash
cd backend
cp .env.example .env
npm install
npm run develop            # http://localhost:1337/admin — create the first admin
```

## Feature highlights

**Public site** — responsive homepage with breaking-news ticker, hero, editor's
picks, per-category rails, trending/most-read sidebars, reader polls, video
strip, and newsletter CTAs. Category, subcategory, tag, author, search, opinion,
editorial, fact-check, explainers, live updates, video, gallery, podcast,
elections, archive, and static/legal pages.

**Article experience** — rich typography, pull quotes, image captions, lazy
YouTube embeds, sticky table of contents with scrollspy, sticky + inline social
sharing, reading-progress bar, author bio, related stories, previous/next
navigation, and moderated comments.

**SEO** — dynamic metadata, Open Graph, Twitter cards, JSON-LD (NewsArticle,
Breadcrumb, Organization, WebSite, Person), XML sitemap, Google News sitemap,
robots.txt, canonical URLs, SSR + ISR.

**Performance** — RSC-first rendering, ISR with on-demand webhook revalidation,
image optimization (AVIF/WebP), lazy loading, code splitting, infinite scroll,
and CDN-friendly cache headers.

**Security** — JWT auth + RBAC (Super Admin, Admin, Editor, Journalist,
Reviewer), CSP + security headers via middleware, edge rate limiting on write
endpoints, server-side token handling, and input validation on all mutations.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full design and
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for production setup.

## Scripts

| Location   | Command             | Purpose                          |
| ---------- | ------------------- | -------------------------------- |
| `frontend` | `npm run dev`       | Dev server                       |
| `frontend` | `npm run build`     | Production build                 |
| `frontend` | `npm run lint`      | ESLint                           |
| `frontend` | `npm run typecheck` | TypeScript check                 |
| `backend`  | `npm run develop`   | Strapi in watch mode             |
| `backend`  | `npm run build`     | Build the Strapi admin           |
| `backend`  | `npm run start`     | Start Strapi (production)        |

## License

MIT — see individual package manifests.
