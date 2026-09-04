import type { Metadata } from 'next';

import { ChapterSectionPage } from '@/components/chapter-section-page';
import {
  chapterTwoSections,
  getChapterTwoSection,
} from '@/lib/chapter-two-data';

const section = getChapterTwoSection('lu-decomposition')!;

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `${section.number} ${section.title} · KAIST MAS110`,
  description: section.summary,
  openGraph: { title: section.title, description: section.summary, images: [] },
  twitter: { title: section.title, description: section.summary, images: [] },
};

export default function LuDecompositionPage() {
  return <ChapterSectionPage section={section} sections={chapterTwoSections} />;
}
