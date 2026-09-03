import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Code2,
  ExternalLink,
  FlaskConical,
  Lightbulb,
} from 'lucide-react';

import { CodeWalkthrough } from '@/components/code-walkthrough';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
  chapterTwoSections,
  type ChapterSection,
} from '@/lib/chapter-two-data';
import { repositoryBase } from '@/lib/course-data';
import { sitePath } from '@/lib/site-path';
import { cn } from '@/lib/utils';

export function ChapterSectionPage({ section }: { section: ChapterSection }) {
  const sectionIndex = chapterTwoSections.findIndex(
    (item) => item.slug === section.slug,
  );
  const previous =
    sectionIndex > 0 ? chapterTwoSections[sectionIndex - 1] : undefined;
  const next =
    sectionIndex < chapterTwoSections.length - 1
      ? chapterTwoSections[sectionIndex + 1]
      : undefined;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto max-w-7xl px-4 pb-20 pt-7 sm:px-6 sm:pt-10 lg:px-8"
      >
        <nav
          className="mb-7 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <a className="hover:text-foreground" href={sitePath('/')}>
            Course home
          </a>
          <span aria-hidden="true">/</span>
          <a className="hover:text-foreground" href={sitePath('/chapter-2')}>
            Chapter 2
          </a>
          <span aria-hidden="true">/</span>
          <span className="text-foreground" aria-current="page">
            {section.number}
          </span>
        </nav>

        <section className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-end">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge>KAIST MAS110</Badge>
              <Badge variant={section.optional ? 'secondary' : 'outline'}>
                {section.optional ? 'Optional deep dive' : 'Guided section'}
              </Badge>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
              Chapter {section.number}
            </p>
            <h1 className="mt-2 max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.035em] text-balance sm:text-5xl">
              {section.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              {section.summary}
            </p>
          </div>

          <aside
            className="rounded-2xl border bg-card/88 p-5 shadow-sm"
            aria-label="How to use this section"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                <Lightbulb className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-primary">
                  Teaching rhythm
                </p>
                <h2 className="font-semibold">Predict before Run</h2>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Select the current step, predict its effect, run it, and explain
              the highlighted change before moving on.
            </p>
          </aside>
        </section>

        <section className="py-12 sm:py-16" aria-labelledby="primer-heading">
          <div className="mb-6">
            <p className="text-sm font-medium text-primary">Concept primer</p>
            <h2
              id="primer-heading"
              className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Know these ideas before running the code
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {section.primer.map((item) => (
              <article
                key={item.term}
                className="rounded-2xl border bg-card/84 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">{item.term}</h3>
                  <code className="shrink-0 rounded bg-muted px-2 py-1 text-[11px] text-primary">
                    {item.relation}
                  </code>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.definition}
                </p>
                <p className="mt-4 border-l-2 border-accent pl-3 text-xs leading-5 text-muted-foreground">
                  <strong className="text-foreground">Watch for:</strong>{' '}
                  {item.watchFor}
                </p>
              </article>
            ))}
          </div>
        </section>

        <CodeWalkthrough walkthrough={section.walkthrough} />

        <section className="mt-10 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-2xl border bg-card/88 p-6">
            <div className="flex items-center gap-3">
              <FlaskConical
                className="size-5 text-primary"
                aria-hidden="true"
              />
              <h2 className="font-semibold">What is actually running?</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              This webpage uses a deterministic browser-side model to reveal the
              before-and-after state for each teaching step. The original Python
              and its full-scale numerical output run in Colab; no special
              browser tool is required.
            </p>
            <a
              className={cn(buttonVariants({ variant: 'outline' }), 'mt-5')}
              href={section.colabUrl}
              target="_blank"
              rel="noreferrer"
            >
              Run the original notebook in Colab
              <ExternalLink data-icon="inline-end" aria-hidden="true" />
            </a>
          </article>

          <article className="rounded-2xl border bg-card/88 p-6">
            <div className="flex items-center gap-3">
              <BookOpenText
                className="size-5 text-primary"
                aria-hidden="true"
              />
              <h2 className="font-semibold">Source acknowledgment</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              This independent KAIST MAS110 teaching companion follows{' '}
              <em>{section.filename}</em> from{' '}
              <em>Foundations of Linear Algebra for Data Science</em> by Wanmo
              Kang and Kyunghyun Cho.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                className={buttonVariants({ variant: 'outline' })}
                href={section.githubUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Code2 data-icon="inline-start" aria-hidden="true" />
                View exact source
                <ExternalLink data-icon="inline-end" aria-hidden="true" />
              </a>
              <a
                className={buttonVariants({ variant: 'ghost' })}
                href={`${repositoryBase}/blob/main/LICENSE`}
                target="_blank"
                rel="noreferrer"
              >
                MIT License
              </a>
            </div>
          </article>
        </section>

        <nav
          className="mt-12 grid gap-3 border-t pt-7 sm:grid-cols-2"
          aria-label="Chapter 2 section navigation"
        >
          {previous ? (
            <a
              className="group rounded-2xl border bg-card/70 p-5 transition-colors hover:bg-card"
              href={sitePath(`/chapter-2/${previous.slug}`)}
            >
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                Previous section
              </span>
              <span className="mt-2 block font-semibold group-hover:text-primary">
                {previous.number} · {previous.shortTitle}
              </span>
            </a>
          ) : (
            <div />
          )}
          {next ? (
            <a
              className="group rounded-2xl border bg-card/70 p-5 text-right transition-colors hover:bg-card"
              href={sitePath(`/chapter-2/${next.slug}`)}
            >
              <span className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                Next section
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
              <span className="mt-2 block font-semibold group-hover:text-primary">
                {next.number} · {next.shortTitle}
              </span>
            </a>
          ) : (
            <a
              className="group rounded-2xl border bg-card/70 p-5 text-right transition-colors hover:bg-card"
              href={sitePath('/chapter-2')}
            >
              <span className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                Chapter complete
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
              <span className="mt-2 block font-semibold group-hover:text-primary">
                Return to the Chapter 2 menu
              </span>
            </a>
          )}
        </nav>
      </main>
    </div>
  );
}
