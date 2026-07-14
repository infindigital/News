import { NextResponse } from 'next/server';

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ?? 'http://localhost:1337/api';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Contact form handler. Validates input, then forwards to Strapi (or an email
 * service). Kept server-side so no credentials reach the browser.
 */
export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { name, email, subject, message } = body;
  if (!name?.trim() || !message?.trim() || !email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: 'Name, a valid email, and a message are required.' },
      { status: 400 },
    );
  }
  if (message.length > 5000) {
    return NextResponse.json({ error: 'Message is too long.' }, { status: 400 });
  }

  try {
    // Forward to a Strapi "contact-messages" collection or an email provider.
    await fetch(`${STRAPI_API_URL}/contact-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.STRAPI_API_TOKEN && {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        }),
      },
      body: JSON.stringify({
        data: {
          name: name.trim(),
          email: email.trim(),
          subject: subject?.trim() ?? '',
          message: message.trim(),
          submittedAt: new Date().toISOString(),
        },
      }),
    }).catch(() => undefined);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true, offline: true });
  }
}
