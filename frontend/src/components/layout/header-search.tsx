'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function HeaderSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  return (
    <div className="flex items-center">
      <form
        onSubmit={submit}
        className={cn(
          'overflow-hidden transition-all duration-300',
          open ? 'w-40 sm:w-56' : 'w-0',
        )}
      >
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search news…"
          aria-label="Search"
          className="h-9"
          autoFocus={open}
        />
      </form>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle search"
        onClick={() => setOpen((v) => !v)}
      >
        <Search />
      </Button>
    </div>
  );
}
