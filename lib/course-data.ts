import { nonInvertibleNotebook } from '@/lib/chapter-three/non-invertible-system';

const repositoryBase = 'https://github.com/kyunghyuncho/Foundations_of_LADS';
const colabBase =
  'https://colab.research.google.com/github/kyunghyuncho/Foundations_of_LADS/blob/main';

export type NotebookStatus = 'interactive' | 'notebook' | 'optional';

export type ChapterAvailability = 'available' | 'preparing';

export type CourseChapter = {
  number: string;
  title: string;
  summary: string;
  sourceNotebooks: number;
  status: ChapterAvailability;
  href?: string;
};

export type CourseNotebook = {
  title: string;
  filename: string;
  githubUrl: string;
  colabUrl: string;
  status: NotebookStatus;
};

export type PrimerItem = {
  term: string;
  definition: string;
  relation: string;
  watchFor: string;
};

export type CourseGroup = {
  id: string;
  chapters: string;
  title: string;
  idea: string;
  primer: PrimerItem[];
  notebooks: CourseNotebook[];
};

export const courseChapters: CourseChapter[] = [
  {
    number: '02',
    title: 'Matrices and Gaussian Elimination',
    summary:
      'Matrix systems, elimination, block matrices, LU decomposition, and graph matrices.',
    sourceNotebooks: 4,
    status: 'available',
    href: '/chapter-2',
  },
  {
    number: '03',
    title: 'Vector Spaces and Transformations',
    summary:
      'Subspaces, null and column spaces, rank, bases, and linear transformations.',
    sourceNotebooks: 3,
    status: 'available',
    href: '/chapter-3',
  },
  {
    number: '04',
    title: 'Orthogonality and Approximation',
    summary:
      'Inner products, projections, Gram-Schmidt, QR, matrix norms, and least squares.',
    sourceNotebooks: 4,
    status: 'preparing',
  },
  {
    number: '05',
    title: 'Singular Value Decomposition',
    summary:
      'Singular directions, low-rank approximation, pseudoinverses, and numerical stability.',
    sourceNotebooks: 4,
    status: 'preparing',
  },
  {
    number: '06',
    title: 'SVD in Practice',
    summary:
      'Low-dimensional structure in images, MNIST digits, and financial time series.',
    sourceNotebooks: 3,
    status: 'preparing',
  },
  {
    number: '07',
    title: 'Positive Definite Matrices',
    summary:
      'Quadratic forms, Cholesky factorization, matrix square roots, and geometry.',
    sourceNotebooks: 2,
    status: 'preparing',
  },
  {
    number: '08',
    title: 'Determinants',
    summary: 'Determinants, geometric scaling, and matrix update identities.',
    sourceNotebooks: 1,
    status: 'preparing',
  },
  {
    number: '09',
    title: 'Eigenvalues and Diagonalization',
    summary:
      'Eigenpairs, similarity, change of basis, and spectral decomposition.',
    sourceNotebooks: 1,
    status: 'preparing',
  },
  {
    number: '10',
    title: 'Perron-Frobenius and PageRank',
    summary:
      'Positive eigenvectors, power iteration, PageRank, and eigenvalue adjustment.',
    sourceNotebooks: 2,
    status: 'preparing',
  },
  {
    number: '11',
    title: 'Jordan Form',
    summary:
      'Canonical matrix structure when diagonalization alone is not enough.',
    sourceNotebooks: 1,
    status: 'preparing',
  },
];

function notebook(
  title: string,
  filename: string,
  status: NotebookStatus = 'notebook',
): CourseNotebook {
  const encodedFilename = encodeURIComponent(filename);
  return {
    title,
    filename,
    status,
    githubUrl: `${repositoryBase}/blob/main/${encodedFilename}`,
    colabUrl: `${colabBase}/${encodedFilename}`,
  };
}

