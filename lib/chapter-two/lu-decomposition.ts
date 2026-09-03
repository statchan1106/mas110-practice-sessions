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
    'Construct a rank-controlled matrix, factor it with pivoting, measure the reconstruction error, and repeat the numerical experiment.',
  focus: 'rank bottleneck → A = PLU → residual test',
  filename,
  ...links,
  primer: [
    {
      term: 'Rank bottleneck',
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
      relation: 'rank(U) = k',
      watchFor:
        'L is 10×10 with unit diagonal and rank 10; it is not rank k in this experiment.',
    },
  ],
  walkthrough: {
    eyebrow: '2.3 · Guided experiment',
    title: 'Build, factor, and test a low-rank matrix',
    objective:
      'Separate the mathematical claim from the numerical evidence: first construct the rank bottleneck, then verify the factorization within floating-point tolerance.',
    initial: {
      title: 'Choose the outside dimensions and hidden width',
      description:
        'The notebook uses m=10 rows, n=11 columns, and an intermediate width k=7.',
      equation: '(m×k) @ (k×n) → (m×n)',
      callout: 'Prediction: which dimension limits the rank of the product?',
    },
    steps: [
      {
        code: 'def create_random_matrix(m: int, n: int, k: int):',
        title: 'Define the matrix generator',
        explanation:
          'The function accepts the desired outside shape m×n and an internal width k that controls the rank ceiling.',
        drives: 'A dimension diagram with k placed between m and n.',
        watchFor:
          'This line defines a function; it does not generate numbers yet.',
        variables: [
          { name: 'm', value: '10', meaning: 'Number of output rows.' },
          { name: 'n', value: '11', meaning: 'Number of output columns.' },
          { name: 'k', value: '7', meaning: 'Maximum information width.' },
        ],
        after: {
          title: 'The function promises an m×n result',
          description:
            'Its internal construction will route all columns through only k intermediate directions.',
          equation: '10×7  ·  7×11  →  10×11',
          matrices: [
            {
              label: 'left shape',
              values: [['10', '×', '7']],
              cellTones: toneCells([[0, 2]], 'source'),
            },
            {
              label: 'right shape',
              values: [['7', '×', '11']],
              cellTones: toneCells([[0, 0]], 'source'),
            },
          ],
        },
      },
      {
        code: 'if k > min(m, n): raise ValueError("k is too large")',
        title: 'Reject an impossible requested rank',
        explanation:
          'No m×n matrix can have rank larger than min(m,n), so the function checks k before allocating arrays.',
        drives: 'A validity gate comparing 7 with min(10,11)=10.',
        watchFor:
          'Passing this check makes k feasible, but does not prove the random product will have rank exactly k.',
        variables: [
          {
            name: '7 ≤ 10',
            value: 'True',
            meaning: 'The requested hidden width is valid.',
          },
        ],
        after: {
          title: 'The requested width is feasible',
          description:
            'The experiment proceeds because k does not exceed either outside dimension.',
          equation: 'k = 7 ≤ min(10,11) = 10',
          callout: 'A k of 12 would fail before any matrix was created.',
        },
      },
      {
        code: 'left = np.random.randn(m, k)',
        title: 'Generate the left random factor',
        explanation:
          'The source notebook names this function-local array A. The guide uses “left” so it cannot be confused with the final test matrix.',
        drives: 'A dense 10×7 matrix appears.',
        watchFor:
          'The original notebook sets no random seed, so values change on every run.',
        variables: [
          {
            name: 'left.shape',
            value: '(10, 7)',
            meaning: 'Maps seven internal coordinates to ten output rows.',
          },
        ],
        after: {
          title: 'The left factor spans at most seven directions',
          description:
            'A compact sample stands in for the larger unseeded random matrix.',
          equation: 'left ∈ ℝ¹⁰ˣ⁷',
          matrices: [
            {
              label: 'left (shape preview)',
              values: [
                ['•', '•', '•', '⋯'],
                ['•', '•', '•', '⋯'],
                ['⋮', '⋮', '⋮', ''],
              ],
              cellTones: toneBlock(0, 3, 0, 3, 'block-a'),
            },
          ],
        },
      },
      {
        code: 'right = np.random.randn(k, n)',
        title: 'Generate the compatible right factor',
        explanation:
          'Its seven rows match the seven columns of the left factor, so matrix multiplication is defined.',
        drives: 'A 7×11 factor appears beside the existing 10×7 factor.',
        watchFor: 'The shared dimension must match exactly.',
        variables: [
          {
            name: 'right.shape',
            value: '(7, 11)',
            meaning: 'Maps eleven inputs through seven internal coordinates.',
          },
        ],
        after: {
          title: 'The two random factors are multiplication-compatible',
          description:
            'The shared 7 will disappear from the outside shape but remain as the rank bottleneck.',
          equation: '(10×7) @ (7×11)',
          matrices: [
            {
              label: 'left',
              values: [['10', '×', '7']],
              cellTones: toneCells([[0, 2]], 'source'),
            },
            {
              label: 'right',
              values: [['7', '×', '11']],
              cellTones: toneCells([[0, 0]], 'source'),
            },
          ],
        },
      },
      {
        code: 'return left @ right',
        title: 'Create the rank-controlled product',
        explanation:
          'All information passes through a seven-dimensional middle space, so the product has rank at most seven.',
        drives:
          'The two factors merge into a 10×11 matrix with a visible rank ceiling.',
        watchFor:
          '“At most seven” is the theorem. Rank exactly seven is the typical random outcome checked later.',
        variables: [
          {
            name: 'product.shape',
            value: '(10, 11)',
            meaning: 'The outside dimensions remain.',
          },
          {
            name: 'rank ceiling',
            value: '≤ 7',
            meaning: 'The shared internal width.',
          },
        ],
        after: {
          title: 'A wide matrix passes through a seven-dimensional bottleneck',
          description:
            'The result has 110 entries but no more than seven independent rows or columns.',
          equation: 'rank(left @ right) ≤ min(rank(left), rank(right)) ≤ 7',
          matrices: [
            {
              label: 'returned product: 10×11',
              values: [
                ['•', '•', '•', '•', '⋯'],
                ['•', '•', '•', '•', '⋯'],
                ['•', '•', '•', '•', '⋯'],
                ['⋮', '⋮', '⋮', '⋮', ''],
              ],
              cellTones: toneBlock(0, 3, 0, 4, 'result'),
            },
          ],
        },
      },
      {
        code: 'A = create_random_matrix(m=10, n=11, k=7)',
        title: 'Bind the product as the test matrix',
        explanation:
          'The returned matrix becomes the outer variable A used by the LU experiment.',
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
            meaning: 'Typical full use of the seven-dimensional bottleneck.',
          },
        ],
        after: {
          title: 'The experiment now has a 10×11 matrix A',
          description:
            'Seven independent directions are embedded in a larger rectangular array.',
          equation: 'A ∈ ℝ¹⁰ˣ¹¹,  rank(A)=7 in the saved output',
          callout:
            'Because the source run is unseeded, a fresh Colab run will produce different entries.',
        },
      },
      {
        code: 'P, L, U = sp.linalg.lu(A)',
        title: 'Factor A with partial pivoting',
        explanation:
          'SciPy returns a 10×10 permutation P, a 10×10 unit-lower L, and a 10×11 upper-trapezoidal U.',
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
            'A small deterministic inset makes the shapes and triangular patterns visible before returning to the 10×11 experiment.',
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
        drives: 'Rows of the deterministic A physically reorder into Q @ A.',
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
        drives: 'A residual heatmap contracts into a tiny scalar error.',
        watchFor:
          'Tiny floating-point noise is normal; compare it with a scale-aware tolerance instead of demanding exact equality.',
        variables: [
          { name: 'error', value: '2.685e−15', meaning: 'Saved notebook run.' },
          {
            name: 'm*n*eps',
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
            'A rare rank-deficient random draw could fail the first assertion because the product theorem promises rank ≤ k, not equality.',
        },
      },
      {
        code: 'for trial in range(10): run_test()\nsns.histplot(errors)\nsns.histplot(ranks_u, discrete=True)',
        title: 'Repeat the experiment ten times',
        explanation:
          'Each unseeded run generates a new A, records one reconstruction error, and records the rank of U.',
        drives:
          'A ten-trial strip and distributions of tiny errors and integer ranks.',
        watchFor:
          'The matrices printed by the notebook belong only to the final trial; the plots summarize all ten.',
        variables: [
          {
            name: 'n_repeats',
            value: '10',
            meaning: 'Independent random experiments.',
          },
          {
            name: 'ranks_u',
            value: '[7, …, 7]',
            meaning: 'Discrete rank results, typically all seven.',
          },
        ],
        after: {
          title: 'Repeated evidence replaces a one-off result',
          description:
            'All ten dots should stay beneath the error threshold, while the rank counts remain concentrated at seven.',
          equation: '10 trials → {errorₜ, rank(Uₜ)} for t=1,…,10',
          matrices: [
            {
              label: 'trial strip',
              values: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
              cellTones: toneBlock(0, 1, 0, 10, 'result'),
            },
            {
              label: 'rank(U) frequency',
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
