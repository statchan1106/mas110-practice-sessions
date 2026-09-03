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
        className="mx-auto max-w-[108rem] px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-8"
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
            <strong>Lecture 2 concepts</strong>
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
            <p>Run the original code and change the inputs.</p>
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
