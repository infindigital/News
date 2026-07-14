'use client';

import { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type State = 'idle' | 'loading' | 'success' | 'error';

/**
 * Contact form. Posts to the internal /api/contact route handler (not created
 * here), which proxies to the newsroom inbox. Mirrors the optimistic
 * success/error handling of NewsletterForm.
 */
export function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Message failed');
      setState('success');
      setMessage('Thanks — your message is on its way to the newsroom.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setState('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  if (state === 'success') {
    return (
      <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-5 text-sm font-medium text-green-600 dark:text-green-400">
        <Check className="h-5 w-5 shrink-0" /> {message}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-1 block text-sm font-medium"
          >
            Name
          </label>
          <Input
            id="contact-name"
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Your name"
            disabled={state === 'loading'}
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="mb-1 block text-sm font-medium"
          >
            Email
          </label>
          <Input
            id="contact-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="your@email.com"
            disabled={state === 'loading'}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="mb-1 block text-sm font-medium"
        >
          Subject
        </label>
        <Input
          id="contact-subject"
          required
          value={form.subject}
          onChange={(e) => update('subject', e.target.value)}
          placeholder="How can we help?"
          disabled={state === 'loading'}
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-1 block text-sm font-medium"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={6}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          placeholder="Write your message…"
          disabled={state === 'loading'}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <Button type="submit" disabled={state === 'loading'}>
        {state === 'loading' ? (
          <Loader2 className="animate-spin" />
        ) : (
          'Send message'
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
