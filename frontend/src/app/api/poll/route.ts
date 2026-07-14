import { NextResponse } from 'next/server';

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ?? 'http://localhost:1337/api';

/** Record a poll vote. Idempotency/dedup is enforced server-side in Strapi. */
export async function POST(request: Request) {
  let body: { pollId?: number; optionId?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { pollId, optionId } = body;
  if (typeof pollId !== 'number' || typeof optionId !== 'number') {
    return NextResponse.json({ error: 'pollId and optionId are required' }, {
      status: 400,
    });
  }

  try {
    await fetch(`${STRAPI_API_URL}/polls/${pollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionId }),
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true, offline: true });
  }
}
