import { sitePath } from '@/lib/site-path';

export function SiteHeader() {
  return (
    <header className="course-masthead">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-3 sm:px-6 lg:px-8">
        <a className="group min-w-0" href={sitePath('/')}>
          <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            KAIST · Fall 2026
          </span>
          <span className="block truncate text-sm font-semibold tracking-tight text-foreground sm:text-base">
            MAS110 Practice Sessions
          </span>
        </a>
        <nav
          className="flex items-center gap-4 text-xs sm:gap-6 sm:text-sm"
          aria-label="Main navigation"
        >
          <a
            className="course-nav-link hidden sm:inline"
            href={sitePath('/#schedule')}
          >
            Schedule
          </a>
          <a className="course-nav-link" href={sitePath('/chapter-2')}>
            Chapter 2
          </a>
          <a
            className="course-nav-link whitespace-nowrap"
            href="https://github.com/kyunghyuncho/Foundations_of_LADS"
            target="_blank"
            rel="noreferrer"
          >
            Source notebooks ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
