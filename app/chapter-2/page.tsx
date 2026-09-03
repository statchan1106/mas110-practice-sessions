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
        className="mx-auto max-w-[108rem] px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-8"
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
              Each visual links one Python line to a mathematical change.
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
              One small system shows the pivot-and-cancel pattern used in the
              labs.
            </p>
          </div>
          <div className="bridge-flow">
            <figure
              className="lecture-matrix"
              aria-label="Initial augmented matrix: rows 0 2 2 10; 4 4 0 12; 2 3 2 14"
            >
              <figcaption>Start · [ A | b ]</figcaption>
              {[
                [0, 2, 2, 10],
                [4, 4, 0, 12],
                [2, 3, 2, 14],
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
                <code>R₁ ↔ R₂</code>
                <small>move 4 into the pivot</small>
              </li>
              <li>
                <span>02</span>
                <code>R₃ ← R₃ − 0.5R₁</code>
                <small>2 → 0</small>
              </li>
              <li>
                <span>03</span>
                <code>R₃ ← R₃ − 0.5R₂</code>
                <small>1 → 0</small>
              </li>
            </ol>
            <figure
              className="lecture-matrix is-result"
              aria-label="Upper triangular augmented matrix: rows 4 4 0 12; 0 2 2 10; 0 0 1 3"
            >
              <figcaption>Result · [ U_raw | c ]</figcaption>
              {[
                [4, 4, 0, 12],
                [0, 2, 2, 10],
                [0, 0, 1, 3],
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
            <strong>x = (1, 2, 3)</strong>
          </p>
        </section>

        <section aria-labelledby="labs-title">
          <div className="section-heading-row is-compact">
            <div>
              <p className="section-kicker">Practice sequence</p>
              <h2 id="labs-title" className="section-title">
                Choose a lab
              </h2>
            </div>
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
            Each lab adapts one notebook idea into a small teaching example. Run
            the full <em>Foundations of LADS</em> notebook in Colab for the
            larger version and extensions.
          </p>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
