import { NextResponse } from 'next/server';

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ?? 'http://localhost:1337/api';

/**
 * Submit a comment. Comments enter Strapi unapproved and are surfaced only
 * after moderation (see the CMS comment-moderation workflow).
 */
export async function POST(request: Request) {
  let body: {
    articleId?: number;
    authorName?: string;
    authorEmail?: string;
    content?: string;
    parentId?: number | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { articleId, authorName, content } = body;
  if (!articleId || !authorName?.trim() || !content?.trim()) {
    return NextResponse.json(
      { error: 'Name, comment and article are required.' },
      { status: 400 },
    );
  }
  if (content.length > 5000) {
    return NextResponse.json({ error: 'Comment is too long.' }, { status: 400 });
  }

  try {
    const res = await fetch(`${STRAPI_API_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          article: articleId,
          authorName: authorName.trim(),
          authorEmail: body.authorEmail?.trim(),
          content: content.trim(),
          parentId: body.parentId ?? null,
          approved: false,
        },
      }),
    });
    if (!res.ok) throw new Error(`Strapi responded ${res.status}`);
    return NextResponse.json({ success: true, moderated: true });
  } catch {
    return NextResponse.json({ success: true, moderated: true, offline: true });
  }
}
