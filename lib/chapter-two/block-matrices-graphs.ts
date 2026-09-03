import type { WalkthroughGraph } from '@/components/code-walkthrough';

import type { ChapterSection } from './shared';
import { sourceLinks, toneBlock, toneCells } from './shared';

const filename = 'Ch2-2 Block Matrices & Graphs.ipynb';
const links = sourceLinks(filename);

const graphEdges: WalkthroughGraph['edges'] = [
  { from: '1', to: '3' },
  { from: '1', to: '4' },
  { from: '1', to: '5' },
  { from: '2', to: '3' },
  { from: '2', to: '4' },
  { from: '2', to: '5' },
  { from: '3', to: '6' },
  { from: '3', to: '7' },
  { from: '4', to: '6' },
  { from: '4', to: '7' },
  { from: '5', to: '6' },
  { from: '5', to: '7' },
  { from: '6', to: '8' },
  { from: '7', to: '8' },
];

const graphNodes: WalkthroughGraph['nodes'] = [
  { id: '1', label: '1', x: 35, y: 55 },
  { id: '2', label: '2', x: 35, y: 140 },
  { id: '3', label: '3', x: 125, y: 30 },
  { id: '4', label: '4', x: 125, y: 78 },
  { id: '5', label: '5', x: 125, y: 145 },
  { id: '6', label: '6', x: 225, y: 55 },
  { id: '7', label: '7', x: 225, y: 140 },
  { id: '8', label: '8', x: 305, y: 98 },
];

const adjacency = [
  [0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 0],
  [1, 1, 0, 0, 0, 1, 1, 0],
  [1, 1, 0, 0, 0, 1, 1, 0],
  [1, 1, 0, 0, 0, 1, 1, 0],
  [0, 0, 1, 1, 1, 0, 0, 1],
  [0, 0, 1, 1, 1, 0, 0, 1],
  [0, 0, 0, 0, 0, 1, 1, 0],
];

