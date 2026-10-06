import type { Metadata } from 'next';
import { ChapterSectionPage } from '@/components/chapter-section-page';
import {
  chapterFourSections,
  getChapterFourSection,
} from '@/lib/chapter-four-data';

const section = getChapterFourSection('least-squares')!;
export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: `${section.number} ${section.title} · KAIST MAS110`,
  description: section.summary,
  openGraph: { title: section.title, description: section.summary, images: [] },
  twitter: { title: section.title, description: section.summary, images: [] },
};

export default function LeastSquaresPage() {
  return (
    <ChapterSectionPage section={section} sections={chapterFourSections} />
  );
}
