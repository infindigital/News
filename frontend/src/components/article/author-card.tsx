import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Linkedin } from 'lucide-react';
import type { Author } from '@/types';
import { mediaUrl } from '@/lib/media';

export function AuthorCard({ author }: { author: Author }) {
  return (
    <div className="flex gap-4 rounded-lg border bg-muted/30 p-5">
      <Link href={`/author/${author.slug}`} className="shrink-0">
        <div className="relative h-16 w-16 overflow-hidden rounded-full">
          {author.avatar ? (
            <Image
              src={mediaUrl(author.avatar, 'thumbnail')}
              alt={author.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-lg font-bold text-primary">
              {author.name.charAt(0)}
            </div>
          )}
        </div>
      </Link>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {author.role ?? 'Contributor'}
        </p>
        <Link
          href={`/author/${author.slug}`}
          className="font-serif text-lg font-bold hover:text-primary"
        >
          {author.name}
        </Link>
        {author.bio && (
          <p className="mt-1 text-sm text-muted-foreground">{author.bio}</p>
        )}
        <div className="mt-2 flex gap-2">
          {author.twitter && (
            <a
              href={author.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${author.name} on Twitter`}
              className="text-muted-foreground hover:text-primary"
            >
              <Twitter className="h-4 w-4" />
            </a>
          )}
          {author.linkedin && (
            <a
              href={author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${author.name} on LinkedIn`}
              className="text-muted-foreground hover:text-primary"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
