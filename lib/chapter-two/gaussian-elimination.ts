import type { ChapterSection } from './shared';
import { sourceLinks, toneCells } from './shared';

const filename = 'Ch2-1 Gaussian Elimination.ipynb';
const links = sourceLinks(filename);

const source = {
  filename,
  url: links.githubUrl,
  note: 'Cells and saved values follow the upstream notebook on GitHub.',
};

export const gaussianEliminationSection: ChapterSection = {
  slug: 'gaussian-elimination',
  number: '2.1',
  title: 'Gaussian Elimination',
  shortTitle: 'Gaussian elimination',
  summary:
    'Run the original seeded 10×10 system through pivoted LU, LDU normalization, and triangular solves.',
  focus: 'Ax = b → LDUx = Qb → x',
  learningGoal:
    'Connect each line of the source notebook to the matrix or vector it changes, then verify the computed solution.',
  lectureConcepts: [
    'Ax = b',
    'Permutation matrix',
    'LDU decomposition',
    'Forward / back substitution',
  ],
  filename,
  ...links,
  primer: [
    {
      term: 'Pivoted LU',
      definition:
        'SciPy separates row order, elimination multipliers, and the upper-triangular result.',
      relation: 'A = PLU  ⇒  QA = LU',
      watchFor: 'Q=Pᵀ because a permutation matrix is orthogonal.',
    },
    {
      term: 'LDU',
      definition:
        'The notebook copies the raw U into V, moves its diagonal into d and D, then normalizes each row of U.',
      relation: 'QA = LDU',
      watchFor: 'd is a 1-D vector; D=np.diag(d) is the diagonal matrix.',
    },
    {
      term: 'Triangular solves',
      definition:
        'Forward substitution solves with L; diagonal scaling solves with D; back substitution solves with U.',
      relation: 'LDUx = Qb',
      watchFor: 'The solve itself never forms the inverse of A.',
    },
  ],
  walkthrough: {
    eyebrow: 'Lab 2.1 · Source trace',
    title: 'Follow the original notebook, line by line',
    objective:
      'The code, variable names, order, and displayed values below come from the upstream notebook. Large 10×10 outputs are summarized visually; open Colab for every printed entry.',
    source,
    initial: {
      title: 'Start before notebook cell 1',
      description:
        'No Python names or matrices exist yet. The notebook first loads its libraries, then creates a reproducible system.',
      equation: 'Goal: solve Ax = b',
    },
    steps: [
      {
        sourceCell: 'Code cells 1–2',
        code: '# numerical and scientific computing libraries\nimport numpy as np\nimport scipy as sp\n# plotting libraries\nimport matplotlib as mpl\nimport matplotlib.pyplot as plt\nimport seaborn as sns\n# for pretty printing\nnp.set_printoptions(4, linewidth=100, suppress=True)',
        title: 'Prepare the notebook',
        explanation:
          'The imports create short module names. The print option changes only how NumPy arrays appear, not their values.',
        drives: 'Library aliases and compact array printing.',
        watchFor: 'No matrix computation happens in these lines.',
        variables: [
          {
            name: 'np / sp',
            value: 'ready',
            meaning: 'NumPy arrays and SciPy linear algebra are available.',
          },
        ],
        after: {
          title: 'The notebook environment is ready',
          description:
            'Floating output uses precision 4, lines wrap at 100 characters, and tiny values print as zero.',
          equation: 'precision=4 · linewidth=100 · suppress=True',
        },
      },
      {
        sourceCell: 'Code cell 3',
        code: 'm = n = 10\nrng = np.random.RandomState(0)\nA = rng.randint(10, size=(m, n))\nb = rng.randint(10, size=m)\nprint("A =")\nprint(A)\nprint("b = ", b)',
        title: 'Create the exact 10×10 example',
        explanation:
          'A fixed random seed makes the integer matrix and right-hand side reproducible. This saved matrix is invertible, as assumed by the notebook.',
        drives: 'A 10×10 matrix A and a length-10 vector b.',
        watchFor:
          'Random integer matrices are not always invertible; this particular seeded draw is.',
        variables: [
          {
            name: 'A.shape',
            value: '(10, 10)',
            meaning: 'Ten equations and ten unknowns.',
          },
          {
            name: 'b.shape',
            value: '(10,)',
            meaning: 'One right-hand-side value per row.',
          },
        ],
        after: {
          title: 'The saved source inputs are fixed',
          description:
            'The first two rows are shown as an excerpt. The b row is the complete saved vector.',
          matrices: [
            {
              label: 'A · saved rows 1–2 of 10',
              values: [
                [5, 0, 3, 3, 7, 9, 3, 5, 2, 4],
                [7, 6, 8, 8, 1, 6, 7, 7, 8, 1],
              ],
            },
            {
              label: 'b · complete saved output',
              values: [[0, 3, 2, 0, 7, 5, 9, 0, 2, 7]],
            },
          ],
          callout: 'Open Colab to inspect all ten rows of A.',
        },
      },
      {
        sourceCell: 'Code cells 4–5',
        code: 'P, L, U = sp.linalg.lu(A)\nQ = P.T\nprint("Q =")\nprint(Q)\nprint()\nprint("L =")\nprint(L)\nprint()\nprint("U =")\nprint(U)\n# sanity check\nnp.allclose(Q@A, L@U)',
        title: 'Factor A and verify the convention',
        explanation:
          'SciPy returns A=P@L@U. Transposing P moves the permutation to the left, so the check compares Q@A with L@U.',
        drives:
          'Permutation Q, lower factor L, upper factor U, and a True check.',
        watchFor: 'This function belongs to scipy.linalg, not numpy.linalg.',
        variables: [
          {
            name: 'Q row order',
            value: '[5, 7, 3, 4, 6, 2, 8, 10, 9, 1]',
            meaning: 'One-based source row order after permutation.',
          },
          {
            name: 'np.allclose(Q@A, L@U)',
            value: 'True',
            meaning: 'The saved factors reconstruct the permuted matrix.',
          },
        ],
        after: {
          title: 'Pivoted LU passes its first check',
          description:
            'The diagonal below is taken from the saved raw U output and will become d in the next cell.',
          equation: 'A = PLU  ⇔  QA = LU',
          matrices: [
            {
              label: 'diag(U) · saved raw pivots',
              values: [
                [9, -7, 8.5714, -7.7056, 6.5213],
                [7.0469, 8.887, -5.0091, -5.6224, 1.2171],
              ],
              cellTones: toneCells(
                Array.from({ length: 10 }, (_, index) => [
                  Math.floor(index / 5),
                  index % 5,
                ]),
                'source',
              ),
            },
          ],
          callout:
            'Q changes row order; it does not change values inside a row.',
        },
      },
      {
        sourceCell: 'Code cells 6–7',
        code: '# for simplicity, let us assume that A is invertible.\nV = np.copy(U)\nd = np.zeros(m)\nfor i in range(m):\n    d[i] = V[i, i]\n    U[i, :] = V[i, :] / d[i]\nD = np.diag(d)\nprint("D =")\nprint(D)\nprint()\nprint("New U =")\nprint(U)\n# sanity check\nnp.allclose(Q @ A, L @ D @ U)',
        title: 'Move pivot scale from U into D',
        explanation:
          'V preserves the raw upper factor. The loop first stores pivot V[i,i] in the vector d, then divides the whole row by that pivot. D is built only after d is complete.',
        drives:
          'The vector d, diagonal matrix D, normalized U, and a True LDU check.',
        watchFor:
          'd is a vector. D is the matrix made from d. The code also overwrites U.',
        variables: [
          {
            name: 'd.shape',
            value: '(10,)',
            meaning: 'Ten saved pivot values.',
          },
          {
            name: 'D.shape',
            value: '(10, 10)',
            meaning: 'The same values placed on a diagonal.',
          },
          {
            name: 'diag(U)',
            value: '[1, …, 1]',
            meaning: 'Every row was normalized by its own pivot.',
          },
          {
            name: 'np.allclose(Q@A, L@D@U)',
            value: 'True',
            meaning: 'The LDU factors reconstruct Q@A.',
          },
        ],
        after: {
          title: 'One vector becomes a diagonal matrix',
          description:
            'The first four pivots are shown in D. The matching normalized U excerpt has ones on its diagonal.',
          equation: 'raw U = D · normalized U',
          matrices: [
            {
              label: 'd · 1-D vector',
              values: [[9, -7, 8.5714, -7.7056]],
              cellTones: toneCells(
                [
                  [0, 0],
                  [0, 1],
                  [0, 2],
                  [0, 3],
                ],
                'source',
              ),
            },
            {
              label: 'D · upper-left 4×4',
              values: [
                [9, 0, 0, 0],
                [0, -7, 0, 0],
                [0, 0, 8.5714, 0],
                [0, 0, 0, -7.7056],
              ],
              cellTones: toneCells(
                [
                  [0, 0],
                  [1, 1],
                  [2, 2],
                  [3, 3],
                ],
                'result',
              ),
            },
            {
              label: 'normalized U · upper-left 4×4',
              values: [
                [1, 1, 0, 0.4444],
                [0, 1, -0.1429, -0.4921],
                [0, 0, 1, 1.0204],
                [0, 0, 0, 1],
              ],
              cellTones: toneCells(
                [
                  [0, 0],
                  [1, 1],
                  [2, 2],
                  [3, 3],
                ],
                'result',
              ),
            },
          ],
          callout:
            'If you rerun cell 9 alone, U is already normalized. Rerun cell 6 first.',
        },
      },
      {
        sourceCell: 'Code cell 8',
        code: 'y = Q @ b',
        title: 'Apply the row permutation to b',
        explanation:
          'Q must reorder the right-hand side in exactly the same way that it reorders the rows of A.',
        drives: 'The length-10 vector y.',
        watchFor: 'The values move; they are not recomputed.',
        variables: [
          {
            name: 'y',
            value: '[7, 9, 2, 0, 5, 3, 0, 7, 2, 0]',
            meaning: 'b in elimination row order.',
          },
        ],
        after: {
          title: 'The equations and right-hand sides still match',
          description:
            'The computed y for the saved inputs follows Q’s row order.',
          equation: 'LDUx = Qb = y',
          matrices: [
            { label: 'b', values: [[0, 3, 2, 0, 7, 5, 9, 0, 2, 7]] },
            {
              label: 'y = Q @ b',
              values: [[7, 9, 2, 0, 5, 3, 0, 7, 2, 0]],
              cellTones: toneCells(
                Array.from({ length: 10 }, (_, index) => [0, index]),
                'result',
              ),
            },
          ],
        },
      },
      {
        sourceCell: 'Code cells 9–11',
        code: 'aug = np.hstack((L, y.reshape(-1, 1)))\nfor piv in range(m):\n    for i in range(piv+1, m):\n        aug[i, -1] = aug[i, -1] - aug[i, piv] * aug[piv, -1]\n        aug[i, piv] = 0\nL_inv_y = aug[:, -1]\n# sanity check 1 : is Gaussian elimination correctly done?\nprint(aug)\n# sanity check 2 : is L^(-1) y computed correctly?\nnp.allclose(L_inv_y, np.linalg.inv(L)@y)',
        title: 'Run forward substitution on L',
        explanation:
          'The nested loops clear entries below each pivot while updating the final column. The result column is stored as L_inv_y.',
        drives: 'An augmented [I | L_inv_y] matrix and a True verification.',
        watchFor:
          'The inverse appears only in the sanity check; the solve itself uses elimination.',
        variables: [
          {
            name: 'L_inv_y',
            value:
              '[7, 2.7778, −0.3016, −0.8722, 6.6381, 4.4667, −1.809, 4.4331, −2.0608, −6.3442]',
            meaning: 'The saved forward-solve result.',
          },
          {
            name: 'sanity check',
            value: 'True',
            meaning: 'It matches inv(L)@y numerically.',
          },
        ],
        after: {
          title: 'Forward substitution produces L⁻¹y',
          description:
            'The complete saved result is split across two short rows for legibility.',
          matrices: [
            {
              label: 'L_inv_y · entries 1–5',
              values: [[7, 2.7778, -0.3016, -0.8722, 6.6381]],
              cellTones: toneCells(
                [
                  [0, 0],
                  [0, 1],
                  [0, 2],
                  [0, 3],
                  [0, 4],
                ],
                'result',
              ),
            },
            {
              label: 'L_inv_y · entries 6–10',
              values: [[4.4667, -1.809, 4.4331, -2.0608, -6.3442]],
              cellTones: toneCells(
                [
                  [0, 0],
                  [0, 1],
                  [0, 2],
                  [0, 3],
                  [0, 4],
                ],
                'result',
              ),
            },
          ],
          callout:
            'Each zero below the diagonal and each changed RHS value come from the same row operation.',
        },
      },
      {
        sourceCell: 'Code cell 12',
        code: 'D_inv_L_inv_y = np.zeros(m)\nfor i in range(m):\n    D_inv_L_inv_y[i] = 1.0 / D[i, i] * L_inv_y[i]',
        title: 'Solve the diagonal system',
        explanation:
          'Because D is diagonal, entry i is solved independently by dividing L_inv_y[i] by D[i,i].',
        drives: 'The vector D_inv_L_inv_y.',
        watchFor: 'The correct notation is 1/D[i,i], or equivalently 1/d[i].',
        variables: [
          {
            name: 'D_inv_L_inv_y.shape',
            value: '(10,)',
            meaning: 'One scaled value per equation.',
          },
        ],
        after: {
          title: 'Ten independent divisions remove D',
          description:
            'There is no interaction between rows in a diagonal solve.',
          equation: '(D⁻¹L⁻¹y)ᵢ = (L⁻¹y)ᵢ / Dᵢᵢ',
          callout:
            'The notebook prose writes dᵢᵢ, but d is 1-D; Dᵢᵢ is the matrix notation.',
        },
      },
      {
        sourceCell: 'Code cell 13',
        code: "z = D_inv_L_inv_y\nx = np.zeros(n)\nfor i in range(n-1, -1, -1):\n    x[i] = (z[i] - sum(U[i, j] * x[j] for j in range(i+1, n))) / U[i, i]\nprint('x = ', x)",
        title: 'Back-substitute from the last row',
        explanation:
          'The descending loop ensures that every x[j] used on the right has already been solved.',
        drives: 'The source notebook’s length-10 solution x.',
        watchFor:
          'U[i,i] is one after normalization, but keeping the division makes the formula general.',
        variables: [
          {
            name: 'x',
            value:
              '[−6.2381, 4.187, −2.4684, −2.8606, 0.4127, 5.8132, −0.6281, 1.563, 3.4439, −5.2124]',
            meaning: 'The saved notebook solution.',
          },
        ],
        after: {
          title: 'All ten unknowns are solved',
          description: 'The loop fills x from entry 10 back to entry 1.',
          equation: 'i = 9, 8, …, 0',
          matrices: [
            {
              label: 'x · entries 1–5',
              values: [[-6.2381, 4.187, -2.4684, -2.8606, 0.4127]],
              cellTones: toneCells(
                [
                  [0, 0],
                  [0, 1],
                  [0, 2],
                  [0, 3],
                  [0, 4],
                ],
                'result',
              ),
            },
            {
              label: 'x · entries 6–10',
              values: [[5.8132, -0.6281, 1.563, 3.4439, -5.2124]],
              cellTones: toneCells(
                [
                  [0, 0],
                  [0, 1],
                  [0, 2],
                  [0, 3],
                  [0, 4],
                ],
                'result',
              ),
            },
          ],
        },
      },
      {
        sourceCell: 'Code cell 14',
        code: '# Final check\nprint("Ax = ", A @ x)\nprint()\nprint("b = ", b)',
        title: 'Compare Ax with b',
        explanation:
          'The source prints both vectors. With the notebook’s four-decimal display, the computed product matches b.',
        drives: 'Two matching length-10 rows.',
        watchFor:
          'Printing rounded values is visual evidence; np.allclose is a useful extra numerical check in Colab.',
        variables: [
          {
            name: 'Ax',
            value: '[0, 3, 2, 0, 7, 5, 9, 0, 2, 7]',
            meaning: 'The saved product A@x.',
          },
          {
            name: 'b',
            value: '[0, 3, 2, 0, 7, 5, 9, 0, 2, 7]',
            meaning: 'The original right-hand side.',
          },
        ],
        after: {
          title: 'The source output reproduces b',
          description: 'Every displayed entry agrees.',
          equation: 'Ax = b',
          matrices: [
            {
              label: 'A @ x',
              values: [[0, 3, 2, 0, 7, 5, 9, 0, 2, 7]],
              cellTones: toneCells(
                Array.from({ length: 10 }, (_, index) => [0, index]),
                'result',
              ),
            },
            { label: 'b', values: [[0, 3, 2, 0, 7, 5, 9, 0, 2, 7]] },
          ],
          callout:
            'Optional teaching check: np.allclose(A @ x, b) returns True.',
        },
      },
    ],
  },
};
