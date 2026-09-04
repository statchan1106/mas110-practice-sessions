import type { ChapterSection } from '@/lib/chapter/shared';
import {
  sourceLinks,
  toneCells,
  toneColumn,
  toneRow,
} from '@/lib/chapter/shared';

const filename = 'Ch3-1 Null Space.ipynb';
const links = sourceLinks(filename);

export const nullSpaceSection: ChapterSection = {
  slug: 'null-space',
  number: '3.1',
  title: 'Finding the Null Space',
  shortTitle: 'Null space',
  summary:
    'Turn one free variable into a direction that the matrix sends to zero.',
  focus: 'eliminate → split columns → build a basis',
  learningGoal:
    'Identify pivot and free variables, then construct and verify one null-space basis vector.',
  lectureConcepts: [
    'Null space',
    'Pivot and free variables',
    'Rank and nullity',
    'Linear independence',
  ],
  codeExtension:
    'The full notebook detects pivots in a random 10×11 matrix and constructs several null-space basis vectors at once.',
  filename,
  ...links,
  primer: [
    {
      term: 'Null space',
      definition:
        'The null space contains every input vector that A sends to the zero output.',
      relation: 'Null(A) = {x : Ax = 0}',
      watchFor: 'It lives in the input space, so its vectors have n entries.',
    },
    {
      term: 'Free variable',
      definition:
        'A non-pivot variable can be chosen first; the pivot variables then adjust to satisfy the equations.',
      relation: 'pivot part = −Uₚ⁻¹U𝒻 · free part',
      watchFor: 'One free variable creates one independent null direction.',
    },
    {
      term: 'Rank–nullity',
      definition:
        'The input coordinates split between pivot directions and null directions.',
      relation: 'rank(A) + nullity(A) = n',
      watchFor: 'Here 2 pivot columns + 1 free column = 3 inputs.',
    },
  ],
  walkthrough: {
    eyebrow: 'Lab 3.1 · Guided example',
    title: 'Build a direction that disappears',
    objective:
      'The notebook’s random 10×11 example is reduced to one 2×3 matrix so every pivot, free variable, and cancellation stays visible.',
    source: {
      filename,
      url: links.githubUrl,
      note: 'The full source uses LU and automatic pivot detection; this example exposes the same core construction by hand.',
    },
    initial: {
      title: 'Three input coordinates, two output coordinates',
      description:
        'Because A maps R³ into R², we look for an input direction that collapses to zero.',
      equation: 'A: R³ → R² · rank(A) + nullity(A) = 3',
    },
    steps: [
      {
        code: 'import numpy as np\nA = np.array([[2., 4., 2.], [1., 3., 2.]])\nU = A.copy()',
        lineNotes: [
          {
            action: 'Loads NumPy for arrays, ranks, and linear solves.',
            shape: '— (module import)',
            operation: 'Binds NumPy to the short name np.',
          },
          {
            action: 'Creates a matrix with three input columns.',
            shape: 'nested rows → A: (2, 3)',
            operation: 'Stores two equations in three unknowns.',
          },
          {
            action: 'Makes a working copy for elimination.',
            shape: 'A: (2, 3) → U: (2, 3)',
            operation: 'Copies all six entries; later edits affect only U.',
          },
        ],
        title: 'Create a small wide matrix',
        explanation:
          'A has more columns than rows, so at least one input coordinate cannot become a pivot.',
        watchFor: 'Which of the three columns will become free?',
        variables: [
          {
            name: 'A.shape',
            value: '(2, 3)',
            meaning: 'Three-dimensional inputs, two-dimensional outputs.',
          },
        ],
        after: {
          title: 'A and U start with the same entries',
          description: 'U is the copy we will simplify without changing A.',
          matrices: [
            {
              label: 'A · original',
              values: [
                [2, 4, 2],
                [1, 3, 2],
              ],
            },
            {
              label: 'U · working copy',
              values: [
                [2, 4, 2],
                [1, 3, 2],
              ],
            },
          ],
        },
      },
      {
        code: 'factor = U[1, 0] / U[0, 0]\nU[1] = U[1] - factor * U[0]',
        lineNotes: [
          {
            action: 'Computes the multiplier for the first cancellation.',
            shape: 'scalar ÷ scalar → factor: scalar',
            operation: '1 ÷ 2 → 0.5.',
          },
          {
            action: 'Subtracts half of row 1 from row 2.',
            shape: 'row (3,) − scalar × row (3,) → row (3,)',
            operation: '[1,3,2] − 0.5[2,4,2] → [0,1,1].',
          },
        ],
        title: 'Expose the pivot pattern',
        explanation:
          'An invertible row operation changes the equations’ appearance but not the solutions of Ax = 0.',
        watchFor: 'The first entry of the second row should become zero.',
        variables: [
          {
            name: 'factor',
            value: '0.5',
            meaning: 'The amount of row 1 removed from row 2.',
          },
        ],
        after: {
          title: 'U has two visible pivots',
          description:
            'The second row changes; the homogeneous solutions do not.',
          equation: 'R₂ ← R₂ − 0.5R₁ · Null(A) = Null(U)',
          matrices: [
            {
              label: 'U · row echelon form',
              values: [
                [2, 4, 2],
                [0, 1, 1],
              ],
              cellTones: {
                ...toneRow(0, 3, 'source'),
                ...toneRow(1, 3, 'result'),
              },
            },
          ],
          callout:
            'Row operations are reversible, so an input solves Ax = 0 exactly when it solves Ux = 0.',
        },
      },
      {
        code: 'rank_u = np.linalg.matrix_rank(U)\npivots = [0, 1]\nfree = [2]',
        lineNotes: [
          {
            action: 'Counts the independent rows and pivot columns.',
            shape: 'U: (2, 3) → rank_u: scalar',
            operation: 'Both rows are independent, so rank_u = 2.',
          },
          {
            action: 'Records the two pivot-column indices.',
            shape: 'pivots: list of 2 scalar indices',
            operation: 'The leading entries occur in columns 0 and 1.',
          },
          {
            action: 'Records the remaining free-column index.',
            shape: 'free: list of 1 scalar index',
            operation: 'Column 2 has no new pivot, so x₃ may be chosen freely.',
          },
        ],
        title: 'Separate pivot and free variables',
        explanation:
          'Two pivots determine two coordinates; the one free coordinate determines the null direction.',
        watchFor:
          'How many independent null directions should one free variable create?',
        variables: [
          { name: 'rank_u', value: '2', meaning: 'Two pivot directions.' },
          { name: 'nullity', value: '1', meaning: '3 columns − rank 2.' },
        ],
        after: {
          title: 'Pivot columns retained; one column is free',
          description:
            'Blue columns determine the pivot coordinates. The dashed column supplies the free coordinate.',
          equation: 'pivot variables: x₁, x₂ · free variable: x₃',
          matrices: [
            {
              label: 'U · columns classified',
              values: [
                [2, 4, 2],
                [0, 1, 1],
              ],
              cellTones: {
                ...toneColumn(0, 2, 'source'),
                ...toneColumn(1, 2, 'source'),
                ...toneColumn(2, 2, 'target'),
              },
            },
          ],
        },
      },
      {
        code: 'U_pivot = U[:rank_u, pivots]\nU_free = U[:rank_u, free]\nX_pivot = np.linalg.solve(U_pivot, -U_free)\nN = np.eye(3)[:, free]\nN[pivots, :] = X_pivot\ncheck = A @ N',
        lineNotes: [
          {
            action: 'Collects the two pivot columns.',
            shape: 'U: (2, 3) → U_pivot: (2, 2)',
            operation: 'Selects columns 0 and 1 from both nonzero rows.',
          },
          {
            action: 'Collects the one free column.',
            shape: 'U: (2, 3) → U_free: (2, 1)',
            operation: 'Advanced indexing keeps column 2 as a 2-D column.',
          },
          {
            action:
              'Solves for the pivot coordinates when the free value is 1.',
            shape: '(2, 2) solve (2, 1) → X_pivot: (2, 1)',
            operation: 'U_pivot X_pivot = −U_free → X_pivot = [1, −1]ᵀ.',
          },
          {
            action: 'Starts the basis with 1 in the free-variable row.',
            shape: 'I₃: (3, 3) → N: (3, 1)',
            operation: 'Selecting column 2 produces [0, 0, 1]ᵀ.',
          },
          {
            action: 'Inserts the solved pivot coordinates.',
            shape: 'X_pivot: (2, 1) → selected rows of N: (2, 1)',
            operation: 'N becomes [1, −1, 1]ᵀ.',
          },
          {
            action: 'Verifies that the basis vector disappears under A.',
            shape: '(2, 3) @ (3, 1) → check: (2, 1)',
            operation: 'A @ N = [0, 0]ᵀ.',
          },
        ],
        title: 'Construct and verify the null basis',
        explanation:
          'Set the free coordinate to 1, solve for the pivot coordinates, then place all three coordinates in their original rows.',
        watchFor: 'Which weighted combination of A’s columns cancels to zero?',
        variables: [
          {
            name: 'N.shape',
            value: '(3, 1)',
            meaning: 'One basis vector because nullity is one.',
          },
          {
            name: 'check',
            value: '[[0], [0]]',
            meaning: 'The visible certificate that N lies in Null(A).',
          },
        ],
        after: {
          title: 'The three weighted columns cancel',
          description:
            'Every null vector is a scalar multiple of this one basis vector.',
          equation: 'N = [1, −1, 1]ᵀ · A N = a₁ − a₂ + a₃ = 0',
          matrices: [
            {
              label: 'X_pivot',
              values: [[1], [-1]],
              cellTones: toneCells(
                [
                  [0, 0],
                  [1, 0],
                ],
                'source',
              ),
            },
            {
              label: 'N · null-space basis',
              values: [[1], [-1], [1]],
              cellTones: {
                ...toneCells(
                  [
                    [0, 0],
                    [1, 0],
                  ],
                  'source',
                ),
                ...toneCells([[2, 0]], 'target'),
              },
            },
            {
              label: 'A @ N',
              values: [[0], [0]],
              cellTones: toneCells(
                [
                  [0, 0],
                  [1, 0],
                ],
                'result',
              ),
            },
          ],
          callout:
            'Scaling N by any t keeps the output zero: A(tN) = t(AN) = 0.',
        },
      },
    ],
  },
};
