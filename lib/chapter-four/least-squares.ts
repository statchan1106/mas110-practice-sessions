import type { ChapterSection } from '@/lib/chapter/shared';
import { toneCells, toneColumn } from '@/lib/chapter/shared';
import { leastSquaresLectureNotes } from '@/lib/chapter-four/least-squares-notes';

export const leastSquaresNotebook = {
  filename: 'Ch4-4 Least Squares.ipynb',
  githubUrl:
    'https://github.com/statchan1106/mas110-practice-sessions/blob/main/notebooks/Ch4-4%20Least%20Squares.ipynb',
  colabUrl:
    'https://colab.research.google.com/github/statchan1106/mas110-practice-sessions/blob/main/notebooks/Ch4-4%20Least%20Squares.ipynb',
};

const A = [
  [-1, 1],
  [0, 1],
  [1, 0],
];
const b = [[1], [1], [1]];
const fitted = [['2/3'], ['4/3'], ['2/3']];
const residual = [['1/3'], ['−1/3'], ['1/3']];

export const leastSquaresSection: ChapterSection = {
  slug: 'least-squares',
  number: '4.4',
  title: 'Least Squares as Orthogonal Projection',
  shortTitle: 'Least squares',
  summary:
    'Follow the lecture’s 3 × 2 example from an unreachable target to normal equations, a perpendicular residual, and a unique fitted output.',
  focus: 'minimize error → project b → check the residual',
  learningGoal:
    'Find the closest reachable output to b, explain why the residual is perpendicular to Col(A), and distinguish unique fitted values from possibly non-unique coefficients.',
  lectureConcepts: [
    'Euclidean squared error',
    'Normal equations',
    'Orthogonal projection',
    'Reduced QR',
    'Rank and uniqueness',
  ],
  codeExtension:
    'Compare the lecture’s normal equations with reduced QR and NumPy lstsq; then duplicate a column to see which quantities stay unique.',
  ...leastSquaresNotebook,
  notebookNote:
    'Run the lecture example and vary the observations. The companion notebook, including QR and dependent-column checks, is maintained in this project’s GitHub repository.',
  explorer: 'least-squares',
  lectureNotes: leastSquaresLectureNotes,
  primer: [
    {
      term: 'Objective and minimizer',
      definition:
        '$A\\theta$ is the prediction for candidate coefficients $\\theta$. Choose $\\hat{\\theta}$ to minimize the sum of squared differences between predictions and observations.',
      relation: 'f(θ) = ‖Aθ − b‖₂²; θ̂ ∈ arg min f',
      watchFor:
        'The coefficient $\\hat{\\theta}$ is a vector; the minimum squared error $f(\\hat{\\theta})$ is a scalar.',
    },
    {
      term: 'Normal equations',
      definition:
        'At a minimum, the residual has zero inner product with every column of A. This gives a smaller system in coefficient space.',
      relation: 'AᵀAθ̂ = Aᵀb ⇔ Aᵀe = 0',
      watchFor:
        'These equations hold for every least-squares minimizer. Their inverse formula requires full column rank.',
    },
    {
      term: 'Fitted values and residual',
      definition:
        'The fitted vector $\\hat{b}$ belongs to the reachable subspace; the remaining part e belongs to its orthogonal complement.',
      relation: 'b = b̂ + e; b̂ ∈ Col(A), e ∈ Null(Aᵀ)',
      watchFor:
        'Orthogonality does not mean the residual is zero. Here $\\hat{b}$ and e live in $\\mathbb R^{3}$, while $\\hat{\\theta}$ lives in $\\mathbb R^{2}$.',
    },
    {
      term: 'Uniqueness',
      definition:
        'The nearest reachable output is always unique. Different coefficients can produce that same output if the null space is nontrivial.',
      relation: 'all minimizers = θ̂ + Null(A)',
      watchFor:
        'Independent columns give one coefficient vector; dependent columns give a family with the same fitted values.',
    },
  ],
  walkthrough: {
    eyebrow: 'Lab 4.4 · Lecture example',
    title: 'From an impossible exact fit to the nearest output',
    objective:
      'Use the same A and b as printed slide 67. Keep coefficients, fitted values, and residuals separate, then verify the geometric reason the error cannot be improved.',
    source: {
      label: 'Companion notebook',
      filename: leastSquaresNotebook.filename,
      url: leastSquaresNotebook.githubUrl,
      note: 'Lecture 4, printed slides 61–68 (PDF pages 71–78), with projection and QR connections. The browser displays prepared states; Python runs in Colab.',
    },
    initial: {
      title: 'Three observations, two coefficients',
      description:
        'For $\\theta  = (\\theta _{1},\\theta _{2})^{\\mathsf T}, A\\theta  = (-\\theta _{1} + \\theta _{2}, \\theta _{2}, \\theta _{1})^{\\mathsf T}$. The last two observations would force $\\theta _{2} = \\theta _{1} = 1$, making the first prediction 0 rather than 1.',
      equation:
        '$A\\theta  = b$ has no exact solution for $b = (1,1,1)^{\\mathsf T}$',
      matrices: [
        { label: 'A · lecture design matrix', values: A },
        { label: 'b · observed output', values: b },
      ],
      callout:
        'The obstruction comes from this particular b, not merely from having more equations than coefficients.',
    },
    steps: [
      {
        code: 'import numpy as np\nA = np.array([[-1., 1.], [0., 1.], [1., 0.]])\nb = np.array([1., 1., 1.])\nleft_normal = np.array([1., -1., 1.])\nreachability_check = (A.T @ left_normal, left_normal @ b)',
        lineNotes: [
          {
            action: 'Loads NumPy.',
            shape: 'module import',
            operation: 'Use np for array creation and linear algebra.',
          },
          {
            action: 'Stores the lecture matrix by rows.',
            shape: '3 rows × 2 features → A: (3, 2)',
            operation:
              'A @ theta will output $(-\\theta _{1} + \\theta _{2}, \\theta _{2}, \\theta _{1})$.',
          },
          {
            action: 'Stores three observed responses.',
            shape: 'b: (3,)',
            operation: 'All three measurements request the value 1.',
          },
          {
            action: 'Chooses a normal to the reachable plane.',
            shape: 'left_normal: (3,)',
            operation:
              '$\\ell  = (1,-1,1)^{\\mathsf T}$ is perpendicular to each column of A.',
          },
          {
            action: 'Checks that b is outside that plane.',
            shape: '(2, 3) @ (3,) → (2,); (3,) @ (3,) → scalar',
            operation:
              '$A^{\\mathsf T}\\ell  = (0,0)^{\\mathsf T}$ but $\\ell ^{\\mathsf T}b = 1$. Every $A\\theta$ has $\\ell ^{\\mathsf T}A\\theta  = 0$, so none equals b.',
          },
        ],
        title: 'Show why the exact system is inconsistent',
        explanation:
          'The normal vector $\\ell$ detects an unreachable component of b. The rows are measurements and the columns are feature directions in measurement space.',
        watchFor:
          'If every $A\\theta$ has zero inner product with $\\ell$, can an output with $\\ell ^{\\mathsf T}b = 1$ be reached?',
        after: {
          title: 'A certificate that $b \\notin  \\operatorname{Col}(A)$',
          description:
            'The reachable plane satisfies $z_{1} - z_{2} + z_{3} = 0$. The observation b does not satisfy that equation.',
          equation: 'Aᵀℓ = 0; ℓᵀb = 1 ≠ 0',
          matrices: [
            {
              label: '$A^{\\mathsf T}\\ell  \\cdot$ orthogonal to both columns',
              values: [[0], [0]],
            },
            {
              label: '$\\ell ^{\\mathsf T}b \\cdot$ nonzero component',
              values: [[1]],
            },
          ],
          callout:
            'Least squares asks for the nearest point on this plane, not an exact solution to the inconsistent system.',
        },
      },
      {
        code: 'theta_trial = np.array([0., 0.])\nfitted_trial = A @ theta_trial\nresidual_trial = b - fitted_trial\nsse_trial = residual_trial @ residual_trial',
        lineNotes: [
          {
            action: 'Chooses a simple candidate coefficient.',
            shape: 'theta_trial: (2,)',
            operation: 'The trial coefficient $\\theta  = (0,0)^{\\mathsf T}$.',
          },
          {
            action: 'Computes three predictions.',
            shape: '(3, 2) @ (2,) → fitted_trial: (3,)',
            operation: '$A\\theta  = (0,0,0)^{\\mathsf T}$.',
          },
          {
            action: 'Subtracts predictions from observations.',
            shape: '(3,) − (3,) → residual_trial: (3,)',
            operation: '$b - A\\theta  = (1,1,1)^{\\mathsf T}$.',
          },
          {
            action: 'Adds the squared residual entries.',
            shape: '(3,) @ (3,) → scalar',
            operation:
              '$1^{2} + 1^{2} + 1^{2} = 3$; this is the sum of squared errors (SSE).',
          },
        ],
        title: 'Separate the candidate, its output, and its error',
        explanation:
          'The objective depends on the three output errors, not on the size of the two coefficients. A smaller residual length and a smaller squared residual length have the same minimizers.',
        watchFor:
          'Which array has two entries, which has three, and which quantity is a scalar?',
        variables: [
          {
            name: 'sse_trial',
            value: '3',
            meaning: 'Squared error of the zero coefficient, not the minimum.',
          },
        ],
        after: {
          title: 'A baseline squared error of 3',
          description:
            'Choosing $\\theta  = 0$ reaches the origin. We can reduce the error by moving the fitted output within Col(A).',
          equation: 'f(0) = ‖b‖₂² = 3',
          matrices: [
            {
              label: String.raw`$\theta_{\mathrm{trial}}$ · coefficients`,
              values: [[0], [0]],
            },
            {
              label: 'fitted_trial | residual_trial',
              values: [
                [0, 1],
                [0, 1],
                [0, 1],
              ],
              dividerBefore: 1,
            },
          ],
          callout:
            'The objective is a sum, not a mean. Dividing by m would rescale the objective but leave the minimizers unchanged.',
        },
      },
      {
        code: 'G = A.T @ A\nh = A.T @ b\ntheta_normal = np.linalg.solve(G, h)',
        lineNotes: [
          {
            action: 'Forms the Gram matrix from column dot products.',
            shape: '(2, 3) @ (3, 2) → G: (2, 2)',
            operation:
              '$G = [[2,-1],[-1,2]]$. Its determinant is 3, so it is invertible here.',
          },
          {
            action: 'Forms the normal-equation right-hand side.',
            shape: '(2, 3) @ (3,) → h: (2,)',
            operation:
              '$h = (0,2)^{\\mathsf T}$ collects the inner products of b with A’s columns.',
          },
          {
            action: 'Solves $G\\theta  = h$ for the coefficients.',
            shape: 'solve((2, 2), (2,)) → theta_normal: (2,)',
            operation:
              '$2\\theta _{1} - \\theta _{2} = 0$ and $-\\theta _{1} + 2\\theta _{2} = 2$ give $\\hat{\\theta} = (2/3,4/3)^{\\mathsf T}$.',
          },
        ],
        title: 'Solve the lecture’s normal equations',
        explanation:
          'A zero gradient gives $A^{\\mathsf T}A\\hat{\\theta} = A^{\\mathsf T}b$. The columns are independent here, making G positive definite. solve computes the coefficient without explicitly forming an inverse.',
        watchFor:
          'Why is G a 2 × 2 matrix even though there are three measurements?',
        after: {
          title: 'One minimizing coefficient in $\\mathbb R^{2}$',
          description:
            'The normal equations are a system for coefficients, not three fitted values. Invertibility of G depends on independent columns.',
          equation: 'Gθ̂ = h; θ̂ = (2/3,4/3)ᵀ',
          matrices: [
            {
              label: '[G | h]',
              values: [
                [2, -1, 0],
                [-1, 2, 2],
              ],
              dividerBefore: 2,
            },
            {
              label: '$\\theta _{\\mathrm{normal}}$',
              values: [['2/3'], ['4/3']],
            },
          ],
          callout:
            'This step explains the formula for a small full-rank example. General computations later use lstsq directly on A.',
        },
      },
      {
        code: 'fitted = A @ theta_normal\nresidual = b - fitted\northogonality = A.T @ residual\nsse = residual @ residual',
        lineNotes: [
          {
            action: 'Maps coefficients to the best fitted output.',
            shape: '(3, 2) @ (2,) → fitted: (3,)',
            operation:
              '$\\hat{b} = (-2/3 + 4/3, 4/3, 2/3)^{\\mathsf T} = (2/3,4/3,2/3)^{\\mathsf T}$.',
          },
          {
            action: 'Computes the remaining output error.',
            shape: '(3,) − (3,) → residual: (3,)',
            operation:
              '$e = (1/3,-1/3,1/3)^{\\mathsf T}$. Negative $e_{2}$ means observation 2 is below its prediction.',
          },
          {
            action: 'Checks perpendicularity to both feature columns.',
            shape: '(2, 3) @ (3,) → orthogonality: (2,)',
            operation:
              '$A^{\\mathsf T}e \\approx  (0,0)^{\\mathsf T}$ in floating point; exact fractions give zero.',
          },
          {
            action: 'Measures the minimum squared error.',
            shape: '(3,) @ (3,) → scalar',
            operation:
              '$(1/3)^{2} + (-1/3)^{2} + (1/3)^{2} = 1/3$, compared with baseline 3.',
          },
        ],
        title: 'Check the fitted vector and perpendicular residual',
        explanation:
          'The residual need not vanish. Its perpendicularity proves that moving the fit along any column-space direction only adds squared error; the proof below uses Pythagoras.',
        watchFor:
          'Does $A^{\\mathsf T}e = 0$ say that every measurement is fitted exactly?',
        variables: [
          {
            name: 'sse',
            value: '1/3 ≈ 0.333333',
            meaning:
              'Minimum sum of squared errors; the minimum residual length is $1/\\sqrt{3}$.',
          },
        ],
        after: {
          title: 'Reachable part plus perpendicular part',
          description:
            'The diagram is a 2D orthonormal slice through $\\hat{b}$ and e inside $\\mathbb R^{3}$. Its axes point along these two perpendicular directions; they are not the measurement coordinates $b_{1}$ and $b_{2}$.',
          equation: 'b = b̂ + e; Aᵀe = 0; min f = 1/3',
          matrices: [
            { label: '$\\hat{b} \\cdot$ fitted output', values: fitted },
            { label: 'e · observed minus fitted', values: residual },
            {
              label: '$A^{\\mathsf T}e \\cdot$ exact value',
              values: [[0], [0]],
            },
          ],
          plane: {
            xRange: [-0.2, 2],
            yRange: [-0.2, 1],
            xLabel: 'along b̂ · reachable',
            yLabel: 'along e',
            lines: [
              {
                from: [-0.1, 0],
                to: [1.9, 0],
                tone: 'source',
              },
            ],
            vectors: [
              { to: [Math.sqrt(8 / 3), 0], label: 'b̂', tone: 'source' },
              {
                to: [Math.sqrt(8 / 3), 1 / Math.sqrt(3)],
                label: 'b',
                tone: 'target',
              },
            ],
            segments: [
              {
                from: [Math.sqrt(8 / 3), 0],
                to: [Math.sqrt(8 / 3), 1 / Math.sqrt(3)],
                label: 'e',
                tone: 'result',
                dashed: true,
              },
            ],
          },
          callout:
            '$A^{\\mathsf T}e = 0$ is a statement about two inner products, not three residual entries. Exact values are shown; numerical checks use a tolerance.',
        },
      },
      {
        code: 'P = A @ np.linalg.solve(G, A.T)\nprojected = P @ b\nprojector_ok = np.allclose(P.T, P) and np.allclose(P @ P, P)',
        lineNotes: [
          {
            action: 'Constructs the projection map in output space.',
            shape: '(3, 2) @ solve((2, 2), (2, 3)) → P: (3, 3)',
            operation:
              'The solved factor is $G^{-1}A^{\\mathsf T}$, so $P = AG^{-1}A^{\\mathsf T}$ without forming $G^{-1}$ explicitly.',
          },
          {
            action: 'Projects the target b.',
            shape: '(3, 3) @ (3,) → projected: (3,)',
            operation: '$Pb = (2/3,4/3,2/3)^{\\mathsf T} = \\hat{b}$.',
          },
          {
            action: 'Checks symmetry and idempotence numerically.',
            shape: 'two matrix comparisons → boolean',
            operation:
              '$P^{\\mathsf T}\\approx P$ and $P^2\\approx P$; exact algebra gives equality. `projector_ok` is `True`.',
          },
        ],
        title: 'See least squares as an orthogonal projection',
        explanation:
          'P acts on a three-entry target and returns a three-entry fitted vector. It does not return the two coefficients. Symmetry gives perpendicular projection; idempotence means an already projected vector stays fixed.',
        watchFor: 'Why must P have shape (3, 3), rather than (2, 2)?',
        after: {
          title: 'One projection, independent of the chosen basis',
          description:
            'P projects onto $\\operatorname{Col}(A); I_{3} - P$ projects onto its orthogonal complement. Their outputs sum to b.',
          equation: 'Pᵀ = P; P² = P; Pb = b̂; (I₃ − P)b = e',
          matrices: [
            {
              label: 'P · exact fractions',
              values: [
                ['2/3', '1/3', '−1/3'],
                ['1/3', '2/3', '1/3'],
                ['−1/3', '1/3', '2/3'],
              ],
            },
            { label: 'projected $= Pb$', values: fitted },
          ],
          callout:
            'This full-rank formula is valid because G is invertible. Projection itself remains defined when the columns are dependent.',
        },
      },
      {
        code: 'q1 = np.array([-1., 0., 1.]) / np.sqrt(2)\nq2 = np.array([1., 2., 1.]) / np.sqrt(6)\nQ = np.column_stack((q1, q2))\nR = Q.T @ A\ntheta_qr = np.linalg.solve(R, Q.T @ b)',
        lineNotes: [
          {
            action: 'Normalizes A’s first column.',
            shape: '(3,) ÷ scalar → q1: (3,)',
            operation:
              '$q_{1} = (-1,0,1)^{\\mathsf T}/\\sqrt{2}$ has unit length.',
          },
          {
            action: 'Uses the second lecture Gram–Schmidt direction.',
            shape: '(3,) ÷ scalar → q2: (3,)',
            operation:
              '$q_{2} = (1,2,1)^{\\mathsf T}/\\sqrt{6}$ has unit length and is perpendicular to $q_{1}$.',
          },
          {
            action: 'Stores the orthonormal basis as columns.',
            shape: 'two (3,) arrays → Q: (3, 2)',
            operation:
              '$Q^{\\mathsf T}Q = I_{2}$ and $\\operatorname{Col}(Q) = \\operatorname{Col}(A)$.',
          },
          {
            action: 'Computes the coefficient matrix of A in that basis.',
            shape: '(2, 3) @ (3, 2) → R: (2, 2)',
            operation:
              '$R = [[\\sqrt{2},-1/\\sqrt{2}],[0,\\sqrt{6}/2]]$; its diagonal is nonzero.',
          },
          {
            action: 'Solves the smaller triangular system.',
            shape: 'solve((2, 2), (2,)) → theta_qr: (2,)',
            operation:
              '$R\\hat{\\theta} = Q^{\\mathsf T}b$ gives the same $(2/3,4/3)^{\\mathsf T}$.',
          },
        ],
        title: 'Recover the same fit from reduced QR',
        explanation:
          'Use the lecture’s explicit Q to keep the signs familiar. Orthonormal coordinates reduce least squares to $R\\hat{\\theta} = Q^{\\mathsf T}b$, and the fitted vector is $QQ^{\\mathsf T}b$.',
        watchFor:
          '$Q^{\\mathsf T}Q$ is $I_{2}$. Does that make $QQ^{\\mathsf T}$ equal to $I_{3}$?',
        after: {
          title: '$A = QR$ and $P = QQ^{\\mathsf T}$',
          description:
            'Q is a rectangular matrix with orthonormal columns. R is a square upper triangular matrix; the two factors reconstruct A.',
          equation: 'θ_qr = θ_normal; QQᵀ = P ≠ I₃',
          matrices: [
            {
              label: 'Q · lecture basis',
              values: [
                ['−1/√2', '1/√6'],
                [0, '2/√6'],
                ['1/√2', '1/√6'],
              ],
            },
            {
              label: 'R · reduced QR',
              values: [
                ['√2', '−1/√2'],
                [0, '√6/2'],
              ],
            },
          ],
          callout:
            'A library QR may flip matching signs in Q and R. The product A and the projection $QQ^{\\mathsf T}$ remain the same.',
        },
      },
      {
        code: 'theta_hat, sums_squared, rank_A, singular_values = np.linalg.lstsq(A, b, rcond=None)\nagreement = np.allclose(theta_hat, theta_normal, rtol=0, atol=1e-10)\nsse_direct = (b - A @ theta_hat) @ (b - A @ theta_hat)',
        lineNotes: [
          {
            action: 'Solves least squares directly from A and b.',
            shape: '(3, 2), (3,) → (2,), (1,), scalar, (2,)',
            operation:
              'Returns $\\hat{\\theta}$, a squared-residual summary [1/3], rank 2, and singular values $[\\sqrt{3},1]$. rcond=None uses NumPy’s numerical rank cutoff.',
          },
          {
            action: 'Checks agreement with the normal equations.',
            shape: 'two (2,) arrays → boolean',
            operation: 'agreement = True within absolute tolerance 1e-10.',
          },
          {
            action: 'Computes the squared error from the actual residual.',
            shape: '(3,) @ (3,) → scalar',
            operation:
              '$\\mathtt{sse\\_direct} \\approx  1/3$. This remains meaningful even when the summary array is empty.',
          },
        ],
        title: 'Use lstsq for the computation and interpret all four returns',
        explanation:
          'The lecture’s formulas explain the answer. lstsq computes it without explicitly building $A^{\\mathsf T}A$, and also handles dependent columns. Its second return is a summary of squared errors, not a residual vector.',
        watchFor:
          'What is the shape of sums_squared here, and why is it different from e.shape?',
        variables: [
          {
            name: 'rank_A',
            value: '2',
            meaning: 'Full column rank, so the two coefficients are unique.',
          },
          {
            name: 'sums_squared',
            value: '[1/3]',
            meaning:
              'One SSE summary for one target, not three residual entries.',
          },
        ],
        after: {
          title: 'Three computations agree',
          description:
            'Normal equations, reduced QR, and lstsq all yield $\\hat{\\theta} = (2/3,4/3)^{\\mathsf T}$ in this example. Each produces the same fitted vector.',
          equation: 'θ_normal ≈ θ_qr ≈ θ_hat; ‖b − Aθ̂‖₂² ≈ 1/3',
          matrices: [
            {
              label:
                '$\\theta _{\\mathrm{normal}} | \\theta _{\\mathrm{qr}} | \\theta _{\\mathrm{hat}}$',
              values: [
                ['2/3', '2/3', '2/3'],
                ['4/3', '4/3', '4/3'],
              ],
              cellTones: toneColumn(2, 2, 'result'),
            },
          ],
          callout:
            'For general data, avoid forming $A^{\\mathsf T}A$ just to fit the model; it can worsen conditioning. Direct least-squares solvers are the practical computation path.',
        },
      },
      {
        code: 'A_dep = np.column_stack((A, A[:, 1]))\ntheta_dep, sums_dep, rank_dep, singular_dep = np.linalg.lstsq(A_dep, b, rcond=None)\nnull_direction = np.array([0., 1., -1.])\ntheta_shifted = theta_dep + null_direction\nfits_dep = np.column_stack((A_dep @ theta_dep, A_dep @ theta_shifted))\nsse_dep = (b - A_dep @ theta_dep) @ (b - A_dep @ theta_dep)',
        lineNotes: [
          {
            action: 'Duplicates the second feature column.',
            shape: '(3, 2) + (3,) → A_dep: (3, 3)',
            operation:
              'Column 3 equals column 2, so $\\operatorname{rank}(\\mathtt{A\\_dep}) = 2 < 3$; the output space is unchanged.',
          },
          {
            action: 'Fits with dependent columns.',
            shape: '(3, 3), (3,) → (3,), (0,), scalar, (3,)',
            operation:
              'lstsq returns the minimum-norm coefficient $(2/3,2/3,2/3)^{\\mathsf T}$, rank 2, and an empty sums_dep.',
          },
          {
            action: 'Finds a direction that disappears.',
            shape: 'null_direction: (3,)',
            operation:
              '$\\mathtt{A\\_dep}\\begin{pmatrix}0\\\\1\\\\-1\\end{pmatrix}=0$: column 2 minus column 3 is zero.',
          },
          {
            action: 'Makes a different minimizing coefficient.',
            shape: '(3,) + (3,) → (3,)',
            operation:
              '$\\theta _{\\mathrm{shifted}} = (2/3,5/3,-1/3)^{\\mathsf T}$. Any real multiple of this null direction could be added.',
          },
          {
            action: 'Compares the two fitted outputs.',
            shape: 'two (3,) arrays → fits_dep: (3, 2)',
            operation:
              'Both output columns equal $(2/3,4/3,2/3)^{\\mathsf T}$.',
          },
          {
            action: 'Computes the error despite the empty summary.',
            shape: '(3,) @ (3,) → scalar',
            operation:
              '$\\mathtt{sse\\_dep} \\approx  1/3$, not zero. The same column space gives the same projection.',
          },
        ],
        title: 'Change coefficients without changing the best output',
        explanation:
          'Dependent columns remove coefficient uniqueness, not fitted-value uniqueness. The two duplicate-column coefficients can trade off freely; only their sum contributes to predictions.',
        watchFor:
          'An empty sums_dep is returned. Does the fit suddenly become exact?',
        after: {
          title: 'Multiple minimizers, one projection',
          description:
            'The three-entry coefficients differ, but their three-entry fitted vectors match. The minimum squared error remains 1/3.',
          equation: 'all minimizers = θ_dep + t(0,1,−1)ᵀ, t ∈ ℝ',
          matrices: [
            {
              label: 'A_dep · duplicate columns',
              values: [
                [-1, 1, 1],
                [0, 1, 1],
                [1, 0, 0],
              ],
              cellTones: toneCells(
                [
                  [0, 2],
                  [1, 2],
                  [2, 2],
                ],
                'target',
              ),
            },
            {
              label:
                '$\\theta _{\\mathrm{dep}} | \\theta _{\\mathrm{shifted}}$',
              values: [
                ['2/3', '2/3'],
                ['2/3', '5/3'],
                ['2/3', '−1/3'],
              ],
              dividerBefore: 1,
            },
            {
              label: 'fitted outputs · identical',
              values: [
                ['2/3', '2/3'],
                ['4/3', '4/3'],
                ['2/3', '2/3'],
              ],
              dividerBefore: 1,
            },
          ],
          callout:
            'Here $\\operatorname{Null}(\\mathtt{A\\_dep}) = \\operatorname{span}\\{(0,1,-1)^{\\mathsf T}\\}$. lstsq chooses the smallest coefficient norm among this family; ordinary least squares minimizes the residual norm.',
        },
      },
    ],
  },
};
