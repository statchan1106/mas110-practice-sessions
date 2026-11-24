import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ChapterSevenExplorer } from '@/components/chapter-seven-explorer';
import { renderMathProse } from '@/components/math-prose';
import { MathText } from '@/components/math-text';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { courseGroups } from '@/lib/course-data';
import { sitePath } from '@/lib/site-path';

export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: 'Chapter 7 · Positive Definite Matrices · KAIST MAS110',
  description:
    'Follow Lecture 7 from quadratic forms and Cholesky factorization to minimax, Weyl’s inequalities, and Mahalanobis distance.',
};

const topics = [
  ['quadratic-forms', 'Positive definiteness'],
  ['factorizations', 'Cholesky and square roots'],
  ['rayleigh-quotient', 'Rayleigh quotient and minimax'],
  ['perturbation', 'Weyl and interlacing'],
  ['geometry', 'Ellipsoids and distance'],
];

const practiceNotebooks = courseGroups
  .find((group) => group.id === 'spectral-methods')
  ?.notebooks.filter(({ filename }) => filename.startsWith('Ch7-'));

function Formula({ children }: { children: string }) {
  return (
    <div className="max-w-full [&>.math-text]:px-1">
      <MathText tex={String.raw`\displaystyle ` + children}>{null}</MathText>
    </div>
  );
}

function Formulas({ children }: { children: ReactNode }) {
  return (
    <div className="reasoning-equation my-4 space-y-1 py-2">{children}</div>
  );
}

