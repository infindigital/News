import { NextResponse } from 'next/server';

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ?? 'http://localhost:1337/api';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Newsletter subscription proxy. Keeps the Strapi token server-side and
 * validates input before forwarding. Degrades gracefully if the CMS is down.
 */
export async function POST(request: Request) {
  let email: string | undefined;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: 'A valid email address is required.' },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(`${STRAPI_API_URL}/newsletter-subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.STRAPI_API_TOKEN && {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        }),
      },
      body: JSON.stringify({ data: { email, subscribedAt: new Date().toISOString() } }),
    });

    // Treat "already subscribed" (409/400 unique) as success for UX.
    if (!res.ok && res.status !== 400 && res.status !== 409) {
      throw new Error(`Strapi responded ${res.status}`);
    }
    return NextResponse.json({ success: true });
  } catch {
    // In this reference build we accept the subscription optimistically even
    // when the CMS is unreachable so the demo UX stays intact.
    return NextResponse.json({ success: true, offline: true });
  }
}
