import type { Metadata } from 'next';
import { ChapterSectionPage } from '@/components/chapter-section-page';
import { chapterSevenSections } from '@/lib/chapter-seven-data';
import { positiveDefiniteLab as section } from '@/lib/chapter-seven/positive-definite';

export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: section.number + ' ' + section.title + ' · KAIST MAS110',
  description: section.summary,
};

export default function PositiveDefiniteLabPage() {
  return (
    <ChapterSectionPage section={section} sections={chapterSevenSections} />
  );
}
