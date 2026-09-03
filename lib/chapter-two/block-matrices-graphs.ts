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
          { action: 'Loads NumPy for arrays and block construction.' },
          { action: 'Creates the 2×2 upper-left block.' },
          { action: 'Creates the 2×1 upper-right block.' },
          { action: 'Creates the 1×2 lower-left block.' },
          { action: 'Creates the 1×1 lower-right block.' },
          { action: 'Joins the four compatible rectangles into X.' },
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
          { action: 'Creates a 3×2 matrix with the matching 2+1 row split.' },
          { action: 'Slices the top block row into E and F.' },
          { action: 'Slices the bottom block row into G and H.' },
          { action: 'Computes the ordinary full matrix product.' },
          { action: 'Computes the top output blocks from block products.' },
          { action: 'Computes the bottom output blocks and closes np.block.' },
          { action: 'Checks that the two calculations give the same entries.' },
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
          { action: 'Lists four undirected edges using zero-based indices.' },
          { action: 'Starts a 4×4 adjacency matrix filled with zeros.' },
          { action: 'Visits one edge at a time.' },
          { action: 'Records the connection from i to j.' },
          {
            action:
              'Records the reverse connection because the graph is undirected.',
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
          },
          { action: 'Reads the count from vertex 1 to vertex 4.' },
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
