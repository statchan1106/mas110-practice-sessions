import { plainMathProse } from '@/lib/math-prose';
import type { Metadata } from 'next';
import { ChapterSectionPage } from '@/components/chapter-section-page';
import {
  chapterFourSections,
  getChapterFourSection,
} from '@/lib/chapter-four-data';
const section = getChapterFourSection('qr-decomposition')!;
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
export default function QRPage() {
  return (
    <ChapterSectionPage section={section} sections={chapterFourSections} />
  );
}
