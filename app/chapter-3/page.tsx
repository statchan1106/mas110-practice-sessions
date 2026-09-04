import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { chapterThreeSections } from '@/lib/chapter-three-data';
import { sitePath } from '@/lib/site-path';

export const metadata: Metadata = {
  title: 'Chapter 3 · KAIST MAS110 Practice Sessions',
  description:
    'Vector spaces, null spaces, rank, and linear transformations traced from code to geometry.',
};

export const dynamic = 'force-static';

const concepts = [
  [
    'Reachability',
    'b ∈ Col(A)',
    'A solution exists exactly when b is reachable from the columns of A.',
  ],
  [
    'Uniqueness',
    'Null(A) = {0}',
    'A solution is unique when no nonzero input direction disappears.',
  ],
  [
    'Dimension',
    'rank(A) + nullity(A) = n',
    'The input space splits between retained and collapsed directions.',
  ],
  [
    'Linear map',
    'A(cx + y) = cAx + Ay',
    'A matrix preserves vector addition and scalar multiplication.',
  ],
];

export default function ChapterThreeHome() {
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
          <span aria-current="page">Chapter 3</span>
        </nav>

        <header className="chapter-header">
          <div>
            <p className="section-kicker">Chapter 3 · Structure</p>
            <h1 className="course-title mt-4 max-w-5xl">
              Vector Spaces and Linear Transformations
            </h1>
          </div>
          <div className="chapter-question">
            <span>One question</span>
            <p>What does a matrix keep, collapse, and reach?</p>
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
              Follow an input through the matrix and ask what survives at the
              output.
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
            <p className="section-kicker">Structure bridge</p>
            <h2 id="bridge-title" className="section-title mt-2">
              Different inputs can reach the same output
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
              If a nonzero direction n disappears, adding it to an input cannot
              change the output.
            </p>
          </div>
          <div className="bridge-flow">
            <figure
              className="lecture-matrix"
              aria-label="Two inputs: 3, 0 and 1, 1"
            >
              <figcaption>Inputs · x and x + n</figcaption>
              {[
                [3, 0],
                [1, 1],
              ].map((row, rowIndex) => (
                <div key={rowIndex}>
                  {row.map((value, columnIndex) => (
                    <span key={columnIndex}>{value}</span>
                  ))}
                </div>
              ))}
            </figure>
            <ol className="bridge-operations">
              <li>
                <span>01</span>
                <code>n = (−2, 1)</code>
                <small>a null direction</small>
              </li>
              <li>
                <span>02</span>
                <code>A n = 0</code>
                <small>the direction disappears</small>
              </li>
              <li>
                <span>03</span>
                <code>A(x + n) = Ax</code>
                <small>the output stays fixed</small>
              </li>
            </ol>
            <figure
              className="lecture-matrix is-result"
              aria-label="The same output 3, 6 appears twice"
            >
              <figcaption>Outputs · same b</figcaption>
              {[
                [3, 6],
                [3, 6],
              ].map((row, rowIndex) => (
                <div key={rowIndex}>
                  {row.map((value, columnIndex) => (
                    <span key={columnIndex}>{value}</span>
                  ))}
                </div>
              ))}
            </figure>
          </div>
          <p className="bridge-conclusion">
            <span>Chapter 3</span>
            <strong>
              Null space controls uniqueness; column space controls existence.
            </strong>
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
            {chapterThreeSections.map((section) => (
              <li key={section.slug}>
                <a
                  className="chapter-lab-row group"
                  href={sitePath(`/chapter-3/${section.slug}`)}
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
            Each lab adapts one Chapter 3 notebook into a small deterministic
            teaching example. The complete <em>Foundations of LADS</em>{' '}
            notebooks remain linked for extended experiments.
          </p>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
