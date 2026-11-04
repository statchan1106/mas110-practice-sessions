import { maintainedNotebook, line } from '@/lib/chapter-four/common';
import { sourceLinks, type ChapterSection } from '@/lib/chapter/shared';

const notebook = maintainedNotebook('Ch5-2 SVD and Projections.ipynb');
const original = sourceLinks(notebook.filename);

export const projectionsSection: ChapterSection = {
  ...notebook,
  slug: 'svd-projections',
  number: '5.2',
  title: 'Pseudoinverse and Orthogonal Projections',
  shortTitle: 'Pseudoinverse',
  summary:
    'Use a rectangular, rank-deficient matrix to separate the fitted output from the minimum-norm input.',
  focus: 'Projectors · Least squares',
  learningGoal:
    'Build the pseudoinverse from positive singular values and distinguish its input and output projectors.',
  lectureConcepts: [
    'Moore–Penrose pseudoinverse',
    'Penrose identities',
    'Row space and column space',
    'Least squares',
  ],
  notebookNote:
    'Run the same rectangular example and test all four Penrose conditions.',
  lectureNotes: {
    reference:
      'Wooseok Ha, MAS110 Lecture 5, printed slides 49–59, especially equations (5.18), (5.19), and (5.22).',
    introduction:
      'Lecture 4 found the closest reachable output. Lecture 5 shows that a pseudoinverse can produce it for any matrix. This rectangular example gives the input and output projectors different dimensions so their jobs are visible.',
    notation: [
      {
        symbol: '$A^+=VD^{-1}U^{\\top}$',
        meaning:
          'Invert only the $r$ positive singular values in the compact SVD. The pseudoinverse maps from $\\mathbb{R}^n$ to $\\mathbb{R}^d$.',
      },
      {
        symbol: '$AA^+=UU^{\\top}$',
        meaning:
          'An $n\\times n$ projector onto $\\operatorname{Col}(A)$ in output space.',
      },
      {
        symbol: '$A^+A=VV^{\\top}$',
        meaning:
          'A $d\\times d$ projector onto the row space in input space. Its complementary subspace is $\\operatorname{Null}(A)$.',
      },
      {
        symbol: '$\\hat{x}$ and $\\hat{b}$',
        meaning:
          '$\\hat{x}=A^+b$ gives a least-squares input and $\\hat{b}=A\\hat{x}$ gives the unique fitted output.',
      },
    ],
    reasoningTitle: 'Two projectors, two spaces',
    reasoning: [
      {
        title: 'Cancel the compact factors in the right order',
        paragraphs: [
          'Using $V^{\\top}V=I_r$ and $DD^{-1}=I_r$ gives $AA^+=UU^{\\top}$. Canceling $U^{\\top}U$ instead gives $A^+A=VV^{\\top}$. Both products are symmetric and idempotent. Together with $AA^+A=A$ and $A^+AA^+=A^+$, their symmetry gives the Penrose conditions.',
        ],
      },
      {
        title: 'Project first, then choose an input',
        paragraphs: [
          'The residual $b-\\hat{b}$ is orthogonal to the column space. Every minimizer has the same fitted output and can be written as $\\hat{x}+z$ with $z\\in\\operatorname{Null}(A)$. The vector $\\hat{x}$ lies in the row space, perpendicular to $z$. Pythagoras therefore makes it the unique minimizer of input length among all least-squares solutions.',
        ],
        equation:
          '$\\lVert\\hat{x}+z\\rVert_2^2=\\lVert\\hat{x}\\rVert_2^2+\\lVert z\\rVert_2^2$',
      },
    ],
    checks: [
      {
        question: 'Which projector acts on the observed vector $b$?',
        answer:
          '$AA^+$, because $b$ has $n$ entries. Its image is the space of outputs the matrix can reach.',
      },
      {
        question:
          'Can adding $(1,-1,0)^{\\top}$ to $\\hat{x}$ improve the fit?',
        answer:
          'It gives exactly the same fit. It lies in the null space and increases the squared input length by $2$.',
      },
    ],
    references: [
      {
        title: 'NumPy pseudoinverse',
        url: 'https://numpy.org/doc/stable/reference/generated/numpy.linalg.pinv.html',
      },
      { title: 'Original Chapter 5.2 notebook', url: original.githubUrl },
    ],
  },
  primer: [
    {
      term: 'Reciprocal scale',
      definition:
        'Undo the positive stretch from each singular triplet and reverse its direction of travel.',
      relation: '$A^+u_i=v_i/\\sigma_i$',
      watchFor: 'Keep the zero-scale slots out of the reciprocal.',
    },
    {
      term: 'Projection residual',
      definition: 'The observed part that no input can reproduce.',
      relation: '$A^{\\top}(b-AA^+b)=0$',
      watchFor:
        'The residual can be nonzero even when the least-squares optimum has been reached.',
    },
  ],
  walkthrough: {
    title: 'Find the nearest reachable output and its shortest input',
    eyebrow: 'Worked example · NumPy',
    objective:
      'Trace the two projection matrices and compare two inputs that produce the same output.',
    initial: {
      title: 'A map with four outputs and three inputs',
      description:
        'The first two columns coincide. Every reachable output has equal first and second entries and a zero fourth entry.',
      matrices: [
        {
          label: '$A$',
          values: [
            [1, 1, 0],
            [1, 1, 0],
            [0, 0, 1],
            [0, 0, 0],
          ],
        },
        { label: '$b$', values: [[1], [3], [2], [4]] },
      ],
    },
    steps: [
      {
        title: 'Invert the two nonzero scales',
        explanation:
          'The duplicate columns give one zero singular value in exact arithmetic. For this example a cutoff of $10^{-12}$ separates it from the two positive scales.',
        watchFor: 'How many rows does the pseudoinverse have?',
        code: [
          'import numpy as np',
          'A = np.array([[1., 1., 0.], [1., 1., 0.], [0., 0., 1.], [0., 0., 0.]])',
          'b = np.array([1., 3., 2., 4.])',
          'U, s, Vt = np.linalg.svd(A, full_matrices=False)',
          'keep = s > 1e-12',
          'A_plus = (Vt[keep, :].T / s[keep]) @ U[:, keep].T',
        ].join('\n'),
        lineNotes: [
          line('Load NumPy.', 'Module', 'Use the reduced SVD.'),
          line(
            'Set up a rectangular map.',
            '$4\\times3$',
            'Columns one and two store the same direction.',
          ),
          line(
            'Enter an observed output.',
            'Length 4',
            'The fourth entry is outside the reachable subspace.',
          ),
          line(
            'Extract the reduced factors.',
            '$4\\times3$, length 3, $3\\times3$',
            'The right vectors arrive as rows in `Vt`.',
          ),
          line(
            'Select the two positive scales numerically.',
            'Boolean mask of length 3',
            'The threshold is specific to the scale of this example.',
          ),
          line(
            'Reverse the map on the retained directions.',
            '$3\\times2$ by $2\\times4$',
            'Divide each retained right column by its scale and multiply by the transpose of the retained left columns.',
          ),
        ],
        after: {
          title: 'The map from observations to inputs',
          description: 'The pseudoinverse has three rows and four columns.',
          equation: '$A^+=VD^{-1}U^{\\top}$',
          matrices: [
            {
              label: '$A^+$',
              values: [
                [0.25, 0.25, 0, 0],
                [0.25, 0.25, 0, 0],
                [0, 0, 1, 0],
              ],
            },
          ],
        },
      },
      {
        title: 'Apply the output projector',
        explanation:
          'The first two output entries become their average. The third is unchanged and the fourth drops out.',
        watchFor: 'What happens to the fourth entry of $b$ in the residual?',
        code: [
          'P_col = A @ A_plus',
          'b_hat = P_col @ b',
          'residual = b - b_hat',
        ].join('\n'),
        lineNotes: [
          line(
            'Build the output projector.',
            '$4\\times4$',
            'Compose the pseudoinverse with the forward map.',
          ),
          line(
            'Find the nearest reachable output.',
            'Length 4',
            'The first two entries both become $2$.',
          ),
          line(
            'Subtract the fit from the observation.',
            'Length 4',
            'The fourth residual entry is $4$.',
          ),
        ],
        after: {
          title: 'Fit and residual',
          description:
            'The first two residual entries cancel against either of the repeated columns.',
          equation: '$A^{\\top}(b-\\hat{b})=0$',
          matrices: [
            { label: '$\\hat{b}$', values: [[2], [2], [2], [0]] },
            { label: '$b-\\hat{b}$', values: [[-1], [1], [0], [4]] },
          ],
        },
      },
      {
        title: 'Compare two least-squares inputs',
        explanation:
          'The row-space projector removes the null-space shift from the alternative input.',
        watchFor: 'Which input has smaller squared length?',
        code: [
          'P_row = A_plus @ A',
          'x_hat = A_plus @ b',
          'x_other = x_hat + np.array([1., -1., 0.])',
          'x_projected = P_row @ x_other',
        ].join('\n'),
        lineNotes: [
          line(
            'Build the input projector.',
            '$3\\times3$',
            'Reverse the order of the two factors.',
          ),
          line(
            'Compute the minimum-norm input.',
            'Length 3',
            'The first two coordinates split their contribution equally.',
          ),
          line(
            'Add a null-space direction.',
            'Length 3',
            'The first input increases by one and the second decreases by one.',
          ),
          line(
            'Recover the row-space input.',
            'Length 3',
            'Projection removes the shift and returns $\\hat{x}$.',
          ),
        ],
        after: {
          title: 'Different inputs, same output',
          description:
            'The two squared input lengths are $6$ and $8$. Both inputs map to the same fit.',
          equation: '$A\\hat{x}=Ax_{\\mathrm{other}}=\\hat{b}$',
          matrices: [
            { label: '$\\hat{x}$', values: [[1], [1], [2]] },
            { label: 'Shifted input', values: [[2], [0], [2]] },
          ],
        },
      },
    ],
  },
};
