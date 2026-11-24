import { line, maintainedNotebook } from '@/lib/chapter-four/common';
import {
  sourceLinks,
  toneCells,
  type ChapterSection,
} from '@/lib/chapter/shared';

const notebook = maintainedNotebook('Ch7-1 Positive Definite Matrices.ipynb');
const original = sourceLinks(notebook.filename);
const inputMatrix = {
  label: '$A$',
  values: [
    [5, 4],
    [4, 5],
  ],
};
const inputVector = {
  label: '$x$',
  values: [[1], [-1]],
};

export const positiveDefiniteLab: ChapterSection = {
  ...notebook,
  slug: 'positive-definite',
  number: '7.1',
  title: 'Quadratic Forms and Cholesky',
  shortTitle: 'Quadratic forms and Cholesky',
  summary:
    'Turn a matrix–vector product into one number, then check it using a triangular factor.',
  focus: 'Multiply · Factor · Check',
  learningGoal:
    'Read $x^\\top Ax$ as two products and see why $A=R^\\top R$ turns it into the squared length $|Rx|^2$.',
  lectureConcepts: [
    'Quadratic form',
    'Positive definiteness',
    'Cholesky factorization',
  ],
  notebookNote:
    'The notebook runs the same three NumPy steps. Change the input vector at the end to check what happens in another direction.',
  lectureNotes: {
    reference:
      'Wooseok Ha, MAS110 Lecture 7, printed slides 4–11 for positive definiteness and 12–15 for Cholesky factorization.',
    introduction:
      'A quadratic form combines a matrix and a vector into one number. Cholesky expresses that number as the squared length of a transformed vector.',
    notation: [
      {
        symbol: '$x^\\top Ax$',
        meaning:
          'The lecture writes $x$ as a column vector. The code stores it as a one-dimensional array, so `x @ Ax` takes the dot product that represents multiplying by $x^\\top$.',
      },
      {
        symbol: '$A=R^\\top R$',
        meaning:
          'The lecture uses upper triangular $R$ with positive diagonal entries. NumPy defaults to the lower triangular factor $L$, so the code sets $R=L^\\top$.',
      },
    ],
    reasoningTitle: 'Why the factor proves positivity',
    reasoning: [
      {
        title: 'Cholesky exposes a squared length',
        paragraphs: [
          'Substitute the factorization into the form and group the two appearances of $R$. Its positive diagonal entries make $R$ invertible. Every nonzero $x$ gives a nonzero $Rx$ and a strictly positive squared length.',
        ],
        equation: '$x^\\top Ax=x^\\top R^\\top Rx=|Rx|^2$',
      },
      {
        title: 'A Gram product can start with a different factor',
        paragraphs: [
          'The source notebook starts by forming $A=B^\\top B$ from a random matrix. Taking $B=\\bigl(\\begin{smallmatrix}2&1\\\\1&2\\end{smallmatrix}\\bigr)$ in that product gives our fixed example. In the Cholesky product, the factor $R$ has the additional upper triangular structure.',
        ],
      },
    ],
    checks: [
      {
        question:
          'What happens to the quadratic form if you replace $x$ by $2x$?',
        answer:
          'Both vector factors double, so the value grows by a factor of $4$. The original value is $2$, so the new value is $8$.',
      },
      {
        question: 'Why use `np.allclose` for the reconstruction?',
        answer:
          'The entries of $R$ involve square roots. Their floating-point approximations can cause small rounding errors when you multiply the factors back together.',
      },
    ],
    references: [
      { title: 'Original Chapter 7.1 notebook', url: original.githubUrl },
    ],
  },
  primer: [
    {
      term: 'Quadratic form',
      definition:
        'Multiply $A$ by $x$, then take the dot product of the result with $x$.',
      relation: '$x^\\top(Ax)$',
      watchFor: 'The first product is a vector and the second is a scalar.',
    },
    {
      term: 'Cholesky factor',
      definition:
        'Use the upper triangular factor with positive diagonal entries.',
      relation: '$A=R^\\top R$',
      watchFor:
        'Transposing the NumPy factor moves the off-diagonal entry above the diagonal.',
    },
  ],
  walkthrough: {
    eyebrow: 'Lab 7.1 · NumPy',
    title: 'Compute the same quadratic form two ways',
    objective:
      'Follow a $2\\times2$ example from two matrix products to a squared vector length.',
    source: {
      filename: notebook.filename,
      url: original.githubUrl,
      note: 'The source notebook builds an upper Cholesky factor row by row on a random matrix and checks it with NumPy. This trace uses a fixed matrix and transposes NumPy’s default lower factor.',
    },
    initial: {
      title: 'Start with a matrix and a vector',
      description:
        'Track the result after each product. The code uses the same inputs in all three steps.',
      matrices: [inputMatrix, inputVector],
    },
    steps: [
      {
        title: 'Multiply first, then take a dot product',
        explanation:
          'The parentheses in $x^\\top(Ax)$ give the order of the two calculations. Each row of $A$ supplies one coordinate of $Ax$.',
        watchFor:
          'What are the two entries of $Ax$? What number do you get after the dot product?',
        code: [
          'import numpy as np',
          'A = np.array([[5., 4.], [4., 5.]])',
          'x = np.array([1., -1.])',
          'Ax = A @ x',
          'quadratic = x @ Ax',
        ].join('\n'),
        lineNotes: [
          line(
            'Import NumPy.',
            'Module',
            'Use arrays and the matrix multiplication operator.',
          ),
          line(
            'Store the symmetric matrix.',
            'A: (2, 2)',
            'Each inner list is one row of $A$.',
          ),
          line(
            'Store the input vector.',
            'x: (2,)',
            'A one-dimensional array stores the two coordinates of $x$.',
          ),
          line(
            'Multiply the matrix by the vector.',
            '(2, 2) @ (2,) → (2,)',
            'The top row gives $5-4=1$. The bottom row gives $4-5=-1$.',
          ),
          line(
            'Take the dot product.',
            '(2,) @ (2,) → scalar',
            'The two coordinate products give $1\\cdot1+(-1)(-1)=2$.',
          ),
        ],
        after: {
          title: 'Two products give one number',
          description:
            'The intermediate vector has two entries. The dot product adds two coordinate products.',
          equation: '$x^\\top(Ax)=1\\cdot1+(-1)(-1)=2$',
          matrices: [
            inputVector,
            {
              label: '$Ax$',
              values: [[1], [-1]],
              cellTones: toneCells(
                [
                  [0, 0],
                  [1, 0],
                ],
                'result',
              ),
            },
          ],
        },
      },
      {
        title: 'Match NumPy’s factor to the lecture',
        explanation:
          'The default Cholesky call gives lower triangular $L$ with $A=LL^\\top$. Set $R=L^\\top$ to read the product in lecture notation.',
        watchFor:
          'After transposing $L$, which off-diagonal corner of $R$ contains the zero?',
        code: [
          'L = np.linalg.cholesky(A)',
          'R = L.T',
          'rebuilt = R.T @ R',
          'rebuild_ok = np.allclose(rebuilt, A)',
        ].join('\n'),
        lineNotes: [
          line(
            'Find the lower triangular Cholesky factor.',
            'A: (2, 2) → L: (2, 2)',
            'The first diagonal entry is $\\sqrt{5}$. The top-right entry is zero.',
          ),
          line(
            'Swap rows and columns.',
            'L: (2, 2) → R: (2, 2)',
            'The zero moves to the bottom-left corner of $R$.',
          ),
          line(
            'Multiply the factors in lecture order.',
            '(2, 2) @ (2, 2) → (2, 2)',
            'Each entry is a dot product between two columns of $R$.',
          ),
          line(
            'Compare the rebuilt matrix with $A$.',
            'Two matrices → Boolean',
            'The comparison is true within floating-point tolerance.',
          ),
        ],
        after: {
          title: 'The upper factor rebuilds the input',
          description:
            'The factor entries are rounded here. The code uses full precision when multiplying them.',
          equation: '$A=R^\\top R$',
          matrices: [
            {
              label: '$L$ · NumPy',
              values: [
                [2.236, 0],
                [1.789, 1.342],
              ],
              cellTones: toneCells([[0, 1]], 'source'),
            },
            {
              label: '$R$ · lecture',
              values: [
                [2.236, 1.789],
                [0, 1.342],
              ],
              cellTones: toneCells([[1, 0]], 'target'),
            },
            {
              label: '$R^\\top R$',
              values: inputMatrix.values,
              cellTones: toneCells(
                [
                  [0, 0],
                  [0, 1],
                  [1, 0],
                  [1, 1],
                ],
                'result',
              ),
            },
          ],
        },
      },
      {
        title: 'Compute the squared length',
        explanation:
          'Using $A=R^\\top R$ gives $x^\\top Ax=(Rx)^\\top(Rx)$. We already know the value on the left, so now compute the one on the right.',
        watchFor:
          'What value should the two squares add to, even though one entry of $Rx$ is negative?',
        code: [
          'Rx = R @ x',
          'squared_length = Rx @ Rx',
          'length_ok = np.isclose(squared_length, quadratic)',
        ].join('\n'),
        lineNotes: [
          line(
            'Apply the triangular factor to $x$.',
            '(2, 2) @ (2,) → (2,)',
            'The exact entries are $1/\\sqrt{5}$ and $-3/\\sqrt{5}$.',
          ),
          line(
            'Square each coordinate and add.',
            '(2,) @ (2,) → scalar',
            'The two squared coordinates add to $1/5+9/5=2$.',
          ),
          line(
            'Compare the two scalar calculations.',
            'Two scalars → Boolean',
            'The two values agree within floating-point tolerance.',
          ),
        ],
        after: {
          title: 'Both calculations give 2',
          description:
            'The two entries of $Rx$ have opposite signs. Squaring them produces two positive contributions.',
          equation: '$|Rx|^2=\\tfrac{1}{5}+\\tfrac{9}{5}=2$',
          matrices: [
            {
              label: '$Rx$ · rounded',
              values: [[0.447], [-1.342]],
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
            'An invertible $R$ sends every nonzero $x$ to a nonzero $Rx$, so the squared length is positive in every nonzero direction.',
        },
      },
    ],
  },
};
