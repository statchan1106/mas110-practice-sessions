import { leastSquaresSection } from '@/lib/chapter-four/least-squares';

export const chapterFourSections = [leastSquaresSection];

export function getChapterFourSection(slug: string) {
  return chapterFourSections.find((section) => section.slug === slug);
}
