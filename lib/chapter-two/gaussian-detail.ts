import type { ChapterSection } from './shared';
import { sourceLinks, toneCells, toneRow } from './shared';

const filename = 'Ch2-4 Gaussian elimination in detail (Optional).ipynb';
const links = sourceLinks(filename);

export const gaussianDetailSection: ChapterSection = {
  slug: 'gaussian-detail',
  number: '2.4',
  title: 'Gaussian Elimination in Detail',
  shortTitle: 'Elimination in detail',
  summary:
    'Open the LU black box with one row swap and two visible cancellations.',
  focus: 'choose pivot → swap → cancel',
  learningGoal:
    'Choose a stable pivot, compute an elimination multiplier, and explain why the row update creates a zero.',
  lectureConcepts: [
    'Partial pivoting',
    'Row exchange',
    'Elimination multiplier',
    'Upper-triangular form',
  ],
  codeExtension:
    'The full optional notebook turns these same actions into nested loops and reconstructs the permutation and lower factors.',
  filename,
  ...links,
  optional: true,
  primer: [
    {
      term: 'Partial pivoting',
      definition:
        'Choose the largest absolute candidate in the active column and move it into the pivot position.',
      relation: 'pivot = arg max_{i ≥ r} |U[i,j]|',
      watchFor: 'The first pivot moves from row 2 to row 1.',
    },
    {
      term: 'Multiplier',
      definition:
        'Divide the target entry by the pivot to find how much of the pivot row to subtract.',
      relation: 'm = target / pivot',
      watchFor: 'Both nonzero multipliers in this example are 0.5.',
    },
    {
      term: 'Row update',
      definition:
        'Subtracting m times the pivot row makes the active target entry zero.',
      relation: 'target row ← target row − m × pivot row',
      watchFor: 'Only the target row changes.',
    },
  ],
  walkthrough: {
    eyebrow: 'Lab 2.4 · Optional guided example',
    title: 'Make each elimination step visible',
    objective:
      'Instead of tracing the full 10×10 function, this page performs the two essential cancellations by hand. The notebook link keeps the complete loop available.',
    source: {
      filename,
      url: links.githubUrl,
      note: 'The source implements the general loop; this trace isolates its pivot and row-update ideas.',
    },
    initial: {
      title: 'Look below the diagonal',
      description:
        'Gaussian elimination will turn the two highlighted lower-triangle positions into zeros.',
      equation: 'goal: U[2,0] = 0 and U[2,1] = 0',
    },
    steps: [
      {
        code: 'import numpy as np\nA = np.array([[0., 2., 2.], [4., 4., 0.], [2., 3., 2.]])\nU = A.copy()',
        lineNotes: [
          { action: 'Loads NumPy for the pivot search and row operations.' },
          { action: 'Creates the same small matrix used in Lab 2.1.' },
          { action: 'Copies A so the original matrix stays unchanged.' },
        ],
        title: 'Copy the matrix',
        explanation:
          'Working on U keeps A available for a later reconstruction check in the full algorithm.',
        watchFor: 'The first pivot candidate U[0,0] is zero.',
        after: {
          title: 'U starts as a copy of A',
          description: 'The first active column contains 0, 4, and 2.',
          matrices: [
            {
              label: 'U · start',
              values: [
                [0, 2, 2],
                [4, 4, 0],
                [2, 3, 2],
              ],
              cellTones: toneCells(
                [
                  [0, 0],
                  [1, 0],
                  [2, 0],
                ],
                'target',
              ),
            },
          ],
        },
      },
      {
        code: 'pivot = np.argmax(np.abs(U[:, 0]))\nU[[0, pivot]] = U[[pivot, 0]]',
        lineNotes: [
          {
            action:
              'Finds the row index of the largest first-column magnitude.',
          },
          { action: 'Swaps that row into the first pivot position.' },
        ],
        title: 'Move the best pivot into place',
        explanation:
          'The largest first-column value is 4 at row index 1, so rows 0 and 1 exchange positions.',
        watchFor: 'The row beginning with 4 becomes the first row.',
        variables: [
          { name: 'pivot', value: '1', meaning: 'Zero-based row index.' },
        ],
        after: {
          title: 'The pivot is now 4',
          description:
            'Row exchange changes the equation order, not the solution set.',
          matrices: [
            {
              label: 'U · after swap',
              values: [
                [4, 4, 0],
                [0, 2, 2],
                [2, 3, 2],
              ],
              cellTones: toneRow(0, 3, 'source'),
            },
          ],
        },
      },
      {
        code: 'm = U[2, 0] / U[0, 0]\nU[2] = U[2] - m * U[0]',
        lineNotes: [
          { action: 'Divides the target 2 by the pivot 4.' },
          { action: 'Subtracts half of the pivot row from the target row.' },
        ],
        title: 'Cancel below the first pivot',
        explanation:
          'Because 2 − 0.5×4 = 0, the first entry of the last row disappears.',
        watchFor: 'The target row changes from [2, 3, 2] to [0, 1, 2].',
        variables: [
          {
            name: 'm',
            value: '0.5',
            meaning: 'The first elimination multiplier.',
          },
        ],
        after: {
          title: 'The first lower entry is zero',
          description: 'Only the last row changed.',
          equation: '[2, 3, 2] − 0.5[4, 4, 0] = [0, 1, 2]',
          matrices: [
            {
              label: 'U · after column 1',
              values: [
                [4, 4, 0],
                [0, 2, 2],
                [0, 1, 2],
              ],
              cellTones: {
                ...toneRow(0, 3, 'source'),
                ...toneRow(2, 3, 'target'),
                '2-0': 'result',
              },
            },
          ],
        },
      },
      {
        code: 'm = U[2, 1] / U[1, 1]\nU[2] = U[2] - m * U[1]\nis_upper = np.allclose(np.tril(U, -1), 0)',
        lineNotes: [
          { action: 'Divides the next target 1 by the next pivot 2.' },
          { action: 'Subtracts half of the second row from the last row.' },
          { action: 'Checks that every entry below the diagonal is now zero.' },
        ],
        title: 'Cancel below the second pivot',
        explanation:
          'The same rule repeats one column to the right: 1 − 0.5×2 = 0.',
        watchFor: 'The last row becomes [0, 0, 1].',
        variables: [
          { name: 'm', value: '0.5', meaning: 'The second multiplier.' },
          {
            name: 'is_upper',
            value: 'True',
            meaning: 'Elimination is complete.',
          },
        ],
        after: {
          title: 'U is upper triangular',
          description:
            'The two required zeros are now visible below the diagonal.',
          equation: 'is_upper = True',
          matrices: [
            {
              label: 'U · final',
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
            'The full notebook places these same actions inside pivot and row loops.',
        },
      },
    ],
  },
};
