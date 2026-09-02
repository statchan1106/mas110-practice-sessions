import {
  ArrowRight,
  BookOpenText,
  Code2,
  ExternalLink,
  GraduationCap,
  Grid3X3,
  Play,
} from 'lucide-react';

import { LessonPlayer } from '@/components/lesson-player';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { gaussianLesson, roadmap } from '@/lib/lesson-data';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a className="flex items-center gap-3" href="#top" aria-label="Foundations of LADS home">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Grid3X3 className="size-4" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-tight">Foundations of LADS</span>
              <span className="hidden text-xs text-muted-foreground sm:block">Interactive course companion</span>
            </span>
          </a>

          <nav className="flex items-center gap-1" aria-label="Main navigation">
            <a className={buttonVariants({ variant: 'ghost' })} href="#lab">Walkthrough</a>
            <a className={cn(buttonVariants({ variant: 'ghost' }), 'hidden sm:inline-flex')} href="#roadmap">Course map</a>
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

      <main id="top" className="mx-auto max-w-7xl px-4 pb-20 pt-9 sm:px-6 sm:pt-12 lg:px-8">
        <section className="mb-8 grid gap-7 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Week 01</Badge>
              <span className="text-sm text-muted-foreground">Orientation · Ch 2.1 Gaussian Elimination</span>
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.035em] text-balance sm:text-5xl">
              Make every cancellation
              <br />visible.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Predict the multiplier, run one line, and watch a chosen entry become zero. You control every step—nothing auto-plays past the idea.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a className={buttonVariants({ size: 'lg' })} href="#lab">
                <Play data-icon="inline-start" aria-hidden="true" />Start the walkthrough
              </a>
              <a className={buttonVariants({ variant: 'outline', size: 'lg' })} href={gaussianLesson.colabUrl} target="_blank" rel="noreferrer">
                Open the full notebook<ExternalLink data-icon="inline-end" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="rounded-2xl border bg-card/88 p-5 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                <GraduationCap className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold">By the end of today</p>
                <p className="text-xs text-muted-foreground">You should be able to explain—not just compute.</p>
              </div>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-6">
              <li className="flex gap-3"><span className="font-mono text-primary">01</span>Which entry we cancel—and why</li>
              <li className="flex gap-3"><span className="font-mono text-primary">02</span>What one line of NumPy does to a row</li>
              <li className="flex gap-3"><span className="font-mono text-primary">03</span>Why triangular form makes solving easier</li>
            </ul>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border bg-card/88 p-5 shadow-sm backdrop-blur-sm sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
          <div className="flex gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
              <BookOpenText className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary">Source acknowledgment</p>
              <h2 className="mt-1 font-semibold">An independent teaching companion to the original notebooks</h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                The course sequence and examples follow <em>Foundations of Linear Algebra for Data Science</em> by Wanmo Kang and Kyunghyun Cho, released under the{' '}
                <a className="underline decoration-border underline-offset-4 hover:text-foreground" href="https://github.com/kyunghyuncho/Foundations_of_LADS/blob/main/LICENSE" target="_blank" rel="noreferrer">MIT License</a>.
              </p>
            </div>
          </div>
          <a className={cn(buttonVariants({ variant: 'outline' }), 'mt-4 shrink-0 sm:mt-0')} href={gaussianLesson.sourceUrl.split('/blob/')[0]} target="_blank" rel="noreferrer">
            Original GitHub repository<ExternalLink data-icon="inline-end" aria-hidden="true" />
          </a>
        </section>

        <section id="lab" className="scroll-mt-24"><LessonPlayer lesson={gaussianLesson} /></section>

        <section id="roadmap" className="scroll-mt-24 pt-20">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-medium text-primary">Course map</p>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">One learning loop, across the course</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Every topic follows the same rhythm: predict, run one step, inspect the visual change, then experiment in Colab.
              </p>
            </div>
            <a className={buttonVariants({ variant: 'outline' })} href={gaussianLesson.sourceUrl} target="_blank" rel="noreferrer">
              View this notebook<ArrowRight data-icon="inline-end" aria-hidden="true" />
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {roadmap.map((item) => (
              <article key={item.week} className="rounded-xl border bg-card/82 p-5 backdrop-blur-sm">
                <div className="mb-8 flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">W{item.week}</span>
                  {item.active ? <Badge>Now</Badge> : <Badge variant="outline">Next</Badge>}
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 flex flex-col gap-5 rounded-2xl bg-primary px-6 py-7 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex gap-4">
            <BookOpenText className="mt-1 size-5 shrink-0" aria-hidden="true" />
            <div>
              <h2 className="font-semibold">This page is the shared thinking space—not a notebook replacement.</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 opacity-80">Use it to reason through the operation together, then change the code and try larger matrices in Colab.</p>
            </div>
          </div>
          <a className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'shrink-0')} href={gaussianLesson.colabUrl} target="_blank" rel="noreferrer">
            Continue in Colab<ExternalLink data-icon="inline-end" aria-hidden="true" />
          </a>
        </section>
      </main>

      <footer className="border-t bg-background/75">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Foundations of LADS · Interactive teaching companion</p>
          <p>Original notebooks by Wanmo Kang and Kyunghyun Cho</p>
        </div>
      </footer>
    </div>
  );
}
