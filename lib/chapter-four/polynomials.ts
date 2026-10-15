import type { ChapterSection } from '@/lib/chapter/shared';
import {
  line,
  maintainedNotebook,
  realGeometryNotation,
  lectureNotebookNote,
} from './common';

export const polynomialsNotebook = maintainedNotebook(
  'Ch4-2 Vector Spaces of Polynomials.ipynb',
);
const gram = [
  [2, 0, '2/3'],
  [0, '2/3', 0],
  ['2/3', 0, '2/5'],
];
export const polynomialsSection: ChapterSection = {
  slug: 'polynomials',
  number: '4.2',
  title: 'Polynomial Inner Products and Approximation',
  shortTitle: 'Polynomials',
  summary:
    'Treat polynomials as vectors, compute the integral inner product on [−1,1], and remove the part of $t^{2}$ already explained by lower-degree terms.',
  focus: 'coefficients → integral metric → orthonormal basis',
  learningGoal:
    'Separate polynomial coefficients from function values, derive the Gram matrix, and project a polynomial using the lecture’s integral inner product.',
  lectureConcepts: [
    'Polynomial vector spaces',
    'Integral inner product',
    'Gram matrix',
    'Gram–Schmidt',
    'Legendre normalization',
  ],
  codeExtension:
    'Use coefficients in ascending powers throughout; correct the missing predecessor in the source Gram–Schmidt loop and verify every pair of basis polynomials.',
  ...polynomialsNotebook,
  notebookNote: lectureNotebookNote,
  explorer: 'polynomials',
  lectureNotes: {
    readingLabel: 'Lecture 4 · Reading guide',
    reasoningTitle: 'Why polynomial geometry needs its own inner product',
    reference:
      'Wooseok Ha, MAS110 Lecture 4 (Fall 2026), lec04.pdf: printed slides 7–11, 18, 29, 34–39 (PDF pages 9–13, 21, 33, 39–44).',
    introduction:
      'A polynomial is a vector in a finite-dimensional function space. Its coefficient array is a coordinate representation, not the definition of its length. We use the lecture’s inner product $\\langle f,g\\rangle  = \\int_{-1}^{1} f(t)g(t) \\,dt$ and start with $\\mathcal P_{2}$, the polynomials of degree at most two, including the zero polynomial.',
    notation: [
      ...realGeometryNotation,
      {
        symbol: '𝒫ₙ; B = (1,t,…,tⁿ)',
        meaning:
          '$\\mathcal P_{n}$ has dimension n + 1. “Degree at most n” includes lower degrees and the zero polynomial; polynomials of degree exactly n do not form a vector space. B is an ordered basis, so order determines which coefficient goes with each term.',
      },
      {
        symbol: 'f(t) = c₀ + c₁t + c₂t²; [f]ᴮ = c',
        meaning:
          'The coordinate vector $c = (c_{0},c_{1},c_{2})^{\\mathsf T}$ has three entries. The scalar t is the argument; f(t) is the value at that argument. This page uses t instead of the lecture’s occasional x to distinguish an argument from a coordinate vector.',
      },
      {
        symbol: 'Gᵢⱼ = ∫₋₁¹ tⁱ⁺ʲ dt, i,j = 0,…,n',
        meaning:
          'These indices label monomial degrees, starting at 0. $G_{ij} = 0$ for odd i+j and 2/(i+j+1) for even i+j. The lecture calls this Gram matrix A locally; we call it G to keep A for the design matrix in 4.3–4.4.',
      },
      {
        symbol: '⟨f,g⟩ = cᵀGd; ‖f‖² = cᵀGc',
        meaning:
          'c and d are the coordinates of f and g in B. The plain coordinate dot product $c^{\\mathsf T}d$ is generally different. For example, the coordinate arrays for 1 and $t^{2}$ have dot product 0, but their integral inner product is 2/3.',
      },
      {
        symbol: 'q₀,q₁,q₂; C = [[q₀]ᴮ | [q₁]ᴮ | [q₂]ᴮ]',
        meaning:
          'We label polynomial basis vectors by degree, beginning at 0; these correspond to the lecture’s $w_{1},w_{2},w_{3}$. C has coefficient columns. Orthonormality for this metric means $C^{\\mathsf T}GC = I_{3}$, not $C^{\\mathsf T}C = I_{3}$.',
      },
      {
        symbol: 'Legendre Pₖ(t); normalized qₖ(t)',
        meaning:
          'Standard Legendre polynomials satisfy $P_{k}(1) = 1$ and $\\int_{-1}^{1} P_{k}^{2} = 2/(2k+1)$. Multiplying by $\\sqrt{(2k+1)/2}$ gives $q_{k}$ of unit integral norm. Endpoint normalization and unit-norm normalization are different.',
      },
      {
        symbol: 'NumPy ascending powers: $[c_{0},c_{1},c_{2}]$',
        meaning:
          'numpy.polynomial.polynomial uses increasing powers: [0,1] is t and [0,0,1] is $t^{2}$. The original notebook uses legacy np.polyval/np.polyint, whose arrays run in the opposite order. We use the modern ascending convention consistently and do not mix the two APIs.',
      },
    ],
    reasoning: [
      {
        title: 'An integral can give lengths and angles to functions',
        paragraphs: [
          'The integral is symmetric and bilinear. Also $\\int_{-1}^{1} f(t)^{2} \\,dt \\ge  0$. A nonzero polynomial is continuous and cannot vanish throughout an interval; somewhere its squared value is positive on a neighborhood, so the integral is strictly positive. Thus the integral defines an inner product on $\\mathcal P_{n}$.',
          'For $f(t) = t$ and $g(t) = t^{2}$, their product $t^{3}$ is odd. Its negative and positive signed areas cancel, giving inner product 0. This is function-space orthogonality; crossing curves or a right angle between their drawn tangents is not the definition.',
        ],
        equation: '⟨t,t²⟩ = 0; ‖t‖² = 2/3; ‖t²‖² = 2/5',
      },
      {
        title: 'The Gram matrix translates function geometry into coordinates',
        paragraphs: [
          'Expand $f = \\sum_i c_i t^i$ and $g = \\sum_j d_j t^j$. Bilinearity lets us move the finite sums outside the integral, leaving $\\sum c_{i}d_{j}\\int t^{i+j} = c^{\\mathsf T}Gd$. Symmetry comes from swapping i and j.',
          'For degree two, completing the square gives $c^{\\mathsf T}Gc = 2(c_{0}+c_{2}/3)^{2} + (2/3)c_{1}^{2} + (8/45)c_{2}^{2}$. This is positive for every nonzero coefficient vector, so G is positive definite. Coordinate Euclidean length is a different metric.',
        ],
        equation: 'G = [[2,0,2/3],[0,2/3,0],[2/3,0,2/5]]',
      },
      {
        title: 'Subtract every earlier basis direction before normalizing',
        paragraphs: [
          'Normalize 1 to $q_{0} = 1/\\sqrt{2}$. Because t is odd, it is perpendicular to $q_{0}$; normalize it to $q_{1} = \\sqrt{3/2}t$. The polynomial $t^{2}$ is not perpendicular to the constant: $\\langle t^{2},q_{0}\\rangle  = \\sqrt{2}/3$. Subtracting this component gives $w_{2}(t) = t^{2} - 1/3$.',
          'The source loop uses range(i − 1), which skips the immediately preceding basis vector and does no subtraction for $i = 1$. The maintained routine uses range(j) for all previous vectors with 0-based indexing. It checks the norm before division and verifies $C^{\\mathsf T}GC$, not just the curves’ appearance.',
        ],
        equation: 'q₂(t) = √(45/8)(t² − 1/3); ∫₋₁¹ (t² − 1/3)² dt = 8/45',
      },
      {
        title: 'The best line for $t^{2}$ is a constant, by symmetry',
        paragraphs: [
          'To project $t^{2}$ onto $\\mathcal P_{1} = \\operatorname{span}\\{1,t\\}$, use the orthonormal coordinates $\\langle t^{2},q_{0}\\rangle$ and $\\langle t^{2},q_{1}\\rangle$. The latter is zero because $t^{3}$ is odd. The former times $q_{0}$ gives the constant 1/3.',
          'For any line a + bt, the error is the perpendicular residual $t^{2} - 1/3$ plus a change within $\\mathcal P_{1}$. The integral norm obeys Pythagoras, proving global optimality. The curves need not match at individual points. This is continuous approximation, whereas 4.4 fits a finite list of measurements.',
        ],
        equation: '‖t² − (a + bt)‖² = 8/45 + 2(a − 1/3)² + (2/3)b²',
      },
      {
        title: 'A matrix projection uses the chosen metric',
        paragraphs: [
          'Let E contain coordinates of a basis for the approximation subspace. Writing the approximate coefficient vector as $E\\alpha$ and enforcing $E^{\\mathsf T}G(c - E\\alpha ) = 0$ gives $(E^{\\mathsf T}GE)\\alpha  = E^{\\mathsf T}Gc$. The metric G belongs in both places.',
          'If the basis columns C are orthonormal for $G, \\alpha  = C^{\\mathsf T}Gc$ and the coefficient map is $CC^{\\mathsf T}G$. This reduces to $QQ^{\\mathsf T}$ only in a Euclidean orthonormal coordinate system. The same projection idea therefore connects all four labs without silently changing metrics.',
        ],
        equation: 'G-weighted projection: ĉ = E(EᵀGE)⁻¹EᵀGc',
      },
    ],
    checks: [
      {
        question:
          'Are sampled heights on a grid the polynomial’s coefficients?',
        answer:
          'No. Coefficients are coordinates in a basis; sampled heights are values $f(t_{k})$. Sampling creates a different representation and a plain sum over samples is not automatically the integral inner product.',
      },
      {
        question: 'Why does 1 fail to be perpendicular to $t^{2}$?',
        answer:
          'Their product $t^{2}$ has integral 2/3 on [−1,1]. Coefficient-array orthogonality does not imply integral orthogonality.',
      },
      {
        question: 'Why must the Gram–Schmidt loop use range(j)?',
        answer:
          'At 0-based step j there are j previously accepted basis vectors, with indices 0 through j−1. range(j−1) leaves one out.',
      },
      {
        question: 'Is $q_{2}$ the standard Legendre polynomial $P_{2}$?',
        answer:
          'It is a normalized multiple. $P_{2}(t) = (3t^{2}-1)/2$ has $P_{2}(1)=1$, while $q_{2} = \\sqrt{5/2}P_{2}$ has unit integral norm.',
      },
      {
        question:
          'Does the best polynomial approximation pass through every target point?',
        answer:
          'No. It minimizes the integrated squared difference over the interval. Here the best line for $t^{2}$ is 1/3, with nonzero error 8/45.',
      },
    ],
    references: [
      {
        title: 'NumPy: ascending polynomial coefficients',
        url: 'https://numpy.org/doc/stable/reference/routines.polynomials.polynomial.html',
      },
      {
        title: 'NumPy: polynomial integration',
        url: 'https://numpy.org/doc/stable/reference/generated/numpy.polynomial.polynomial.polyint.html',
      },
    ],
  },
  primer: [
    {
      term: 'Polynomial coordinates',
      definition:
        'The ordered monomial basis identifies a polynomial with a coefficient vector.',
      relation: 'f(t) = c₀ + c₁t + c₂t²',
      watchFor: 'A coefficient is not a sampled function value.',
    },
    {
      term: 'Integral inner product',
      definition:
        'Integrate the product of two functions over the specified interval.',
      relation: '⟨f,g⟩ = ∫₋₁¹ fg = cᵀGd',
      watchFor: 'Changing the interval or weight changes the geometry.',
    },
    {
      term: 'Orthonormal polynomials',
      definition:
        'Basis functions have unit integral norms and zero cross inner products.',
      relation: 'CᵀGC = I',
      watchFor: '$C^{\\mathsf T}C$ checks a different metric.',
    },
  ],
  walkthrough: {
    eyebrow: 'Lab 4.2 · Geometry of functions',
    title: 'Orthogonalize 1, $t, t^{2}$ and find the best line',
    objective:
      'Use the lecture’s low-degree example before generalizing. Coefficients run in ascending powers everywhere in this lab.',
    source: {
      label: 'Maintained notebook',
      filename: polynomialsNotebook.filename,
      url: polynomialsNotebook.githubUrl,
      note: 'Includes a corrected Gram–Schmidt routine, a cubic approximation exercise, and plots on [−1,1].',
    },
    initial: {
      title: 'Polynomials are vectors too',
      description:
        't has coordinates $(0,1,0)^{\\mathsf T}; t^{2}$ has coordinates $(0,0,1)^{\\mathsf T}$ in $(1,t,t^{2})$. Their function-space inner product is defined by an integral.',
      matrices: [
        {
          label: 'coordinates of $t | t^{2}$',
          values: [
            [0, 0],
            [1, 0],
            [0, 1],
          ],
          dividerBefore: 1,
        },
      ],
    },
    steps: [
      {
        title: 'Store coefficients in one fixed order',
        explanation:
          'The modern polynomial API stores the constant first. Make the convention visible before doing any arithmetic.',
        watchFor: 'What polynomial does [1,0,0] represent here?',
        code: 'import numpy as np\nfrom numpy.polynomial import polynomial as poly\nf = np.array([0., 1.])\ng = np.array([0., 0., 1.])',
        lineNotes: [
          line('Loads NumPy.', 'module', 'np supplies coefficient arrays.'),
          line(
            'Selects the ascending-power API.',
            'module',
            'poly.polyval(t,c) evaluates $c_{0}+c_{1}t+\\ldots$.',
          ),
          line(
            'Stores $f(t) = t$.',
            'f: (2,)',
            '[0,1] has zero constant and linear coefficient 1.',
          ),
          line(
            'Stores $g(t) = t^{2}$.',
            'g: (3,)',
            '[0,0,1] has quadratic coefficient 1.',
          ),
        ],
        after: {
          title: 'The basis order is part of the notation',
          description:
            'Missing higher coefficients are implicitly zero. Arrays may have different lengths when multiplication and integration use the polynomial API.',
          equation: 'f(t) = t; g(t) = t²',
          matrices: [
            { label: 'f · ascending coefficients', values: [[0], [1]] },
            { label: 'g · ascending coefficients', values: [[0], [0], [1]] },
          ],
        },
      },
      {
        title: 'Integrate the polynomial product',
        explanation:
          'Multiply the functions, form an antiderivative, then evaluate the endpoints. This uses polynomial arithmetic rather than sampling a curve.',
        watchFor: 'Does a zero integral imply the product is zero at every t?',
        code: 'def inner_poly(f, g):\n    product = poly.polymul(f, g)\n    antiderivative = poly.polyint(product)\n    return poly.polyval(1., antiderivative) - poly.polyval(-1., antiderivative)\ndot_fg = inner_poly(f, g)\nlengths = np.sqrt([inner_poly(f, f), inner_poly(g, g)])',
        lineNotes: [
          line(
            'Defines the inner product on this interval.',
            'two coefficient arrays → scalar',
            'The body runs when the function is called.',
          ),
          line(
            'Multiplies polynomial functions.',
            'polynomial coefficients → polynomial coefficients',
            'For $f=t$ and $g=t^{2}$, product$=t^{3}$.',
          ),
          line(
            'Finds an antiderivative.',
            'degree d → degree d+1',
            'The integration constant cancels in the endpoint difference.',
          ),
          line(
            'Evaluates the definite integral.',
            'two scalar evaluations → scalar',
            'For $t^{3}$ this is $1/4 - 1/4 = 0$.',
          ),
          line(
            'Computes the cross inner product.',
            'scalar',
            '$\\mathtt{dot\\_fg} = 0$, by odd symmetry.',
          ),
          line(
            'Computes integral norms.',
            'two scalars → lengths: (2,)',
            'The lengths are $\\sqrt{2/3}$ and $\\sqrt{2/5}$.',
          ),
        ],
        after: {
          title: 'Perpendicular in the integral metric',
          description:
            'Orthogonality describes the signed integral of fg, not a right angle between curves on the page.',
          equation: '⟨t,t²⟩ = 0; ‖t‖² = 2/3; ‖t²‖² = 2/5',
          matrices: [
            { label: 'integral inner product', values: [[0]] },
            { label: 'squared lengths', values: [['2/3', '2/5']] },
          ],
        },
      },
      {
        title: 'Build the Gram matrix of the monomial basis',
        explanation:
          'Each entry is the integral of a pair of basis functions. This is the metric acting on coefficient vectors.',
        watchFor: 'Why is the top-right entry 2/3 instead of 0?',
        code: 'B = np.eye(3)\nG = np.array([[inner_poly(bi, bj) for bj in B] for bi in B])\ncoefficient_inner = np.array([0., 1., 0.]) @ G @ g\ncontrast = np.array([B[0] @ B[2], inner_poly(B[0], B[2])])',
        lineNotes: [
          line(
            'Stores coefficient rows for 1, $t, t^{2}$.',
            'B: (3, 3)',
            'Here row i has the coefficient of $t^{i}$ equal to 1.',
          ),
          line(
            'Computes all basis-pair integrals.',
            '3 × 3 scalar pairs → G: (3, 3)',
            'Even powers integrate to 2/(degree+1); odd powers to 0.',
          ),
          line(
            'Recomputes $\\langle t,t^{2}\\rangle$ through coordinates.',
            '(3,) @ (3, 3) @ (3,) → scalar',
            'The result is 0, agreeing with direct integration.',
          ),
          line(
            'Contrasts coefficient and integral metrics.',
            'two scalars → contrast: (2,)',
            'For 1 and $t^{2}$, coefficient dot product is 0 but integral inner product is 2/3.',
          ),
        ],
        after: {
          title: 'G records the chosen geometry',
          description:
            'The identity matrix B stores basis coordinates; G stores inner products. They are not the same matrix.',
          equation: '⟨f,g⟩ = [f]ᴮᵀG[g]ᴮ',
          matrices: [
            { label: 'G · integral Gram matrix', values: gram },
            {
              label: 'coordinate dot | integral inner · for $1,t^{2}$',
              values: [[0, '2/3']],
            },
          ],
        },
      },
      {
        title: 'Subtract the constant component of $t^{2}$',
        explanation:
          'Normalize the first two monomials, then subtract both earlier orthonormal components from $t^{2}$. One component is zero, but it must still be accounted for.',
        watchFor:
          'Why does subtracting 1/3 make $t^{2}$ perpendicular to the constant?',
        code: 'q0 = B[0] / np.sqrt(2.)\nq1 = B[1] / np.sqrt(2. / 3.)\nw2 = B[2] - inner_poly(B[2], q0) * q0 - inner_poly(B[2], q1) * q1\nq2 = w2 / np.sqrt(inner_poly(w2, w2))\nC = np.column_stack((q0, q1, q2))\northonormal_gram = C.T @ G @ C',
        lineNotes: [
          line(
            'Normalizes the constant polynomial.',
            '(3,) → (3,)',
            '$q_{0}(t) = 1/\\sqrt{2}$.',
          ),
          line(
            'Normalizes the linear polynomial.',
            '(3,) → (3,)',
            '$q_{1}(t) = \\sqrt{3/2}t$.',
          ),
          line(
            'Removes every earlier component.',
            'three (3,) arrays → (3,)',
            '$w_{2}(t) = t^{2} - 1/3$; its integral against 1 and t is zero.',
          ),
          line(
            'Normalizes the remaining polynomial.',
            '(3,) / scalar → (3,)',
            '$\\Vert w_{2}\\Vert ^{2} = 8/45$, so $q_{2} = \\sqrt{45/8}(t^{2}-1/3)$.',
          ),
          line(
            'Stores orthonormal coefficient columns.',
            'C: (3, 3)',
            'Each column represents one polynomial in the monomial basis.',
          ),
          line(
            'Checks the correct metric.',
            '(3, 3) @ (3, 3) @ (3, 3) → (3, 3)',
            '$C^{\\mathsf T}GC \\approx  I_{3}; C^{\\mathsf T}C$ is not the relevant check.',
          ),
        ],
        after: {
          title: 'Unit polynomials in the integral norm',
          description:
            'The three functions are orthonormal even though their ordinary coefficient dot products are not.',
          equation: 'q₀ = 1/√2; q₁ = √(3/2)t; q₂ = √(45/8)(t²−1/3)',
          matrices: [
            {
              label: '$C^{\\mathsf T}GC \\cdot$ exact value',
              values: [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
              ],
            },
            {
              label: '$w_{2} \\cdot$ ascending coefficients',
              values: [['−1/3'], [0], [1]],
            },
          ],
        },
      },
      {
        title: 'Project $t^{2}$ onto the polynomials of degree at most one',
        explanation:
          'Use $q_{0}$ and $q_{1}$ only, because the approximation space is $\\mathcal P_{1}$. Orthogonality makes each coefficient independent.',
        watchFor: 'Why is the best line a constant here?',
        code: 'target = B[2]\nprojection = inner_poly(target, q0) * q0 + inner_poly(target, q1) * q1\nresidual = target - projection\northogonality = np.array([inner_poly(residual, q0), inner_poly(residual, q1)])\nminimum_error = inner_poly(residual, residual)',
        lineNotes: [
          line(
            'Chooses the target $t^{2}$.',
            'target: (3,)',
            'Its coordinates are [0,0,1].',
          ),
          line(
            'Keeps the two allowed orthonormal components.',
            'two (3,) arrays → (3,)',
            'The projection is [1/3,0,0], representing the constant 1/3.',
          ),
          line(
            'Computes the residual polynomial.',
            '(3,) − (3,) → (3,)',
            '$e(t) = t^{2} - 1/3$.',
          ),
          line(
            'Checks orthogonality to the approximation space.',
            'two scalars → (2,)',
            'Both integrals are approximately zero.',
          ),
          line(
            'Computes integrated squared error.',
            'scalar',
            '$\\int_{-1}^{1} (t^{2}-1/3)^{2} \\,dt = 8/45$.',
          ),
        ],
        after: {
          title: 'One closest function, with a nonzero residual',
          description:
            'The closest line minimizes an integral, not pointwise error at every t. Its residual is perpendicular to every line in $\\mathcal P_{1}$.',
          equation: 'p(t) = 1/3; min ∫₋₁¹ (t²−p(t))² dt = 8/45',
          matrices: [
            {
              label: 'projection | residual · coordinates',
              values: [
                ['1/3', '−1/3'],
                [0, 0],
                [0, 1],
              ],
              dividerBefore: 1,
            },
            { label: 'inner products with $q_{0},q_{1}$', values: [[0], [0]] },
          ],
        },
      },
      {
        title: 'Recover the same approximation from a matrix system',
        explanation:
          'The metric-weighted normal equations are another form of the same projection. The metric G belongs in the system.',
        watchFor: 'What would go wrong if you replaced G by $I_{3}$?',
        code: 'E = B[:2].T\nH = E.T @ G @ E\nrhs = E.T @ G @ target\nalpha = np.linalg.solve(H, rhs)\nprojection_gram = E @ alpha',
        lineNotes: [
          line(
            'Stores coordinates of 1 and t as columns.',
            'E: (3, 2)',
            'The columns span the coefficient representation of $\\mathcal P_{1}$.',
          ),
          line(
            'Builds the subspace Gram matrix.',
            '(2, 3) @ (3, 3) @ (3, 2) → (2, 2)',
            '$H = \\operatorname{diag}(2,2/3)$.',
          ),
          line(
            'Computes target inner products.',
            '(2, 3) @ (3, 3) @ (3,) → (2,)',
            'rhs $= (2/3,0)^{\\mathsf T}$.',
          ),
          line(
            'Solves for coordinates in (1,t).',
            'solve((2, 2), (2,)) → (2,)',
            '$\\alpha  = (1/3,0)^{\\mathsf T}$.',
          ),
          line(
            'Forms the full coefficient vector.',
            '(3, 2) @ (2,) → (3,)',
            'The result [1/3,0,0] agrees with the orthonormal projection.',
          ),
        ],
        after: {
          title: 'The same projection in a different basis',
          description:
            'The two bases describe the same approximation space, so both computations give the constant 1/3.',
          equation: '(EᵀGE)α = EᵀG[target]; projection_gram = projection',
          matrices: [
            {
              label: '[H | rhs]',
              values: [
                [2, 0, '2/3'],
                [0, '2/3', 0],
              ],
              dividerBefore: 2,
            },
            { label: '$\\alpha$', values: [['1/3'], [0]] },
          ],
        },
      },
    ],
  },
};
