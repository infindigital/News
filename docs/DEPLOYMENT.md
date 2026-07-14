# Deployment

## Deploy from GitHub → live URL (fastest path)

Because the frontend has a **mock-data fallback**, you can get a live site on
Vercel in minutes **without hosting Strapi or a database first**. Wire up the
CMS afterwards and flip one env var.

### A. Frontend on Vercel (native GitHub integration — recommended)

1. Go to **vercel.com → Add New → Project** and import the GitHub repo
   `infindigital/news`.
2. **Root Directory** → set to **`frontend`** (this is a monorepo; Vercel must
   build the subfolder). Framework preset auto-detects **Next.js**.
3. Add environment variables (Project → Settings → Environment Variables):

   | Variable                        | Value (start here)                    |
   | ------------------------------- | ------------------------------------- |
   | `NEXT_PUBLIC_SITE_URL`          | `https://<your-project>.vercel.app`   |
   | `NEXT_PUBLIC_SITE_NAME`         | `Meridian News`                       |
   | `NEXT_PUBLIC_USE_MOCK_FALLBACK` | `true` (live site with demo content)  |

4. **Deploy.** Every push to the branch now auto-deploys; PRs get preview URLs.

> To go live on the `main` branch, either merge this branch into `main` or set
> your production branch to `claude/news-portal-enterprise-on5004` in
> Vercel → Settings → Git.

### B. Point the frontend at a hosted CMS (when ready)

Deploy Strapi + Postgres (section 2–3 below or Railway/Render one-click), then
in Vercel set:

```
NEXT_PUBLIC_STRAPI_URL=https://<cms-host>
NEXT_PUBLIC_STRAPI_API_URL=https://<cms-host>/api
NEXT_PUBLIC_STRAPI_GRAPHQL_URL=https://<cms-host>/graphql
STRAPI_API_TOKEN=<read-only token from Strapi admin>
REVALIDATE_SECRET=<same value as the CMS webhook header>
NEXT_PUBLIC_USE_MOCK_FALLBACK=false
```

Redeploy. The site now serves live CMS content with on-demand ISR.

### C. Alternative — deploy via GitHub Actions

`.github/workflows/deploy-vercel.yml` deploys on push to `main` (and PR
previews) once you add repo secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`,
`VERCEL_PROJECT_ID` (get the IDs by running `vercel link` in `frontend/`). It
skips itself until `VERCEL_TOKEN` is set, so it never fails a build. Use this
**or** the native integration in A — not both.

`.github/workflows/ci.yml` runs typecheck + lint + build on every push/PR and
needs no secrets.

---

## Topology

- **Frontend** → Vercel (or any Node host) behind **Cloudflare** CDN.
- **CMS** → Docker container (Fly.io, Railway, Render, ECS, a VPS…).
- **Database** → managed **PostgreSQL** (Neon, Supabase, RDS, Cloud SQL).
- **Media** → **Cloudinary**.

## 1. PostgreSQL

Provision a Postgres 16 database and note the connection details. Set them in
`backend/.env` (or `DATABASE_URL`). Enable SSL in production
(`DATABASE_SSL=true`).

## 2. Strapi CMS (Docker)

```bash
cd backend
cp .env.example .env         # fill DB creds, secrets, Cloudinary, CORS_ORIGINS
docker build -t meridian-cms .
docker run -p 1337:1337 --env-file .env meridian-cms
```

On first boot, open `/admin`, create the Super Admin, then:

1. **Settings → Roles** — configure the RBAC roles (see `RBAC.md`).
2. **Settings → API Tokens** — create a read-only token; put it in the
   frontend's `STRAPI_API_TOKEN`.
3. **Settings → Webhooks** — add a webhook to
   `https://<frontend>/api/revalidate` triggered on entry publish/update, with
   header `x-revalidate-secret: <REVALIDATE_SECRET>`.
4. **Settings → Media Library** — confirm the Cloudinary provider is active.

Set `CORS_ORIGINS` to your production frontend origin(s).

## 3. Frontend (Vercel)

Import `frontend/` as the project root. Environment variables:

| Variable                          | Example                                 |
| --------------------------------- | --------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`            | `https://meridian.news`                 |
| `NEXT_PUBLIC_SITE_NAME`           | `Meridian News`                         |
| `NEXT_PUBLIC_STRAPI_URL`          | `https://cms.meridian.news`             |
| `NEXT_PUBLIC_STRAPI_API_URL`      | `https://cms.meridian.news/api`         |
| `NEXT_PUBLIC_STRAPI_GRAPHQL_URL`  | `https://cms.meridian.news/graphql`     |
| `STRAPI_API_TOKEN`                | *(read-only token)*                     |
| `REVALIDATE_SECRET`               | *(matches the CMS webhook header)*      |
| `NEXT_PUBLIC_USE_MOCK_FALLBACK`   | `false`                                 |

Vercel auto-detects Next.js. ISR and route handlers work out of the box.

## 4. Cloudflare CDN

Point the apex/`www` DNS at Vercel (CNAME) and proxy through Cloudflare. Suggested:

- Cache static assets aggressively; respect `s-maxage` for HTML/sitemaps.
- Enable Brotli, HTTP/3, and "Always Use HTTPS".
- Add a WAF rate-limit rule on `/api/*` as a second layer to the edge middleware.

## 5. Post-deploy checklist

- [ ] Submit `sitemap.xml` and `news-sitemap.xml` in Google Search Console.
- [ ] Verify JSON-LD with the Rich Results Test.
- [ ] Run Lighthouse (target ≥95 across the board).
- [ ] Confirm the publish → revalidate webhook refreshes pages within seconds.
- [ ] Load-test `/api/articles` and confirm CDN cache hit ratio.
- [ ] Rotate all secrets from their `.env.example` placeholders.

## Local full-stack parity

```bash
cp backend/.env.example backend/.env
docker compose up --build
```

Brings up Postgres + CMS + frontend on one network with a shared uploads volume.
