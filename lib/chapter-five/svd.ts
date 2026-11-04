import { maintainedNotebook, line } from '@/lib/chapter-four/common';
import { sourceLinks, type ChapterSection } from '@/lib/chapter/shared';

const notebook = maintainedNotebook('Ch5-1 SVD-Basic Properties.ipynb');
const original = sourceLinks(notebook.filename);
const matrix = {
  label: '$A$ · Example 5.3',
  values: [
    [-1, -5, 0, 0],
    [-5, -1, 0, 0],
    [0, 0, 2, 0],
    [0, 0, 0, 0],
  ],
};

export const svdSection: ChapterSection = {
  ...notebook,
  slug: 'svd-basics',
  number: '5.1',
  title: 'Singular Directions and Low-Rank Approximation',
  shortTitle: 'SVD and truncation',
  summary:
    'Read the lecture’s symmetric example as an SVD and keep the two strongest directions.',
  focus: 'Triplets · Truncation',
  learningGoal:
    'Build a compact SVD, then predict the error caused by dropping a singular direction.',
  lectureConcepts: [
    'Best-fit subspace',
    'Singular triplets',
    'Compact SVD',
    'Eckart–Young–Mirsky theorem',
  ],
  notebookNote:
    'The companion notebook follows the worked example and checks the reconstruction and both truncation errors.',
  lectureNotes: {
    reference:
      'Wooseok Ha, MAS110 Lecture 5, printed slides 3–23, 27–42, and 45–48. Example 5.3 is on slides 35–36, and its rank-two approximation is revisited on slide 54.',
    introduction:
      'Lecture 5 begins with observations $a_i\\in\\mathbb{R}^d$ stored as rows of $A$. Projecting a row onto a unit direction $v$ gives the coordinate $a_i^{\\top}v$. Stacking these coordinates gives $Av$. Pythagoras turns the smallest sum of squared residual lengths into the largest sum of squared projected lengths.',
    notation: [
      {
        symbol: '$A\\in\\mathbb{R}^{n\\times d}$',
        meaning:
          '$n$ counts rows and $d$ counts features. Right singular vectors live in feature space and left singular vectors live in the space of row coordinates.',
      },
      {
        symbol: '$(\\sigma_i,v_i,u_i)$',
        meaning:
          '$\\sigma_i=\\lVert Av_i\\rVert_2$ and $Av_i=\\sigma_i u_i$. A triplet with $\\sigma_i>0$ pairs a unit input direction and its unit output direction.',
      },
      {
        symbol: '$A=UDV^{\\top}$',
        meaning:
          'In the lecture’s compact SVD, $r$ is the exact rank, $U$ has shape $n\\times r$, $D$ has shape $r\\times r$, and $V$ has shape $d\\times r$. NumPy’s reduced SVD returns $p=\\min(n,d)$ slots, including any zero or numerically tiny ones. Its `s` stores diagonal entries and `Vt` stores right singular vectors as rows.',
      },
      {
        symbol: '$w_i$ and $v_i$',
        meaning:
          'In the example, $w_i$ denotes the eigenvector labeled $v_i$ on slide 35. The lab uses $v_i$ for the right singular vectors in decreasing singular-value order.',
      },
    ],
    reasoningTitle: 'Why these directions work',
    reasoning: [
      {
        title: 'The best line gives the first right singular vector',
        paragraphs: [
          'The lecture first chooses the unit $v_1$ maximizing $\\lVert Av\\rVert_2$. It then chooses the best unit direction orthogonal to all earlier ones. Theorem 5.1 makes this greedy choice exact for the squared projection objective. For a plane, any competing plane contains a unit direction orthogonal to $v_1$. Complete it to an orthonormal basis and compare each basis direction with the corresponding greedy maximum.',
        ],
        equation: '$W_k=\\operatorname{span}\\{v_1,\\ldots,v_k\\}$',
      },
      {
        title: 'Move the eigenvalue sign into the left vector',
        paragraphs: [
          'For a real symmetric matrix we can start with orthonormal eigenvectors and order them by decreasing $|\\lambda_i|$. Taking $\\sigma_i=|\\lambda_i|$ and $u_i=\\operatorname{sign}(\\lambda_i)v_i$ preserves the action on each positive-scale direction. In Example 5.3 the direction with eigenvalue $-6$ comes first and its output points the opposite way.',
        ],
        equation: '$Av_i=\\sigma_i u_i,\\quad A^{\\top}u_i=\\sigma_i v_i$',
      },
      {
        title: 'Read both norms from the discarded terms',
        paragraphs: [
          'The rank-one terms use orthonormal directions on both sides. The spectral norm is the largest stretch. The squared Frobenius norm is the sum of the squared singular values. Eckart–Young–Mirsky says that keeping the largest $k$ terms minimizes both errors among matrices of rank at most $k$. In slide 54’s middle expression, the second kept term is $4w_3w_3^{\\top}$. This agrees with the matrix printed on the slide.',
        ],
        equation:
          '$\\lVert A-A_k\\rVert_2=\\sigma_{k+1},\\quad \\lVert A-A_k\\rVert_F^2=\\sum_{i=k+1}^{r}\\sigma_i^2$',
      },
    ],
    checks: [
      {
        question: 'Why can NumPy return different vector signs?',
        answer:
          'Flipping both $u_i$ and $v_i$ leaves their outer product unchanged. With tied singular values the basis within the tied subspace can also vary. Compare reconstructed matrices and invariant subspaces.',
      },
      {
        question: 'What are the two errors if you keep only the first term?',
        answer:
          'The tail contains $4$ and $2$. Its spectral norm is $4$ and its Frobenius norm is $\\sqrt{4^2+2^2}=\\sqrt{20}$.',
      },
    ],
    references: [
      {
        title: 'NumPy SVD',
        url: 'https://numpy.org/doc/stable/reference/generated/numpy.linalg.svd.html',
      },
      { title: 'Original Chapter 5.1 notebook', url: original.githubUrl },
    ],
  },
  primer: [
    {
      term: 'Best-fit line',
      definition:
        'Maximize the length of the vector of row coordinates over unit feature directions.',
      relation: '$\\sigma_1=\\max_{\\lVert v\\rVert_2=1}\\lVert Av\\rVert_2$',
      watchFor: 'The line passes through the origin.',
    },
    {
      term: 'Rank-one term',
      definition:
        'Take one input coordinate and send it to one scaled output direction.',
      relation: '$x\\mapsto \\sigma_i u_i(v_i^{\\top}x)$',
      watchFor: 'The outer product has the same shape as $A$.',
    },
    {
      term: 'Truncated SVD',
      definition:
        'Keep the first $k$ singular triplets, sorted by decreasing singular value.',
      relation: '$A_k=\\sum_{i=1}^k\\sigma_i u_i v_i^{\\top}$',
      watchFor:
        'Keep the negative eigenvalue direction first in this example because its magnitude is largest.',
    },
  ],
  walkthrough: {
    title: 'Reconstruct Example 5.3 and drop one direction',
    eyebrow: 'Worked example · NumPy',
    objective:
      'Follow the lecture matrix from signed eigenvalues to a rank-two approximation.',
    initial: {
      title: 'The lecture matrix',
      description:
        'The upper block mixes the first two coordinates. The third coordinate scales by two and the fourth collapses.',
      matrices: [matrix],
    },
    steps: [
      {
        title: 'Order the scales and pair the vectors',
        explanation:
          'The eigenvalues in singular-value order are $-6$, $4$, and $2$. Enter their eigenvectors from slide 35 in that order.',
        watchFor: 'Which column of $U$ changes sign relative to $V$?',
        code: [
          'import numpy as np',
          'A = np.array([[-1., -5., 0., 0.], [-5., -1., 0., 0.], [0., 0., 2., 0.], [0., 0., 0., 0.]])',
          'h = 1 / np.sqrt(2)',
          'V = np.array([[h, h, 0.], [h, -h, 0.], [0., 0., 1.], [0., 0., 0.]])',
          'eigenvalues = np.array([-6., 4., 2.])',
          's = np.abs(eigenvalues)',
          'U = V * np.sign(eigenvalues)',
        ].join('\n'),
        lineNotes: [
          line('Load NumPy.', 'Module', 'Use arrays and matrix products.'),
          line(
            'Enter the lecture example.',
            '$4\\times4$',
            'The third and fourth coordinates are already separated.',
          ),
          line(
            'Compute a normalization constant.',
            'Scalar',
            'Two entries of magnitude $h=1/\\sqrt{2}$ give unit length.',
          ),
          line(
            'Stack three right directions as columns.',
            '$4\\times3$',
            'Place the lecture eigenvectors in order $w_2,w_3,w_1$.',
          ),
          line(
            'Store the corresponding signed stretches.',
            'Length 3',
            'The first direction reverses.',
          ),
          line(
            'Take their magnitudes.',
            'Length 3',
            'All three singular values are positive.',
          ),
          line(
            'Pair each input with its output direction.',
            '$4\\times3$',
            'Broadcast the signs across the columns.',
          ),
        ],
        after: {
          title: 'Three positive scales',
          description:
            'The first left direction is the negative of its paired right direction.',
          matrices: [
            {
              label: '$D$',
              values: [
                [6, 0, 0],
                [0, 4, 0],
                [0, 0, 2],
              ],
            },
            { label: 'Signs applied to columns of $V$', values: [[-1, 1, 1]] },
          ],
        },
      },
      {
        title: 'Rebuild the matrix',
        explanation:
          'Each column of $U$ gets multiplied by its singular value. Multiplying by $V^{\\top}$ then adds the three outer products.',
        watchFor: 'Will the zero fourth row change?',
        code: [
          'D = np.diag(s)',
          'rebuilt = U @ D @ V.T',
          'U_lib, s_lib, Vt_lib = np.linalg.svd(A, full_matrices=False)',
        ].join('\n'),
        lineNotes: [
          line(
            'Make the lecture’s diagonal matrix.',
            '$3\\times3$',
            'Put $6,4,2$ on the diagonal.',
          ),
          line(
            'Reconstruct from the compact factors.',
            '$4\\times3$ by $3\\times3$ by $3\\times4$',
            'Add three rank-one matrices.',
          ),
          line(
            'Compare with the library’s reduced SVD.',
            'Two $4\\times4$ factors and 4 values',
            'The reduced call includes the fourth slot on this square matrix.',
          ),
        ],
        after: {
          title: 'Reconstruction and the extra slot',
          description:
            'The compact reconstruction equals the original. NumPy also returns a zero singular value for this example.',
          equation: '$A=UDV^{\\top}$',
          matrices: [
            { ...matrix, label: 'Reconstructed $A$' },
            { label: 'NumPy singular values', values: [[6, 4, 2, 0]] },
          ],
        },
      },
      {
        title: 'Retain the first two triplets',
        explanation:
          'Slice the factors consistently. Both kept directions lie in the first two coordinates, so the third row and column become zero.',
        watchFor: 'Which singular value survives in the error matrix?',
        code: [
          'k = 2',
          'A_k = (U[:, :k] * s[:k]) @ V[:, :k].T',
          'E = A - A_k',
          'errors = [np.linalg.norm(E, 2), np.linalg.norm(E, "fro")]',
        ].join('\n'),
        lineNotes: [
          line('Choose a rank budget.', 'Integer', 'Keep two terms.'),
          line(
            'Build the truncated SVD.',
            '$4\\times2$ by $2\\times4$',
            'Scale the two left columns and combine them with the two right rows.',
          ),
          line(
            'Subtract the approximation.',
            '$4\\times4$',
            'Only the triplet with $\\sigma_3=2$ remains up to roundoff.',
          ),
          line(
            'Measure both matrix norms.',
            'Two scalars',
            'The tail contains a single nonzero singular value.',
          ),
        ],
        after: {
          title: 'A rank-two approximation',
          description: 'The remaining stretch is two in the third direction.',
          equation: '$\\lVert E\\rVert_2=\\lVert E\\rVert_F=2$',
          matrices: [
            {
              label: '$A_2$',
              values: [
                [-1, -5, 0, 0],
                [-5, -1, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
              ],
            },
            {
              label: '$E=A-A_2$ · up to roundoff',
              values: [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 2, 0],
                [0, 0, 0, 0],
              ],
            },
          ],
        },
      },
    ],
  },
};
