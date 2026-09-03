import { blockMatricesGraphsSection } from '@/lib/chapter-two/block-matrices-graphs';
import { gaussianDetailSection } from '@/lib/chapter-two/gaussian-detail';
import { gaussianEliminationSection } from '@/lib/chapter-two/gaussian-elimination';
import { luDecompositionSection } from '@/lib/chapter-two/lu-decomposition';

export type { ChapterSection } from '@/lib/chapter-two/shared';

export const chapterTwoSections = [
  gaussianEliminationSection,
  blockMatricesGraphsSection,
  luDecompositionSection,
  gaussianDetailSection,
];

export function getChapterTwoSection(slug: string) {
  return chapterTwoSections.find((section) => section.slug === slug);
}
