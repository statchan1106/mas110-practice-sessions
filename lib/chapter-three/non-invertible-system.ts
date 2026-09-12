import type { ChapterSection } from '@/lib/chapter/shared';
import { toneCells, toneColumn, toneRow } from '@/lib/chapter/shared';
import { nonInvertibleLectureNotes } from '@/lib/chapter-three/non-invertible-notes';

export const nonInvertibleNotebook = {
  filename: 'Ch3-3 Solving Non-invertible Linear System.ipynb',
  githubUrl:
    'https://github.com/statchan1106/mas110-practice-sessions/blob/main/notebooks/Ch3-3%20Solving%20Non-invertible%20Linear%20System.ipynb',
  colabUrl:
    'https://colab.research.google.com/github/statchan1106/mas110-practice-sessions/blob/main/notebooks/Ch3-3%20Solving%20Non-invertible%20Linear%20System.ipynb',
};

const A = [
  [1, 3, 3, 2],
  [2, 6, 9, 7],
  [-1, -3, 3, 4],
];
const U = [
  [1, 3, 3, 2],
  [0, 0, 3, 3],
  [0, 0, 0, 0],
];
const R = [
  [1, 3, 0, -1],
  [0, 0, 1, 1],
  [0, 0, 0, 0],
];
const pivots = toneCells(
  [
    [0, 0],
    [1, 2],
  ],
  'source',
);

