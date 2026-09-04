import type { WalkthroughGraph } from '@/components/code-walkthrough';

import type { ChapterSection } from './shared';
import { sourceLinks, toneCells } from './shared';

const filename = 'Ch2-2 Block Matrices & Graphs.ipynb';
const links = sourceLinks(filename);

const graph: WalkthroughGraph = {
  nodes: [
    { id: '1', label: '1', x: 45, y: 95 },
    { id: '2', label: '2', x: 145, y: 40 },
    { id: '3', label: '3', x: 145, y: 150 },
    { id: '4', label: '4', x: 285, y: 95 },
  ],
  edges: [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '2', to: '4' },
    { from: '3', to: '4' },
  ],
};

const activeGraph: WalkthroughGraph = {
  nodes: graph.nodes.map((node) => ({
    ...node,
    tone: node.id === '1' ? 'source' : node.id === '4' ? 'target' : undefined,
  })),
  edges: graph.edges.map((edge) => ({ ...edge, active: true })),
};

export const blockMatricesGraphsSection: ChapterSection = {
  slug: 'block-matrices-graphs',
  number: '2.2',
  title: 'Block Matrices and Graphs',
  shortTitle: 'Blocks and graphs',
  summary:
    'Build one small block matrix, multiply it blockwise, and count two-step graph walks.',
  focus: 'join blocks → multiply → count walks',
  learningGoal:
    'Explain how np.block joins compatible rectangles and why one entry of a squared adjacency matrix counts length-two walks.',
  lectureConcepts: [
    'Block matrices',
    'Block multiplication',
    'Adjacency matrix',
    'Walk counts',
  ],
  codeExtension:
    'The full notebook continues to Schur complements, block inverses, longer walks, and bipartite reordering.',
  filename,
  ...links,
  primer: [
    {
      term: 'Compatible blocks',
      definition:
        'Blocks in one block row need the same height; blocks in one block column need the same width.',
      relation: 'X = [[A, B], [C, D]]',
      watchFor: 'The divider is a boundary, not another matrix entry.',
    },
    {
      term: 'Block multiplication',
      definition:
        'The usual row-by-column rule still applies when each entry is itself a compatible matrix.',
      relation: 'top-left = A E + B G',
      watchFor: 'Keep the multiplication order.',
    },
    {
      term: 'Adjacency power',
      definition:
        'Entry (i,j) of G² counts the length-two walks from vertex i to vertex j.',
      relation: '(adj²)ᵢⱼ = # two-step walks',
      watchFor: 'A walk may revisit a vertex; it is not always a path.',
    },
  ],
  walkthrough: {
    eyebrow: 'Lab 2.2 · Guided example',
    title: 'See blocks and graph walks with small matrices',
    objective:
      'This trace keeps two ideas from the notebook—block arithmetic and adjacency powers—and removes the larger inverse and 8-vertex examples.',
    source: {
      filename,
      url: links.githubUrl,
      note: 'The values and graph are intentionally smaller than the full notebook examples.',
    },
    initial: {
      title: 'Two ideas, one rule',
      description:
        'Matrix multiplication combines compatible rows and columns, whether we view them as blocks or graph connections.',
      equation: 'row × column → one output entry',
    },
    steps: [
      {
        code: 'import numpy as np\nA = np.array([[1, 2], [3, 4]])\nB = np.array([[5], [6]])\nC = np.array([[7, 8]])\nD = np.array([[9]])\nX = np.block([[A, B], [C, D]])',
        lineNotes: [
          {
            action: 'Loads NumPy for arrays and block construction.',
            shape: '— (module import)',
            operation: 'Binds NumPy to the short name np.',
          },
          {
            action: 'Creates the upper-left block.',
            shape: 'A: (2, 2)',
            operation: 'Stores two rows and two columns.',
          },
          {
            action: 'Creates the upper-right block.',
            shape: 'B: (2, 1)',
            operation: 'Stores a two-entry column beside A.',
          },
          {
            action: 'Creates the lower-left block.',
            shape: 'C: (1, 2)',
            operation: 'Stores one row below A.',
          },
          {
            action: 'Creates the lower-right block.',
            shape: 'D: (1, 1)',
            operation: 'Stores the single lower-right entry 9.',
          },
          {
            action: 'Joins the four compatible rectangles into X.',
            shape: 'rows 2+1, columns 2+1 → X: (3, 3)',
            operation:
              'np.block places A/B above C/D; shared block sizes must match.',
          },
        ],
        title: 'Join four compatible blocks',
        explanation:
          'A and B share height 2; C and D share height 1. The block columns have widths 2 and 1.',
        watchFor: 'The four definitions become one 3×3 matrix.',
        variables: [
          {
            name: 'X.shape',
            value: '(3, 3)',
            meaning: 'A complete square matrix.',
          },
        ],
        after: {
          title: 'np.block preserves the four regions',
          description:
            'The visible dividers mark the 2+1 row and column split.',
          matrices: [
            {
              label: 'X',
              values: [
                [1, 2, 5],
                [3, 4, 6],
                [7, 8, 9],
              ],
              dividerBefore: 2,
              rowDividerBefore: 2,
            },
          ],
        },
      },
      {
        code: 'Y = np.array([[1, 0], [0, 1], [1, 2]])\nE, F = Y[:2, :1], Y[:2, 1:]\nG, H = Y[2:, :1], Y[2:, 1:]\ndirect = X @ Y\nby_blocks = np.block([[A @ E + B @ G, A @ F + B @ H],\n                      [C @ E + D @ G, C @ F + D @ H]])\nsame = np.array_equal(direct, by_blocks)',
        lineNotes: [
          {
            action: 'Creates the right factor with matching block boundaries.',
            shape: 'Y: (3, 2), split as rows 2+1 and columns 1+1',
            operation:
              'Its row split matches X; its column split defines two output blocks.',
          },
          {
            action: 'Slices the top block row into E and F.',
            shape: 'E: (2, 1), F: (2, 1)',
            operation: 'Takes rows 0–1 and splits the columns at index 1.',
          },
          {
            action: 'Slices the bottom block row into G and H.',
            shape: 'G: (1, 1), H: (1, 1)',
            operation: 'Takes the final row and splits the columns at index 1.',
          },
          {
            action: 'Computes the ordinary full matrix product.',
            shape: '(3, 3) @ (3, 2) → direct: (3, 2)',
            operation: 'Applies ordinary row-by-column multiplication.',
          },
          {
            action: 'Computes the top output blocks.',
            shape: 'AE+BG: (2,1), AF+BH: (2,1) → top: (2,2)',
            operation: 'Adds products only when their output shapes match.',
          },
          {
            action: 'Computes the bottom blocks and closes np.block.',
            shape: 'CE+DG, CF+DH: each (1,1) → result: (3,2)',
            operation:
              'Stacks the 2-row top blocks above the 1-row bottom blocks.',
          },
          {
            action: 'Checks that both calculations give the same entries.',
            shape: '(3, 2) vs (3, 2) → same: bool',
            operation: 'All six entries agree, so the result is True.',
          },
        ],
        title: 'Multiply directly and by blocks',
        explanation:
          'Each output block follows the same row-by-column pattern as one scalar entry in ordinary multiplication.',
        watchFor: 'Both methods should produce the same 3×2 result.',
        variables: [
          { name: 'same', value: 'True', meaning: 'Blockwise equals direct.' },
        ],
        after: {
          title: 'Block multiplication is ordinary multiplication',
          description:
            'The right matrix shows the block boundaries in the same result.',
          equation: 'A E + B G = top-left output block',
          matrices: [
            {
              label: 'direct = X @ Y',
              values: [
                [6, 12],
                [9, 16],
                [16, 26],
              ],
            },
            {
              label: 'by_blocks',
              values: [
                [6, 12],
                [9, 16],
                [16, 26],
              ],
              dividerBefore: 1,
              rowDividerBefore: 2,
              cellTones: toneCells(
                [
                  [0, 0],
                  [0, 1],
                  [1, 0],
                  [1, 1],
                  [2, 0],
                  [2, 1],
                ],
                'result',
              ),
            },
          ],
        },
      },
      {
        code: 'edges = [(0, 1), (0, 2), (1, 3), (2, 3)]\nadj = np.zeros((4, 4), dtype=int)\nfor i, j in edges:\n    adj[i, j] = 1\n    adj[j, i] = 1',
        lineNotes: [
          {
            action: 'Lists four undirected edges using zero-based indices.',
            shape: 'edges: 4 pairs of scalar indices',
            operation:
              'Stores each undirected edge once with endpoints from 0 to 3.',
          },
          {
            action: 'Starts an adjacency matrix filled with zeros.',
            shape: 'adj: (4, 4)',
            operation:
              'Allocates 16 integer zeros before any edge is recorded.',
          },
          {
            action: 'Visits one edge at a time.',
            shape: 'one pair → i: scalar, j: scalar',
            operation:
              'Unpacks one edge and repeats the body for all four pairs.',
          },
          {
            action: 'Records the connection from i to j.',
            shape: 'adj[i, j]: scalar entry',
            operation: 'Changes the forward adjacency entry from 0 to 1.',
          },
          {
            action: 'Records the reverse connection.',
            shape: 'adj[j, i]: transposed scalar entry',
            operation:
              'Mirrors the 1 across the diagonal, making adj symmetric.',
          },
        ],
        title: 'Turn edges into an adjacency matrix',
        explanation:
          'Code indices 0–3 correspond to visible vertex labels 1–4. An edge writes a 1 in both symmetric positions.',
        watchFor: 'Each undirected edge creates two symmetric 1s.',
        after: {
          title: 'The graph and matrix encode the same connections',
          description: 'A 1 means the two vertices share an edge.',
          graph,
          matrices: [
            {
              label: 'adj',
              values: [
                [0, 1, 1, 0],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [0, 1, 1, 0],
              ],
            },
          ],
        },
      },
      {
        code: 'adj2 = adj @ adj\nwalks_1_to_4 = adj2[0, 3]',
        lineNotes: [
          {
            action:
              'Squares the adjacency matrix to combine two consecutive edges.',
            shape: '(4, 4) @ (4, 4) → adj2: (4, 4)',
            operation:
              'adj2[i,j] = Σₖ adj[i,k]adj[k,j]; k chooses the middle vertex.',
          },
          {
            action: 'Reads the count from vertex 1 to vertex 4.',
            shape: 'adj2[0, 3] → scalar',
            operation: '0·0 + 1·1 + 1·1 + 0·0 = 2, via vertices 2 and 3.',
          },
        ],
        title: 'Count two-step walks',
        explanation:
          'The selected entry adds the two middle-vertex choices: 1→2→4 and 1→3→4.',
        watchFor: 'The highlighted entry should be 2.',
        variables: [
          {
            name: 'walks_1_to_4',
            value: '2',
            meaning: 'Two walks of length two.',
          },
        ],
        after: {
          title: 'adj² counts the two routes',
          description:
            'Both highlighted branches start at 1 and arrive at 4 in two edges.',
          graph: activeGraph,
          matrices: [
            {
              label: 'adj²',
              values: [
                [2, 0, 0, 2],
                [0, 2, 2, 0],
                [0, 2, 2, 0],
                [2, 0, 0, 2],
              ],
              cellTones: toneCells([[0, 3]], 'result'),
            },
          ],
          callout: 'adj2[0,3] = 2: via vertex 2 or via vertex 3.',
        },
      },
    ],
  },
};
