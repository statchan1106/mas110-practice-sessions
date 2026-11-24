import { line, maintainedNotebook } from '@/lib/chapter-four/common';
import { sourceLinks, type ChapterSection } from '@/lib/chapter/shared';

const notebook = maintainedNotebook('Ch7-2 Symmetric Eigenvalues.ipynb');
const original = sourceLinks(notebook.filename);
const matrix = {
  label: '$A$',
  values: [
    [5, 4],
    [4, 5],
  ],
};

export const symmetricEigenvaluesLab: ChapterSection = {
  ...notebook,
  slug: 'symmetric-eigenvalues',
  number: '7.2',
  title: 'Symmetric Eigenvalues',
  shortTitle: 'Symmetric eigenvalues',
  summary:
    'Order the eigenpairs of a small symmetric matrix, read a Rayleigh quotient, and see how one rank-one update moves the spectrum.',
  focus: 'Eigenpairs · Rayleigh quotient · Interlacing',
  learningGoal:
    'Keep eigenvalues paired with their columns, then use those directions to explain a quotient and check an eigenvalue update.',
  lectureConcepts: [
    'Orthogonal eigendecomposition',
    'Rayleigh quotient',
    'Rank-one PSD update',
    'Eigenvalue interlacing',
  ],
  notebookNote:
    'Run the same 2×2 example in Colab, then try a different direction or rank-one update.',
  lectureNotes: {
    reference:
      'Wooseok Ha, MAS110 Lecture 7, printed slides 19–22 for the Rayleigh quotient and 32–34 for PSD updates and interlacing.',
    introduction:
      'Use the same matrix as Lab 7.1. With its two eigendirections in view, we can measure how much each direction contributes and compare the spectrum before and after an update.',
    notation: [
      {
        symbol: '$Av_i=\\lambda_i(A)v_i$',
        meaning:
          'The lecture uses descending order. After reversing the NumPy output, column `V[:, 0]` is $v_1$ and `lam[0]` is $\\lambda_1(A)$.',
      },
      {
        symbol: '$R_A(x)$',
        meaning:
          'For $x\\ne0$, divide $x^\\top Ax$ by $x^\\top x$. In the lecture proof, $x_i=v_i^\\top x$ is a coordinate in the eigenbasis. The code stores those coordinates in `coords`.',
      },
    ],
    reasoningTitle: 'Why the code matches the lecture',
    reasoning: [
      {
        title: 'The squared coordinates give the weights',
        paragraphs: [
          'Writing $x=\\sum_i x_i v_i$ gives $x^\\top Ax=\\sum_i\\lambda_i(A)x_i^2$ and $x^\\top x=\\sum_i x_i^2$. Dividing gives a weighted mean of the eigenvalues. A sign change in a column of $V$ flips its coordinate but leaves the squared coordinate unchanged.',
        ],
        equation: '$R_A(x)=\\frac{\\sum_i\\lambda_i(A)x_i^2}{\\sum_i x_i^2}$',
      },
      {
        title: 'A rank-one update acts along one direction',
        paragraphs: [
          'For $B=qq^\\top$, the change in the quadratic form is $(q^\\top x)^2$. This is nonnegative for every $x$ and zero when $x\\perp q$. The lecture’s interlacing theorem puts $\\lambda_2(A+B)$ between $\\lambda_1(A)$ and $\\lambda_2(A)$ in this two-dimensional case.',
        ],
      },
    ],
    checks: [
      {
        question: 'What happens if you replace `x` with `[1., 1.]`?',
        answer:
          'This vector lies along $v_1$. The weights become $(1,0)$, so both calculations give $R_A(x)=9$.',
      },
      {
        question: 'What goes wrong if you reverse `lam` alone?',
        answer:
          'The column for eigenvalue $1$ would still come first, so multiplying that column by the new first eigenvalue $9$ would disagree with applying $A$ to it.',
      },
    ],
    references: [
      { title: 'Original Chapter 7.2 notebook', url: original.githubUrl },
    ],
  },
  primer: [
    {
      term: 'Eigenpair',
      definition: 'A unit direction and its scale belong together.',
      relation: '$Av_i=\\lambda_i(A)v_i$',
      watchFor: 'Permute the eigenvector columns with the eigenvalues.',
    },
    {
      term: 'Rayleigh quotient',
      definition:
        'Measure the quadratic form per unit of squared input length.',
      relation: '$R_A(x)=\\frac{x^\\top Ax}{x^\\top x}$',
      watchFor: 'The quotient can sit between the two eigenvalues.',
    },
  ],
  walkthrough: {
    eyebrow: 'Lab 7.2 · Guided example',
    title: 'Follow two eigenvalues through a matrix update',
    objective:
      'Use one symmetric matrix with two different scales so every intermediate value fits on screen.',
    source: {
      filename: notebook.filename,
      url: original.githubUrl,
      note: 'The original notebook computes eigenvalues of random symmetric matrices. Here a 2×2 example exposes the column order and one rank-one update.',
    },
    initial: {
      title: 'Start with the matrix from Lab 7.1',
      description:
        'Adding the two columns of $A$ and subtracting them gives two directions to look for in the output.',
      matrices: [matrix],
    },
    steps: [
      {
        title: 'Order the eigenpairs as in the lecture',
        explanation:
          'NumPy returns the eigenvalues from smallest to largest. Each eigenvector is a column paired with the eigenvalue at the same index.',
        watchFor:
          'To move the larger eigenvalue to index 0, which axis of the eigenvector array must you reverse?',
        code: [
          'import numpy as np',
          'A = np.array([[5., 4.], [4., 5.]])',
          'lam_asc, V_asc = np.linalg.eigh(A)',
          'lam = lam_asc[::-1]',
          'V = V_asc[:, ::-1]',
        ].join('\n'),
        lineNotes: [
          line(
            'Load NumPy.',
            'Module',
            'Use arrays and symmetric eigensolvers.',
          ),
          line(
            'Store the symmetric matrix.',
            'A: (2, 2)',
            'The off-diagonal entries agree.',
          ),
          line(
            'Compute the eigenpairs.',
            'lam_asc: (2,), V_asc: (2, 2)',
            'NumPy returns $1,9$ and two matching unit columns.',
          ),
          line(
            'Reverse the eigenvalues.',
            'lam: (2,)',
            'The slice `[::-1]` reads the values as $9,1$.',
          ),
          line(
            'Reverse the eigenvector columns.',
            'V: (2, 2)',
            'Keep all rows with `:` and read the columns in reverse order.',
          ),
        ],
        after: {
          title: 'The largest eigenpair comes first',
          description:
            'The first column points along $(1,1)^\\top$ and the second along $(1,-1)^\\top$, up to signs.',
          matrices: [
            { label: 'NumPy order', values: [[1, 9]] },
            { label: 'Lecture order', values: [[9, 1]] },
          ],
          equation: '$\\lambda_1(A)=9,\\qquad \\lambda_2(A)=1$',
        },
      },
      {
        title: 'Read one Rayleigh quotient as an average',
        explanation:
          'The dot products with the columns of $V$ give the eigenbasis coordinates. Square and normalize those coordinates to get a weight for each eigenvalue.',
        watchFor:
          'The vector $(1,0)^\\top$ has equal absolute coordinates along the two eigendirections. What average do you expect?',
        code: [
          'x = np.array([1., 0.])',
          'coords = V.T @ x',
          'weights = coords**2 / (coords @ coords)',
          'rayleigh = weights @ lam',
          'direct = (x @ A @ x) / (x @ x)',
        ].join('\n'),
        lineNotes: [
          line(
            'Choose a unit input.',
            'x: (2,)',
            'Select the first coordinate direction $e_1$.',
          ),
          line(
            'Read the input in the eigenbasis.',
            '(2, 2) @ (2,) → (2,)',
            'Each dot product has magnitude $1/\\sqrt{2}$.',
          ),
          line(
            'Turn the coordinates into weights.',
            'weights: (2,)',
            'Square each coordinate and divide by the sum of the squares.',
          ),
          line(
            'Average the eigenvalues.',
            '(2,) @ (2,) → scalar',
            'Compute $0.5\\cdot9+0.5\\cdot1=5$.',
          ),
          line(
            'Check with the original formula.',
            'Scalar',
            'The numerator selects $a_{11}=5$ and the denominator equals $1$.',
          ),
        ],
        after: {
          title: 'The two calculations agree',
          description:
            'Both eigendirections carry half the squared length of $x$. Their two contributions give $R_A(x)=5$.',
          matrices: [
            {
              label: 'Weights on $\\lambda_1(A)$ and $\\lambda_2(A)$',
              values: [[0.5, 0.5]],
            },
            { label: 'Weighted and direct quotients', values: [[5, 5]] },
          ],
          equation: '$R_A(e_1)=\\tfrac12\\cdot9+\\tfrac12\\cdot1=5$',
        },
      },
      {
        title: 'Add a rank-one matrix and compare the spectra',
        explanation:
          'The outer product of $q=e_1$ with itself adds one to the top-left entry. We only need the new eigenvalues, so the code uses `eigvalsh`.',
        watchFor:
          'Will the smaller eigenvalue of $A+qq^\\top$ stay between the two old eigenvalues?',
        code: [
          'q = np.array([1., 0.])',
          'B = np.outer(q, q)',
          'lam_updated = np.linalg.eigvalsh(A + B)[::-1]',
          'interlaces = lam_updated[0] >= lam[0] >= lam_updated[1] >= lam[1]',
        ].join('\n'),
        lineNotes: [
          line(
            'Choose the direction of the update.',
            'q: (2,)',
            'Only the first entry of $q$ is nonzero.',
          ),
          line(
            'Build the outer product.',
            'B: (2, 2)',
            'Each entry is $q_iq_j$. Only the top-left entry is $1$.',
          ),
          line(
            'Compute the new eigenvalues in lecture order.',
            'lam_updated: (2,)',
            'The new pair is approximately $9.531,1.469$.',
          ),
          line(
            'Check the interlacing order.',
            'Boolean',
            'Read largest new, largest old, smallest new, then smallest old.',
          ),
        ],
        after: {
          title: 'The old and new eigenvalues alternate',
          description:
            'The two eigenvalues both increase. The new smaller eigenvalue is still below the old larger one, so `interlaces` is `True`.',
          matrices: [
            { label: 'Old eigenvalues', values: [[9, 1]] },
            { label: 'New eigenvalues (rounded)', values: [[9.531, 1.469]] },
          ],
          equation: '$9.531>9>1.469>1$',
        },
      },
    ],
  },
};
