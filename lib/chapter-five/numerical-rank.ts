import { maintainedNotebook, line } from '@/lib/chapter-four/common';
import { sourceLinks, type ChapterSection } from '@/lib/chapter/shared';

const notebook = maintainedNotebook('Ch5-4 Test of Linear Independence.ipynb');
const original = sourceLinks(notebook.filename);

export const numericalRankSection: ChapterSection = {
  ...notebook,
  slug: 'numerical-rank',
  number: '5.4',
  title: 'Linear Independence and Numerical Rank',
  shortTitle: 'Numerical rank',
  summary:
    'Distinguish an exactly zero singular value from a small scale that a tolerance discards.',
  focus: 'Rank · Tolerance',
  learningGoal:
    'Use the singular values to tell exact dependence from near dependence at a stated resolution.',
  lectureConcepts: [
    'Rank and nullity',
    'Singular values and Gram matrices',
    'Spectral condition number',
  ],
  codeExtension:
    'Use a relative tolerance in floating point and compare the direct SVD with forming the Gram matrix.',
  notebookNote:
    'Compare two cutoffs, rescale the input, and observe what changes when the perturbation is exactly zero.',
  lectureNotes: {
    reference:
      'Wooseok Ha, MAS110 Lecture 5, printed slides 26, 29–30, 40–42, and 60. The numerical tolerance experiment is a coding extension.',
    introduction:
      'The lecture counts positive singular values to find the exact rank. With floating-point inputs, the count of useful directions depends on how small a scale can be distinguished from noise or roundoff.',
    notation: [
      {
        symbol: '$r=\\operatorname{rank}(A)$',
        meaning:
          'Exact rank counts the positive singular values. The columns of an $n\\times d$ matrix are independent exactly when $r=d$.',
      },
      {
        symbol: '$\\tau$',
        meaning:
          'A numerical cutoff. Count $\\sigma_i>\\tau$ to obtain an effective rank. This example sets $\\tau=\\mathrm{rtol}\\,\\sigma_1$.',
      },
      {
        symbol: '$A^{\\top}A$',
        meaning:
          'The feature-space Gram matrix. Its eigenvalues are $\\sigma_i^2$, with additional zeros if needed to fill the $d$-dimensional space.',
      },
    ],
    reasoningTitle: 'When a direction disappears from the computation',
    reasoning: [
      {
        title: 'A small stretch is still a stretch',
        paragraphs: [
          'The second column is the first column plus $\\varepsilon$ in its second entry. For $\\varepsilon\\ne 0$ this creates a new direction. A unit vector close to $(1,-1)^{\\top}/\\sqrt{2}$ nearly cancels the two columns, so the smallest singular value is tiny.',
        ],
        equation:
          '$\\left\\lVert A(1,-1)^{\\top}/\\sqrt{2}\\right\\rVert_2=|\\varepsilon|/\\sqrt{2}$',
      },
      {
        title: 'Use the scale of the input when setting a cutoff',
        paragraphs: [
          'Multiplying $A$ by a nonzero scalar multiplies all singular values by the magnitude of that scalar. A relative cutoff scales with them. NumPy’s default matrix-rank threshold for this example is the largest singular value times the larger dimension times machine epsilon. A data-specific noise level can call for a different cutoff.',
        ],
        equation:
          '$\\tau_{\\mathrm{default}}=\\sigma_1\\max(n,d)\\,\\varepsilon_{\\mathrm{mach}}$',
      },
      {
        title: 'The Gram identity is exact algebra',
        paragraphs: [
          'In exact arithmetic $A^{\\top}Av_i=\\sigma_i^2v_i$. In this experiment, forming the Gram matrix adds $10^{-16}$ to $1$, which rounds back to $1$ in double precision. The direct SVD still sees a nonzero small direction. The eigenvalue identity explains the connection, and computing the SVD directly avoids forming this rounded Gram matrix.',
        ],
        equation: '$\\lambda_i(A^{\\top}A)=\\sigma_i^2$',
      },
    ],
    checks: [
      {
        question: 'What if $\\varepsilon=0$ exactly?',
        answer:
          'The columns coincide, $(1,-1)^{\\top}$ is in the null space, and the exact rank is one.',
      },
      {
        question: 'Does changing the cutoff change the matrix’s exact rank?',
        answer:
          'The cutoff changes the effective rank of the computation. At the stated nonzero $\\varepsilon$ the exact rank is two under either cutoff.',
      },
    ],
    references: [
      {
        title: 'NumPy numerical rank',
        url: 'https://numpy.org/doc/stable/reference/generated/numpy.linalg.matrix_rank.html',
      },
      { title: 'Original Chapter 5.4 notebook', url: original.githubUrl },
    ],
  },
  primer: [
    {
      term: 'Exact independence',
      definition:
        'Only the zero input maps to zero when all columns are independent.',
      relation: '$\\operatorname{Null}(A)=\\{0\\}$',
      watchFor: 'A tiny nonzero perturbation can make the columns independent.',
    },
    {
      term: 'Effective rank',
      definition:
        'Count directions whose stretch exceeds the chosen resolution.',
      relation: '$\\sigma_i>\\tau$',
      watchFor: 'Report the cutoff along with the count.',
    },
  ],
  walkthrough: {
    title: 'Count directions at two resolutions',
    eyebrow: 'Floating-point experiment · NumPy',
    objective:
      'Follow one small singular value through direct SVD, rank cutoffs, and the Gram matrix.',
    initial: {
      title: 'Nearly identical columns',
      description: 'In exact arithmetic the second row separates the columns.',
      matrices: [
        {
          label: '$A$',
          values: [
            [1, 1],
            [0, '1e-8'],
            [0, 0],
          ],
        },
      ],
    },
    steps: [
      {
        title: 'Compute singular values directly',
        explanation:
          'The small entry is enough to give a second nonzero stretch.',
        watchFor: 'How far apart are the two scales?',
        code: [
          'import numpy as np',
          'eps = 1e-8',
          'A = np.array([[1., 1.], [0., eps], [0., 0.]])',
          's = np.linalg.svd(A, compute_uv=False)',
        ].join('\n'),
        lineNotes: [
          line('Load NumPy.', 'Module', 'Use a direct SVD.'),
          line(
            'Set a small nonzero perturbation.',
            'Scalar',
            'This will distinguish the two columns.',
          ),
          line(
            'Create the tall matrix.',
            '$3\\times2$',
            'The second column has a nonzero second entry.',
          ),
          line(
            'Measure both stretches.',
            'Length 2',
            'The smaller one is approximately $\\varepsilon/\\sqrt{2}$.',
          ),
        ],
        after: {
          title: 'Two positive singular values',
          description:
            'The second stretch is around eight orders of magnitude smaller than the first.',
          matrices: [
            {
              label: 'Direct singular values · rounded',
              values: [[1.414, '7.071e-9']],
            },
          ],
        },
      },
      {
        title: 'Compare two relative cutoffs',
        explanation:
          'The loose cutoff treats the nearly canceled direction as zero. The tighter cutoff retains it.',
        watchFor:
          'Does multiplying every entry by a million change either count?',
        code: [
          'rtols = np.array([1e-6, 1e-10])',
          'ranks = [np.count_nonzero(s > t * s[0]) for t in rtols]',
          's_scaled = np.linalg.svd(1e6 * A, compute_uv=False)',
          'scaled_ranks = [np.count_nonzero(s_scaled > t * s_scaled[0]) for t in rtols]',
        ].join('\n'),
        lineNotes: [
          line(
            'Choose two relative thresholds.',
            'Length 2',
            'Try a threshold above and one below the relative size of the smaller stretch.',
          ),
          line(
            'Count retained directions for each cutoff.',
            'Two integers',
            'Multiply each threshold by the largest singular value.',
          ),
          line(
            'Rescale the input and recompute.',
            'Length 2',
            'Both singular values grow by a factor of a million.',
          ),
          line(
            'Count again using the new scale.',
            'Two integers',
            'The relative counts agree.',
          ),
        ],
        after: {
          title: 'Rank depends on the stated resolution',
          description:
            'Each row compares the original and rescaled matrices. The first row uses the looser cutoff and the second uses the tighter cutoff.',
          matrices: [
            {
              label: 'Numerical ranks · original, rescaled',
              values: [
                [1, 1],
                [2, 2],
              ],
            },
          ],
        },
      },
      {
        title: 'Compare the Gram matrix',
        explanation:
          'The squared perturbation rounds away when added to the bottom-right entry.',
        watchFor: 'Which matrix now appears rank one in floating point?',
        code: [
          'G = A.T @ A',
          'gram_eigenvalues = np.linalg.eigvalsh(G)',
          'default_rank = np.linalg.matrix_rank(A)',
        ].join('\n'),
        lineNotes: [
          line(
            'Form the matrix of column inner products.',
            '$2\\times2$',
            'The exact bottom-right entry is $1+\\varepsilon^2$.',
          ),
          line(
            'Compute symmetric eigenvalues.',
            'Length 2',
            'The rounded Gram matrix has an eigenvalue zero.',
          ),
          line(
            'Count singular values with NumPy’s default cutoff.',
            'Integer',
            'The direct numerical-rank computation retains both directions.',
          ),
        ],
        after: {
          title: 'The squared scale disappears',
          description:
            'The rounded Gram matrix has eigenvalues zero and two. The default rank of the original matrix is still two.',
          matrices: [
            {
              label: 'Rounded $A^{\\top}A$',
              values: [
                [1, 1],
                [1, 1],
              ],
            },
          ],
        },
      },
    ],
  },
};
