import type { ChapterSection } from './shared';
import { sourceLinks, toneCells, toneRow } from './shared';

const filename = 'Ch2-1 Gaussian Elimination.ipynb';
const links = sourceLinks(filename);

export const gaussianEliminationSection: ChapterSection = {
  slug: 'gaussian-elimination',
  number: '2.1',
  title: 'From a Linear System to a Solution',
  shortTitle: 'Gaussian elimination',
  summary:
    'Follow one system through row permutation, LDU factorization, forward substitution, diagonal scaling, and back substitution.',
  focus: 'Ax = b → LDUx = Qb → x',
  learningGoal:
    'Read A and b as a system of equations, then use row reordering and the LDU factors to solve Ax = b by forward and back-substitution.',
  lectureConcepts: [
    'Ax = b',
    'Permutation matrix',
    'LDU-decomposition',
    'Forward / back-substitution',
  ],
  filename,
  ...links,
  primer: [
    {
      term: 'Linear system',
      definition:
        'The matrix equation Ax = b stores several equations that share the same unknown vector x.',
      relation: 'Ax = b',
      watchFor: 'Every row operation applied to A must also be applied to b.',
    },
    {
      term: 'Permutation matrix',
      definition:
        'A permutation matrix changes row order so a safe nonzero pivot reaches the active position.',
      relation: 'Q = Pᵀ',
      watchFor: 'SciPy returns A = P L U; therefore Q A = L U.',
    },
    {
      term: 'LDU-decomposition',
      definition:
        'L stores lower-triangular elimination information, D stores pivots, and U is normalized to have diagonal ones.',
      relation: 'QA = LDU',
      watchFor: 'The diagonal values move out of U_raw and into D.',
    },
    {
      term: 'Forward / back-substitution',
      definition:
        'Forward substitution moves top-to-bottom through L; back substitution moves bottom-to-top through U.',
      relation: 'Lv=y, Dz=v, Ux=z',
      watchFor: 'No matrix inverse is needed to recover x.',
    },
  ],
  walkthrough: {
    eyebrow: '2.1 · Guided execution',
    title: 'Solve Ax = b, one state change at a time',
    objective:
      'Before showing each result, identify the row, pivot, or variable that should change. The small example follows the same operations as the original notebook.',
    initial: {
      title: 'No variables exist yet',
      description:
        'The program state is empty. The first two steps will create A and b, then join them as the augmented matrix [A | b].',
      equation: 'Ax = b',
      callout: 'Think first: what shape must x have if A is 3 × 3?',
    },
    steps: [
      {
        code: 'A = np.array([[0.,2.,1.],[4.,1.,1.],[2.,3.,1.]])',
        title: 'Create the coefficient matrix A',
        explanation:
          'Each row stores the coefficients of one equation. The three columns match the three unknown entries of x.',
        drives: 'A visible 3×3 coefficient matrix.',
        watchFor:
          'A[0,0] is zero, so using it immediately as a pivot would fail.',
        variables: [
          {
            name: 'A.shape',
            value: '(3, 3)',
            meaning: 'Three equations and three unknowns.',
          },
        ],
        after: {
          title: 'A stores the left side of the equations',
          description:
            'Rows are equations and columns line up with x₁, x₂, and x₃.',
          equation: 'A ∈ ℝ³ˣ³',
          matrices: [
            {
              label: 'A',
              values: [
                [0, 2, 1],
                [4, 1, 1],
                [2, 3, 1],
              ],
              cellTones: toneCells([[0, 0]], 'target'),
            },
          ],
          callout:
            'The highlighted zero is the first pivot position. A row exchange will be needed later.',
        },
      },
      {
        code: 'b = np.array([7.,9.,11.])',
        title: 'Create b and join the full system',
        explanation:
          'The vector b stores one right-hand-side value for each row of A. Placing it beside A gives the augmented matrix used in elimination.',
        drives: 'A, b, and their combined form [A | b].',
        watchFor:
          'Row i of A must stay paired with entry i of b during every row operation.',
        variables: [
          {
            name: 'b',
            value: '[7, 9, 11]',
            meaning: 'One right-hand-side value per equation.',
          },
          {
            name: '[A | b].shape',
            value: '(3, 4)',
            meaning: 'Three coefficient columns plus one right-hand side.',
          },
        ],
        after: {
          title: 'A and b now form one augmented matrix',
          description:
            'The separate definitions are kept visible, then combined so each equation can be read across one row.',
          equation: '[A | b]  ↔  0x₁+2x₂+x₃=7,  4x₁+x₂+x₃=9,  2x₁+3x₂+x₃=11',
          matrices: [
            {
              label: 'A · coefficients',
              values: [
                [0, 2, 1],
                [4, 1, 1],
                [2, 3, 1],
              ],
              cellTones: toneCells([[0, 0]], 'target'),
            },
            { label: 'b · right side', values: [[7], [9], [11]] },
            {
              label: 'combined [ A | b ]',
              values: [
                [0, 2, 1, 7],
                [4, 1, 1, 9],
                [2, 3, 1, 11],
              ],
              dividerBefore: 3,
              cellTones: toneCells([[0, 0]], 'target'),
            },
          ],
          callout:
            'Elimination changes complete rows of [A | b], so coefficients and right-hand sides remain paired.',
        },
      },
      {
        code: 'P, L, U_raw = sp.linalg.lu(A)',
        title: 'Ask SciPy for a pivoted LU factorization',
        explanation:
          'SciPy chooses a stable row order and returns factors satisfying A = P @ L @ U_raw.',
        drives:
          'Three factor cards: the row permutation P, lower factor L, and unnormalized upper factor U_raw.',
        watchFor: 'This is scipy.linalg.lu—not numpy.linalg.lu.',
        variables: [
          {
            name: 'P.shape',
            value: '(3, 3)',
            meaning: 'A row-permutation matrix.',
          },
          {
            name: 'diag(U_raw)',
            value: '[4, 2.5, 0.6]',
            meaning: 'The three pivots found by elimination.',
          },
        ],
        after: {
          title: 'A has been split into reusable operations',
          description:
            'P records row order, L records multipliers, and U_raw is upper triangular.',
          equation: 'A = P · L · U_raw',
          matrices: [
            {
              label: 'P',
              values: [
                [0, 0, 1],
                [1, 0, 0],
                [0, 1, 0],
              ],
            },
            {
              label: 'L',
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
                'source',
              ),
            },
            {
              label: 'U_raw',
              values: [
                [4, 1, 1],
                [0, 2.5, 0.5],
                [0, 0, 0.6],
              ],
              cellTones: toneCells(
                [
                  [0, 0],
                  [1, 1],
                  [2, 2],
                ],
                'result',
              ),
            },
          ],
          callout:
            'The colored entries in L are the stored elimination multipliers; the green diagonal entries are pivots.',
        },
      },
      {
        code: 'Q = P.T',
        title: 'Reverse SciPy’s permutation convention',
        explanation:
          'The transpose of a permutation matrix is its inverse. Multiplying by Q moves A into the row order used by L and U_raw.',
        drives: 'A visible row reorder from [R₁,R₂,R₃] to [R₂,R₃,R₁].',
        watchFor: 'The right-hand side must later undergo the same reorder.',
        variables: [
          { name: 'Q', value: 'P.T', meaning: 'The inverse row permutation.' },
          {
            name: 'Q @ A',
            value: 'rows 2, 3, 1',
            meaning: 'A in elimination order.',
          },
        ],
        after: {
          title: 'The largest available first pivot moves to the top',
          description:
            'Q does not change any row internally; it only changes row order.',
          equation: 'Q A = L U_raw',
          matrices: [
            {
              label: 'A before',
              values: [
                [0, 2, 1],
                [4, 1, 1],
                [2, 3, 1],
              ],
              cellTones: toneRow(1, 3, 'source'),
            },
            {
              label: 'Q @ A',
              values: [
                [4, 1, 1],
                [2, 3, 1],
                [0, 2, 1],
              ],
              cellTones: toneRow(0, 3, 'result'),
            },
            {
              label: 'Q',
              values: [
                [0, 1, 0],
                [0, 0, 1],
                [1, 0, 0],
              ],
            },
          ],
          callout:
            'The highlighted original second row becomes the first row after multiplication by Q.',
        },
      },
      {
        code: 'd = np.diag(U_raw)\nD = np.diag(d)\nU = U_raw / d[:, None]',
        title: 'Separate pivot scale from triangular shape',
        explanation:
          'The diagonal pivots are extracted into D. Dividing every row of U_raw by its own pivot leaves a unit-diagonal U.',
        drives:
          'The three pivot values move from U_raw into D while the diagonal of U becomes 1.',
        watchFor:
          'd[:, None] changes d into a column so NumPy divides each row by the correct pivot.',
        variables: [
          {
            name: 'd',
            value: '[4, 2.5, 0.6]',
            meaning: 'Pivot scale, one value per row.',
          },
          {
            name: 'diag(U)',
            value: '[1, 1, 1]',
            meaning: 'U is normalized row by row.',
          },
        ],
        after: {
          title: 'The pivot values are now stored in D',
          description: 'Multiplying D and U reconstructs U_raw exactly.',
          equation: 'U_raw = D U    and    Q A = L D U',
          matrices: [
            {
              label: 'D',
              values: [
                [4, 0, 0],
                [0, 2.5, 0],
                [0, 0, 0.6],
              ],
              cellTones: toneCells(
                [
                  [0, 0],
                  [1, 1],
                  [2, 2],
                ],
                'source',
              ),
            },
            {
              label: 'U',
              values: [
                [1, 0.25, 0.25],
                [0, 1, 0.2],
                [0, 0, 1],
              ],
              cellTones: toneCells(
                [
                  [0, 0],
                  [1, 1],
                  [2, 2],
                ],
                'result',
              ),
            },
          ],
          callout:
            'D controls scale; U keeps the dependency pattern needed for back substitution.',
        },
      },
      {
        code: 'y = Q @ b',
        title: 'Apply the same row order to b',
        explanation:
          'Reordering only A would describe a different system. Q must act on b as well.',
        drives: 'The values of b move in the identical R₂, R₃, R₁ order.',
        watchFor: 'Values move; they are not recomputed.',
        variables: [
          {
            name: 'y',
            value: '[9, 11, 7]',
            meaning: 'The right-hand side in elimination order.',
          },
        ],
        after: {
          title: 'The equations and constants still match',
          description:
            'The second, third, and first right-hand-side entries now align with the reordered rows of A.',
          equation: 'QAx = Qb  →  LDUx = y',
          matrices: [
            {
              label: 'b before',
              values: [[7], [9], [11]],
              cellTones: toneCells([[1, 0]], 'source'),
            },
            {
              label: 'y = Q @ b',
              values: [[9], [11], [7]],
              cellTones: toneCells([[0, 0]], 'result'),
            },
          ],
          callout:
            'The highlighted 9 follows the same row that moved to the top in line 3.',
        },
      },
      {
        code: 'aug = np.hstack((L, y.reshape(-1, 1)))',
        title: 'Prepare the forward solve',
        explanation:
          'reshape turns y into a column, and hstack attaches it to L as an augmented matrix.',
        drives:
          'A new right-most column separated from the coefficients by a divider.',
        watchFor: 'reshape(-1, 1) means “infer the row count, use one column.”',
        variables: [
          {
            name: 'aug.shape',
            value: '(3, 4)',
            meaning: 'Three coefficient columns plus one RHS column.',
          },
        ],
        after: {
          title: 'L and y are joined for elimination',
          description:
            'Forward substitution will clear the entries below the diagonal while updating only the right-hand side.',
          equation: 'L v = y',
          matrices: [
            {
              label: '[ L | y ]',
              values: [
                [1, 0, 0, 9],
                [0.5, 1, 0, 11],
                [0, 0.8, 1, 7],
              ],
              dividerBefore: 3,
              cellTones: toneCells(
                [
                  [1, 0],
                  [2, 1],
                ],
                'target',
              ),
            },
          ],
          callout:
            'The orange entries are exactly the multipliers that must be cleared.',
        },
      },
      {
        code: 'for piv in range(3):\n    for i in range(piv + 1, 3):\n        aug[i,-1] -= aug[i,piv] * aug[piv,-1]\n        aug[i,piv] = 0',
        title: 'Carry out forward substitution',
        explanation:
          'Each multiplier tells how much of an already solved pivot row to subtract from a lower row.',
        drives:
          '0.5 and 0.8 become zero, while the RHS changes 11 → 6.5 and 7 → 1.8.',
        watchFor:
          'The code updates the last column directly because L has ones on its diagonal.',
        variables: [
          {
            name: 'aug[:, -1]',
            value: '[9, 6.5, 1.8]',
            meaning: 'The solved RHS column; line 8 will store it as v.',
          },
        ],
        after: {
          title: 'Forward substitution has produced v',
          description:
            'The lower-triangular system is reduced to identity with the solved values on the right.',
          equation: '11 − 0.5·9 = 6.5    ·    7 − 0.8·6.5 = 1.8',
          matrices: [
            {
              label: 'after first cancellation',
              values: [
                [1, 0, 0, 9],
                [0, 1, 0, 6.5],
                [0, 0.8, 1, 7],
              ],
              dividerBefore: 3,
              cellTones: toneCells(
                [
                  [1, 0],
                  [1, 3],
                ],
                'result',
              ),
            },
            {
              label: 'final [ I | v ]',
              values: [
                [1, 0, 0, 9],
                [0, 1, 0, 6.5],
                [0, 0, 1, 1.8],
              ],
              dividerBefore: 3,
              cellTones: toneCells(
                [
                  [2, 1],
                  [2, 3],
                ],
                'result',
              ),
            },
          ],
          callout:
            'The zero is the structural result; the changed RHS is the numerical result of the same row operation.',
        },
      },
      {
        code: 'v = aug[:, -1]\nz = v / d',
        title: 'Solve the diagonal system',
        explanation:
          'The last column is v. Since D is diagonal, solving Dz = v is three independent divisions.',
        drives: 'Three parallel divisions aligned with D’s diagonal.',
        watchFor:
          'This is elementwise division because both v and d are one-dimensional arrays.',
        variables: [
          {
            name: 'v',
            value: '[9, 6.5, 1.8]',
            meaning: 'Forward-solve result.',
          },
          {
            name: 'z',
            value: '[2.25, 2.6, 3]',
            meaning: 'Solution after removing pivot scale.',
          },
        ],
        after: {
          title: 'Solve Dz = v one row at a time',
          description: 'Each pivot controls only the value in its own row.',
          equation: 'z = [9/4, 6.5/2.5, 1.8/0.6] = [2.25, 2.6, 3]',
          matrices: [
            {
              label: 'D',
              values: [
                [4, 0, 0],
                [0, 2.5, 0],
                [0, 0, 0.6],
              ],
              cellTones: toneCells(
                [
                  [0, 0],
                  [1, 1],
                  [2, 2],
                ],
                'source',
              ),
            },
            {
              label: 'z',
              values: [[2.25], [2.6], [3]],
              cellTones: toneCells(
                [
                  [0, 0],
                  [1, 0],
                  [2, 0],
                ],
                'result',
              ),
            },
          ],
        },
      },
      {
        code: 'x = np.zeros(3)\nfor i in range(2, -1, -1):\n    x[i] = (z[i] - sum(U[i,j]*x[j] for j in range(i+1,3))) / U[i,i]',
        title: 'Back-substitute from the bottom row',
        explanation:
          'Known variables are substituted upward: solve x₃ first, then x₂, then x₁.',
        drives:
          'The solution is filled from bottom to top, and the final residual is zero within floating-point tolerance.',
        watchFor:
          'range(i+1, 3) uses only values of x that have already been solved.',
        variables: [
          {
            name: 'x',
            value: '[1, 2, 3]',
            meaning: 'The recovered unknown vector.',
          },
          {
            name: '‖Ax-b‖',
            value: '≈ 0',
            meaning: 'Zero within floating-point tolerance.',
          },
        ],
        after: {
          title: 'The original system is solved',
          description:
            'Bottom-to-top substitution recovers x, and substituting it into the original A reproduces b.',
          equation: 'x₃=3  →  x₂=2.6−0.2·3=2  →  x₁=2.25−0.25·2−0.25·3=1',
          matrices: [
            {
              label: 'U',
              values: [
                [1, 0.25, 0.25],
                [0, 1, 0.2],
                [0, 0, 1],
              ],
              cellTones: toneCells(
                [
                  [2, 2],
                  [1, 1],
                  [0, 0],
                ],
                'source',
              ),
            },
            {
              label: 'x',
              values: [[1], [2], [3]],
              cellTones: toneCells(
                [
                  [0, 0],
                  [1, 0],
                  [2, 0],
                ],
                'result',
              ),
            },
            {
              label: 'A @ x = b',
              values: [[7], [9], [11]],
              cellTones: toneCells(
                [
                  [0, 0],
                  [1, 0],
                  [2, 0],
                ],
                'result',
              ),
            },
          ],
          callout:
            'Completion checks: np.allclose(Q@A, L@D@U) and np.allclose(A@x, b) are both true.',
        },
      },
    ],
  },
};
