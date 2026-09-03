import type {
  CellTone,
  CodeWalkthroughData,
} from '@/components/code-walkthrough';
import type { PrimerItem } from '@/lib/course-data';

const githubBase =
  'https://github.com/kyunghyuncho/Foundations_of_LADS/blob/main';
const colabBase =
  'https://colab.research.google.com/github/kyunghyuncho/Foundations_of_LADS/blob/main';

export type ChapterSection = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  summary: string;
  focus: string;
  learningGoal: string;
  lectureConcepts: string[];
  codeExtension?: string;
  filename: string;
  githubUrl: string;
  colabUrl: string;
  optional?: boolean;
  primer: PrimerItem[];
  walkthrough: CodeWalkthroughData;
};

export function sourceLinks(filename: string) {
  const encoded = encodeURIComponent(filename);
  return {
    githubUrl: githubBase + '/' + encoded,
    colabUrl: colabBase + '/' + encoded,
  };
}

export function toneCells(
  coordinates: Array<[number, number]>,
  tone: CellTone,
) {
  return Object.fromEntries(
    coordinates.map(([row, column]) => [
      String(row) + '-' + String(column),
      tone,
    ]),
  );
}

export function toneRow(row: number, width: number, tone: CellTone) {
  return toneCells(
    Array.from({ length: width }, (_, column) => [row, column]),
    tone,
  );
}

export function toneBlock(
  rowStart: number,
  rowEnd: number,
  columnStart: number,
  columnEnd: number,
  tone: CellTone,
) {
  const coordinates: Array<[number, number]> = [];
  for (let row = rowStart; row < rowEnd; row += 1) {
    for (let column = columnStart; column < columnEnd; column += 1)
      coordinates.push([row, column]);
  }
  return toneCells(coordinates, tone);
}
