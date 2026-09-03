import type { ChapterSection } from './shared';
import { sourceLinks, toneCells } from './shared';

const filename = 'Ch2-3 Test LU-Decomposition.ipynb';
const links = sourceLinks(filename);

const source = {
  filename,
  url: links.githubUrl,
  note: 'Code order and saved summary follow the upstream notebook; random reruns will differ.',
};

export const luDecompositionSection: ChapterSection = {
  slug: 'lu-decomposition',
  number: '2.3',
  title: 'Testing LU Decomposition',
  shortTitle: 'Testing LU',
  summary:
    'Generate rank-limited 10×11 matrices, test pivoted LU ten times, and inspect reconstruction errors and ranks.',
  focus: 'rank-limited A → pivoted LU → repeated test',
  learningGoal:
    'Understand what each source function guarantees, what the assertions actually test, and why floating-point reconstruction uses a tolerance.',
  lectureConcepts: [
    'Rank of a product',
    'Rectangular LU',
    'Permutation matrix',
    'Numerical error',
  ],
  codeExtension: 'Functions, assertions, repeated trials, and histograms.',
  filename,
  ...links,
  primer: [
    {
      term: 'Rank-limited product',
      definition:
        'Multiplying a 10×7 matrix by a 7×11 matrix creates a 10×11 matrix with rank at most 7.',
      relation: 'rank(AB) ≤ 7',
      watchFor:
        'Random factors usually produce rank 7, but the algebraic guarantee is “at most 7.”',
    },
    {
      term: 'Rectangular LU',
      definition:
        'For this 10×11 input, SciPy returns square P and L plus a 10×11 upper factor U; the notebook then sets Q=P.T.',
      relation: 'Q A = L U',
      watchFor: 'The executed function is scipy.linalg.lu.',
    },
    {
      term: 'Residual norm',
      definition:
        'The norm compresses the difference between two reconstructed matrices into one nonnegative number.',
      relation: '‖QA − LU‖',
      watchFor:
        'Small rounding error is expected in floating-point arithmetic.',
    },
  ],
  walkthrough: {
    eyebrow: 'Lab 2.3 · Source trace',
    title: 'Read the original LU test as an experiment',
    objective:
      'The page follows the source function definitions, ten-trial loop, plot cell, and final print cell. No site-created 3×3 example is substituted.',
    source,
    initial: {
      title: 'Start before the experiment is defined',
      description:
        'The notebook will create low-rank matrices by multiplication, factor each one, and record whether the numerical claims pass.',
      equation: '(10×7)(7×11) → 10×11',
    },
    steps: [
      {
        sourceCell: 'Code cell 1',
        code: 'import numpy as np\nimport scipy as sp\nimport matplotlib as mpl\nimport matplotlib.pyplot as plt\nimport seaborn as sns',
        title: 'Load numerical and plotting libraries',
        explanation:
          'These are the source imports with comments and blank lines compacted.',
        drives: 'Aliases used by the function, test, and plot cells.',
        watchFor: 'SciPy provides lu; Seaborn draws the histograms.',
        after: {
          title: 'The experiment tools are ready',
          description: 'No random matrix has been generated yet.',
          equation: 'sp.linalg.lu · sns.histplot',
        },
      },
      {
        sourceCell: 'Code cell 2',
        code: '# create a random matrix of size m x n with the rank <= k <= min(m, n).\ndef create_random_matrix(m: int, n: int, k: int) -> np.ndarray:\n    if k > min(m, n):\n        raise ValueError("k must be less than or equal to min(n, m)")\n    A = np.random.randn(m, k)\n    B = np.random.randn(k, n)\n    return A@B',
        title: 'Define the rank-limited generator',
        explanation:
          'The function validates k, draws two compatible Gaussian matrices, and returns their product. Defining it does not run its body yet.',
        drives: 'A reusable function named create_random_matrix.',
        watchFor: 'A and B here are local variables inside the function.',
        variables: [
          {
            name: 'create_random_matrix',
            value: 'defined',
            meaning: 'Ready to be called by the test function.',
          },
        ],
        after: {
          title: 'The generator promises a narrow middle dimension',
          description:
            'The shared dimension k limits the rank of the returned product.',
          equation: 'A(m×k) @ B(k×n) → result(m×n)',
          matrices: [
            { label: 'shape flow', values: [['m×k', '@', 'k×n', '→', 'm×n']] },
          ],
        },
      },
      {
        sourceCell: 'Code cell 3',
        code: 'def test_lu_decomposition(m: int, n: int, k: int):\n    A = create_random_matrix(m, n, k)\n    P, L, U = sp.linalg.lu(A)\n    Q = P.T\n    error = np.linalg.norm(Q@A - L@U)\n    rank_l = np.linalg.matrix_rank(L)\n    rank_u = np.linalg.matrix_rank(U)\n    assert rank_u == k, f"Rank of U is not equal to {k} ({rank_u})"\n    assert error <= n * m * np.finfo(float).eps, f"Error is too large ({error})"\n    return A, Q, L, U, error',
        title: 'Define the test performed in every trial',
        explanation:
          'The function factors one random matrix, measures QA−LU, checks rank(U) and an absolute error threshold, then returns the factors.',
        drives:
          'A second function that turns mathematical claims into assertions.',
        watchFor:
          'rank_l is measured but never asserted; the saved L has rank 10, not 7.',
        variables: [
          {
            name: 'test_lu_decomposition',
            value: 'defined',
            meaning: 'Its body runs only when code cell 4 calls it.',
          },
          {
            name: 'threshold when m=10,n=11',
            value: '2.4425e−14',
            meaning: 'The source’s n·m·machine-epsilon bound.',
          },
        ],
        after: {
          title: 'The source test checks two precise claims',
          description:
            'It requires rank(U)=k and a small absolute reconstruction residual.',
          equation: 'rank(U)=k  and  ‖QA−LU‖ ≤ nmε',
          callout:
            'The notebook comment mentions rank(L)=k, but the executable assertion does not.',
        },
      },
      {
        sourceCell: 'Code cell 4',
        code: 'm=10\nn=11\nk=7\nn_repeats = 10\nerrors = []\nranks = []\nfor i in range(n_repeats):\n    A, Q, L, U, error = test_lu_decomposition(m, n, k)\n    errors.append(error)\n    ranks.append(np.linalg.matrix_rank(U))',
        title: 'Run the source test ten times',
        explanation:
          'Each iteration creates a new unseeded matrix. The lists keep one residual and one U rank per trial; A, Q, L, U, and error end with trial 10.',
        drives:
          'Ten error values, ten rank values, and the final trial’s factors.',
        watchFor:
          'The notebook does not set a seed, so a new Colab run will not reproduce the saved matrices.',
        variables: [
          {
            name: 'A.shape',
            value: '(10, 11)',
            meaning: 'The rectangular test matrix.',
          },
          {
            name: 'Q / L',
            value: '(10, 10)',
            meaning: 'Square permutation and lower factors.',
          },
          {
            name: 'U.shape',
            value: '(10, 11)',
            meaning: 'Rectangular upper factor.',
          },
          {
            name: 'len(errors)',
            value: '10',
            meaning: 'One residual per completed trial.',
          },
        ],
        after: {
          title: 'Ten independent LU tests have completed',
          description:
            'Every completed trial has already passed both source assertions.',
          matrices: [
            {
              label: 'trial records',
              values: [
                ['trial', 1, 2, 3, '…', 10],
                ['error', '✓', '✓', '✓', '…', '✓'],
                ['rank(U)', 7, 7, 7, '…', 7],
              ],
              rowDividerBefore: 1,
              cellTones: toneCells(
                [
                  [1, 1],
                  [1, 2],
                  [1, 3],
                  [1, 5],
                  [2, 1],
                  [2, 2],
                  [2, 3],
                  [2, 5],
                ],
                'result',
              ),
            },
          ],
          callout:
            'Only the final residual is printed as text later; the saved figure contains the ten-value distributions.',
        },
      },
      {
        sourceCell: 'Code cell 5',
        code: 'sns.set(style="whitegrid")\nfig, axs = plt.subplots(1, 2, figsize=(12, 5))\nsns.histplot(errors, kde=True, ax=axs[0])\naxs[0].set_title("LU Decomposition Errors")\naxs[0].set_xlabel("Error")\naxs[0].set_ylabel("Frequency")\naxs[0].set_xlim([0, np.max(errors) * 2.])\nsns.histplot(ranks, kde=True, ax=axs[1])\naxs[1].set_title("Ranks of U")\naxs[1].set_xlabel("Rank")\naxs[1].set_ylabel("Frequency")\naxs[1].set_xlim(0, np.max([n, m])+1)\nplt.tight_layout()\nplt.show()',
        title: 'Plot the two recorded distributions',
        explanation:
          'The left histogram shows floating-point reconstruction error; the right shows the U ranks collected by the loop.',
        drives: 'The source notebook’s saved 1×2 histogram figure.',
        watchFor:
          'kde=True is source code; a discrete rank plot would be a separate plotting choice.',
        after: {
          title: 'Error varies; rank stays at seven',
          description:
            'The saved rank histogram concentrates all ten completed trials at 7.',
          equation: 'errors → continuous scale · ranks → integer values',
          matrices: [
            {
              label: 'saved rank histogram summary',
              values: [
                ['rank', 7],
                ['frequency', 10],
              ],
              cellTones: toneCells([[1, 1]], 'result'),
            },
          ],
          callout:
            'Run the Colab cell to generate the actual plots from your own random trials.',
        },
      },
      {
        sourceCell: 'Code cell 6',
        code: `# print out the final LU decomposition result in a pretty format.
print("Original matrix A:")
print(np.array2string(A, precision=2, suppress_small=True))
print("\\nPermutation matrix Q:")
print(np.array2string(Q, precision=2, suppress_small=True))
print("\\nLower triangular matrix L:")
print(np.array2string(L, precision=2, suppress_small=True))
print("\\nUpper triangular matrix U:")
print(np.array2string(U, precision=2, suppress_small=True))
print(f"\\nLU decomposition error: {error:.3e}")
print(f"Rank of A: {np.linalg.matrix_rank(A)}")
print(f"Rank of L: {np.linalg.matrix_rank(L)}")
print(f"Rank of U: {np.linalg.matrix_rank(U)}")`,
        title: 'Inspect the final saved trial',
        explanation:
          'Because the loop overwrites these variables, the printed matrices and summary belong to trial 10 of the saved historical run.',
        drives: 'The final A, Q, L, U and four summary values.',
        watchFor:
          'The values will change when rerun, but the dimensions and intended relationships stay the same.',
        variables: [
          {
            name: 'error',
            value: '2.685e−15',
            meaning: 'Saved final-trial residual.',
          },
          { name: 'rank(A)', value: '7', meaning: 'Saved numerical rank.' },
          {
            name: 'rank(L)',
            value: '10',
            meaning: 'L is full-rank unit lower triangular.',
          },
          { name: 'rank(U)', value: '7', meaning: 'Rank loss appears in U.' },
        ],
        after: {
          title: 'The saved output supports the executed checks',
          description:
            'The residual is below the source threshold, U has rank 7, and L has rank 10.',
          equation: '2.685×10⁻¹⁵ < 2.4425×10⁻¹⁴',
          matrices: [
            {
              label: 'saved final summary',
              values: [
                ['quantity', 'value'],
                ['error', '2.685e−15'],
                ['rank(A)', 7],
                ['rank(L)', 10],
                ['rank(U)', 7],
              ],
              rowDividerBefore: 1,
              cellTones: toneCells(
                [
                  [1, 1],
                  [2, 1],
                  [3, 1],
                  [4, 1],
                ],
                'result',
              ),
            },
          ],
          callout:
            'The source uses an absolute nmε threshold; scale-aware applications may prefer a relative residual.',
        },
      },
    ],
  },
};
