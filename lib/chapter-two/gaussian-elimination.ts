import type { ChapterSection } from './shared';
import { sourceLinks, toneCells } from './shared';

const filename = 'Ch2-1 Gaussian Elimination.ipynb';
const links = sourceLinks(filename);

export const gaussianEliminationSection: ChapterSection = {
  slug: 'gaussian-elimination',
  number: '2.1',
  title: 'Gaussian Elimination',
  shortTitle: 'Gaussian elimination',
  summary:
    'Solve one small 3×3 system by following the notebook’s LU → LDU → triangular-solve idea.',
  focus: 'row order → LDU → solve',
  learningGoal:
    'Explain why the rows of b must follow the rows of A, then read the solution from three simple triangular solves.',
  lectureConcepts: ['Gaussian elimination', 'Pivoted LU', 'LDU', 'Ax = b'],
  codeExtension:
    'The full notebook repeats this flow on a seeded 10×10 system and writes out forward and backward substitution.',
  filename,
  ...links,
  primer: [
    {
      term: 'Row permutation',
      definition:
        'Pivoting reorders the equations, so the same row order must be applied to b.',
      relation: 'Q A = L U_raw; rhs = Q b',
      watchFor: 'Q swaps the first two rows in this example.',
    },
    {
      term: 'Diagonal scaling',
      definition:
        'The pivots of U_raw become a diagonal matrix; the remaining upper factor has ones on its diagonal.',
      relation: 'U_raw = D U_unit',
      watchFor: 'pivot_values is a vector; D is a matrix.',
    },
    {
      term: 'Triangular solve',
      definition:
        'Solve from left to right through L, D, and U_unit instead of forming an inverse.',
      relation: 'L y = Qb → D z = y → U_unit x = z',
      watchFor: 'The final vector x must satisfy A @ x = b.',
    },
  ],
  walkthrough: {
    eyebrow: 'Lab 2.1 · Guided example',
    title: 'Solve a 3×3 system through LDU',
    objective:
      'This is a smaller teaching example, not a copy of every notebook cell. It keeps the same factor-and-solve idea with values that fit on one screen.',
    source: {
      filename,
      url: links.githubUrl,
      note: 'The source uses a random 10×10 system; this trace uses a deterministic 3×3 system.',
    },
    initial: {
      title: 'Start with one question',
      description: 'Find the vector x that makes A @ x equal b.',
      equation: 'A x = b',
    },
    steps: [
      {
        code: 'import numpy as np\nimport scipy as sp\nA = np.array([[0., 2., 2.], [4., 4., 0.], [2., 3., 2.]])\nb = np.array([10., 12., 14.])',
        lineNotes: [
          {
            action: 'Loads NumPy for arrays and linear solves.',
            shape: '— (module import)',
            operation: 'Binds NumPy to the short name np.',
          },
          {
            action: 'Loads SciPy for pivoted LU decomposition.',
            shape: '— (module import)',
            operation: 'Binds SciPy to the short name sp.',
          },
          {
            action: 'Stores a small coefficient matrix as A.',
            shape: 'nested rows → A: (3, 3)',
            operation:
              'Three lists become the three rows of one 2-D float array.',
          },
          {
            action: 'Stores the right-hand side as b.',
            shape: '3 values → b: (3,)',
            operation: 'Creates the 1-D vector [10, 12, 14].',
          },
        ],
        title: 'Create a small system',
        explanation:
          'The zero in the upper-left corner makes the need for a row swap visible immediately.',
        watchFor: 'A[0,0] is zero, so another row must supply the first pivot.',
        variables: [
          { name: 'A.shape', value: '(3, 3)', meaning: 'Three equations.' },
          { name: 'b', value: '[10, 12, 14]', meaning: 'Three target values.' },
        ],
        after: {
          title: 'The augmented system is ready',
          description: 'The dashed division separates A from b.',
          matrices: [
            {
              label: '[ A | b ]',
              values: [
                [0, 2, 2, 10],
                [4, 4, 0, 12],
                [2, 3, 2, 14],
              ],
              dividerBefore: 3,
              cellTones: toneCells([[0, 0]], 'target'),
            },
          ],
          callout: 'A row swap will put 4 in the first pivot position.',
        },
      },
      {
        code: 'P, L, U_raw = sp.linalg.lu(A)\nQ = P.T',
        lineNotes: [
          {
            action: 'Factors A into a row permutation, L, and U_raw.',
            shape: 'A: (3, 3) → P, L, U_raw: each (3, 3)',
            operation:
              'Chooses pivot 4, reorders rows, and stores the 0.5 multipliers in L.',
          },
          {
            action:
              'Transposes P so the course identity reads Q @ A = L @ U_raw.',
            shape: 'P: (3, 3) → Q: (3, 3)',
            operation:
              'Exchanges row and column indices; this one-swap P happens to stay unchanged.',
          },
        ],
        title: 'Factor and reorder the rows',
        explanation:
          'Q places the row beginning with 4 first. L stores the elimination multipliers, and U_raw is upper triangular.',
        watchFor:
          'The rows of A change order; the same Q will be applied to b before solving.',
        after: {
          title: 'Pivoted LU separates three jobs',
          description:
            'Q reorders, L records elimination, and U_raw holds the pivots.',
          equation: 'Q @ A = L @ U_raw',
          matrices: [
            {
              label: 'Q @ A',
              values: [
                [4, 4, 0],
                [0, 2, 2],
                [2, 3, 2],
              ],
              cellTones: toneCells([[0, 0]], 'source'),
            },
            {
              label: 'L',
              values: [
                [1, 0, 0],
                [0, 1, 0],
                [0.5, 0.5, 1],
              ],
            },
            {
              label: 'U_raw',
              values: [
                [4, 4, 0],
                [0, 2, 2],
                [0, 0, 1],
              ],
              cellTones: toneCells(
                [
                  [1, 0],
                  [2, 0],
                  [2, 1],
                ],
                'result',
              ),
            },
          ],
          callout:
            'Here P happens to equal Q because one row-swap matrix is symmetric. Q = P.T is the general convention.',
        },
      },
      {
        code: 'pivot_values = np.diagonal(U_raw).copy()\nD = np.diagflat(pivot_values)\nU_unit = U_raw / pivot_values[:, None]',
        lineNotes: [
          {
            action:
              'Copies the three pivot values into a one-dimensional vector.',
            shape: 'U_raw: (3, 3) → pivot_values: (3,)',
            operation: 'Reads U_raw[0,0], U_raw[1,1], U_raw[2,2] → [4, 2, 1].',
          },
          {
            action: 'Builds the diagonal matrix D from that vector.',
            shape: 'pivot_values: (3,) → D: (3, 3)',
            operation:
              'Flattens the input, places 4, 2, 1 on the diagonal, and fills 0 elsewhere.',
          },
          {
            action: 'Divides each row by its pivot to create U_unit.',
            shape: '(3, 3) ÷ (3, 1) → U_unit: (3, 3)',
            operation:
              '[:, None] makes [[4], [2], [1]]; broadcasting divides row i by pivot i.',
          },
        ],
        title: 'Separate pivot size from triangular shape',
        explanation:
          'Clear names keep the objects distinct: pivot_values is [4, 2, 1], while D is the 3×3 diagonal matrix made from it.',
        watchFor: 'The diagonal of U_unit changes from [4, 2, 1] to [1, 1, 1].',
        variables: [
          {
            name: 'pivot_values',
            value: '[4, 2, 1]',
            meaning: 'A one-dimensional vector.',
          },
          { name: 'D.shape', value: '(3, 3)', meaning: 'A diagonal matrix.' },
        ],
        after: {
          title: 'U_raw becomes D @ U_unit',
          description:
            'D carries scale; U_unit carries the upper-triangular pattern.',
          equation: 'Q @ A = L @ D @ U_unit',
          matrices: [
            {
              label: 'pivot_values · shape (3,)',
              values: [[4, 2, 1]],
            },
            {
              label: 'D',
              values: [
                [4, 0, 0],
                [0, 2, 0],
                [0, 0, 1],
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
              label: 'pivot_values[:, None] · shape (3,1)',
              values: [[4], [2], [1]],
              cellTones: toneCells(
                [
                  [0, 0],
                  [1, 0],
                  [2, 0],
                ],
                'source',
              ),
            },
            {
              label: 'U_unit',
              values: [
                [1, 1, 0],
                [0, 1, 1],
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
            'Broadcasting repeats the 3×1 pivot column across the three columns, so each row is divided by its own pivot.',
        },
      },
      {
        code: 'rhs = Q @ b\ny = np.linalg.solve(L, rhs)\nz = np.linalg.solve(D, y)\nx = np.linalg.solve(U_unit, z)',
        lineNotes: [
          {
            action: 'Reorders b with the same Q used on A.',
            shape: 'Q: (3, 3) @ b: (3,) → rhs: (3,)',
            operation: '[10, 12, 14] becomes [12, 10, 14].',
          },
          {
            action: 'Solves the lower-triangular system L @ y = rhs.',
            shape: 'L: (3, 3), rhs: (3,) → y: (3,)',
            operation: 'Returns y = [12, 10, 3] without forming L⁻¹.',
          },
          {
            action: 'Divides out the pivot scales through D @ z = y.',
            shape: 'D: (3, 3), y: (3,) → z: (3,)',
            operation: '[12/4, 10/2, 3/1] → [3, 5, 3].',
          },
          {
            action: 'Solves the upper-triangular system U_unit @ x = z.',
            shape: 'U_unit: (3, 3), z: (3,) → x: (3,)',
            operation: 'Solves from the bottom row upward → x = [1, 2, 3].',
          },
        ],
        title: 'Solve one simple factor at a time',
        explanation:
          'The difficult system is replaced by a lower solve, a diagonal solve, and an upper solve.',
        watchFor: 'The values become simpler as the solve moves toward x.',
        variables: [
          {
            name: 'rhs',
            value: '[12, 10, 14]',
            meaning: 'b after the same row swap.',
          },
          { name: 'x', value: '[1, 2, 3]', meaning: 'The proposed solution.' },
        ],
        after: {
          title: 'The solve reaches x',
          description:
            'Each row shows the vector after one factor has been removed.',
          matrices: [
            {
              label: 'solve sequence',
              values: [
                ['vector', '1', '2', '3'],
                ['Q @ b', 12, 10, 14],
                ['solve L', 12, 10, 3],
                ['solve D', 3, 5, 3],
                ['solve U', 1, 2, 3],
              ],
              cellTones: toneCells(
                [
                  [4, 1],
                  [4, 2],
                  [4, 3],
                ],
                'result',
              ),
            },
          ],
        },
      },
      {
        code: 'check = np.allclose(A @ x, b)',
        lineNotes: [
          {
            action:
              'Checks that substituting x reproduces b within numerical tolerance.',
            shape: 'A @ x: (3,) vs b: (3,) → check: bool',
            operation:
              'A @ x gives [10, 12, 14]; allclose reduces three comparisons to True.',
          },
        ],
        title: 'Check the answer',
        explanation:
          'A numerical solution is only complete after it is substituted into the original system.',
        watchFor: 'The two vectors should match entry by entry.',
        variables: [
          { name: 'check', value: 'True', meaning: 'The solution passes.' },
        ],
        after: {
          title: 'A @ x equals b',
          description: 'The original three equations are satisfied.',
          equation: 'check = True',
          matrices: [
            { label: 'A @ x', values: [[10], [12], [14]] },
            {
              label: 'b',
              values: [[10], [12], [14]],
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
            'The full notebook applies the same logic to a larger system.',
        },
      },
    ],
  },
};
