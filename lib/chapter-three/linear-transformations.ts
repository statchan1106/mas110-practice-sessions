import type { ChapterSection } from '@/lib/chapter/shared';
import { sourceLinks, toneCells } from '@/lib/chapter/shared';

const filename = 'Ch3-2 Interpretable Linear Transformations.ipynb';
const links = sourceLinks(filename);

const basePlane = {
  xRange: [-2.6, 2.8] as [number, number],
  yRange: [-2.6, 2.8] as [number, number],
  xLabel: 'x₁',
  yLabel: 'x₂',
};

export const linearTransformationsSection: ChapterSection = {
  slug: 'linear-transformations',
  number: '3.2',
  title: 'Interpretable Linear Transformations',
  shortTitle: 'Linear transformations',
  summary: 'Follow one vector through rotation, projection, and reflection.',
  focus: 'rotate → project → reflect',
  learningGoal:
    'Read a transformation matrix as an action on vectors and distinguish what rotation, projection, and reflection preserve or remove.',
  lectureConcepts: [
    'Linear transformation',
    'Images of basis vectors',
    'Projection',
    'Reflection',
  ],
  codeExtension:
    'The full notebook applies many angles to a point cloud and extends projection to three dimensions.',
  filename,
  ...links,
  primer: [
    {
      term: 'Matrix as a map',
      definition:
        'The columns of a matrix show where the standard basis vectors move; every other vector follows by linearity.',
      relation: 'A[x₁, x₂]ᵀ = x₁a₁ + x₂a₂',
      watchFor: 'Each output coordinate is one row–vector dot product.',
    },
    {
      term: 'Projection',
      definition:
        'Projection keeps the component along a chosen subspace and removes the perpendicular component.',
      relation: 'P = uuᵀ for a unit vector u',
      watchFor: 'Applying P twice makes no further change: P² = P.',
    },
    {
      term: 'Reflection',
      definition:
        'Reflection across span(u) keeps the projected component and reverses the perpendicular component.',
      relation: 'H = 2P − I',
      watchFor: 'Applying H twice returns the original vector: H² = I.',
    },
  ],
  walkthrough: {
    eyebrow: 'Lab 3.2 · Guided example',
    title: 'Watch one vector move three different ways',
    objective:
      'Random point clouds are replaced by one vector, so each matrix entry can be connected directly to a visible geometric change.',
    source: {
      filename,
      url: links.githubUrl,
      note: 'The full source visualizes larger point sets; this example isolates one mechanism at a time.',
    },
    initial: {
      title: 'Start with one visible input',
      description:
        'The same vector v = [2,1] will make rotation, projection, and reflection directly comparable.',
      equation: 'v = 2e₁ + 1e₂',
      plane: {
        ...basePlane,
        vectors: [{ to: [2, 1], label: 'v = (2,1)', tone: 'source' }],
      },
    },
    steps: [
      {
        code: 'import numpy as np\nv = np.array([2., 1.])\ntheta = np.pi / 2',
        lineNotes: [
          {
            action: 'Loads NumPy for arrays and trigonometric functions.',
            shape: '— (module import)',
            operation: 'Binds NumPy to the short name np.',
          },
          {
            action: 'Stores the vector that every map will transform.',
            shape: '2 values → v: (2,)',
            operation: 'Creates the 1-D vector [2, 1].',
          },
          {
            action: 'Stores a quarter-turn angle in radians.',
            shape: 'theta: scalar',
            operation: 'π ÷ 2 radians equals 90 degrees.',
          },
        ],
        title: 'Choose one vector and angle',
        explanation:
          'Keeping the input fixed lets us attribute every visible difference to the transformation itself.',
        watchFor:
          'After a 90° counterclockwise turn, which quadrant contains v?',
        variables: [
          { name: 'v.shape', value: '(2,)', meaning: 'A NumPy 1-D vector.' },
          { name: 'theta', value: 'π / 2', meaning: 'A 90° angle in radians.' },
        ],
        after: {
          title: 'The input has two coordinates',
          description: 'Its length is √5 and its endpoint is (2,1).',
          equation: '‖v‖ = √(2² + 1²) = √5',
          plane: {
            ...basePlane,
            vectors: [{ to: [2, 1], label: 'v', tone: 'source' }],
          },
        },
      },
      {
        code: 'c, s = np.cos(theta), np.sin(theta)\nR = np.array([[c, -s], [s, c]])\nv_rot = R @ v',
        lineNotes: [
          {
            action: 'Computes the cosine and sine of the angle.',
            shape: 'theta: scalar → c, s: scalars',
            operation: 'cos(π/2) ≈ 0 and sin(π/2) = 1.',
          },
          {
            action: 'Builds the 2-D rotation matrix.',
            shape: '4 scalars → R: (2, 2)',
            operation: 'The columns become Re₁ = [0,1] and Re₂ = [−1,0].',
          },
          {
            action: 'Applies the rotation to v.',
            shape: '(2, 2) @ (2,) → v_rot: (2,)',
            operation: '[0·2 − 1·1, 1·2 + 0·1] → [−1, 2].',
          },
        ],
        title: 'Rotate without changing length',
        explanation:
          'The matrix turns both basis directions by the same angle, so their linear combination v turns with them.',
        watchFor:
          'The endpoint should move from (2,1) to (−1,2), but stay equally far from the origin.',
        variables: [
          {
            name: 'v_rot',
            value: '≈ [−1, 2]',
            meaning: 'The 90° counterclockwise image, rounded for display.',
          },
        ],
        after: {
          title: 'Rotation changes direction, not length',
          description:
            'The muted arrow is the input; the green arrow is its rotated image.',
          equation: 'R[2,1]ᵀ = [−1,2]ᵀ · ‖Rv‖ = ‖v‖ = √5',
          plane: {
            ...basePlane,
            vectors: [
              { to: [2, 1], label: 'v', tone: 'muted', dashed: true },
              { to: [-1, 2], label: 'Rv', tone: 'result' },
            ],
          },
          matrices: [
            {
              label: 'R · 90° rotation (rounded)',
              values: [
                [0, -1],
                [1, 0],
              ],
              cellTones: toneCells(
                [
                  [0, 0],
                  [1, 0],
                ],
                'source',
              ),
            },
          ],
        },
      },
      {
        code: 'u = np.array([1., 1.])\nu = u / np.linalg.norm(u)\nP = np.outer(u, u)\nv_proj = P @ v',
        lineNotes: [
          {
            action: 'Chooses the direction of the projection line.',
            shape: '2 values → u: (2,)',
            operation: 'Starts with the direction [1,1], parallel to y = x.',
          },
          {
            action: 'Normalizes the direction to unit length.',
            shape: 'u: (2,) ÷ scalar → u: (2,)',
            operation: '[1,1] ÷ √2 → [1/√2, 1/√2].',
          },
          {
            action: 'Builds the projection matrix from all coordinate pairs.',
            shape: 'outer product (2,) × (2,) → P: (2, 2)',
            operation: 'P[i,j] = u[i]u[j], giving 0.5 in all four entries.',
          },
          {
            action: 'Keeps only the component of v along u.',
            shape: '(2, 2) @ (2,) → v_proj: (2,)',
            operation: '[0.5·2+0.5·1, 0.5·2+0.5·1] → [1.5,1.5].',
          },
        ],
        title: 'Project onto one line',
        explanation:
          'The point moves perpendicularly to y = x. Its parallel component remains; the residual disappears.',
        watchFor:
          'Which part of v is removed when the endpoint lands on y = x?',
        variables: [
          {
            name: 'v_proj',
            value: '≈ [1.5, 1.5]',
            meaning: 'The closest point to v on span(u), rounded for display.',
          },
        ],
        after: {
          title: 'Projection removes the perpendicular component',
          description:
            'The dashed segment is the residual v − Pv = [0.5,−0.5].',
          equation: 'v = Pv + (v − Pv) · uᵀ(v − Pv) = 0',
          plane: {
            ...basePlane,
            lines: [
              {
                from: [-2.2, -2.2],
                to: [2.5, 2.5],
                label: 'span(u)',
                tone: 'source',
              },
            ],
            segments: [
              {
                from: [2, 1],
                to: [1.5, 1.5],
                tone: 'target',
                dashed: true,
              },
            ],
            vectors: [
              { to: [2, 1], label: 'v', tone: 'target' },
              { to: [1.5, 1.5], label: 'Pv', tone: 'result' },
            ],
          },
          matrices: [
            {
              label: 'P · projection (rounded)',
              values: [
                [0.5, 0.5],
                [0.5, 0.5],
              ],
              cellTones: toneCells(
                [
                  [0, 0],
                  [0, 1],
                  [1, 0],
                  [1, 1],
                ],
                'source',
              ),
            },
          ],
        },
      },
      {
        sourceCell: 'Reflection convention',
        sourceKind: 'correction',
        code: 'H = 2 * P - np.eye(2)\nv_ref = H @ v',
        lineNotes: [
          {
            action: 'Builds reflection across the same projection line.',
            shape: 'P: (2, 2), I₂: (2, 2) → H: (2, 2)',
            operation:
              '2P − I keeps the parallel component and flips the perpendicular one.',
          },
          {
            action: 'Reflects v across span(u).',
            shape: '(2, 2) @ (2,) → v_ref: (2,)',
            operation: '[[0,1],[1,0]] @ [2,1] → [1,2].',
          },
        ],
        title: 'Reflect across the same line',
        explanation:
          'For reflection across span(u), the executable notebook formula 2P − I is correct; its prose shows the opposite sign convention.',
        watchFor:
          'The midpoint of v and Hv should lie exactly on the reflection line.',
        variables: [
          {
            name: 'v_ref',
            value: '≈ [1, 2]',
            meaning: 'The mirror image across y = x, rounded for display.',
          },
        ],
        after: {
          title: 'The perpendicular component changes sign',
          description:
            'Pv is the midpoint between v and its reflected image Hv.',
          equation: 'Hv = 2Pv − v = [1,2]ᵀ',
          plane: {
            ...basePlane,
            lines: [
              {
                from: [-2.2, -2.2],
                to: [2.5, 2.5],
                label: 'mirror line',
                tone: 'source',
              },
            ],
            segments: [
              {
                from: [2, 1],
                to: [1, 2],
                tone: 'target',
                dashed: true,
              },
            ],
            vectors: [
              { to: [2, 1], label: 'v', tone: 'target' },
              { to: [1, 2], label: 'Hv', tone: 'result' },
            ],
            points: [{ at: [1.5, 1.5], label: 'Pv', tone: 'source' }],
          },
          matrices: [
            {
              label: 'H = 2P − I',
              values: [
                [0, 1],
                [1, 0],
              ],
              cellTones: toneCells(
                [
                  [0, 1],
                  [1, 0],
                ],
                'result',
              ),
            },
          ],
          callout:
            'The source notebook’s plotted line and executable code use H = 2P − I; that is the convention followed here.',
        },
      },
      {
        code: 'projection_stays = np.allclose(P @ P, P)\nreflection_undoes = np.allclose(H @ H, np.eye(2))',
        lineNotes: [
          {
            action: 'Checks whether a second projection changes the map.',
            shape: '(2, 2) @ (2, 2) vs (2, 2) → projection_stays: bool',
            operation: 'P @ P is numerically equal to P, so the check is True.',
          },
          {
            action: 'Checks whether two reflections undo each other.',
            shape: '(2, 2) @ (2, 2) vs I₂: (2, 2) → reflection_undoes: bool',
            operation:
              'H @ H is numerically equal to I₂, so the check is True.',
          },
        ],
        title: 'Check what each map preserves',
        explanation:
          'Projection settles after one application, while reflection undoes itself after two.',
        watchFor: 'Which operation stays put, and which operation returns?',
        variables: [
          {
            name: 'projection_stays',
            value: 'True',
            meaning: 'P² = P.',
          },
          {
            name: 'reflection_undoes',
            value: 'True',
            meaning: 'H² = I.',
          },
        ],
        after: {
          title: 'Two short identities summarize the behavior',
          description:
            'These checks distinguish a projection from an invertible reflection.',
          equation: 'P² ≈ P · H² ≈ I₂',
          callout:
            'np.allclose treats tiny floating-point round-off as numerical equality.',
        },
      },
    ],
  },
};
