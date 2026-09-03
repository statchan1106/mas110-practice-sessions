import { ArrowLeft, ArrowRight } from 'lucide-react';

import { CodeWalkthrough } from '@/components/code-walkthrough';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import {
  chapterTwoSections,
  type ChapterSection,
} from '@/lib/chapter-two-data';
import { sitePath } from '@/lib/site-path';

export function ChapterSectionPage({ section }: { section: ChapterSection }) {
  const sectionIndex = chapterTwoSections.findIndex(
    (item) => item.slug === section.slug,
  );
  const previous =
    sectionIndex > 0 ? chapterTwoSections[sectionIndex - 1] : undefined;
  const next =
    sectionIndex < chapterTwoSections.length - 1
      ? chapterTwoSections[sectionIndex + 1]
      : undefined;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto max-w-[96rem] px-4 pb-20 pt-8 sm:px-6 sm:pt-12 lg:px-8"
      >
        <nav className="course-breadcrumb" aria-label="Breadcrumb">
          <a href={sitePath('/')}>Practice sessions</a>
          <span>/</span>
          <a href={sitePath('/chapter-2')}>Chapter 2</a>
          <span>/</span>
          <span aria-current="page">{section.number}</span>
        </nav>

        <header className="lesson-heading">
          <div>
            <p className="section-kicker">
              Lab {section.number}
              {section.optional ? ' · Optional' : ''}
            </p>
            <h1 className="section-title mt-4 max-w-5xl sm:text-[3.7rem]">
              {section.title}
            </h1>
            <p className="mt-5 max-w-4xl text-lg leading-8 text-muted-foreground">
              {section.summary}
            </p>
          </div>
          <dl className="lesson-meta">
            <div>
              <dt>Mathematical thread</dt>
              <dd>{section.focus}</dd>
            </div>
            <div>
              <dt>Source notebook</dt>
              <dd>{section.filename}</dd>
            </div>
            <div>
              <dt>Web mode</dt>
              <dd>Prepared visual trace · Python runs in Colab</dd>
            </div>
          </dl>
        </header>

        <section className="concept-primer" aria-labelledby="primer-heading">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">Concept primer</p>
              <h2 id="primer-heading" className="section-title">
                Terms used in the walkthrough
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              This is a reference, not a quiz. Each definition explains the
              idea; each “Prediction cue” names what to look for before the
              prepared visual state is revealed.
            </p>
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
                  <small>
                    <span>Prediction cue</span>
                    {item.watchFor}
                  </small>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <CodeWalkthrough walkthrough={section.walkthrough} />

        <section className="notebook-bar" aria-label="Original notebook links">
          <div>
            <p className="section-kicker">Continue in Python</p>
            <h2>Run the complete notebook in Colab</h2>
            <p>
              The page above is an explanatory state model. Colab executes the
              original code and preserves the full notebook context.
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
              Inspect exact source ↗
            </a>
          </div>
        </section>

        <nav
          className="lesson-pagination"
          aria-label="Chapter 2 section navigation"
        >
          {previous ? (
            <a href={sitePath(`/chapter-2/${previous.slug}`)}>
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
              href={sitePath(`/chapter-2/${next.slug}`)}
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
            <a className="text-right" href={sitePath('/chapter-2')}>
              <span className="justify-end">
                Chapter index
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
              <strong>Return to Chapter 2</strong>
            </a>
          )}
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
