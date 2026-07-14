import { cn } from '@/lib/utils';

/** Standard hero band for section/listing pages. */
export function PageHeader({
  title,
  description,
  eyebrow,
  className,
  children,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn('border-b py-8', className)}>
      <div className="container">
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="font-serif text-3xl font-black sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}
