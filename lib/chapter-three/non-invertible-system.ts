import type { ChapterSection } from '@/lib/chapter/shared';
import { sourceLinks, toneCells, toneRow } from '@/lib/chapter/shared';

const filename = 'Ch3-3 Solving Non-invertible Linear System.ipynb';
const links = sourceLinks(filename);

export const nonInvertibleSystemSection: ChapterSection = {
  slug: 'non-invertible-system',
  number: '3.3',
  title: 'Solving Non-invertible Systems',
  shortTitle: 'Non-invertible systems',
  summary:
    'Compare a reachable and unreachable target, then trace the full solution family.',
  focus: 'test reachability → describe every solution',
  learningGoal:
    'Decide whether Ax = b is consistent, then express every solution as one particular solution plus a null-space direction.',
  lectureConcepts: [
    'Column space',
    'Rank',
    'Consistency',
    'Particular and homogeneous solutions',
  ],
  codeExtension:
    'The full notebook packages elimination and solution construction into a reusable function for larger systems.',
  filename,
  ...links,
  primer: [
    {
      term: 'Column space',
      definition:
        'The column space contains every output that can be produced by some input x.',
      relation: 'Ax = b is solvable exactly when b ∈ Col(A)',
      watchFor: 'A rank-one matrix reaches only a line in the output plane.',
    },
    {
      term: 'Consistency test',
      definition:
        'Adding b as a new column must not create an additional independent direction.',
      relation: 'rank(A) = rank([A | b])',
      watchFor: 'A reduced row [0, 0 | c] with c ≠ 0 is a contradiction.',
    },
    {
      term: 'Solution family',
      definition:
        'One solution reaches b; any null-space direction can then be added without changing that output.',
      relation: 'x = xₚ + tn, where An = 0',
      watchFor: 'Every point on the solution line maps to the same b.',
    },
  ],
  walkthrough: {
    eyebrow: 'Lab 3.3 · Guided example',
    title: 'See which targets a singular matrix can reach',
    objective:
      'Use one rank-one matrix and two nearby targets so reachability, contradiction, and non-uniqueness are all visible.',
    source: {
      filename,
      url: links.githubUrl,
      note: 'The full source builds a general solver; this deterministic example keeps the rank-deficient structure visible from start to finish.',
    },
    initial: {
      title: 'A collapses the input plane onto one output line',
      description:
        'The second column is twice the first, so both columns point along the same direction.',
      equation: 'Col(A) = span([1,2]ᵀ) · rank(A) = 1',
      matrices: [
        {
          label: 'A · dependent columns',
          values: [
            [1, 2],
            [2, 4],
          ],
          cellTones: {
            ...toneCells(
              [
                [0, 0],
                [1, 0],
              ],
              'source',
            ),
            ...toneCells(
              [
                [0, 1],
                [1, 1],
              ],
              'muted',
            ),
          },
        },
      ],
    },
    steps: [
      {
        code: 'import numpy as np\nA = np.array([[1., 2.], [2., 4.]])\nb_good = np.array([3., 6.])\nb_bad = np.array([3., 7.])',
        lineNotes: [
          {
            action: 'Loads NumPy for arrays, ranks, and matrix products.',
            shape: '— (module import)',
            operation: 'Binds NumPy to the short name np.',
          },
          {
            action: 'Creates a singular matrix with dependent columns.',
            shape: 'nested rows → A: (2, 2)',
            operation: 'Column 2 equals 2 × column 1, so rank(A) = 1.',
          },
          {
            action: 'Chooses a target on the reachable line.',
            shape: '2 values → b_good: (2,)',
            operation: '[3,6] = 3[1,2], so b_good belongs to Col(A).',
          },
          {
            action: 'Chooses a nearby target off the line.',
            shape: '2 values → b_bad: (2,)',
            operation: '[3,7] is not a multiple of [1,2].',
          },
        ],
        title: 'Place two targets beside the column space',
        explanation:
          'The matrix can reach every point on one line, but no point outside it.',
        watchFor: 'Which target lies exactly on the blue column-space line?',
        variables: [
          {
            name: 'A.shape',
            value: '(2, 2)',
            meaning: 'Two input and two output coordinates.',
          },
          {
            name: 'rank(A)',
            value: '1',
            meaning: 'Only one independent output direction.',
          },
        ],
        after: {
          title: 'Only b_good lies in Col(A)',
          description:
            'The solid green vector ends on the reachable line; the amber vector ends outside it.',
          equation: 'b_good ∈ Col(A) · b_bad ∉ Col(A)',
          plane: {
            xRange: [-1, 5],
            yRange: [-2, 9],
            xLabel: 'b₁',
            yLabel: 'b₂',
            lines: [
              {
                from: [-0.75, -1.5],
                to: [3.75, 7.5],
                label: 'Col(A)',
                tone: 'source',
              },
            ],
            vectors: [
              { to: [3, 6], label: 'b_good', tone: 'result' },
              { to: [3, 7], label: 'b_bad', tone: 'target', dashed: true },
            ],
          },
        },
      },
      {
        code: 'good_reduced = np.column_stack((A, b_good))\nbad_reduced = np.column_stack((A, b_bad))\ngood_reduced[1] -= 2 * good_reduced[0]\nbad_reduced[1] -= 2 * bad_reduced[0]',
        lineNotes: [
          {
            action: 'Appends the reachable target to A.',
            shape: 'A: (2, 2) + b_good: (2,) → (2, 3)',
            operation: 'Creates the augmented matrix [A | b_good].',
          },
          {
            action: 'Appends the unreachable target to A.',
            shape: 'A: (2, 2) + b_bad: (2,) → (2, 3)',
            operation: 'Creates the augmented matrix [A | b_bad].',
          },
          {
            action: 'Eliminates row 2 in the reachable system.',
            shape: 'row (3,) − scalar × row (3,) → row (3,)',
            operation: '[2,4,6] − 2[1,2,3] → [0,0,0].',
          },
          {
            action: 'Applies the same elimination to the other system.',
            shape: 'row (3,) − scalar × row (3,) → row (3,)',
            operation: '[2,4,7] − 2[1,2,3] → [0,0,1].',
          },
        ],
        title: 'Reveal consistency with one row operation',
        explanation:
          'The coefficient entries cancel in both systems. The right-hand side decides whether the last row is valid or contradictory.',
        watchFor: 'Does the last row say 0 = 0 or 0 = 1?',
        variables: [
          {
            name: 'good_reduced[1]',
            value: '[0, 0, 0]',
            meaning: 'A redundant equation.',
          },
          {
            name: 'bad_reduced[1]',
            value: '[0, 0, 1]',
            meaning: 'The contradiction 0 = 1.',
          },
        ],
        after: {
          title: 'The final entry makes the difference',
          description:
            'Both coefficient rows become zero. Only the bad target leaves a nonzero right-hand side.',
          equation: 'good: 0 = 0 · bad: 0 = 1',
          matrices: [
            {
              label: 'good · [A | b_good]',
              values: [
                [1, 2, 3],
                [0, 0, 0],
              ],
              dividerBefore: 2,
              cellTones: toneRow(1, 3, 'result'),
            },
            {
              label: 'bad · [A | b_bad]',
              values: [
                [1, 2, 3],
                [0, 0, 1],
              ],
              dividerBefore: 2,
              cellTones: {
                ...toneCells(
                  [
                    [1, 0],
                    [1, 1],
                  ],
                  'muted',
                ),
                ...toneCells([[1, 2]], 'target'),
              },
            },
          ],
          callout:
            'The same row operation tests both targets: a nonzero value to the right of an all-zero coefficient row proves inconsistency.',
        },
      },
      {
        code: 'rank_A = np.linalg.matrix_rank(A)\nrank_good = np.linalg.matrix_rank(np.column_stack((A, b_good)))\nrank_bad = np.linalg.matrix_rank(np.column_stack((A, b_bad)))\ngood_solvable, bad_solvable = rank_A == rank_good, rank_A == rank_bad',
        lineNotes: [
          {
            action: 'Counts the independent columns of A.',
            shape: 'A: (2, 2) → rank_A: scalar',
            operation: 'The dependent columns give rank_A = 1.',
          },
          {
            action: 'Measures the augmented rank for b_good.',
            shape: 'augmented matrix: (2, 3) → rank_good: scalar',
            operation: 'b_good adds no direction, so rank_good = 1.',
          },
          {
            action: 'Measures the augmented rank for b_bad.',
            shape: 'augmented matrix: (2, 3) → rank_bad: scalar',
            operation: 'b_bad adds a new direction, so rank_bad = 2.',
          },
          {
            action: 'Compares each augmented rank with rank(A).',
            shape: 'two scalar comparisons → 2 booleans',
            operation: '1 = 1 gives True; 1 = 2 gives False.',
          },
        ],
        title: 'State the same test with rank',
        explanation:
          'A target is reachable exactly when appending it does not increase rank.',
        watchFor: 'Which augmented matrix gains one independent column?',
        variables: [
          {
            name: 'good_solvable',
            value: 'True',
            meaning: 'Ax = b_good has at least one solution.',
          },
          {
            name: 'bad_solvable',
            value: 'False',
            meaning: 'Ax = b_bad has no solution.',
          },
        ],
        after: {
          title: 'Rank turns the picture into a certificate',
          description:
            'The reachable target stays inside the old span; the other target expands it.',
          equation: 'rank(A) = rank([A | b]) ⇔ Ax = b is consistent',
          callout:
            'b_good: 1 = 1, so it is solvable. b_bad: 1 ≠ 2, so it is not.',
        },
      },
      {
        code: 'x_particular = np.array([3., 0.])\nnull_direction = np.array([-2., 1.])\nt = 1.5\nx = x_particular + t * null_direction\ncheck = A @ x',
        lineNotes: [
          {
            action: 'Chooses one input that reaches b_good.',
            shape: '2 values → x_particular: (2,)',
            operation: 'A @ [3,0] → [3,6].',
          },
          {
            action: 'Chooses the direction that A sends to zero.',
            shape: '2 values → null_direction: (2,)',
            operation: 'A @ [−2,1] → [0,0].',
          },
          {
            action: 'Selects one position along the solution line.',
            shape: 't: scalar',
            operation: 't = 1.5 scales the null direction.',
          },
          {
            action: 'Moves from the particular solution along the null space.',
            shape: '(2,) + scalar × (2,) → x: (2,)',
            operation: '[3,0] + 1.5[−2,1] → [0,1.5].',
          },
          {
            action: 'Checks the output of the new solution.',
            shape: '(2, 2) @ (2,) → check: (2,)',
            operation: 'A @ [0,1.5] → [3,6] = b_good.',
          },
        ],
        title: 'Trace the entire solution family',
        explanation:
          'Adding any multiple of a null direction changes the input but contributes zero to the output.',
        watchFor:
          'The input moves along a line while the output remains b_good.',
        variables: [
          {
            name: 'x',
            value: '[0, 1.5]',
            meaning: 'A second input that reaches b_good.',
          },
          {
            name: 'check',
            value: '[3, 6]',
            meaning: 'The output is unchanged.',
          },
        ],
        after: {
          title: 'Null-space motion creates infinitely many solutions',
          description:
            'The blue line contains every solution. The dashed move changes x without changing Ax.',
          equation: 'x = [3,0]ᵀ + t[−2,1]ᵀ · A x = [3,6]ᵀ',
          plane: {
            xRange: [-4, 4],
            yRange: [-1, 4],
            xLabel: 'x₁',
            yLabel: 'x₂',
            lines: [
              {
                from: [-3, 3],
                to: [3, 0],
                label: 'x₁ + 2x₂ = 3',
                tone: 'source',
              },
            ],
            segments: [
              {
                from: [3, 0],
                to: [0, 1.5],
                tone: 'target',
                dashed: true,
              },
            ],
            points: [
              { at: [3, 0], label: 'xₚ', tone: 'source' },
              { at: [0, 1.5], label: 'x at t = 1.5', tone: 'result' },
            ],
          },
          matrices: [
            {
              label: 'A @ x | b_good',
              values: [
                [3, 3],
                [6, 6],
              ],
              dividerBefore: 1,
              cellTones: {
                ...toneCells(
                  [
                    [0, 0],
                    [1, 0],
                  ],
                  'result',
                ),
                ...toneCells(
                  [
                    [0, 1],
                    [1, 1],
                  ],
                  'source',
                ),
              },
            },
          ],
          callout: 'Certificate: A(xₚ + tn) = Axₚ + tAn = b_good + 0 = b_good.',
        },
      },
    ],
  },
};
