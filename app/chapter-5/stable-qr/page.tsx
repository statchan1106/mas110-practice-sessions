import type { Metadata } from 'next';
import { ChapterSectionPage } from '@/components/chapter-section-page';
import { chapterFiveSections } from '@/lib/chapter-five-data';
import { stableQrSection as section } from '@/lib/chapter-five/stable-qr';

export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: `${section.number} ${section.title} · KAIST MAS110`,
  description: section.summary,
};

export default function LabPage() {
  return (
    <ChapterSectionPage section={section} sections={chapterFiveSections} />
  );
}