function Topic({
  id,
  title,
  slides,
  children,
}: {
  id: string;
  title: string;
  slides: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="lecture-reasoning scroll-mt-24 border-t pt-8"
      aria-labelledby={id + '-title'}
    >
      <p className="section-kicker">Printed slides {slides}</p>
      <h2 id={id + '-title'} className="section-title mt-3">
        {title}
      </h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export default function ChapterSevenHome() {
  return renderMathProse(
    <div className="min-h-screen">
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-8"
      >
        <nav className="course-breadcrumb" aria-label="Breadcrumb">
          <a href={sitePath('/#chapters')}>Practice sessions</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Chapter 7</span>
        </nav>
        <header className="chapter-header">
          <div>
            <p className="section-kicker">Chapter 7 · MAS110</p>
            <h1 className="course-title mt-4">Positive Definite Matrices</h1>
          </div>
          <div className="chapter-question">
            <span>Guiding question</span>
            <p>
              How does the sign of a quadratic form determine a matrix’s
              factorization and geometry?
            </p>
          </div>
        </header>
        <div className="mx-auto max-w-3xl">
          <nav className="mt-8" aria-label="On this page">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm leading-6">
              {topics.map(([id, title]) => (
                <li key={id}>
                  <a className="text-link" href={'#' + id}>
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <aside
            className="mt-8 rounded-2xl border bg-card p-4 sm:p-6"
            aria-labelledby="example-title"
          >
            <h2 id="example-title" className="text-lg font-semibold">
              A running example
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1">
              <Formula>{String.raw`A=\begin{pmatrix}5&4\\4&5\end{pmatrix}`}</Formula>
              <Formula>{String.raw`\lambda_1(A)=9,\qquad \lambda_2(A)=1`}</Formula>
            </div>
            <Formula>{String.raw`v_1=\tfrac{1}{\sqrt2}\binom{1}{1},\qquad v_2=\tfrac{1}{\sqrt2}\binom{1}{-1}`}</Formula>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {
                'This worked example accompanies the lecture. Multiplying $A$ by $(1,1)^\\top$ adds the two columns, while multiplying by $(1,-1)^\\top$ subtracts them. This gives $Av_1=9v_1$ and $Av_2=v_2$.'
              }
            </p>
          </aside>

          <Topic
            id="quadratic-forms"
            title="Three ways to recognize positive definiteness"
            slides="3–11"
          >
            <p>
              {
                'Covariance matrices are positive semidefinite. Symmetric positive definite matrices also define inner products through $\\langle x,y\\rangle_A=x^\\top Ay$.'
              }
            </p>
            <p>
              {
                'For $A\\in\\mathbb R^{d\\times d}$ the quadratic form is $x^\\top Ax$. This scalar equals its own transpose, so averaging it with $x^\\top A^\\top x$ gives the same value.'
              }
            </p>
            <Formulas>
              <Formula>{String.raw`x^\top Ax=x^\top\!\left(\tfrac12(A+A^\top)\right)x`}</Formula>
            </Formulas>
            <p>
              {
                'As in the lecture, take $A$ symmetric from here on. The spectral formulas write the matrix size as $n$ and use $|x|=\\sqrt{x^\\top x}$ for Euclidean length.'
              }
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>{'$A\\succeq 0$ means $x^\\top Ax\\ge0$ for every $x$.'}</li>
              <li>{'$A\\succ 0$ means $x^\\top Ax>0$ for every $x\\ne0$.'}</li>
            </ul>
            <h3 className="self-check-heading">
              From the quadratic form to a Gram factor
            </h3>
            <p>
              {
                'Write $A=V\\Lambda V^\\top$ with orthonormal eigenvectors $V=[v_1\\mid\\cdots\\mid v_n]$ and $\\Lambda=\\operatorname{diag}(\\lambda_1,\\ldots,\\lambda_n)$. The following three steps give the equivalences in Facts 7.1 and 7.2.'
              }
            </p>
            <ol className="list-decimal space-y-3 pl-6">
              <li>
                {
                  'Evaluate the form at $x=v_j$ to get $v_j^\\top Av_j=\\lambda_j$. Positivity of the form therefore gives the corresponding sign of each eigenvalue.'
                }
              </li>
              <li>
                {
                  'When each $\\lambda_i\\ge0$, let $D=\\operatorname{diag}(\\sqrt{\\lambda_1},\\ldots,\\sqrt{\\lambda_n})$ and $B=DV^\\top$. Then $D^2=\\Lambda$. If every $\\lambda_i>0$, both factors of $B$ are invertible.'
                }
              </li>
              <li>
                {
                  'If $A=B^\\top B$, then $x^\\top Ax=|Bx|^2\\ge0$. Invertibility of $B$ makes this squared length positive for every $x\\ne0$.'
                }
              </li>
            </ol>
            <Formulas>
              <Formula>{String.raw`B^\top B=(DV^\top)^\top(DV^\top)`}</Formula>
              <Formula>{String.raw`\phantom{B^\top B}=VD^2V^\top=A`}</Formula>
            </Formulas>
            <p>
              {
                'Both eigenvalues of the running example are positive, so $A\\succ0$. For any symmetric $A\\succ0$, $A^{-1}$ has the same eigenvectors and positive reciprocal eigenvalues, so $A^{-1}\\succ0$ as well.'
              }
            </p>
            <p>
              {
                'Testing $x=e_i$ shows that every diagonal entry must be positive. Testing vectors with zeros after coordinate $k$ shows that each leading $k\\times k$ block must be positive definite too.'
              }
            </p>
          </Topic>

          <Topic
            id="factorizations"
            title="Compute a Cholesky factor and a symmetric square root"
            slides="12–18"
          >
            <h3 className="self-check-heading">
              Cholesky from the rows of an upper triangular factor
            </h3>
            <p>
              {
                'For $A\\succ0$, write $A=B^\\top B$ and take $B=QR$ with $Q^\\top Q=I$ and $R$ upper triangular with a positive diagonal. Cancel $Q^\\top Q$ in the product to get $A=R^\\top R$.'
              }
            </p>
            <p>
              {
                'To compute $R$ directly, match the $(1,1)$, $(1,2)$, and $(2,2)$ entries of $R^\\top R$ with $a_{11}$, $a_{12}$, and $a_{22}$ in that order.'
              }
            </p>
            <Formulas>
              <Formula>{String.raw`r_{11}=\sqrt{a_{11}}=\sqrt5`}</Formula>
              <Formula>{String.raw`r_{12}=a_{12}/r_{11}=4/\sqrt5`}</Formula>
              <Formula>{String.raw`r_{22}=\sqrt{a_{22}-r_{12}^2}=3/\sqrt5`}</Formula>
              <Formula>{String.raw`R=\frac1{\sqrt5}\begin{pmatrix}5&4\\0&3\end{pmatrix}`}</Formula>
            </Formulas>
            <p>
              {
                'The same row pattern works in any size. When computing row $i$, subtract the contributions from rows $1,\\ldots,i-1$ before solving for the diagonal $r_{ii}$ and then for $r_{ij}$ with $j>i$.'
              }
            </p>
            <Formulas>
              <Formula>{String.raw`r_{ii}=\sqrt{a_{ii}-\sum_{h<i}r_{hi}^2}`}</Formula>
              <Formula>{String.raw`r_{ij}=\frac{a_{ij}-\sum_{h<i}r_{hi}r_{hj}}{r_{ii}}`}</Formula>
            </Formulas>
            <p>
              {
                'If $R$ and $S$ both satisfy the claimed factorization, rearranging $R^\\top R=S^\\top S$ gives $(S^{-1})^\\top R^\\top=SR^{-1}$. The left side is lower triangular and the right side upper triangular, so both are diagonal. Their $i$th diagonal entries are the positive reciprocal ratios $r_{ii}/s_{ii}$ and $s_{ii}/r_{ii}$. They must both equal $1$, which gives $SR^{-1}=I$ and $S=R$.'
              }
            </p>
            <h3 className="self-check-heading">
              The square root acts in the original eigenbasis
            </h3>
            <p>
              {
                'For $A\\succeq0$, the symmetric positive semidefinite square root is $A^{1/2}=VDV^\\top$. It preserves each $v_i$ and scales it by $\\sqrt{\\lambda_i}$. Squaring inserts $V^\\top V=I$ between the two copies of $D$.'
              }
            </p>
            <Formulas>
              <Formula>{String.raw`(VDV^\top)^2=VD^2V^\top=A`}</Formula>
              <Formula>{String.raw`A^{1/2}=3v_1v_1^\top+v_2v_2^\top`}</Formula>
              <Formula>{String.raw`\phantom{A^{1/2}}=\begin{pmatrix}2&1\\1&2\end{pmatrix}`}</Formula>
            </Formulas>
            <p>
              {
                'For uniqueness, diagonalize any symmetric $B\\succeq0$ with $B^2=A$. Squaring takes each eigenvalue $\\mu\\ge0$ of $B$ to $\\mu^2$ and preserves its eigenspace, since squaring is injective on $[0,\\infty)$. Thus $B$ acts by $\\sqrt\\lambda$ on the entire $\\lambda$-eigenspace of $A$.'
              }
            </p>
            <p>
              {
                'These two factors give different products with the same result. Cholesky uses $R^\\top R$ with triangular $R$. The symmetric square root uses $A^{1/2}A^{1/2}$.'
              }
            </p>
          </Topic>

          <Topic
            id="rayleigh-quotient"
            title="Read ordered eigenvalues as optimal values"
            slides="19–27"
          >
            <p>
              {
                'For symmetric $A$, order the eigenvalues $\\lambda_1(A)\\ge\\cdots\\ge\\lambda_n(A)$. As in Lemma 7.1, write $x=\\sum_i x_iv_i$ for $x\\ne0$. Here $x_i=v_i^\\top x$ are the eigenbasis coordinates. Orthonormality gives $x^\\top x=\\sum_i x_i^2$ and $x^\\top Ax=\\sum_i\\lambda_i(A)x_i^2$.'
              }
            </p>
            <Formulas>
              <Formula>{String.raw`R_A(x)=\frac{x^\top Ax}{x^\top x}`}</Formula>
              <Formula>{String.raw`\phantom{R_A(x)}=\frac{\sum_i\lambda_i(A)x_i^2}{\sum_i x_i^2}`}</Formula>
            </Formulas>
            <p>
              {
                'The weights $x_i^2/\\sum_j x_j^2$ sum to one. On $\\operatorname{span}\\{v_p,\\ldots,v_q\\}$, the quotient therefore lies in $[\\lambda_q(A),\\lambda_p(A)]$. Both endpoints are attained by eigenvectors. For the running example the weights average $9$ and $1$, so $R_A(v_1)=9$, $R_A(v_2)=1$, and $R_A(e_1)=5$.'
              }
            </p>
            <h3 className="self-check-heading">
              Why the subspace dimensions are complementary
            </h3>
            <p>
              {
                'For each $1\\le k\\le n$, the minimax principle gives two ways to recover $\\lambda_k(A)$.'
              }
            </p>
            <Formulas>
              <div className="flex flex-wrap items-baseline gap-x-4">
                <Formula>{String.raw`\lambda_k(A)=\max_{\dim W=k}\;\min_{0\ne x\in W}R_A(x)`}</Formula>
                <span className="text-sm text-muted-foreground">(7.1)</span>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-4">
                <Formula>{String.raw`\lambda_k(A)=\min_{\dim W=n-k+1}\;\max_{0\ne x\in W}R_A(x)`}</Formula>
                <span className="text-sm text-muted-foreground">(7.2)</span>
              </div>
            </Formulas>
            <p>
              {
                'For (7.1), any $k$-dimensional $W$ intersects $\\operatorname{span}\\{v_k,\\ldots,v_n\\}$ in a nonzero vector because their dimensions add to $n+1$. On that vector $R_A(x)\\le\\lambda_k(A)$. Thus every such $W$ has minimum at most $\\lambda_k(A)$. The span of $v_1,\\ldots,v_k$ attains the bound with its minimum at $v_k$.'
              }
            </p>
            <p>
              {
                'For (7.2), any $(n-k+1)$-dimensional $W$ intersects $\\operatorname{span}\\{v_1,\\ldots,v_k\\}$ in a nonzero vector. Its maximum is therefore at least $\\lambda_k(A)$. The span of $v_k,\\ldots,v_n$ attains that value with its maximum at $v_k$.'
              }
            </p>
            <p>
              {
                'On unit vectors, the quotient of $A^\\top A$ is $|Ax|^2$. Taking the largest eigenvalue therefore gives the spectral norm $\\|A\\|_2=\\sqrt{\\lambda_1(A^\\top A)}$.'
              }
            </p>
          </Topic>

          <Topic
            id="perturbation"
            title="Bound the spectrum after a matrix update"
            slides="28–34"
          >
            <h3 className="self-check-heading">
              Weyl’s inequality from a shared subspace
            </h3>
            <p>
              {
                'For symmetric $n\\times n$ matrices $A,B$ and integers $k,\\ell\\ge0$ with $k+\\ell+1\\le n$, Weyl’s bound is'
              }
            </p>
            <Formulas>
              <Formula>{String.raw`\lambda_{k+\ell+1}(A+B)`}</Formula>
              <Formula>{String.raw`\qquad\le \lambda_{k+1}(A)+\lambda_{\ell+1}(B)`}</Formula>
            </Formulas>
            <p>
              {
                'To derive it, take the span of the last $n-k$ eigenvectors of $A$ and the span of the last $n-\\ell$ eigenvectors of $B$. The intersection has dimension at least $n-k-\\ell$. On it, $R_{A+B}=R_A+R_B$ is bounded above by the right side. Choose a subspace of dimension $n-k-\\ell$ inside that intersection and apply (7.2) at index $k+\\ell+1$.'
              }
            </p>
            <p>
              {
                'For rectangular $m\\times n$ matrices use the symmetric block matrix $s(A)$ below. Its nonzero eigenvalues are the pairs $\\pm\\sigma_i(A)$. Its zero eigenvalues fill any remaining slots among the first $\\min(m,n)$ eigenvalues, so $\\sigma_i(A)=\\lambda_i(s(A))$ on that index range.'
              }
            </p>
            <Formulas>
              <Formula>{String.raw`s(A)=\begin{pmatrix}0&A\\A^\top&0\end{pmatrix}`}</Formula>
              <Formula>{String.raw`\sigma_{k+\ell+1}(A+B)`}</Formula>
              <Formula>{String.raw`\qquad\le \sigma_{k+1}(A)+\sigma_{\ell+1}(B)`}</Formula>
            </Formulas>
            <p>
              {
                'The singular-value bound follows from $s(A+B)=s(A)+s(B)$ for $k+\\ell+1\\le\\min(m,n)$. Apply it to $A=B+(A-B)$ with indices $k-1,0$ to obtain $\\sigma_k(A)\\le\\sigma_k(B)+\\sigma_1(A-B)$. Swap $A$ and $B$ to bound the difference in the other direction.'
              }
            </p>
            <Formulas>
              <Formula>{String.raw`\left|\sigma_k(A)-\sigma_k(B)\right|\le \|A-B\|_2`}</Formula>
            </Formulas>
            <h3 className="self-check-heading">
              A rank-one update interlaces the eigenvalues
            </h3>
            <p>
              {
                'For symmetric $B$, sandwich $R_{A+B}(x)$ between $R_A(x)+\\lambda_n(B)$ and $R_A(x)+\\lambda_1(B)$. Applying (7.1) gives the same bounds on $\\lambda_k(A+B)$ with $R_A(x)$ replaced by $\\lambda_k(A)$. In particular, every ordered eigenvalue increases weakly when $B\\succeq0$ and strictly when $B\\succ0$.'
              }
            </p>
            <p>
              {
                'Now set $B=qq^\\top$ for $q\\ne0$. Since $x^\\top Bx=(q^\\top x)^2$, the two Rayleigh quotients agree on $q^\\perp$. For $1\\le k<n$, intersect $q^\\perp$ with $\\operatorname{span}\\{v_k,\\ldots,v_n\\}$ and take an $(n-k)$-dimensional subspace of that intersection. Its maximum quotient for $A+B$ is at most $\\lambda_k(A)$, so (7.2) gives $\\lambda_{k+1}(A+B)\\le\\lambda_k(A)$. Nonnegativity of $B$ gives the other bound. Applying the same result with $A-B$ in place of $A$ gives the second line.'
              }
            </p>
            <Formulas>
              <Formula>{String.raw`\lambda_{k+1}(A+B)\le\lambda_k(A)\le\lambda_k(A+B)`}</Formula>
              <Formula>{String.raw`\lambda_{k+1}(A)\le\lambda_k(A-B)\le\lambda_k(A)`}</Formula>
            </Formulas>
            <p>
              {
                'For the example, take $q=e_1$ so only $a_{11}$ changes from $5$ to $6$. The new eigenvalues are $(11\\pm\\sqrt{65})/2$, approximately $9.53$ and $1.47$. In descending order, the new largest comes first, then the old largest ($9$), the new smallest, and the old smallest ($1$).'
              }
            </p>
          </Topic>

          <Topic
            id="geometry"
            title="Turn the inverse quadratic form into a distance"
            slides="35–38"
          >
            <p>
              {
                'For $A\\succ0$, the lecture defines the centered ellipsoid $\\mathcal E$ by $x^\\top A^{-1}x\\le1$. Write $x=\\sum_i y_iv_i$ with $y_i=\\langle x,v_i\\rangle$. Inversion sends $\\lambda_i(A)$ to its reciprocal, so the same orthonormal eigenbasis gives'
              }
            </p>
            <Formulas>
              <Formula>{String.raw`A^{-1}=\sum_{i=1}^n\lambda_i(A)^{-1}v_iv_i^\top`}</Formula>
              <Formula>{String.raw`x^\top A^{-1}x=\sum_{i=1}^n\frac{y_i^2}{\lambda_i(A)}`}</Formula>
            </Formulas>
            <p>
              {
                'This is equation (7.4) on the region where the sum is at most $1$. On the $v_i$ axis the boundary occurs at $y_i=\\pm\\sqrt{\\lambda_i(A)}$, so the full axis length is $2\\sqrt{\\lambda_i(A)}$. Each stretch of the unit ball $B_n$ contributes one factor of $\\sqrt{\\lambda_i(A)}$ to the volume in (7.5).'
              }
            </p>
            <Formulas>
              <Formula>{String.raw`\operatorname{vol}(\mathcal E)=\left(\prod_{i=1}^n\sqrt{\lambda_i(A)}\right)\operatorname{vol}(B_n)`}</Formula>
            </Formulas>
            <p>
              {
                'The running example has $y_1^2/9+y_2^2\\le1$. Its axis lengths are $6$ and $2$ and its area is $3\\pi$. Since $A^{-1}\\succ0$, the function $f(x)=\\sqrt{x^\\top A^{-1}x}$ is a norm. Apply it to $x-y$ to get the Mahalanobis distance.'
              }
            </p>
            <Formulas>
              <Formula>{String.raw`d_A(x,y)=\sqrt{(x-y)^\top A^{-1}(x-y)}`}</Formula>
              <Formula>{String.raw`\mathcal E=\{x:d_A(x,0)\le1\}`}</Formula>
            </Formulas>
            <p>
              {
                'In the example $3v_1$ and $v_2$ have different Euclidean lengths, yet $d_A(3v_1,0)=d_A(v_2,0)=1$. Each lies one Mahalanobis unit from the center, along a different principal axis.'
              }
            </p>
          </Topic>

          <ChapterSevenExplorer />

          <section
            className="lecture-reasoning lecture-self-checks"
            aria-labelledby="checks-title"
          >
            <h2 id="checks-title" className="section-title">
              Check your understanding
            </h2>
            <details>
              <summary>
                {
                  'What happens to $A\\succ0$ if the second eigenvalue becomes zero?'
                }
              </summary>
              <p>
                {
                  'The matrix becomes positive semidefinite because the quadratic form vanishes on $v_2$. Its symmetric square root still exists, and $A^{-1}$ is undefined.'
                }
              </p>
            </details>
            <details>
              <summary>
                {
                  'Why does a rank-one update leave the quadratic form unchanged on $q^\\perp$?'
                }
              </summary>
              <p>
                {
                  'Every $x\\in q^\\perp$ satisfies $q^\\top x=0$, so $x^\\top qq^\\top x=(q^\\top x)^2=0$.'
                }
              </p>
            </details>
            <details>
              <summary>
                {
                  'Which formula gives the distance from $x=v_1+v_2$ to the origin?'
                }
              </summary>
              <p>
                {
                  'In the example, $y_1=y_2=1$, so $d_A(x,0)=\\sqrt{1/9+1}=\\sqrt{10}/3$.'
                }
              </p>
            </details>
          </section>

          <section className="border-t pt-6" aria-labelledby="practice-title">
            <h2 id="practice-title" className="text-lg font-semibold">
              Practice notebooks
            </h2>
            <ul className="mt-3 space-y-3">
              {practiceNotebooks?.map(({ title, githubUrl, colabUrl }) => (
                <li
                  key={title}
                  className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm"
                >
                  <strong>{title}</strong>
                  <a
                    className="text-link"
                    href={githubUrl}
                    aria-label={title + ' on GitHub'}
                  >
                    GitHub
                  </a>
                  <a
                    className="text-link"
                    href={colabUrl}
                    aria-label={title + ' in Google Colab'}
                  >
                    Colab
                  </a>
                </li>
              ))}
            </ul>
          </section>
          <aside className="source-note">
            <span>Lecture reference</span>
            <p>
              Wooseok Ha, KAIST MAS110 Lecture 7,{' '}
              <cite>Positive Definite Matrices</cite>, Fall 2026. Slide
              references use the printed slide numbers. The lecture follows Kang
              and Cho, Sections 7.1–7.5.
            </p>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>,
  );
}
