import { sitePath } from '@/lib/site-path';

export function SiteHeader() {
  return (
    <header className="course-masthead">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="mx-auto flex max-w-[96rem] items-center justify-between gap-5 px-4 py-3.5 sm:px-6 lg:px-8">
        <a className="group min-w-0" href={sitePath('/')}>
          <span className="block font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            KAIST · Fall 2026
          </span>
          <span className="block text-base font-semibold tracking-tight text-foreground sm:text-lg">
            <span className="sm:hidden">MAS110 Practice</span>
            <span className="hidden sm:inline">MAS110 Practice Sessions</span>
          </span>
        </a>
        <nav
          className="flex items-center gap-4 text-sm sm:gap-7 sm:text-base"
          aria-label="Main navigation"
        >
          <a className="course-nav-link" href={sitePath('/#chapters')}>
            Chapters
          </a>
          <a
            className="course-nav-link hidden sm:inline"
            href={sitePath('/#how-it-works')}
          >
            How it works
          </a>
          <a
            className="course-nav-link whitespace-nowrap"
            href="https://github.com/kyunghyuncho/Foundations_of_LADS"
            target="_blank"
            rel="noreferrer"
          >
            Source ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
