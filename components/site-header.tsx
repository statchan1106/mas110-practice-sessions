import { Code2, Grid3X3 } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { sitePath } from '@/lib/site-path';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/88 backdrop-blur-xl">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          className="flex items-center gap-3"
          href={sitePath('/')}
          aria-label="KAIST MAS110 course home"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Grid3X3 className="size-4" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-tight">
              Foundations of LADS
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              KAIST MAS110 · Interactive TA companion
            </span>
          </span>
        </a>

        <nav className="flex items-center gap-1" aria-label="Main navigation">
          <a
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'hidden sm:inline-flex',
            )}
            href={sitePath('/')}
          >
            Home
          </a>
          <a
            className={buttonVariants({ variant: 'ghost' })}
            href={sitePath('/chapter-2')}
          >
            <span className="sm:hidden">Ch. 2</span>
            <span className="hidden sm:inline">Chapter 2</span>
          </a>
          <a
            className={buttonVariants({ variant: 'outline', size: 'icon' })}
            href="https://github.com/kyunghyuncho/Foundations_of_LADS"
            target="_blank"
            rel="noreferrer"
            aria-label="Open the original GitHub repository"
          >
            <Code2 aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
}
