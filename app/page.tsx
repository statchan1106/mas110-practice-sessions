import { ArrowRight } from 'lucide-react';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { courseChapters, repositoryBase } from '@/lib/course-data';
import { sitePath } from '@/lib/site-path';

export const dynamic = 'force-static';

const pageFunctions = [
  [
    '01',
    'Key ideas',
    'A short reference for the definitions used in the lab. It is not a quiz or a graded check.',
  ],
  [
    '02',
    'Next line',
    'Moves to the next Python line and explains what it uses, does, and updates.',
  ],
  [
    '03',
    'Think first',
    'Names the row, entry, or variable to watch before you see the result.',
  ],
  [
    '04',
    'Show expected result',
    'Shows the prepared before-and-after view. The full Python code runs in Colab.',
  ],
];

export default function CourseHome() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content">
        <section className="course-hero">
          <div className="mx-auto grid max-w-[108rem] gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.65fr)] lg:px-8 lg:py-20">
            <div>
              <p className="section-kicker">
                KAIST MAS110 · Linear Algebra for Data Science · Fall 2026
              </p>
              <h1 className="course-title mt-4 max-w-5xl">Practice Sessions</h1>
              <p className="mt-6 max-w-3xl text-xl leading-9 text-foreground/82 sm:text-2xl sm:leading-10">
                A chapter-by-chapter guide from lecture ideas to readable code
                and visible mathematical change.
              </p>
              <p className="mt-7 max-w-3xl border-l-2 border-primary pl-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                These materials review class content and implement key concepts
                in code, following <em>Foundations of LADS</em>. They are
                learning aids—not a homework-solution bank.
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
              <p className="section-kicker">About the practice sessions</p>
              <h2 id="session-note-title">Use the site at your own pace.</h2>
              <dl>
                <div>
                  <dt>Review</dt>
                  <dd>Reconnect each lab to the idea introduced in class.</dd>
                </div>
                <div>
                  <dt>Trace</dt>
                  <dd>Follow the effect of each prepared Python line.</dd>
                </div>
                <div>
                  <dt>Run</dt>
                  <dd>
                    Open Colab when you want to execute the full notebook.
                  </dd>
                </div>
              </dl>
              <p className="session-policy">
                <strong>Attendance is not recorded</strong> for these practice
                sessions.
              </p>
              <p className="session-contact">
                Questions about the materials or code?{' '}
                <a href="mailto:statchan1106@kaist.ac.kr">
                  statchan1106@kaist.ac.kr
                </a>
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
                Chapter 2 is available now. Later guided chapters are listed in
                course order and clearly marked while they are being prepared.
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
              <p className="section-kicker">How the controls work</p>
              <h2 id="method-title" className="section-title mt-2">
                What each label means
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

          <aside className="home-source-note mt-14">
            <p>
              The chapter order follows the Fall 2026 course coverage. The
              syllabus is a working guide, so this library will grow as the
              semester progresses.
            </p>
            <p>
              No previous linear algebra is assumed. Familiarity with Python is
              helpful, but the walkthroughs explain each line before Colab is
              needed.
            </p>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
