import type { ChapterSection } from './shared';
import { sourceLinks, toneCells, toneRow } from './shared';

const filename = 'Ch2-4 Gaussian elimination in detail (Optional).ipynb';
const links = sourceLinks(filename);

export const gaussianDetailSection: ChapterSection = {
  slug: 'gaussian-detail',
  number: '2.4',
  title: 'Gaussian Elimination Step by Step',
  shortTitle: 'Elimination in detail',
  summary:
    'Choose pivots, swap rows, compute multipliers, and record each row operation as a matrix.',
  focus: 'search → swap → multiply → cancel → record',
  learningGoal:
    'Follow Gaussian elimination step by step: choose a pivot, exchange rows, subtract row multiples, and record the operations that create an upper-triangular matrix.',
  lectureConcepts: [
    'Gaussian elimination',
    'Pivot and multiplier',
    'Row exchange',
    'Elementary matrices',
  ],
  codeExtension:
    'Partial pivoting and a numerical tolerance are implementation details added to the lecture’s elimination steps.',
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
    eyebrow: 'Lab 2.4 · Optional trace',
    title: 'See how every zero is deliberately created',
    objective:
      'Use the same 3×3 matrix as Section 2.1, but expose the control flow that produced its row order and triangular factors.',
    initial: {
      title: 'An elimination algorithm needs both data and a cursor',
      description:
        'The matrix changes in its working copy while r marks where the next pivot must land.',
      equation: 'search → swap → eliminate → advance',
      callout:
        'Think first: why is the top-left zero a problem for the first division?',
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
        code: 'A_original = A.copy()\nA = A.copy()\nn, m = A.shape\nr = 0\neps = 1e-12\nQ_list, E_list = [], []',
        lineNotes: [
          {
            action:
              'Saves the input matrix for the final reconstruction check.',
          },
          { action: 'Creates the working copy that elimination may change.' },
          { action: 'Stores the number of rows n and columns m.' },
          { action: 'Places the active pivot-row cursor at row 0.' },
          { action: 'Defines the threshold used to treat a pivot as zero.' },
          {
            action:
              'Creates lists for the row-permutation matrices Qj and elimination matrices Ej.',
          },
        ],
        title: 'Protect the input and initialize algorithm state',
        explanation:
          'A_original stays unchanged while the second copy becomes the working matrix. n and m store dimensions, r marks the active pivot row, and eps defines numerical zero.',
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
        code: 'for j in range(m):\n    if r >= n: break',
        lineNotes: [
          { action: 'Scans candidate pivot columns from left to right.' },
          {
            action:
              'Stops before indexing an empty row range once every row already has a pivot.',
          },
        ],
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
        code: '    pivot = r + np.argmax(np.abs(A[r:, j]))',
        lineNotes: [
          {
            action:
              'Finds the largest candidate magnitude below the cursor and converts its local index to a row index.',
          },
        ],
        title: 'Choose the largest absolute candidate',
        explanation:
          'abs removes signs, argmax returns the local winning index, and adding r converts it back to a matrix row index.',
        drives:
          'Magnitude bars compare 0, 4, and 2; row index 1 (the second row) wins.',
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
          title: 'The second row wins the first pivot search',
          description:
            'Its entry 4 is the largest absolute candidate in the active column.',
          equation: 'arg max [|0|, |4|, |2|] = index 1 (second row)',
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
        code: '    A[[r, pivot], :] = A[[pivot, r], :]',
        lineNotes: [
          {
            action:
              'Swaps the full pivot row with row r using one advanced-indexing assignment.',
          },
        ],
        title: 'Move the winning row into pivot position',
        explanation:
          'Advanced indexing swaps the two complete rows in one assignment.',
        drives: 'Rows 0 and 1 cross while retaining their contents.',
        watchFor:
          'The swap only reorders rows. In Ax=b, apply the same swap to b so the solution set is unchanged.',
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
        code: '    Qj = np.eye(n)\n    Qj[[r,pivot],:] = Qj[[pivot,r],:]\n    Q_list.append(Qj.copy())',
        lineNotes: [
          { action: 'Starts the current row permutation from identity.' },
          {
            action:
              'Applies the same row swap to identity, producing the permutation matrix Qj.',
          },
          {
            action:
              'Stores an independent snapshot of this row permutation for reconstruction.',
          },
        ],
        title: 'Record the row swap as a matrix',
        explanation:
          'Applying the same row swap to identity creates a permutation matrix. Saving it lets the algorithm reconstruct every reordering later.',
        drives:
          'Identity changes into Q₀, and Q₀ @ A_before reproduces A_after.',
        watchFor:
          'copy stores an independent snapshot of this operation matrix.',
        variables: [
          {
            name: 'Q₀',
            value: '[[0,1,0],[1,0,0],[0,0,1]]',
            meaning: 'First swap matrix.',
          },
        ],
        after: {
          title: 'Q₀ records the row swap',
          description:
            'Left-multiplying by Q₀ performs exactly the row exchange shown above.',
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
        code: '    Ej = np.eye(n)\n    if abs(A[r, j]) < eps:\n        E_list.append(Ej.copy())\n        continue',
        lineNotes: [
          {
            action: 'Starts the current elimination operation from identity.',
          },
          {
            action: 'Checks whether the largest remaining candidate is tiny.',
          },
          {
            action:
              'Stores an identity elimination step so E_list stays aligned with Q_list.',
          },
          {
            action:
              'Skips division and moves to the next column without advancing r.',
          },
        ],
        title: 'Create the operation matrix and guard the pivot',
        explanation:
          'Ej begins as identity. If the best pivot is still tiny, the code records that no elimination occurred and skips the unsafe division.',
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
        code: '    for k in range(r + 1, n):\n        u = A[k, j] / A[r, j]',
        lineNotes: [
          {
            action: 'Visits every row below the active pivot row.',
          },
          {
            action:
              'Divides the current target entry by the pivot to obtain its elimination multiplier.',
          },
        ],
        title: 'Compute the elimination multiplier',
        explanation:
          'The loop first sees k=1, where the target is already zero and u=0. The visual focuses on k=2, where 2/4=0.5.',
        drives:
          'Target ÷ pivot becomes a multiplier displayed between the two rows.',
        watchFor:
          'The target at row index 1 (the second row) is already zero, so its multiplier is 0.',
        variables: [
          {
            name: 'k (shown iteration)',
            value: '2',
            meaning: 'Row index 2, the third row, is highlighted below.',
          },
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
        code: '        A[k, j:] -= u * A[r, j:]\n        Ej[k, r] = -u',
        lineNotes: [
          {
            action:
              'Subtracts u times the pivot row from the current target row, starting at column j.',
          },
          {
            action:
              'Stores −u in the elementary matrix so left multiplication performs the same row operation.',
          },
        ],
        title: 'Create the zero and record the operation',
        explanation:
          'The target row changes component by component. The elimination matrix stores −0.5 because left multiplication adds −0.5 times the pivot row.',
        drives:
          '2 becomes zero; the rest of its row becomes [2.5, 0.5]; −0.5 is stored in the operation matrix.',
        watchFor:
          'Using row r—not column j—for the pivot row and Ej column keeps the code correct even after a skipped column.',
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
              label: 'operation matrix E₀',
              values: [
                [1, 0, 0],
                [0, 1, 0],
                [-0.5, 0, 1],
              ],
              cellTones: toneCells([[2, 0]], 'source'),
            },
          ],
          callout:
            'The key change is 2→0, but 3→2.5 and 1→0.5 are also part of the same row operation.',
        },
      },
      {
        code: '    E_list.append(Ej.copy())\n    r += 1\nU = A.copy()\nE = E_list[-1]\nQ = np.eye(n)\nfor i in range(len(E_list) - 1, 0, -1):\n    Q = Q @ Q_list[i]\n    E = E @ Q @ E_list[i - 1] @ Q.T\nQ = Q @ Q_list[0]\nL = np.linalg.inv(E)\nassert np.allclose(Q @ A_original, L @ U)',
        lineNotes: [
          {
            action:
              'Stores the completed elimination matrix for the current column.',
          },
          { action: 'Advances the pivot-row cursor after a pivot is used.' },
          {
            action:
              'Copies the final row-echelon working matrix into the upper factor U.',
          },
          {
            action:
              'Starts the accumulated elimination matrix with the final recorded step.',
          },
          { action: 'Starts the accumulated row permutation from identity.' },
          {
            action: 'Walks backward through the earlier recorded steps.',
          },
          {
            action:
              'Accumulates the row swaps that occur after the earlier elimination step.',
          },
          {
            action:
              'Reorders that earlier elimination matrix into the final row order, then multiplies it into E.',
          },
          { action: 'Includes the first recorded row swap in Q.' },
          {
            action:
              'Inverts the accumulated elimination matrix to obtain the usual lower factor L.',
          },
          {
            action:
              'Checks numerically that the reconstructed factors satisfy Q @ A_original = L @ U.',
          },
        ],
        title: 'Finish elimination and reconstruct the factors',
        explanation:
          'The loop repeats the same search–swap–eliminate cycle. The recorded matrices are then combined in reverse order to recover Q, E, and the usual lower factor L=E⁻¹.',
        drives:
          'The cursor moves down-right and zeros accumulate below the diagonal.',
        watchFor:
          'The entry E[2,0]=0.4 is the product (−0.8)(−0.5) created while the reordered elimination matrices are multiplied.',
        variables: [
          {
            name: 'second pivot',
            value: '2.5',
            meaning: 'Largest active magnitude in column 1.',
          },
          { name: 'second u', value: '0.8', meaning: '2 / 2.5.' },
          {
            name: 'E[2,0]',
            value: '0.4',
            meaning: 'Product term (−0.8)(−0.5) in accumulated E.',
          },
          {
            name: 'final pivot',
            value: '0.6',
            meaning: 'Last diagonal entry of U.',
          },
        ],
        after: {
          title: 'The recorded operations reconstruct the LU factors',
          description:
            'The pivot searches, swaps, and cancellations produce the same triangular factors used in Section 2.1.',
          equation: 'E Q A_original = U  →  Q A_original = L U,  L=E⁻¹',
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
              label: 'E (called Lprime in the source)',
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
            'E stores the accumulated row eliminations. The usual LU lower factor is its inverse, not E itself.',
        },
      },
    ],
  },
};
