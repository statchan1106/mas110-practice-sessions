import type { Metadata } from 'next';
import './globals.css';

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  'https://lads-linear-algebra-lab.statchan1106.chatgpt.site'
).replace(/\/$/, '');

export const dynamic = 'force-static';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'KAIST MAS110 Practice Sessions',
  description:
    'The course-wide project page for KAIST MAS110 practice materials, guided code traces, and Colab notebooks.',
  openGraph: {
    title: 'KAIST MAS110 Practice Sessions',
    description:
      'Review lecture ideas, trace Python line by line, and connect each code operation to a visible mathematical change.',
    images: [
      {
        url: `${siteUrl}/og-mas110.png`,
        width: 1730,
        height: 909,
        alt: 'An augmented matrix before and after one Gaussian elimination step.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KAIST MAS110 Practice Sessions',
    description:
      'A course-wide project page for visual code walkthroughs in Linear Algebra for Data Science.',
    images: [`${siteUrl}/og-mas110.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
