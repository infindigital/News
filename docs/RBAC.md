# Roles & Access Control (RBAC)

Editorial roles map to Strapi admin roles plus content-permission scopes. Create
these under **Settings → Administration Panel → Roles** (admin users) and mirror
publish gates in your editorial workflow.

| Role          | Purpose                          | Article permissions                                   | Other                                          |
| ------------- | -------------------------------- | ----------------------------------------------------- | ---------------------------------------------- |
| **Super Admin** | Full control, system config     | Create, read, update, delete, publish                 | Manage users, roles, settings, plugins, backups |
| **Admin**       | Newsroom lead                   | Create, read, update, delete, publish                 | Manage authors, categories, ads, menus, comments |
| **Editor**      | Section editor                  | Create, read, update, **publish** (own section)       | Moderate comments, manage tags                  |
| **Journalist**  | Reporter                        | Create, read, update **own drafts** (no publish)      | Upload media                                    |
| **Reviewer**    | Copy/fact-check                 | Read, update (comments/notes), **no publish**         | Approve/return drafts, moderate comments        |

## Workflow

```
Journalist (draft) ─▶ Reviewer (in_review) ─▶ Editor (publish) ─▶ Live
                         ▲                        │
                         └──── return for edits ──┘
```

The Article `status` field (`draft` → `in_review` → `scheduled` → `published`)
tracks the editorial stage; Strapi's native **draft/publish** controls
visibility. `scheduledAt` supports embargoed/scheduled publishing.

## Public role (frontend)

The public (unauthenticated) role is granted **read-only** access to published
content plus two safe writes:

- `POST /newsletter-subscribers` — newsletter signup
- `POST /comments` — comment submission (enters moderation, `approved: false`)
- `PUT /articles/:id/view` — increment read count

Configure these under **Settings → Users & Permissions → Roles → Public**.
The frontend `bootstrap` (`src/index.ts`) initializes sensible defaults; always
review them before going live.

## API tokens

Issue a **read-only** API token for the frontend's server-side fetches
(`STRAPI_API_TOKEN`). Never expose write tokens to the client — all mutations go
through the Next.js route handlers, which hold credentials server-side.
