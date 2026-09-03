import {
  ArrowRight,
  BookOpenText,
  Code2,
  ExternalLink,
  Play,
} from 'lucide-react';

import { CourseLibrary } from '@/components/course-library';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { chapterTwoSections } from '@/lib/chapter-two-data';
import { repositoryBase } from '@/lib/course-data';
import { sitePath } from '@/lib/site-path';
import { cn } from '@/lib/utils';

const learningLoop = [
  {
    number: '01',
    title: 'Prime',
    text: 'Start with the few concepts and symbols that the code assumes.',
  },
  {
    number: '02',
    title: 'Read',
    text: 'Select one line and identify the variables it controls.',
  },
  {
    number: '03',
    title: 'Run',
    text: 'Execute only that line—never skip ahead automatically.',
  },
  {
    number: '04',
    title: 'See',
    text: 'Compare the matrix, graph, or factorization before and after.',
  },
  {
    number: '05',
    title: 'Explain',
    text: 'State why the visible change is mathematically valid.',
  },
];

export const dynamic = 'force-static';

export default function CourseHome() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto max-w-7xl px-4 pb-20 pt-9 sm:px-6 sm:pt-12 lg:px-8"
      >
        <section className="grid gap-8 lg:grid-cols-[1.18fr_0.82fr] lg:items-end">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge>KAIST MAS110</Badge>
              <Badge variant="secondary">Independent TA companion</Badge>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
              Linear Algebra for Data Science
            </p>
            <h1 className="mt-2 max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
              Choose a section.
              <br />
              Run the idea, not just the code.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              A course home for moving from a short concept primer to a
              line-by-line code walkthrough, a visible mathematical change, and
              finally the original Colab notebook.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <a
                className={buttonVariants({ size: 'lg' })}
                href={sitePath('/chapter-2')}
              >
                <Play data-icon="inline-start" aria-hidden="true" />
                Enter Chapter 2
              </a>
              <a
                className={buttonVariants({ variant: 'outline', size: 'lg' })}
                href="#course-library"
              >
                Browse the full course
              </a>
            </div>
          </div>

          <article className="rounded-2xl border bg-card/90 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-primary">
                  Now ready
                </p>
                <h2 className="mt-1 text-xl font-semibold">Chapter 2</h2>
              </div>
              <Badge variant="outline">4 sections</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Matrices, Gaussian elimination, blocks and graphs, LU
              decomposition, and the complete elimination algorithm.
            </p>
            <div className="mt-5 space-y-2 border-t pt-4">
              {chapterTwoSections.map((section) => (
                <a
                  key={section.slug}
                  href={sitePath(`/chapter-2/${section.slug}`)}
                  className="flex min-h-11 items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <span>
                    <span className="mr-3 font-mono text-xs text-primary">
                      {section.number}
                    </span>
                    {section.shortTitle}
                  </span>
                  <ArrowRight
                    className="size-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </article>
        </section>

        <section
          className="py-16 sm:py-20"
          aria-labelledby="learning-loop-heading"
        >
          <div className="mb-7">
            <p className="text-sm font-medium text-primary">
              A repeatable learning loop
            </p>
            <h2
              id="learning-loop-heading"
              className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              What happens inside every guided section
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {learningLoop.map((item) => (
              <article
                key={item.number}
                className="rounded-2xl border bg-card/84 p-5"
              >
                <span className="font-mono text-xs text-primary">
                  {item.number}
                </span>
                <h3 className="mt-7 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-16 rounded-2xl border bg-card/88 p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
          <div className="flex gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
              <BookOpenText className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary">
                Source acknowledgment
              </p>
              <h2 className="mt-1 font-semibold">
                Built beside the original notebooks
              </h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                This independent companion follows{' '}
                <em>Foundations of Linear Algebra for Data Science</em> by Wanmo
                Kang and Kyunghyun Cho, released under the{' '}
                <a
                  className="underline decoration-border underline-offset-4 hover:text-foreground"
                  href={`${repositoryBase}/blob/main/LICENSE`}
                  target="_blank"
                  rel="noreferrer"
                >
                  MIT License
                </a>
                .
              </p>
            </div>
          </div>
          <a
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'mt-4 shrink-0 sm:mt-0',
            )}
            href={repositoryBase}
            target="_blank"
            rel="noreferrer"
          >
            <Code2 data-icon="inline-start" aria-hidden="true" />
            Original repository
            <ExternalLink data-icon="inline-end" aria-hidden="true" />
          </a>
        </section>

        <section
          id="course-library"
          className="scroll-mt-24"
          aria-labelledby="course-library-heading"
        >
          <div className="mb-7">
            <p className="text-sm font-medium text-primary">Course home</p>
            <h2
              id="course-library-heading"
              className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              All notebooks, grouped by teaching purpose
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Chapter 2 now has its own guided section menu. The remaining
              original notebooks stay organized here with concept primers and
              direct Colab access.
            </p>
          </div>
          <CourseLibrary />
        </section>
      </main>

      <footer className="border-t bg-background/75">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>KAIST MAS110 · Foundations of LADS · Independent TA companion</p>
          <p>Original notebooks by Wanmo Kang and Kyunghyun Cho</p>
        </div>
      </footer>
    </div>
  );
}