export const gaussianPrimer: PrimerItem[] = [
  {
    term: 'Augmented matrix',
    definition:
      'It stores a linear system’s coefficients and right-hand side; each row represents one equation.',
    relation: '[ A | b ]',
    watchFor: 'The vertical divider separates coefficients from constants.',
  },
  {
    term: 'Pivot and target',
    definition:
      'The pivot is the nonzero anchor; the target is the entry in its column that we want to turn into zero.',
    relation: 'pivot → target',
    watchFor: 'The blue source stays fixed while the amber target row changes.',
  },
  {
    term: 'Elimination factor',
    definition:
      'Choose the multiplier that makes target − factor × pivot equal exactly zero.',
    relation: 'm = target / pivot',
    watchFor: 'The two contributions cancel in the highlighted column.',
  },
  {
    term: 'Row equivalence',
    definition:
      'Subtracting a multiple of one row from another rewrites the equations without changing their solutions.',
    relation: 'Rᵢ ← Rᵢ − mRⱼ',
    watchFor: 'Only the target row changes; the solution set does not.',
  },
];

export const courseGroups: CourseGroup[] = [
  {
    id: 'systems-elimination',
    chapters: 'Chapter 2',
    title: 'Systems and elimination',
    idea: 'Turn a coupled system into a sequence of simpler equations while preserving its solutions.',
    primer: gaussianPrimer.slice(1),
    notebooks: [
      notebook(
        'Matrices and Gaussian Elimination',
        'Ch2-1 Gaussian Elimination.ipynb',
        'interactive',
      ),
      notebook(
        'Block Matrices and Graphs',
        'Ch2-2 Block Matrices & Graphs.ipynb',
      ),
      notebook('LU-Decomposition', 'Ch2-3 Test LU-Decomposition.ipynb'),
      notebook(
        'Gaussian Elimination in Detail',
        'Ch2-4 Gaussian elimination in detail (Optional).ipynb',
        'optional',
      ),
    ],
  },
  {
    id: 'spaces-transformations',
    chapters: 'Chapter 3',
    title: 'Spaces and transformations',
    idea: 'Read a matrix as a map: what it keeps, what it removes, and when an inverse cannot exist.',
    primer: [
      {
        term: 'Null space',
        definition: 'All input vectors sent to zero by a matrix.',
        relation: 'Ax = 0',
        watchFor: 'Different inputs can collapse onto the same output.',
      },
      {
        term: 'Linear map',
        definition:
          'A rule that preserves vector addition and scalar multiplication.',
        relation: 'A(cx + y) = cAx + Ay',
        watchFor: 'Grid lines remain straight and parallel.',
      },
      {
        term: 'Rank deficiency',
        definition:
          'For A ∈ ℝᵐˣⁿ, rank below min(m,n) is rank deficiency. Dependent columns mean r < n; missing output directions mean r < m.',
        relation: 'r = rank(A) < min(m,n)',
        watchFor: 'A plane may collapse to a line or point.',
      },
    ],
    notebooks: [
      notebook('Finding Null Space', 'Ch3-1 Null Space.ipynb'),
      notebook(
        'Interpretable Linear Transformations',
        'Ch3-2 Interpretable Linear Transformations.ipynb',
      ),
      {
        ...nonInvertibleNotebook,
        title: 'Solving a Non-invertible Linear System · Lecture 3',
        status: 'interactive',
      },
    ],
  },
  {
    id: 'geometry-approximation',
    chapters: 'Chapter 4',
    title: 'Geometry and approximation',
    idea: 'Use angles, orthogonality, and projection to find the closest answer when an exact one is unavailable.',
    primer: [
      {
        term: 'Inner product',
        definition:
          'A number that measures alignment and induces length and angle.',
        relation: '⟨x, y⟩ = xᵀy',
        watchFor: 'A zero inner product signals orthogonality.',
      },
      {
        term: 'Orthogonal basis',
        definition:
          'Independent directions that do not interfere with one another.',
        relation: 'QᵀQ = I',
        watchFor: 'Coordinates separate into independent contributions.',
      },
      {
        term: 'Least squares',
        definition:
          'The solution whose residual has the smallest Euclidean length.',
        relation: 'Aᵀ(Ax − b) = 0',
        watchFor: 'The residual becomes perpendicular to the column space.',
      },
    ],
    notebooks: [
      notebook(
        'Inner Products in the Euclidean Vector Spaces',
        'Ch4-1 Inner Products in Euclidean Vector Spaces.ipynb',
      ),
      notebook(
        'Vector Spaces of Polynomials',
        'Ch4-2 Vectors Space of Polynomials.ipynb',
      ),
      notebook('QR-Decomposition', 'Ch4-3 QR-Decomposition.ipynb'),
      notebook('Least Squares', 'Ch4-4 Least Squares.ipynb'),
    ],
  },
  {
    id: 'svd-numerics',
    chapters: 'Chapter 5',
    title: 'SVD and numerical methods',
    idea: 'Separate directions from scales, then keep the structure that matters most.',
    primer: [
      {
        term: 'Singular directions',
        definition: 'Special input and output directions aligned by a matrix.',
        relation: 'A = UΣVᵀ',
        watchFor: 'Rotate, scale, then rotate again.',
      },
      {
        term: 'Projection',
        definition: 'The closest point in a chosen subspace.',
        relation: 'P = QQᵀ',
        watchFor: 'The discarded component is perpendicular to the subspace.',
      },
      {
        term: 'Numerical stability',
        definition:
          'A method is stable when small round-off errors stay controlled.',
        relation: 'computed ≈ exact nearby problem',
        watchFor:
          'Equivalent formulas can behave differently in floating point.',
      },
    ],
    notebooks: [
      notebook('SVD — Basic Properties', 'Ch5-1 SVD-Basic Properties.ipynb'),
      notebook('SVD and Projections', 'Ch5-2 SVD and Projections.ipynb'),
      notebook(
        'Numerically Stable QR-Decomposition',
        'Ch5-3 Numerically Stable QR-Decomposition.ipynb',
      ),
      notebook(
        'Test of Linear Independence',
        'Ch5-4 Test of Linear Independence.ipynb',
      ),
    ],
  },
  {
    id: 'data-applications',
    chapters: 'Chapter 6',
    title: 'Data applications',
    idea: 'Recognize matrices inside images, handwritten digits, and financial curves—and expose their low-dimensional structure.',
    primer: [
      {
        term: 'Matrix as data',
        definition:
          'Rows and columns can encode pixels, samples, features, or time points.',
        relation: 'data → matrix',
        watchFor: 'Meaning depends on what each axis represents.',
      },
      {
        term: 'Low-rank structure',
        definition:
          'A few directions explain most of the observable variation.',
        relation: 'A ≈ UₖΣₖVₖᵀ',
        watchFor: 'Compress while preserving the dominant pattern.',
      },
      {
        term: 'Latent factor',
        definition:
          'A hidden direction that coordinates many observed variables.',
        relation: 'observation ≈ factors × loadings',
        watchFor: 'Many columns move together through one factor.',
      },
    ],
    notebooks: [
      notebook('Mona Lisa', 'Ch6-1 Mona Lisa.ipynb'),
      notebook('MNIST', 'Ch6-2 MNIST.ipynb'),
      notebook('Analysis of Yield Curves', 'Ch6-3 Yield Curves.ipynb'),
    ],
  },
  {
    id: 'spectral-methods',
    chapters: 'Chapters 7–11',
    title: 'Spectral methods',
    idea: 'Understand a transformation through its invariant directions, scaling factors, and canonical forms.',
    primer: [
      {
        term: 'Eigenpair',
        definition: 'A direction that a matrix scales without turning.',
        relation: 'Av = λv',
        watchFor: 'The vector keeps its line while its length or sign changes.',
      },
      {
        term: 'Positive definite',
        definition:
          'A symmetric matrix whose quadratic energy is positive in every nonzero direction.',
        relation: 'xᵀAx > 0',
        watchFor: 'Every principal curvature points upward.',
      },
      {
        term: 'Canonical form',
        definition:
          'A simpler representation that exposes the transformation’s essential structure.',
        relation: 'A = SJS⁻¹',
        watchFor: 'Coupled behavior separates into invariant blocks.',
      },
    ],
    notebooks: [
      notebook(
        'Positive Definite Matrices',
        'Ch7-1 Positive Definite Matrices.ipynb',
      ),
      notebook('Symmetric Eigenvalues', 'Ch7-2 Symmetric Eigenvalues.ipynb'),
      notebook('Determinant', 'Ch8 Determinant.ipynb'),
      notebook('Eigenvalues', 'Ch9 Eigenvalues.ipynb'),
      notebook('Perron–Frobenius', 'Ch10-1 Perron-Frobenius.ipynb'),
      notebook('Eigenvalue Adjustment', 'Ch10-2 Eigenvalue Adjustment.ipynb'),
      notebook('Jordan Form', 'Ch11 Jordan Form.ipynb'),
    ],
  },
];

export const courseNotebookCount = courseGroups.reduce(
  (count, group) => count + group.notebooks.length,
  0,
);
export { repositoryBase };
