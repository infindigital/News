import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="font-serif text-7xl font-black text-primary">404</p>
      <h1 className="mt-4 font-serif text-2xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you’re looking for may have been moved, removed, or never
        existed. Try one of our sections instead.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Homepage</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/archive">Browse archive</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/search">Search</Link>
        </Button>
      </div>
    </div>
  );
}
