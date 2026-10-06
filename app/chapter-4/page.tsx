import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { leastSquaresSection } from '@/lib/chapter-four/least-squares';
import { sourceLinks } from '@/lib/chapter/shared';
import { sitePath } from '@/lib/site-path';

export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: 'Chapter 4 · Orthogonality and Approximation · KAIST MAS110',
  description:
    'Lecture 4 notation and a guided least-squares example connecting normal equations, projections, QR, and rank.',
};

const concepts = [
  [
    'Inner product',
    '⟨u,v⟩ = uᵀv',
    'Use the standard Euclidean inner product to measure length and perpendicularity in this lab.',
  ],
  [
    'Projection',
    'b = Pb + (I − P)b',
    'Split an observation into a reachable fitted output and a perpendicular residual.',
  ],
  [
    'Reduced QR',
    'A = QR; QᵀQ = Iₙ',
    'Orthonormal columns give simple projection coordinates. For m > n, QQᵀ is a projection, not Iₘ.',
  ],
  [
    'Least squares',
    'Aᵀ(b − Aθ̂) = 0',
    'Choose the nearest reachable output. Independent columns make the coefficients unique.',
  ],
];
const sources = [
  {
    number: '4.1',
    title: 'Inner Products in Euclidean Vector Spaces',
    filename: 'Ch4-1 Inner Products in Euclidean Vector Spaces.ipynb',
  },
  {
    number: '4.2',
    title: 'Vector Spaces of Polynomials',
    filename: 'Ch4-2 Vectors Space of Polynomials.ipynb',
  },
  {
    number: '4.3',
    title: 'QR-Decomposition',
    filename: 'Ch4-3 QR-Decomposition.ipynb',
  },
];

export default function ChapterFourHome() {
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
          <span aria-current="page">Chapter 4</span>
        </nav>
        <header className="chapter-header">
          <div>
            <p className="section-kicker">Chapter 4 · Geometry</p>
            <h1 className="course-title mt-4 max-w-5xl">
              Orthogonality and Approximation
            </h1>
          </div>
          <div className="chapter-question">
            <span>One question</span>
            <p>When b is out of reach, which output is closest?</p>
          </div>
        </header>
        <section className="py-12 sm:py-16" aria-labelledby="concepts-title">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">Lecture 4</p>
              <h2 id="concepts-title" className="section-title">
                Four ideas behind the fit
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-muted-foreground">
              Read the geometry first, then follow the same matrix through the
              code.
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
            <p className="section-kicker">
              The running example · printed slide 67
            </p>
            <h2 id="bridge-title" className="section-title mt-2">
              A best fit still has a residual
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
              For A = [[−1,1],[0,1],[1,0]] and b = (1,1,1)ᵀ, no coefficient
              gives an exact fit. The nearest reachable output is b̂ =
              (2/3,4/3,2/3)ᵀ.
            </p>
          </div>
          <div className="bridge-flow">
            <figure
              className="lecture-matrix"
              aria-label="Observed output b: 1, 1, 1"
            >
              <figcaption>b · observed</figcaption>
              {[[1], [1], [1]].map((row, i) => (
                <div key={i}>
                  {row.map((value, j) => (
                    <span key={j}>{value}</span>
                  ))}
                </div>
              ))}
            </figure>
            <ol className="bridge-operations">
              <li>
                <span>01</span>
                <code>θ̂ = (2/3,4/3)ᵀ</code>
                <small>two coefficients</small>
              </li>
              <li>
                <span>02</span>
                <code>b̂ = Aθ̂</code>
                <small>three fitted values</small>
              </li>
              <li>
                <span>03</span>
                <code>Aᵀ(b − b̂) = 0</code>
                <small>a perpendicular residual</small>
              </li>
            </ol>
            <figure
              className="lecture-matrix is-result"
              aria-label="Residual e: 1/3, minus 1/3, 1/3"
            >
              <figcaption>e = b − b̂</figcaption>
              {[['1/3'], ['−1/3'], ['1/3']].map((row, i) => (
                <div key={i}>
                  {row.map((value, j) => (
                    <span key={j}>{value}</span>
                  ))}
                </div>
              ))}
            </figure>
          </div>
          <p className="bridge-conclusion">
            <span>Chapter 4</span>
            <strong>
              The fitted output lies in Col(A); the residual lies in its
              orthogonal complement.
            </strong>
          </p>
        </section>
        <section aria-labelledby="labs-title">
          <div className="section-heading-row is-compact">
            <div>
              <p className="section-kicker">Guided lab</p>
              <h2 id="labs-title" className="section-title">
                Trace least squares step by step
              </h2>
            </div>
          </div>
          <ol className="syllabus-list mt-8">
            <li>
              <a
                className="chapter-lab-row group"
                href={sitePath('/chapter-4/least-squares')}
              >
                <span className="syllabus-number">4.4</span>
                <span className="min-w-0">
                  <strong>{leastSquaresSection.title}</strong>
                  <small>{leastSquaresSection.summary}</small>
                </span>
                <code>{leastSquaresSection.focus}</code>
                <span className="syllabus-action">
                  Open lab{' '}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </span>
              </a>
            </li>
          </ol>
        </section>
        <section className="py-12" aria-labelledby="sources-title">
          <p className="section-kicker">Prerequisite notebooks</p>
          <h2 id="sources-title" className="section-title mt-3">
            Review the ideas used in 4.4
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Sections 4.1–4.3 are available as source notebooks; the guided page
            currently covers 4.4.
          </p>
          <ol className="syllabus-list mt-6">
            {sources.map(({ number, title, filename }) => (
              <li key={number}>
                <a
                  className="chapter-lab-row group"
                  href={sourceLinks(filename).colabUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="syllabus-number">{number}</span>
                  <span className="min-w-0">
                    <strong>{title}</strong>
                    <small>{filename}</small>
                  </span>
                  <span className="syllabus-action">Source in Colab ↗</span>
                </a>
              </li>
            ))}
          </ol>
        </section>
        <aside className="source-note">
          <span>Lecture reference</span>
          <p>
            Lab 4.4 follows Wooseok Ha’s Lecture 4, printed slides 61–68 (PDF
            pages 71–78 of lec04.pdf), with projection and QR connections. Its
            companion notebook is maintained in this project’s GitHub
            repository.
          </p>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
