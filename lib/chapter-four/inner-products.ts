import type { ChapterSection } from '@/lib/chapter/shared';
import {
  line,
  maintainedNotebook,
  realGeometryNotation,
  lectureNotebookNote,
} from './common';

export const innerProductsNotebook = maintainedNotebook(
  'Ch4-1 Inner Products in Euclidean Vector Spaces.ipynb',
);
export const innerProductsSection: ChapterSection = {
  slug: 'inner-products',
  number: '4.1',
  title: 'Inner Products, Angles, and Projection',
  shortTitle: 'Inner products',
  summary:
    'Turn a dot product into length, angle, and a perpendicular residual. See why QQᵀ is a meaningful projection when Q is rectangular.',
  focus: 'dot product → norm → angle → projection',
  learningGoal:
    'Compute lengths and angles, distinguish orthogonal from orthonormal, and derive a projection by making its residual perpendicular.',
  lectureConcepts: [
    'Real inner products',
    'Cauchy–Schwarz',
    'Euclidean norm',
    'Orthogonal complements',
    'Projection onto a line',
  ],
  codeExtension:
    'Replace unseeded random vectors with a reproducible 2D example; protect zero-vector normalization and interpret QQᵀ correctly.',
  ...innerProductsNotebook,
  notebookNote: lectureNotebookNote,
  explorer: 'inner-products',
  lectureNotes: {
    readingLabel: 'Lecture 4 · Reading guide',
    reasoningTitle: 'Why the dot product determines the geometry',
    reference:
      'Wooseok Ha, MAS110 Lecture 4 (Fall 2026), lec04.pdf: printed slides 3–6, 12–25, 27, and 30 (PDF pages 5–8, 14–29, 31, and 34).',
    introduction:
      'We keep all vectors real. An inner product is symmetric and bilinear, with ⟨u,u⟩ > 0 for every nonzero u. Here the standard inner product is uᵀv. Lab 4.2 keeps the same geometry but changes the inner product to an integral. Our deterministic example v = (2,1)ᵀ and u = (1,2)ᵀ makes every calculation inspectable.',
    notation: [
      ...realGeometryNotation,
      {
        symbol: 'u,v ∈ ℝ²; q = v/‖v‖₂',
        meaning:
          'u is the vector to project; v is a nonzero direction. q is its unit direction. Dividing by a norm requires a nonzero vector. The zero vector is orthogonal to every vector, but it has no direction or angle.',
      },
      {
        symbol: 'cos φ = uᵀv/(‖u‖₂‖v‖₂)',
        meaning:
          'The formula requires both vectors to be nonzero. Cauchy–Schwarz bounds the ratio by 1 in absolute value. Clip tiny floating-point excursions to [−1,1] before arccos; do not use clipping to hide a zero denominator.',
      },
      {
        symbol: 'p = λv; λ = uᵀv/(vᵀv); e = u − p',
        meaning:
          'λ is a scalar coefficient, p is a vector on span{v}, and e is the perpendicular residual. For unit q the same vector is p = (qᵀu)q. The coefficients λ and qᵀu differ because their basis vectors have different lengths.',
      },
      {
        symbol: 'Q ∈ ℝᵐˣᵏ; QᵀQ = Iₖ',
        meaning:
          'Columns are orthonormal, so k ≤ m. QQᵀ is the m × m projection onto Col(Q), not a meaningless matrix. It equals Iₘ only when the orthonormal columns span all of ℝᵐ; an orthogonal matrix is square.',
      },
      {
        symbol: 'W⊥; V = W ⊕ W⊥',
        meaning:
          'W⊥ contains all vectors perpendicular to every vector of W. In finite-dimensional inner-product spaces each vector has a unique decomposition into these two subspaces. Two perpendicular subspaces need not span the whole space.',
      },
      {
        symbol: 'NumPy: @; np.outer; .T',
        meaning:
          'For two 1D arrays @ is a dot product and returns a scalar. np.outer(q,q) makes the matrix qqᵀ. q.T alone still has shape (2,), so q @ q.T is a scalar, not the projection matrix.',
      },
    ],
    reasoning: [
      {
        title: 'Cauchy–Schwarz makes the angle formula possible',
        paragraphs: [
          'If v ≠ 0, 0 ≤ ‖u − tv‖₂² = ‖u‖₂² − 2t⟨u,v⟩ + t²‖v‖₂² for every real t. At t = ⟨u,v⟩/‖v‖₂², this implies ⟨u,v⟩² ≤ ‖u‖₂²‖v‖₂². The v = 0 case gives 0 ≤ 0 directly.',
          'Thus the cosine ratio lies in [−1,1] for nonzero vectors. Scaling a vector by a positive number changes its length, but not its angle with another vector. A negative scale reverses its direction.',
        ],
        equation: '|⟨u,v⟩| ≤ ‖u‖₂‖v‖₂; here cos φ = 4/5',
      },
      {
        title: 'A unit direction changes the coordinate, not the line',
        paragraphs: [
          'The vectors v and q = v/‖v‖₂ span the same line. A coordinate along v is λ = 4/5, while the coordinate along q is qᵀu = 4/√5. Multiplying either coordinate by its associated basis vector gives p = (8/5,4/5)ᵀ.',
          'Orthogonal only means a zero inner product. Orthonormal additionally means unit length. Projection by an inner product alone uses a unit direction; otherwise the denominator ⟨v,v⟩ must remain.',
        ],
        equation: 'p = (uᵀv)/(vᵀv) · v = (qᵀu)q',
      },
      {
        title: 'The perpendicular residual certifies the nearest point',
        paragraphs: [
          'With e = u − λv and λ = ⟨u,v⟩/⟨v,v⟩, ⟨e,v⟩ = 0. Any other point μv differs from p only along the line, so its error is the sum of two perpendicular components.',
          'Here e = (−3/5,6/5)ᵀ, with squared length 9/5. Every μ other than 4/5 adds a positive squared distance along the line.',
        ],
        equation: '‖u − μv‖₂² = ‖e‖₂² + (μ − λ)²‖v‖₂²',
      },
      {
        title: 'QQᵀ is a projection; completing Q changes its range',
        paragraphs: [
          'Because QᵀQ = Iₖ, P = QQᵀ satisfies Pᵀ = P and P² = Q(QᵀQ)Qᵀ = P. Also Pz lies in Col(Q) and Qᵀ(z − Pz) = 0. That is exactly orthogonal projection.',
          'The original 4.1 notebook calls a rectangular Q’s QQᵀ meaningless. The corrected interpretation is a projection onto the chosen column space. Completing Q to a square orthogonal basis makes its range the whole space and QQᵀ = Iₘ.',
        ],
        equation: 'q = (2,1)ᵀ/√5 ⇒ P = 1/5 · [[4,2],[2,1]] ≠ I₂',
      },
      {
        title: 'Perpendicular subspaces and complements are different claims',
        paragraphs: [
          'For U = span{(1,0,0)ᵀ} and W = span{(0,1,0)ᵀ}, U ⊥ W. But U⊥ is the entire yz-plane; W is only one line in it. A complement must also account for the remaining direction.',
          'For any finite-dimensional subspace W, projection gives u = Pu + (I − P)u. The intersection W ∩ W⊥ is {0}, since a vector perpendicular to itself has zero norm. This proves uniqueness of the decomposition.',
        ],
      },
    ],
    checks: [
      {
        question:
          'Is the zero vector perpendicular to v? Does it have an angle with v?',
        answer:
          'Its dot product with v is zero, so it is orthogonal. The angle is undefined because its norm is zero. The explorer reports this case explicitly.',
      },
      {
        question: 'Can you write the projection as (uᵀv)v?',
        answer:
          'Only if v is a unit vector. Otherwise divide by vᵀv. For our v, this denominator is 5.',
      },
      {
        question: 'Are λ and p interchangeable?',
        answer:
          'No. λ = 4/5 is one coordinate; p = λv = (8/5,4/5)ᵀ is the projected vector. Changing the basis vector’s length changes the coordinate but not p.',
      },
      {
        question: 'Why is QQᵀ useful when Q has fewer columns than rows?',
        answer:
          'It projects onto Col(Q). QᵀQ checks orthonormality in coordinate space; QQᵀ acts in the ambient space. They have different shapes and purposes.',
      },
    ],
    references: [
      {
        title: 'NumPy: outer products',
        url: 'https://numpy.org/doc/stable/reference/generated/numpy.outer.html',
      },
    ],
  },
  primer: [
    {
      term: 'Inner product',
      definition:
        'A scalar comparison satisfying symmetry, bilinearity, and positive definiteness.',
      relation: '⟨u,v⟩ = uᵀv',
      watchFor:
        'The inner product is a scalar; elementwise products form a vector until summed.',
    },
    {
      term: 'Norm and angle',
      definition:
        'A norm measures length; a normalized dot product compares directions.',
      relation: '‖u‖₂ = √(uᵀu); cos φ = ⟨u,v⟩/(‖u‖₂‖v‖₂)',
      watchFor: 'Zero length cannot be normalized and has no angle.',
    },
    {
      term: 'Projection',
      definition:
        'The component on a subspace leaving a perpendicular residual.',
      relation: 'p = (qᵀu)q; e = u − p',
      watchFor: 'This short formula assumes q has unit norm.',
    },
  ],
  walkthrough: {
    eyebrow: 'Lab 4.1 · Euclidean geometry',
    title: 'From two vectors to a perpendicular residual',
    objective:
      'Use u = (1,2)ᵀ and v = (2,1)ᵀ to inspect each scalar, vector, and matrix. The formulas are the lecture’s; the small values are a reproducible teaching example.',
    source: {
      label: 'Maintained notebook',
      filename: innerProductsNotebook.filename,
      url: innerProductsNotebook.githubUrl,
      note: 'The web trace shows prepared results. The geometry explorer recomputes them as inputs change.',
    },
    initial: {
      title: 'Two vectors, one inner product',
      description:
        'Both vectors have two entries. Their inner product will have just one.',
      matrices: [
        {
          label: 'u | v',
          values: [
            [1, 2],
            [2, 1],
          ],
          dividerBefore: 1,
        },
      ],
    },
    steps: [
      {
        title: 'Compute the dot product',
        explanation:
          'Multiply matching entries, then add. A dot product reduces two vectors to one real number.',
        watchFor: 'What does u * v return, and what does u @ v return?',
        code: 'import numpy as np\nu = np.array([1., 2.])\nv = np.array([2., 1.])\ndot_uv = u @ v',
        lineNotes: [
          line(
            'Loads NumPy.',
            'module',
            'np supplies arrays and linear algebra.',
          ),
          line('Stores the vector to project.', 'u: (2,)', 'u = (1,2)ᵀ.'),
          line(
            'Stores the projection direction.',
            'v: (2,)',
            'v = (2,1)ᵀ, with nonzero norm.',
          ),
          line(
            'Takes the inner product.',
            '(2,) @ (2,) → scalar',
            '1·2 + 2·1 = 4.',
          ),
        ],
        after: {
          title: 'A scalar comparison',
          description: 'The dot product is 4. It is not a vector or an angle.',
          equation: '⟨u,v⟩ = 4',
          matrices: [
            { label: 'u * v · before summing', values: [[2], [2]] },
            { label: 'u @ v · scalar', values: [[4]] },
          ],
        },
      },
      {
        title: 'Turn squared lengths into lengths',
        explanation:
          'The same inner product with both arguments equal gives squared length. Its square root gives length.',
        watchFor: 'Why is a squared norm nonnegative?',
        code: 'norm_u = np.linalg.norm(u)\nnorm_v = np.linalg.norm(v)\nq = v / norm_v',
        lineNotes: [
          line(
            'Computes the length of u.',
            '(2,) → scalar',
            '√(1² + 2²) = √5.',
          ),
          line(
            'Computes the length of v.',
            '(2,) → scalar',
            '√(2² + 1²) = √5 > 0.',
          ),
          line(
            'Normalizes the nonzero direction.',
            '(2,) / scalar → (2,)',
            'q = (2/√5,1/√5)ᵀ and qᵀq = 1.',
          ),
        ],
        after: {
          title: 'One unit direction',
          description: 'q and v span the same line, but q has length 1.',
          equation: '‖u‖₂ = ‖v‖₂ = √5; ‖q‖₂ = 1',
          matrices: [
            { label: 'q · unit direction', values: [['2/√5'], ['1/√5']] },
          ],
        },
      },
      {
        title: 'Compute the angle safely',
        explanation:
          'Divide out both lengths. Clip rounding errors at the endpoints before converting the cosine to degrees.',
        watchFor: 'Would the formula work if u were zero?',
        code: 'cos_phi = np.clip(dot_uv / (norm_u * norm_v), -1., 1.)\nphi_degrees = np.degrees(np.arccos(cos_phi))',
        lineNotes: [
          line(
            'Computes a direction-only comparison.',
            'scalar / scalar → scalar',
            'cos φ = 4/5 = 0.8. Both norms here are nonzero.',
          ),
          line(
            'Converts cosine to an angle.',
            'scalar radians → scalar degrees',
            'φ ≈ 36.869898°. arccos returns radians; degrees converts units.',
          ),
        ],
        after: {
          title: 'An acute angle',
          description:
            'A positive dot product gives an acute angle between nonzero vectors.',
          equation: 'cos φ = 4/5; φ ≈ 36.87°',
          matrices: [{ label: 'cos φ', values: [['4/5']] }],
        },
      },
      {
        title: 'Project onto the line',
        explanation:
          'The scalar qᵀu is the coordinate along the unit direction. Multiplying by q returns to ambient vector space.',
        watchFor: 'Which value is a coordinate, and which is a vector?',
        code: 'coordinate = q @ u\nprojected = coordinate * q\nresidual = u - projected\nperpendicular = q @ residual',
        lineNotes: [
          line(
            'Finds the coordinate along q.',
            '(2,) @ (2,) → scalar',
            'qᵀu = 4/√5.',
          ),
          line(
            'Forms the projected vector.',
            'scalar × (2,) → (2,)',
            'p = (8/5,4/5)ᵀ.',
          ),
          line(
            'Keeps the part not explained by the line.',
            '(2,) − (2,) → (2,)',
            'e = (−3/5,6/5)ᵀ.',
          ),
          line(
            'Checks perpendicularity.',
            '(2,) @ (2,) → scalar',
            'qᵀe ≈ 0 within floating-point tolerance.',
          ),
        ],
        after: {
          title: 'Along the line plus perpendicular to it',
          description: 'u = p + e, with p on span{v} and e perpendicular to v.',
          equation: 'u = p + e; vᵀe = 0',
          matrices: [
            {
              label: 'p | e',
              values: [
                ['8/5', '−3/5'],
                ['4/5', '6/5'],
              ],
              dividerBefore: 1,
            },
          ],
          plane: {
            xRange: [-1, 3],
            yRange: [-1, 3],
            xLabel: 'first coordinate',
            yLabel: 'second coordinate',
            lines: [{ from: [-1, -0.5], to: [3, 1.5], tone: 'source' }],
            vectors: [
              { to: [1, 2], label: 'u', tone: 'target' },
              { to: [1.6, 0.8], label: 'p', tone: 'source' },
            ],
            segments: [
              {
                from: [1.6, 0.8],
                to: [1, 2],
                label: 'e',
                tone: 'result',
                dashed: true,
              },
            ],
          },
        },
      },
      {
        title: 'Make the projection a matrix',
        explanation:
          'An outer product builds a map acting on any input vector. The short basis has one column, so its projection is not the full identity.',
        watchFor: 'Why is P 2 × 2 while Q is 2 × 1?',
        code: 'Q = q[:, None]\nP = Q @ Q.T\nprojected_again = P @ u\nprojector_check = np.allclose(P.T, P) and np.allclose(P @ P, P)',
        lineNotes: [
          line(
            'Makes one explicit column.',
            '(2,) → Q: (2, 1)',
            '[:, None] adds a column dimension; .T on q alone would not.',
          ),
          line(
            'Forms the ambient projection.',
            '(2, 1) @ (1, 2) → (2, 2)',
            'P = qqᵀ = [[4,2],[2,1]]/5.',
          ),
          line(
            'Applies the map to u.',
            '(2, 2) @ (2,) → (2,)',
            'P @ u gives (8/5,4/5)ᵀ again.',
          ),
          line(
            'Checks two defining matrix properties.',
            'two comparisons → boolean',
            'Pᵀ ≈ P and P² ≈ P; projector_check = True.',
          ),
        ],
        after: {
          title: 'QQᵀ projects onto the column space',
          description:
            'QᵀQ = I₁ but QQᵀ = P ≠ I₂. The range is a line, not all of ℝ².',
          equation: 'QᵀQ = [1]; QQᵀ = P',
          matrices: [
            {
              label: 'P',
              values: [
                ['4/5', '2/5'],
                ['2/5', '1/5'],
              ],
            },
            { label: 'projected_again', values: [['8/5'], ['4/5']] },
          ],
        },
      },
      {
        title: 'Verify the orthogonal decomposition',
        explanation:
          'The squared lengths add because the components are perpendicular. This is the reason the projection is closest.',
        watchFor: 'Would lengths themselves add in the same way?',
        code: 'squared_parts = np.array([projected @ projected, residual @ residual])\npythagoras = np.allclose(u @ u, squared_parts.sum())\nq_perp = np.array([-q[1], q[0]])\nQ_full = np.column_stack((q, q_perp))',
        lineNotes: [
          line(
            'Computes two squared lengths.',
            'two scalars → (2,)',
            '‖p‖₂² = 16/5 and ‖e‖₂² = 9/5.',
          ),
          line(
            'Checks Pythagoras.',
            'scalar comparison → boolean',
            '16/5 + 9/5 = 5 = ‖u‖₂².',
          ),
          line(
            'Chooses a unit perpendicular direction.',
            '(2,)',
            'Rotate q by 90°: (−1/√5,2/√5)ᵀ.',
          ),
          line(
            'Completes an orthonormal basis.',
            'two (2,) columns → (2, 2)',
            'Q_full is square; both Q_fullᵀQ_full and Q_fullQ_fullᵀ equal I₂.',
          ),
        ],
        after: {
          title: 'Completing the basis explains the identity',
          description:
            'Adding the perpendicular direction fills ℝ². The earlier line projection remains useful as one part of this decomposition.',
          equation: '‖u‖₂² = 16/5 + 9/5 = 5; Q_fullQ_fullᵀ = I₂',
          matrices: [
            { label: 'squared parts · not lengths', values: [['16/5', '9/5']] },
            {
              label: 'Q_full',
              values: [
                ['2/√5', '−1/√5'],
                ['1/√5', '2/√5'],
              ],
            },
          ],
        },
      },
    ],
  },
};
