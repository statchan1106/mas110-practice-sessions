import { ArrowRight } from 'lucide-react';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { chapterTwoSections } from '@/lib/chapter-two-data';
import { courseGroups, repositoryBase } from '@/lib/course-data';
import { sitePath } from '@/lib/site-path';

export const dynamic = 'force-static';

const method = [
  [
    '01',
    'Read one line',
    'Identify the values that the Python statement reads.',
  ],
  [
    '02',
    'Predict the change',
    'Name the row, entry, or variable that should change.',
  ],
  [
    '03',
    'Apply and compare',
    'Keep before and after visible; explain why the result is valid.',
  ],
];

export default function CourseHome() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content">
        <section className="course-hero">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-20">
            <div>
              <p className="section-kicker">
                KAIST MAS110 · Linear Algebra for Data Science
              </p>
              <h1 className="course-title mt-4 max-w-4xl">
                Friday Practice Sessions
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-foreground/78 sm:text-xl">
                Review the ideas covered in class, then trace how each one
                becomes executable and visible in code.
              </p>
              <p className="mt-6 max-w-2xl border-l-2 border-primary pl-4 text-sm leading-6 text-muted-foreground">
                These sessions follow <em>Foundations of LADS</em> and focus on
                lecture review and implementation—not problem-solving drills.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a className="course-button" href={sitePath('/chapter-2')}>
                  Start Chapter 2{' '}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
                <a
                  className="text-link text-sm"
                  href={repositoryBase}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open source notebooks ↗
                </a>
              </div>
            </div>

            <aside
              id="schedule"
              className="schedule-sheet scroll-mt-24"
              aria-label="Practice session schedule"
            >
              <p className="section-kicker">Every Friday</p>
              <div className="mt-5 divide-y divide-foreground/15 border-y border-foreground/20">
                <p className="schedule-time">
                  <span>Session A</span>
                  <strong>11:00–12:00</strong>
                </p>
                <p className="schedule-time">
                  <span>Session B</span>
                  <strong>14:00–15:00</strong>
                </p>
              </div>
              <p className="mt-5 text-sm font-semibold">Room 101 · Bldg E11</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Both sessions cover the same material.
              </p>
            </aside>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <section
            className="py-14 sm:py-16"
            aria-labelledby="current-lab-title"
          >
            <div className="section-heading-row">
              <div>
                <p className="section-kicker">Current practice lab</p>
                <h2 id="current-lab-title" className="section-title">
                  Chapter 2 · Matrices and Gaussian Elimination
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                From <span className="math-label">Ax = b</span> to elimination,
                reusable factors, block structure, and graph matrices.
              </p>
            </div>

            <ol className="syllabus-list mt-8">
              {chapterTwoSections.map((section) => (
                <li key={section.slug}>
                  <a
                    className="syllabus-row group"
                    href={sitePath(`/chapter-2/${section.slug}`)}
                  >
                    <span className="syllabus-number">{section.number}</span>
                    <span className="min-w-0">
                      <strong>{section.title}</strong>
                      <small>{section.summary}</small>
                    </span>
                    <span className="syllabus-action">
                      Open{' '}
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </section>

          <section className="method-strip" aria-labelledby="method-title">
            <div>
              <p className="section-kicker">How to use each walkthrough</p>
              <h2 id="method-title" className="section-title mt-2">
                Code is evidence, not decoration.
              </h2>
            </div>
            <ol className="grid gap-0 md:grid-cols-3">
              {method.map(([number, title, copy]) => (
                <li key={number} className="method-step">
                  <span>{number}</span>
                  <strong>{title}</strong>
                  <p>{copy}</p>
                </li>
              ))}
            </ol>
          </section>

          <details className="course-index mt-14">
            <summary>View the full Foundations of LADS course map</summary>
            <div className="mt-5 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {courseGroups.map((group) => (
                <div key={group.id} className="course-index-item">
                  <span>{group.chapters}</span>
                  <strong>{group.title}</strong>
                  <small>{group.notebooks.length} source notebooks</small>
                </div>
              ))}
            </div>
          </details>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
