import type { WalkthroughGraph } from '@/components/code-walkthrough';

import type { ChapterSection } from './shared';
import { sourceLinks, toneBlock, toneCells } from './shared';

const filename = 'Ch2-2 Block Matrices & Graphs.ipynb';
const links = sourceLinks(filename);

const source = {
  filename,
  url: links.githubUrl,
  note: 'Notebook code is compacted; variables, operation order, and saved values follow upstream.',
};

const graph: WalkthroughGraph = {
  nodes: [
    { id: '1', label: '1', x: 35, y: 55 },
    { id: '2', label: '2', x: 35, y: 140 },
    { id: '3', label: '3', x: 125, y: 30 },
    { id: '4', label: '4', x: 125, y: 78 },
    { id: '5', label: '5', x: 125, y: 145 },
    { id: '6', label: '6', x: 225, y: 55 },
    { id: '7', label: '7', x: 225, y: 140 },
    { id: '8', label: '8', x: 305, y: 98 },
  ],
  edges: [
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
  ],
};

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

const adjacencyCube = [
  [0, 0, 12, 12, 12, 0, 0, 6],
  [0, 0, 12, 12, 12, 0, 0, 6],
  [12, 12, 0, 0, 0, 14, 14, 0],
  [12, 12, 0, 0, 0, 14, 14, 0],
  [12, 12, 0, 0, 0, 14, 14, 0],
  [0, 0, 14, 14, 14, 0, 0, 8],
  [0, 0, 14, 14, 14, 0, 0, 8],
  [6, 6, 0, 0, 0, 8, 8, 0],
];

const reordered = [
  [0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 0, 0],
];

const reorderedSquared = [
  [4, 4, 4, 2, 0, 0, 0, 0],
  [4, 4, 4, 2, 0, 0, 0, 0],
  [4, 4, 4, 2, 0, 0, 0, 0],
  [2, 2, 2, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 3, 3, 3, 3],
  [0, 0, 0, 0, 3, 3, 3, 3],
  [0, 0, 0, 0, 3, 3, 4, 4],
  [0, 0, 0, 0, 3, 3, 4, 4],
];

