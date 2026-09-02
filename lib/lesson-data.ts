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
  title: '가우스 소거를 한 줄씩 실행하기',
  eyebrow: 'Chapter 2 · Interactive lab',
  sourceUrl:
    'https://github.com/kyunghyuncho/Foundations_of_LADS/blob/main/Ch2-1%20Gaussian%20Elimination.ipynb',
  colabUrl:
    'https://colab.research.google.com/github/kyunghyuncho/Foundations_of_LADS/blob/main/Ch2-1%20Gaussian%20Elimination.ipynb',
  steps: [
    {
      label: '첫 번째 pivot 아래 지우기',
      shortLabel: 'R₂의 x₁ 제거',
      matrix: [
        [1, 2, -1, 3],
        [2, -1, 1, 0],
        [-1, 1, 2, 4],
      ],
      pivotRow: 0,
      targetRow: 1,
      pivotColumn: 0,
      code: 'factor = aug[1, 0] / aug[0, 0]\naug[1] = aug[1] - factor * aug[0]',
      prompt: 'factor의 값은 얼마일까요?',
      choices: ['0.5', '2', '-2'],
      answer: '2',
      operation: 'R₂ ← R₂ − 2R₁',
      meaning: '두 번째 행에서 첫 번째 행의 2배를 빼면 첫 열의 2가 0이 됩니다. 방정식의 해는 바뀌지 않습니다.',
      completion: 'R₂의 첫 번째 원소가 0이 되었습니다.',
    },
    {
      label: '첫 번째 pivot 아래 마저 지우기',
      shortLabel: 'R₃의 x₁ 제거',
      matrix: [
        [1, 2, -1, 3],
        [0, -5, 3, -6],
        [-1, 1, 2, 4],
      ],
      pivotRow: 0,
      targetRow: 2,
      pivotColumn: 0,
      code: 'factor = aug[2, 0] / aug[0, 0]\naug[2] = aug[2] - factor * aug[0]',
      prompt: '이번 factor의 값은 얼마일까요?',
      choices: ['1', '-1', '-0.5'],
      answer: '-1',
      operation: 'R₃ ← R₃ + R₁',
      meaning: 'factor가 −1이므로 −factor·R₁은 +R₁입니다. 세 번째 행의 −1과 첫 번째 행의 1이 만나 0이 됩니다.',
      completion: '첫 번째 열의 pivot 아래가 모두 0이 되었습니다.',
    },
    {
      label: '두 번째 pivot 아래 지우기',
      shortLabel: 'R₃의 x₂ 제거',
      matrix: [
        [1, 2, -1, 3],
        [0, -5, 3, -6],
        [0, 3, 1, 7],
      ],
      pivotRow: 1,
      targetRow: 2,
      pivotColumn: 1,
      code: 'factor = aug[2, 1] / aug[1, 1]\naug[2] = aug[2] - factor * aug[1]',
      prompt: 'factor = 3 / (−5)의 값은?',
      choices: ['0.6', '-0.6', '-1.67'],
      answer: '-0.6',
      operation: 'R₃ ← R₃ + 0.6R₂',
      meaning: '세 번째 행의 3에 두 번째 행의 −5를 0.6배해 더합니다. 3 + 0.6×(−5) = 0입니다.',
      completion: '상삼각행렬이 완성되었습니다.',
    },
    {
      label: '소거 완료',
      shortLabel: '역대입 준비',
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
      meaning: '아래쪽 원소가 모두 0이므로 마지막 방정식부터 x₃, x₂, x₁ 순서로 역대입할 수 있습니다.',
      completion: '이제 역대입으로 해를 구할 수 있습니다.',
    },
  ],
};

export const roadmap = [
  {
    week: '01',
    title: 'Gaussian elimination',
    description: 'pivot과 행 연산을 코드의 인덱스에 연결합니다.',
    active: true,
  },
  {
    week: '02',
    title: 'Block matrices',
    description: '큰 행렬을 블록으로 나누고 곱셈 구조를 관찰합니다.',
    active: false,
  },
  {
    week: '03',
    title: 'Linear transformations',
    description: '벡터를 움직이며 행렬이 공간에 하는 일을 확인합니다.',
    active: false,
  },
  {
    week: '04',
    title: 'SVD & projections',
    description: '회전, 크기 조절, 투영을 단계별로 분리합니다.',
    active: false,
  },
];
