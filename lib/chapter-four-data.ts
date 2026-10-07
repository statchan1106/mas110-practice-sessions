import { leastSquaresSection } from '@/lib/chapter-four/least-squares';
import { innerProductsSection } from '@/lib/chapter-four/inner-products';
import { polynomialsSection } from '@/lib/chapter-four/polynomials';
import { qrSection } from '@/lib/chapter-four/qr-decomposition';

export const chapterFourSections = [
  innerProductsSection,
  polynomialsSection,
  qrSection,
  leastSquaresSection,
];

export function getChapterFourSection(slug: string) {
  return chapterFourSections.find((section) => section.slug === slug);
}
