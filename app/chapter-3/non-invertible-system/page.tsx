import type { Metadata } from 'next';

import { ChapterSectionPage } from '@/components/chapter-section-page';
import {
  chapterThreeSections,
  getChapterThreeSection,
} from '@/lib/chapter-three-data';

const section = getChapterThreeSection('non-invertible-system')!;

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `${section.number} ${section.title} · KAIST MAS110`,
  description: section.summary,
  openGraph: { title: section.title, description: section.summary, images: [] },
  twitter: { title: section.title, description: section.summary, images: [] },
};

export default function NonInvertibleSystemPage() {
  return (
    <ChapterSectionPage section={section} sections={chapterThreeSections} />
  );
}
