import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { renderMathProse } from '@/components/math-prose';
import { MathText } from '@/components/math-text';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { chapterSevenSections } from '@/lib/chapter-seven-data';
import { sitePath } from '@/lib/site-path';

export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: 'Chapter 7 · Positive Definite Matrices · KAIST MAS110',
  description:
    'Two small NumPy labs on quadratic forms, Cholesky factors, and how eigenvalues change after a rank-one update.',
};

export default function ChapterSevenHome() {
  return renderMathProse(
    <div className="min-h-screen">
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto max-w-[108rem] px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-8"
      >
        <nav className="course-breadcrumb" aria-label="Breadcrumb">
          <a href={sitePath('/#chapters')}>Practice sessions</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Chapter 7</span>
        </nav>
        <header className="chapter-header">
          <div>
            <p className="section-kicker">Chapter 7 · Quadratic forms</p>
            <h1 className="course-title mt-4">Positive Definite Matrices</h1>
          </div>
          <div className="chapter-question">
            <span>One question</span>
            <p>How do we read a matrix through its factor and eigenvalues?</p>
          </div>
        </header>

        <section className="py-8 sm:py-10" aria-labelledby="labs-title">
          <h2 id="labs-title" className="section-title">
            Guided Python labs
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Read each active Python line, predict the result, then reveal the
            change.
          </p>
          <ol className="syllabus-list mt-6">
            {chapterSevenSections.map((section) => (
              <li key={section.slug}>
                <a
                  className="chapter-lab-row group"
                  href={sitePath('/chapter-7/' + section.slug)}
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

        <section
          className="lecture-bridge mb-8 flex flex-wrap items-center gap-x-10 gap-y-3"
          aria-labelledby="example-title"
        >
          <div>
            <h2 id="example-title" className="section-title">
              One matrix for both labs
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
              {
                'Lab 7.1 computes $x^\\top Ax$. Lab 7.2 divides the quadratic form by $x^\\top x$ to compare directions.'
              }
            </p>
          </div>
          <MathText tex={String.raw`A=\begin{pmatrix}5&4\\4&5\end{pmatrix}`}>
            {null}
          </MathText>
        </section>

        <aside className="source-note">
          <span>Lecture reference</span>
          <p>
            Wooseok Ha, MAS110 Lecture 7,{' '}
            <cite>Positive Definite Matrices</cite>.{' '}
            <a
              className="text-link"
              href={sitePath('/chapter-7/lecture-notes')}
            >
              Review the derivations and explore the ellipsoid
            </a>
          </p>
        </aside>
      </main>
      <SiteFooter />
    </div>,
  );
}
