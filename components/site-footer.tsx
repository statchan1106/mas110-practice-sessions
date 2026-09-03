import { repositoryBase } from '@/lib/course-data';

export function SiteFooter() {
  return (
    <footer className="border-t border-foreground/15 bg-background">
      <div className="mx-auto grid max-w-[108rem] gap-4 px-4 py-8 text-sm leading-6 text-muted-foreground sm:grid-cols-[1fr_auto] sm:px-6 lg:px-8">
        <p className="footer-contact sm:col-span-2">
          Questions about these practice materials or code?{' '}
          <a className="text-link" href="mailto:statchan1106@kaist.ac.kr">
            statchan1106@kaist.ac.kr
          </a>
        </p>
        <p>
          <strong className="font-medium text-foreground">
            Made by Seongchan Lee
          </strong>{' '}
          for KAIST MAS110 Practice Sessions ·{' '}
          <a
            className="text-link"
            href="https://github.com/statchan1106/mas110-practice-sessions"
            target="_blank"
            rel="noreferrer"
          >
            Site source ↗
          </a>
        </p>
        <p className="sm:text-right">
          Based on{' '}
          <a
            className="text-link"
            href={repositoryBase}
            target="_blank"
            rel="noreferrer"
          >
            Foundations of LADS ↗
          </a>{' '}
          by Wanmo Kang and Kyunghyun Cho.
        </p>
      </div>
    </footer>
  );
}
