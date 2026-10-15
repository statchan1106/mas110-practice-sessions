import type { ChapterSection } from '@/lib/chapter/shared';
import {
  line,
  maintainedNotebook,
  realGeometryNotation,
  lectureNotebookNote,
} from './common';

export const qrNotebook = maintainedNotebook('Ch4-3 QR-Decomposition.ipynb');
const A = [
  [-1, 1],
  [0, 1],
  [1, 0],
];
const Q = [
  ['−1/√2', '1/√6'],
  [0, '2/√6'],
  ['1/√2', '1/√6'],
];
const R = [
  ['√2', '−1/√2'],
  [0, '√6/2'],
];
export const qrSection: ChapterSection = {
  slug: 'qr-decomposition',
  number: '4.3',
  title: 'Gram–Schmidt and Reduced QR',
  shortTitle: 'QR decomposition',
  summary:
    'Subtract projections one column at a time, reconstruct $A = QR$, and distinguish rectangular orthonormal columns from a square orthogonal matrix.',
  focus: 'subtract → normalize → reconstruct $A = QR$',
  learningGoal:
    'Explain each entry of Q and R, check orthonormality separately from reconstruction, and connect the QR projection to least squares.',
  lectureConcepts: [
    'Gram–Schmidt',
    'Nested spans',
    'Reduced QR',
    'Orthogonal matrices',
    'Numerical orthogonality',
  ],
  codeExtension:
    'Trace the lecture’s 3 × 2 example before inspecting near-dependent columns. Add a scale-aware normalization check including the first column.',
  ...qrNotebook,
  notebookNote: lectureNotebookNote,
  explorer: 'qr',
  lectureNotes: {
    readingLabel: 'Lecture 4 · Reading guide',
    reasoningTitle: 'Why Gram–Schmidt produces QR',
    reference:
      'Wooseok Ha, MAS110 Lecture 4 (Fall 2026), lec04.pdf: printed slides 34–37, 47, 49–51 (PDF pages 39–42, 55, 57–59). This is the same A used for projection and least squares in 4.4.',
    introduction:
      'The matrix A has $m = 3$ rows and $n = 2$ independent columns. Gram–Schmidt replaces its columns by an orthonormal basis for the same column space; R records the coefficients needed to reconstruct the original columns. The lecture calls the normalized Gram–Schmidt vectors $w_{i}$ before naming the QR columns $q_{i}$. We consistently use $q_{i}$ for normalized directions and $w_{j}$ for an unnormalized remainder.',
    notation: [
      ...realGeometryNotation,
      {
        symbol: 'A = [a₁ | a₂] ∈ ℝ³ˣ²',
        meaning:
          '$a_{j}$ here means column j, a vector in $\\mathbb R^{3}$. In the statistical model of 4.4, the lecture also names a row feature vector $a_{i}$ via row $a_{i}^{\\mathsf T}$. Check the index and shape: columns are feature directions in measurement space; rows collect features for one measurement.',
      },
      {
        symbol: 'wⱼ; qⱼ = wⱼ/‖wⱼ‖₂',
        meaning:
          '$w_{j}$ is what remains after removing all earlier orthonormal components of $a_{j}$. $q_{j}$ has unit length; $w_{j}$ generally does not. This normalization needs a nonzero remainder. Independent columns guarantee it in exact arithmetic.',
      },
      {
        symbol: 'rᵢⱼ = qᵢᵀaⱼ (i < j); rⱼⱼ = ‖wⱼ‖₂',
        meaning:
          'These scalars are the reconstruction coefficients. With the positive-diagonal Gram–Schmidt convention, $r_{jj} > 0$. A library can use different matching signs; that does not change QR or the column space.',
      },
      {
        symbol: 'Q ∈ ℝᵐˣⁿ; R ∈ ℝⁿˣⁿ, m ≥ n',
        meaning:
          'For full column rank, reduced Q has n orthonormal columns and reduced R is invertible and upper triangular. $Q^{\\mathsf T}Q = I_{n}$. For m > n, Q is rectangular and $QQ^{\\mathsf T} = P$, not $I_{m}$.',
      },
      {
        symbol: 'Complete QR; Q_full ∈ ℝᵐˣᵐ',
        meaning:
          'Complete Q extends the basis to all of $\\mathbb R^{m}; R_{\\mathrm{full}}$ has shape m × n. The extra Q columns do not all belong to Col(A). $Q_{\\mathrm{full}}Q_{\\mathrm{full}}^{\\mathsf T} = I_{m}$, whereas projection onto Col(A) uses only the relevant column-space basis.',
      },
      {
        symbol: '$\\varepsilon$; numerical threshold; matrix rank',
        meaning:
          '$\\varepsilon$ is a small parameter in the near-dependent example, not a residual vector. In floating point a tiny remainder can indicate numerical dependence. The demonstration routine compares against a threshold scaled by the matrix norm; it is a teaching rank policy, not an exact symbolic rank test.',
      },
      {
        symbol: 'np.linalg.qr(A, mode="reduced")',
        meaning:
          'This returns a reduced factorization using LAPACK routines. Rank-deficient matrices still have QR factorizations, but R is singular and extra Q directions need not lie in Col(A). The full-column-rank solve $R\\theta  = Q^{\\mathsf T}b$ then cannot be used as an invertible solve.',
      },
    ],
    reasoning: [
      {
        title:
          'Subtracting old components creates a new perpendicular direction',
        paragraphs: [
          'Set $w_{j} = a_{j} - \\sum_{i<j}(q_{i}^{\\mathsf T}a_{j})q_{i}$. Pair it with any earlier $q_{k}$. Orthonormality cancels exactly the matching term, leaving $q_{k}^{\\mathsf T}w_{j} = 0$. If $w_{j}$ were zero, $a_{j}$ would already be in the preceding span, contradicting independence.',
          'Dividing by $\\Vert w_{j}\\Vert _{2}$ gives a unit vector. The same argument applies to the first column with an empty sum: a zero first column must be caught before normalization.',
        ],
        equation: 'aⱼ = Σᵢ<ⱼ rᵢⱼqᵢ + rⱼⱼqⱼ',
      },
      {
        title: 'The nested spans make R upper triangular',
        paragraphs: [
          'Each $q_{j}$ is formed using $a_{1},\\ldots ,a_{j}$, and each $a_{j}$ can be reconstructed using $q_{1},\\ldots ,q_{j}$. Therefore the two prefixes have the same span. No later direction is needed to reconstruct an earlier column.',
          'Collect these reconstruction coefficients as column j of R. All entries below the diagonal are zero. The nonzero diagonal makes R invertible under the independent-column assumption.',
        ],
        equation: 'span{a₁,…,aⱼ} = span{q₁,…,qⱼ}; A = QR',
      },
      {
        title: 'Follow the lecture’s second column exactly',
        paragraphs: [
          'The first normalized column is $q_{1} = (-1,0,1)^{\\mathsf T}/\\sqrt{2}$. The second coefficient is $r_{12} = q_{1}^{\\mathsf T}a_{2} = -1/\\sqrt{2}$. Subtracting $r_{12}q_{1}$ from $a_{2} = (1,1,0)^{\\mathsf T}$ leaves $w_{2} = (1/2,1,1/2)^{\\mathsf T}$.',
          'Its length is $\\sqrt{6}/2$, so $q_{2} = (1,2,1)^{\\mathsf T}/\\sqrt{6}$. The negative coefficient is allowed: the component of $a_{2}$ along $q_{1}$ points in the opposite direction.',
        ],
        equation: 'a₂ = −(1/√2)q₁ + (√6/2)q₂',
      },
      {
        title: 'Orthonormal coordinates simplify projection and fitting',
        paragraphs: [
          'Because $Q^{\\mathsf T}Q = I_{2}$, the coordinates of the projection of b onto Col(A) are $Q^{\\mathsf T}b$. The fitted vector is $QQ^{\\mathsf T}b$. If $A\\hat{\\theta}$ equals that fitted vector, then $QR\\hat{\\theta} = QQ^{\\mathsf T}b$, so multiplying by $Q^{\\mathsf T}$ gives $R\\hat{\\theta} = Q^{\\mathsf T}b$.',
          'For $b = (1,1,1)^{\\mathsf T}$, this produces $\\hat{\\theta} = (2/3,4/3)^{\\mathsf T}$, exactly the 4.4 example. $Q^{\\mathsf T}b$ are basis coordinates in $q_{1},q_{2}; \\hat{\\theta}$ are coefficients of the original columns $a_{1},a_{2}$. They are not the same vector of numbers.',
        ],
        equation: 'Qᵀb = (0,4/√6)ᵀ; Rθ̂ = Qᵀb; b̂ = QQᵀb',
      },
      {
        title:
          'Factorization error and orthogonality error test different things',
        paragraphs: [
          'A small $\\Vert A - QR\\Vert$ says the factors reconstruct the input. It does not guarantee a small $\\Vert Q^{\\mathsf T}Q - I\\Vert$. Classical Gram–Schmidt can lose orthogonality for near-dependent columns through cancellation, even while reconstructing A accurately.',
          'Modified Gram–Schmidt computes each projection from the updated remainder. It often improves numerical orthogonality, but severe conditioning can still require reorthogonalization. Use a library QR for practical factorization. The companion notebook compares both errors on the original $\\varepsilon  = 10^{-8}$ example instead of relying on one allclose check.',
        ],
      },
      {
        title:
          'Dependent columns change the full-column-rank algorithm, not the existence of QR',
        paragraphs: [
          'If $a_{2} = 2a_{1}$, its remainder after subtracting the $q_{1}$ component is zero. The teaching routine stops instead of dividing by zero; there is no second independent direction in the column space.',
          'QR still exists: a library may complete Q with an arbitrary perpendicular direction while making R singular. Then using all columns of that Q in $QQ^{\\mathsf T}$ can project onto a larger space than Col(A). A rank-r basis $Q_{r}$ gives the correct $P = Q_{r}Q_{r}^{\\mathsf T}$; lstsq handles the fit without requiring an invertible R.',
        ],
      },
    ],
    checks: [
      {
        question: 'Must the lecture’s Q match NumPy’s Q entry for entry?',
        answer:
          'No. A column sign in Q can be reversed if the corresponding row of R is reversed. Check $A \\approx  QR, Q^{\\mathsf T}Q \\approx  I$, and the projection instead.',
      },
      {
        question: 'Why is R upper triangular?',
        answer:
          'Column $a_{j}$ is already in $\\operatorname{span}\\{q_{1},\\ldots ,q_{j}\\}$. It has no component along any later $q_{i}$, so $r_{ij} = 0$ when i > j.',
      },
      {
        question: 'What fails when the first column is zero?',
        answer:
          'Its norm is zero, so even the first normalization is invalid. A guard only inside the later-column loop misses this case.',
      },
      {
        question: 'Does small A − QR imply $Q^{\\mathsf T}Q$ is close to I?',
        answer:
          'No. Reconstruction and orthogonality are different properties. Near-dependent columns can expose a large orthogonality error even with a small reconstruction error.',
      },
      {
        question: 'Do dependent columns mean there is no QR factorization?',
        answer:
          'No. They mean R is singular and the full-column-rank algorithm cannot make every input column contribute a new direction. Any extra Q columns need not belong to Col(A).',
      },
    ],
    references: [
      {
        title: 'NumPy: reduced and complete QR',
        url: 'https://numpy.org/doc/stable/reference/generated/numpy.linalg.qr.html',
      },
    ],
  },
  primer: [
    {
      term: 'Gram–Schmidt',
      definition:
        'Remove each old orthonormal component, then normalize the new information.',
      relation: 'wⱼ = aⱼ − Σᵢ<ⱼ(qᵢᵀaⱼ)qᵢ',
      watchFor: 'A zero remainder cannot be normalized.',
    },
    {
      term: 'Reduced QR',
      definition:
        'An orthonormal column basis and the triangular coefficients reconstruct the input.',
      relation: 'A = QR; QᵀQ = Iₙ',
      watchFor: 'Reduced Q is rectangular when m > n.',
    },
    {
      term: 'Two numerical checks',
      definition: 'Measure reconstruction separately from orthonormality.',
      relation: '‖A−QR‖; ‖QᵀQ−I‖',
      watchFor: 'One small error does not establish the other.',
    },
  ],
  walkthrough: {
    eyebrow: 'Lab 4.3 · Lecture QR example',
    title: 'Build the two columns of Q and read R',
    objective:
      'Keep the lecture’s $A = [[-1,1],[0,1],[1,0]]$ throughout. The same column-space basis leads directly to Lab 4.4.',
    source: {
      label: 'Maintained notebook',
      filename: qrNotebook.filename,
      url: qrNotebook.githubUrl,
      note: 'Contains guarded Gram–Schmidt routines, rank-deficient cases, and the near-dependent numerical example.',
    },
    initial: {
      title: 'Two independent directions in $\\mathbb R^{3}$',
      description:
        'A has two columns with three entries each. Reduced Q will also have shape (3,2), while R has shape (2,2).',
      matrices: [{ label: 'A', values: A }],
    },
    steps: [
      {
        title: 'Name the input columns',
        explanation:
          'Column j is an ambient vector $a_{j}$, not a row feature vector. Python uses 0-based column indices.',
        watchFor: 'Why do a1 and a2 each have three entries?',
        code: 'import numpy as np\nA = np.array([[-1., 1.], [0., 1.], [1., 0.]])\na1, a2 = A[:, 0], A[:, 1]',
        lineNotes: [
          line(
            'Loads NumPy.',
            'module',
            'np supplies vector and matrix operations.',
          ),
          line(
            'Stores the lecture matrix.',
            'A: (3, 2)',
            'Its rows are [−1,1], [0,1], [1,0].',
          ),
          line(
            'Selects its two columns.',
            'two slices → (3,), (3,)',
            '$a_{1} = (-1,0,1)^{\\mathsf T}, a_{2} = (1,1,0)^{\\mathsf T}$.',
          ),
        ],
        after: {
          title: 'The original columns are not perpendicular',
          description:
            'Their dot product is −1, so we must subtract an overlapping component.',
          equation: 'a₁ᵀa₂ = −1',
          matrices: [{ label: '$a_{1} | a_{2}$', values: A, dividerBefore: 1 }],
        },
      },
      {
        title: 'Normalize the first direction',
        explanation:
          'The first column is already nonzero. Its norm becomes the first diagonal entry of R.',
        watchFor: 'Why must r11 be checked before dividing?',
        code: 'r11 = np.linalg.norm(a1)\nq1 = a1 / r11',
        lineNotes: [
          line(
            'Measures the first column.',
            '(3,) → scalar',
            '$r_{11} = \\sqrt{2} > 0$.',
          ),
          line(
            'Makes the first unit column.',
            '(3,) / scalar → (3,)',
            '$q_{1} = (-1,0,1)^{\\mathsf T}/\\sqrt{2}$.',
          ),
        ],
        after: {
          title: 'One orthonormal column so far',
          description:
            'There is nothing to subtract at the first step. The first input reconstructs as $a_{1} = r_{11}q_{1}$.',
          equation: 'r₁₁ = √2; q₁ᵀq₁ = 1',
          matrices: [{ label: '$q_{1}$', values: [['−1/√2'], [0], ['1/√2']] }],
        },
      },
      {
        title: 'Subtract the part of $a_{2}$ along $q_{1}$',
        explanation:
          'Projection onto the unit direction $q_{1}$ uses one dot product. The remainder is perpendicular to $q_{1}$.',
        watchFor:
          'What does the negative r12 say about the component’s direction?',
        code: 'r12 = q1 @ a2\nold_component = r12 * q1\nw2 = a2 - old_component\nr22 = np.linalg.norm(w2)',
        lineNotes: [
          line(
            'Finds the old-basis coordinate.',
            '(3,) @ (3,) → scalar',
            '$r_{12} = -1/\\sqrt{2}$.',
          ),
          line(
            'Turns the scalar coordinate into a vector.',
            'scalar × (3,) → (3,)',
            'The old component is $(1/2,0,-1/2)^{\\mathsf T}$.',
          ),
          line(
            'Removes that component.',
            '(3,) − (3,) → (3,)',
            '$w_{2} = (1/2,1,1/2)^{\\mathsf T}$, perpendicular to $q_{1}$.',
          ),
          line(
            'Measures the new direction.',
            '(3,) → scalar',
            '$r_{22} = \\sqrt{6}/2 > 0$, confirming new information.',
          ),
        ],
        after: {
          title: 'Only the new direction remains',
          description:
            'The second column splits into an old component plus a nonzero perpendicular remainder.',
          equation: 'a₂ = r₁₂q₁ + w₂; q₁ᵀw₂ = 0',
          matrices: [
            {
              label: '$\\mathtt{old\\_component} | w_{2}$',
              values: [
                ['1/2', '1/2'],
                [0, 1],
                ['−1/2', '1/2'],
              ],
              dividerBefore: 1,
            },
          ],
        },
      },
      {
        title: 'Normalize the remainder and assemble the factors',
        explanation:
          'Normalizing $w_{2}$ gives $q_{2}$. Storing $q_{1},q_{2}$ as columns fixes the shape of Q; dot products with A give the entries of R.',
        watchFor: 'Which entries of R must be zero?',
        code: 'q2 = w2 / r22\nQ = np.column_stack((q1, q2))\nR = Q.T @ A',
        lineNotes: [
          line(
            'Makes the second unit column.',
            '(3,) / scalar → (3,)',
            '$q_{2} = (1,2,1)^{\\mathsf T}/\\sqrt{6}$.',
          ),
          line(
            'Stores unit directions as columns.',
            'two (3,) arrays → Q: (3, 2)',
            '$Q^{\\mathsf T}Q = I_{2}$.',
          ),
          line(
            'Reads the original columns’ coordinates.',
            '(2, 3) @ (3, 2) → R: (2, 2)',
            '$R = [[\\sqrt{2},-1/\\sqrt{2}],[0,\\sqrt{6}/2]]$, up to rounding.',
          ),
        ],
        after: {
          title: 'A reduced QR factorization',
          description:
            'The triangular matrix records how to recombine the two orthonormal directions.',
          equation: 'A = QR; R is upper triangular',
          matrices: [
            { label: 'Q', values: Q },
            { label: 'R', values: R },
          ],
        },
      },
      {
        title: 'Check both guarantees and the projection',
        explanation:
          'Reconstruction and orthonormality are separate requirements. The ambient projection is a third useful consequence.',
        watchFor: 'Should the 3 × 3 product $QQ^{\\mathsf T}$ equal $I_{3}$?',
        code: 'reconstruction_error = np.linalg.norm(A - Q @ R)\northogonality_error = np.linalg.norm(Q.T @ Q - np.eye(2))\nP = Q @ Q.T',
        lineNotes: [
          line(
            'Measures factorization error.',
            '(3, 2) difference → scalar',
            '$\\Vert A-QR\\Vert$ is near machine precision.',
          ),
          line(
            'Measures loss of orthogonality.',
            '(2, 2) difference → scalar',
            '$\\Vert Q^{\\mathsf T}Q-I_{2}\\Vert$ is near machine precision.',
          ),
          line(
            'Builds the column-space projection.',
            '(3, 2) @ (2, 3) → (3, 3)',
            'P has rank 2 and differs from $I_{3}$.',
          ),
        ],
        after: {
          title: 'A basis for a plane, not all of $\\mathbb R^{3}$',
          description:
            '$QQ^{\\mathsf T}$ projects onto the reachable plane. Its complement projects onto the leftover normal direction.',
          equation: 'P = QQᵀ; P² = P; P ≠ I₃',
          matrices: [
            {
              label: 'P',
              values: [
                ['2/3', '1/3', '−1/3'],
                ['1/3', '2/3', '1/3'],
                ['−1/3', '1/3', '2/3'],
              ],
            },
          ],
        },
      },
      {
        title: 'Connect the factorization to least squares',
        explanation:
          'The target cannot be fitted exactly, but its Q coordinates can be fitted. Solve $R\\hat{\\theta} = Q^{\\mathsf T}b$ instead of forming $A^{\\mathsf T}A$.',
        watchFor:
          'Are $Q^{\\mathsf T}b$ and $\\hat{\\theta}$ coefficients in the same basis?',
        code: 'b = np.ones(3)\ncoordinates = Q.T @ b\ntheta_hat = np.linalg.solve(R, coordinates)\nfitted = A @ theta_hat\nQ_library, R_library = np.linalg.qr(A, mode="reduced")',
        lineNotes: [
          line(
            'Stores the 4.4 target.',
            'b: (3,)',
            '$b = (1,1,1)^{\\mathsf T}$.',
          ),
          line(
            'Computes coordinates in the q basis.',
            '(2, 3) @ (3,) → (2,)',
            '$Q^{\\mathsf T}b = (0,4/\\sqrt{6})^{\\mathsf T}$.',
          ),
          line(
            'Converts to the original column coefficients.',
            'solve((2, 2), (2,)) → (2,)',
            '$\\hat{\\theta} = (2/3,4/3)^{\\mathsf T}$.',
          ),
          line(
            'Computes the fitted output.',
            '(3, 2) @ (2,) → (3,)',
            '$\\hat{b} = (2/3,4/3,2/3)^{\\mathsf T} = QQ^{\\mathsf T}b$.',
          ),
          line(
            'Computes a library factorization.',
            '(3, 2) → (3, 2), (2, 2)',
            'Its signs may differ; verify the product, orthonormality, and projection.',
          ),
        ],
        after: {
          title: 'The same basis supports the 4.4 fit',
          description:
            'The projected target lives in $\\mathbb R^{3}$; its q-basis coordinates and model coefficients each live in $\\mathbb R^{2}$ but represent different bases.',
          equation: 'Rθ̂ = Qᵀb; Aθ̂ = QQᵀb',
          matrices: [
            { label: '$\\hat{\\theta}$', values: [['2/3'], ['4/3']] },
            { label: 'fitted', values: [['2/3'], ['4/3'], ['2/3']] },
          ],
        },
      },
      {
        title: 'See what changes when a column is dependent',
        explanation:
          'A duplicate direction leaves no remainder. This blocks normalization in the full-column-rank construction, even though QR itself still exists.',
        watchFor:
          'Would dividing this remainder by its norm make a new direction?',
        code: 'dependent_column = 2. * a1\nw_dependent = dependent_column - (q1 @ dependent_column) * q1\nthreshold = 1e-12 * np.linalg.norm(dependent_column)\nno_new_direction = np.linalg.norm(w_dependent) <= threshold',
        lineNotes: [
          line(
            'Makes a dependent input.',
            'scalar × (3,) → (3,)',
            'The new column is $2a_{1} = (-2,0,2)^{\\mathsf T}$.',
          ),
          line(
            'Subtracts its entire old component.',
            '(3,) → (3,)',
            'The remainder is zero in exact arithmetic.',
          ),
          line(
            'Sets an explicitly scaled numerical tolerance.',
            'scalar',
            'The threshold is relative to this input’s length.',
          ),
          line(
            'Detects a vanishing remainder.',
            'scalar comparison → boolean',
            '`no_new_direction` is `True`. Stop before division.',
          ),
        ],
        after: {
          title: 'A zero remainder means no additional basis direction',
          description:
            'The column space is only a line. A library QR may complete Q, but the extra column must not be mistaken for another direction in Col(A).',
          equation: 'rank([a₁ | 2a₁]) = 1; R is singular',
          matrices: [
            { label: 'dependent_column', values: [[-2], [0], [2]] },
            { label: 'w_dependent · exact value', values: [[0], [0], [0]] },
          ],
          callout:
            'The maintained routine guards the first column and every later remainder; the practical fit uses lstsq if rank is deficient.',
        },
      },
    ],
  },
};
