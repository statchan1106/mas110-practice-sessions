export type LessonStep = {
  label: string;
  shortLabel: string;
  matrix: number[][];
  pivotRow: number | null;
  targetRow: number | null;
  pivotColumn: number | null;
  code: string;
  prompt: string;
  choices: string[];
  answer: string;
  operation: string;
  meaning: string;
  completion: string;
};

export type Lesson = {
  title: string;
  eyebrow: string;
  sourceUrl: string;
  colabUrl: string;
  steps: LessonStep[];
};

export const gaussianLesson: Lesson = {
  title: 'Gaussian elimination, one visible step at a time',
  eyebrow: 'Chapter 2.1 · Interactive walkthrough',
  sourceUrl:
    'https://github.com/kyunghyuncho/Foundations_of_LADS/blob/main/Ch2-1%20Gaussian%20Elimination.ipynb',
  colabUrl:
    'https://colab.research.google.com/github/kyunghyuncho/Foundations_of_LADS/blob/main/Ch2-1%20Gaussian%20Elimination.ipynb',
  steps: [
    {
      label: 'Cancel the first entry in R₂',
      shortLabel: 'Cancel R₂,₁',
      matrix: [
        [1, 2, -1, 3],
        [2, -1, 1, 0],
        [-1, 1, 2, 4],
      ],
      pivotRow: 0,
      targetRow: 1,
      pivotColumn: 0,
      code: 'factor = aug[1, 0] / aug[0, 0]\naug[1] = aug[1] - factor * aug[0]',
      prompt: 'Which factor makes the first entry of R₂ become zero?',
      choices: ['0.5', '2', '-2'],
      answer: '2',
      operation: 'R₂ ← R₂ − 2R₁',
      meaning: 'Subtracting twice the pivot row cancels the 2 in R₂. This changes the equation’s form, but not its solution set.',
      completion: 'The first entry of R₂ is now zero.',
    },
    {
      label: 'Cancel the first entry in R₃',
      shortLabel: 'Cancel R₃,₁',
      matrix: [
        [1, 2, -1, 3],
        [0, -5, 3, -6],
        [-1, 1, 2, 4],
      ],
      pivotRow: 0,
      targetRow: 2,
      pivotColumn: 0,
      code: 'factor = aug[2, 0] / aug[0, 0]\naug[2] = aug[2] - factor * aug[0]',
      prompt: 'Which factor cancels −1 using the pivot 1?',
      choices: ['1', '-1', '-0.5'],
      answer: '-1',
      operation: 'R₃ ← R₃ + R₁',
      meaning: 'Because the factor is −1, subtracting factor·R₁ means adding R₁. The −1 and 1 cancel to zero.',
      completion: 'Everything below the first pivot is now zero.',
    },
    {
      label: 'Cancel the second entry in R₃',
      shortLabel: 'Cancel R₃,₂',
      matrix: [
        [1, 2, -1, 3],
        [0, -5, 3, -6],
        [0, 3, 1, 7],
      ],
      pivotRow: 1,
      targetRow: 2,
      pivotColumn: 1,
      code: 'factor = aug[2, 1] / aug[1, 1]\naug[2] = aug[2] - factor * aug[1]',
      prompt: 'What is factor = 3 ÷ (−5)?',
      choices: ['0.6', '-0.6', '-1.67'],
      answer: '-0.6',
      operation: 'R₃ ← R₃ + 0.6R₂',
      meaning: 'Adding 0.6 times R₂ to R₃ cancels the 3: 3 + 0.6 × (−5) = 0.',
      completion: 'The matrix is now upper triangular.',
    },
    {
      label: 'Elimination complete',
      shortLabel: 'Back-substitute',
      matrix: [
        [1, 2, -1, 3],
        [0, -5, 3, -6],
        [0, 0, 2.8, 3.4],
      ],
      pivotRow: null,
      targetRow: null,
      pivotColumn: null,
      code: '# elimination complete\n# next: back substitution',
      prompt: '',
      choices: [],
      answer: '',
      operation: 'Upper triangular form',
      meaning: 'Every entry below the diagonal is zero, so we can solve from the last equation upward: x₃, then x₂, then x₁.',
      completion: 'The system is ready for back substitution.',
    },
  ],
};

export const roadmap = [
  {
    week: '01',
    title: 'Gaussian elimination',
    description: 'Connect pivots, row operations, and NumPy indices.',
    active: true,
  },
  {
    week: '02',
    title: 'Block matrices & graphs',
    description: 'See how block structure organizes larger systems.',
    active: false,
  },
  {
    week: '03',
    title: 'Null space & transformations',
    description: 'Move vectors and inspect what a matrix preserves or removes.',
    active: false,
  },
  {
    week: '04',
    title: 'Inner products & least squares',
    description: 'Build projection and approximation from geometric ideas.',
    active: false,
  },
];
