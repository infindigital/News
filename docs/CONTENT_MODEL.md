# Content Model

All types live in `backend/src/api/*`; reusable field groups in
`backend/src/components/*`.

## Components

| Component            | Fields                                                                          |
| -------------------- | ------------------------------------------------------------------------------- |
| `shared.seo`         | metaTitle, metaDescription, canonicalUrl, keywords, ogImage, twitterCard, structuredData, noIndex |
| `shared.social-links`| twitter, facebook, instagram, youtube, linkedin                                 |
| `poll.option`        | label, votes                                                                    |
| `live.entry`         | timestamp, title, content, important                                            |
| `nav.menu-item`      | label, url, order, target                                                       |

## Collection types

### Article (`draftAndPublish`)
title, slug (uid), subtitle, summary, content (richtext), featuredImage,
imageCaption, gallery (media[]), videoUrl, **category** (m:1), **subcategory**
(m:1), **tags** (m:n), **author** (m:1), scheduledAt, readingTimeMinutes,
featured, breaking, editorsPick, trending, viewCount, shareCount, status (enum),
**seo** (component), **relatedArticles** (m:n self), **comments** (1:m).

### Taxonomy
- **Category** — name, slug, description, color, featured; ⇄ subcategories, articles.
- **Subcategory** — name, slug, description; ⇄ category, articles.
- **Tag** — name, slug; ⇄ articles (m:n).
- **Author** — name, slug, bio, role, email, avatar, twitter, linkedin; ⇄ articles.

### Editorial & site
- **Page** (`draftAndPublish`) — title, slug, content, seo. Static CMS pages.
- **Menu** — name, slug, items (`nav.menu-item`[]). Menu builder.
- **Advertisement** — name, placement (enum), image, targetUrl, html, active, start/end dates.
- **Poll** — question, options (`poll.option`[]), active.
- **Live Blog** (`draftAndPublish`) — title, slug, summary, active, entries (`live.entry`[]).
- **Gallery** (`draftAndPublish`) — title, slug, description, images[], category, seo.
- **Video** (`draftAndPublish`) — title, slug, description, youtubeId, url, thumbnail, durationSeconds, category, seo.
- **Podcast** (`draftAndPublish`) — title, slug, description, audioUrl, cover, durationSeconds, episode, season.
- **Newsletter Subscriber** — email (unique), subscribedAt, confirmed, source.
- **Comment** — authorName, authorEmail, content, approved, parentId, article (m:1).

## Single types

- **Site Settings** — siteName, tagline, logo, favicon, social (`shared.social-links`), contactEmail, footerText.
- **SEO Settings** — defaultMetaTitle, defaultMetaDescription, defaultOgImage, robotsTxt, googleSiteVerification, organizationSchema (json).

## Relation map

```
Category 1───* Subcategory
Category 1───* Article *───1 Author
Article  *───* Tag
Article  *───* Article (relatedArticles)
Article  1───* Comment
```

The frontend consumes these via `services/*` and normalizes them to the domain
models in `frontend/src/types/content.ts`.
