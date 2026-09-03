import { ArrowRight } from 'lucide-react';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { courseChapters, repositoryBase } from '@/lib/course-data';
import { sitePath } from '@/lib/site-path';

export const dynamic = 'force-static';

const pageFunctions = [
  ['01', 'Key ideas', 'Review the terms used in the lab.'],
  ['02', 'Next line', 'Move through the code one line at a time.'],
  ['03', 'Predict', 'Decide what should change.'],
  ['04', 'Reveal', 'Compare the prepared before and after.'],
];

export default function CourseHome() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content">
        <section className="course-hero">
          <div className="mx-auto grid max-w-[108rem] gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.65fr)] lg:px-8 lg:py-14 2xl:gap-10 2xl:py-20">
            <div>
              <p className="section-kicker">
                KAIST MAS110 · Linear Algebra for Data Science · Fall 2026
              </p>
              <h1 className="course-title mt-4 max-w-5xl">Practice Sessions</h1>
              <p className="mt-6 max-w-3xl text-xl leading-9 text-foreground/82 sm:text-2xl sm:leading-10">
                Connect lecture ideas to readable code and visible mathematical
                change.
              </p>
              <p className="mt-7 max-w-3xl border-l-2 border-primary pl-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Review the idea, trace the code, then run the full notebook in
                Colab. Based on <em>Foundations of LADS</em>; not a
                homework-solution bank.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a className="course-button" href="#chapters">
                  Browse chapters{' '}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
                <a
                  className="text-link text-base"
                  href={repositoryBase}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open source notebooks ↗
                </a>
              </div>
            </div>

            <aside
              className="session-note"
              aria-labelledby="session-note-title"
            >
              <p className="section-kicker">Practice sessions</p>
              <h2 id="session-note-title">Review → Trace → Run</h2>
              <dl>
                <div>
                  <dt>Review</dt>
                  <dd>Recall the lecture idea.</dd>
                </div>
                <div>
                  <dt>Trace</dt>
                  <dd>See one code line change the math.</dd>
                </div>
                <div>
                  <dt>Run</dt>
                  <dd>Try the full notebook in Colab.</dd>
                </div>
              </dl>
              <p className="session-policy">
                <strong>Attendance is not recorded</strong> for these practice
                sessions.
              </p>
              <p className="session-contact">
                Questions about the materials or code?{' '}
                <span className="email-address">
                  statchan1106 [at] kaist.ac.kr
                </span>
              </p>
            </aside>
          </div>
        </section>

        <div className="mx-auto max-w-[108rem] px-4 pb-20 sm:px-6 lg:px-8">
          <section
            id="chapters"
            className="scroll-mt-24 py-14 sm:py-16"
            aria-labelledby="chapters-title"
          >
            <div className="section-heading-row">
              <div>
                <p className="section-kicker">Practice library</p>
                <h2 id="chapters-title" className="section-title">
                  Browse by chapter
                </h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                Available chapters open below. The rest are marked in
                preparation.
              </p>
            </div>

            <ol className="chapter-directory mt-9">
              {courseChapters.map((chapter) => {
                const content = (
                  <>
                    <span className="chapter-directory-number">
                      {chapter.number}
                    </span>
                    <span className="chapter-directory-copy">
                      <strong>{chapter.title}</strong>
                      <small>{chapter.summary}</small>
                    </span>
                    <span className="chapter-directory-source">
                      {chapter.sourceNotebooks}{' '}
                      {chapter.sourceNotebooks === 1 ? 'notebook' : 'notebooks'}
                    </span>
                    <span
                      className={`chapter-status is-${chapter.status}`}
                      aria-label={
                        chapter.status === 'available'
                          ? 'Guided materials available now'
                          : 'Guided materials in preparation'
                      }
                    >
                      {chapter.status === 'available'
                        ? 'Available now'
                        : 'In preparation'}
                    </span>
                    {chapter.status === 'available' && (
                      <ArrowRight
                        className="chapter-directory-arrow size-4"
                        aria-hidden="true"
                      />
                    )}
                  </>
                );

                return (
                  <li key={chapter.number}>
                    {chapter.href ? (
                      <a
                        className="chapter-directory-row is-available"
                        href={sitePath(chapter.href)}
                      >
                        {content}
                      </a>
                    ) : (
                      <div
                        className="chapter-directory-row is-preparing"
                        aria-disabled="true"
                      >
                        {content}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>

          <section
            id="how-it-works"
            className="method-strip scroll-mt-24"
            aria-labelledby="method-title"
          >
            <div>
              <p className="section-kicker">In each lab</p>
              <h2 id="method-title" className="section-title mt-2">
                Review, predict, compare
              </h2>
            </div>
            <ol className="grid gap-0 sm:grid-cols-2 xl:grid-cols-4">
              {pageFunctions.map(([number, title, copy]) => (
                <li key={number} className="method-step">
                  <span>{number}</span>
                  <strong>{title}</strong>
                  <p>{copy}</p>
                </li>
              ))}
            </ol>
          </section>

          <aside
            className="home-source-note mt-14"
            aria-labelledby="about-project-title"
          >
            <div>
              <p className="section-kicker">About this project</p>
              <h2 id="about-project-title" className="section-title mt-2">
                Course-wide and growing
              </h2>
            </div>
            <div>
              <p>
                New labs will be added through Fall 2026. Each one connects
                lecture terms, line-by-line code, visible changes, and the
                original Colab notebook.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
