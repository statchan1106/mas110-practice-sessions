import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { renderMathProse } from '@/components/math-prose';
import { MathText } from '@/components/math-text';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import {
  chapterFivePrimer,
  chapterFiveSections,
} from '@/lib/chapter-five-data';
import { sitePath } from '@/lib/site-path';

export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: 'Chapter 5 · Singular Value Decomposition · KAIST MAS110',
  description:
    'Four Lecture 5 labs on singular directions, low-rank approximation, pseudoinverses, and numerical rank, with a centered PCA example.',
};

export default function ChapterFiveHome() {
  return renderMathProse(
    <div className="min-h-screen">
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto max-w-[108rem] px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-8"
      >
        <nav className="course-breadcrumb" aria-label="Breadcrumb">
          <a href={sitePath('/')}>Practice sessions</a>
          <span>/</span>
          <span aria-current="page">Chapter 5</span>
        </nav>
        <header className="chapter-header">
          <div>
            <p className="section-kicker">Chapter 5 · Singular directions</p>
            <h1 className="course-title mt-4 max-w-5xl">
              Singular Value Decomposition
            </h1>
          </div>
          <div className="chapter-question">
            <span>One question</span>
            <p>
              Which directions keep the most structure when we use fewer
              dimensions?
            </p>
          </div>
        </header>

        <section className="py-12 sm:py-16" aria-labelledby="concepts-title">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">Lecture 5</p>
              <h2 id="concepts-title" className="section-title">
                From a best-fit line to a matrix factorization
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-muted-foreground">
              Chapter 4 gave us a way to project onto a chosen subspace. Here
              the data choose the subspace.
            </p>
          </div>
          <dl className="concept-ledger mt-8">
            {chapterFivePrimer.map(({ term, relation, definition }, index) => (
              <div key={term}>
                <dt>
                  <span>0{index + 1}</span>
                  {term}
                </dt>
                <dd>
                  <MathText>{relation}</MathText>
                  <p>{definition}</p>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="labs-title">
          <div className="section-heading-row is-compact">
            <div>
              <p className="section-kicker">Four guided labs</p>
              <h2 id="labs-title" className="section-title">
                Decompose, project, and check the computation
              </h2>
            </div>
          </div>
          <ol className="syllabus-list mt-8">
            {chapterFiveSections.map((section) => (
              <li key={section.slug}>
                <a
                  className="chapter-lab-row group"
                  href={sitePath(`/chapter-5/${section.slug}`)}
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
          aria-labelledby="chapter-notation-title"
        >
          <p className="section-kicker">Lecture notation and NumPy</p>
          <h2 id="chapter-notation-title" className="section-title mt-3">
            Keep rows, features, and retained directions separate
          </h2>
          <dl className="notation-ledger">
            <div>
              <dt>
                <MathText>{'$n,d,r,k$'}</MathText>
              </dt>
              <dd>
                {
                  '$n$ observations, $d$ features, $r$ positive singular values, and $k$ retained directions. The observation $a_i$ is a feature vector and row $i$ of $A$ is $a_i^{\\top}$.'
                }
              </dd>
            </div>
            <div>
              <dt>
                <MathText>{'$U,D,V$'}</MathText>
              </dt>
              <dd>
                {
                  'In the compact SVD their shapes are $n\\times r$, $r\\times r$, and $d\\times r$. The reduced NumPy call returns $\\min(n,d)$ slots and uses `s` for the diagonal entries and `Vt` for the right factor after transposition.'
                }
              </dd>
            </div>
            <div>
              <dt>
                <MathText>{'$D$ and $\\hat{\\Sigma}$'}</MathText>
              </dt>
              <dd>
                {
                  '$D$ holds the singular values. In the PCA part of the lecture, $\\hat{\\Sigma}$ is the sample covariance matrix, with units of squared feature values on its diagonal.'
                }
              </dd>
            </div>
          </dl>
        </section>

        <section className="lecture-reasoning" aria-labelledby="pca-title">
          <p className="section-kicker">PCA · Printed slides 61–66</p>
          <h2 id="pca-title" className="section-title mt-3">
            Center the data to fit a line through the mean
          </h2>
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
            <div className="space-y-4 text-base leading-7">
              <p>
                {
                  'Take the observations $(5,2)$, $(1,2)$, $(3,3)$, and $(3,1)$. Subtract the mean $\\bar{a}=(3,2)^{\\top}$ from each row before taking the SVD. The resulting centered matrix $A$ has squared singular values $8$ and $2$.'
                }
              </p>
              <p>
                {
                  'The first right singular direction is horizontal. Its four scores can be $2,-2,0,0$. The fitted line in the original coordinates is $\\bar{a}+\\operatorname{span}\\{v_1\\}$. The two off-line points project onto the mean.'
                }
              </p>
              <p className="reasoning-equation">
                <MathText>{'$\\hat{\\Sigma}=A^{\\top}A/(n-1)$'}</MathText>
              </p>
              <p>
                {
                  'The first component’s scores have sample variance $8/3$. This component explains $8/(8+2)=80\\%$ of the total sample variance. The factor $1/(n-1)$ converts squared singular values to variances and cancels in the fraction.'
                }
              </p>
            </div>
            <figure className="rounded-2xl border bg-card p-4 sm:p-6">
              <svg
                viewBox="0 0 300 148"
                className="mx-auto w-full max-w-sm"
                role="img"
                aria-labelledby="pca-figure-title"
              >
                <title id="pca-figure-title">
                  Two observations lie on the horizontal fit. The other two
                  project vertically onto the mean.
                </title>
                <path
                  d="M32 74H268"
                  className="stroke-primary"
                  strokeWidth="2"
                />
                <path
                  d="M150 31V117"
                  className="stroke-muted-foreground"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <g className="fill-primary">
                  <circle cx="64" cy="74" r="5" />
                  <circle cx="236" cy="74" r="5" />
                  <circle cx="150" cy="31" r="5" />
                  <circle cx="150" cy="117" r="5" />
                </g>
                <circle
                  cx="150"
                  cy="74"
                  r="6"
                  className="fill-card stroke-primary"
                  strokeWidth="2"
                />
              </svg>
              <figcaption className="text-sm leading-6 text-muted-foreground">
                The open circle marks the sample mean. The dashed segments show
                the two nonzero residuals.
              </figcaption>
            </figure>
          </div>
        </section>
        <aside className="source-note">
          <span>Lecture reference</span>
          <p>
            Wooseok Ha, MAS110 Lecture 5,{' '}
            <cite>Singular Value Decomposition (SVD)</cite>. Each lab cites the
            printed slide numbers and links to the companion notebook.
          </p>
        </aside>
      </main>
      <SiteFooter />
    </div>,
  );
}
