import type { ChapterSection } from './shared';
import { sourceLinks, toneCells, toneRow } from './shared';

const filename = 'Ch2-4 Gaussian elimination in detail (Optional).ipynb';
const links = sourceLinks(filename);

const source = {
  filename,
  url: links.githubUrl,
  note: 'Executable source lines remain in order; long comments are compacted and one correction is labeled.',
};

export const gaussianDetailSection: ChapterSection = {
  slug: 'gaussian-detail',
  number: '2.4',
  title: 'Gaussian Elimination in Detail',
  shortTitle: 'Elimination in detail',
  summary:
    'Expose the pivot search, row swaps, elimination matrices, ten saved states, and LU reconstruction for the same seeded 10×10 A used in Lab 2.1.',
  focus: 'pivot search → row swap → elimination → reconstruction',
  learningGoal:
    'Connect every part of the source elimination function to the matrix change it creates, while recognizing the source code’s stated scope and corrected general form.',
  lectureConcepts: [
    'Partial pivoting',
    'Elementary matrices',
    'Gaussian elimination',
    'LU reconstruction',
  ],
  codeExtension: 'Explicit loops illustrate the elimination behind pivoted LU.',
  filename,
  ...links,
  optional: true,
  primer: [
    {
      term: 'Partial pivoting',
      definition:
        'Search the active column and move the largest absolute candidate into the pivot row.',
      relation: 'pivot = arg max |Aᵢⱼ|',
      watchFor: 'The source implements the search with an explicit loop.',
    },
    {
      term: 'Permutation matrix',
      definition: 'Each Q records one row exchange.',
      relation: 'QⱼA = row-swapped A',
      watchFor:
        'The same row exchange must be reflected during factor reconstruction.',
    },
    {
      term: 'Elimination matrix',
      definition:
        'Each L in L_list records negative multipliers that create zeros below a pivot.',
      relation: 'LⱼQⱼAⱼ → Aⱼ₊₁',
      watchFor: 'The notebook later combines these matrices as Lprime.',
    },
  ],
  walkthrough: {
    eyebrow: 'Lab 2.4 · Source trace · Optional',
    title: 'Open the elimination function',
    objective:
      'The source function is split into readable sections without renaming its variables. Comments are compacted; executable lines remain in notebook order.',
    source,
    initial: {
      title: 'Continue from the same seeded matrix as Lab 2.1',
      description:
        'The optional notebook recreates the identical 10×10 A, converts it to floating point, and then exposes every elimination step.',
      equation: 'same RandomState(0) → same A',
    },
    steps: [
      {
        sourceCell: 'Code cells 1–2',
        code: 'import numpy as np\nimport scipy as sp\nimport matplotlib as mpl\nimport matplotlib.pyplot as plt\nimport seaborn as sns\nnp.set_printoptions(4, linewidth=100, suppress=True)',
        title: 'Prepare the notebook',
        explanation:
          'These are the source imports and display settings with comments and blank lines compacted.',
        drives: 'Numerical aliases and compact printed arrays.',
        watchFor: 'Only NumPy and SciPy are used in the elimination cells.',
        after: {
          title: 'The source environment is ready',
          description: 'The 10×10 input is created next.',
          equation: 'np → arrays · sp → comparison LU',
        },
      },
      {
        sourceCell: 'Code cell 3',
        code: 'n = m = 10\nrng = np.random.RandomState(0)\nA = rng.randint(10, size=(n, m))\nA = A.astype(np.float64)\nprint(A)',
        title: 'Recreate the source matrix as floats',
        explanation:
          'The fixed seed reproduces Lab 2.1’s A. astype changes the data type so row operations can store fractional values.',
        drives: 'A 10×10 float matrix.',
        watchFor: 'The entries are unchanged; only their storage type changes.',
        variables: [
          {
            name: 'A.shape',
            value: '(10, 10)',
            meaning: 'The same square example as the source Ch2-1 notebook.',
          },
          {
            name: 'A.dtype',
            value: 'float64',
            meaning: 'Supports fractional elimination results.',
          },
        ],
        after: {
          title: 'A is ready for in-place row arithmetic',
          description: 'The first two source rows are shown.',
          matrices: [
            {
              label: 'A · saved rows 1–2',
              values: [
                [5, 0, 3, 3, 7, 9, 3, 5, 2, 4],
                [7, 6, 8, 8, 1, 6, 7, 7, 8, 1],
              ],
            },
          ],
        },
      },
      {
        sourceCell: 'Code cell 4 · setup',
        code: 'def elimination(A, eps, verbose):\n    A = A.copy()\n    n, m = A.shape\n    Q_list = []\n    L_list = []\n    row_to_check = 0',
        title: 'Initialize the elimination state',
        explanation:
          'The function protects the caller’s A, records its dimensions, creates two empty operation lists, and starts with pivot row 0.',
        drives: 'A working copy, two lists, and a row cursor.',
        watchFor:
          'A.copy() prevents the original matrix outside the function from changing.',
        variables: [
          {
            name: 'Q_list / L_list',
            value: '[] / []',
            meaning: 'No row operations have been recorded yet.',
          },
          {
            name: 'row_to_check',
            value: '0',
            meaning: 'The next pivot belongs in the first row.',
          },
        ],
        after: {
          title: 'The function has data and a cursor',
          description: 'The scan begins at column 0 and active row 0.',
          equation: 'j=0 · row_to_check=0',
        },
      },
      {
        sourceCell: 'Code cell 4 · pivot search',
        code: '    for j in range(m):\n        if row_to_check >= n :\n            break\n        pivot = row_to_check\n        for i in range(row_to_check+1, n):\n            if abs(A[i, j]) > abs(A[pivot, j]) :\n                pivot = i',
        title: 'Find the largest active-column entry',
        explanation:
          'For each column, the inner loop compares absolute values from the active row downward and keeps the best row index.',
        drives: 'The source pivot index for the current column.',
        watchFor: 'In column 0, row index 4 wins with value 9.',
        variables: [
          {
            name: 'j / row_to_check',
            value: '0 / 0',
            meaning: 'First source iteration.',
          },
          {
            name: 'pivot',
            value: '4',
            meaning: 'Zero-based row index of the largest candidate.',
          },
        ],
        after: {
          title: 'Source row 5 wins the first pivot search',
          description:
            'The complete first-column candidates are highlighted by role.',
          matrices: [
            {
              label: 'A[:, 0] · first pivot column',
              values: [[5], [7], [5], [2], [9], [0], [8], [0], [4], [5]],
              cellTones: {
                ...toneCells([[0, 0]], 'target'),
                ...toneCells([[4, 0]], 'source'),
              },
            },
          ],
        },
      },
      {
        sourceCell: 'Code cell 4 · row swap',
        code: '        A[[row_to_check, pivot], :] = A[[pivot, row_to_check], :]\n        r = row_to_check\n        Q = np.eye(n)\n        Q[r, r] = 0.\n        Q[pivot, pivot] = 0.\n        Q[r, pivot] = 1.\n        Q[pivot, r] = 1.\n        Q_list.append(Q.copy())\n        L = np.eye(n)',
        title: 'Swap rows and record Q',
        explanation:
          'Advanced indexing exchanges the two rows. Four assignments turn identity into the matching permutation matrix; a fresh identity L will record eliminations.',
        drives: 'A swapped working matrix, one Q in Q_list, and identity L.',
        watchFor:
          'Q is copied before a later iteration reuses the variable name.',
        variables: [
          {
            name: 'r / pivot',
            value: '0 / 4',
            meaning: 'Destination and source row in the first iteration.',
          },
          {
            name: 'len(Q_list)',
            value: '1',
            meaning: 'One row permutation has been stored.',
          },
        ],
        after: {
          title: 'The row beginning with 9 moves to the top',
          description: 'No entry inside either row changes during the swap.',
          matrices: [
            {
              label: 'A · rows at positions 0 and 4 after swap',
              values: [
                [9, 9, 0, 4, 7, 3, 2, 7, 2, 0],
                [5, 0, 3, 3, 7, 9, 3, 5, 2, 4],
              ],
              cellTones: toneRow(0, 10, 'result'),
            },
          ],
        },
      },
      {
        sourceCell: 'Code cell 4 · source elimination',
        code: '        if abs(A[r, j]) < eps :\n            pass\n        else :\n            for k in range(r+1, n):\n                u = A[k, j] / A[r, j]\n                A[k, j:] -= u * A[j, j:]\n                L[k, j] = -u\n            row_to_check += 1',
        title: 'Create zeros below the pivot',
        explanation:
          'For the saved full-rank 10×10 run, r equals j in every step. The source line therefore subtracts the active pivot row and produces the saved U correctly.',
        drives: 'Zeros below the active pivot and negative multipliers in L.',
        watchFor:
          'If an earlier column were skipped, r could differ from j; the source indices would then be too specific.',
        variables: [
          {
            name: 'first u for original row 2 (index 1)',
            value: '7/9',
            meaning: 'Multiplier used to clear its first entry.',
          },
          {
            name: 'row_to_check',
            value: '1',
            meaning: 'Moves down after a usable pivot.',
          },
        ],
        after: {
          title: 'The first saved elimination creates column zeros',
          description: 'This is a direct excerpt from “After step 1.”',
          equation: 'row₂ ← row₂ − (7/9)row₁',
          matrices: [
            {
              label: 'saved rows 1–2 after step 1',
              values: [
                [9, 9, 0, 4, 7, 3, 2, 7, 2, 0],
                [0, -1, 8, 4.8889, -4.4444, 3.6667, 5.4444, 1.5556, 6.4444, 1],
              ],
              cellTones: {
                ...toneCells([[0, 0]], 'source'),
                ...toneCells([[1, 0]], 'result'),
              },
            },
          ],
        },
      },
      {
        sourceCell: 'Corrected general form · code cell 4',
        sourceKind: 'correction',
        code: '                A[k, j:] -= u * A[r, j:]\n                L[k, r] = -u',
        title: 'Use r when a prior column may be skipped',
        explanation:
          'This teaching correction uses the active pivot row r and its position in L. It is identical to the source on the saved run because r=j there.',
        drives:
          'The correct elimination update when active row r differs from column j.',
        watchFor:
          'This snippet is not a verbatim source line; it is the corrected general form.',
        after: {
          title: 'The distinction matters only when r ≠ j',
          description:
            'With an all-zero first column, the source leaves the next pivot-column entry nonzero; the corrected row clears it.',
          equation: 'source uses row j · correction uses active pivot row r',
          matrices: [
            {
              label: 'pivot row r=0',
              values: [[0, 4, 1]],
              cellTones: toneCells([[0, 1]], 'source'),
            },
            {
              label: 'target before · u=2/4',
              values: [[0, 2, 1]],
              cellTones: toneCells([[0, 1]], 'target'),
            },
            {
              label: 'source result when r=0, j=1',
              values: [[0, 1, 0.5]],
              cellTones: toneCells([[0, 1]], 'target'),
            },
            {
              label: 'corrected target row',
              values: [[0, 0, 0.5]],
              cellTones: toneCells([[0, 1]], 'result'),
            },
          ],
          callout:
            'For the notebook’s saved matrix, no column is skipped and both lines give the same values.',
        },
      },
      {
        sourceCell: 'Code cells 4–5 · finish and run',
        code: '        L_list.append(L.copy())\n        if verbose :\n            print("After step", j+1, ":")\n            print(A)\n            print()\n    return A, Q_list, L_list\nU, Q_list, L_list = elimination(A, eps=1e-12, verbose=True)',
        title: 'Store every operation and print ten states',
        explanation:
          'Each column iteration appends L and optionally prints the working matrix. The source call runs with verbose=True and returns the final U plus both lists.',
        drives: 'Ten saved “After step” matrices, U, Q_list, and L_list.',
        watchFor:
          'The source notebook prints complete 10×10 matrices for steps 1 through 10.',
        variables: [
          {
            name: 'len(Q_list)',
            value: '10',
            meaning: 'One saved permutation per source step.',
          },
          {
            name: 'len(L_list)',
            value: '10',
            meaning: 'One saved elimination matrix per source step.',
          },
          {
            name: 'U.shape',
            value: '(10, 10)',
            meaning: 'The final upper-triangular result.',
          },
        ],
        after: {
          title: 'The saved run reaches upper-triangular U',
          description: 'Its diagonal matches the raw U pivots from Lab 2.1.',
          matrices: [
            {
              label: 'diag(U) · saved output',
              values: [
                [9, -7, 8.5714, -7.7056, 6.5213],
                [7.0469, 8.887, -5.0091, -5.6224, 1.2171],
              ],
              cellTones: toneCells(
                Array.from({ length: 10 }, (_, index) => [
                  Math.floor(index / 5),
                  index % 5,
                ]),
                'result',
              ),
            },
          ],
          callout: 'Open Colab to step through all ten full saved states.',
        },
      },
      {
        sourceCell: 'Code cell 6',
        code: `Lprime = L_list[n-1]
Q = np.eye(n)
for i in range(n-1, 0, -1) :
    Q = Q @ Q_list[i]
    Lprime_i = Q @ L_list[i-1] @ Q.T
    Lprime = Lprime @ Lprime_i
Q = Q @ Q_list[0]
print('A = ')
print(A)
print('Q.T @ L\\'^{-1} @ U = ')
print(Q.T @ np.linalg.inv(Lprime) @ U)
print('Q = ')
print(Q)
print('L\\' = ')
print(Lprime)`,
        title: 'Reconstruct the combined Q and Lprime',
        explanation:
          'The reverse loop transports each elimination matrix through later row permutations, then multiplies the operations together.',
        drives: 'The saved Q, Lprime, and a reconstruction of A.',
        watchFor:
          'Using n here assumes this full-rank square run has exactly n recorded steps.',
        variables: [
          {
            name: 'Q row order',
            value: '[5, 7, 3, 4, 6, 2, 8, 10, 9, 1]',
            meaning: 'One-based original rows.',
          },
          {
            name: 'Q.T @ inv(Lprime) @ U',
            value: 'A',
            meaning: 'Matches A to saved print precision.',
          },
        ],
        after: {
          title: 'The recorded operations rebuild A',
          description: 'Q and Lprime summarize all ten swaps and eliminations.',
          equation: 'A = Qᵀ Lprime⁻¹ U',
          matrices: [
            {
              label: 'source row order encoded by Q',
              values: [[5, 7, 3, 4, 6, 2, 8, 10, 9, 1]],
              cellTones: toneCells(
                Array.from({ length: 10 }, (_, index) => [0, index]),
                'result',
              ),
            },
          ],
        },
      },
      {
        sourceCell: 'Code cell 7',
        code: `Q1, L1, U1 = sp.linalg.lu(A)
print('Q from numpy.linalg.lu = ')
print(Q1.T)
print('L\\' from numpy.linalg.lu = ')
print(np.linalg.inv(L1))`,
        title: 'Compare with SciPy LU',
        explanation:
          'The executable call is scipy.linalg.lu. The two source print labels incorrectly say NumPy; the saved Q1.T and inv(L1) match the reconstructed Q and Lprime.',
        drives: 'A direct library comparison for Q and Lprime.',
        watchFor:
          'U1 is assigned but not printed or explicitly compared in the source notebook.',
        variables: [
          {
            name: 'Q1.T',
            value: 'matches Q',
            meaning: 'Same saved row permutation.',
          },
          {
            name: 'inv(L1)',
            value: 'matches Lprime',
            meaning: 'Same accumulated elimination operation.',
          },
        ],
        after: {
          title: 'The displayed Q and Lprime agree',
          description:
            'The source output visually compares the two operation matrices.',
          equation: 'Q1ᵀ = Q  and  L1⁻¹ = Lprime',
          callout:
            'Source wording corrected: scipy.linalg.lu, not numpy.linalg.lu.',
        },
      },
    ],
  },
};
