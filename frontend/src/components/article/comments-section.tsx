'use client';

import { useState } from 'react';
import { Loader2, MessageCircle } from 'lucide-react';
import type { Comment } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDateTime } from '@/lib/utils';

/**
 * Comments block. New comments POST to /api/comments and enter a moderation
 * queue in Strapi; we show a pending acknowledgement rather than an instant
 * publish (matches the moderation workflow).
 */
export function CommentsSection({
  articleId,
  initialComments = [],
}: {
  articleId: number;
  initialComments?: Comment[];
}) {
  const [comments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          authorName: name,
          authorEmail: email,
          content,
        }),
      });
      setStatus('sent');
      setContent('');
    } catch {
      setStatus('idle');
    }
  }

  return (
    <section aria-label="Comments" id="comments" className="scroll-mt-28">
      <h2 className="mb-6 flex items-center gap-2 font-serif text-2xl font-bold">
        <MessageCircle className="h-6 w-6 text-primary" />
        Comments ({comments.length})
      </h2>

      {status === 'sent' ? (
        <div className="rounded-lg border bg-muted/40 p-4 text-sm">
          Thanks! Your comment has been submitted and will appear once approved
          by our moderators.
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3 rounded-lg border p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              aria-label="Your name"
            />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (not published)"
              aria-label="Email"
            />
          </div>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Join the discussion…"
            rows={4}
            aria-label="Comment"
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? (
                <Loader2 className="animate-spin" />
              ) : (
                'Post comment'
              )}
            </Button>
          </div>
        </form>
      )}

      <ul className="mt-8 space-y-6">
        {comments.map((comment) => (
          <li key={comment.id} className="border-b pb-6 last:border-0">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {comment.authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold">{comment.authorName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(comment.createdAt)}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed">{comment.content}</p>
          </li>
        ))}
        {comments.length === 0 && (
          <li className="py-8 text-center text-sm text-muted-foreground">
            Be the first to comment.
          </li>
        )}
      </ul>
    </section>
  );
}