export const blockMatricesGraphsSection: ChapterSection = {
  slug: 'block-matrices-graphs',
  number: '2.2',
  title: 'Block Matrices and Graphs',
  shortTitle: 'Blocks and graphs',
  summary:
    'Build and multiply blocks, derive a block inverse, and read walk counts from adjacency powers.',
  focus: 'blocks → Schur complement → adjacency powers',
  learningGoal:
    'Read the original NumPy code as matrix algebra: see how slices create blocks, elimination creates a Schur complement, and powers count graph walks.',
  lectureConcepts: [
    'Block matrices',
    'Block multiplication',
    'Schur complement',
    'Adjacency matrix',
  ],
  codeExtension: 'NumPy block construction, slicing, and matrix powers.',
  filename,
  ...links,
  primer: [
    {
      term: 'Block matrix',
      definition:
        'A partition groups entries into smaller matrices without changing the underlying matrix.',
      relation: 'X = [[A,B],[C,D]]',
      watchFor: 'Adjacent block dimensions must agree.',
    },
    {
      term: 'Half-open slice',
      definition: 'A NumPy slice includes its start and excludes its stop.',
      relation: 'Y[:3, 0:2]',
      watchFor: 'This selects rows 0–2 and columns 0–1.',
    },
    {
      term: 'Schur complement',
      definition:
        'Block Gaussian elimination leaves a new lower-right block after eliminating Z₂₁.',
      relation: 'S₂₂ = Z₂₂ − Z₂₁Z₁₁⁻¹Z₁₂',
      watchFor: 'The factor order cannot be rearranged.',
    },
    {
      term: 'Adjacency power',
      definition: 'Entry (i,j) of Aᵐ counts length-m walks from i to j.',
      relation: '(Aᵐ)ᵢⱼ = # walks',
      watchFor: 'A walk may repeat vertices or edges.',
    },
  ],
  walkthrough: {
    eyebrow: 'Lab 2.2 · Source trace',
    title: 'Track the notebook’s blocks and graphs',
    objective:
      'Core executable statements keep the original variables and order. Print-only labels and comments are compacted; source typos that affect meaning are explained.',
    source,
    initial: {
      title: 'Start before the block matrices',
      description:
        'After the shared import and print-option cells, the notebook begins with four compatible blocks.',
      equation: 'X = [ A  B ; C  D ]',
    },
    steps: [
      {
        sourceCell: 'Code cells 1–2',
        code: 'import numpy as np\nimport scipy as sp\nimport matplotlib as mpl\nimport matplotlib.pyplot as plt\nimport seaborn as sns\nnp.set_printoptions(4, linewidth=100, suppress=True)',
        title: 'Prepare the notebook',
        explanation:
          'These are the original imports and array display settings, with comments and blank lines compacted.',
        drives: 'The same numerical environment used in Lab 2.1.',
        watchFor: 'The settings affect display, not matrix arithmetic.',
        after: {
          title: 'NumPy and SciPy are ready',
          description: 'The first matrix values are created in code cell 3.',
          equation: 'np → arrays · sp → inverse',
        },
      },
      {
        sourceCell: 'Code cell 3',
        code: 'A = np.array([[1.0, 2.0, 3.0],\n              [4.0, 5.0, 6.0]])\nB = np.array([[7.0, 8.0],\n              [9.0, 10.0]])\nC = np.array([[11.0, 12.0, 13.0]])\nD = np.array([[14.0, 15.0]])\nX = np.block([[A, B],\n              [C, D]])\nprint("X = ")\nprint(X)',
        title: 'Build X from four source blocks',
        explanation:
          'np.block joins A and B across the top, C and D across the bottom, then combines the two block rows.',
        drives: 'The exact saved 3×5 matrix X.',
        watchFor: 'A/C share width 3; B/D share width 2.',
        variables: [
          {
            name: 'X.shape',
            value: '(3, 5)',
            meaning: 'Two block rows and two block columns.',
          },
        ],
        after: {
          title: 'The four definitions become one matrix',
          description:
            'Divider lines show boundaries; they are not extra entries.',
          matrices: [
            {
              label: 'X · saved output',
              values: [
                [1, 2, 3, 7, 8],
                [4, 5, 6, 9, 10],
                [11, 12, 13, 14, 15],
              ],
              dividerBefore: 3,
              rowDividerBefore: 2,
            },
          ],
        },
      },
      {
        sourceCell: 'Code cell 4',
        code: 'Y = np.array([[0.1, 0.2, 0.7, 0.8],\n              [0.3, 0.4, 0.9, 1.0],\n              [0.5, 0.6, 1.1, 1.2],\n              [1.3, 1.4, 1.7, 1.8],\n              [1.5, 1.6, 1.9, 2.0]])\nE = Y[:3, 0:2]\nF = Y[0:3, 2:]\nG = Y[3:5, :2]\nH = Y[3:, 2:4]\nprint("Blocks:")\nprint(E)\nprint(F)\nprint(G)\nprint(H)',
        title: 'Recover four blocks with slices',
        explanation:
          'The source comments spell out equivalent slice bounds. Each expression selects one rectangle without changing Y.',
        drives: 'E, F, G, and H as views of Y.',
        watchFor:
          'The split after the first three rows matches X’s split after its first three columns.',
        variables: [
          { name: 'E / F', value: '(3, 2)', meaning: 'Upper block row.' },
          { name: 'G / H', value: '(2, 2)', meaning: 'Lower block row.' },
        ],
        after: {
          title: 'The slice boundaries reveal Y’s partition',
          description:
            'The first three rows form the top block row; columns split 2+2.',
          matrices: [
            {
              label: 'Y · source input with slice boundaries',
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
            {
              label: 'E · saved output',
              values: [
                [0.1, 0.2],
                [0.3, 0.4],
                [0.5, 0.6],
              ],
            },
            {
              label: 'F · saved output',
              values: [
                [0.7, 0.8],
                [0.9, 1],
                [1.1, 1.2],
              ],
            },
            {
              label: 'G · saved output',
              values: [
                [1.3, 1.4],
                [1.5, 1.6],
              ],
            },
            {
              label: 'H · saved output',
              values: [
                [1.7, 1.8],
                [1.9, 2],
              ],
            },
          ],
        },
      },
      {
        sourceCell: 'Code cells 5–6',
        code: 'print("Direct multplication: X*Y =")\nprint(X @ Y)\nprint("A*E + B*G =")\nprint(A@E + B@G)\nprint("A*F + B*H =")\nprint(A@F + B@H)\nprint("C*E + D*G =")\nprint(C@E + D@G)\nprint("C*F + D*H =")\nprint(C@F + D@H)\ntry:\n    print(E@A + G@B)\nexcept Exception as e:\n    print("The following error has occured:")\n    print(e)',
        title: 'Multiply in the source order',
        explanation:
          'The executable operator is @. The source’s printed * labels and spelling are typos; NumPy * would mean elementwise multiplication.',
        drives:
          'The direct product, its four matching blocks, and the intended order error.',
        watchFor: 'E@A is 3×3 while G@B is 2×2, so their sum is undefined.',
        variables: [
          { name: 'X @ Y', value: '(3, 4)', meaning: 'The complete product.' },
          {
            name: 'reversed sum',
            value: 'ValueError',
            meaning: 'The two result shapes cannot be added.',
          },
        ],
        after: {
          title: 'Block multiplication reproduces the full product',
          description:
            'The four source expressions occupy the four marked output blocks.',
          equation: 'XY = [ AE+BG   AF+BH ; CE+DG   CF+DH ]',
          matrices: [
            {
              label: 'X @ Y · saved output',
              values: [
                [23.3, 25.4, 32.9, 35],
                [31.6, 35, 48.2, 51.6],
                [51.9, 58.4, 85.1, 91.6],
              ],
              dividerBefore: 2,
              rowDividerBefore: 2,
            },
            {
              label: 'AE + BG · saved block',
              values: [
                [23.3, 25.4],
                [31.6, 35],
              ],
            },
            {
              label: 'AF + BH · saved block',
              values: [
                [32.9, 35],
                [48.2, 51.6],
              ],
            },
            { label: 'CE + DG · saved block', values: [[51.9, 58.4]] },
            { label: 'CF + DH · saved block', values: [[85.1, 91.6]] },
          ],
          callout:
            'Saved reverse-order error: operands could not be broadcast together with shapes (3,3) (2,2).',
        },
      },
      {
        sourceCell: 'Code cell 7',
        code: 'Z11 = np.array([[1, 2, 2],\n                [1, 4, 5],\n                [2, 7, 8]])\nZ12 = np.array([[1, 3],\n                [0, 2],\n                [3, 7]])\nZ21 = np.array([[5, 3, 0],\n                [2, 3, 1]])\nZ22 = np.array([[4, 3],\n                [9, 7]])\nZ = np.block([[Z11, Z12],\n              [Z21, Z22]])\nprint("Z = ")\nprint(Z)',
        title: 'Create the block inverse example',
        explanation:
          'The source organizes a 5×5 matrix around an invertible 3×3 leading block Z11.',
        drives: 'The exact integer matrix Z.',
        watchFor: 'The boundary is 3+2 in both directions.',
        after: {
          title: 'Z is ready for block elimination',
          description:
            'The highlighted regions retain the original four-block layout.',
          matrices: [
            {
              label: 'Z · saved output',
              values: [
                [1, 2, 2, 1, 3],
                [1, 4, 5, 0, 2],
                [2, 7, 8, 3, 7],
                [5, 3, 0, 4, 3],
                [2, 3, 1, 9, 7],
              ],
              dividerBefore: 3,
              rowDividerBefore: 3,
            },
          ],
        },
      },
      {
        sourceCell: 'Code cells 8–10',
        code: 'Z11_inv = sp.linalg.inv(Z11)\nprint(Z11_inv)\nL1 = np.block([[Z11_inv, np.zeros((3, 2))],\n              [-Z21 @ Z11_inv, np.eye(2)]])\nprint(L1 @ Z)\nprint("Z_11^-1 * Z_12 =")\nprint(Z11_inv @ Z12)\nS22 = Z22 - Z21 @ Z11_inv @ Z12\nprint("S_22 =")\nprint(S22)',
        title: 'Eliminate the lower-left block',
        explanation:
          'L1 first turns Z11 into identity and then cancels Z21. The remaining lower-right block is the Schur complement S22.',
        drives: 'Z11_inv, a block upper-triangular L1@Z, and S22.',
        watchFor:
          'The source print label uses *, but every executable multiplication here uses @.',
        variables: [
          {
            name: 'S22',
            value: '[[-2, -13], [-1, -7]]',
            meaning: 'The remaining 2×2 block.',
          },
        ],
        after: {
          title: 'A whole 2×3 block becomes zero',
          description:
            'The saved result isolates S22 in the lower-right corner.',
          equation: 'S₂₂ = Z₂₂ − Z₂₁Z₁₁⁻¹Z₁₂',
          matrices: [
            {
              label: 'Z11_inv · saved output',
              values: [
                [3, 2, -2],
                [-2, -4, 3],
                [1, 3, -2],
              ],
            },
            {
              label: 'L1 @ Z · saved output',
              values: [
                [1, 0, 0, -3, -1],
                [0, 1, 0, 7, 7],
                [0, 0, 1, -5, -5],
                [0, 0, 0, -2, -13],
                [0, 0, 0, -1, -7],
              ],
              dividerBefore: 3,
              rowDividerBefore: 3,
              cellTones: toneBlock(3, 5, 0, 3, 'result'),
            },
            {
              label: 'Z11_inv @ Z12 · saved output',
              values: [
                [-3, -1],
                [7, 7],
                [-5, -5],
              ],
            },
            {
              label: 'S22',
              values: [
                [-2, -13],
                [-1, -7],
              ],
              cellTones: toneBlock(0, 2, 0, 2, 'result'),
            },
          ],
        },
      },
      {
        sourceCell: 'Code cells 11–13',
        code: 'S_inv = sp.linalg. inv(S22)\nprint(S_inv)\nL2 = np.block([[np.eye(3), -Z11_inv @ Z12 @ S_inv],\n               [np.zeros((2, 3)), S_inv]])\nprint(L2 @ (L1 @ Z))\nprint("Direct inverse: Z^-1 =")\nprint(sp.linalg.inv(Z))\nprint(Z11_inv + Z11_inv @ Z12 @ S_inv @ Z21 @ Z11_inv)\nprint(-Z11_inv @ Z12 @ S_inv)\nprint(-S_inv @ Z21 @ Z11_inv)\nprint(S_inv)',
        title: 'Finish the block inverse',
        explanation:
          'S_inv normalizes the Schur-complement block to identity. L2@L1 sends Z to identity, so the combined block formulas equal Z inverse.',
        drives: 'A saved identity matrix and the four blocks of Z inverse.',
        watchFor:
          'The unusual space in sp.linalg. inv is valid Python, though sp.linalg.inv is clearer.',
        variables: [
          {
            name: 'S_inv',
            value: '[[-7, 13], [1, -2]]',
            meaning: 'The inverse Schur complement.',
          },
          {
            name: 'L2 @ (L1 @ Z)',
            value: 'I₅',
            meaning: 'The elimination has produced identity.',
          },
        ],
        after: {
          title: 'The block formula matches the direct inverse',
          description: 'This is the complete saved 5×5 inverse.',
          matrices: [
            {
              label: 'S_inv · saved output',
              values: [
                [-7, 13],
                [1, -2],
              ],
            },
            {
              label: 'L2 @ (L1 @ Z) · saved values',
              values: [
                [1, 0, 0, 0, 0],
                [0, 1, 0, 0, 0],
                [0, 0, 1, 0, 0],
                [0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1],
              ],
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
            {
              label: 'Z⁻¹ · saved output',
              values: [
                [146, 147, -133, -20, 37],
                [-303, -305, 276, 42, -77],
                [216, 218, -197, -30, 55],
                [50, 51, -46, -7, 13],
                [-7, -8, 7, 1, -2],
              ],
              dividerBefore: 3,
              rowDividerBefore: 3,
            },
            {
              label: 'top-left inverse block · saved output',
              values: [
                [146, 147, -133],
                [-303, -305, 276],
                [216, 218, -197],
              ],
            },
            {
              label: 'top-right inverse block · saved output',
              values: [
                [-20, 37],
                [42, -77],
                [-30, 55],
              ],
            },
            {
              label: 'bottom-left inverse block · saved output',
              values: [
                [50, 51, -46],
                [-7, -8, 7],
              ],
            },
            {
              label: 'bottom-right inverse block · saved output',
              values: [
                [-7, 13],
                [1, -2],
              ],
            },
          ],
        },
      },
      {
        sourceCell: 'Code cell 14',
        code: "from IPython.display import Image\nImage('/Users/wanmokang/Downloads/example_graph.png', width = 500)",
        title: 'Display the graph used by the notebook',
        explanation:
          'The saved notebook contains the image, but this absolute local path is not portable. The diagram at right reconstructs the same edge set.',
        drives: 'A graph with vertices 1 through 8.',
        watchFor:
          'This cell may fail on Colab unless the image path is replaced.',
        after: {
          title: 'The graph has 8 vertices and 14 edges',
          description:
            'The visualization follows the adjacency list in code cell 15.',
          graph,
          callout:
            'The webpage diagram is a teaching reconstruction; the code shown is the original image cell.',
        },
      },
      {
        sourceCell: 'Code cells 15–16',
        code: '# adjacency list\nedges = [[],\n         [3, 4, 5],\n         [3, 4, 5],\n         [1, 2, 6, 7],\n         [1, 2, 6, 7],\n         [1, 2, 6, 7],\n         [3, 4, 5, 8],\n         [3, 4, 5, 8],\n         [6, 7]]\n# adjacency matrix\nA = np.zeros((8, 8))\nfor i in range(1, 8+1):\n    for j in edges[i] :\n        A[i-1, j-1] = 1\nprint(A)',
        title: 'Convert the source edge lists to A',
        explanation:
          'Index 0 is intentionally empty, so vertex labels 1–8 can index the Python list directly. Matrix indices subtract one.',
        drives: 'The exact saved 8×8 adjacency matrix.',
        watchFor:
          'The name A now refers to the graph matrix, replacing the earlier 2×3 block A.',
        variables: [
          {
            name: 'A.shape',
            value: '(8, 8)',
            meaning: 'One row and column per vertex.',
          },
          {
            name: 'A.sum()',
            value: '28',
            meaning: 'Each of 14 undirected edges appears twice.',
          },
        ],
        after: {
          title: 'Ones mark edges in the graph',
          description:
            'The matrix is symmetric because every listed edge is undirected.',
          matrices: [
            { label: 'A · saved adjacency output', values: adjacency },
          ],
        },
      },
      {
        sourceCell: 'Code cell 17',
        code: 'print(np.linalg.matrix_power(A, 3))',
        title: 'Count length-three walks',
        explanation:
          'Matrix multiplication sums all choices of two intermediate vertices. Repeated vertices are allowed, so these are walks.',
        drives: 'The complete saved A cubed output.',
        watchFor:
          'Entry [5,7] in zero-based indexing is 8: eight walks from vertex 6 to vertex 8.',
        variables: [
          { name: 'A³[5,7]', value: '8', meaning: 'Walks 6 → · → · → 8.' },
        ],
        after: {
          title: 'A³ stores every length-three walk count',
          description:
            'The highlighted saved entry counts walks from vertex 6 to vertex 8.',
          matrices: [
            {
              label: 'A³ · saved output',
              values: adjacencyCube,
              cellTones: toneCells([[5, 7]], 'result'),
            },
            {
              label: '8 walks listed in the source explanation',
              values: [
                [1, '6→3→6→8'],
                [2, '6→4→6→8'],
                [3, '6→5→6→8'],
                [4, '6→3→7→8'],
                [5, '6→4→7→8'],
                [6, '6→5→7→8'],
                [7, '6→8→6→8'],
                [8, '6→8→7→8'],
              ],
            },
          ],
          callout:
            'The source prose says paths, but allowing repetitions makes “walks” the precise term.',
        },
      },
      {
        sourceCell: 'Code cell 18',
        code: '# permuted adjacency matrix\nB = np.zeros((8, 8))\nv_order = [3, 4, 5, 8, 1, 2, 6, 7]\nfor m in range(8):\n    for n in range(8) :\n        i = v_order[m]\n        j = v_order[n]\n        if j in edges[i] :\n            B[m, n] = 1\nprint(B)',
        title: 'Reorder vertices with the source loops',
        explanation:
          'The nested loops rebuild adjacency entries in v_order. The two independent sets become the first and last four rows and columns.',
        drives: 'The exact saved reordered adjacency matrix B.',
        watchFor: 'The name B now replaces the earlier 2×2 block B.',
        variables: [
          {
            name: 'v_order',
            value: '[3, 4, 5, 8 | 1, 2, 6, 7]',
            meaning: 'The two bipartition groups.',
          },
        ],
        after: {
          title: 'B exposes the bipartite pattern',
          description:
            'Both diagonal 4×4 blocks are zero; edges lie only across the partition.',
          matrices: [
            {
              label: 'B · saved output',
              values: reordered,
              dividerBefore: 4,
              rowDividerBefore: 4,
            },
          ],
        },
      },
      {
        sourceCell: 'Code cell 19',
        code: 'B2 = B @ B # shall not be confused with B**2\nprint(B2)',
        title: 'Square B with matrix multiplication',
        explanation:
          'A two-step walk starts and ends in the same bipartition, so the off-diagonal blocks become zero.',
        drives: 'The exact saved block-diagonal B2.',
        watchFor:
          'B@B is matrix multiplication; B**2 squares entries independently.',
        variables: [
          {
            name: 'B2.shape',
            value: '(8, 8)',
            meaning: 'Two-step walk counts for every ordered pair.',
          },
        ],
        after: {
          title: 'Two-step walks stay within each side',
          description: 'The saved result has two nonzero diagonal blocks.',
          matrices: [
            {
              label: 'B2 · saved output',
              values: reorderedSquared,
              dividerBefore: 4,
              rowDividerBefore: 4,
            },
          ],
        },
      },
    ],
  },
};