export const nonInvertibleSystemSection: ChapterSection = {
  slug: 'non-invertible-system',
  number: '3.3',
  title: 'Solving Non-invertible Linear Systems',
  shortTitle: 'Non-invertible systems',
  summary:
    'Follow Lecture 3’s 3 × 4 matrix from elimination to a consistency condition and the complete two-parameter solution.',
  focus: 'eliminate → test existence → find every solution',
  learningGoal:
    'Solve Ax = b without an inverse: identify pivot and free variables, test whether b is reachable, and describe the entire solution set.',
  lectureConcepts: [
    'Row echelon form',
    'Pivot and free variables',
    'Column and null spaces',
    'Particular solution',
    'Rank–nullity',
  ],
  codeExtension:
    'The companion notebook runs the same lecture example and checks the formulas with NumPy.',
  ...nonInvertibleNotebook,
  notebookNote:
    'Run this lecture example, vary b, α, and β, and check the results. The companion notebook is maintained in the practice-session GitHub repository.',
  lectureNotes: nonInvertibleLectureNotes,
  primer: [
    {
      term: 'Column space: existence',
      definition:
        'Col(A) contains every possible output Ax. A solution exists precisely when the target b belongs to that set.',
      relation: 'Col(A) = {Ax : x ∈ ℝ⁴} ⊆ ℝ³',
      watchFor: 'Here the reachable outputs form the plane 5b₁ − 2b₂ + b₃ = 0.',
    },
    {
      term: 'Null space: freedom in the input',
      definition:
        'Null(A) contains the inputs sent to zero. Adding one to a solution leaves its output unchanged.',
      relation: 'Null(A) = {z ∈ ℝ⁴ : Az = 0}',
      watchFor:
        'The zero on the right belongs to ℝ³; the null-space vectors belong to ℝ⁴.',
    },
    {
      term: 'Pivot and free variables',
      definition:
        'In echelon form, the first nonzero entry of each nonzero row is its pivot. Solve for the pivot variables; choose the others freely in a consistent system.',
      relation: 'pivot: u, w; free: v = α, y = β',
      watchFor:
        'The second pivot is in column 3. A pivot need not lie on the diagonal or equal 1.',
    },
    {
      term: 'The complete solution',
      definition:
        'Once a particular solution xₚ exists, add every linear combination of the null-space basis vectors n₁ and n₂.',
      relation: 'x = xₚ + αn₁ + βn₂, α, β ∈ ℝ',
      watchFor:
        'There are n − r = 4 − 2 = 2 free parameters. One null direction would miss solutions.',
    },
  ],
  walkthrough: {
    eyebrow: 'Lab 3.3 · Lecture example',
    title: 'One matrix, two targets, every solution',
    objective:
      'Reduce the lecture’s 3 × 4 matrix, carry the same operations to b, and use the free variables to describe every input that reaches b.',
    source: {
      label: 'Companion notebook',
      filename: nonInvertibleNotebook.filename,
      url: nonInvertibleNotebook.githubUrl,
      note: 'Based on lec03.pdf, printed slides 17–31 (PDF pages 21–35). The browser displays prepared states; run the code in Colab.',
    },
    initial: {
      title: 'Three equations, four unknowns',
      description:
        'Columns correspond to input coordinates u, v, w, y; rows correspond to equations. A rectangular matrix has no two-sided inverse.',
      equation: 'A ∈ ℝ³ˣ⁴, x = (u,v,w,y)ᵀ ∈ ℝ⁴, b ∈ ℝ³',
      matrices: [{ label: 'A · lecture running example', values: A }],
      callout:
        'Column 2 is 3 times column 1. Elimination will reveal another dependent column and two free variables.',
    },
    steps: [
      {
        code: 'import numpy as np\nA = np.array([[1., 3., 3., 2.], [2., 6., 9., 7.], [-1., -3., 3., 4.]])\nU = A.copy()',
        lineNotes: [
          {
            action: 'Loads NumPy.',
            shape: 'module import',
            operation: 'np is the short name for NumPy.',
          },
          {
            action: 'Stores the lecture matrix row by row.',
            shape: '3 rows × 4 entries → A: (3, 4)',
            operation:
              'A @ x maps a length-4 input to a length-3 output. Decimal points allow later division in place.',
          },
          {
            action: 'Makes a separate working array.',
            shape: '(3, 4) → U: (3, 4)',
            operation:
              'Changing U will not overwrite A; keep A for its original columns and a final Ax check.',
          },
        ],
        title: 'Keep A and a working copy',
        explanation:
          'A represents the original map. U starts as a copy and will become its row echelon form. Python counts from 0; the lecture counts from 1.',
        watchFor: 'Which array should check the original equation Ax = b?',
        after: {
          title: 'Same values, separate arrays',
          description:
            'Both arrays are initially 3 × 4. Row operations will change only U.',
          matrices: [
            { label: 'A · original', values: A },
            { label: 'U = A.copy()', values: A },
          ],
          callout: 'U[1] is row 2; U[1, 2] is the entry in row 2, column 3.',
        },
      },
      {
        code: 'U[1] -= 2 * U[0]\nU[2] += U[0]\nU[2] -= 2 * U[1]',
        lineNotes: [
          {
            action: 'Clears the 2 below the first pivot.',
            shape: '(4,) − scalar × (4,) → (4,)',
            operation:
              'row₂ ← row₂ − 2 row₁: [2,6,9,7] − 2[1,3,3,2] = [0,0,3,3].',
          },
          {
            action: 'Clears the −1 below the first pivot.',
            shape: '(4,) + (4,) → (4,)',
            operation:
              'row₃ ← row₃ + row₁: [−1,−3,3,4] + [1,3,3,2] = [0,0,6,6].',
          },
          {
            action: 'Uses the updated row 2 and its pivot in column 3.',
            shape: '(4,) − scalar × (4,) → (4,)',
            operation:
              'row₃ ← row₃ − 2 row₂: [0,0,6,6] − 2[0,0,3,3] = [0,0,0,0].',
          },
        ],
        title: 'Eliminate downward and skip a column without a pivot',
        explanation:
          'Column 2 has no pivot candidate below row 1, so move to column 3. Its pivot is 3. The final zero row means only two equations are independent.',
        watchFor: 'Why is the second pivot in column 3 instead of column 2?',
        variables: [
          {
            name: 'pivot columns',
            value: '1, 3',
            meaning: 'Lecture numbering; Python indices 0, 2.',
          },
          {
            name: 'r = rank(A)',
            value: '2',
            meaning: 'Two pivots leave 4 − 2 = 2 free variables.',
          },
        ],
        after: {
          title: 'U is in row echelon form',
          description:
            'Pivots are at (1,1) and (2,3); the zero row is at the bottom. U is rectangular, so use the term row echelon form.',
          equation: 'U = EA, where E = L⁻¹ is invertible',
          matrices: [
            {
              label: 'U · two pivots',
              values: U,
              cellTones: { ...toneRow(2, 4, 'muted'), ...pivots },
            },
          ],
          callout: 'For Ax = b, the same row operations must act on b.',
        },
      },
      {
        code: 'R = U.copy()\nR[1] /= 3\nR[0] -= 3 * R[1]',
        lineNotes: [
          {
            action: 'Preserves U and prepares a reduced form.',
            shape: '(3, 4) → R: (3, 4)',
            operation: 'R initially contains U.',
          },
          {
            action: 'Scales the second pivot to 1.',
            shape: '(4,) ÷ scalar → (4,)',
            operation: '[0,0,3,3] / 3 = [0,0,1,1].',
          },
          {
            action: 'Clears the entry above the second pivot.',
            shape: '(4,) − scalar × (4,) → (4,)',
            operation: '[1,3,3,2] − 3[0,0,1,1] = [1,3,0,−1].',
          },
        ],
        title: 'Read the homogeneous equations from R',
        explanation:
          'Each pivot is 1 and the only nonzero entry in its column. Rx = 0 says u + 3v − y = 0 and w + y = 0. Solve for u and w in terms of v and y.',
        watchFor: 'If v and y are chosen, what determines u and w?',
        after: {
          title: 'Two pivot variables, two free variables',
          description: 'Set v = α and y = β, with any real α and β.',
          equation: 'u = −3α + β, v = α, w = −β, y = β',
          matrices: [
            {
              label: 'R · reduced row echelon form',
              values: R,
              cellTones: {
                ...toneColumn(1, 3, 'target'),
                ...toneColumn(3, 3, 'target'),
                ...pivots,
              },
            },
          ],
          callout:
            'Null(A) = Null(U) = Null(R). This does not mean Col(A) = Col(R).',
        },
      },
      {
        code: 'n1 = np.array([-3., 1., 0., 0.])\nn2 = np.array([1., 0., -1., 1.])\nN = np.column_stack((n1, n2))\nnull_check = A @ N',
        lineNotes: [
          {
            action: 'Sets free coordinates (v,y) = (1,0).',
            shape: '4 values → n1: (4,)',
            operation: 'u = −3, w = 0: n₁ = (−3,1,0,0)ᵀ.',
          },
          {
            action: 'Sets free coordinates (v,y) = (0,1).',
            shape: '4 values → n2: (4,)',
            operation: 'u = 1, w = −1: n₂ = (1,0,−1,1)ᵀ.',
          },
          {
            action: 'Stores the basis vectors as columns.',
            shape: 'two (4,) arrays → N: (4, 2)',
            operation: 'N @ [α,β] computes αn₁ + βn₂.',
          },
          {
            action: 'Checks both vectors against the original A.',
            shape: '(3, 4) @ (4, 2) → (3, 2)',
            operation: 'Each output column is zero: An₁ = An₂ = 0.',
          },
        ],
        title: 'Build the null-space basis',
        explanation:
          'Every homogeneous solution is αn₁ + βn₂. These vectors are independent: the v and y coordinates of their combination are exactly α and β.',
        watchFor: 'If αn₁ + βn₂ = 0, what must α and β be?',
        after: {
          title: 'Null(A) is a plane inside ℝ⁴',
          description:
            'N has four rows because its columns are inputs; AN has three rows because these map into the output space.',
          equation: 'Null(A) = span{n₁,n₂}; dim Null(A) = 2',
          matrices: [
            {
              label: 'N = [n₁ | n₂]',
              values: [
                [-3, 1],
                [1, 0],
                [0, -1],
                [0, 1],
              ],
              dividerBefore: 1,
            },
            {
              label: 'AN = [An₁ | An₂]',
              values: [
                [0, 0],
                [0, 0],
                [0, 0],
              ],
              dividerBefore: 1,
            },
          ],
          callout:
            'Build the null-space basis from Ax = 0, even when the target problem has b ≠ 0.',
        },
      },
      {
        code: 'E = np.array([[1., 0., 0.], [-2., 1., 0.], [5., -2., 1.]])\nb_good = np.array([1., 5., 5.])\nb_bad = np.array([1., 5., 6.])\nc_good, c_bad = E @ b_good, E @ b_bad',
        lineNotes: [
          {
            action: 'Collects the downward row operations.',
            shape: 'E: (3, 3)',
            operation:
              'E = L⁻¹ and E @ A = U. E acts on three equations, not four variables.',
          },
          {
            action: 'Chooses a reachable target.',
            shape: 'b_good: (3,)',
            operation: '5b₁ − 2b₂ + b₃ = 5 − 10 + 5 = 0.',
          },
          {
            action: 'Changes the third output coordinate.',
            shape: 'b_bad: (3,)',
            operation: '5b₁ − 2b₂ + b₃ = 5 − 10 + 6 = 1.',
          },
          {
            action: 'Applies the same elimination to both targets.',
            shape: 'two (3, 3) @ (3,) products → two (3,) arrays',
            operation: 'c_good = [1,3,0]; c_bad = [1,3,1].',
          },
        ],
        title: 'Transform b before testing consistency',
        explanation:
          'Ax = b is equivalent to Ux = c with c = Eb. The last row requires 0 = c₃, so a solution exists exactly when 5b₁ − 2b₂ + b₃ = 0.',
        watchFor:
          'Which transformed right-hand side makes the zero coefficient row contradictory?',
        after: {
          title: 'Distinguish 0 = 0 from 0 = 1',
          description:
            'These matrices are [U | c], not [A | b]. The reachable target gives a redundant last equation.',
          equation: 'c = (b₁, b₂ − 2b₁, 5b₁ − 2b₂ + b₃)ᵀ',
          matrices: [
            {
              label: '[U | c_good]',
              values: [
                [1, 3, 3, 2, 1],
                [0, 0, 3, 3, 3],
                [0, 0, 0, 0, 0],
              ],
              dividerBefore: 4,
              cellTones: toneRow(2, 5, 'result'),
            },
            {
              label: '[U | c_bad]',
              values: [
                [1, 3, 3, 2, 1],
                [0, 0, 3, 3, 3],
                [0, 0, 0, 0, 1],
              ],
              dividerBefore: 4,
              cellTones: {
                ...toneRow(2, 4, 'muted'),
                ...toneCells([[2, 4]], 'target'),
              },
            },
          ],
          callout:
            'A zero row in U alone does not mean no solution. The corresponding entry of c decides.',
        },
      },
      {
        code: 'rank_A = np.linalg.matrix_rank(A)\nrank_good = np.linalg.matrix_rank(np.column_stack((A, b_good)))\nrank_bad = np.linalg.matrix_rank(np.column_stack((A, b_bad)))',
        lineNotes: [
          {
            action: 'Computes the numerical rank of A.',
            shape: '(3, 4) → scalar',
            operation: 'rank_A = 2 agrees with the pivot count.',
          },
          {
            action: 'Appends b_good as an extra column.',
            shape: '(3, 5) → scalar',
            operation: 'rank_good = 2: no new independent output direction.',
          },
          {
            action: 'Appends b_bad instead.',
            shape: '(3, 5) → scalar',
            operation: 'rank_bad = 3: the new column lies outside Col(A).',
          },
        ],
        title: 'Connect consistency to column space and rank',
        explanation:
          'Take pivot column indices 1 and 3, then select those columns from the original A. They form a basis of Col(A), the plane 5b₁ − 2b₂ + b₃ = 0.',
        watchFor: 'Why do we take the basis columns from A rather than R?',
        variables: [
          {
            name: 'rank_A, rank_good, rank_bad',
            value: '2, 2, 3',
            meaning:
              'An equal augmented rank means a solution exists; a larger one means none exists.',
          },
        ],
        after: {
          title: 'Equivalent existence tests',
          description:
            'Appending a reachable b leaves the column span unchanged.',
          equation: 'b ∈ Col(A) ⇔ rank([A | b]) = rank(A) ⇔ 5b₁ − 2b₂ + b₃ = 0',
          matrices: [
            {
              label: 'Basis columns a₁, a₃ of A',
              values: [
                [1, 3],
                [2, 9],
                [-1, 3],
              ],
              dividerBefore: 1,
            },
          ],
          callout:
            'The theorem uses exact rank. NumPy estimates rank with a singular-value tolerance; near-dependent or noisy data need care with scale and tolerance.',
        },
      },
      {
        code: 'b = b_good\nw = c_good[1] / U[1, 2]\nu = (c_good[0] - U[0, 2] * w) / U[0, 0]\nx_particular = np.array([u, 0., w, 0.])',
        lineNotes: [
          {
            action: 'Continues with the consistent target.',
            shape: 'b: (3,)',
            operation: 'b = [1,5,5]. b_bad has no particular solution.',
          },
          {
            action: 'Sets v = y = 0 and solves row 2.',
            shape: 'scalar ÷ scalar → scalar',
            operation: '3w = 3, so w = 1. U[1, 2] is the second pivot.',
          },
          {
            action: 'Back-substitutes into row 1.',
            shape: 'scalar arithmetic → scalar',
            operation: 'u + 3w = 1, so u = −2.',
          },
          {
            action: 'Restores the coordinate order (u,v,w,y).',
            shape: '4 values → x_particular: (4,)',
            operation: 'xₚ = (−2,0,1,0)ᵀ.',
          },
        ],
        title: 'Find a particular solution',
        explanation:
          'Setting free variables to zero gives one convenient solution, not a uniquely preferred one. For any consistent b, substitution gives u = 3b₁ − b₂ and w = (b₂ − 2b₁)/3.',
        watchFor: 'Why must consistency be checked before constructing xₚ?',
        after: {
          title: 'One input reaches b_good',
          description:
            'Add null-space vectors next to obtain the remaining solutions.',
          equation: 'xₚ = (3b₁ − b₂, 0, (b₂ − 2b₁)/3, 0)ᵀ',
          matrices: [
            { label: 'xₚ', values: [[-2], [0], [1], [0]] },
            { label: 'Axₚ = b_good', values: [[1], [5], [5]] },
          ],
          callout:
            'This formula assumes 5b₁ − 2b₂ + b₃ = 0. It does not solve an inconsistent system.',
        },
      },
      {
        code: 'alpha, beta = 2., -1.\nx = x_particular + alpha * n1 + beta * n2\noutput = A @ x\nverified = np.allclose(output, b, rtol=0, atol=1e-10)',
        lineNotes: [
          {
            action: 'Chooses the two free coordinates.',
            shape: 'two scalars',
            operation: 'v = α = 2; y = β = −1.',
          },
          {
            action: 'Adds a homogeneous solution to xₚ.',
            shape: '(4,) + scalar × (4,) + scalar × (4,) → (4,)',
            operation: '[−2,0,1,0] + 2[−3,1,0,0] − [1,0,−1,1] = [−9,2,2,−1].',
          },
          {
            action: 'Checks the original equation.',
            shape: '(3, 4) @ (4,) → (3,)',
            operation: 'A @ [−9,2,2,−1] = [1,5,5].',
          },
          {
            action: 'Checks an explicit absolute tolerance.',
            shape: 'two (3,) arrays → boolean',
            operation:
              'verified = True. The calculation checks this input; the proof below covers the full family.',
          },
        ],
        title: 'Describe every solution with two parameters',
        explanation:
          'Any real α and β change only the null-space part, keeping Ax = b. Conversely, subtracting xₚ from any solution produces a null-space vector.',
        watchFor:
          'If α or β changes, which input coordinates change and which output stays fixed?',
        after: {
          title: 'An affine plane of inputs reaches one output',
          description:
            'The solution set is a plane inside ℝ⁴. This diagram shows parameter coordinates (α,β), not the four-dimensional input space.',
          equation: 'x = xₚ + αn₁ + βn₂, α, β ∈ ℝ; Ax = (1,5,5)ᵀ',
          plane: {
            xRange: [-1, 3],
            yRange: [-2, 2],
            xLabel: 'α = v',
            yLabel: 'β = y',
            points: [
              { at: [0, 0], label: 'xₚ: (0,0)', tone: 'source' },
              { at: [2, -1], label: 'x: (2,−1)', tone: 'result' },
            ],
            segments: [
              { from: [0, 0], to: [2, -1], dashed: true, tone: 'target' },
            ],
          },
          matrices: [
            { label: 'x · input in ℝ⁴', values: [[-9], [2], [2], [-1]] },
            {
              label: 'Ax | b · output in ℝ³',
              values: [
                [1, 1],
                [5, 5],
                [5, 5],
              ],
              dividerBefore: 1,
            },
          ],
          callout:
            'xₚ corresponds to (α,β) = (0,0). Every point of the entire parameter plane specifies a solution, not only the two marked points.',
        },
      },
    ],
  },
};
