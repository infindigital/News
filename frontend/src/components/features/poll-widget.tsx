'use client';

import { useState } from 'react';
import type { Poll } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** Interactive opinion poll. Optimistically records a vote via /api/poll. */
export function PollWidget({ poll }: { poll: Poll }) {
  const [voted, setVoted] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [options, setOptions] = useState(poll.options);
  const total = options.reduce((sum, o) => sum + o.votes, 0);

  async function vote(optionId: number) {
    if (voted) return;
    setSelected(optionId);
    setVoted(true);
    setOptions((prev) =>
      prev.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o)),
    );
    // Fire-and-forget; UI already reflects the vote optimistically.
    fetch('/api/poll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pollId: poll.id, optionId }),
    }).catch(() => undefined);
  }

  return (
    <section
      aria-label="Reader poll"
      className="rounded-lg border bg-card p-5"
    >
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">
        Reader Poll
      </p>
      <h3 className="mb-4 font-serif text-lg font-bold">{poll.question}</h3>
      <div className="space-y-2">
        {options.map((option) => {
          const pct = total ? Math.round((option.votes / total) * 100) : 0;
          return (
            <button
              key={option.id}
              onClick={() => vote(option.id)}
              disabled={voted}
              className={cn(
                'relative w-full overflow-hidden rounded-md border px-3 py-2 text-left text-sm transition-colors',
                voted ? 'cursor-default' : 'hover:border-primary',
                selected === option.id && 'border-primary font-semibold',
              )}
            >
              {voted && (
                <span
                  className="absolute inset-y-0 left-0 bg-primary/10"
                  style={{ width: `${pct}%` }}
                  aria-hidden
                />
              )}
              <span className="relative flex justify-between">
                <span>{option.label}</span>
                {voted && <span className="tabular-nums">{pct}%</span>}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {total.toLocaleString()} votes
        {!voted && ' · Tap an option to vote'}
      </p>
      {!voted && (
        <Button variant="link" size="sm" className="mt-1 h-auto p-0" disabled>
          Results shown after voting
        </Button>
      )}
    </section>
  );
}
