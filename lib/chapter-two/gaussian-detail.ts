import type { ChapterSection } from './shared';
import { sourceLinks, toneCells, toneRow } from './shared';

const filename = 'Ch2-4 Gaussian elimination in detail (Optional).ipynb';
const links = sourceLinks(filename);

export const gaussianDetailSection: ChapterSection = {
  slug: 'gaussian-detail',
  number: '2.4',
  title: 'Gaussian Elimination Under the Microscope',
  shortTitle: 'Elimination in detail',
  summary:
    'Trace pivot search, row swaps, multipliers, row updates, and the matrices that remember every operation.',
  focus: 'search → swap → multiply → cancel → record',
  filename,
  ...links,
  optional: true,
  primer: [
    {
      term: 'Pivot',
      definition:
        'The pivot is the active nonzero entry used to eliminate values below it.',
      relation: 'aᵣⱼ',
      watchFor:
        'The active pivot row r may differ from the current column j if a column is skipped.',
    },
    {
      term: 'Partial pivoting',
      definition:
        'Choose the largest absolute entry in the active column among rows not yet processed.',
      relation: 'arg maxᵢ≥ᵣ |aᵢⱼ|',
      watchFor: 'Absolute magnitude, not signed value, determines the winner.',
    },
    {
      term: 'Multiplier',
      definition:
        'The target divided by the pivot gives the amount of pivot row to subtract.',
      relation: 'u = aₖⱼ / aᵣⱼ',
      watchFor:
        'The elimination matrix stores −u, while the usual LU lower factor stores the inverse operation.',
    },
    {
      term: 'Tolerance',
      definition:
        'A small threshold treats numerically tiny values as zero and avoids unstable division.',
      relation: '|pivot| < ε',
      watchFor: 'A skipped column does not advance the active pivot row.',
    },
  ],
  walkthrough: {
    eyebrow: '2.4 · Optional deep dive',
    title: 'See how every zero is deliberately created',
    objective:
      'Use the same 3×3 matrix as Section 2.1, but expose the control flow that produced its row order and triangular factors.',
    initial: {
      title: 'An elimination algorithm needs both data and a cursor',
      description:
        'The matrix will change in place while row_to_check marks where the next pivot must land.',
      equation: 'search → swap → eliminate → advance',
      callout:
        'Prediction: why is the top-left zero a problem for the first division?',
    },
    steps: [
      {
        code: 'A = np.array([[0.,2.,1.],[4.,1.,1.],[2.,3.,1.]], dtype=float)',
        title: 'Create a floating-point working matrix',
        explanation:
          'The algorithm will subtract fractional multiples of rows, so the array uses floating-point values from the start.',
        drives: 'The initial matrix and the first active column.',
        watchFor:
          'The entry at (0,0) is zero, but two candidates below it are nonzero.',
        variables: [
          {
            name: 'A.shape',
            value: '(3, 3)',
            meaning: 'Three rows and three columns.',
          },
        ],
        after: {
          title: 'Column 0 is ready for pivot search',
          description: 'The active candidates are 0, 4, and 2.',
          equation: 'candidate magnitudes = [0, 4, 2]',
          matrices: [
            {
              label: 'A',
              values: [
                [0, 2, 1],
                [4, 1, 1],
                [2, 3, 1],
              ],
              cellTones: toneCells(
                [
                  [0, 0],
                  [1, 0],
                  [2, 0],
                ],
                'source',
              ),
            },
          ],
        },
      },
      {
        code: 'A_original = A.copy()\nA = A.copy()\nn, m = A.shape\nr = 0\neps = 1e-12\nQ_list, L_list = [], []',
        title: 'Protect the input and initialize algorithm state',
        explanation:
          'copy preserves the caller’s matrix. n and m store dimensions, r marks the active pivot row, and eps defines numerical zero.',
        drives:
          'An original/working distinction, a row cursor, and a tolerance marker.',
        watchFor: 'Only the working copy changes during elimination.',
        variables: [
          { name: 'n, m', value: '3, 3', meaning: 'Working dimensions.' },
          { name: 'r', value: '0', meaning: 'First pivot must land in row 0.' },
          {
            name: 'eps',
            value: '1e−12',
            meaning: 'Threshold for an unusably small pivot.',
          },
        ],
        after: {
          title: 'The control state is initialized',
          description:
            'The cursor points to row 0, and A is a safe working copy.',
          equation: 'r = 0,  j has not started yet',
          matrices: [
            {
              label: 'original A',
              values: [
                [0, 2, 1],
                [4, 1, 1],
                [2, 3, 1],
              ],
            },
            {
              label: 'working A',
              values: [
                [0, 2, 1],
                [4, 1, 1],
                [2, 3, 1],
              ],
              cellTones: toneRow(0, 3, 'target'),
            },
          ],
        },
      },
      {
        code: 'for j in range(m):',
        title: 'Scan columns from left to right',
        explanation:
          'On the first pass j=0. Only rows r through n−1 are eligible because earlier pivot rows, if any, are already finished.',
        drives:
          'The active column is highlighted while completed columns are muted.',
        watchFor:
          'j selects a column; r selects where the pivot row should be placed.',
        variables: [
          { name: 'j', value: '0', meaning: 'Current search column.' },
          {
            name: 'eligible rows',
            value: '0:3',
            meaning: 'Rows not yet assigned a pivot.',
          },
        ],
        after: {
          title: 'The first search examines column 0',
          description: 'All three rows are currently eligible.',
          equation: 'A[r:, j] = A[0:, 0] = [0,4,2]',
          matrices: [
            {
              label: 'active column j=0',
              values: [
                [0, 2, 1],
                [4, 1, 1],
                [2, 3, 1],
              ],
              cellTones: toneCells(
                [
                  [0, 0],
                  [1, 0],
                  [2, 0],
                ],
                'source',
              ),
            },
          ],
        },
      },
      {
        code: 'pivot = r + np.argmax(np.abs(A[r:, j]))',
        title: 'Choose the largest absolute candidate',
        explanation:
          'abs removes signs, argmax returns the local winning index, and adding r converts it back to a matrix row index.',
        drives: 'Magnitude bars compare 0, 4, and 2; row 1 wins.',
        watchFor:
          'The source notebook spells this search out with a loop; this line is an equivalent compact form.',
        variables: [
          {
            name: 'pivot',
            value: '1',
            meaning: 'Zero-based row index containing magnitude 4.',
          },
        ],
        after: {
          title: 'Row 1 wins the first pivot search',
          description:
            'Its entry 4 is the largest absolute candidate in the active column.',
          equation: 'arg max [|0|, |4|, |2|] = row 1',
          matrices: [
            {
              label: 'pivot winner',
              values: [
                [0, 2, 1],
                [4, 1, 1],
                [2, 3, 1],
              ],
              cellTones: toneRow(1, 3, 'result'),
            },
          ],
          callout:
            'Partial pivoting reduces the danger of dividing by a tiny value.',
        },
      },
      {
        code: 'A[[r, pivot], :] = A[[pivot, r], :]',
        title: 'Move the winning row into pivot position',
        explanation:
          'Advanced indexing swaps the two complete rows in one assignment.',
        drives: 'Rows 0 and 1 cross while retaining their contents.',
        watchFor:
          'The operation changes row order, not the equations’ solution set.',
        variables: [
          {
            name: 'A[r,j]',
            value: '4',
            meaning:
              'The active pivot is now nonzero and largest in magnitude.',
          },
        ],
        after: {
          title: 'The pivot 4 reaches the top-left corner',
          description: 'The original second row is now the first working row.',
          equation: 'R₁ ↔ R₂',
          matrices: [
            {
              label: 'before swap',
              values: [
                [0, 2, 1],
                [4, 1, 1],
                [2, 3, 1],
              ],
              cellTones: {
                ...toneRow(0, 3, 'target'),
                ...toneRow(1, 3, 'source'),
              },
            },
            {
              label: 'after swap',
              values: [
                [4, 1, 1],
                [0, 2, 1],
                [2, 3, 1],
              ],
              cellTones: {
                ...toneRow(0, 3, 'result'),
                ...toneRow(1, 3, 'target'),
              },
            },
          ],
        },
      },
      {
        code: 'Qj = np.eye(n)\nQj[[r,pivot],:] = Qj[[pivot,r],:]\nQ_list.append(Qj.copy())',
        title: 'Record the row swap as a matrix',
        explanation:
          'Applying the same row swap to identity creates a permutation matrix. Saving it lets the algorithm reconstruct every reordering later.',
        drives:
          'Identity changes into Q₀, and Q₀ @ A_before reproduces A_after.',
        watchFor:
          'copy freezes this step; otherwise later edits could mutate the saved receipt.',
        variables: [
          {
            name: 'Q₀',
            value: '[[0,1,0],[1,0,0],[0,0,1]]',
            meaning: 'First swap matrix.',
          },
        ],
        after: {
          title: 'Q₀ is a reusable receipt for the swap',
          description:
            'Left-multiplying by Q₀ performs exactly the row exchange seen in line 5.',
          equation: 'Q₀ A_before = A_after',
          matrices: [
            {
              label: 'I₃',
              values: [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
              ],
            },
            {
              label: 'Q₀',
              values: [
                [0, 1, 0],
                [1, 0, 0],
                [0, 0, 1],
              ],
              cellTones: toneCells(
                [
                  [0, 1],
                  [1, 0],
                ],
                'result',
              ),
            },
          ],
        },
      },
      {
        code: 'if abs(A[r, j]) < eps: continue',
        title: 'Guard against an effectively zero pivot',
        explanation:
          'The branch skips an unsafe column instead of dividing by a value smaller than the numerical tolerance.',
        drives: 'The pivot magnitude is compared directly with eps.',
        watchFor:
          'Here |4| is much larger than 1e−12, so elimination continues.',
        variables: [
          {
            name: '|4| < 1e−12',
            value: 'False',
            meaning: 'The pivot is safe to use.',
          },
        ],
        after: {
          title: 'The pivot passes the tolerance check',
          description: 'Division by 4 is numerically safe at this scale.',
          equation: '4 ≫ 10⁻¹²  →  do not skip',
          matrices: [
            {
              label: 'safe pivot',
              values: [
                [4, 1, 1],
                [0, 2, 1],
                [2, 3, 1],
              ],
              cellTones: toneCells([[0, 0]], 'result'),
            },
          ],
        },
      },
      {
        code: 'k = r + 1  # first target row in this 3×3 trace\nu = A[k, j] / A[r, j]\nEj = np.eye(n)',
        title: 'Compute the elimination multiplier',
        explanation:
          'For target row k=2, divide the target entry 2 by pivot 4. The result 0.5 is exactly how much pivot row to subtract.',
        drives:
          'Target ÷ pivot becomes a multiplier displayed between the two rows.',
        watchFor:
          'The already-zero target in row 1 has multiplier 0 and needs no visible change.',
        variables: [
          { name: 'k', value: '2', meaning: 'Current target row.' },
          { name: 'u', value: '0.5', meaning: 'Target-to-pivot ratio.' },
        ],
        after: {
          title: 'The cancellation amount is 0.5',
          description:
            'Subtracting half of the pivot row will turn the target 2 into zero.',
          equation: 'u = target / pivot = 2 / 4 = 0.5',
          matrices: [
            {
              label: 'pivot and target rows',
              values: [
                [4, 1, 1],
                [2, 3, 1],
              ],
              cellTones: {
                ...toneRow(0, 3, 'source'),
                ...toneRow(1, 3, 'target'),
              },
            },
          ],
        },
      },
      {
        code: 'A[k, j:] -= u * A[r, j:]\nEj[k, r] = -u',
        title: 'Create the zero and record the operation',
        explanation:
          'The target row changes component by component. The elimination matrix stores −0.5 because left multiplication adds −0.5 times the pivot row.',
        drives:
          '2 turns into a bright zero; the rest of its row becomes [2.5, 0.5]; −0.5 appears in the receipt.',
        watchFor:
          'The generalized teaching code uses r in A[r,j:] and Ej[k,r], which remains correct even if an earlier column was skipped.',
        variables: [
          {
            name: 'Ej[2,0]',
            value: '−0.5',
            meaning: 'Stored row-operation coefficient.',
          },
        ],
        after: {
          title: 'The first below-pivot entry has been eliminated',
          description:
            'Every component uses the same multiplier, so the whole row operation stays algebraically valid.',
          equation: '[2,3,1] − 0.5·[4,1,1] = [0,2.5,0.5]',
          matrices: [
            {
              label: 'working A',
              values: [
                [4, 1, 1],
                [0, 2, 1],
                [0, 2.5, 0.5],
              ],
              cellTones: toneRow(2, 3, 'result'),
            },
            {
              label: 'E₀ receipt',
              values: [
                [1, 0, 0],
                [0, 1, 0],
                [-0.5, 0, 1],
              ],
              cellTones: toneCells([[2, 0]], 'source'),
            },
          ],
          callout:
            'The strongest visual change is 2→0, but 3→2.5 and 1→0.5 are equally part of the row operation.',
        },
      },
      {
        code: 'L_list.append(Ej.copy())\nr += 1  # repeat search, swap, elimination\nU = np.array([[4.,1.,1.],[0.,2.5,.5],[0.,0.,.6]])\nQ = np.array([[0.,1.,0.],[0.,0.,1.],[1.,0.,0.]])\nLprime = np.array([[1.,0.,0.],[-.5,1.,0.],[.4,-.8,1.]])\nL = np.linalg.inv(Lprime)\nassert np.allclose(Q @ A_original, L @ U)',
        title: 'Advance the pivot staircase and finish',
        explanation:
          'The next search compares 2 and 2.5 in column 1, swaps the 2.5 row upward, uses multiplier 0.8, and creates the final zero below the diagonal.',
        drives:
          'The cursor moves down-right and zeros accumulate below the diagonal.',
        watchFor:
          'The usual L factor is the inverse of the accumulated elimination matrix E; E itself stores negative multipliers.',
        variables: [
          {
            name: 'second pivot',
            value: '2.5',
            meaning: 'Largest active magnitude in column 1.',
          },
          { name: 'second u', value: '0.8', meaning: '2 / 2.5.' },
          {
            name: 'final pivot',
            value: '0.6',
            meaning: 'Last diagonal entry of U.',
          },
        ],
        after: {
          title: 'The algorithm has produced U and all operation receipts',
          description:
            'The pivot searches, swaps, and cancellations create the same triangular factors used in Section 2.1.',
          equation: 'A_original = Qᵀ E⁻¹ U',
          matrices: [
            {
              label: 'U',
              values: [
                [4, 1, 1],
                [0, 2.5, 0.5],
                [0, 0, 0.6],
              ],
              cellTones: {
                ...toneCells(
                  [
                    [1, 0],
                    [2, 0],
                    [2, 1],
                  ],
                  'result',
                ),
                ...toneCells(
                  [
                    [0, 0],
                    [1, 1],
                    [2, 2],
                  ],
                  'source',
                ),
              },
            },
            {
              label: 'Q',
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
                'block-a',
              ),
            },
            {
              label: 'E (Lprime)',
              values: [
                [1, 0, 0],
                [-0.5, 1, 0],
                [0.4, -0.8, 1],
              ],
              cellTones: toneCells(
                [
                  [1, 0],
                  [2, 0],
                  [2, 1],
                ],
                'block-b',
              ),
            },
            {
              label: 'E⁻¹ (usual L)',
              values: [
                [1, 0, 0],
                [0.5, 1, 0],
                [0, 0.8, 1],
              ],
              cellTones: toneCells(
                [
                  [1, 0],
                  [2, 1],
                ],
                'result',
              ),
            },
          ],
          callout:
            'The source names E “Lprime.” It is an accumulated elimination matrix, while the usual LU lower factor is E inverse.',
        },
      },
    ],
  },
};
