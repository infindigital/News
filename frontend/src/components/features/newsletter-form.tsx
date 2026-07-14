'use client';

import { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type State = 'idle' | 'loading' | 'success' | 'error';

/**
 * Newsletter signup. Posts to the internal /api/newsletter route handler,
 * which proxies to Strapi (keeps tokens server-side).
 */
export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Subscription failed');
      setState('success');
      setMessage('You’re subscribed — welcome aboard!');
      setEmail('');
    } catch {
      setState('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  if (state === 'success') {
    return (
      <p className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
        <Check className="h-4 w-4" /> {message}
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn('flex gap-2', compact ? 'flex-col sm:flex-row' : 'flex-col')}
      noValidate
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <Input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        disabled={state === 'loading'}
      />
      <Button type="submit" disabled={state === 'loading'}>
        {state === 'loading' ? (
          <Loader2 className="animate-spin" />
        ) : (
          'Subscribe'
        )}
      </Button>
      {state === 'error' && (
        <p role="alert" className="text-sm text-destructive">
          {message}
        </p>
      )}
    </form>
  );
}
