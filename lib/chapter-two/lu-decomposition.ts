import type { ChapterSection } from './shared';
import { sourceLinks, toneBlock, toneCells, toneRow } from './shared';

const filename = 'Ch2-3 Test LU-Decomposition.ipynb';
const links = sourceLinks(filename);

export const luDecompositionSection: ChapterSection = {
  slug: 'lu-decomposition',
  number: '2.3',
  title: 'Testing LU Decomposition',
  shortTitle: 'LU decomposition test',
  summary:
    'Create a test matrix, compute its pivoted LU factors, and check the lecture identity numerically.',
  focus: 'intermediate width → A = PLU → numerical check',
  learningGoal:
    'Create a test matrix, compute SciPy’s P, L, and U, and check numerically that the lecture identity QA = LU holds.',
  lectureConcepts: [
    'Matrix multiplication',
    'Permutation matrix',
    'LU decomposition',
    'Lower / upper triangular matrices',
  ],
  codeExtension:
    'Rank control, residuals, and repeated random trials are numerical extensions of the lecture’s LU identity.',
  filename,
  ...links,
  primer: [
    {
      term: 'Rank limit from product shape',
      definition:
        'If an m×k matrix multiplies a k×n matrix, the product can carry at most k independent directions.',
      relation: 'rank(AB) ≤ k',
      watchFor:
        'The construction guarantees rank at most k; random factors usually—but not logically always—reach k.',
    },
    {
      term: 'Pivoted LU',
      definition:
        'SciPy factors a matrix into a row permutation, a lower-triangular factor, and an upper-trapezoidal factor.',
      relation: 'A = P L U',
      watchFor: 'With Q=Pᵀ, the equivalent identity is QA=LU.',
    },
    {
      term: 'Residual',
      definition:
        'Subtracting the reconstructed matrix from the target matrix reveals numerical disagreement entry by entry.',
      relation: 'R = QA − LU',
      watchFor:
        'Floating-point residuals are expected to be tiny, not symbolically zero.',
    },
    {
      term: 'Numerical rank',
      definition:
        'Matrix rank is estimated from singular values relative to a tolerance determined by scale and precision.',
      relation: 'rank(A) = rank(U) ≤ k (exact arithmetic)',
      watchFor:
        'In the saved run, rank(A)=rank(U)=7; L has unit diagonal and rank 10.',
    },
  ],
  walkthrough: {
    eyebrow: 'Lab 2.3 · Code trace',
    title: 'Build, factor, and test a low-rank matrix',
    objective:
      'First build a matrix whose intermediate width limits its rank. Then check the LU identity within floating-point tolerance.',
    initial: {
      title: 'Choose the outside dimensions and hidden width',
      description:
        'The notebook uses m=10 rows, n=11 columns, and an intermediate width k=7.',
      equation: '(m×k) @ (k×n) → (m×n)',
      callout: 'Think first: which dimension limits the rank of the product?',
    },
    steps: [
      {
        code: 'def create_random_matrix(m: int, n: int, k: int):\n    if k > min(m, n): raise ValueError("k is too large")\n    left = np.random.randn(m, k)\n    right = np.random.randn(k, n)\n    return left @ right',
        lineNotes: [
          {
            action:
              'Defines the function and its three parameters; the body does not run yet.',
          },
          {
            action:
              'When called, rejects a hidden width larger than either outside dimension.',
          },
          {
            action: 'When called, draws the m×k left random factor.',
          },
          {
            action:
              'When called, draws the compatible k×n right random factor.',
          },
          {
            action:
              'When called, returns their m×n product, whose rank is at most k.',
          },
        ],
        title: 'Define the matrix generator',
        explanation:
          'This step stores a function. Its body will create two compatible random factors only when the function is called in the next step.',
        drives: 'A function definition and its promised dimension flow.',
        watchFor:
          'Definition is not execution: no random matrix or parameter value exists yet.',
        variables: [
          {
            name: 'create_random_matrix',
            value: 'function',
            meaning: 'Stored code waiting to be called.',
          },
        ],
        after: {
          title: 'The generator is defined, but has not run',
          description:
            'On a future call, information will pass through k intermediate directions before producing an m×n result.',
          equation: '(m×k) @ (k×n) → (m×n),  rank ≤ k',
          matrices: [
            {
              label: 'left shape',
              values: [['m', '×', 'k']],
              cellTones: toneCells([[0, 2]], 'source'),
            },
            {
              label: 'right shape',
              values: [['k', '×', 'n']],
              cellTones: toneCells([[0, 0]], 'source'),
            },
          ],
          callout:
            'The upper-bound check makes k feasible; it does not by itself prove that a particular product has rank exactly k.',
        },
      },
      {
        code: 'm, n, k = 10, 11, 7\nA = create_random_matrix(m, n, k)',
        lineNotes: [
          {
            action:
              'Stores the dimensions used by the generated matrix and the later tests.',
          },
          {
            action:
              'Calls the generator and stores the resulting 10×11 matrix as A.',
          },
        ],
        title: 'Set the dimensions and build A',
        explanation:
          'The dimensions are stored for later checks, and the returned product becomes the test matrix A.',
        drives:
          'The product receives its experiment label and measured numerical rank.',
        watchFor:
          'This A is different from the function-local A in the source notebook.',
        variables: [
          {
            name: 'A.shape',
            value: '(10, 11)',
            meaning: 'A rectangular test matrix.',
          },
          {
            name: 'rank(A)',
            value: '7 in saved run',
            meaning: 'The rank found in the saved notebook run.',
          },
        ],
        after: {
          title: 'The experiment now has a 10×11 matrix A',
          description:
            'Seven independent directions are embedded in a larger rectangular array.',
          equation: 'A ∈ ℝ^(10×11),  rank(A)=7 in the saved output',
          callout:
            'Because the source run is unseeded, a fresh Colab run will produce different entries.',
        },
      },
      {
        code: 'P, L, U = sp.linalg.lu(A)',
        title: 'Factor A with partial pivoting',
        explanation:
          'SciPy returns a 10×10 permutation P, a 10×10 unit-lower L, and a 10×11 upper-trapezoidal U. This U is SciPy’s raw upper factor; Lab 2.1 calls the corresponding matrix U_raw before normalizing its diagonal.',
        drives:
          'A splits into row order, elimination multipliers, and echelon structure.',
        watchFor: 'SciPy’s documented identity is A = P @ L @ U.',
        variables: [
          {
            name: 'L.shape',
            value: '(10, 10)',
            meaning: 'Square unit-lower factor.',
          },
          {
            name: 'U.shape',
            value: '(10, 11)',
            meaning: 'Rectangular upper factor.',
          },
        ],
        after: {
          title: 'LU stores the elimination process',
          description:
            'A small fixed example makes the shapes and triangular patterns visible before returning to the 10×11 experiment.',
          equation: 'A = P L U',
          matrices: [
            {
              label: 'P (inset)',
              values: [
                [0, 1, 0],
                [0, 0, 1],
                [1, 0, 0],
              ],
              cellTones: toneCells(
                [
                  [0, 1],
                  [1, 2],
                  [2, 0],
                ],
                'source',
              ),
            },
            {
              label: 'L (inset)',
              values: [
                [1, 0, 0],
                ['1/7', 1, 0],
                ['4/7', '1/2', 1],
              ],
              cellTones: toneCells(
                [
                  [1, 0],
                  [2, 0],
                  [2, 1],
                ],
                'block-a',
              ),
            },
            {
              label: 'U (inset)',
              values: [
                [7, 8, 10],
                [0, '6/7', '11/7'],
                [0, 0, '-1/2'],
              ],
              cellTones: toneCells(
                [
                  [0, 0],
                  [1, 1],
                  [2, 2],
                ],
                'block-b',
              ),
            },
          ],
        },
      },
      {
        code: 'Q = P.T',
        title: 'Move the permutation to the left side',
        explanation:
          'Permutation matrices are orthogonal, so P transpose equals P inverse. Multiplying A by Q yields the row order reconstructed by L @ U.',
        drives: 'Rows of the fixed example are reordered to form Q @ A.',
        watchFor:
          'A=LU only when no row swap is needed; with pivoting, use A=PLU or QA=LU.',
        variables: [{ name: 'Q @ P', value: 'I', meaning: 'Q reverses P.' }],
        after: {
          title: 'Q puts A in elimination order',
          description:
            'The row-reordered matrix and the product L @ U are now directly comparable.',
          equation: 'Q A = L U',
          matrices: [
            {
              label: 'A inset',
              values: [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 10],
              ],
              cellTones: toneRow(2, 3, 'source'),
            },
            {
              label: 'Q @ A',
              values: [
                [7, 8, 10],
                [1, 2, 3],
                [4, 5, 6],
              ],
              cellTones: toneRow(0, 3, 'result'),
            },
          ],
          callout:
            'The highlighted third row moves to the top, matching the first pivot row used by U.',
        },
      },
      {
        code: 'error = np.linalg.norm(Q @ A - L @ U)',
        title: 'Measure reconstruction error',
        explanation:
          'The two 10×11 matrices are subtracted entrywise, then the default matrix norm compresses the residual into one Frobenius magnitude.',
        drives:
          'The residual entries are compared, then summarized by one small norm.',
        watchFor:
          'Tiny floating-point noise is normal. This notebook uses mnε as a simple absolute threshold; other matrix scales may need a relative residual or np.allclose.',
        variables: [
          { name: 'error', value: '2.685e−15', meaning: 'Saved notebook run.' },
          {
            name: 'm*n*np.finfo(float).eps',
            value: '2.442e−14',
            meaning: 'Source notebook threshold.',
          },
        ],
        after: {
          title: 'The reconstruction is accurate within tolerance',
          description:
            'Every residual entry is near machine precision, and the total norm remains below the notebook’s threshold.',
          equation: '‖QA − LU‖F = 2.685×10⁻¹⁵ < 2.442×10⁻¹⁴',
          matrices: [
            {
              label: 'residual preview',
              values: [
                ['≈0', '≈0', '≈0'],
                ['≈0', '≈0', '≈0'],
                ['≈0', '≈0', '≈0'],
              ],
              cellTones: toneBlock(0, 3, 0, 3, 'result'),
            },
          ],
          callout:
            'Formatting tiny values as 0 or −0 is not proof of symbolic zero; the numerical norm is the relevant check.',
        },
      },
      {
        code: 'rank_a = np.linalg.matrix_rank(A)\nrank_l = np.linalg.matrix_rank(L)\nrank_u = np.linalg.matrix_rank(U)',
        lineNotes: [
          {
            action: 'Estimates the numerical rank of the generated matrix A.',
          },
          {
            action:
              'Estimates the numerical rank of the square unit-lower factor L.',
          },
          {
            action:
              'Estimates the numerical rank of the upper-trapezoidal factor U.',
          },
        ],
        title: 'Measure the ranks of the factors',
        explanation:
          'Numerical rank counts singular values large enough relative to a floating-point tolerance.',
        drives:
          'Three rank bars separate the low-rank signal from the full-rank triangular factor.',
        watchFor: 'L has unit diagonal, so its rank is 10—not 7.',
        variables: [
          {
            name: 'rank(A)',
            value: '7',
            meaning: 'Rank of the generated matrix in the saved run.',
          },
          {
            name: 'rank(L)',
            value: '10',
            meaning: 'Full rank because L has nonzero diagonal.',
          },
          {
            name: 'rank(U)',
            value: '7',
            meaning: 'U preserves the rank of A.',
          },
        ],
        after: {
          title: 'Rank loss lives in U, not L',
          description:
            'The invertible lower factor only stores elimination operations; the upper factor carries the seven-dimensional rank structure.',
          equation: 'rank(A)=7,  rank(L)=10,  rank(U)=7',
          matrices: [
            {
              label: 'rank comparison',
              values: [
                ['A', 7],
                ['L', 10],
                ['U', 7],
              ],
              cellTones: {
                ...toneCells(
                  [
                    [0, 1],
                    [2, 1],
                  ],
                  'result',
                ),
                ...toneCells([[1, 1]], 'source'),
              },
            },
          ],
        },
      },
      {
        code: 'assert rank_u == k\nassert error <= n * m * np.finfo(float).eps',
        lineNotes: [
          {
            action:
              'Stops the current trial unless U has the expected numerical rank k.',
          },
          {
            action:
              'Stops the current trial unless the absolute residual is below the notebook’s mnε threshold.',
          },
        ],
        title: 'Turn the claims into tests',
        explanation:
          'The assertions stop execution if U loses the expected rank or the factorization error exceeds the notebook’s tolerance.',
        drives: 'Two checks change from pending to passed.',
        watchFor: 'The test checks rank(U), not rank(L).',
        variables: [
          {
            name: 'rank preserved',
            value: 'PASS',
            meaning: 'rank(U) equals k in this trial.',
          },
          {
            name: 'accurate factorization',
            value: 'PASS',
            meaning: 'Residual norm is below threshold.',
          },
        ],
        after: {
          title: 'Both numerical claims pass',
          description:
            'The experiment has verified its intended rank outcome and LU reconstruction accuracy for this draw.',
          equation: '7 = 7  ✓     2.685e−15 ≤ 2.442e−14  ✓',
          callout:
            'The dimension bound guarantees only rank ≤ k. Independent Gaussian factors have rank k almost surely in exact arithmetic; numerical rank still depends on a tolerance.',
        },
      },
      {
        code: 'n_repeats = 10\nerrors, ranks = [], []\nfor trial in range(n_repeats):\n    A = create_random_matrix(m, n, k)\n    P, L, U = sp.linalg.lu(A)\n    errors.append(np.linalg.norm(P.T @ A - L @ U))\n    ranks.append(np.linalg.matrix_rank(U))\nfig, axes = plt.subplots(1, 2)\nsns.histplot(errors, ax=axes[0])\nsns.histplot(ranks, discrete=True, ax=axes[1])\nplt.tight_layout()',
        lineNotes: [
          { action: 'Sets the number of independent random trials.' },
          { action: 'Creates empty lists for residuals and ranks.' },
          { action: 'Repeats the experiment n_repeats times.' },
          { action: 'Generates a fresh 10×11 rank-limited matrix.' },
          { action: 'Computes its pivoted LU factors.' },
          {
            action: 'Stores the reconstruction residual for this trial.',
          },
          { action: 'Stores the numerical rank of U for this trial.' },
          { action: 'Creates two separate plotting axes side by side.' },
          { action: 'Plots the residual distribution on the left axis.' },
          { action: 'Plots the discrete rank counts on the right axis.' },
          { action: 'Adjusts spacing so the two plots do not overlap.' },
        ],
        title: 'Repeat the experiment and separate the plots',
        explanation:
          'Each unseeded run generates a new A, records one reconstruction error, and records the rank of U.',
        drives:
          'A ten-trial strip and distributions of tiny errors and integer ranks.',
        watchFor:
          'Each histogram has its own axis; otherwise the error and rank scales would be overlaid and unreadable.',
        variables: [
          {
            name: 'n_repeats',
            value: '10',
            meaning: 'Independent random experiments.',
          },
          {
            name: 'ranks',
            value: '[7, …, 7]',
            meaning: 'Saved notebook run: all ten ranks were seven.',
          },
        ],
        after: {
          title: 'Ten runs show the numerical pattern',
          description:
            'The error values should remain near machine precision, while the rank observations should concentrate at seven.',
          equation: '10 trials → {errorₜ, rank(Uₜ)} for t=1,…,10',
          matrices: [
            {
              label: 'trial strip',
              values: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
              cellTones: toneBlock(0, 1, 0, 10, 'result'),
            },
            {
              label: 'saved rank(U) frequency',
              values: [
                ['rank', 7],
                ['count', 10],
              ],
              cellTones: toneCells(
                [
                  [0, 1],
                  [1, 1],
                ],
                'source',
              ),
            },
          ],
          callout:
            'Open Colab to generate the real random matrices and compare your own distribution with the saved notebook output.',
        },
      },
    ],
  },
};
