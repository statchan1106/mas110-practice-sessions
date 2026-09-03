import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { chapterTwoSections } from '@/lib/chapter-two-data';
import { sitePath } from '@/lib/site-path';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Chapter 2 · KAIST MAS110 Practice Sessions',
  description:
    'Matrices and Gaussian elimination, traced from each Python line to a visible mathematical change.',
};

export const dynamic = 'force-static';

const concepts = [
  [
    'System',
    'Ax = b',
    'Rows are equations; columns are the directions combined by x.',
  ],
  [
    'Product',
    'AB = [Ab₁ | ··· | Abₗ]',
    'Matrix multiplication repeats one matrix–vector product by columns.',
  ],
  [
    'Elimination',
    'Rᵢ ← Rᵢ − mRⱼ',
    'Choose m so one target entry becomes exactly zero.',
  ],
  [
    'Factorization',
    'QA = LU',
    'A row order and all elimination multipliers can be stored and reused.',
  ],
];

export default function ChapterTwoHome() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto max-w-[108rem] px-4 pb-20 pt-8 sm:px-6 sm:pt-12 lg:px-8"
      >
        <nav className="course-breadcrumb" aria-label="Breadcrumb">
          <a href={sitePath('/')}>Practice sessions</a>
          <span>/</span>
          <span aria-current="page">Chapter 2</span>
        </nav>

        <header className="chapter-header">
          <div>
            <p className="section-kicker">Chapter 2 · Computation</p>
            <h1 className="course-title mt-4 max-w-5xl">
              Matrices and Gaussian Elimination
            </h1>
          </div>
          <div className="chapter-question">
            <span>One question</span>
            <p>
              When, and how, can we solve <em>Ax = b</em>?
            </p>
          </div>
        </header>

        <section className="py-12 sm:py-16" aria-labelledby="concepts-title">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">Before the code</p>
              <h2 id="concepts-title" className="section-title">
                Four ideas to keep in view
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-muted-foreground">
              Chapter 2 turns hand calculations into an algorithm. Every visual
              below answers: what did this line use, do, and update?
            </p>
          </div>
          <dl className="concept-ledger mt-8">
            {concepts.map(([term, relation, copy], index) => (
              <div key={term}>
                <dt>
                  <span>0{index + 1}</span>
                  {term}
                </dt>
                <dd>
                  <code>{relation}</code>
                  <p>{copy}</p>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="lecture-bridge" aria-labelledby="bridge-title">
          <div>
            <p className="section-kicker">Lecture bridge</p>
            <h2 id="bridge-title" className="section-title mt-2">
              See the zeros before writing the loop
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
              The lecture’s running system becomes upper triangular through
              three row operations. The Python loop repeats exactly this
              cancellation pattern.
            </p>
          </div>
          <div className="bridge-flow">
            <figure
              className="lecture-matrix"
              aria-label="Initial augmented matrix: rows 2 1 1 5; 4 negative 6 0 negative 2; negative 2 7 2 9"
            >
              <figcaption>Start · [ A | b ]</figcaption>
              {[
                [2, 1, 1, 5],
                [4, -6, 0, -2],
                [-2, 7, 2, 9],
              ].map((row, rowIndex) => (
                <div key={rowIndex}>
                  {row.map((value, columnIndex) => (
                    <span
                      key={columnIndex}
                      className={columnIndex === 3 ? 'is-rhs' : ''}
                    >
                      {value}
                    </span>
                  ))}
                </div>
              ))}
            </figure>
            <ol className="bridge-operations">
              <li>
                <span>01</span>
                <code>R₂ ← R₂ − 2R₁</code>
                <small>4 → 0</small>
              </li>
              <li>
                <span>02</span>
                <code>R₃ ← R₃ + R₁</code>
                <small>−2 → 0</small>
              </li>
              <li>
                <span>03</span>
                <code>R₃ ← R₃ + R₂</code>
                <small>8 → 0</small>
              </li>
            </ol>
            <figure
              className="lecture-matrix is-result"
              aria-label="Upper triangular augmented matrix: rows 2 1 1 5; 0 negative 8 negative 2 negative 12; 0 0 1 2"
            >
              <figcaption>Result · [ U | c ]</figcaption>
              {[
                [2, 1, 1, 5],
                [0, -8, -2, -12],
                [0, 0, 1, 2],
              ].map((row, rowIndex) => (
                <div key={rowIndex}>
                  {row.map((value, columnIndex) => (
                    <span
                      key={columnIndex}
                      className={cn(
                        columnIndex === 3 && 'is-rhs',
                        rowIndex > 0 && columnIndex < rowIndex && 'is-zero',
                      )}
                    >
                      {value}
                    </span>
                  ))}
                </div>
              ))}
            </figure>
          </div>
          <p className="bridge-conclusion">
            <span>Back-substitution</span>
            <strong>(u, v, w) = (1, 1, 2)</strong>
          </p>
        </section>

        <section aria-labelledby="labs-title">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">Practice sequence</p>
              <h2 id="labs-title" className="section-title">
                Choose a lab
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-muted-foreground">
              Begin with the guided 3×3 trace, then open the original notebook
              in Colab when you want the complete Python run.
            </p>
          </div>
          <ol className="syllabus-list mt-8">
            {chapterTwoSections.map((section) => (
              <li key={section.slug}>
                <a
                  className="chapter-lab-row group"
                  href={sitePath(`/chapter-2/${section.slug}`)}
                >
                  <span className="syllabus-number">{section.number}</span>
                  <span className="min-w-0">
                    <strong>{section.title}</strong>
                    <small>{section.summary}</small>
                  </span>
                  <code>{section.focus}</code>
                  <span className="syllabus-action">
                    Open lab{' '}
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>

        <aside className="source-note mt-14">
          <span>Source note</span>
          <p>
            The web walkthroughs use small, fixed teaching examples. They
            explain the operations but do not execute Python. Each lab links to
            the corresponding <em>Foundations of LADS</em> notebook for the full
            run.
          </p>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
