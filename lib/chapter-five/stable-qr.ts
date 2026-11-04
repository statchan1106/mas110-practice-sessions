import { maintainedNotebook, line } from '@/lib/chapter-four/common';
import { sourceLinks, type ChapterSection } from '@/lib/chapter/shared';

const notebook = maintainedNotebook(
  'Ch5-3 Numerically Stable QR-Decomposition.ipynb',
);
const original = sourceLinks(notebook.filename);

export const stableQrSection: ChapterSection = {
  ...notebook,
  slug: 'stable-qr',
  number: '5.3',
  title: 'Numerically Stable QR',
  shortTitle: 'Stable QR',
  summary:
    'Compare classical and modified Gram–Schmidt with library QR on nearly parallel columns.',
  focus: 'Roundoff · Orthogonality',
  learningGoal:
    'Measure reconstruction and orthogonality separately on an input with small singular values.',
  lectureConcepts: [
    'Orthogonal directions',
    'Singular values',
    'Spectral condition number',
  ],
  codeExtension:
    'The floating-point experiment extends Lecture 4’s QR with Lecture 5’s singular-value lens.',
  notebookNote:
    'Run all three methods on the same matrix and change the size of its small independent directions.',
  lectureNotes: {
    reference:
      'Wooseok Ha, MAS110 Lecture 5, printed slides 1, 23, and 30, and the QR construction in Lecture 4. The comparison of algorithms is a coding extension.',
    introduction:
      'Almost parallel columns force Gram–Schmidt to subtract nearly equal vectors. The small remainders can lose significant digits. Normalizing a remainder can magnify the error in its direction.',
    notation: [
      {
        symbol: '$A=QR$',
        meaning:
          'Here $Q$ has three orthonormal columns in exact arithmetic and $R$ is upper triangular. Both Gram–Schmidt variants build these factors column by column.',
      },
      {
        symbol: '$\\kappa_2(A)=\\sigma_1/\\sigma_3$',
        meaning:
          'For this full-column-rank example, the ratio compares the largest and smallest stretches. It extends the invertible square case on slide 30 to a rectangular matrix with independent columns.',
      },
      {
        symbol: '$Q^{\\top}Q-I$',
        meaning:
          'Diagonal errors measure unit length and off-diagonal entries measure unwanted alignment.',
      },
    ],
    reasoningTitle: 'Why a small reconstruction error can hide a bad basis',
    reasoning: [
      {
        title: 'Use the right vector for each coefficient',
        paragraphs: [
          'Classical Gram–Schmidt takes every coefficient for column $j$ against the original $a_j$. Modified Gram–Schmidt takes each coefficient against the current remainder $w$. Earlier directions have already been subtracted from that remainder. In exact arithmetic the coefficients agree because the accepted columns are mutually orthogonal.',
        ],
      },
      {
        title: 'Check two different promises of QR',
        paragraphs: [
          'The relative reconstruction error tests the product. The orthogonality error tests whether the computed columns can be used as orthonormal directions, for example in the projection $QQ^{\\top}$. An accurate product can coexist with large off-diagonal entries in $Q^{\\top}Q$. The library QR here uses Householder reflectors, which act on the trailing matrix by orthogonal transformations.',
        ],
        equation:
          '$\\frac{\\lVert A-QR\\rVert_F}{\\lVert A\\rVert_F},\\quad \\lVert Q^{\\top}Q-I\\rVert_F$',
      },
    ],
    checks: [
      {
        question:
          'If $QR$ reconstructs $A$ accurately, is $QQ^{\\top}$ necessarily a good projector?',
        answer:
          'Check $Q^{\\top}Q$ separately. Nearly parallel computed columns can produce an accurate product but make $QQ^{\\top}$ far from an orthogonal projector.',
      },
      {
        question:
          'What happens to exact rank when the small entries are set to zero?',
        answer:
          'All three columns become equal, so the rank drops from three to one. A zero remainder cannot be normalized. This walkthrough uses a fixed nonzero perturbation.',
      },
    ],
    references: [
      {
        title: 'NumPy QR',
        url: 'https://numpy.org/doc/stable/reference/generated/numpy.linalg.qr.html',
      },
      { title: 'Original Chapter 5.3 notebook', url: original.githubUrl },
    ],
  },
  primer: [
    {
      term: 'Reconstruction',
      definition:
        'Check how close the two computed factors are to the original matrix when multiplied together.',
      relation: '$A\\approx QR$',
      watchFor: 'A small error says the factors reproduce the input.',
    },
    {
      term: 'Orthogonality',
      definition:
        'Check whether all pairs of columns have the prescribed inner products.',
      relation: '$Q^{\\top}Q\\approx I$',
      watchFor: 'Compare this separately from the reconstruction error.',
    },
  ],
  walkthrough: {
    title: 'Run three QR methods on the same input',
    eyebrow: 'Floating-point experiment · NumPy',
    objective:
      'Use an almost rank-one matrix to see which method preserves perpendicularity.',
    initial: {
      title: 'Nearly parallel columns',
      description:
        'The three columns share the first coordinate. Each has a distinct small entry below it.',
      matrices: [
        {
          label: '$A$',
          values: [
            [1, 1, 1],
            ['1e-8', 0, 0],
            [0, '1e-8', 0],
            [0, 0, '1e-8'],
          ],
        },
      ],
    },
    steps: [
      {
        title: 'Measure the small stretches',
        explanation:
          'The last two singular values are small. In exact arithmetic, $A^{\\top}A$ has $\\varepsilon^2$ on top of the all-ones matrix’s diagonal.',
        watchFor: 'Is the exact rank one or three?',
        code: [
          'import numpy as np',
          'eps = 1e-8',
          'A = np.vstack((np.ones((1, 3)), eps * np.eye(3)))',
          's = np.linalg.svd(A, compute_uv=False)',
        ].join('\n'),
        lineNotes: [
          line(
            'Load NumPy.',
            'Module',
            'Use the same input in all three methods.',
          ),
          line(
            'Choose the size of the perturbation.',
            'Scalar',
            'Each column has one independent entry of size $10^{-8}$.',
          ),
          line(
            'Stack a row of ones over a scaled identity.',
            '$4\\times3$',
            'The bottom block makes the columns independent.',
          ),
          line(
            'Compute singular values only.',
            'Length 3',
            'The largest scale is about $\\sqrt{3}$ and the other two are $\\varepsilon$.',
          ),
        ],
        after: {
          title: 'Independent but poorly separated',
          description:
            'The largest stretch is about 173 million times the smallest.',
          matrices: [
            {
              label: 'Singular values · rounded',
              values: [[1.732, '1e-8', '1e-8']],
            },
          ],
        },
      },
      {
        title: 'Change the coefficient source',
        explanation:
          'The two variants differ in which vector supplies the coefficient. The function below is used with the fixed independent input above.',
        watchFor:
          'Which version recomputes a coefficient after the previous subtraction?',
        code: [
          'def gram_schmidt(A, modified):',
          '    n, d = A.shape',
          '    Q, R = np.zeros((n, d)), np.zeros((d, d))',
          '    for j in range(d):',
          '        w = A[:, j].copy()',
          '        for i in range(j):',
          '            reference = w if modified else A[:, j]',
          '            R[i, j] = Q[:, i] @ reference',
          '            w -= R[i, j] * Q[:, i]',
          '        R[j, j] = np.linalg.norm(w)',
          '        if R[j, j] == 0:',
          '            raise ValueError("Zero Gram-Schmidt remainder")',
          '        Q[:, j] = w / R[j, j]',
          '    return Q, R',
        ].join('\n'),
        lineNotes: [
          line(
            'Define one routine with two variants.',
            'Matrix and boolean inputs',
            'Both variants share the same subtraction and normalization.',
          ),
          line(
            'Read the input dimensions.',
            'Two integers',
            'The lecture’s $n$ counts rows and $d$ counts columns.',
          ),
          line(
            'Reserve space for both factors.',
            '$4\\times3$ and $3\\times3$',
            'Start every entry at zero.',
          ),
          line(
            'Process the input columns in order.',
            'Three iterations',
            'Build the next direction from the current column.',
          ),
          line(
            'Copy the new column into a working vector.',
            'Length 4',
            'Mutate the copy during subtraction.',
          ),
          line(
            'Visit all previously accepted directions.',
            'Indices before `j`',
            'The first column skips this loop.',
          ),
          line(
            'Choose where to measure the coefficient.',
            'Length 4',
            'Use the current remainder in modified Gram–Schmidt and the original column in classical Gram–Schmidt.',
          ),
          line(
            'Store one reconstruction coefficient.',
            'Scalar',
            'Take a dot product with an earlier unit direction.',
          ),
          line(
            'Remove the measured component.',
            'Length 4',
            'Subtract the scaled direction from the remainder.',
          ),
          line(
            'Measure the length of the remainder.',
            'Scalar',
            'Put it on the diagonal of $R$.',
          ),
          line(
            'Check for a vanishing remainder.',
            'Boolean comparison',
            'This guard also checks the first column.',
          ),
          line(
            'Stop when there is no direction to normalize.',
            'Exception',
            'An exactly zero remainder has no unit vector.',
          ),
          line(
            'Normalize the remainder.',
            'Length 4',
            'The fixed independent input gives nonzero remainders.',
          ),
          line(
            'Return both factors.',
            'Two arrays',
            'Use them for the separate error checks.',
          ),
        ],
        after: {
          title: 'One routine, two coefficient rules',
          description:
            'The function is defined. The next step runs it twice and compares the results with library QR.',
        },
      },
      {
        title: 'Measure the two errors separately',
        explanation:
          'All three methods reconstruct the matrix closely. Classical Gram–Schmidt loses much more perpendicularity on this input.',
        watchFor: 'Which of the two error measures separates the methods?',
        code: [
          'factors = [gram_schmidt(A, False), gram_schmidt(A, True), np.linalg.qr(A)]',
          'for Q, R in factors:',
          '    reconstruction = np.linalg.norm(A - Q @ R) / np.linalg.norm(A)',
          '    orthogonality = np.linalg.norm(Q.T @ Q - np.eye(3))',
          '    print(f"{reconstruction:.2e} {orthogonality:.2e}")',
        ].join('\n'),
        lineNotes: [
          line(
            'Compute the three factorizations.',
            'Three pairs',
            'Use classical, modified, then library QR.',
          ),
          line(
            'Inspect one pair at a time.',
            'Three iterations',
            'Every method sees the same matrix.',
          ),
          line(
            'Measure the relative reconstruction error.',
            'Scalar',
            'Normalize the Frobenius error by the input’s Frobenius norm.',
          ),
          line(
            'Measure the departure from orthonormality.',
            'Scalar',
            'Subtract the identity from the Gram matrix of the computed columns.',
          ),
          line(
            'Print both diagnostics.',
            'Two numbers per row',
            'Compare the right column across methods.',
          ),
        ],
        after: {
          title: 'Good products can hide bad angles',
          description:
            'The order is classical, modified, and library QR. The entries below are approximate scales and can vary with floating-point libraries.',
          matrices: [
            {
              label: 'Relative reconstruction · orthogonality',
              values: [
                ['<1e-12', '≈ 1'],
                ['<1e-12', '≈ 1e-8'],
                ['<1e-12', '<1e-12'],
              ],
            },
          ],
        },
      },
    ],
  },
};
