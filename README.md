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

## Deploy to a live URL

The frontend runs on bundled mock data by default, so it deploys to a working
public site **without a database or CMS**. On [Vercel](https://vercel.com/new):
**import this repo → set Root Directory to `frontend` → Deploy.** Add
`NEXT_PUBLIC_USE_MOCK_FALLBACK=true` and you have a live site; point it at a
hosted Strapi later by flipping that to `false` and adding the CMS URLs. Full
walkthrough (Vercel native integration, GitHub Actions, and hosting Strapi +
Postgres) is in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/infindigital/news&root-directory=frontend&env=NEXT_PUBLIC_USE_MOCK_FALLBACK&project-name=meridian-news&repository-name=meridian-news)

## Run CMS + frontend together (one command)

For a full live setup — edit in the CMS, see it on the site — from the repo root:

```bash
npm install          # installs the root runner (concurrently)
npm run setup        # installs backend + frontend deps, writes frontend/.env.local
npm run start:fresh  # builds the Strapi admin, then runs BOTH servers together
```

- CMS admin → http://localhost:1337/admin (create your admin user, add articles, Publish)
- Frontend → http://localhost:3000 (auto-reads live CMS content; refresh to see edits)

Public read permissions are granted automatically on first boot, so published
content shows up on the site with no manual role setup. On later runs (no code
changes), `npm run dev` starts both without the rebuild step.

> **GitHub Codespaces:** run the same commands, then in the **Ports** tab set
> ports **1337** and **3000** to **Public** and open them. Use `start:fresh`
> (production mode) — Strapi's `develop` hot-reload uses a websocket that the
> Codespaces proxy blocks, causing an endless refresh loop on the admin page.

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
