import type { Metadata } from 'next';

import { ChapterSectionPage } from '@/components/chapter-section-page';
import { getChapterTwoSection } from '@/lib/chapter-two-data';

const section = getChapterTwoSection('gaussian-detail')!;

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `${section.number} ${section.title} · KAIST MAS110`,
  description: section.summary,
  openGraph: { title: section.title, description: section.summary, images: [] },
  twitter: { title: section.title, description: section.summary, images: [] },
};

export default function GaussianDetailPage() {
  return <ChapterSectionPage section={section} />;
}
