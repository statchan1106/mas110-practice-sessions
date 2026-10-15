import { plainMathProse } from '@/lib/math-prose';
import type { Metadata } from 'next';

import { ChapterSectionPage } from '@/components/chapter-section-page';
import {
  chapterThreeSections,
  getChapterThreeSection,
} from '@/lib/chapter-three-data';

const section = getChapterThreeSection('null-space')!;

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `${section.number} ${plainMathProse(section.title)} · KAIST MAS110`,
  description: plainMathProse(section.summary),
  openGraph: {
    title: plainMathProse(section.title),
    description: plainMathProse(section.summary),
    images: [],
  },
  twitter: {
    title: plainMathProse(section.title),
    description: plainMathProse(section.summary),
    images: [],
  },
};

export default function NullSpacePage() {
  return (
    <ChapterSectionPage section={section} sections={chapterThreeSections} />
  );
}
