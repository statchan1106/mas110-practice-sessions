import type { ChapterSection } from './shared';
import { sourceLinks, toneCells, toneRow } from './shared';

const filename = 'Ch2-3 Test LU-Decomposition.ipynb';
const links = sourceLinks(filename);

export const luDecompositionSection: ChapterSection = {
  slug: 'lu-decomposition',
  number: '2.3',
  title: 'Testing LU Decomposition',
  shortTitle: 'Testing LU',
  summary:
    'Build one deterministic rank-2 matrix, read SciPy’s LU factors, and verify the result.',
  focus: 'low rank → LU → check',
  learningGoal:
    'See what SciPy returns, why Q = P.T gives Q @ A = L @ U, and where rank deficiency appears.',
  lectureConcepts: [
    'Rank of a product',
    'Rectangular LU',
    'Permutation matrix',
    'Residual',
  ],
  codeExtension:
    'The full notebook generates random 10×11 matrices, repeats the test ten times, and plots the collected results.',
  filename,
  ...links,
  primer: [
    {
      term: 'Rank bound',
      definition:
        'A product with a two-dimensional middle space cannot have rank larger than two.',
      relation: 'A = X Y ⇒ rank(A) ≤ 2',
      watchFor: 'The third row of A will depend on another row.',
    },
    {
      term: 'Pivoted LU',
      definition:
        'SciPy returns A = P L U. Setting Q = P.T gives the course form Q A = L U.',
      relation: 'A = P L U ⇔ Q A = L U',
      watchFor: 'Q changes row order but not rank.',
    },
    {
      term: 'Residual',
      definition:
        'The residual compresses the reconstruction difference into one nonnegative number.',
      relation: '‖Q A − L U‖',
      watchFor: 'Use a tolerance for floating-point calculations.',
    },
  ],
  walkthrough: {
    eyebrow: 'Lab 2.3 · Guided example',
    title: 'Test LU once, with reproducible numbers',
    objective:
      'The notebook’s repeated random experiment is reduced to one deterministic 3×4 matrix so the rank and reconstruction are visible without a histogram.',
    source: {
      filename,
      url: links.githubUrl,
      note: 'The full source repeats this test with larger unseeded random matrices.',
    },
    initial: {
      title: 'Build rank into the example',
      description:
        'We will multiply a 3×2 matrix by a 2×4 matrix, forcing the result through a two-dimensional middle space.',
      equation: '(3×2)(2×4) → 3×4 with rank at most 2',
    },
    steps: [
      {
        code: 'import numpy as np\nimport scipy as sp\nX = np.array([[1., 0.], [0., 1.], [0., 2.]])\nY = np.array([[1., 2., 3., 4.], [2., 5., 7., 9.]])',
        lineNotes: [
          { action: 'Loads NumPy for arrays, ranks, and norms.' },
          { action: 'Loads SciPy for LU decomposition.' },
          { action: 'Creates a 3×2 left factor.' },
          { action: 'Creates a 2×4 right factor.' },
        ],
        title: 'Create two narrow factors',
        explanation:
          'The shared dimension is only 2, so the product cannot carry three independent row directions.',
        watchFor: 'X has two columns and Y has two rows.',
        after: {
          title: 'The factors are compatible',
          description:
            'The inner dimensions match and disappear in the product.',
          equation: 'X.shape = (3,2) · Y.shape = (2,4)',
          matrices: [
            {
              label: 'X',
              values: [
                [1, 0],
                [0, 1],
                [0, 2],
              ],
            },
            {
              label: 'Y',
              values: [
                [1, 2, 3, 4],
                [2, 5, 7, 9],
              ],
            },
          ],
        },
      },
      {
        code: 'A = X @ Y\nrank_A = np.linalg.matrix_rank(A)',
        lineNotes: [
          { action: 'Multiplies the two factors to create A.' },
          { action: 'Counts the independent directions in A.' },
        ],
        title: 'Create a rank-2 matrix',
        explanation:
          'The last row is twice the second row, so A has only two independent rows.',
        watchFor: 'A[2] = 2 × A[1].',
        variables: [
          {
            name: 'A.shape',
            value: '(3, 4)',
            meaning: 'A rectangular matrix.',
          },
          { name: 'rank_A', value: '2', meaning: 'One row is dependent.' },
        ],
        after: {
          title: 'The dependence is visible',
          description: 'The highlighted row is twice the row above it.',
          matrices: [
            {
              label: 'A = X @ Y',
              values: [
                [1, 2, 3, 4],
                [2, 5, 7, 9],
                [4, 10, 14, 18],
              ],
              cellTones: toneRow(2, 4, 'target'),
            },
          ],
          callout: 'rank(A) = 2, not 3.',
        },
      },
      {
        code: 'P, L, U = sp.linalg.lu(A)\nQ = P.T',
        lineNotes: [
          { action: 'Computes SciPy’s permutation, lower, and upper factors.' },
          {
            action:
              'Transposes P to express the factorization as Q @ A = L @ U.',
          },
        ],
        title: 'Read the LU factors',
        explanation:
          'Q moves the largest first-column row to the top. The dependent direction appears as a zero row in U.',
        watchFor: 'U has one complete zero row.',
        after: {
          title: 'U carries the rank deficiency',
          description:
            'L remains invertible, while U has only two nonzero rows.',
          equation: 'Q @ A = L @ U',
          matrices: [
            {
              label: 'Q @ A',
              values: [
                [4, 10, 14, 18],
                [1, 2, 3, 4],
                [2, 5, 7, 9],
              ],
            },
            {
              label: 'L',
              values: [
                [1, 0, 0],
                [0.25, 1, 0],
                [0.5, 0, 1],
              ],
            },
            {
              label: 'U',
              values: [
                [4, 10, 14, 18],
                [0, -0.5, -0.5, -0.5],
                [0, 0, 0, 0],
              ],
              cellTones: toneRow(2, 4, 'result'),
            },
          ],
        },
      },
      {
        code: 'residual = np.linalg.norm(Q @ A - L @ U)\nrank_U = np.linalg.matrix_rank(U)\nreconstructs = np.allclose(Q @ A, L @ U)\npassed = rank_A == rank_U == 2 and reconstructs',
        lineNotes: [
          { action: 'Measures the size of the reconstruction difference.' },
          { action: 'Computes the rank visible in U.' },
          {
            action: 'Checks the two reconstructed matrices within a tolerance.',
          },
          {
            action:
              'Combines the rank and reconstruction claims into one result.',
          },
        ],
        title: 'Test the mathematical claims',
        explanation:
          'A useful test checks both structure—rank 2—and computation—Q @ A agrees with L @ U.',
        watchFor:
          'Both ranks should be 2 and the residual should be zero here.',
        variables: [
          { name: 'passed', value: 'True', meaning: 'Both checks pass.' },
        ],
        after: {
          title: 'One compact test is enough for the idea',
          description:
            'The deterministic example gives the same result on every run.',
          equation: 'passed = True',
          matrices: [
            {
              label: 'check summary',
              values: [
                ['quantity', 'value'],
                ['rank(A)', 2],
                ['rank(U)', 2],
                ['residual', 0],
                ['reconstructs', 'True'],
              ],
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
            'Open Colab only when you are ready to repeat the experiment with random matrices.',
        },
      },
    ],
  },
};
