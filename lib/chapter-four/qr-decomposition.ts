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
    'Subtract projections one column at a time, reconstruct A = QR, and distinguish rectangular orthonormal columns from a square orthogonal matrix.',
  focus: 'subtract → normalize → reconstruct A = QR',
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
      'The matrix A has m = 3 rows and n = 2 independent columns. Gram–Schmidt replaces its columns by an orthonormal basis for the same column space; R records the coefficients needed to reconstruct the original columns. The lecture calls the normalized Gram–Schmidt vectors wᵢ before naming the QR columns qᵢ. We consistently use qᵢ for normalized directions and wⱼ for an unnormalized remainder.',
    notation: [
      ...realGeometryNotation,
      {
        symbol: 'A = [a₁ | a₂] ∈ ℝ³ˣ²',
        meaning:
          'aⱼ here means column j, a vector in ℝ³. In the statistical model of 4.4, the lecture also names a row feature vector aᵢ via row aᵢᵀ. Check the index and shape: columns are feature directions in measurement space; rows collect features for one measurement.',
      },
      {
        symbol: 'wⱼ; qⱼ = wⱼ/‖wⱼ‖₂',
        meaning:
          'wⱼ is what remains after removing all earlier orthonormal components of aⱼ. qⱼ has unit length; wⱼ generally does not. This normalization needs a nonzero remainder. Independent columns guarantee it in exact arithmetic.',
      },
      {
        symbol: 'rᵢⱼ = qᵢᵀaⱼ (i < j); rⱼⱼ = ‖wⱼ‖₂',
        meaning:
          'These scalars are the reconstruction coefficients. With the positive-diagonal Gram–Schmidt convention, rⱼⱼ > 0. A library can use different matching signs; that does not change QR or the column space.',
      },
      {
        symbol: 'Q ∈ ℝᵐˣⁿ; R ∈ ℝⁿˣⁿ, m ≥ n',
        meaning:
          'For full column rank, reduced Q has n orthonormal columns and reduced R is invertible and upper triangular. QᵀQ = Iₙ. For m > n, Q is rectangular and QQᵀ = P, not Iₘ.',
      },
      {
        symbol: 'Complete QR; Q_full ∈ ℝᵐˣᵐ',
        meaning:
          'Complete Q extends the basis to all of ℝᵐ; R_full has shape m × n. The extra Q columns do not all belong to Col(A). Q_fullQ_fullᵀ = Iₘ, whereas projection onto Col(A) uses only the relevant column-space basis.',
      },
      {
        symbol: 'ε; numerical threshold; matrix rank',
        meaning:
          'ε is a small parameter in the near-dependent example, not a residual vector. In floating point a tiny remainder can indicate numerical dependence. The demonstration routine compares against a threshold scaled by the matrix norm; it is a teaching rank policy, not an exact symbolic rank test.',
      },
      {
        symbol: 'np.linalg.qr(A, mode="reduced")',
        meaning:
          'This returns a reduced factorization using LAPACK routines. Rank-deficient matrices still have QR factorizations, but R is singular and extra Q directions need not lie in Col(A). The full-column-rank solve Rθ = Qᵀb then cannot be used as an invertible solve.',
      },
    ],
    reasoning: [
      {
        title:
          'Subtracting old components creates a new perpendicular direction',
        paragraphs: [
          'Set wⱼ = aⱼ − Σᵢ<ⱼ(qᵢᵀaⱼ)qᵢ. Pair it with any earlier qₖ. Orthonormality cancels exactly the matching term, leaving qₖᵀwⱼ = 0. If wⱼ were zero, aⱼ would already be in the preceding span, contradicting independence.',
          'Dividing by ‖wⱼ‖₂ gives a unit vector. The same argument applies to the first column with an empty sum: a zero first column must be caught before normalization.',
        ],
        equation: 'aⱼ = Σᵢ<ⱼ rᵢⱼqᵢ + rⱼⱼqⱼ',
      },
      {
        title: 'The nested spans make R upper triangular',
        paragraphs: [
          'Each qⱼ is formed using a₁,…,aⱼ, and each aⱼ can be reconstructed using q₁,…,qⱼ. Therefore the two prefixes have the same span. No later direction is needed to reconstruct an earlier column.',
          'Collect these reconstruction coefficients as column j of R. All entries below the diagonal are zero. The nonzero diagonal makes R invertible under the independent-column assumption.',
        ],
        equation: 'span{a₁,…,aⱼ} = span{q₁,…,qⱼ}; A = QR',
      },
      {
        title: 'Follow the lecture’s second column exactly',
        paragraphs: [
          'The first normalized column is q₁ = (−1,0,1)ᵀ/√2. The second coefficient is r₁₂ = q₁ᵀa₂ = −1/√2. Subtracting r₁₂q₁ from a₂ = (1,1,0)ᵀ leaves w₂ = (1/2,1,1/2)ᵀ.',
          'Its length is √6/2, so q₂ = (1,2,1)ᵀ/√6. The negative coefficient is allowed: the component of a₂ along q₁ points in the opposite direction.',
        ],
        equation: 'a₂ = −(1/√2)q₁ + (√6/2)q₂',
      },
      {
        title: 'Orthonormal coordinates simplify projection and fitting',
        paragraphs: [
          'Because QᵀQ = I₂, the coordinates of the projection of b onto Col(A) are Qᵀb. The fitted vector is QQᵀb. If Aθ̂ equals that fitted vector, then QRθ̂ = QQᵀb, so multiplying by Qᵀ gives Rθ̂ = Qᵀb.',
          'For b = (1,1,1)ᵀ, this produces θ̂ = (2/3,4/3)ᵀ, exactly the 4.4 example. Qᵀb are basis coordinates in q₁,q₂; θ̂ are coefficients of the original columns a₁,a₂. They are not the same vector of numbers.',
        ],
        equation: 'Qᵀb = (0,4/√6)ᵀ; Rθ̂ = Qᵀb; b̂ = QQᵀb',
      },
      {
        title:
          'Factorization error and orthogonality error test different things',
        paragraphs: [
          'A small ‖A − QR‖ says the factors reconstruct the input. It does not guarantee a small ‖QᵀQ − I‖. Classical Gram–Schmidt can lose orthogonality for near-dependent columns through cancellation, even while reconstructing A accurately.',
          'Modified Gram–Schmidt computes each projection from the updated remainder. It often improves numerical orthogonality, but severe conditioning can still require reorthogonalization. Use a library QR for practical factorization. The companion notebook compares both errors on the original ε = 10⁻⁸ example instead of relying on one allclose check.',
        ],
      },
      {
        title:
          'Dependent columns change the full-column-rank algorithm, not the existence of QR',
        paragraphs: [
          'If a₂ = 2a₁, its remainder after subtracting the q₁ component is zero. The teaching routine stops instead of dividing by zero; there is no second independent direction in the column space.',
          'QR still exists: a library may complete Q with an arbitrary perpendicular direction while making R singular. Then using all columns of that Q in QQᵀ can project onto a larger space than Col(A). A rank-r basis Qᵣ gives the correct P = QᵣQᵣᵀ; lstsq handles the fit without requiring an invertible R.',
        ],
      },
    ],
    checks: [
      {
        question: 'Must the lecture’s Q match NumPy’s Q entry for entry?',
        answer:
          'No. A column sign in Q can be reversed if the corresponding row of R is reversed. Check A ≈ QR, QᵀQ ≈ I, and the projection instead.',
      },
      {
        question: 'Why is R upper triangular?',
        answer:
          'Column aⱼ is already in span{q₁,…,qⱼ}. It has no component along any later qᵢ, so rᵢⱼ = 0 when i > j.',
      },
      {
        question: 'What fails when the first column is zero?',
        answer:
          'Its norm is zero, so even the first normalization is invalid. A guard only inside the later-column loop misses this case.',
      },
      {
        question: 'Does small A − QR imply QᵀQ is close to I?',
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
      'Keep the lecture’s A = [[−1,1],[0,1],[1,0]] throughout. The same column-space basis leads directly to Lab 4.4.',
    source: {
      label: 'Maintained notebook',
      filename: qrNotebook.filename,
      url: qrNotebook.githubUrl,
      note: 'Contains guarded Gram–Schmidt routines, rank-deficient cases, and the near-dependent numerical example.',
    },
    initial: {
      title: 'Two independent directions in ℝ³',
      description:
        'A has two columns with three entries each. Reduced Q will also have shape (3,2), while R has shape (2,2).',
      matrices: [{ label: 'A', values: A }],
    },
    steps: [
      {
        title: 'Name the input columns',
        explanation:
          'Column j is an ambient vector aⱼ, not a row feature vector. Python uses 0-based column indices.',
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
            'a₁ = (−1,0,1)ᵀ, a₂ = (1,1,0)ᵀ.',
          ),
        ],
        after: {
          title: 'The original columns are not perpendicular',
          description:
            'Their dot product is −1, so we must subtract an overlapping component.',
          equation: 'a₁ᵀa₂ = −1',
          matrices: [{ label: 'a₁ | a₂', values: A, dividerBefore: 1 }],
        },
      },
      {
        title: 'Normalize the first direction',
        explanation:
          'The first column is already nonzero. Its norm becomes the first diagonal entry of R.',
        watchFor: 'Why must r11 be checked before dividing?',
        code: 'r11 = np.linalg.norm(a1)\nq1 = a1 / r11',
        lineNotes: [
          line('Measures the first column.', '(3,) → scalar', 'r₁₁ = √2 > 0.'),
          line(
            'Makes the first unit column.',
            '(3,) / scalar → (3,)',
            'q₁ = (−1,0,1)ᵀ/√2.',
          ),
        ],
        after: {
          title: 'One orthonormal column so far',
          description:
            'There is nothing to subtract at the first step. The first input reconstructs as a₁ = r₁₁q₁.',
          equation: 'r₁₁ = √2; q₁ᵀq₁ = 1',
          matrices: [{ label: 'q₁', values: [['−1/√2'], [0], ['1/√2']] }],
        },
      },
      {
        title: 'Subtract the part of a₂ along q₁',
        explanation:
          'Projection onto the unit direction q₁ uses one dot product. The remainder is perpendicular to q₁.',
        watchFor:
          'What does the negative r12 say about the component’s direction?',
        code: 'r12 = q1 @ a2\nold_component = r12 * q1\nw2 = a2 - old_component\nr22 = np.linalg.norm(w2)',
        lineNotes: [
          line(
            'Finds the old-basis coordinate.',
            '(3,) @ (3,) → scalar',
            'r₁₂ = −1/√2.',
          ),
          line(
            'Turns the scalar coordinate into a vector.',
            'scalar × (3,) → (3,)',
            'The old component is (1/2,0,−1/2)ᵀ.',
          ),
          line(
            'Removes that component.',
            '(3,) − (3,) → (3,)',
            'w₂ = (1/2,1,1/2)ᵀ, perpendicular to q₁.',
          ),
          line(
            'Measures the new direction.',
            '(3,) → scalar',
            'r₂₂ = √6/2 > 0, confirming new information.',
          ),
        ],
        after: {
          title: 'Only the new direction remains',
          description:
            'The second column splits into an old component plus a nonzero perpendicular remainder.',
          equation: 'a₂ = r₁₂q₁ + w₂; q₁ᵀw₂ = 0',
          matrices: [
            {
              label: 'old_component | w₂',
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
          'Normalizing w₂ gives q₂. Storing q₁,q₂ as columns fixes the shape of Q; dot products with A give the entries of R.',
        watchFor: 'Which entries of R must be zero?',
        code: 'q2 = w2 / r22\nQ = np.column_stack((q1, q2))\nR = Q.T @ A',
        lineNotes: [
          line(
            'Makes the second unit column.',
            '(3,) / scalar → (3,)',
            'q₂ = (1,2,1)ᵀ/√6.',
          ),
          line(
            'Stores unit directions as columns.',
            'two (3,) arrays → Q: (3, 2)',
            'QᵀQ = I₂.',
          ),
          line(
            'Reads the original columns’ coordinates.',
            '(2, 3) @ (3, 2) → R: (2, 2)',
            'R = [[√2,−1/√2],[0,√6/2]], up to rounding.',
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
        watchFor: 'Should the 3 × 3 product QQᵀ equal I₃?',
        code: 'reconstruction_error = np.linalg.norm(A - Q @ R)\northogonality_error = np.linalg.norm(Q.T @ Q - np.eye(2))\nP = Q @ Q.T',
        lineNotes: [
          line(
            'Measures factorization error.',
            '(3, 2) difference → scalar',
            '‖A−QR‖ is near machine precision.',
          ),
          line(
            'Measures loss of orthogonality.',
            '(2, 2) difference → scalar',
            '‖QᵀQ−I₂‖ is near machine precision.',
          ),
          line(
            'Builds the column-space projection.',
            '(3, 2) @ (2, 3) → (3, 3)',
            'P has rank 2 and differs from I₃.',
          ),
        ],
        after: {
          title: 'A basis for a plane, not all of ℝ³',
          description:
            'QQᵀ projects onto the reachable plane. Its complement projects onto the leftover normal direction.',
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
          'The target cannot be fitted exactly, but its Q coordinates can be fitted. Solve Rθ̂ = Qᵀb instead of forming AᵀA.',
        watchFor: 'Are Qᵀb and θ̂ coefficients in the same basis?',
        code: 'b = np.ones(3)\ncoordinates = Q.T @ b\ntheta_hat = np.linalg.solve(R, coordinates)\nfitted = A @ theta_hat\nQ_library, R_library = np.linalg.qr(A, mode="reduced")',
        lineNotes: [
          line('Stores the 4.4 target.', 'b: (3,)', 'b = (1,1,1)ᵀ.'),
          line(
            'Computes coordinates in the q basis.',
            '(2, 3) @ (3,) → (2,)',
            'Qᵀb = (0,4/√6)ᵀ.',
          ),
          line(
            'Converts to the original column coefficients.',
            'solve((2, 2), (2,)) → (2,)',
            'θ̂ = (2/3,4/3)ᵀ.',
          ),
          line(
            'Computes the fitted output.',
            '(3, 2) @ (2,) → (3,)',
            'b̂ = (2/3,4/3,2/3)ᵀ = QQᵀb.',
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
            'The projected target lives in ℝ³; its q-basis coordinates and model coefficients each live in ℝ² but represent different bases.',
          equation: 'Rθ̂ = Qᵀb; Aθ̂ = QQᵀb',
          matrices: [
            { label: 'θ̂', values: [['2/3'], ['4/3']] },
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
            'The new column is 2a₁ = (−2,0,2)ᵀ.',
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
            'no_new_direction = True. Stop before division.',
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