export const blockMatricesGraphsSection: ChapterSection = {
  slug: 'block-matrices-graphs',
  number: '2.2',
  title: 'Block Matrices and Graphs',
  shortTitle: 'Blocks and graphs',
  summary:
    'Build and multiply block matrices, find a Schur complement, and connect a graph to its adjacency matrix.',
  focus: 'blocks → Schur complement → adjacency powers',
  learningGoal:
    'Build and multiply matrices in blocks, use block elimination to find the Schur complement, and read graph structure from an adjacency matrix.',
  lectureConcepts: [
    'Block matrices',
    'Block multiplication',
    'Schur complement',
    'Adjacency matrix',
  ],
  codeExtension:
    'NumPy slicing and adjacency powers extend the lecture examples into code.',
  filename,
  ...links,
  primer: [
    {
      term: 'Block matrix',
      definition:
        'Partitioning groups entries into smaller matrices without changing the underlying matrix.',
      relation: 'X = [[A,B],[C,D]]',
      watchFor:
        'Blocks sharing a block row need equal heights; blocks sharing a block column need equal widths.',
    },
    {
      term: 'Half-open slice',
      definition:
        'A NumPy slice includes its start index and excludes its stop index.',
      relation: 'Y[:3, 0:2]',
      watchFor:
        'This selects rows 0,1,2 and columns 0,1—not row 3 or column 2.',
    },
    {
      term: 'Schur complement',
      definition:
        'The lower-right block remaining after the lower-left block has been eliminated.',
      relation: 'S₂₂ = Z₂₂ − Z₂₁Z₁₁⁻¹Z₁₂',
      watchFor: 'It is Gaussian elimination carried out on whole blocks.',
    },
    {
      term: 'Adjacency power',
      definition:
        'An adjacency matrix records graph edges; entry (i,j) of Aᵐ counts length-m walks from i to j.',
      relation: '(Aᵐ)ᵢⱼ = # walks',
      watchFor: 'A walk may repeat vertices or edges, unlike a simple path.',
    },
  ],
  walkthrough: {
    eyebrow: '2.2 · Guided execution',
    title: 'Build the matrices, then track each change',
    objective:
      'Keep the partition lines visible. Match each slice, product, elimination step, and graph edge to the Python line that creates it.',
    initial: {
      title: 'Start with four empty block positions',
      description:
        'The top row needs two blocks of equal height; the bottom row needs two blocks of equal height. Column widths must also agree vertically.',
      equation: 'X = [ A  B ; C  D ]',
      callout:
        'Think first: if A is 2×3 and D is 1×2, what must the shapes of B and C be?',
    },
    steps: [
      {
        code: 'A = np.array([[1.,2.,3.],[4.,5.,6.]])',
        title: 'Create block A',
        explanation:
          'A is the upper-left block. Its two rows set the required height of the block beside it.',
        drives: 'The 2×3 upper-left block A.',
        watchFor:
          'The name A currently means “Block A”; it will be reused later for an adjacency matrix.',
        variables: [
          { name: 'A.shape', value: '(2, 3)', meaning: 'Upper-left block.' },
        ],
        after: {
          title: 'A fills the upper-left position',
          description: 'It has two rows and three columns.',
          equation: 'A ∈ ℝ²ˣ³',
          matrices: [
            {
              label: 'Block A',
              values: [
                [1, 2, 3],
                [4, 5, 6],
              ],
              cellTones: toneBlock(0, 2, 0, 3, 'block-a'),
            },
          ],
        },
      },
      {
        code: 'B = np.array([[7.,8.],[9.,10.]])',
        title: 'Create block B and complete the upper row',
        explanation:
          'B has the same two-row height as A, so the two blocks can be placed side by side.',
        drives: 'Separate A and B matrices plus their joined upper block row.',
        watchFor: 'The widths add: 3 columns from A and 2 from B.',
        variables: [
          { name: 'B.shape', value: '(2, 2)', meaning: 'Upper-right block.' },
          {
            name: '[A | B].shape',
            value: '(2, 5)',
            meaning: 'The complete upper block row.',
          },
        ],
        after: {
          title: 'A and B form the upper block row',
          description: 'The divider shows where A ends and B begins.',
          equation: '[2×3 | 2×2] → 2×5',
          matrices: [
            {
              label: 'Block A',
              values: [
                [1, 2, 3],
                [4, 5, 6],
              ],
              cellTones: toneBlock(0, 2, 0, 3, 'block-a'),
            },
            {
              label: 'Block B',
              values: [
                [7, 8],
                [9, 10],
              ],
              cellTones: toneBlock(0, 2, 0, 2, 'block-b'),
            },
            {
              label: 'upper row [ A | B ]',
              values: [
                [1, 2, 3, 7, 8],
                [4, 5, 6, 9, 10],
              ],
              dividerBefore: 3,
              cellTones: {
                ...toneBlock(0, 2, 0, 3, 'block-a'),
                ...toneBlock(0, 2, 3, 5, 'block-b'),
              },
            },
          ],
        },
      },
      {
        code: 'C = np.array([[11.,12.,13.]])',
        title: 'Create block C',
        explanation:
          'C is the lower-left block. Its three columns match the width of A above it.',
        drives: 'The 1×3 lower-left block C.',
        watchFor: 'A and C must have the same number of columns.',
        variables: [
          { name: 'C.shape', value: '(1, 3)', meaning: 'Lower-left block.' },
        ],
        after: {
          title: 'C fills the lower-left position',
          description:
            'Its width matches A, while its height starts a new row.',
          equation: 'C ∈ ℝ¹ˣ³',
          matrices: [
            {
              label: 'Block C',
              values: [[11, 12, 13]],
              cellTones: toneBlock(0, 1, 0, 3, 'source'),
            },
          ],
        },
      },
      {
        code: 'D = np.array([[14.,15.]])',
        title: 'Create block D and complete the lower row',
        explanation:
          'D matches C’s one-row height and B’s two-column width, so C and D can form the lower block row.',
        drives: 'Separate C and D matrices plus their joined lower block row.',
        watchFor: 'C and D share one row; B and D share two columns.',
        variables: [
          { name: 'D.shape', value: '(1, 2)', meaning: 'Lower-right block.' },
          {
            name: '[C | D].shape',
            value: '(1, 5)',
            meaning: 'The complete lower block row.',
          },
        ],
        after: {
          title: 'C and D form the lower block row',
          description: 'Its total width now matches the upper block row.',
          equation: '[1×3 | 1×2] → 1×5',
          matrices: [
            {
              label: 'Block C',
              values: [[11, 12, 13]],
              cellTones: toneBlock(0, 1, 0, 3, 'source'),
            },
            {
              label: 'Block D',
              values: [[14, 15]],
              cellTones: toneBlock(0, 1, 0, 2, 'target'),
            },
            {
              label: 'lower row [ C | D ]',
              values: [[11, 12, 13, 14, 15]],
              dividerBefore: 3,
              cellTones: {
                ...toneBlock(0, 1, 0, 3, 'source'),
                ...toneBlock(0, 1, 3, 5, 'target'),
              },
            },
          ],
        },
      },
      {
        code: 'X = np.block([[A,B],[C,D]])',
        title: 'Join the four blocks as X',
        explanation:
          'np.block places the two prepared block rows on top of each other to create one 3×5 matrix.',
        drives: 'The upper and lower block rows combine into X.',
        watchFor: 'The vertical divider must line up in both block rows.',
        variables: [
          {
            name: 'X.shape',
            value: '(3, 5)',
            meaning: 'Block heights 2+1 and widths 3+2.',
          },
        ],
        after: {
          title: 'The four definitions are combined as X',
          description:
            'First read the two block rows, then read the same values inside the final matrix.',
          equation: '[A | B] above [C | D] → X',
          matrices: [
            {
              label: 'upper row [ A | B ]',
              values: [
                [1, 2, 3, 7, 8],
                [4, 5, 6, 9, 10],
              ],
              dividerBefore: 3,
            },
            {
              label: 'lower row [ C | D ]',
              values: [[11, 12, 13, 14, 15]],
              dividerBefore: 3,
            },
            {
              label: 'combined X',
              values: [
                [1, 2, 3, 7, 8],
                [4, 5, 6, 9, 10],
                [11, 12, 13, 14, 15],
              ],
              dividerBefore: 3,
              rowDividerBefore: 2,
              cellTones: {
                ...toneBlock(0, 2, 0, 3, 'block-a'),
                ...toneBlock(0, 2, 3, 5, 'block-b'),
                ...toneBlock(2, 3, 0, 3, 'source'),
                ...toneBlock(2, 3, 3, 5, 'target'),
              },
            },
          ],
          callout:
            'The dividers only show how X was built; X is still one ordinary numeric array.',
        },
      },
      {
        code: 'Y = np.array([[.1,.2,.7,.8],[.3,.4,.9,1.0],[.5,.6,1.1,1.2],[1.3,1.4,1.7,1.8],[1.5,1.6,1.9,2.0]])',
        title: 'Create the matrix that X will multiply',
        explanation:
          'Y has five rows so its leading dimension matches the five columns of X.',
        drives:
          'A 5×4 grid with possible split lines after row 3 and column 2.',
        watchFor: 'The shared inner dimension 5 is what makes X @ Y legal.',
        variables: [
          {
            name: 'Y.shape',
            value: '(5, 4)',
            meaning: 'Compatible with X.shape = (3,5).',
          },
        ],
        after: {
          title: 'Y can be partitioned to match X',
          description:
            'The first three rows align with A/C widths; the final two align with B/D widths.',
          equation: '(3×5) @ (5×4) → (3×4)',
          matrices: [
            {
              label: 'Y (cut after row 3, column 2)',
              values: [
                [0.1, 0.2, 0.7, 0.8],
                [0.3, 0.4, 0.9, 1],
                [0.5, 0.6, 1.1, 1.2],
                [1.3, 1.4, 1.7, 1.8],
                [1.5, 1.6, 1.9, 2],
              ],
              dividerBefore: 2,
              rowDividerBefore: 3,
            },
          ],
        },
      },
      {
        code: 'E = Y[:3, 0:2]\nF = Y[0:3, 2:]\nG = Y[3:5, :2]\nH = Y[3:, 2:4]',
        title: 'Recover E, F, G, and H with slices',
        explanation:
          'Each half-open slice names one rectangle. The stop indices 3, 5, 2, and 4 are excluded.',
        drives: 'Four precise rectangles in Y become four new variables.',
        watchFor: ':3 means rows 0–2, while 3: starts at row 3.',
        variables: [
          {
            name: 'E, F',
            value: '3×2 each',
            meaning: 'The upper block row of Y.',
          },
          {
            name: 'G, H',
            value: '2×2 each',
            meaning: 'The lower block row of Y.',
          },
        ],
        after: {
          title: 'The slice boundaries reveal the block layout',
          description: 'Every entry belongs to exactly one of E, F, G, or H.',
          equation: 'Y = [ E  F ; G  H ]',
          matrices: [
            {
              label: 'E = Y[:3,0:2]',
              values: [
                [0.1, 0.2],
                [0.3, 0.4],
                [0.5, 0.6],
              ],
              cellTones: toneBlock(0, 3, 0, 2, 'block-a'),
            },
            {
              label: 'F = Y[:3,2:]',
              values: [
                [0.7, 0.8],
                [0.9, 1],
                [1.1, 1.2],
              ],
              cellTones: toneBlock(0, 3, 0, 2, 'block-b'),
            },
            {
              label: 'G = Y[3:5,:2]',
              values: [
                [1.3, 1.4],
                [1.5, 1.6],
              ],
              cellTones: toneBlock(0, 2, 0, 2, 'source'),
            },
            {
              label: 'H = Y[3:,2:4]',
              values: [
                [1.7, 1.8],
                [1.9, 2],
              ],
              cellTones: toneBlock(0, 2, 0, 2, 'target'),
            },
          ],
          callout:
            'Because slices are views of rectangular index ranges, the visual highlights the exact data each line selects.',
        },
      },
      {
        code: 'XY = X @ Y',
        title: 'Multiply the full matrices',
        explanation:
          'The @ operator performs row-by-column matrix multiplication, producing a 3×4 result.',
        drives:
          'A result grid whose four quadrants inherit the block partition.',
        watchFor: 'The output dimensions are the outside dimensions: 3 and 4.',
        variables: [
          {
            name: 'XY.shape',
            value: '(3, 4)',
            meaning: 'Outside dimensions of X @ Y.',
          },
        ],
        after: {
          title: 'Direct multiplication produces the reference answer',
          description:
            'The result will now be reconstructed one quadrant at a time using block multiplication.',
          equation: 'XY = X @ Y',
          matrices: [
            {
              label: 'XY',
              values: [
                [23.3, 25.4, 32.9, 35],
                [31.6, 35, 48.2, 51.6],
                [51.9, 58.4, 85.1, 91.6],
              ],
              dividerBefore: 2,
              rowDividerBefore: 2,
              cellTones: toneCells([[0, 0]], 'result'),
            },
          ],
          callout: 'For the selected entry: row 1 of X · column 1 of Y = 23.3.',
        },
      },
      {
        code: 'TL = A@E + B@G\nTR = A@F + B@H\nBL = C@E + D@G\nBR = C@F + D@H',
        title: 'Compute the same answer blockwise',
        explanation:
          'Each result quadrant receives two routes. For example, the top-left block combines A→E and B→G.',
        drives:
          'Four result quadrants and their two contributing multiplication paths.',
        watchFor: 'Matrix order is preserved inside every product.',
        variables: [
          {
            name: 'TL[0,0]',
            value: '2.2 + 21.1 = 23.3',
            meaning: 'A@E contribution plus B@G contribution.',
          },
          {
            name: 'block result',
            value: 'equals XY',
            meaning: 'Regrouping does not change multiplication.',
          },
        ],
        after: {
          title: 'Block multiplication is ordinary multiplication regrouped',
          description:
            'The four smaller results fit together exactly as the full product did.',
          equation: '[AE+BG  AF+BH ; CE+DG  CF+DH] = XY',
          matrices: [
            {
              label: 'AE + BG',
              values: [
                [23.3, 25.4],
                [31.6, 35],
              ],
              cellTones: toneBlock(0, 2, 0, 2, 'block-a'),
            },
            {
              label: 'AF + BH',
              values: [
                [32.9, 35],
                [48.2, 51.6],
              ],
              cellTones: toneBlock(0, 2, 0, 2, 'block-b'),
            },
            {
              label: 'CE + DG',
              values: [[51.9, 58.4]],
              cellTones: toneBlock(0, 1, 0, 2, 'source'),
            },
            {
              label: 'CF + DH',
              values: [[85.1, 91.6]],
              cellTones: toneBlock(0, 1, 0, 2, 'target'),
            },
          ],
          callout:
            'Selected cell trace: (A@E)[0,0] = 2.2 and (B@G)[0,0] = 21.1, so 2.2 + 21.1 = 23.3.',
        },
      },
      {
        code: 'try:\n    E @ A + G @ B\nexcept ValueError as error:\n    print(error)',
        title: 'Test the tempting reversed order',
        explanation:
          'Reversing factors creates a 3×3 matrix and a 2×2 matrix. NumPy cannot add arrays with these incompatible shapes.',
        drives: 'Two frames that visibly refuse to align.',
        watchFor:
          'Matrix multiplication is not commutative: generally AB ≠ BA.',
        variables: [
          {
            name: '(E@A).shape',
            value: '(3, 3)',
            meaning: 'First reversed product.',
          },
          {
            name: '(G@B).shape',
            value: '(2, 2)',
            meaning: 'Second reversed product.',
          },
        ],
        after: {
          title: 'The reversed expression is structurally invalid',
          description:
            'Even though each individual product exists, their output shapes do not match for addition.',
          equation: '(3×2)(2×3) + (2×2)(2×2) → 3×3 + 2×2  ✕',
          matrices: [
            {
              label: 'E @ A : 3×3',
              values: [
                ['•', '•', '•'],
                ['•', '•', '•'],
                ['•', '•', '•'],
              ],
              cellTones: toneBlock(0, 3, 0, 3, 'target'),
            },
            {
              label: 'G @ B : 2×2',
              values: [
                ['•', '•'],
                ['•', '•'],
              ],
              cellTones: toneBlock(0, 2, 0, 2, 'target'),
            },
          ],
          callout:
            'The source notebook catches this broadcasting error; the mismatch is the lesson, not an accidental failure.',
        },
      },
      {
        code: 'Z11 = np.array([[1.,2.,2.],[1.,4.,5.],[1.,2.,3.]])\nZ12 = np.array([[1.,3.],[0.,2.],[1.,1.]])\nZ21 = np.array([[2.,1.,1.],[1.,1.,1.]])\nZ22 = np.array([[1.,1.],[0.,1.]])\nZ = np.block([[Z11, Z12],[Z21, Z22]])\nZ11_inv = sp.linalg.inv(Z11)',
        title: 'Set up a block elimination problem',
        explanation:
          'Z is partitioned 3+2 in both directions. Inverting Z11 lets a block row operation normalize the upper-left block.',
        drives: 'A 5×5 matrix with a prominent 3×3 leading block.',
        watchFor: 'The method requires Z11 to be invertible.',
        variables: [
          {
            name: 'Z11_inv',
            value: '[[3,2,-2],[-2,-4,3],[1,3,-2]]',
            meaning: 'Inverse of the leading 3×3 block.',
          },
        ],
        after: {
          title: 'The 5×5 problem is organized as four blocks',
          description:
            'The lower-left 2×3 block Z21 is the next elimination target.',
          equation: 'Z = [ Z11  Z12 ; Z21  Z22 ]',
          matrices: [
            {
              label: 'Z',
              values: [
                [1, 2, 2, 1, 3],
                [1, 4, 5, 0, 2],
                [2, 7, 8, 3, 7],
                [5, 3, 0, 4, 3],
                [2, 3, 1, 9, 7],
              ],
              dividerBefore: 3,
              rowDividerBefore: 3,
              cellTones: {
                ...toneBlock(0, 3, 0, 3, 'block-a'),
                ...toneBlock(3, 5, 0, 3, 'target'),
              },
            },
          ],
          callout:
            'Think of each colored rectangle as one “large entry” in a 2×2 block matrix.',
        },
      },
      {
        code: 'L1 = np.block([[Z11_inv, np.zeros((3,2))],[-Z21@Z11_inv, np.eye(2)]])\nR1 = L1 @ Z',
        title: 'Eliminate an entire block at once',
        explanation:
          'Multiplication by L1 changes Z11 to identity and cancels every entry of Z21 simultaneously.',
        drives:
          'The lower-left 2×3 rectangle fades to zero as one structural action.',
        watchFor:
          'The new lower-right block is the Schur complement, not the original Z22.',
        variables: [
          {
            name: 'R1[3:,3:]',
            value: '[[-2,-13],[-1,-7]]',
            meaning: 'The Schur complement S22.',
          },
        ],
        after: {
          title: 'Block Gaussian elimination exposes S22',
          description:
            'The leading block is identity, the lower-left block is zero, and all remaining difficulty sits in the 2×2 lower-right block.',
          equation: 'L1 Z = [ I  Z11⁻¹Z12 ; 0  S22 ]',
          matrices: [
            {
              label: 'L1 @ Z',
              values: [
                [1, 0, 0, -3, -1],
                [0, 1, 0, 7, 7],
                [0, 0, 1, -5, -5],
                [0, 0, 0, -2, -13],
                [0, 0, 0, -1, -7],
              ],
              dividerBefore: 3,
              rowDividerBefore: 3,
              cellTones: {
                ...toneBlock(3, 5, 0, 3, 'result'),
                ...toneBlock(3, 5, 3, 5, 'target'),
              },
            },
          ],
          callout:
            'S22 = Z22 − Z21 @ Z11_inv @ Z12. It is the residual block after eliminating Z21.',
        },
      },
      {
        code: 'S22 = Z22 - Z21 @ Z11_inv @ Z12\nS_inv = sp.linalg.inv(S22)\nL2 = np.block([[np.eye(3), -Z11_inv@Z12@S_inv],[np.zeros((2,3)), S_inv]])\nZ_inv = L2 @ L1',
        title: 'Finish the block inverse',
        explanation:
          'L2 normalizes the Schur complement and clears the upper-right block. Because L2 @ L1 @ Z = I, their product is Z inverse.',
        drives:
          'The remaining colored blocks resolve into a 5×5 identity matrix.',
        watchFor: 'The order L2 @ L1 matters because L1 acts first on Z.',
        variables: [
          {
            name: 'S_inv',
            value: '[[-7,13],[1,-2]]',
            meaning: 'Inverse of the Schur complement.',
          },
          {
            name: 'Z_inv',
            value: 'L2 @ L1',
            meaning: 'The accumulated left operations.',
          },
        ],
        after: {
          title: 'The block operations have built Z⁻¹',
          description:
            'The identity result certifies that the accumulated left multiplier is the inverse.',
          equation: '(L2 L1) Z = I₅  →  Z⁻¹ = L2 L1',
          matrices: [
            {
              label: 'L2 @ L1 @ Z',
              values: [
                [1, 0, 0, 0, 0],
                [0, 1, 0, 0, 0],
                [0, 0, 1, 0, 0],
                [0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1],
              ],
              dividerBefore: 3,
              rowDividerBefore: 3,
              cellTones: toneCells(
                [
                  [0, 0],
                  [1, 1],
                  [2, 2],
                  [3, 3],
                  [4, 4],
                ],
                'result',
              ),
            },
          ],
        },
      },
      {
        code: 'edges = {1:[3,4,5], 2:[3,4,5], 3:[1,2,6,7], 4:[1,2,6,7], 5:[1,2,6,7], 6:[3,4,5,8], 7:[3,4,5,8], 8:[6,7]}\nA = np.zeros((8,8))\nfor i in range(1,9):\n    for j in edges[i]: A[i-1,j-1] = 1',
        title: 'Turn an adjacency list into a matrix',
        explanation:
          'Each listed neighbor writes a 1 into the corresponding row and column. The subtraction converts vertex labels 1–8 into Python indices 0–7.',
        drives:
          'Graph edges and symmetric pairs of adjacency cells appear together.',
        watchFor:
          'This line overwrites the earlier variable A; the visual calls it “Adjacency A” to avoid confusion.',
        variables: [
          {
            name: 'A.shape',
            value: '(8, 8)',
            meaning: 'One row and column per graph vertex.',
          },
          {
            name: 'A.sum()',
            value: '28',
            meaning: 'Fourteen undirected edges counted in both directions.',
          },
        ],
        after: {
          title: 'The graph and its adjacency matrix encode the same edges',
          description:
            'Because every connection is listed both ways, A is symmetric.',
          equation: 'A[i−1, j−1] = 1  ⇔  vertex i is adjacent to vertex j',
          graph: { nodes: graphNodes, edges: graphEdges },
          matrices: [
            {
              label: 'Adjacency A',
              values: adjacency,
              cellTones: toneCells(
                [
                  [0, 2],
                  [2, 0],
                ],
                'source',
              ),
            },
          ],
          callout:
            'The highlighted symmetric cells A[0,2] and A[2,0] both represent the undirected edge 1—3.',
        },
      },
      {
        code: 'A3 = np.linalg.matrix_power(A, 3)',
        title: 'Count length-three walks',
        explanation:
          'Matrix multiplication combines one-step choices. After three powers, entry (i,j) counts three-edge walks from i to j.',
        drives: 'The selected v6→v8 cell reveals eight possible walks.',
        watchFor:
          'Python position [5,7] corresponds to the human labels (6,8).',
        variables: [
          {
            name: 'A3[5,7]',
            value: '8',
            meaning: 'Eight length-three walks from vertex 6 to vertex 8.',
          },
          {
            name: 'A3[5,:]',
            value: '[0,0,14,14,14,0,0,8]',
            meaning: 'All length-three destinations from vertex 6.',
          },
        ],
        after: {
          title: 'A³ turns repeated choices into walk counts',
          description:
            'The graph highlights one representative walk; the matrix cell records all eight.',
          equation: '6→3→6→8 is one of 8 length-three walks from 6 to 8',
          graph: {
            nodes: graphNodes.map((node) => ({
              ...node,
              tone:
                node.id === '6'
                  ? 'source'
                  : node.id === '8'
                    ? 'target'
                    : node.id === '3'
                      ? 'result'
                      : undefined,
            })),
            edges: graphEdges.map((edge) => ({
              ...edge,
              active:
                (edge.from === '3' && edge.to === '6') ||
                (edge.from === '6' && edge.to === '8'),
            })),
          },
          matrices: [
            {
              label: 'row 6 of A³',
              values: [[0, 0, 14, 14, 14, 0, 0, 8]],
              cellTones: toneCells([[0, 7]], 'result'),
            },
          ],
          callout:
            'The notebook’s repeated-edge examples are walks. A simple path would forbid repeated vertices.',
        },
      },
      {
        code: 'v_order = [3,4,5,8,1,2,6,7]\norder = np.array(v_order) - 1\nB = A[np.ix_(order, order)]\nB2 = B @ B',
        title: 'Reorder the bipartition and square it',
        explanation:
          'Putting the two vertex groups together exposes zero diagonal blocks in B. Squaring then moves two-step connections onto the diagonal blocks.',
        drives:
          'Rows and columns slide into bipartite order; off-diagonal structure in B becomes diagonal structure in B².',
        watchFor:
          'B @ B is matrix multiplication; B ** 2 would only square entries elementwise.',
        variables: [
          {
            name: 'V1',
            value: '{3,4,5,8}',
            meaning: 'First side of the bipartition.',
          },
          {
            name: 'V2',
            value: '{1,2,6,7}',
            meaning: 'Second side of the bipartition.',
          },
        ],
        after: {
          title: 'Reordering reveals the graph’s block structure',
          description:
            'Edges cross between the two groups, so B has zero diagonal blocks. Two-step walks return to the same group, so B² has zero off-diagonal blocks.',
          equation: 'B=[0 Q; Qᵀ 0]  →  B²=[QQᵀ 0; 0 QᵀQ]',
          matrices: [
            {
              label: 'Q',
              values: [
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [0, 0, 1, 1],
              ],
              cellTones: toneBlock(0, 4, 0, 4, 'block-a'),
            },
            {
              label: 'QQᵀ',
              values: [
                [4, 4, 4, 2],
                [4, 4, 4, 2],
                [4, 4, 4, 2],
                [2, 2, 2, 2],
              ],
              cellTones: toneBlock(0, 4, 0, 4, 'result'),
            },
            {
              label: 'QᵀQ',
              values: [
                [3, 3, 3, 3],
                [3, 3, 3, 3],
                [3, 3, 4, 4],
                [3, 3, 4, 4],
              ],
              cellTones: toneBlock(0, 4, 0, 4, 'result'),
            },
          ],
          callout:
            'The graph did not change—only the vertex order changed. The new order makes the bipartite pattern visible.',
        },
      },
    ],
  },
};
