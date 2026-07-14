'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { megaMenu } from '@/config/site';
import { cn } from '@/lib/utils';

/** Desktop mega navigation with hover dropdowns. */
export function MegaNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {megaMenu.map((item) => {
          const active = pathname === item.url;
          return (
            <li key={item.id} className="group relative">
              <Link
                href={item.url}
                className={cn(
                  'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-accent hover:text-primary',
                  active && 'text-primary',
                )}
              >
                {item.label}
                {item.children && (
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                )}
              </Link>

              {item.children && (
                <div className="invisible absolute left-0 top-full z-50 min-w-[200px] translate-y-1 rounded-lg border bg-popover p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <ul>
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={child.url}
                          className="block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-primary"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
