import { linearTransformationsSection } from '@/lib/chapter-three/linear-transformations';
import { nonInvertibleSystemSection } from '@/lib/chapter-three/non-invertible-system';
import { nullSpaceSection } from '@/lib/chapter-three/null-space';

export type { ChapterSection } from '@/lib/chapter/shared';

export const chapterThreeSections = [
  nullSpaceSection,
  linearTransformationsSection,
  nonInvertibleSystemSection,
];

export function getChapterThreeSection(slug: string) {
  return chapterThreeSections.find((section) => section.slug === slug);
}
