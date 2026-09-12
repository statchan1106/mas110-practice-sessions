import { ArrowLeft, ArrowRight } from 'lucide-react';

import { CodeWalkthrough } from '@/components/code-walkthrough';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import type { ChapterSection } from '@/lib/chapter/shared';
import { sitePath } from '@/lib/site-path';

export function ChapterSectionPage({
  section,
  sections,
}: {
  section: ChapterSection;
  sections: ChapterSection[];
}) {
  const chapterNumber = section.number.split('.')[0];
  const chapterHref = `/chapter-${chapterNumber}`;
  const sectionIndex = sections.findIndex((item) => item.slug === section.slug);
  const previous = sectionIndex > 0 ? sections[sectionIndex - 1] : undefined;
  const next =
    sectionIndex < sections.length - 1 ? sections[sectionIndex + 1] : undefined;

  return (
    <div
      className={
        section.lectureNotes
          ? 'min-h-screen lecture-aligned-lab'
          : 'min-h-screen'
      }
    >
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto max-w-[108rem] px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-8"
      >
        <nav className="course-breadcrumb" aria-label="Breadcrumb">
          <a href={sitePath('/')}>Practice sessions</a>
          <span>/</span>
          <a href={sitePath(chapterHref)}>Chapter {chapterNumber}</a>
          <span>/</span>
          <span aria-current="page">{section.number}</span>
        </nav>

        <header className="lesson-heading">
          <div>
            <p className="section-kicker">
              Lab {section.number}
              {section.optional ? ' · Optional' : ''}
            </p>
            <h1 className="section-title mt-4 max-w-5xl sm:text-[3.2rem] min-[1680px]:text-[3.7rem]">
              {section.title}
            </h1>
          </div>
          <dl className="lesson-meta">
            <div>
              <dt>Focus</dt>
              <dd>{section.focus}</dd>
            </div>
            <div>
              <dt>Notebook</dt>
              <dd>{section.filename}</dd>
            </div>
          </dl>
        </header>

        <section
          className="lab-purpose"
          aria-labelledby={`lab-${section.number}-goal`}
        >
          <div>
            <p className="section-kicker">Lab goal</p>
            <h2 id={`lab-${section.number}-goal`}>{section.learningGoal}</h2>
          </div>
          <div className="lab-concepts">
            <strong>Lecture-note concepts</strong>
            <ul>
              {section.lectureConcepts.map((concept) => (
                <li key={concept}>{concept}</li>
              ))}
            </ul>
            {section.codeExtension && (
              <p>
                <span>Code extension</span>
                {section.codeExtension}
              </p>
            )}
          </div>
        </section>

        {section.lectureNotes && (
          <section
            className="lecture-notation"
            aria-labelledby="notation-heading"
          >
            <p className="section-kicker">Lecture 3 · Reading guide</p>
            <h2 id="notation-heading" className="section-title mt-3">
              Read the symbols first
            </h2>
            <p className="lecture-reference">
              {section.lectureNotes.reference}
            </p>
            <p>{section.lectureNotes.introduction}</p>
            <dl className="notation-ledger">
              {section.lectureNotes.notation.map(({ symbol, meaning }) => (
                <div key={symbol}>
                  <dt>{symbol}</dt>
                  <dd>{meaning}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="concept-primer" aria-labelledby="primer-heading">
          <div className="section-heading-row is-compact">
            <div>
              <p className="section-kicker">Key ideas</p>
              <h2 id="primer-heading" className="section-title">
                Terms you will use
              </h2>
            </div>
          </div>
          <dl className="primer-ledger mt-7">
            {section.primer.map((item) => (
              <div key={item.term}>
                <dt>
                  <strong>{item.term}</strong>
                  <code>{item.relation}</code>
                </dt>
                <dd>
                  <p>{item.definition}</p>
                  {section.lectureNotes && (
                    <small>
                      <span>Keep in mind</span> {item.watchFor}
                    </small>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <CodeWalkthrough walkthrough={section.walkthrough} />

        {section.lectureNotes && (
          <section
            className="lecture-reasoning"
            aria-labelledby="reasoning-heading"
          >
            <p className="section-kicker">Connect the steps</p>
            <h2 id="reasoning-heading" className="section-title mt-3">
              Why this gives every solution
            </h2>
            <div className="reasoning-ledger">
              {section.lectureNotes.reasoning.map((item, index) => (
                <article key={item.title}>
                  <h3>
                    <span>{String(index + 1).padStart(2, '0')}</span>{' '}
                    {item.title}
                  </h3>
                  {item.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {item.equation && (
                    <p className="reasoning-equation">{item.equation}</p>
                  )}
                </article>
              ))}
            </div>
            <h3 className="self-check-heading">Check your understanding</h3>
            <div className="lecture-self-checks">
              {section.lectureNotes.checks.map(({ question, answer }) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <section className="notebook-bar" aria-label="Notebook links">
          <div>
            <p className="section-kicker">Continue in Python</p>
            <h2>Run the complete notebook in Colab</h2>
            <p>
              {section.notebookNote ??
                'Run the original code and change the inputs.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              className="course-button"
              href={section.colabUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open in Colab ↗
            </a>
            <a
              className="text-link self-center text-sm"
              href={section.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              View the full source ↗
            </a>
          </div>
        </section>

        <nav
          className="lesson-pagination"
          aria-label={`Chapter ${chapterNumber} section navigation`}
        >
          {previous ? (
            <a href={sitePath(`${chapterHref}/${previous.slug}`)}>
              <span>
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                Previous
              </span>
              <strong>
                {previous.number} · {previous.shortTitle}
              </strong>
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a
              className="text-right"
              href={sitePath(`${chapterHref}/${next.slug}`)}
            >
              <span className="justify-end">
                Next
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
              <strong>
                {next.number} · {next.shortTitle}
              </strong>
            </a>
          ) : (
            <a className="text-right" href={sitePath(chapterHref)}>
              <span className="justify-end">
                Chapter index
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
              <strong>Return to Chapter {chapterNumber}</strong>
            </a>
          )}
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
