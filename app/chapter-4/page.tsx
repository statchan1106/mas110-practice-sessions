import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { chapterFourSections } from '@/lib/chapter-four-data';
import { sitePath } from '@/lib/site-path';

export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: 'Chapter 4 · Orthogonality and Approximation · KAIST MAS110',
  description:
    'Four guided Lecture 4 labs with consistent notation, runnable notebooks, and interactive geometry: inner products, polynomials, QR, and least squares.',
};

const concepts = [
  [
    'Inner product',
    '⟨u,v⟩ = uᵀv',
    'Use the standard Euclidean inner product to measure length and perpendicularity in this lab.',
  ],
  [
    'Polynomial metric',
    '⟨f,g⟩ = ∫₋₁¹ fg = cᵀGd',
    'Change the inner product from a dot product to an integral while keeping the same projection logic.',
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
              <p className="section-kicker">Four guided labs</p>
              <h2 id="labs-title" className="section-title">
                Build the geometry, then fit the data
              </h2>
            </div>
          </div>
          <ol className="syllabus-list mt-8">
            {chapterFourSections.map((section) => (
              <li key={section.slug}>
                <a
                  className="chapter-lab-row group"
                  href={sitePath(`/chapter-4/${section.slug}`)}
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
          className="lecture-notation"
          aria-labelledby="chapter-notation-heading"
        >
          <p className="section-kicker">One notation across the chapter</p>
          <h2 id="chapter-notation-heading" className="section-title mt-3">
            Keep the object and its coordinates separate
          </h2>
          <dl className="notation-ledger">
            <div>
              <dt>⟨·,·⟩ and ‖·‖</dt>
              <dd>
                The stated inner product determines the norm. In 4.1, 4.3, and
                4.4 use the Euclidean dot product; in 4.2 use the integral on
                [−1,1]. The lecture’s |v| is written ‖v‖ here.
              </dd>
            </div>
            <div>
              <dt>φ and θ̂</dt>
              <dd>
                φ denotes an angle. θ and θ̂ are candidate and minimizing model
                coefficients. Polynomial coordinate vectors use c,d instead of
                the function argument t.
              </dd>
            </div>
            <div>
              <dt>A and G</dt>
              <dd>
                A stores Euclidean input columns. G is a Gram matrix of inner
                products: the polynomial metric in 4.2, and AᵀA in 4.4. The
                lecture’s local polynomial Gram matrix A is renamed G here.
              </dd>
            </div>
            <div>
              <dt>Q, R, P</dt>
              <dd>
                Q stores orthonormal columns; R stores reconstruction
                coefficients; P acts on ambient vectors as a projection. Reduced
                Q is rectangular. QᵀQ = I does not imply QQᵀ = I.
              </dd>
            </div>
          </dl>
        </section>
        <aside className="source-note">
          <span>Lecture reference</span>
          <p>
            All four labs follow Wooseok Ha’s Lecture 4 with section-specific
            slide references. Read them in order or open any lab directly. Each
            page has an interactive explorer, a code trace, and a maintained
            notebook in this project’s GitHub repository.
          </p>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
