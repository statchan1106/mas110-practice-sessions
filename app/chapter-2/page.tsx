import type { Metadata } from 'next';
import { ArrowRight, BookOpenText, ExternalLink } from 'lucide-react';

import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { chapterTwoSections } from '@/lib/chapter-two-data';
import { repositoryBase } from '@/lib/course-data';
import { sitePath } from '@/lib/site-path';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Chapter 2 — Matrices and Gaussian Elimination · KAIST MAS110',
  description:
    'Choose a Chapter 2 section and connect each Python line to a visible matrix or graph change.',
};

export const dynamic = 'force-static';

const chapterIdeas = [
  {
    label: 'Systems',
    relation: 'Ax = b',
    text: 'A matrix is a compact representation of coupled linear equations.',
  },
  {
    label: 'Structure',
    relation: 'A = [Aᵢⱼ]',
    text: 'Blocks expose meaningful subproblems and graph relationships.',
  },
  {
    label: 'Factorization',
    relation: 'A = LU',
    text: 'Elimination can be stored and reused as two triangular matrices.',
  },
  {
    label: 'Algorithm',
    relation: 'for j → for i',
    text: 'Nested loops repeat one cancellation below every pivot.',
  },
];

export default function ChapterTwoHome() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto max-w-7xl px-4 pb-20 pt-9 sm:px-6 sm:pt-12 lg:px-8"
      >
        <nav
          className="mb-7 flex items-center gap-2 text-xs text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <a className="hover:text-foreground" href={sitePath('/')}>
            Course home
          </a>
          <span>/</span>
          <span className="text-foreground">Chapter 2</span>
        </nav>

        <section className="grid gap-8 lg:grid-cols-[1fr_310px] lg:items-end">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge>KAIST MAS110</Badge>
              <Badge variant="secondary">4 guided sections</Badge>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
              Chapter 2
            </p>
            <h1 className="mt-2 max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.035em] text-balance sm:text-5xl">
              Matrices and Gaussian Elimination
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              Choose a section, then execute its teaching snippet one step at a
              time. Each code statement stays paired with the matrix, block
              structure, factorization, or graph change it causes.
            </p>
          </div>
          <div className="rounded-2xl border bg-card/88 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.1em] text-primary">
              Learning loop
            </p>
            <ol className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] text-muted-foreground sm:grid-cols-5 sm:gap-1">
              {['Prime', 'Read', 'Run', 'See', 'Explain'].map((item, index) => (
                <li key={item} className="relative">
                  <span className="mx-auto mb-2 grid size-7 place-items-center rounded-full border bg-background font-mono text-foreground">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="py-12 sm:py-16"
          aria-labelledby="chapter-ideas-heading"
        >
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary">
                Before choosing a section
              </p>
              <h2
                id="chapter-ideas-heading"
                className="mt-1 text-2xl font-semibold"
              >
                The four views of Chapter 2
              </h2>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {chapterIdeas.map((idea, index) => (
              <article
                key={idea.label}
                className="rounded-2xl border bg-card/84 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary">
                    0{index + 1}
                  </span>
                  <code className="rounded bg-muted px-2 py-1 text-xs text-primary">
                    {idea.relation}
                  </code>
                </div>
                <h3 className="mt-7 font-semibold">{idea.label}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {idea.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="sections-heading">
          <div className="mb-6">
            <p className="text-sm font-medium text-primary">Section menu</p>
            <h2
              id="sections-heading"
              className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Choose what to explore
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {chapterTwoSections.map((section) => (
              <article
                key={section.slug}
                className="group flex min-h-72 flex-col rounded-2xl border bg-card/90 p-6 shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-sm font-semibold text-primary">
                    {section.number}
                  </span>
                  <Badge variant={section.optional ? 'secondary' : 'outline'}>
                    {section.optional
                      ? 'Optional · guided'
                      : 'Guided walkthrough'}
                  </Badge>
                </div>
                <h3 className="mt-8 text-xl font-semibold tracking-tight">
                  {section.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {section.summary}
                </p>
                <p className="mt-4 font-mono text-[11px] text-primary">
                  {section.focus}
                </p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t pt-5">
                  <a
                    aria-label={`Open the source notebook for ${section.title}`}
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'sm' }),
                      '-ml-3 min-h-11',
                    )}
                    href={section.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Notebook
                    <ExternalLink data-icon="inline-end" aria-hidden="true" />
                  </a>
                  <a
                    aria-label={`Open guided section ${section.number}: ${section.title}`}
                    className={cn(buttonVariants({ size: 'sm' }), 'min-h-11')}
                    href={sitePath(`/chapter-2/${section.slug}`)}
                  >
                    Open section
                    <ArrowRight data-icon="inline-end" aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 flex flex-col gap-4 rounded-2xl bg-primary px-6 py-7 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex gap-4">
            <BookOpenText className="mt-1 size-5 shrink-0" aria-hidden="true" />
            <div>
              <h2 className="font-semibold">Independent TA companion</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 opacity-80">
                Guided explanations are paired with—not substituted for—the
                original notebooks by Wanmo Kang and Kyunghyun Cho.
              </p>
            </div>
          </div>
          <a
            className={cn(buttonVariants({ variant: 'secondary' }), 'shrink-0')}
            href={repositoryBase}
            target="_blank"
            rel="noreferrer"
          >
            Original repository
            <ExternalLink data-icon="inline-end" aria-hidden="true" />
          </a>
        </section>
      </main>
    </div>
  );
}
